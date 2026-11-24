import type { ProjectGalleryImage } from "@/lib/portfolio";
import { PROJECT_COVER_SIZES } from "@/lib/project-covers";
import { PortfolioImage } from "./portfolio-image";

export function GalleryImage({ item }: { item: ProjectGalleryImage }) {
  const sizes = item.kind === "photograph" ? "(min-width: 864px) 800px, (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)" : PROJECT_COVER_SIZES;
  return <figure className={`gallery-item gallery-${item.kind}`}>
    <PortfolioImage src={item.src} alt={item.alt} width={item.width} height={item.height} sizes={sizes} className="gallery-image" />
    <figcaption><span className="technical-label">{item.kind === "interface" ? "Interface detail" : "Visual direction"}</span><p>{item.caption}</p>
    </figcaption>
  </figure>;
}
