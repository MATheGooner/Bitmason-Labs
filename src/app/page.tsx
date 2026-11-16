import type { Metadata } from "next";

import { Capabilities } from "@/components/home/capabilities";
import { Company } from "@/components/home/company";
import { Contact } from "@/components/home/contact";
import { EngineeringApproach } from "@/components/home/engineering-approach";
import { Hero } from "@/components/home/hero";
import { SelectedWork } from "@/components/home/selected-work";
import { Services } from "@/components/home/services";
import { Systems } from "@/components/home/systems";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { publicPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  ...publicPageMetadata(site.title, site.description, "/"),
  title: { absolute: `${site.name} — ${site.title}` },
  description: site.description,
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Company />
        <Capabilities />
        <Services />
        <SelectedWork />
        <Systems />
        <EngineeringApproach />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
