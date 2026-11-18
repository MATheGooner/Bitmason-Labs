import { discardAdminImage } from "@/server/storage/admin";
import { authorizeImageRequest, imageError, imageJson, imageResponse } from "@/server/storage/request";

export const runtime = "nodejs";
export const maxDuration = 120;
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await authorizeImageRequest(request);
    return imageResponse(await discardAdminImage((await params).id, await imageJson(request)));
  } catch (error) { return imageError(error); }
}
