import { cleanupAdminImages } from "@/server/storage/admin";
import { authorizeImageRequest, imageError, imageResponse } from "@/server/storage/request";

export const runtime = "nodejs";
export const maxDuration = 120;
export async function POST(request: Request) {
  try { await authorizeImageRequest(request); return imageResponse(await cleanupAdminImages()); }
  catch (error) { return imageError(error); }
}
