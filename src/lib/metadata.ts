import type { Metadata } from "next";

import { site } from "@/lib/site";

type SharingImage = { url: string; width: number; height: number; alt: string };
const brandImage: SharingImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — ${site.title}` };

export function publicPageMetadata(title: string, description: string, path: string, image: SharingImage = brandImage): Metadata {
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
      images: [image],
    },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description, images: [image] },
  };
}
