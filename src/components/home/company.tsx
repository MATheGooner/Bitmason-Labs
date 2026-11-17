import { BrandMark } from "@/components/layout/brand";
import { SectionHeading, SectionLabel } from "@/components/home/section-heading";
import { Container } from "@/components/ui/container";

export function Company() {
  return (
    <section id="company" tabIndex={-1} className="company-section section-space" aria-labelledby="company-title">
      <Container className="company-grid">
        <div><SectionLabel number="01">The company</SectionLabel><BrandMark className="company-mark" /></div>
        <div>
          <SectionHeading id="company-title">An engineering partner for the way your business works.</SectionHeading>
          <div className="company-body">
            <p>Your customer’s next step matters: understanding a service, requesting a quote, making a purchase or booking a time. Your team needs a clear way to handle what follows.</p>
            <p>Bitmason Labs brings design and software engineering together around those needs. We connect the experience customers use with the records, tools and workflows behind it.</p>
          </div>
          <p className="company-principle"><span aria-hidden="true">+</span> Considered design. Reliable engineering. One connected approach.</p>
        </div>
      </Container>
    </section>
  );
}
