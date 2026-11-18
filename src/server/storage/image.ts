import "server-only";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { MAX_IMAGE_BYTES, MAX_IMAGE_DIMENSION, MAX_IMAGE_PIXELS } from "@/lib/media";
import { MediaError } from "./errors";

/** Decode the complete raster, then strip metadata and normalize orientation into WebP. */
export async function prepareImage(file: File) {
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new MediaError("Choose a nonempty image no larger than 4 MB.", 413);
  const types: Record<string, { extensions: string[]; format: string }> = {
    "image/jpeg": { extensions: ["jpg", "jpeg"], format: "jpeg" },
    "image/png": { extensions: ["png"], format: "png" },
    "image/webp": { extensions: ["webp"], format: "webp" },
  };
  const type = types[file.type];
  if (!type || !type.extensions.includes(file.name.split(".").pop()?.toLowerCase() ?? "")) throw new MediaError("Choose a JPEG, PNG or WebP file with a matching file extension and type.");
  const source = Buffer.from(await file.arrayBuffer());
  const magic = source.subarray(0, 12);
  const format = magic.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])) ? "jpeg"
    : magic.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ? "png"
    : magic.subarray(0, 4).toString() === "RIFF" && magic.subarray(8, 12).toString() === "WEBP" ? "webp" : "";
  if (format !== type.format) throw new MediaError("The file content does not match its image type.");
  try {
    const image = sharp(source, { failOn: "warning", limitInputPixels: MAX_IMAGE_PIXELS, animated: true });
    const metadata = await image.metadata();
    if (metadata.format !== format || !metadata.width || !metadata.height || (metadata.pages ?? 1) !== 1
      || metadata.width > MAX_IMAGE_DIMENSION || metadata.height > MAX_IMAGE_DIMENSION || metadata.width * metadata.height > MAX_IMAGE_PIXELS) {
      throw new MediaError("Use a static image up to 8192 pixels per side and 24 megapixels.");
    }
    const { data: body, info } = await image.rotate().webp({ quality: 88, effort: 4 }).toBuffer({ resolveWithObject: true });
    if (!body.length || body.length > MAX_IMAGE_BYTES) throw new MediaError("The processed image exceeds 4 MB. Choose a smaller image.", 413);
    return { body, width: info.width, height: info.height, byteSize: body.length, mimeType: "image/webp" as const, sha256: createHash("sha256").update(body).digest("hex") };
  } catch (error) {
    if (error instanceof MediaError) throw error;
    throw new MediaError("This image is corrupt, incomplete or exceeds the supported dimensions. Choose another JPEG, PNG or WebP.");
  }
}
