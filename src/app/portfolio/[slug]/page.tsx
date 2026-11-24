import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicPage } from "@/components/layout/public-page";
import { ProjectDetail } from "@/components/portfolio/project-detail";
import { publicPageMetadata } from "@/lib/metadata";
import { projectHref } from "@/lib/portfolio";
import { presentProject } from "@/lib/project-presentation";
import { getPublishedProject, listPublishedProjects } from "@/server/portfolio/reader";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getPublishedProject((await params).slug);
  if (!project) notFound();
  const title = `${project.name} — ${project.category.name}`;
  return publicPageMetadata(title, presentProject(project).summary, projectHref(project), {
    url: project.cover.src || "/opengraph-image", width: project.cover.width, height: project.cover.height, alt: project.cover.alt,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getPublishedProject(slug), listPublishedProjects()]);
  if (!project) notFound();
  const index = projects.findIndex((item) => item.slug === slug);
  const nextProject = projects.length > 1 ? projects[(index + 1) % projects.length] ?? null : null;
  return <PublicPage activePage="/portfolio"><ProjectDetail project={project} nextProject={nextProject} /></PublicPage>;
}
