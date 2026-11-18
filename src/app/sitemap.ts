import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { site } from "@/lib/site";
import { projectHref } from "@/lib/portfolio";
import { siteIndexingEnabled } from "@/server/launch-policy";
import { publicDatabase } from "@/server/db/client";
import { queryProjects } from "@/server/portfolio/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  if (!siteIndexingEnabled(process.env)) return [];
  // Never cache a partial sitemap after a database failure or include drafts.
  let projects;
  try { projects = await queryProjects(publicDatabase(), { publishedOnly: true }); }
  catch { throw new Error("The public sitemap is temporarily unavailable."); }
  return [
    ...["/", "/about", "/services", "/portfolio", "/contact"].map((path) => ({ url: new URL(path, site.url).href })),
    ...projects.map(({ project, updatedAt }) => ({ url: new URL(projectHref(project), site.url).href, lastModified: updatedAt })),
  ];
}
