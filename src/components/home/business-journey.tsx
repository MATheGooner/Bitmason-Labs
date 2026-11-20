"use client";

import { useId, useState } from "react";
import { BrandMark } from "@/components/layout/brand";

const journeys = [
  {
    label: "Enquire",
    title: "A clear brief. A useful response.",
    description: "Help customers explain what they need and reach the right people.",
    steps: [
      { title: "Discover your services", detail: "Relevant content and a clear next step" },
      { title: "Capture the requirements", detail: "A focused form, shaped around the service" },
      { title: "Prepare the follow-up", detail: "Shared context for a considered team response" },
    ],
    operations: ["Validate and organise the enquiry.", "Connect the customer record and assign ownership.", "Prepare relevant information for the team to review."],
    result: "Less re-entry. Better context for every conversation.",
  },
  {
    label: "Buy",
    title: "From product discovery to fulfilment.",
    description: "Bring the storefront and the work behind each order together.",
    steps: [
      { title: "Find the right product", detail: "A clear catalogue and useful product information" },
      { title: "Complete the purchase", detail: "A considered checkout and payment-provider connection" },
      { title: "Track what follows", detail: "Order information shared with the fulfilment team" },
    ],
    operations: ["Validate payment-provider confirmation.", "Connect order records with stock and fulfilment tools.", "Make exceptions visible so the team can resolve them."],
    result: "A purchase journey connected to everyday operations.",
  },
  {
    label: "Book",
    title: "Make room for the next appointment.",
    description: "Connect service selection, appointment requests and staff calendars.",
    steps: [
      { title: "Choose a service", detail: "Clear options and the information to decide" },
      { title: "Request a suitable time", detail: "Availability rules and a focused booking journey" },
      { title: "Confirm the next step", detail: "Calendar connections and clear confirmation responsibilities" },
    ],
    operations: ["Check service, resource and availability rules.", "Route the request to the appropriate staff calendar.", "Let the responsible team confirm or arrange an alternative."],
    result: "Clear requests. Coordinated calendars. A considered handoff.",
  },
] as const;

/** Explains capabilities without presenting fabricated customer records. */
export function BusinessJourney({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState(0);
  const panelId = useId();
  const journey = journeys[selected]!;

  return (
    <div className={`business-journey${compact ? " journey-compact" : ""}`}>
      <div className="journey-choices" role="group" aria-label="Explore a customer journey">
        {journeys.map((item, index) => <button key={item.label} type="button" aria-pressed={index === selected} aria-controls={panelId} onClick={() => setSelected(index)}>{item.label}<span aria-hidden="true">↗</span></button>)}
      </div>
      <div className="hero-workspace" id={panelId} aria-live="polite" aria-atomic="true">
        <div className="workspace-header"><BrandMark /><span>{compact ? "Connected business" : "From customer interest to everyday operations"}</span></div>
        <div className={compact ? "workspace-body" : "system-interface-body"} key={journey.label}>
          <div className={compact ? "journey-customer" : "system-request-pane"}>
            {!compact && <p className="technical-label">Customer experience</p>}
            <h3 className="journey-title">{journey.title}</h3>
            <p className="workspace-description">{journey.description}</p>
            <ul className="workspace-requests" role="list">{journey.steps.map((step) => <li key={step.title}><span className="journey-node" aria-hidden="true" /><div><strong>{step.title}</strong><span>{step.detail}</span></div></li>)}</ul>
          </div>
          {compact ? <p className="journey-result"><span aria-hidden="true">↳</span>{journey.result}</p> : <div className="system-assistant-pane"><p className="technical-label">Connected operations</p><h3>The right information.<br />The right next step.</h3><ul className="journey-operations" role="list">{journey.operations.map((operation) => <li key={operation}>{operation}</li>)}</ul><p className="human-review-note">{journey.result}</p><p className="assistant-source">Automation follows agreed rules. AI assistance uses approved information, with people reviewing consequential actions.</p></div>}
        </div>
      </div>
    </div>
  );
}
