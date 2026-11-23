/** Shared capability, service and delivery copy used by the public pages. */

export const capabilities = [
  {
    title: "Digital experiences",
    description: "Clear content and accessible interfaces for the people using your website or application.",
    detail: "Websites · E-commerce · Customer applications",
    icon: "experience",
  },
  {
    title: "Software engineering",
    description: "Applications, data models and integrations shaped around the work your team needs to do.",
    detail: "Business systems · Dashboards · Integrations",
    icon: "systems",
  },
  {
    title: "AI-powered solutions",
    description: "Assistants and automation for defined tasks, with permissions and staff review built into the workflow.",
    detail: "Assistants · Agents · Workflow automation",
    icon: "intelligence",
  },
] as const;

export const services = [
  {
    id: "service-websites",
    title: "Business websites",
    description: "Explain your offer clearly and give prospective customers a straightforward way to enquire.",
    scope: "Content structure, visual design, responsive development, accessibility and search foundations.",
  },
  {
    id: "service-commerce",
    title: "E-commerce platforms",
    description: "Help customers find the right products, understand delivery and complete a purchase.",
    scope: "Product discovery, checkout journeys and integrations with payment, stock and fulfilment tools.",
  },
  {
    id: "service-applications",
    title: "Web applications",
    description: "Give customers, partners or staff a simpler way to complete a specific task.",
    scope: "Customer portals, account experiences and purpose-built tools, with roles and data flows defined around the task.",
  },
  {
    id: "service-booking",
    title: "Booking systems",
    description: "Make service selection and appointment requests easier for customers and staff.",
    scope: "Service selection, availability rules, booking requests and calendar connections appropriate to your business.",
  },
  {
    id: "service-management",
    title: "Management systems",
    description: "Bring records, approvals and reporting into a workspace your team can use.",
    scope: "Operational dashboards, customer records, order management, approvals and reporting shaped around your team.",
  },
  {
    id: "service-integrations",
    title: "APIs & integrations",
    description: "Connect existing tools so information can move between them with less manual entry.",
    scope: "API design, third-party platform connections, data mapping, validation and recoverable integration workflows.",
  },
  {
    id: "service-automation",
    title: "Automation & applied AI",
    description: "Handle repetitive steps and prepare useful information or actions for staff review.",
    scope: "Workflow automation, document assistants and task-specific agents, with permissions, review steps and evaluation planned from the start.",
  },
  {
    id: "service-redesign",
    title: "Website redesign",
    description: "Address the obstacles between visitors understanding your offer and taking the next step.",
    scope: "An audit of content, usability and performance, followed by design, development and a plan for preserving important URLs.",
  },
] as const;

export const approach = [
  {
    title: "Understand the work.",
    stage: "Discovery",
    description: "Start with your business, your users and the problem to solve. Agree what matters and what success should look like.",
    output: "A clear brief & practical scope",
  },
  {
    title: "Design the foundations.",
    stage: "Architecture",
    description: "Map the experience, the information and the connections. Make the important decisions before they become expensive changes.",
    output: "Experience, system & delivery plan",
  },
  {
    title: "Build with care.",
    stage: "Development",
    description: "Develop in reviewable stages. Test the journeys, handle the edge cases and keep you close to the work as it takes shape.",
    output: "Working software & regular reviews",
  },
  {
    title: "Deliver for the long term.",
    stage: "Delivery",
    description: "Prepare a considered launch, document the system and make the handover useful. Agree how the work will be maintained.",
    output: "Tested release & clear handover",
  },
] as const;
