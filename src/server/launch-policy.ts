import { site } from "../lib/site";

interface LaunchEnvironment {
  NODE_ENV?: string;
  SITE_INDEXING_ENABLED?: string;
  AUTH_URL?: string;
  VERCEL?: string;
  VERCEL_ENV?: string;
}

/** Shared with Next configuration; uses only nonsecret launch settings. */
export function siteIndexingEnabled(environment: LaunchEnvironment): boolean {
  if (environment.NODE_ENV !== "production" || environment.SITE_INDEXING_ENABLED !== "true"
    || (environment.VERCEL_ENV && environment.VERCEL_ENV !== "production")
    || (environment.VERCEL === "1" && environment.VERCEL_ENV !== "production")) return false;
  try {
    const url = new URL(environment.AUTH_URL ?? "");
    return url.origin === site.url && url.pathname === "/" && !url.username && !url.password && !url.search && !url.hash;
  } catch { return false; }
}

/** Check delivered HTML as well as headers, so an older noindex build cannot pass launch verification. */
export function publicRobotsPolicyMatches(headers: Headers, html: string, indexing: boolean): boolean {
  const terms = (value: string) => value.toLowerCase().split(/[\s,;:]+/);
  const header = terms(headers.get("x-robots-tag") ?? "");
  const metadata = [...html.matchAll(/<meta\b[^>]*>/gi)].flatMap(([tag]) => {
    const attribute = (name: string) => new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i").exec(tag)?.[2]?.toLowerCase();
    return ["robots", "googlebot"].includes(attribute("name") ?? "") ? [terms(attribute("content") ?? "")] : [];
  });
  if (!metadata.length) return false;
  if (!indexing) return header.includes("noindex") && header.includes("nofollow")
    && metadata.every((value) => value.includes("noindex") && value.includes("nofollow"));
  return metadata.every((value) => value.includes("index") && value.includes("follow"))
    && [header, ...metadata].every((value) => !value.some((term) => ["noindex", "nofollow", "none"].includes(term)));
}
