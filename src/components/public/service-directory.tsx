import Link from "next/link";

import { SectionHeading, SectionLabel } from "@/components/home/section-heading";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { services } from "@/lib/homepage";
import { serviceDetails } from "@/lib/service-details";

export function ServiceDirectory() {
  return (
    <section id="service-directory" tabIndex={-1} className="service-directory section-space" aria-labelledby="directory-title">
      <Container>
        <div className="section-introduction">
          <div><SectionLabel number="02">Services in detail</SectionLabel><SectionHeading id="directory-title">A practical scope.<br />A clear purpose.</SectionHeading></div>
          <p>Choose a starting point below. A project can bring several services together around one business need.</p>
        </div>
        <div className="service-detail-list">
          {services.map((service, index) => {
            const detail = serviceDetails[service.id];
            return (
              <article id={service.id} tabIndex={-1} className="service-detail" key={service.id} aria-labelledby={`${service.id}-title`}>
                <div className="service-detail-heading">
                  <span className="technical-label">{String(index + 1).padStart(2, "0")}</span>
                  <h3 id={`${service.id}-title`}>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <div className="service-detail-body">
                  <p>{detail.explanation}</p>
                  <div className="service-detail-columns">
                    <div><h4 className="technical-label">Typical scope</h4><p>{service.scope}</p></div>
                    <div><h4 className="technical-label">Business use cases</h4><ul>{detail.useCases.map((useCase) => <li key={useCase}>{useCase}</li>)}</ul></div>
                  </div>
                  <p className="service-consideration">{detail.consideration}</p>
                  <Link href="/contact" className="text-link">Discuss your requirements <ArrowIcon /><span className="sr-only"> for {service.title.toLowerCase()}</span></Link>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
