import "server-only";
import { randomUUID } from "node:crypto";
import { and, asc, eq, inArray } from "drizzle-orm";
import type { PortfolioProject } from "@/lib/portfolio";
import { projectSchema } from "@/lib/admin-project";
import type { WriteDatabase } from "@/server/db/client";
import { categories, projects, galleryImages, mediaAssets } from "@/server/db/schema";
import { claimProjectImages, projectAssetIds, retireScopeUploads, retireUnreferencedImages } from "@/server/storage/references";

export class ProjectConflictError extends Error {}

/** Internal transactional writer. Runtime entry points are in admin.ts. */
export async function writeProject(db: WriteDatabase, input: PortfolioProject, existing?: { id: string; updatedAt: string }, uploadScope?: string) {
  const parsed = projectSchema.parse(input);
  const { preview: parsedPreview, ...parsedFields } = parsed;
  return db.transaction(async (tx) => {
    const current = existing ? (await tx.select().from(projects).where(eq(projects.id, existing.id)).for("update"))[0] : undefined;
    if (existing && (!current || current.updatedAt.toISOString() !== existing.updatedAt)) throw new ProjectConflictError("This project changed or was deleted. Reload before saving.");
    const id = existing?.id ?? randomUUID();
    const previousAssets = current ? await projectAssetIds(tx, id) : [];
    const project = await claimProjectImages(tx, { ...parsedFields, ...(parsedPreview ? { preview: parsedPreview } : {}) }, id, uploadScope, previousAssets, existing?.id);
    const [existingCategory] = await tx.select().from(categories).where(eq(categories.slug, project.category.slug));
    if (existingCategory && existingCategory.name !== project.category.name) throw new ProjectConflictError("This category slug already has a different name. Use its existing name or a new slug.");
    await tx.insert(categories).values(project.category).onConflictDoNothing();
    const { category, gallery, preview, ...fields } = project;
    const updatedAt = new Date(Math.max(Date.now(), (current?.updatedAt.getTime() ?? 0) + 1));
    const data = { ...fields, coverAssetId: project.cover.assetId ?? null, categorySlug: category.slug, preview: preview ?? null, updatedAt };
    if (existing) await tx.update(projects).set(data).where(eq(projects.id, id));
    else await tx.insert(projects).values({ id, ...data });
    await tx.delete(galleryImages).where(eq(galleryImages.projectId, id));
    if (gallery.length) await tx.insert(galleryImages).values(gallery.map((image) => ({ ...image, projectId: id })));
    const cleanupAssetIds = await retireUnreferencedImages(tx, previousAssets);
    if (uploadScope) cleanupAssetIds.push(...await retireScopeUploads(tx, uploadScope, existing?.id));
    return { id, slug: project.slug, previousSlug: current?.slug, cleanupAssetIds };
  });
}

export async function removeProject(db: WriteDatabase, id: string, updatedAt: string, confirmation: string) {
  return db.transaction(async (tx) => {
    const [current] = await tx.select().from(projects).where(eq(projects.id, id)).for("update");
    if (!current || current.updatedAt.toISOString() !== updatedAt || current.slug !== confirmation) throw new ProjectConflictError("The confirmation does not match, or the project changed. Reload before deleting.");
    const previousAssets = await projectAssetIds(tx, id);
    const assets = await tx.select().from(mediaAssets).where(eq(mediaAssets.projectId, id)).orderBy(asc(mediaAssets.id)).for("update");
    await tx.delete(projects).where(eq(projects.id, id));
    const cleanupAssetIds = await retireUnreferencedImages(tx, previousAssets);
    const pendingIds = assets.filter((asset) => asset.state === "ready").map((asset) => asset.id);
    if (pendingIds.length) await tx.update(mediaAssets).set({ state: "deleting", cleanupAfter: new Date() }).where(and(inArray(mediaAssets.id, pendingIds), eq(mediaAssets.state, "ready")));
    return { slug: current.slug, cleanupAssetIds: [...new Set([...cleanupAssetIds, ...pendingIds])] };
  });
}
