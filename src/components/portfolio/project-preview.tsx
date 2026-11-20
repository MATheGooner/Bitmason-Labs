import Link from "next/link";
import type { PortfolioProject } from "@/lib/portfolio";
import { ProjectCover } from "./project-cover";

export function ProjectPreview({ project, href }: { project: PortfolioProject; href: string }) {
  return <Link href={href} className="project-image-link" aria-label={`Explore the ${project.name} case study`}>
    <ProjectCover project={project} />
  </Link>;
}
