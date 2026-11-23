import Link from "next/link";
import { BrandMark } from "@/components/layout/brand";
import { SectionHeading, SectionLabel } from "@/components/home/section-heading";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";

export function Company() {
  return (
    <section id="company" tabIndex={-1} className="company-section section-space" aria-labelledby="company-title">
      <Container className="company-grid">
        <div><SectionLabel>The company</SectionLabel><BrandMark className="company-mark" /></div>
        <div>
          <SectionHeading id="company-title">Design and engineering.<br />One connected approach.</SectionHeading>
          <div className="company-body">
            <p>We bring considered design and software engineering together, connecting the experience customers use with the records, tools and workflows behind it.</p>
          </div>
          <Link href="/about" className="text-link company-link">Meet Bitmason Labs <ArrowIcon /></Link>
        </div>
      </Container>
    </section>
  );
}
