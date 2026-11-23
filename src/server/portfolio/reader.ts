import "server-only";

import type { PortfolioCategory, PortfolioProject, ProjectQuery } from "@/lib/portfolio";
import { selectPublishedProjects } from "@/lib/portfolio";
import { cache } from "react";
import { connection } from "next/server";
import { publicDatabase } from "@/server/db/client";
import { queryProjects } from "@/server/portfolio/queries";

/** Request-only memoization; never fall back to local records after failure. */
const readPublishedProjects = cache(async (): Promise<PortfolioProject[]> => {
  await connection();
  try {
    return (await queryProjects(publicDatabase(), { publishedOnly: true })).map(({ project }) => project);
  } catch {
    console.error("Public portfolio temporarily unavailable.");
    return [];
  }
});

export async function listPublishedProjects(query: ProjectQuery = {}): Promise<PortfolioProject[]> {
  return selectPublishedProjects(await readPublishedProjects(), query);
}

export async function getPublishedProject(slug: string): Promise<PortfolioProject | null> {
  const projects = await readPublishedProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getPublishedProjectSlugs(): Promise<string[]> {
  return (await readPublishedProjects()).map((project) => project.slug);
}

export async function getPortfolioCategories(): Promise<PortfolioCategory[]> {
  const categories = new Map<string, PortfolioCategory>();
  for (const project of await readPublishedProjects()) {
    const existing = categories.get(project.category.slug);
    categories.set(project.category.slug, { ...project.category, count: (existing?.count ?? 0) + 1 });
  }
  return [...categories.values()].sort((a, b) => a.name.localeCompare(b.name));
}
