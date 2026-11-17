import type { services } from "@/lib/homepage";

type ServiceId = (typeof services)[number]["id"];

interface ServiceDetail {
  readonly explanation: string;
  readonly useCases: readonly string[];
  readonly consideration: string;
}

/** Detailed buyer-facing copy, keyed to the established homepage services. */
export const serviceDetails: Record<ServiceId, ServiceDetail> = {
  "service-websites": {
    explanation: "Build a website that makes your offer understandable and gives visitors a clear next step. We shape the content, navigation and enquiry journeys together, then develop an accessible experience across devices.",
    useCases: ["A new company website", "A clearer service proposition", "Structured business enquiries"],
    consideration: "We agree how your team will update content and which search, performance and accessibility requirements matter to the project.",
  },
  "service-commerce": {
    explanation: "Consider the complete purchase journey, from finding a product to understanding delivery and managing an order. The storefront and its operational connections need to work together, with payment and stock responsibilities made explicit.",
    useCases: ["Product catalogues and online stores", "Retail or B2B purchase journeys", "Connections to stock and fulfilment tools"],
    consideration: "Platform choice follows your catalogue, sales model and operations. Provider accounts, integrations and payment testing are part of the agreed scope.",
  },
  "service-applications": {
    explanation: "Create browser-based software for a defined job. We map who uses it, the information they need and the actions they can take, then build an interface and data model around that workflow.",
    useCases: ["Customer and partner portals", "Internal team tools", "Purpose-built browser applications"],
    consideration: "Roles, permissions, validation and important edge cases are defined before the interface is treated as finished.",
  },
  "service-booking": {
    explanation: "Make it easier to choose a service and request a suitable time. We distinguish requests from confirmed appointments and plan how availability, calendar connections and staff review should work for your business.",
    useCases: ["Appointment requests", "Service and resource booking", "Calendar-connected customer journeys"],
    consideration: "Availability rules, cancellations, confirmation responsibilities and timezone behaviour need to match the actual service.",
  },
  "service-management": {
    explanation: "Bring operational information into a system your team can use. Start with the records, approvals and handoffs that currently sit across spreadsheets or disconnected tools, then shape a practical workspace.",
    useCases: ["Customer and order records", "Approvals and operational dashboards", "Team reporting and work queues"],
    consideration: "We define data ownership, access, migration and the meaning of reports before relying on a dashboard to guide decisions.",
  },
  "service-integrations": {
    explanation: "Connect applications without losing track of what happened between them. We map records, define API contracts and plan for failures, retries and changes in the platforms you depend on.",
    useCases: ["CRM and commerce connections", "Shared data across business tools", "APIs for customers or partners"],
    consideration: "Provider limits, permissions and recovery behaviour are part of the design. An integration needs an accountable source for each piece of information.",
  },
  "service-automation": {
    explanation: "Identify repetitive steps that software can handle, then add assistance where it is useful. That might mean routing records, retrieving answers from business documents or preparing a task for a person to approve.",
    useCases: ["Routine information routing", "Document and knowledge assistants", "Task-specific agents with staff review"],
    consideration: "We agree data access, permissions, review steps and how the workflow will be evaluated before implementation.",
  },
  "service-redesign": {
    explanation: "Improve an existing website with a clear reason for each change. Review what visitors need, what the current experience makes difficult and which content or integrations should be retained.",
    useCases: ["An outdated business website", "Confusing navigation or enquiry paths", "A careful platform or content migration"],
    consideration: "Important URLs, content ownership, search visibility and ongoing operations need a migration plan alongside the new design.",
  },
};
