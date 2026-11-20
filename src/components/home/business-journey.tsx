"use client";

import { useId, useState } from "react";
import type { KeyboardEvent } from "react";

const journeys = [
  {
    label: "Enquire",
    title: "A clear brief. A useful response.",
    interest: "A customer discovers your services.",
    interaction: "They tell you what they need.",
    detail: "A focused enquiry captures the requirements and gives the conversation a clear starting point.",
    handoff: "The enquiry carries",
    information: ["Service", "Requirements", "Contact details"],
    operations: [
      { title: "Validate & organise", detail: "Check the requirements and create a useful customer record." },
      { title: "Connect & assign", detail: "Share the brief with the right people and make ownership clear." },
      { title: "Prepare the response", detail: "Bring relevant information together for the team to review." },
    ],
    action: "The right person can respond with the full picture.",
    result: "Less re-entry. Better context for every conversation.",
  },
  {
    label: "Buy",
    title: "From product discovery to fulfilment.",
    interest: "A customer finds the right product.",
    interaction: "Checkout turns interest into an order.",
    detail: "A considered checkout brings product choices, delivery details and a payment-provider connection together.",
    handoff: "The order carries",
    information: ["Product choices", "Delivery details", "Payment status"],
    operations: [
      { title: "Verify the payment", detail: "Validate the payment provider’s confirmation before progressing the order." },
      { title: "Connect stock & orders", detail: "Share the order with stock and fulfilment tools." },
      { title: "Coordinate fulfilment", detail: "Make exceptions visible so the team can resolve them." },
    ],
    action: "Fulfilment can move forward with a clear, verified order.",
    result: "A purchase journey connected to everyday operations.",
  },
  {
    label: "Book",
    title: "Make room for the next appointment.",
    interest: "A customer chooses a service.",
    interaction: "They request a suitable time.",
    detail: "Clear service options and availability rules help customers make a focused appointment request.",
    handoff: "The request carries",
    information: ["Chosen service", "Preferred time", "Contact details"],
    operations: [
      { title: "Check availability", detail: "Check the service, resource and availability rules." },
      { title: "Connect the calendar", detail: "Route the request to the appropriate staff calendar." },
      { title: "Prepare confirmation", detail: "Give the responsible team the context to confirm or suggest an alternative." },
    ],
    action: "Your team can confirm the appointment or arrange an alternative.",
    result: "Clear requests. Coordinated calendars. A considered handoff.",
  },
] as const;

/** Follow the information shared by a customer and a business, without invented records. */
export function BusinessJourney({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const journey = journeys[selected]!;

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % journeys.length; break;
      case "ArrowLeft": next = (index + journeys.length - 1) % journeys.length; break;
      case "Home": next = 0; break;
      case "End": next = journeys.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setSelected(next);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  }

  return <div className={`business-journey${compact ? " journey-compact" : ""}`}>
    <div className="journey-choices" role="tablist" aria-label="Explore a customer journey">
      {journeys.map((item, index) => <button key={item.label} id={`${id}-tab-${index}`} type="button" role="tab" aria-selected={index === selected} aria-controls={`${id}-panel`} tabIndex={index === selected ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={(event) => navigate(event, index)}>{item.label}</button>)}
    </div>
    <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${selected}`} tabIndex={0}>
      <h3 className="journey-headline">{journey.title}</h3>
      <div className="journey-story" key={journey.label}>
        <div className="journey-customer">
          <p className="journey-interest">{journey.interest}</p>
          <h4>{journey.interaction}</h4>
          <p className="journey-detail">{journey.detail}</p>
        </div>
        <div className="journey-handoff">
          <p>{journey.handoff}</p>
          <ul role="list" aria-label="Information shared with business operations">{journey.information.map((information) => <li key={information}>{information}</li>)}</ul>
          <span className="journey-transfer" aria-hidden="true" />
        </div>
        <div className="journey-business">
          <p className="journey-business-label">Connected operations</p>
          <ul role="list">{journey.operations.map((operation) => <li key={operation.title}><h4>{operation.title}</h4><p className="journey-operation-detail">{operation.detail}</p></li>)}</ul>
        </div>
        <div className="journey-next">
          <h4>{journey.action}</h4>
          <p>{journey.result}</p>
        </div>
      </div>
    </div>
    <p className="sr-only" aria-live="polite" aria-atomic="true">{journey.label}: {journey.action}</p>
  </div>;
}
