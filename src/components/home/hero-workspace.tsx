import { BrandMark } from "@/components/layout/brand";

const requests = [
  { title: "Website enquiry", detail: "New project brief", stage: "Received" },
  { title: "Booking request", detail: "Calendar connection", stage: "In review" },
  { title: "Customer question", detail: "Service information", stage: "Draft ready" },
] as const;

export function HeroWorkspace() {
  return (
    <figure className="hero-figure">
      <div className="drawing-label"><span>Fig. 01 — Connected business</span><span aria-hidden="true">+</span></div>
      <div className="hero-workspace">
        <div className="workspace-header">
          <BrandMark />
          <span>Business workspace</span>
          <span className="workspace-example">Example</span>
        </div>
        <div className="workspace-body">
          <div className="workspace-title"><span>Enquiry pipeline</span><span className="technical-label">Sample data</span></div>
          <p className="workspace-description">From a first enquiry to a considered response.</p>
          <ol className="workspace-requests">
            {requests.map((request, index) => (
              <li key={request.title}>
                <span className="request-index" aria-hidden="true">0{index + 1}</span>
                <div><strong>{request.title}</strong><span>{request.detail}</span></div>
                <span className={`request-stage request-stage-${index}`}>{request.stage}</span>
              </li>
            ))}
          </ol>
          <div className="workspace-assistant">
            <span className="assistant-symbol" aria-hidden="true">✳</span>
            <div><strong>A useful next step.</strong><p>An assistant prepares a draft.<br />Your team makes the decision.</p></div>
            <span className="assistant-review">Human<br />review</span>
          </div>
        </div>
      </div>
      <ol className="hero-connections" aria-label="Example system connections">
        <li><span aria-hidden="true">01</span> Customer website</li>
        <li><span aria-hidden="true">02</span> Business system</li>
        <li><span aria-hidden="true">03</span> Intelligent workflow</li>
      </ol>
      <figcaption>Concept illustration · Example business workflow</figcaption>
    </figure>
  );
}
