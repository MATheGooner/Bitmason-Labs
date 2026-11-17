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
        title={<>Built around your customers.<br /><span>Connected to your business.</span></>}
        description="Bitmason Labs brings design and software engineering together to help businesses serve customers and improve operations. We start with the commercial need, define a practical scope and build the customer experience and systems around it."
        aside={<figure className="brand-assembly"><div className="brand-assembly-drawing"><BrandMark /></div><figcaption>{site.tagline}</figcaption></figure>}
      >
        <a href="#approach" className="text-link">Explore our approach <ArrowIcon /></a>
      </PageHero>
      <section className="about-philosophy section-space" aria-labelledby="philosophy-title">
        <Container>
          <div className="editorial-split">
            <div><SectionLabel number="01">Engineering philosophy</SectionLabel><SectionHeading id="philosophy-title">Understand the work.<br />Then build the right thing.</SectionHeading></div>
            <div className="editorial-body">
              <p>A website is often the beginning of a wider system. Behind an enquiry, purchase or booking sit business records, team decisions and tools that need to connect.</p>
              <p>We consider that whole picture. Start with the problem, choose a practical scope and give the customer experience the same care as the software behind it.</p>
              <p>Good engineering makes a system understandable: to the people using it, to the team running it and to whoever needs to change it next.</p>
              <Link href="/services" className="text-link">What we can build <ArrowIcon /></Link>
            </div>
          </div>
        </Container>
      </section>
      <section className="about-values section-space" aria-labelledby="values-title">
        <Container>
          <div className="section-introduction"><div><SectionLabel number="02">Working principles</SectionLabel><SectionHeading id="values-title">The details that guide the work.</SectionHeading></div><p>These principles shape how we scope, develop and hand over a project.</p></div>
          <ol className="values-list">
            {companyValues.map((value, index) => <li key={value.title}><span className="technical-label">0{index + 1}</span><div><h3>{value.title}</h3><p>{value.description}</p></div></li>)}
          </ol>
        </Container>
      </section>
      <EngineeringApproach />
      <PageCta />
    </PublicPage>
  );
}
