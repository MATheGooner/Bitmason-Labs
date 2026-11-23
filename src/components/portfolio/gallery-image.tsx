"use client";
import { useState } from "react";
import type { ProjectGalleryImage } from "@/lib/portfolio";
import { PROJECT_COVER_SIZES } from "@/lib/project-covers";
import { PortfolioImage } from "./portfolio-image";

export function GalleryImage({ item }: { item: ProjectGalleryImage }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const unavailable = !item.src || failedSource === item.src;
  const sizes = item.kind === "photograph" ? "(min-width: 864px) 800px, (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)" : PROJECT_COVER_SIZES;
  const picture = <PortfolioImage src={item.src} alt={item.alt} width={item.width} height={item.height} sizes={sizes} className="gallery-image" onUnavailable={() => setFailedSource(item.src)} />;
  return <figure className={`gallery-item gallery-${item.kind}`}>
    {unavailable ? picture : <a href={item.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full image: ${item.alt} (opens in a new tab)`}>{picture}</a>}
    <figcaption><span className="technical-label">{item.kind === "interface" ? "Interface detail" : "Visual direction"}</span><p>{item.caption}</p>
      {!unavailable && <a href={item.src} target="_blank" rel="noopener noreferrer" className="text-link">View full image <span aria-hidden="true">↗</span><span className="sr-only">: {item.alt} (opens in a new tab)</span></a>}
    </figcaption>
  </figure>;
}
