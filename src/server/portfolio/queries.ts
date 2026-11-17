import "server-only";
import { and, asc, eq, inArray, or, ilike } from "drizzle-orm";
import type { PortfolioProject } from "@/lib/portfolio";
import { categories, galleryImages, projects } from "@/server/db/schema";
import type { publicDatabase } from "@/server/db/client";

export interface StoredProject {
  id: string;
  updatedAt: string;
  createdAt: string;
  project: PortfolioProject;
}

type ReadDatabase = ReturnType<typeof publicDatabase>;

/** Internal query builder; administrative callers must authorize before use. */
export async function queryProjects(db: ReadDatabase, options: { publishedOnly?: boolean; slug?: string; id?: string; search?: string } = {}): Promise<StoredProject[]> {
  const conditions = [];
  if (options.publishedOnly) conditions.push(eq(projects.publicationStatus, "published"));
  if (options.slug) conditions.push(eq(projects.slug, options.slug));
  if (options.id) conditions.push(eq(projects.id, options.id));
  if (options.search) {
    const pattern = `%${options.search.replace(/[\\%_]/g, "\\$&")}%`;
    conditions.push(or(ilike(projects.name, pattern), ilike(projects.slug, pattern), ilike(projects.summary, pattern))!);
  }
  const rows = await db.select({ project: projects, category: categories }).from(projects)
    .innerJoin(categories, eq(projects.categorySlug, categories.slug)).where(and(...conditions))
    .orderBy(asc(projects.order), asc(projects.name), asc(projects.slug));
  if (!rows.length) return [];
  const images = await db.select().from(galleryImages).where(inArray(galleryImages.projectId, rows.map(({ project }) => project.id))).orderBy(asc(galleryImages.order), asc(galleryImages.id));
  return rows.map(({ project: row, category }) => ({
    id: row.id, updatedAt: row.updatedAt.toISOString(), createdAt: row.createdAt.toISOString(),
    project: {
      name: row.name, slug: row.slug, category, summary: row.summary,
      status: row.status, publicationStatus: row.publicationStatus, featured: row.featured, order: row.order,
      cover: row.cover, gallery: images.filter((item) => item.projectId === row.id).map((item) => ({ ...(item.assetId ? { assetId: item.assetId } : {}), id: item.id, src: item.src, alt: item.alt, width: item.width, height: item.height, caption: item.caption, order: item.order, kind: item.kind })),
      overview: row.overview, businessProblem: row.businessProblem, solution: row.solution,
      features: row.features, technologies: row.technologies, useCases: row.useCases, scope: row.scope,
      deliveryNote: row.deliveryNote, liveUrl: row.liveUrl,
      ...(row.preview ? { preview: row.preview } : {}),
    },
  }));
}
