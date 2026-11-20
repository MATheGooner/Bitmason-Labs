import { loadEnvConfig } from "@next/env";
import { readMigrationFiles } from "drizzle-orm/migrator";
import { sql } from "drizzle-orm";
import { site } from "../src/lib/site";
import { ASSET_PUBLIC_ORIGIN } from "../src/lib/media";
import { projectHref } from "../src/lib/portfolio";
import { optionalServerEnv, databaseUrl } from "../src/server/env";
import { passwordHashPattern } from "../src/server/auth/password";
import { publicDatabase } from "../src/server/db/client";
import { queryProjects } from "../src/server/portfolio/queries";
import { r2Configuration, checkImageStorageConnection } from "../src/server/storage/client";
import { publicRobotsPolicyMatches, siteIndexingEnabled } from "../src/server/launch-policy";

loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
const local = process.argv.includes("--local");
const remote = process.argv.includes("--remote");
const indexing = process.argv.includes("--indexing");
let failures = 0;
function result(name: string, passed: boolean) {
  console.log(`${passed ? "PASS" : "FAIL"}: ${name}`);
  if (!passed) failures++;
}
async function check(name: string, run: () => boolean | Promise<boolean>) {
  try { result(name, await run()); } catch { result(name, false); }
}
async function response(path: string) {
  return fetch(new URL(path, site.url), { cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(10_000) });
}

async function main() {
  if (local && (remote || indexing)) throw new Error("Local checks cannot verify a remote launch.");
  console.log(local ? "Local preparation checks; this does not verify a production deployment." : "Production configuration checks; values and credentials are withheld.");
  const names = ["DATABASE_URL", "AUTH_SECRET", "AUTH_URL", "ADMIN_EMAIL", "ADMIN_PASSWORD_HASH", "R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME", "R2_PUBLIC_BASE_URL"] as const;
  for (const name of names) result(`${name} is configured`, Boolean(optionalServerEnv(name)));
  await check("Neon runtime connection configuration is valid", () => Boolean(databaseUrl()));
  if (optionalServerEnv("DATABASE_URL_UNPOOLED")) await check("Direct migration URL targets the runtime database", () => {
    const target = (value: string) => { const url = new URL(value); return `${url.hostname.replace(/-pooler(?=\.)/, "")}${url.pathname}`; };
    return target(databaseUrl()) === target(databaseUrl("DATABASE_URL_UNPOOLED"));
  });
  result("Authentication secret has sufficient length", (optionalServerEnv("AUTH_SECRET")?.length ?? 0) >= 32);
  result("Administrator email configuration is valid", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(optionalServerEnv("ADMIN_EMAIL") ?? ""));
  result("Administrator hash uses the supported scrypt format", passwordHashPattern.test(optionalServerEnv("ADMIN_PASSWORD_HASH") ?? ""));
  await check(local ? "AUTH_URL is a local development origin" : "AUTH_URL is the canonical production HTTPS origin", () => {
    const url = new URL(optionalServerEnv("AUTH_URL") ?? "");
    return !url.username && !url.password && !url.search && !url.hash && url.pathname === "/"
      && (local ? ["http:", "https:"].includes(url.protocol) && ["localhost", "127.0.0.1"].includes(url.hostname) : url.origin === site.url);
  });
  const flag = process.env.SITE_INDEXING_ENABLED;
  result("Indexing flag is absent or an explicit true/false value", !flag || flag === "false" || flag === "true");
  if (indexing) result("Indexing is explicitly enabled for production", siteIndexingEnabled({ ...process.env, NODE_ENV: "production" }));
  else if (flag === "true") console.log("NOTE: Indexing is requested; use --remote --indexing after launch approval to verify delivery.");
  else console.log("PASS: Indexing remains disabled pending production launch approval.");
  await check("R2 configuration uses the required public image origin", () => r2Configuration().publicBase === ASSET_PUBLIC_ORIGIN);
  await check("Read-only R2 bucket connectivity", async () => { await checkImageStorageConnection(); return true; });
  await check("Read-only Neon connectivity and complete migration history", async () => {
    const applied = await publicDatabase().execute(sql`select hash, created_at from drizzle.__drizzle_migrations order by created_at`);
    const expected = readMigrationFiles({ migrationsFolder: "./drizzle" });
    return expected.every((migration) => applied.rows.some((row) => row.hash === migration.hash && Number(row.created_at) === migration.folderMillis));
  });
  await check("Login-limit schema is installed", async () => {
    const value = await publicDatabase().execute(sql`select to_regclass('public.admin_login_limits') is not null as installed`);
    return value.rows[0]?.installed === true;
  });
  let projectPaths: string[] = [];
  await check("Published portfolio data is available", async () => {
    projectPaths = (await queryProjects(publicDatabase(), { publishedOnly: true })).map(({ project }) => projectHref(project));
    return projectPaths.length > 0;
  });
  if (remote) {
    const publicPaths = ["/", "/about", "/services", "/portfolio", "/contact", ...projectPaths];
    await check("Canonical production domain serves HTTPS with security headers", async () => {
      const page = await response("/");
      return page.status === 200 && page.headers.get("x-content-type-options") === "nosniff" && page.headers.get("x-frame-options") === "DENY"
        && Boolean(page.headers.get("content-security-policy")) && Boolean(page.headers.get("strict-transport-security"));
    });
    await check("Public production pages are reachable", async () => {
      for (const path of publicPaths) if ((await response(path)).status !== 200) return false;
      return true;
    });
    await check("Delivered public HTML and headers match the intended indexing policy", async () => {
      for (const path of publicPaths) {
        const page = await response(path);
        if (page.status !== 200 || !publicRobotsPolicyMatches(page.headers, await page.text(), indexing)) return false;
      }
      return true;
    });
    await check("Apex domain redirects to the canonical WWW HTTPS origin", async () => {
      const page = await fetch("https://bitmasonlabs.com", { redirect: "manual", signal: AbortSignal.timeout(10_000) });
      return [301, 308].includes(page.status) && new URL(page.headers.get("location") ?? "").origin === site.url;
    });
    await check("Production administration requires authentication and stays unindexed", async () => {
      const page = await response("/admin/projects");
      const destination = new URL(page.headers.get("location") ?? "", site.url);
      return [302, 303, 307, 308].includes(page.status) && destination.origin === site.url && destination.pathname === "/admin/login"
        && Boolean(page.headers.get("x-robots-tag")?.includes("noindex"));
    });
    await check("Production Auth.js provider URLs use canonical HTTPS", async () => {
      const page = await response("/api/auth/providers");
      const providers = await page.json();
      return page.status === 200 && providers.credentials?.signinUrl === `${site.url}/api/auth/signin/credentials`
        && providers.credentials?.callbackUrl === `${site.url}/api/auth/callback/credentials`;
    });
    await check("Production robots policy matches the intended launch state", async () => {
      const page = await response("/robots.txt");
      const body = await page.text();
      return page.status === 200 && (indexing ? body.includes("Allow: /") && body.includes(`${site.url}/sitemap.xml`) : body.includes("Disallow: /\n") && !body.includes("Allow: /"));
    });
    if (indexing) await check("Published project sitemap is delivered", async () => {
      const page = await response("/sitemap.xml");
      const body = await page.text();
      return page.status === 200 && body.includes(`${site.url}/portfolio/`) && !body.includes("/admin");
    });
  }
  console.log("Owner-password login, inbox delivery and final content approval require separate owner verification; no credentials, data or assets were changed.");
  if (failures) process.exitCode = 1;
}

main().catch(() => { console.error("FAIL: Production preflight could not finish; private configuration details withheld."); process.exitCode = 1; });
