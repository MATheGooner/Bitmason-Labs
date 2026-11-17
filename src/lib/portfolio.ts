/** Public portfolio records. Delivery status and publication are independent. */
export type ProjectStatus = "concept" | "completed";
export type PublicationStatus = "draft" | "published";

export interface ProjectCategory {
  readonly slug: string;
  readonly name: string;
}

export interface ProjectImage {
  /** Optional managed asset identity; legacy local references remain valid. */
  readonly assetId?: string | undefined;
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface ProjectGalleryImage extends ProjectImage {
  readonly id: string;
  readonly caption: string;
  readonly order: number;
  readonly kind: "interface" | "photograph";
}

export interface PortfolioProject {
  readonly name: string;
  readonly slug: string;
  readonly category: ProjectCategory;
  readonly summary: string;
  readonly status: ProjectStatus;
  readonly publicationStatus: PublicationStatus;
  readonly featured: boolean;
  readonly order: number;
  readonly cover: ProjectImage;
  readonly gallery: readonly ProjectGalleryImage[];
  readonly overview: readonly string[];
  readonly businessProblem: string;
  readonly solution: string;
  readonly features: readonly string[];
  readonly technologies: readonly string[];
  readonly useCases: readonly string[];
  readonly scope: readonly string[];
  readonly deliveryNote: string;
  readonly liveUrl: string | null;
  /** Optional presentation study; the cover remains the universal fallback. */
  readonly preview?: {
    readonly theme: "le-saphir" | "ecoshine" | "northfield" | "aurelia" | "linden";
    readonly headline: string;
    readonly label: string;
    readonly sector: string;
  };
}

export interface PortfolioCategory extends ProjectCategory {
  readonly count: number;
}

export function projectHref(project: Pick<PortfolioProject, "slug">): string {
  return `/portfolio/${encodeURIComponent(project.slug)}`;
}

export function projectStatusLabel(status: ProjectStatus): string {
  return status === "concept" ? "Concept project" : "Completed project";
}
