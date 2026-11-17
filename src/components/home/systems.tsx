import Link from "next/link";

import { SectionHeading, SectionLabel } from "@/components/home/section-heading";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";

const systemSteps = [
  { title: "Customer experience", detail: "Website, shop or booking journey", symbol: "01" },
  { title: "Application & API", detail: "Rules, permissions and integrations", symbol: "02" },
  { title: "Business database", detail: "Shared records for your team", symbol: "03" },
  { title: "Team & AI agents", detail: "Prepared actions, reviewed by people", symbol: "04" },
] as const;

export function Systems() {
  return (
    <section id="systems" tabIndex={-1} className="systems-section section-space" aria-labelledby="systems-title">
      <Container>
        <div className="systems-introduction">
          <div><SectionLabel number="05">Beyond the website</SectionLabel><SectionHeading id="systems-title">The front door is only<br />part of the system.</SectionHeading></div>
          <div><p>Your website can connect to the work behind it: customer records, calendars, orders and team dashboards. Assistants and task-specific agents can prepare the next step, using approved information and clear permissions.</p><Link href="/contact" className="text-link">Discuss a connected system <ArrowIcon /></Link></div>
        </div>
        <figure className="system-figure">
          <div className="system-drawing-heading"><span className="technical-label">Fig. 02 — From enquiry to action</span><span className="system-concept-label">Workflow concept · Sample data</span></div>
          <div className="system-interface">
            <div className="system-interface-header"><span className="system-interface-mark" aria-hidden="true">+</span><strong>Operations workspace</strong><span>Illustrative interface</span></div>
            <div className="system-interface-body">
              <div className="system-request-pane">
                <p className="technical-label">Customer enquiry</p>
                <h3>Connect our booking journey.</h3>
                <p className="sample-enquiry">“We’d like appointment requests from our website to reach the right team calendar. Can you help us plan the connection?”</p>
                <dl className="sample-record"><div><dt>Source</dt><dd>Website enquiry</dd></div><div><dt>Record</dt><dd>Project requirements</dd></div><div><dt>Next step</dt><dd>Team review</dd></div></dl>
              </div>
              <div className="system-assistant-pane">
                <div className="assistant-pane-heading"><span className="technical-label">Assistant workspace</span><span className="draft-label">Draft for review</span></div>
                <h3>A prepared response.<br />A person in control.</h3>
                <ol className="assistant-plan"><li><span aria-hidden="true">01</span>Find relevant approved service notes.</li><li><span aria-hidden="true">02</span>Prepare questions about the current tools.</li><li><span aria-hidden="true">03</span>Send the draft to the team for approval.</li></ol>
                <p className="assistant-source"><span aria-hidden="true">↳</span> Example source: integration service notes</p>
                <div className="human-review-note"><span aria-hidden="true">✓</span> Human approval before any reply.</div>
              </div>
            </div>
          </div>
          <ol className="system-flow" aria-label="How the example system connects">
            {systemSteps.map((step) => <li key={step.title}><span className="flow-index" aria-hidden="true">{step.symbol}</span><div><strong>{step.title}</strong><span>{step.detail}</span></div></li>)}
          </ol>
          <figcaption>Illustration of a possible architecture and workflow. This is a concept, not a live Bitmason product.</figcaption>
        </figure>
        <div className="system-principles"><p><span aria-hidden="true">+</span> Connected information</p><p><span aria-hidden="true">+</span> Clear permissions</p><p><span aria-hidden="true">+</span> Human oversight</p></div>
      </Container>
    </section>
  );
}
