import { PortfolioImage } from "./portfolio-image";

import type { PortfolioProject } from "@/lib/portfolio";

/** Preserve the established homepage studies, with a cover fallback for new work. */
export function ProjectPreview({ project }: { project: PortfolioProject }) {
  const { cover, preview } = project;
  if (!preview) {
    return <PortfolioImage src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} sizes="(min-width: 1024px) 55vw, 100vw" className="project-cover" />;
  }

  return (
    <div className={`project-preview preview-${preview.theme}`}>
      <div className="preview-header" aria-hidden="true">
        <span className="preview-brand">{project.name}</span><span>{preview.sector}</span>
      </div>
      <div className="preview-scene">
        <div className="preview-image">
          <PortfolioImage src={cover.src} alt={cover.alt} fill sizes="(min-width: 1280px) 660px, (min-width: 1024px) 55vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="preview-copy" aria-hidden="true">
          <span>{preview.label}</span><p>{preview.headline}</p><span className="preview-rule" />
        </div>
      </div>
    </div>
  );
}
