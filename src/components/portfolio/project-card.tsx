import Link from "next/link";

import { ProjectPreview } from "@/components/portfolio/project-preview";
import { ArrowIcon } from "@/components/ui/icons";
import type { PortfolioProject } from "@/lib/portfolio";
import { projectHref } from "@/lib/portfolio";
import { presentProject } from "@/lib/project-presentation";

export function ProjectCard({ project: record, featured = false }: { project: PortfolioProject; featured?: boolean }) {
  const project = presentProject(record);
  const href = projectHref(project);
  return (
    <figure className={`project${featured ? " project-featured" : ""}`}>
      <ProjectPreview project={project} href={href} featured={featured} />
      <figcaption>
        <div className="project-caption-top">
          <span className="technical-label">{project.category.name}</span>
          <span className="technical-label">Design & engineering</span>
        </div>
        <h3><Link href={href}>{project.name}</Link></h3>
        <p className="project-description">{project.summary}</p>
        {!featured && project.scope.length > 0 && <p className="project-scope">{project.scope.join(" · ")}</p>}
        <Link href={href} className="text-link project-detail-link">Explore the case study <ArrowIcon /><span className="sr-only">: {project.name}</span></Link>
      </figcaption>
    </figure>
  );
}
