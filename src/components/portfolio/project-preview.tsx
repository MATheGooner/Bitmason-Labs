"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { PortfolioImage } from "./portfolio-image";

import type { PortfolioProject } from "@/lib/portfolio";

/** Preserve the established homepage studies, with a cover fallback for new work. */
export function ProjectPreview({ project, href }: { project: PortfolioProject; href: string }) {
  const [showInterface, setShowInterface] = useState(false);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const previewId = useId();
  const { cover, preview } = project;
  const interfaceImage = project.gallery.find((image) => image.kind === "interface");
  const canInspect = interfaceImage && failedSource !== interfaceImage.src;
  if (!preview) {
    return <Link href={href} className="project-image-link" aria-label={`Explore the ${project.name} case study`}><PortfolioImage src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} sizes="(min-width: 1024px) 55vw, 100vw" className="project-cover" /></Link>;
  }

  return (
    <div className="project-visual">
    <Link href={href} id={previewId} className={`project-image-link project-preview preview-${preview.theme}${showInterface && canInspect ? " is-inspecting" : ""}`} aria-label={`Explore the ${project.name} case study`}>
      <div className="preview-header" aria-hidden="true">
        <span className="preview-brand">{project.name}</span><span>{preview.sector}</span>
      </div>
      <div className="preview-scene">
        <div className="preview-image" aria-hidden={showInterface && Boolean(canInspect)}>
          <PortfolioImage src={cover.src} alt={cover.alt} fill sizes="(min-width: 1280px) 660px, (min-width: 1024px) 55vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="preview-copy" aria-hidden="true">
          <span>{preview.label}</span><p>{preview.headline}</p><span className="preview-rule" />
        </div>
        {canInspect && <div className="preview-interface" aria-hidden={!showInterface}><PortfolioImage src={interfaceImage.src} alt={interfaceImage.alt} fill sizes="(min-width: 1280px) 660px, (min-width: 1024px) 55vw, (min-width: 768px) 50vw, 100vw" onUnavailable={() => setFailedSource(interfaceImage.src)} /></div>}
      </div>
    </Link>
    {canInspect && <div className="preview-toolbar"><span>{showInterface ? "Interface detail" : "Visual direction"}</span><button type="button" aria-pressed={showInterface} aria-controls={previewId} onClick={() => setShowInterface(!showInterface)}>{showInterface ? "View visual direction" : "View interface"}<span aria-hidden="true">↗</span><span className="sr-only">: {project.name}</span></button></div>}
    </div>
  );
}
