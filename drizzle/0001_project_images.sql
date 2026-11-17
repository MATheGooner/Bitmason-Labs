CREATE TYPE "public"."media_state" AS ENUM('uploading', 'ready', 'attached', 'deleting');--> statement-breakpoint
CREATE TABLE "portfolio_media_assets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"object_key" text NOT NULL,
	"scope_id" uuid NOT NULL,
	"project_id" uuid,
	"created_by" text NOT NULL,
	"state" "media_state" DEFAULT 'uploading' NOT NULL,
	"mime_type" text NOT NULL,
	"byte_size" integer NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"sha256" text NOT NULL,
	"etag" text,
	"cleanup_after" timestamp (3) with time zone,
	"last_error" text,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_media_assets_object_key_unique" UNIQUE("object_key"),
	CONSTRAINT "media_dimensions_positive" CHECK ("portfolio_media_assets"."width" > 0 AND "portfolio_media_assets"."height" > 0 AND "portfolio_media_assets"."width" <= 8192 AND "portfolio_media_assets"."height" <= 8192 AND "portfolio_media_assets"."width"::bigint * "portfolio_media_assets"."height" <= 24000000),
	CONSTRAINT "media_byte_size" CHECK ("portfolio_media_assets"."byte_size" > 0 AND "portfolio_media_assets"."byte_size" <= 8388608),
	CONSTRAINT "media_object_key" CHECK ("portfolio_media_assets"."object_key" = 'portfolio/images/' || "portfolio_media_assets"."id"::text || '.webp'),
	CONSTRAINT "media_owner" CHECK ("portfolio_media_assets"."created_by" = 'bitmason-admin'),
	CONSTRAINT "media_content" CHECK ("portfolio_media_assets"."mime_type" = 'image/webp' AND "portfolio_media_assets"."sha256" ~ '^[a-f0-9]{64}$'),
	CONSTRAINT "media_lifecycle" CHECK (("portfolio_media_assets"."state" = 'attached' AND "portfolio_media_assets"."project_id" IS NOT NULL AND "portfolio_media_assets"."cleanup_after" IS NULL) OR ("portfolio_media_assets"."state" <> 'attached' AND "portfolio_media_assets"."cleanup_after" IS NOT NULL))
);
--> statement-breakpoint
ALTER TABLE "portfolio_gallery_images" ADD COLUMN "asset_id" uuid;--> statement-breakpoint
ALTER TABLE "portfolio_projects" ADD COLUMN "cover_asset_id" uuid;--> statement-breakpoint
CREATE INDEX "portfolio_media_cleanup_idx" ON "portfolio_media_assets" USING btree ("state","cleanup_after");--> statement-breakpoint
CREATE INDEX "portfolio_media_project_idx" ON "portfolio_media_assets" USING btree ("project_id");--> statement-breakpoint
ALTER TABLE "portfolio_gallery_images" ADD CONSTRAINT "portfolio_gallery_images_asset_id_portfolio_media_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."portfolio_media_assets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_cover_asset_id_portfolio_media_assets_id_fk" FOREIGN KEY ("cover_asset_id") REFERENCES "public"."portfolio_media_assets"("id") ON DELETE restrict ON UPDATE no action;