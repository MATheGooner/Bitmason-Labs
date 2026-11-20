import type { PortfolioProject } from "@/lib/portfolio";
import { getProjectCover } from "@/lib/project-covers";
import { PortfolioImage } from "./portfolio-image";

/** One geometry and source-selection rule for featured cards, the portfolio and case studies. */
export function ProjectCover({ project, sizes = "(min-width: 1280px) 660px, (min-width: 768px) 55vw, 100vw" }: { project: PortfolioProject; sizes?: string }) {
  const { desktop, mobile } = getProjectCover(project);
  return <div className="project-cover">
    <PortfolioImage src={desktop.src} alt={desktop.alt} width={desktop.width} height={desktop.height} mobile={mobile} sizes={sizes} className="project-cover-image" />
  </div>;
}
