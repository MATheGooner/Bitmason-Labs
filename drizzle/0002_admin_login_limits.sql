CREATE TABLE "admin_login_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"attempts" integer NOT NULL,
	"expires_at" timestamp (3) with time zone NOT NULL,
	CONSTRAINT "admin_login_limits_key" CHECK ("admin_login_limits"."key" ~ '^[a-f0-9]{64}$'),
	CONSTRAINT "admin_login_limits_attempts" CHECK ("admin_login_limits"."attempts" BETWEEN 1 AND 51)
);
--> statement-breakpoint
CREATE INDEX "admin_login_limits_expiry_idx" ON "admin_login_limits" USING btree ("expires_at");