import { sql } from "drizzle-orm";
import { check, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid, boolean, primaryKey } from "drizzle-orm/pg-core";
import type { PortfolioProject, ProjectImage } from "@/lib/portfolio";

export const deliveryStatus = pgEnum("delivery_status", ["concept", "completed"]);
export const publicationStatus = pgEnum("publication_status", ["draft", "published"]);
export const galleryKind = pgEnum("gallery_kind", ["interface", "photograph"]);
export const mediaState = pgEnum("media_state", ["uploading", "ready", "attached", "deleting"]);

/** Short-lived HMAC keys only; never store credentials or raw client addresses. */
export const adminLoginLimits = pgTable("admin_login_limits", {
  key: text("key").primaryKey(),
  attempts: integer("attempts").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date", precision: 3 }).notNull(),
}, (table) => [
  index("admin_login_limits_expiry_idx").on(table.expiresAt),
  check("admin_login_limits_key", sql`${table.key} ~ '^[a-f0-9]{64}$'`),
  check("admin_login_limits_attempts", sql`${table.attempts} BETWEEN 1 AND 51`),
]);

/** Ownership and cleanup ledger. Live image references below use restrictive FKs. */
export const mediaAssets = pgTable("portfolio_media_assets", {
  id: uuid("id").primaryKey(),
  objectKey: text("object_key").notNull().unique(),
  scopeId: uuid("scope_id").notNull(),
  // Retain the owning project identity after its deletion so cleanup can finish.
  projectId: uuid("project_id"),
  createdBy: text("created_by").notNull(),
  state: mediaState("state").notNull().default("uploading"),
  mimeType: text("mime_type").notNull(),
  byteSize: integer("byte_size").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  sha256: text("sha256").notNull(),
  etag: text("etag"),
  cleanupAfter: timestamp("cleanup_after", { withTimezone: true, mode: "date", precision: 3 }),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date", precision: 3 }).defaultNow().notNull(),
}, (table) => [
  index("portfolio_media_cleanup_idx").on(table.state, table.cleanupAfter),
  index("portfolio_media_project_idx").on(table.projectId),
  check("media_dimensions_positive", sql`${table.width} > 0 AND ${table.height} > 0 AND ${table.width} <= 8192 AND ${table.height} <= 8192 AND ${table.width}::bigint * ${table.height} <= 24000000`),
  check("media_byte_size", sql`${table.byteSize} > 0 AND ${table.byteSize} <= 8388608`),
  check("media_object_key", sql`${table.objectKey} = 'portfolio/images/' || ${table.id}::text || '.webp'`),
  check("media_owner", sql`${table.createdBy} = 'bitmason-admin'`),
  check("media_content", sql`${table.mimeType} = 'image/webp' AND ${table.sha256} ~ '^[a-f0-9]{64}$'`),
  check("media_lifecycle", sql`(${table.state} = 'attached' AND ${table.projectId} IS NOT NULL AND ${table.cleanupAfter} IS NULL) OR (${table.state} <> 'attached' AND ${table.cleanupAfter} IS NOT NULL)`),
]);

export const categories = pgTable("portfolio_categories", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
});

export const projects = pgTable("portfolio_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  categorySlug: text("category_slug").notNull().references(() => categories.slug),
  summary: text("summary").notNull(),
  status: deliveryStatus("delivery_status").notNull().default("concept"),
  publicationStatus: publicationStatus("publication_status").notNull().default("draft"),
  featured: boolean("featured").notNull().default(false),
  order: integer("sort_order").notNull().default(0),
  cover: jsonb("cover").$type<ProjectImage>().notNull(),
  coverAssetId: uuid("cover_asset_id").references(() => mediaAssets.id, { onDelete: "restrict" }),
  overview: jsonb("overview").$type<readonly string[]>().notNull(),
  businessProblem: text("business_problem").notNull(),
  solution: text("solution").notNull(),
  features: jsonb("features").$type<readonly string[]>().notNull(),
  technologies: jsonb("technologies").$type<readonly string[]>().notNull(),
  useCases: jsonb("use_cases").$type<readonly string[]>().notNull(),
  scope: jsonb("scope").$type<readonly string[]>().notNull(),
  deliveryNote: text("delivery_note").notNull(),
  liveUrl: text("live_url"),
  preview: jsonb("preview").$type<NonNullable<PortfolioProject["preview"]>>(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date", precision: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date", precision: 3 }).defaultNow().notNull(),
}, (table) => [index("portfolio_public_order_idx").on(table.publicationStatus, table.order), check("project_slug_format", sql`${table.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`)]);

export const galleryImages = pgTable("portfolio_gallery_images", {
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  id: text("id").notNull(),
  assetId: uuid("asset_id").references(() => mediaAssets.id, { onDelete: "restrict" }),
  src: text("src").notNull(),
  alt: text("alt").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  caption: text("caption").notNull(),
  order: integer("sort_order").notNull(),
  kind: galleryKind("kind").notNull(),
}, (table) => [primaryKey({ columns: [table.projectId, table.id] }), check("gallery_dimensions_positive", sql`${table.width} > 0 AND ${table.height} > 0`)]);
