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
    explanation: "Content, navigation and enquiry journeys are planned together, then developed as an accessible experience across devices.",
    useCases: ["A new company website", "A clearer service proposition", "Structured business enquiries"],
    consideration: "We agree how your team will update content and which search, performance and accessibility requirements matter to the project.",
  },
  "service-commerce": {
    explanation: "Plan the connections between the storefront, payments, stock and fulfilment, with provider responsibilities made explicit.",
    useCases: ["Product catalogues and online stores", "Retail or B2B purchase journeys", "Connections to stock and fulfilment tools"],
    consideration: "Platform choice follows your catalogue, sales model and operations. Provider accounts, integrations and payment testing are part of the agreed scope.",
  },
  "service-applications": {
    explanation: "Define the users, information and permitted actions, then build the interface and data model around their workflow.",
    useCases: ["Customer and partner portals", "Internal team tools", "Purpose-built browser applications"],
    consideration: "Roles, permissions, validation and important edge cases are defined before the interface is treated as finished.",
  },
  "service-booking": {
    explanation: "Separate appointment requests from confirmations, then connect availability rules, calendars and staff review.",
    useCases: ["Appointment requests", "Service and resource booking", "Calendar-connected customer journeys"],
    consideration: "Availability rules, cancellations, confirmation responsibilities and timezone behaviour need to match the actual service.",
  },
  "service-management": {
    explanation: "Shape a shared workspace around the records, approvals and handoffs that currently sit in spreadsheets or disconnected tools.",
    useCases: ["Customer and order records", "Approvals and operational dashboards", "Team reporting and work queues"],
    consideration: "We define data ownership, access, migration and the meaning of reports before relying on a dashboard to guide decisions.",
  },
  "service-integrations": {
    explanation: "Map records and define API contracts, including failure recovery, retries and changes in connected platforms.",
    useCases: ["CRM and commerce connections", "Shared data across business tools", "APIs for customers or partners"],
    consideration: "Provider limits, permissions and recovery behaviour are part of the design. An integration needs an accountable source for each piece of information.",
  },
  "service-automation": {
    explanation: "Map repeatable steps, route information and retrieve relevant business knowledge. AI can prepare a task for staff approval.",
    useCases: ["Routine information routing", "Document and knowledge assistants", "Task-specific agents with staff review"],
    consideration: "We agree data access, permissions, review steps and how the workflow will be evaluated before implementation.",
  },
  "service-redesign": {
    explanation: "Review visitor needs, navigation, content and existing integrations before agreeing which changes to make.",
    useCases: ["An outdated business website", "Confusing navigation or enquiry paths", "A careful platform or content migration"],
    consideration: "Important URLs, content ownership, search visibility and ongoing operations need a migration plan alongside the new design.",
  },
};
