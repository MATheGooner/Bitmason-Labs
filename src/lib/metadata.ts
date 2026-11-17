import type { Metadata } from "next";

import { site } from "@/lib/site";

export function publicPageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      locale: "en_GB",
      type: "website",
    },
  };
}
