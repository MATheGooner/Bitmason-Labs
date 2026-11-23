import Link from "next/link";

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
      <PageHero eyebrow="Digital engineering services" title={<>Build the experience.<br /><span>Connect the business.</span></>} description="Eight services for customer-facing websites and the software behind them. Explore typical scope, business use cases and planning considerations.">
        <a href="#service-directory" className={buttonClassName()}>Explore the services <ArrowIcon /></a>
        <Link href="/contact" className="text-link">Discuss a project <ArrowIcon /></Link>
      </PageHero>
      <nav className="service-page-index" aria-label="Service directory">
        <div className="mx-auto max-w-site px-5 sm:px-8 lg:px-12">{services.map((service) => <a key={service.id} href={`#${service.id}`}>{service.title}</a>)}</div>
      </nav>
      <ServiceDirectory />
      <PageCta title="Start with the business need." />
    </PublicPage>
  );
}
