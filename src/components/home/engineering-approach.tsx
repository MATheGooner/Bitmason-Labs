import { SectionHeading, SectionLabel } from "@/components/home/section-heading";
import { Container } from "@/components/ui/container";
import { approach } from "@/lib/homepage";

export function EngineeringApproach() {
  return (
    <section id="approach" tabIndex={-1} className="approach-section section-space" aria-labelledby="approach-title">
      <Container>
        <div className="section-introduction"><div><SectionLabel number="06">How we work</SectionLabel><SectionHeading id="approach-title">A clear process.<br />Care at every stage.</SectionHeading></div><p>Practical decisions, regular conversations and a considered handover. Good engineering should make the project easier to understand.</p></div>
        <ol className="approach-list">
          {approach.map((step, index) => <li key={step.stage}><div className="approach-stage"><span aria-hidden="true">0{index + 1}</span><span className="technical-label">{step.stage}</span></div><h3>{step.title}</h3><p>{step.description}</p><p className="approach-output"><span aria-hidden="true">↳</span> {step.output}</p></li>)}
        </ol>
      </Container>
    </section>
  );
}
