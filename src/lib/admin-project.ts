import { z } from "zod";
import type { PortfolioProject, ProjectGalleryImage } from "./portfolio";
import { assetIdFromUrl, isImageReference } from "./media";

const slug = z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens.");
const text = (max: number) => z.string().trim().max(max);
const dimension = z.number().int().min(1).max(16000);
const imageReference = z.string().max(500).refine(isImageReference, "Upload an image or use an existing /images/projects/ image path.");
const image = z.object({ assetId: z.uuid().optional(), src: imageReference, alt: text(500), width: dimension, height: dimension });
const list = z.array(text(2000).min(1)).max(50).refine((items) => new Set(items).size === items.length, "Remove duplicate entries.");

export const projectSchema = z.object({
  name: text(150).min(2), slug,
  category: z.object({ slug, name: text(100).min(2) }),
  summary: text(1000), status: z.enum(["concept", "completed"]), publicationStatus: z.enum(["draft", "published"]),
  featured: z.boolean(), order: z.number().int().min(0).max(100000),
  cover: image,
  gallery: z.array(image.extend({ id: slug, caption: text(2000), order: z.number().int().min(0).max(100000), kind: z.enum(["interface", "photograph"]) })).max(20),
  overview: list, businessProblem: text(10000), solution: text(10000),
  features: list, technologies: list, useCases: list, scope: list, deliveryNote: text(5000),
  liveUrl: z.string().max(2048).refine((value) => { try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; } }, "Use a verified HTTPS URL.").nullable(),
  preview: z.object({ theme: z.enum(["le-saphir", "ecoshine", "northfield", "aurelia", "linden"]), headline: text(200).min(1), label: text(200).min(1), sector: text(100).min(1) }).optional(),
}).superRefine((project, ctx) => {
  const images = [{ image: project.cover, path: ["cover"] as (string | number)[] }, ...project.gallery.map((item, i) => ({ image: item, path: ["gallery", i] as (string | number)[] }))];
  for (const { image: item, path } of images) {
    const managedId = assetIdFromUrl(item.src);
    if ((managedId || item.assetId) && managedId !== item.assetId) ctx.addIssue({ code: "custom", path: [...path, "src"], message: "Use the uploaded image's original reference. Its asset identity must match." });
  }
  if (new Set(project.gallery.map((item) => item.id)).size !== project.gallery.length) ctx.addIssue({ code: "custom", path: ["gallery"], message: "Gallery IDs must be unique within the project." });
  project.gallery.forEach((item, i) => {
    for (const key of ["src", "alt", "caption"] as const) if (!item[key]) ctx.addIssue({ code: "custom", path: ["gallery", i, key], message: "Provide a reference, alternative text and caption for each gallery image." });
  });
  if (project.publicationStatus === "published") {
    for (const key of ["summary", "businessProblem", "solution", "deliveryNote"] as const) if (!project[key]) ctx.addIssue({ code: "custom", path: [key], message: "Complete this field before publishing." });
    for (const key of ["overview", "features", "technologies", "useCases", "scope"] as const) if (!project[key].length) ctx.addIssue({ code: "custom", path: [key], message: "Add at least one entry before publishing." });
    for (const key of ["src", "alt"] as const) if (!project.cover[key]) ctx.addIssue({ code: "custom", path: ["cover", key], message: "Provide a cover reference and alternative text before publishing." });
  }
});

export const projectTextFields = ["name", "slug", "categorySlug", "categoryName", "summary", "order", "coverAssetId", "coverSrc", "coverAlt", "coverWidth", "coverHeight", "overview", "businessProblem", "solution", "features", "technologies", "useCases", "scope", "deliveryNote", "liveUrl", "previewTheme", "previewHeadline", "previewLabel", "previewSector", "status", "publicationStatus"] as const;
export type ProjectTextField = typeof projectTextFields[number];
export type ProjectValues = Record<ProjectTextField, string> & { featured: boolean; gallery: ProjectGalleryImage[] };
export interface ProjectFormState { status: "idle" | "invalid" | "error"; message: string; errors: Record<string, string>; values: ProjectValues; responseId: string }

export function projectValues(project?: PortfolioProject): ProjectValues {
  return {
    name: project?.name ?? "", slug: project?.slug ?? "", categorySlug: project?.category.slug ?? "", categoryName: project?.category.name ?? "",
    summary: project?.summary ?? "", order: String(project?.order ?? 0),
    status: project?.status ?? "concept", publicationStatus: project?.publicationStatus ?? "draft", featured: project?.featured ?? false,
    coverAssetId: project?.cover.assetId ?? "", coverSrc: project?.cover.src ?? "", coverAlt: project?.cover.alt ?? "", coverWidth: String(project?.cover.width ?? 1440), coverHeight: String(project?.cover.height ?? 900),
    overview: project?.overview.join("\n\n") ?? "", businessProblem: project?.businessProblem ?? "", solution: project?.solution ?? "",
    features: project?.features.join("\n") ?? "", technologies: project?.technologies.join("\n") ?? "", useCases: project?.useCases.join("\n") ?? "", scope: project?.scope.join("\n") ?? "",
    deliveryNote: project?.deliveryNote ?? "", liveUrl: project?.liveUrl ?? "", gallery: [...(project?.gallery ?? [])],
    previewTheme: project?.preview?.theme ?? "", previewHeadline: project?.preview?.headline ?? "", previewLabel: project?.preview?.label ?? "", previewSector: project?.preview?.sector ?? "",
  };
}

export function readProjectForm(form: FormData): ProjectValues {
  const values = projectValues();
  for (const key of projectTextFields) values[key] = typeof form.get(key) === "string" ? String(form.get(key)).trim() : "";
  values.featured = form.get("featured") === "on";
  const count = Number(form.get("galleryCount"));
  if (!Number.isInteger(count) || count < 0 || count > 20) throw new Error("The gallery can contain up to 20 items.");
  for (let i = 0; i < count; i++) {
    if (form.get(`gallery.${i}.remove`) === "on") continue;
    const read = (key: string) => String(form.get(`gallery.${i}.${key}`) ?? "").trim();
    if (![read("src"), read("alt"), read("caption")].some(Boolean)) continue;
    values.gallery.push({ ...(read("assetId") ? { assetId: read("assetId") } : {}), id: read("id"), src: read("src"), alt: read("alt"), caption: read("caption"), width: Number(read("width")), height: Number(read("height")), order: Number(read("order")), kind: read("kind") as ProjectGalleryImage["kind"] });
  }
  return values;
}

export function parseProjectValues(values: ProjectValues) {
  const lines = (value: string) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  return projectSchema.safeParse({
    name: values.name, slug: values.slug, category: { slug: values.categorySlug, name: values.categoryName }, summary: values.summary,
    status: values.status, publicationStatus: values.publicationStatus, featured: values.featured, order: Number(values.order),
    cover: { ...(values.coverAssetId ? { assetId: values.coverAssetId } : {}), src: values.coverSrc, alt: values.coverAlt, width: Number(values.coverWidth), height: Number(values.coverHeight) },
    gallery: values.gallery, overview: values.overview.split(/\r?\n\s*\r?\n/).map((item) => item.trim()).filter(Boolean),
    businessProblem: values.businessProblem, solution: values.solution, features: lines(values.features), technologies: lines(values.technologies), useCases: lines(values.useCases), scope: lines(values.scope), deliveryNote: values.deliveryNote, liveUrl: values.liveUrl || null,
    ...(values.previewTheme ? { preview: { theme: values.previewTheme, headline: values.previewHeadline, label: values.previewLabel, sector: values.previewSector } } : {}),
  });
}

export function formErrors(issues: readonly z.core.$ZodIssue[]): Record<string, string> {
  const errors: Record<string, string> = {};
  const map: Record<string, string> = { "category.slug": "categorySlug", "category.name": "categoryName", "cover.src": "coverSrc", "cover.alt": "coverAlt", "cover.width": "coverWidth", "cover.height": "coverHeight", "preview.theme": "previewTheme", "preview.headline": "previewHeadline", "preview.label": "previewLabel", "preview.sector": "previewSector" };
  for (const issue of issues) {
    const path = issue.path.join(".");
    const key = map[path] ?? path;
    errors[key] ??= issue.message;
  }
  return errors;
}
