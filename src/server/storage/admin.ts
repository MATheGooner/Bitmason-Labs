import "server-only";
import { randomUUID } from "node:crypto";
import { and, asc, eq, inArray, lte, ne, or } from "drizzle-orm";
import { z } from "zod";
import { MEDIA_KEY_PREFIX, MEDIA_OWNER } from "@/lib/media";
import type { ImageCleanupResult, UploadedImage } from "@/lib/media";
import { requireAdmin } from "@/server/auth/authorization";
import { publicDatabase, withWriteDatabase } from "@/server/db/client";
import { mediaAssets, projects } from "@/server/db/schema";
import { deleteImageObject, putImageObject, r2Configuration } from "./client";
import { prepareImage } from "./image";
import { MediaError, ObjectCollisionError } from "./errors";
import { referencedAssetIds, retireScopeUploads } from "./references";

const editingScope = z.object({ scopeId: z.uuid(), projectId: z.uuid().optional() });
const INTERRUPTED_UPLOAD_DELAY = 15 * 60_000;
const PENDING_UPLOAD_LIFETIME = 24 * 60 * 60_000;
export type EditingScope = z.infer<typeof editingScope>;
function parseScope(input: unknown) {
  const result = editingScope.safeParse(input);
  if (!result.success) throw new MediaError("The editing session is invalid. Reload the editor before uploading.");
  return result.data;
}

export async function uploadAdminImage(file: File, input: unknown): Promise<UploadedImage> {
  await requireAdmin();
  const scope = parseScope(input);
  const { publicBase } = r2Configuration();
  const prepared = await prepareImage(file);
  const asset = { id: randomUUID(), objectKey: "", scopeId: scope.scopeId, projectId: scope.projectId ?? null, createdBy: MEDIA_OWNER,
    state: "uploading" as const, mimeType: prepared.mimeType, byteSize: prepared.byteSize, width: prepared.width, height: prepared.height,
    sha256: prepared.sha256, etag: null, cleanupAfter: new Date(Date.now() + INTERRUPTED_UPLOAD_DELAY) };
  asset.objectKey = `${MEDIA_KEY_PREFIX}${asset.id}.webp`;
  // Reserve ownership before sending any bytes to R2.
  await withWriteDatabase((db) => db.transaction(async (tx) => {
    if (scope.projectId && !(await tx.select({ id: projects.id }).from(projects).where(eq(projects.id, scope.projectId)))[0]) throw new MediaError("The project was deleted. Return to the project list.", 409);
    await tx.insert(mediaAssets).values(asset);
  }));
  try {
    const etag = await putImageObject(asset, prepared.body);
    await withWriteDatabase(async (db) => {
      const [ready] = await db.update(mediaAssets).set({ state: "ready", etag, cleanupAfter: new Date(Date.now() + PENDING_UPLOAD_LIFETIME) })
        .where(and(eq(mediaAssets.id, asset.id), eq(mediaAssets.state, "uploading"))).returning({ id: mediaAssets.id });
      if (!ready) throw new MediaError("The upload session expired. Upload this image again.", 409);
    });
    return { assetId: asset.id, src: `${publicBase}/${asset.objectKey}`, width: prepared.width, height: prepared.height, byteSize: prepared.byteSize, mimeType: prepared.mimeType };
  } catch (error) {
    try {
      await withWriteDatabase(async (db) => {
        if (error instanceof ObjectCollisionError) {
          // A conditional collision never grants ownership of an existing object.
          await db.delete(mediaAssets).where(and(eq(mediaAssets.id, asset.id), eq(mediaAssets.state, "uploading")));
        } else {
          await db.update(mediaAssets).set({ state: "deleting", cleanupAfter: new Date(Date.now() + INTERRUPTED_UPLOAD_DELAY), lastError: "Interrupted upload; cleanup retained." })
            .where(and(eq(mediaAssets.id, asset.id), inArray(mediaAssets.state, ["uploading", "ready"])));
        }
      });
    } catch { console.error("Image upload cleanup reservation retained for retry."); }
    if (error instanceof MediaError) throw error;
    throw new MediaError("The image could not be saved. Retry the upload; any interrupted object is tracked for cleanup.", 503);
  }
}

/** Queued/expired objects only. Attached references are checked again under a row lock. */
export async function cleanupAdminImages(onlyIds?: string[]): Promise<ImageCleanupResult> {
  await requireAdmin();
  const deadline = Date.now() + 30_000;
  if (onlyIds && (!onlyIds.length || onlyIds.some((id) => !z.uuid().safeParse(id).success))) return { removed: 0, pending: 0, errors: 0 };
  const candidates = await publicDatabase().select({ id: mediaAssets.id }).from(mediaAssets)
    .where(and(eq(mediaAssets.createdBy, MEDIA_OWNER), ne(mediaAssets.state, "attached"), lte(mediaAssets.cleanupAfter, new Date()), onlyIds ? inArray(mediaAssets.id, onlyIds) : undefined))
    .orderBy(asc(mediaAssets.cleanupAfter), asc(mediaAssets.id)).limit(30);
  const result: ImageCleanupResult = { removed: 0, pending: 0, errors: 0 };
  for (const { id } of candidates) {
    // Finish the current object safely, then leave remaining candidates for retry.
    if (Date.now() >= deadline) break;
    try {
      const asset = await withWriteDatabase((db) => db.transaction(async (tx) => {
        const [row] = await tx.select().from(mediaAssets).where(eq(mediaAssets.id, id)).for("update");
        if (!row || row.state === "attached" || !row.cleanupAfter || row.cleanupAfter.getTime() > Date.now()) return null;
        if ((await referencedAssetIds(tx, [id])).size) throw new MediaError("A referenced image is protected from cleanup.", 409);
        await tx.update(mediaAssets).set({ state: "deleting" }).where(eq(mediaAssets.id, id));
        return row;
      }));
      if (!asset) continue;
      // 'deleting' assets cannot be claimed by a project while this network call runs.
      await deleteImageObject(asset);
      await withWriteDatabase((db) => db.transaction(async (tx) => {
        const [row] = await tx.select().from(mediaAssets).where(eq(mediaAssets.id, id)).for("update");
        if (row?.state === "deleting" && !(await referencedAssetIds(tx, [id])).size) await tx.delete(mediaAssets).where(eq(mediaAssets.id, id));
      }));
      result.removed++;
    } catch {
      result.errors++;
      try { await withWriteDatabase((db) => db.update(mediaAssets).set({ lastError: "Image cleanup failed; retry required." }).where(eq(mediaAssets.id, id))); }
      catch { console.error("Image cleanup status could not be saved; reservation retained."); }
    }
  }
  const pending = await publicDatabase().select({ id: mediaAssets.id }).from(mediaAssets)
    .where(and(eq(mediaAssets.createdBy, MEDIA_OWNER), ne(mediaAssets.state, "attached"), or(eq(mediaAssets.state, "deleting"), lte(mediaAssets.cleanupAfter, new Date()))));
  result.pending = pending.length;
  return result;
}

export async function discardAdminImage(id: string, input: unknown) {
  await requireAdmin();
  const scope = parseScope(input);
  if (!z.uuid().safeParse(id).success) throw new MediaError("The image identity is invalid.");
  await withWriteDatabase((db) => db.transaction(async (tx) => {
    const [asset] = await tx.select().from(mediaAssets).where(eq(mediaAssets.id, id)).for("update");
    if (!asset || asset.createdBy !== MEDIA_OWNER || asset.scopeId !== scope.scopeId || asset.projectId !== (scope.projectId ?? null)) throw new MediaError("This editing session does not own the image.", 404);
    if (asset.state !== "ready" || (await referencedAssetIds(tx, [id])).size) throw new MediaError("Save the project with this image removed before deleting it.", 409);
    await tx.update(mediaAssets).set({ state: "deleting", cleanupAfter: new Date() }).where(eq(mediaAssets.id, id));
  }));
  return cleanupAdminImages([id]);
}

/** Navigation cleanup ignores attached images; interrupted requests expire after a safe delay. */
export async function discardAdminScope(input: unknown) {
  await requireAdmin();
  const scope = parseScope(input);
  const ids = await withWriteDatabase((db) => db.transaction((tx) => retireScopeUploads(tx, scope.scopeId, scope.projectId)));
  return cleanupAdminImages(ids);
}

export async function adminImageCleanupStatus() {
  await requireAdmin();
  const pending = await publicDatabase().select({ id: mediaAssets.id }).from(mediaAssets)
    .where(and(eq(mediaAssets.createdBy, MEDIA_OWNER), ne(mediaAssets.state, "attached"), lte(mediaAssets.cleanupAfter, new Date())));
  const deleting = await publicDatabase().select({ id: mediaAssets.id }).from(mediaAssets).where(eq(mediaAssets.state, "deleting"));
  return { eligible: pending.length, pending: deleting.length };
}
