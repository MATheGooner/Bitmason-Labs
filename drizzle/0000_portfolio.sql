CREATE TYPE "public"."delivery_status" AS ENUM('concept', 'completed');--> statement-breakpoint
CREATE TYPE "public"."gallery_kind" AS ENUM('interface', 'photograph');--> statement-breakpoint
CREATE TYPE "public"."publication_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "portfolio_categories" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_gallery_images" (
	"project_id" uuid NOT NULL,
	"id" text NOT NULL,
	"src" text NOT NULL,
	"alt" text NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"caption" text NOT NULL,
	"sort_order" integer NOT NULL,
	"kind" "gallery_kind" NOT NULL,
	CONSTRAINT "portfolio_gallery_images_project_id_id_pk" PRIMARY KEY("project_id","id"),
	CONSTRAINT "gallery_dimensions_positive" CHECK ("portfolio_gallery_images"."width" > 0 AND "portfolio_gallery_images"."height" > 0)
);
--> statement-breakpoint
CREATE TABLE "portfolio_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category_slug" text NOT NULL,
	"summary" text NOT NULL,
	"delivery_status" "delivery_status" DEFAULT 'concept' NOT NULL,
	"publication_status" "publication_status" DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"cover" jsonb NOT NULL,
	"overview" jsonb NOT NULL,
	"business_problem" text NOT NULL,
	"solution" text NOT NULL,
	"features" jsonb NOT NULL,
	"technologies" jsonb NOT NULL,
	"use_cases" jsonb NOT NULL,
	"scope" jsonb NOT NULL,
	"delivery_note" text NOT NULL,
	"live_url" text,
	"preview" jsonb,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_projects_slug_unique" UNIQUE("slug"),
	CONSTRAINT "project_slug_format" CHECK ("portfolio_projects"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);
--> statement-breakpoint
ALTER TABLE "portfolio_gallery_images" ADD CONSTRAINT "portfolio_gallery_images_project_id_portfolio_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_category_slug_portfolio_categories_slug_fk" FOREIGN KEY ("category_slug") REFERENCES "public"."portfolio_categories"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "portfolio_public_order_idx" ON "portfolio_projects" USING btree ("publication_status","sort_order");