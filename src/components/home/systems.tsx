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
        <div><p>Your website can connect to the work behind it: customer records, calendars, orders and team dashboards. Assistants and task-specific agents can prepare the next step, using approved information and clear permissions.</p><Link href="/contact" className="text-link">Discuss a connected system <ArrowIcon /></Link></div>
      </div>
      <figure className="system-figure">
        <BusinessJourney />
        <figcaption>Automation follows agreed rules. AI assistance uses approved information, with people reviewing consequential actions.</figcaption>
      </figure>
      <div className="system-principles"><p><span aria-hidden="true">+</span> Connected information</p><p><span aria-hidden="true">+</span> Clear permissions</p><p><span aria-hidden="true">+</span> Human oversight</p></div>
    </Container>
  </section>;
}
