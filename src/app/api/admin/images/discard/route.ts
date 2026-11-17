import { discardAdminScope } from "@/server/storage/admin";
import { authorizeImageRequest, imageError, imageJson, imageResponse } from "@/server/storage/request";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try { await authorizeImageRequest(request); return imageResponse(await discardAdminScope(await imageJson(request))); }
  catch (error) { return imageError(error); }
}
