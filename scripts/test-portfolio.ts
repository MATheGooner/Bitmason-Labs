import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { parseProjectValues, projectTextFields, projectValues, readProjectForm } from "../src/lib/admin-project";
import { ASSET_PUBLIC_ORIGIN, MEDIA_KEY_PREFIX } from "../src/lib/media";
import type { PortfolioProject } from "../src/lib/portfolio";
import { selectPublishedProjects } from "../src/lib/portfolio";
import { getProjectCover } from "../src/lib/project-covers";
import { localProjects } from "../src/server/portfolio/local-projects";

/** Disposable in-memory records only; these checks never connect to the database or R2. */
function dashboardProject(overrides: Partial<PortfolioProject> = {}): PortfolioProject {
  const base = { ...localProjects[0]! };
  delete base.preview;
  const assetId = randomUUID();
  return { ...base, name: "Dashboard study", slug: "dashboard-study", order: 0, gallery: [],
    cover: { assetId, src: `${ASSET_PUBLIC_ORIGIN}/${MEDIA_KEY_PREFIX}${assetId}.webp`, alt: "Dashboard study homepage and navigation", width: 2442, height: 1414 },
    ...overrides };
}

test("dashboard form preserves uploaded cover metadata without a preview or gallery", () => {
  const project = dashboardProject();
  const values = projectValues(project);
  const form = new FormData();
  for (const field of projectTextFields) form.set(field, values[field]);
  form.set("featured", "on");
  form.set("galleryCount", "0");
  const result = parseProjectValues(readProjectForm(form));
  assert.equal(result.success, true);
  if (!result.success) return;
  assert.deepEqual(result.data.cover, project.cover);
  assert.deepEqual(result.data.gallery, []);
  assert.equal(result.data.preview, undefined);
  assert.equal(result.data.publicationStatus, "published");
  assert.equal(result.data.featured, true);
  assert.equal(result.data.order, project.order);
});

test("homepage filters publication and featured settings before selecting the ordered five", () => {
  const admin = dashboardProject();
  const draft = dashboardProject({ name: "Draft study", slug: "draft-study", publicationStatus: "draft", order: 0 });
  const unfeatured = dashboardProject({ name: "Portfolio-only study", slug: "portfolio-only-study", featured: false, order: 0 });
  const records = [draft, unfeatured, ...[...localProjects].reverse(), admin];
  const original = [...records];
  const featured = selectPublishedProjects(records, { featured: true, limit: 5 });
  assert.deepEqual(featured.map((project) => project.slug), [admin.slug, ...localProjects.slice(0, 4).map((project) => project.slug)]);
  assert.ok(featured.every((project) => project.publicationStatus === "published" && project.featured));
  const portfolio = selectPublishedProjects(records);
  assert.equal(portfolio.length, 7);
  assert.ok(portfolio.includes(unfeatured));
  assert.ok(portfolio.includes(localProjects[4]!));
  assert.ok(!portfolio.includes(draft));
  assert.deepEqual(records, original, "Selections must not mutate source records or their order");
});

test("display-order changes move a project into or out of the homepage selection", () => {
  const later = dashboardProject({ order: 100 });
  const earlier = { ...later, order: 0 };
  assert.deepEqual(selectPublishedProjects([later, ...localProjects], { featured: true, limit: 5 }), localProjects);
  const reordered = selectPublishedProjects([...localProjects, earlier], { featured: true, limit: 5 });
  assert.equal(reordered[0], earlier);
  assert.equal(reordered.length, 5);
  assert.ok(!reordered.includes(localProjects[4]!));
  assert.equal(later.order, 100);
});

test("public category filters exclude drafts and do not impose the homepage limit", () => {
  const category = { slug: "software", name: "Software" };
  const records = Array.from({ length: 7 }, (_, order) => dashboardProject({ slug: `software-${order}`, name: `Software ${order}`, category, order, featured: false }));
  const draft = dashboardProject({ category, publicationStatus: "draft" });
  assert.equal(selectPublishedProjects([...records, draft, ...localProjects], { category: category.slug }).length, 7);
  assert.equal(selectPublishedProjects(records, { featured: true, limit: 5 }).length, 0);
  assert.equal(selectPublishedProjects(records, { category: "missing" }).length, 0);
});

test("seed cover variants remain available and administrator replacements remain authoritative", () => {
  for (const seeded of localProjects) {
    const legacy = { ...seeded, cover: { ...seeded.cover, src: `/images/projects/${seeded.preview!.theme}.webp` } };
    const cover = getProjectCover(legacy);
    assert.ok(cover.desktop.src.endsWith("cover-desktop.webp"));
    assert.ok(cover.mobile?.src.endsWith("cover-mobile.webp"));
    const replacement = dashboardProject({ slug: seeded.slug });
    const uploaded = getProjectCover(replacement);
    assert.deepEqual(uploaded.desktop, replacement.cover);
    assert.equal(uploaded.mobile, undefined);
  }
});
