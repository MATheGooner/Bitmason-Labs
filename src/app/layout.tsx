import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { SkipLink } from "@/components/layout/skip-link";
import { site } from "@/lib/site";
import { themeInitialisationScript } from "@/lib/theme";
import { siteIndexingEnabled } from "@/server/launch-policy";
import "@/styles/globals.css";

const manrope = localFont({
  src: "../../public/fonts/manrope-latin-variable.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-manrope",
  display: "swap",
});

const plexMono = localFont({
  src: "../../public/fonts/ibm-plex-mono-latin-regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  // The owner enables indexing only after the production launch checks pass.
  robots: { index: siteIndexingEnabled(process.env), follow: siteIndexingEnabled(process.env) },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={`${manrope.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitialisationScript }} />
      </head>
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
