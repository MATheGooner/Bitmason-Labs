import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { EntranceMotion } from "./entrance-motion";
import type { PublicPagePath } from "@/lib/navigation";

export function PublicPage({ activePage, children }: { activePage?: PublicPagePath; children: ReactNode }) {
  return (
    <>
      <SiteHeader {...(activePage ? { activePage } : {})} />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <EntranceMotion />
      <SiteFooter />
    </>
  );
}
