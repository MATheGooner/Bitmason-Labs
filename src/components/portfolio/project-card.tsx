import { PortfolioImage } from "./portfolio-image";
import Link from "next/link";

import { ProjectPreview } from "@/components/portfolio/project-preview";
import { ArrowIcon } from "@/components/ui/icons";
import type { PortfolioProject } from "@/lib/portfolio";
import { projectHref, projectStatusLabel } from "@/lib/portfolio";

export function ProjectCard({ project, index, presentation = "preview" }: { project: PortfolioProject; index: number; presentation?: "preview" | "interface" }) {
  const href = projectHref(project);
  const interfaceImage = project.gallery.find((image) => image.kind === "interface") ?? project.cover;
  return (
    <figure className={`project project-${project.preview?.theme ?? "default"}`}>
      <Link href={href} className="project-image-link" aria-label={`Explore ${project.name} — ${projectStatusLabel(project.status).toLowerCase()}`}>
        {presentation === "preview" ? <ProjectPreview project={project} /> : <PortfolioImage src={interfaceImage.src} alt={interfaceImage.alt} width={interfaceImage.width} height={interfaceImage.height} sizes="(min-width: 1280px) 572px, (min-width: 768px) 50vw, 100vw" className="project-card-interface" />}
      </Link>
      <figcaption>
        <div className="project-caption-top">
          <span className="technical-label">{String(index + 1).padStart(2, "0")} / {project.preview?.sector ?? project.category.name}</span>
          <span className="concept-label">{projectStatusLabel(project.status)}</span>
        </div>
        <h3><Link href={href}>{project.name}</Link></h3>
        <p className="project-scope">{project.scope.join(" · ")}</p>
        <p className="project-description">{project.summary}</p>
        <Link href={href} className="text-link project-detail-link">Explore the project <ArrowIcon /><span className="sr-only">: {project.name}</span></Link>
      </figcaption>
    </figure>
  );
}
