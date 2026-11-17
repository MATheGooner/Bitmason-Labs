import "server-only";
import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import type { PortfolioProject, ProjectImage } from "@/lib/portfolio";
import { ASSET_PUBLIC_ORIGIN, MEDIA_OWNER } from "@/lib/media";
import type { WriteDatabase } from "@/server/db/client";
import { galleryImages, mediaAssets, projects } from "@/server/db/schema";
import { MediaError } from "./errors";

export type WriteTransaction = Parameters<Parameters<WriteDatabase["transaction"]>[0]>[0];

export async function projectAssetIds(tx: WriteTransaction, projectId: string): Promise<string[]> {
  const [cover] = await tx.select({ id: projects.coverAssetId }).from(projects).where(eq(projects.id, projectId));
  const gallery = await tx.select({ id: galleryImages.assetId }).from(galleryImages).where(eq(galleryImages.projectId, projectId));
  return [...new Set([cover?.id, ...gallery.map((item) => item.id)].filter((id): id is string => Boolean(id)))];
}

/** Lock the old and incoming identities before changing any references or lifecycle state. */
export async function claimProjectImages(tx: WriteTransaction, input: PortfolioProject, projectId: string, scopeId: string | undefined, previousIds: string[], originalProjectId?: string) {
  const incoming = [input.cover, ...input.gallery].flatMap((image) => image.assetId ? [image.assetId] : []);
  const ids = [...new Set([...incoming, ...previousIds])].sort();
  const assets = ids.length ? await tx.select().from(mediaAssets).where(inArray(mediaAssets.id, ids)).orderBy(asc(mediaAssets.id)).for("update") : [];
  const canonical = (image: ProjectImage): ProjectImage => {
    if (!image.assetId) return image;
    const asset = assets.find((item) => item.id === image.assetId);
    const pendingAllowed = asset?.state === "ready" && asset.scopeId === scopeId && asset.projectId === (originalProjectId ?? null)
      && Boolean(asset.cleanupAfter && asset.cleanupAfter.getTime() > Date.now());
    const attachedAllowed = asset?.state === "attached" && asset.projectId === projectId;
    if (!asset || asset.createdBy !== MEDIA_OWNER || (!pendingAllowed && !attachedAllowed) || image.src !== `${ASSET_PUBLIC_ORIGIN}/${asset.objectKey}`) {
      throw new MediaError("An image is unavailable or belongs to another editing session or project. Upload it again before saving.", 409);
    }
    return { ...image, width: asset.width, height: asset.height };
  };
  const cover = canonical(input.cover);
  const gallery = input.gallery.map((image) => ({ ...image, ...canonical(image) }));
  if (incoming.length) await tx.update(mediaAssets).set({ state: "attached", projectId, cleanupAfter: null, lastError: null }).where(inArray(mediaAssets.id, incoming));
  return { ...input, cover, gallery };
}

export async function referencedAssetIds(tx: WriteTransaction, ids: string[]) {
  if (!ids.length) return new Set<string>();
  const covers = await tx.select({ id: projects.coverAssetId }).from(projects).where(inArray(projects.coverAssetId, ids));
  const gallery = await tx.select({ id: galleryImages.assetId }).from(galleryImages).where(inArray(galleryImages.assetId, ids));
  return new Set([...covers, ...gallery].flatMap((item) => item.id ? [item.id] : []));
}

export async function retireUnreferencedImages(tx: WriteTransaction, ids: string[]) {
  const references = await referencedAssetIds(tx, ids);
  const retired = ids.filter((id) => !references.has(id));
  if (retired.length) await tx.update(mediaAssets).set({ state: "deleting", cleanupAfter: new Date(), lastError: null }).where(and(inArray(mediaAssets.id, retired), eq(mediaAssets.state, "attached")));
  return retired;
}

export async function retireScopeUploads(tx: WriteTransaction, scopeId: string, originalProjectId?: string) {
  const pending = await tx.select({ id: mediaAssets.id }).from(mediaAssets)
    .where(and(eq(mediaAssets.scopeId, scopeId), originalProjectId ? eq(mediaAssets.projectId, originalProjectId) : isNull(mediaAssets.projectId), eq(mediaAssets.state, "ready")))
    .orderBy(asc(mediaAssets.id)).for("update");
  const ids = pending.map((asset) => asset.id);
  if (ids.length) await tx.update(mediaAssets).set({ state: "deleting", cleanupAfter: new Date() }).where(inArray(mediaAssets.id, ids));
  return ids;
}
