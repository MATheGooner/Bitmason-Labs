import Link from "next/link";

import { EngineeringApproach } from "@/components/home/engineering-approach";
import { SectionHeading, SectionLabel } from "@/components/home/section-heading";
import { BrandMark } from "@/components/layout/brand";
import { PublicPage } from "@/components/layout/public-page";
import { PageCta } from "@/components/public/page-cta";
import { PageHero } from "@/components/public/page-hero";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { companyValues } from "@/lib/company";
import { publicPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = publicPageMetadata("About", "Meet Bitmason Labs: design and software engineering around your customers and business operations. Working with businesses internationally.", "/about");

export default function AboutPage() {
  return (
    <PublicPage activePage="/about">
      <PageHero
        eyebrow="The company behind the work"
        title={<>Bitmason Labs.<br /><span>Design meets engineering.</span></>}
        description="We bring design and software engineering together for businesses internationally, connecting customer-facing experiences with the systems behind them."
        aside={<figure className="brand-assembly"><div className="brand-assembly-drawing"><BrandMark /></div><figcaption>{site.tagline}</figcaption></figure>}
      >
        <a href="#approach" className="text-link">Explore our approach <ArrowIcon /></a>
      </PageHero>
      <section className="about-philosophy section-space" aria-labelledby="philosophy-title">
        <Container>
          <div className="editorial-split">
            <div><SectionLabel>Our perspective</SectionLabel><SectionHeading id="philosophy-title">A connected view<br />of the business.</SectionHeading></div>
            <div className="editorial-body">
              <p>We bring the customer-facing experience and the software behind it into one view. Content, interfaces, business records and integrations need to work together.</p>
              <p>The result should remain understandable to the people using it, the team running it and whoever makes the next change.</p>
              <Link href="/services" className="text-link">What we can build <ArrowIcon /></Link>
            </div>
          </div>
        </Container>
      </section>
      <section className="about-values section-space" aria-labelledby="values-title">
        <Container>
          <div className="section-introduction"><div><SectionLabel>Working principles</SectionLabel><SectionHeading id="values-title">The details that guide the work.</SectionHeading></div><p>These principles shape how we scope, develop and hand over a project.</p></div>
          <ul className="values-list" role="list">
            {companyValues.map((value) => <li key={value.title}><div><h3>{value.title}</h3><p>{value.description}</p></div></li>)}
          </ul>
        </Container>
      </section>
      <EngineeringApproach />
      <PageCta />
    </PublicPage>
  );
}
