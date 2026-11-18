import { uploadAdminImage } from "@/server/storage/admin";
import { authorizeImageRequest, imageError, imageForm, imageResponse } from "@/server/storage/request";
import { MediaError } from "@/server/storage/errors";

export const runtime = "nodejs";
export const maxDuration = 120;
export async function POST(request: Request) {
  try {
    await authorizeImageRequest(request);
    const form = await imageForm(request);
    const file = form.get("file");
    if (!(file instanceof File) || form.getAll("file").length !== 1 || [...form.keys()].some((key) => !["file", "scopeId", "projectId"].includes(key))) throw new MediaError("Choose one image to upload.");
    return imageResponse(await uploadAdminImage(file, { scopeId: form.get("scopeId"), ...(form.get("projectId") ? { projectId: form.get("projectId") } : {}) }), 201);
  } catch (error) { return imageError(error); }
}
