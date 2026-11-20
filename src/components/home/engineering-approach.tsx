import { SectionHeading, SectionLabel } from "@/components/home/section-heading";
import { Container } from "@/components/ui/container";
import { approach } from "@/lib/homepage";

export function EngineeringApproach() {
  return (
    <section id="approach" tabIndex={-1} className="approach-section section-space" aria-labelledby="approach-title">
      <Container>
        <div className="section-introduction"><div><SectionLabel>How we work</SectionLabel><SectionHeading id="approach-title">A clear process.<br />Care at every stage.</SectionHeading></div><p>Clear scope, reviewable milestones and a considered handover. We keep commercial priorities and the people using the software at the centre of delivery.</p></div>
        <ul className="approach-list" role="list">
          {approach.map((step) => <li key={step.stage}><div className="approach-stage"><span className="technical-label">{step.stage}</span></div><h3>{step.title}</h3><p>{step.description}</p><p className="approach-output"><span aria-hidden="true">↳</span> {step.output}</p></li>)}
        </ul>
      </Container>
    </section>
  );
}
