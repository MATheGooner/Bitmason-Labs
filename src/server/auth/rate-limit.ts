import "server-only";
import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { sql } from "drizzle-orm";
import { publicDatabase } from "@/server/db/client";
import { requireServerEnv } from "@/server/env";

export const LOGIN_WINDOW_SECONDS = 10 * 60;
export const CLIENT_LOGIN_LIMIT = 5;
export const GLOBAL_LOGIN_LIMIT = 50;

/** Only the hosting platform's overwritten address header is trusted. */
export function loginLimitKeys(request: Request) {
  const raw = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() : undefined;
  const address = raw && isIP(raw) ? (isIP(raw) === 6 ? new URL(`http://[${raw}]/`).hostname : raw) : "shared";
  const key = (scope: string) => createHmac("sha256", requireServerEnv("AUTH_SECRET")).update(`admin-login:${scope}`).digest("hex");
  return { global: key("global"), client: key(`client:${address}`) };
}

/** Atomic budgets persist across processes; a missing database fails closed. */
export async function reserveLoginAttempt(db: ReturnType<typeof publicDatabase>, keys: { global: string; client: string }): Promise<boolean> {
  const result = await db.execute(sql`
    WITH expired AS (
      DELETE FROM admin_login_limits
      WHERE expires_at <= CURRENT_TIMESTAMP AND "key" NOT IN (${keys.global}, ${keys.client})
    ), global_budget AS (
      INSERT INTO admin_login_limits ("key", attempts, expires_at)
      VALUES (${keys.global}, 1, CURRENT_TIMESTAMP + ${LOGIN_WINDOW_SECONDS} * INTERVAL '1 second')
      ON CONFLICT ("key") DO UPDATE SET
        attempts = CASE WHEN admin_login_limits.expires_at <= CURRENT_TIMESTAMP THEN 1 ELSE LEAST(admin_login_limits.attempts + 1, 51) END,
        expires_at = CASE WHEN admin_login_limits.expires_at <= CURRENT_TIMESTAMP THEN EXCLUDED.expires_at ELSE admin_login_limits.expires_at END
      RETURNING attempts
    ), client_budget AS (
      INSERT INTO admin_login_limits ("key", attempts, expires_at)
      SELECT ${keys.client}, 1, CURRENT_TIMESTAMP + ${LOGIN_WINDOW_SECONDS} * INTERVAL '1 second'
      FROM global_budget WHERE attempts <= ${GLOBAL_LOGIN_LIMIT}
      ON CONFLICT ("key") DO UPDATE SET
        attempts = CASE WHEN admin_login_limits.expires_at <= CURRENT_TIMESTAMP THEN 1 ELSE LEAST(admin_login_limits.attempts + 1, 51) END,
        expires_at = CASE WHEN admin_login_limits.expires_at <= CURRENT_TIMESTAMP THEN EXCLUDED.expires_at ELSE admin_login_limits.expires_at END
      RETURNING attempts
    ) SELECT EXISTS (SELECT 1 FROM client_budget WHERE attempts <= ${CLIENT_LOGIN_LIMIT}) AS allowed
  `);
  return result.rows[0]?.allowed === true;
}

export async function allowAdminLoginAttempt(request: Request): Promise<boolean> {
  try { return await reserveLoginAttempt(publicDatabase(), loginLimitKeys(request)); }
  catch { console.error("Administrative sign-in protection is unavailable."); return false; }
}
