import Link from "next/link";

import { Capabilities } from "@/components/home/capabilities";
import { Systems } from "@/components/home/systems";
import { PublicPage } from "@/components/layout/public-page";
import { PageCta } from "@/components/public/page-cta";
import { PageHero } from "@/components/public/page-hero";
import { ServiceDirectory } from "@/components/public/service-directory";
import { buttonClassName } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";
import { services } from "@/lib/homepage";
import { publicPageMetadata } from "@/lib/metadata";

export const metadata = publicPageMetadata("Services", "Websites, e-commerce, custom applications, booking systems, integrations and automation built around customer journeys and business operations.", "/services");

export default function ServicesPage() {
  return (
    <PublicPage activePage="/services">
      <PageHero eyebrow="Digital engineering services" title={<>Build the experience.<br /><span>Connect the business.</span></>} description="Help customers discover your offer, make an enquiry, buy or book. Give your team the software and connections to handle what follows. We define each project around the steps your business needs to improve.">
        <a href="#service-directory" className={buttonClassName()}>Explore the services <ArrowIcon /></a>
        <Link href="/contact" className="text-link">Discuss what you need <ArrowIcon /></Link>
      </PageHero>
      <nav className="service-page-index" aria-label="Service directory">
        <div className="mx-auto max-w-site px-5 sm:px-8 lg:px-12">{services.map((service) => <a key={service.id} href={`#${service.id}`}>{service.title}</a>)}</div>
      </nav>
      <Capabilities />
      <ServiceDirectory />
      <Systems />
      <PageCta title="Start with the business need." />
    </PublicPage>
  );
}
