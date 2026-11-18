import "server-only";
import { createHash } from "node:crypto";
import { DeleteObjectCommand, HeadBucketCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ASSET_PUBLIC_ORIGIN, MEDIA_OWNER, mediaKeyPattern } from "@/lib/media";
import { optionalServerEnv } from "@/server/env";
import { MediaError, ObjectCollisionError } from "./errors";

export function r2Configuration() {
  const names = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME", "R2_PUBLIC_BASE_URL"] as const;
  const missing = names.filter((name) => !optionalServerEnv(name));
  if (missing.length) throw new MediaError(`Image storage is not configured. Set ${missing.join(", ")} on the server.`, 503);
  const accountId = optionalServerEnv("R2_ACCOUNT_ID")!;
  const bucket = optionalServerEnv("R2_BUCKET_NAME")!;
  if (!/^[a-f0-9]{32}$/i.test(accountId)) throw new MediaError("Image storage configuration is invalid: R2_ACCOUNT_ID.", 503);
  if (!/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(bucket)) throw new MediaError("Image storage configuration is invalid: R2_BUCKET_NAME.", 503);
  let publicBase: string;
  try {
    const url = new URL(optionalServerEnv("R2_PUBLIC_BASE_URL")!);
    if (url.origin !== ASSET_PUBLIC_ORIGIN || url.username || url.password || url.search || url.hash || url.pathname !== "/") throw new Error();
    publicBase = url.origin;
  } catch { throw new MediaError(`Image storage configuration is invalid: R2_PUBLIC_BASE_URL must use ${ASSET_PUBLIC_ORIGIN}.`, 503); }
  return { bucket, publicBase, accountId, accessKeyId: optionalServerEnv("R2_ACCESS_KEY_ID")!, secretAccessKey: optionalServerEnv("R2_SECRET_ACCESS_KEY")! };
}

function connection() {
  const config = r2Configuration();
  const client = new S3Client({
    region: "auto", endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    // A retry after a lost response could turn a successful conditional put into a collision.
    maxAttempts: 1, requestChecksumCalculation: "WHEN_REQUIRED", responseChecksumValidation: "WHEN_REQUIRED",
  });
  return { client, config };
}

export interface StoredObject { id: string; objectKey: string; sha256: string; byteSize: number; etag: string | null }

/** Read-only deployment preflight; no objects or credentials are returned. */
export async function checkImageStorageConnection(): Promise<void> {
  const { client, config } = connection();
  try { await client.send(new HeadBucketCommand({ Bucket: config.bucket }), { abortSignal: AbortSignal.timeout(10_000) }); }
  catch { throw new MediaError("Image storage connectivity could not be verified. Check the configured bucket and token permissions.", 503); }
  finally { client.destroy(); }
}

function assertKey(asset: Pick<StoredObject, "id" | "objectKey">) {
  if (asset.objectKey.match(mediaKeyPattern)?.[1] !== asset.id) throw new MediaError("The image does not have a managed storage identity.", 409);
}
function statusOf(error: unknown) {
  return error && typeof error === "object" && "$metadata" in error ? (error.$metadata as { httpStatusCode?: number })?.httpStatusCode : undefined;
}

export async function putImageObject(asset: StoredObject, body: Buffer): Promise<string | null> {
  assertKey(asset);
  const { client, config } = connection();
  try {
    const result = await client.send(new PutObjectCommand({
      Bucket: config.bucket, Key: asset.objectKey, Body: body, ContentType: "image/webp", ContentLength: body.length,
      ContentMD5: createHash("md5").update(body).digest("base64"), IfNoneMatch: "*",
      CacheControl: "public, max-age=31536000, immutable",
      Metadata: { owner: MEDIA_OWNER, "asset-id": asset.id, sha256: asset.sha256 },
    }), { abortSignal: AbortSignal.timeout(20_000) });
    return result.ETag ?? null;
  } catch (error) {
    if (statusOf(error) === 412) throw new ObjectCollisionError();
    throw new MediaError("Image upload could not complete. Check the R2 connection and bucket permissions, then try again. Any interrupted upload is tracked for cleanup.", 503);
  } finally { client.destroy(); }
}

/** Only ledger-owned, immutable keys are eligible; never enumerate or accept bucket paths. */
export async function deleteImageObject(asset: StoredObject): Promise<void> {
  assertKey(asset);
  const { client, config } = connection();
  // HEAD and DELETE share a deadline; slow storage cannot double the budget.
  const abortSignal = AbortSignal.timeout(20_000);
  try {
    let head;
    try { head = await client.send(new HeadObjectCommand({ Bucket: config.bucket, Key: asset.objectKey }), { abortSignal }); }
    catch (error) { if (statusOf(error) === 404) return; throw error; }
    if (head.Metadata?.owner !== MEDIA_OWNER || head.Metadata?.["asset-id"] !== asset.id || head.Metadata?.sha256 !== asset.sha256
      || head.ContentType !== "image/webp" || head.ContentLength !== asset.byteSize || (asset.etag && head.ETag !== asset.etag)) {
      throw new MediaError("Image cleanup is paused because object ownership could not be verified.", 409);
    }
    await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: asset.objectKey }), { abortSignal });
  } catch (error) {
    if (error instanceof MediaError) throw error;
    throw new MediaError("Image cleanup could not complete. Check the R2 connection and bucket permissions, then retry cleanup.", 503);
  } finally { client.destroy(); }
}
