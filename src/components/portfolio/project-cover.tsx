import type { CSSProperties } from "react";
import type { PortfolioProject } from "@/lib/portfolio";
import { getProjectCover, PROJECT_COVER_SIZES } from "@/lib/project-covers";
import { PortfolioImage } from "./portfolio-image";

/** Consistent landscape thumbnails; larger presentations use each source's own ratio. */
export function ProjectCover({ project, sizes = PROJECT_COVER_SIZES, presentation = "showcase" }: { project: PortfolioProject; sizes?: string; presentation?: "card" | "showcase" }) {
  const { desktop, mobile } = getProjectCover(project);
  const mobileImage = presentation === "showcase" ? mobile : undefined;
  const mobileSource = mobileImage ?? desktop;
  const style = {
    "--project-cover-ratio": presentation === "card" ? "8 / 5" : `${desktop.width} / ${desktop.height}`,
    "--project-cover-mobile-ratio": presentation === "card" ? "8 / 5" : `${mobileSource.width} / ${mobileSource.height}`,
  } as CSSProperties;
  return <div className="project-cover" style={style}>
    <PortfolioImage src={desktop.src} alt={desktop.alt} width={desktop.width} height={desktop.height} mobile={mobileImage} sizes={sizes} className="project-cover-image" />
  </div>;
}
