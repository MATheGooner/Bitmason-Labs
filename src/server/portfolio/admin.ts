import "server-only";
import { z } from "zod";
import { requireAdmin } from "@/server/auth/authorization";
import { publicDatabase, withWriteDatabase } from "@/server/db/client";
import type { PortfolioProject } from "@/lib/portfolio";
import { queryProjects } from "./queries";
import { removeProject, writeProject } from "./writer";
import { cleanupAdminImages } from "@/server/storage/admin";

const identity = z.object({ id: z.uuid(), updatedAt: z.iso.datetime() });

export async function listAdminProjects(search = "") {
  await requireAdmin();
  return queryProjects(publicDatabase(), { search: search.trim().slice(0, 200) });
}

export async function getAdminProject(id: string) {
  await requireAdmin();
  if (!z.uuid().safeParse(id).success) return null;
  return (await queryProjects(publicDatabase(), { id }))[0] ?? null;
}

async function finishCleanup(ids: string[]) {
  if (!ids.length) return false;
  try { const result = await cleanupAdminImages(ids); return result.errors > 0 || result.pending > 0; }
  catch { console.error("Project saved; image cleanup retained for retry."); return true; }
}

export async function saveAdminProject(project: PortfolioProject, existing?: { id: string; updatedAt: string }, uploadScope?: string) {
  await requireAdmin();
  if (existing) identity.parse(existing);
  if (uploadScope) z.uuid().parse(uploadScope);
  const saved = await withWriteDatabase((db) => writeProject(db, project, existing, uploadScope));
  return { ...saved, cleanupPending: await finishCleanup(saved.cleanupAssetIds) };
}

export async function deleteAdminProject(id: string, updatedAt: string, confirmation: string) {
  await requireAdmin();
  identity.parse({ id, updatedAt });
  const deleted = await withWriteDatabase((db) => removeProject(db, id, updatedAt, z.string().max(100).parse(confirmation)));
  return { slug: deleted.slug, cleanupPending: await finishCleanup(deleted.cleanupAssetIds) };
}
