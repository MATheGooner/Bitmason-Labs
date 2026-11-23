import { SectionHeading, SectionLabel } from "@/components/home/section-heading";
import { Container } from "@/components/ui/container";
import { CapabilityIcon } from "@/components/ui/icons";
import { capabilities } from "@/lib/homepage";

export function Capabilities() {
  return (
    <section id="capabilities" tabIndex={-1} className="capabilities-section section-space" aria-labelledby="capabilities-title">
      <Container>
        <div className="section-introduction">
          <div><SectionLabel>Engineering capabilities</SectionLabel><SectionHeading id="capabilities-title">Design, engineering<br />and applied intelligence.</SectionHeading></div>
          <p>Clear interfaces, dependable software and useful assistance. Each discipline has a role in the work.</p>
        </div>
        <div className="capabilities-grid">
          {capabilities.map((capability) => (
            <article key={capability.title}>
              <div className="capability-top"><CapabilityIcon kind={capability.icon} /></div>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
