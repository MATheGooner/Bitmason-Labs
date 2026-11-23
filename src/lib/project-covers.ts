import type { PortfolioProject, ProjectImage } from "./portfolio";

// Match the shared container's padding and the portfolio's two-column gaps.
export const PROJECT_COVER_SIZES = "(min-width: 1280px) 1184px, (min-width: 1024px) calc(100vw - 96px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)";
export const PROJECT_CARD_SIZES = "(min-width: 1280px) 572px, (min-width: 1024px) calc(50vw - 68px), (min-width: 768px) calc(50vw - 48px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)";

interface ResponsiveCover {
  readonly desktop: ProjectImage;
  readonly mobile?: ProjectImage;
}

const sources: Record<string, { directory: string; original: string; alt: string }> = {
  "le-saphir": { directory: "le-saphir", original: "le-saphir", alt: "Le Saphir restaurant website, showing its original restaurant story page." },
  "ecoshine": { directory: "ecoshine", original: "ecoshine", alt: "EcoShine homepage, showing its cleaning services, original typography and interior photography." },
  "northfield-home-services": { directory: "northfield", original: "northfield", alt: "Northfield Home Services homepage, showing its plumbing, heating and electrical service introduction." },
  "aurelia-private-clinic": { directory: "aurelia", original: "aurelia", alt: "Aurelia Private Clinic homepage, showing its original healthcare introduction and appointment links." },
  "linden-and-co": { directory: "linden", original: "linden", alt: "Linden and Co. homepage, showing its Geneva property introduction and residential photography." },
};

/** Upgrade the original local covers without replacing later administrator uploads. */
export function getProjectCover(project: PortfolioProject): ResponsiveCover {
  const source = sources[project.slug];
  if (source) {
    const desktopSrc = `/images/projects/${source.directory}/cover-desktop.webp`;
    if (project.cover.src === `/images/projects/${source.original}.webp` || project.cover.src === desktopSrc) {
      return {
        desktop: { src: desktopSrc, alt: source.alt, width: 1440, height: 900 },
        mobile: { src: `/images/projects/${source.directory}/cover-mobile.webp`, alt: source.alt, width: 780, height: 1688 },
      };
    }
  }
  return { desktop: project.cover };
}
