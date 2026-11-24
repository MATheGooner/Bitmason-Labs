import Link from "next/link";
import type { PortfolioProject } from "@/lib/portfolio";
import { PROJECT_CARD_SIZES, PROJECT_COVER_SIZES } from "@/lib/project-covers";
import { ProjectCover } from "./project-cover";

export function ProjectPreview({ project, href, featured = false }: { project: PortfolioProject; href: string; featured?: boolean }) {
  return <Link href={href} className="project-image-link" aria-label={`Explore ${project.name}`}>
    <ProjectCover project={project} presentation={featured ? "showcase" : "card"} sizes={featured ? PROJECT_COVER_SIZES : PROJECT_CARD_SIZES} />
  </Link>;
}
