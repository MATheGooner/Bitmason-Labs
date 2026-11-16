import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SkipLink } from "@/components/layout/skip-link";
import { site } from "@/lib/site";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  // The temporary verification route must not be indexed if previewed online.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
