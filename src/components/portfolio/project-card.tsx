import { PortfolioImage } from "./portfolio-image";
import Link from "next/link";

import { ProjectPreview } from "@/components/portfolio/project-preview";
import { ArrowIcon } from "@/components/ui/icons";
import type { PortfolioProject } from "@/lib/portfolio";
import { projectHref } from "@/lib/portfolio";
import { presentProject } from "@/lib/project-presentation";

export function ProjectCard({ project: record, presentation = "preview" }: { project: PortfolioProject; presentation?: "preview" | "interface" }) {
  const project = presentProject(record);
  const href = projectHref(project);
  const interfaceImage = project.gallery.find((image) => image.kind === "interface") ?? project.cover;
  return (
    <figure className={`project project-${project.preview?.theme ?? "default"}`}>
      {presentation === "preview" ? <ProjectPreview project={project} href={href} /> : <Link href={href} className="project-image-link" aria-label={`Explore the ${project.name} case study`}><PortfolioImage src={interfaceImage.src} alt={interfaceImage.alt} width={interfaceImage.width} height={interfaceImage.height} sizes="(min-width: 1280px) 572px, (min-width: 768px) 50vw, 100vw" className="project-card-interface" /></Link>}
      <figcaption>
        <div className="project-caption-top">
          <span className="technical-label">{project.preview?.sector ?? project.category.name}</span>
          <span className="technical-label">Design & engineering</span>
        </div>
        <h3><Link href={href}>{project.name}</Link></h3>
        <p className="project-scope">{project.scope.join(" · ")}</p>
        <p className="project-description">{project.summary}</p>
        <Link href={href} className="text-link project-detail-link">Explore the case study <ArrowIcon /><span className="sr-only">: {project.name}</span></Link>
      </figcaption>
    </figure>
  );
}
