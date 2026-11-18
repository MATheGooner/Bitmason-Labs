import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { siteIndexingEnabled } from "@/server/launch-policy";

export default function robots(): MetadataRoute.Robots {
  if (!siteIndexingEnabled(process.env)) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }, sitemap: `${site.url}/sitemap.xml` };
}
