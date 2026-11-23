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
          <div><SectionLabel>What we build</SectionLabel><SectionHeading id="services-title">Choose a starting point.</SectionHeading></div>
          <p>Explore the scope and use cases for each service, or bring several together in one project.</p>
        </div>
        <ul className="service-index" role="list">
          {services.map((service) => (
            <li key={service.id} id={service.id}>
              <Link href={`/services#${service.id}`} className="service-index-link">
                <span className="service-index-title">{service.title}</span>
                <span className="service-index-description">{service.description}</span>
                <ArrowIcon />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
