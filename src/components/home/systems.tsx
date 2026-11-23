import Link from "next/link";
import { BusinessJourney } from "./business-journey";
import { SectionHeading, SectionLabel } from "@/components/home/section-heading";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";

export function Systems() {
  return <section id="systems" tabIndex={-1} className="systems-section section-space" aria-labelledby="systems-title">
    <Container>
      <div className="systems-introduction">
        <div><SectionLabel>Beyond the website</SectionLabel><SectionHeading id="systems-title">The front door is only<br />part of the system.</SectionHeading></div>
        <div><p>See how an enquiry, order or booking carries information into business operations. This example follows the customer action through to a useful team response.</p><Link href="/contact" className="text-link">Discuss a connected system <ArrowIcon /></Link></div>
      </div>
      <figure className="system-figure">
        <BusinessJourney />
        <figcaption>Automation follows agreed rules. AI assistance uses approved information, with people reviewing consequential actions.</figcaption>
      </figure>
    </Container>
  </section>;
}
