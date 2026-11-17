import "server-only";
import { UnauthorizedError, requireAdmin } from "@/server/auth/authorization";
import { MAX_IMAGE_BYTES } from "@/lib/media";
import { MediaError } from "./errors";

export async function authorizeImageRequest(request: Request) {
  await requireAdmin();
  const origin = request.headers.get("origin");
  if (origin !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") throw new MediaError("Image changes require a request from this site.", 403);
}

/** Limit the actual stream, including chunked uploads, before invoking a multipart parser. */
export async function boundedBody(request: Request, maxBytes: number): Promise<Uint8Array> {
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBytes)) throw new MediaError("The image request exceeds the allowed size.", 413);
  if (!request.body) throw new MediaError("The request body is missing.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > maxBytes) { await reader.cancel(); throw new MediaError("The image request exceeds the allowed size.", 413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
  return body;
}

export async function imageForm(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!/^multipart\/form-data;\s*boundary=/i.test(contentType)) throw new MediaError("Send an image using multipart form data.");
  const body = await boundedBody(request, MAX_IMAGE_BYTES + 16_384);
  try { return await new Response(body as BodyInit, { headers: { "content-type": contentType } }).formData(); }
  catch { throw new MediaError("The image request is invalid."); }
}
export async function imageJson(request: Request): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") throw new MediaError("Send image changes as JSON.");
  try { return JSON.parse(new TextDecoder().decode(await boundedBody(request, 4096))); }
  catch (error) { if (error instanceof MediaError) throw error; throw new MediaError("The image request is invalid."); }
}
export function imageResponse(value: unknown, status = 200) {
  return Response.json(value, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
export function imageError(error: unknown) {
  if (error instanceof UnauthorizedError) return imageResponse({ error: "Sign in as the administrator before managing images." }, 401);
  if (error instanceof MediaError) return imageResponse({ error: error.message }, error.status);
  console.error("Administrative image operation failed.");
  return imageResponse({ error: "Image management is unavailable. Check the database and storage connection, then try again." }, 503);
}
