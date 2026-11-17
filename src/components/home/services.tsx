import Link from "next/link";

import { SectionHeading, SectionLabel } from "@/components/home/section-heading";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { services } from "@/lib/homepage";

export function Services() {
  return (
    <section id="services" tabIndex={-1} className="services-section section-space" aria-labelledby="services-title">
      <Container>
        <div className="section-introduction">
          <div><SectionLabel number="03">What we build</SectionLabel><SectionHeading id="services-title">Built around your next move.</SectionHeading></div>
          <p>Attracting customers, supporting enquiries and sales, securing bookings or improving operations. Start with the step your business needs to make easier.</p>
        </div>
        <div className="service-list">
          {services.map((service, index) => (
            <details key={service.id} id={service.id} className="service-disclosure">
              <summary>
                <span className="service-index" aria-hidden="true">0{index + 1}</span>
                <span className="service-title">{service.title}</span>
                <span className="service-description">{service.description}</span>
                <span className="disclosure-symbol" aria-hidden="true" />
              </summary>
              <div className="service-scope">
                <p><span className="technical-label">Typical scope</span>{service.scope}</p>
                <Link href="/contact" className="text-link">Discuss your requirements <ArrowIcon /></Link>
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
