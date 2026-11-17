import { SectionHeading, SectionLabel } from "@/components/home/section-heading";
import { Container } from "@/components/ui/container";
import { CapabilityIcon } from "@/components/ui/icons";
import { capabilities } from "@/lib/homepage";

export function Capabilities() {
  return (
    <section id="capabilities" tabIndex={-1} className="capabilities-section section-space" aria-labelledby="capabilities-title">
      <Container>
        <div className="section-introduction">
          <div><SectionLabel number="02">Engineering capabilities</SectionLabel><SectionHeading id="capabilities-title">Three disciplines.<br />One connected business.</SectionHeading></div>
          <p>From the first customer interaction to the systems behind it, we build the parts that make the whole work better.</p>
        </div>
        <div className="capabilities-grid">
          {capabilities.map((capability) => (
            <article key={capability.number}>
              <div className="capability-top"><CapabilityIcon kind={capability.icon} /><span className="technical-label">{capability.number}</span></div>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
              <p className="capability-detail">{capability.detail}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
