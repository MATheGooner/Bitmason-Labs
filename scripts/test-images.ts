import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import sharp from "sharp";
import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ASSET_PUBLIC_ORIGIN, assetIdFromUrl, isImageReference, MAX_IMAGE_BYTES, MEDIA_KEY_PREFIX, MEDIA_OWNER } from "../src/lib/media";
import { projectSchema } from "../src/lib/admin-project";
import { localProjects } from "../src/server/portfolio/local-projects";
import { prepareImage } from "../src/server/storage/image";
import { deleteImageObject, putImageObject, r2Configuration } from "../src/server/storage/client";
import { ObjectCollisionError } from "../src/server/storage/errors";

const raster = () => sharp({ create: { width: 40, height: 24, channels: 3, background: "#35634b" } });

test("JPEG, PNG and WebP decode fully and produce static metadata-free WebP", async () => {
  for (const format of ["jpeg", "png", "webp"] as const) {
    const body = await raster().toFormat(format).toBuffer();
    const prepared = await prepareImage(new File([body], `fixture.${format}`, { type: `image/${format}` }));
    const metadata = await sharp(prepared.body).metadata();
    assert.equal(prepared.mimeType, "image/webp"); assert.equal(metadata.format, "webp");
    assert.equal(prepared.width, 40); assert.equal(prepared.height, 24);
    assert.equal(metadata.exif, undefined); assert.equal(metadata.icc, undefined); assert.equal(prepared.sha256.length, 64);
  }
});

test("orientation is normalized without retaining EXIF", async () => {
  const body = await raster().withMetadata({ orientation: 6 }).jpeg().toBuffer();
  const prepared = await prepareImage(new File([body], "rotated.jpg", { type: "image/jpeg" }));
  assert.equal(prepared.width, 24); assert.equal(prepared.height, 40);
  assert.equal((await sharp(prepared.body).metadata()).exif, undefined);
});

test("website screenshots retain their individual resolutions and complete image bounds", async () => {
  for (const [width, height] of [[2467, 1781], [2442, 1414], [2562, 1439]] as const) {
    const marker = await sharp({ create: { width: 32, height: 32, channels: 3, background: "#185442" } }).png().toBuffer();
    const body = await sharp({ create: { width, height, channels: 3, background: "white" } })
      .composite([{ input: marker, left: 0, top: 0 }, { input: marker, left: width - 32, top: height - 32 }]).png().toBuffer();
    const prepared = await prepareImage(new File([body], "screenshot.png", { type: "image/png" }));
    assert.equal(prepared.width, width);
    assert.equal(prepared.height, height);
    for (const [left, top] of [[8, 8], [width - 16, height - 16]]) {
      const pixel = await sharp(prepared.body).extract({ left: left!, top: top!, width: 1, height: 1 }).raw().toBuffer();
      assert.ok(Math.abs(pixel[0]! - 24) < 12 && Math.abs(pixel[1]! - 84) < 12 && Math.abs(pixel[2]! - 66) < 12, "Both screenshot corners must remain visible after processing");
    }
  }
});

test("SVG, GIF, extension mismatch, MIME spoofing, corrupt and truncated images are refused", async () => {
  const png = await raster().png().toBuffer();
  const files = [
    new File(["<svg/>"], "fixture.svg", { type: "image/svg+xml" }),
    new File(["GIF89a"], "fixture.gif", { type: "image/gif" }),
    new File([png], "fixture.jpg", { type: "image/png" }),
    new File([png], "fixture.jpeg", { type: "image/jpeg" }),
    new File(["not a raster"], "fixture.png", { type: "image/png" }),
    new File([png.subarray(0, Math.floor(png.length / 2))], "fixture.png", { type: "image/png" }),
  ];
  for (const file of files) await assert.rejects(prepareImage(file));
});

test("empty, oversized and excessive-dimension images are refused", async () => {
  await assert.rejects(prepareImage(new File([], "empty.png", { type: "image/png" })));
  await assert.rejects(prepareImage(new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], "oversized.png", { type: "image/png" })));
  const wide = await sharp({ create: { width: 8193, height: 1, channels: 3, background: "white" } }).png().toBuffer();
  await assert.rejects(prepareImage(new File([wide], "wide.png", { type: "image/png" })));
  const large = await sharp({ create: { width: 5000, height: 5000, channels: 3, background: "white" } }).png().toBuffer();
  await assert.rejects(prepareImage(new File([large], "large.png", { type: "image/png" })));
});

test("canonical public references exclude arbitrary hosts, traversal, queries and mismatched asset identities", () => {
  const id = randomUUID(); const src = `${ASSET_PUBLIC_ORIGIN}/${MEDIA_KEY_PREFIX}${id}.webp`;
  assert.equal(assetIdFromUrl(src), id); assert.ok(isImageReference(src));
  for (const invalid of [src + "?token=x", src + "#x", src.replace("assets.bitmasonlabs.com", "example.com"), "/images/projects/../../private.png", "https://assets.bitmasonlabs.com/unrelated.webp"]) assert.equal(isImageReference(invalid), false);
  const project = localProjects[0]!;
  assert.ok(projectSchema.safeParse({ ...project, cover: { ...project.cover, src, assetId: id } }).success);
  assert.equal(projectSchema.safeParse({ ...project, cover: { ...project.cover, src, assetId: randomUUID() } }).success, false);
  assert.equal(projectSchema.safeParse({ ...project, cover: { ...project.cover, src } }).success, false);
});

test("R2 configuration, conditional writes and verified deletion protect unrelated objects", async () => {
  const names = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME", "R2_PUBLIC_BASE_URL"] as const;
  const previous = names.map((name) => process.env[name]);
  const originalSend = S3Client.prototype.send;
  const commands: string[] = [];
  const id = randomUUID(); const asset = { id, objectKey: `${MEDIA_KEY_PREFIX}${id}.webp`, byteSize: 3, sha256: "a".repeat(64), etag: '"fixture"' };
  let collision = false; let unrelated = false; let missing = false;
  try {
    for (const name of names) delete process.env[name];
    assert.throws(r2Configuration, /R2_ACCOUNT_ID.*R2_ACCESS_KEY_ID/);
    Object.assign(process.env, { R2_ACCOUNT_ID: "a".repeat(32), R2_ACCESS_KEY_ID: "fixture", R2_SECRET_ACCESS_KEY: "fixture", R2_BUCKET_NAME: "fixture-images", R2_PUBLIC_BASE_URL: ASSET_PUBLIC_ORIGIN });
    assert.equal(r2Configuration().publicBase, ASSET_PUBLIC_ORIGIN);
    process.env.R2_PUBLIC_BASE_URL = "https://example.com"; assert.throws(r2Configuration, /R2_PUBLIC_BASE_URL/); process.env.R2_PUBLIC_BASE_URL = ASSET_PUBLIC_ORIGIN;
    S3Client.prototype.send = (async (command: HeadObjectCommand | DeleteObjectCommand | PutObjectCommand) => {
      commands.push(command.constructor.name);
      if (command instanceof PutObjectCommand) {
        assert.equal(command.input.IfNoneMatch, "*"); assert.equal(command.input.ContentType, "image/webp"); assert.ok(command.input.ContentMD5);
        assert.equal(command.input.Metadata?.owner, MEDIA_OWNER);
        if (collision) throw { $metadata: { httpStatusCode: 412 } };
        return { ETag: asset.etag };
      }
      if (command instanceof HeadObjectCommand) {
        if (missing) throw { $metadata: { httpStatusCode: 404 } };
        return { Metadata: { owner: unrelated ? "another-owner" : MEDIA_OWNER, "asset-id": id, sha256: asset.sha256 }, ContentType: "image/webp", ContentLength: 3, ETag: asset.etag };
      }
      return {};
    }) as typeof originalSend;
    assert.equal(await putImageObject(asset, Buffer.from("abc")), asset.etag);
    collision = true; await assert.rejects(putImageObject(asset, Buffer.from("abc")), ObjectCollisionError);
    assert.equal(commands.filter((name) => name === "DeleteObjectCommand").length, 0);
    unrelated = true; await assert.rejects(deleteImageObject(asset), /ownership/);
    assert.equal(commands.filter((name) => name === "DeleteObjectCommand").length, 0);
    unrelated = false; await deleteImageObject(asset);
    assert.equal(commands.filter((name) => name === "DeleteObjectCommand").length, 1);
    missing = true; await deleteImageObject(asset);
    assert.equal(commands.filter((name) => name === "DeleteObjectCommand").length, 1);
    await assert.rejects(deleteImageObject({ ...asset, objectKey: "unrelated/file.webp" }), /managed storage identity/);
  } finally {
    S3Client.prototype.send = originalSend;
    names.forEach((name, i) => { if (previous[i] === undefined) delete process.env[name]; else process.env[name] = previous[i]; });
  }
});
