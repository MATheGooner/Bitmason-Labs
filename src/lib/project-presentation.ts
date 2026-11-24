import type { PortfolioProject } from "./portfolio";

// Exact legacy copy matches keep custom admin edits and database records intact.
// These are presentation changes to the five approved independent studies.
const refinedCopy = new Map<string, string>([
  [
    "A fictional Paris restaurant brought into a digital experience, with menu browsing and demonstration ordering and reservation flows.",
    "A hospitality experience bringing menu discovery, ordering and table reservations into one considered customer journey."
  ],
  [
    "The concept brief asks how a restaurant can make its menu, ordering options and table reservations easy to understand while retaining the character of the dining experience.",
    "Help diners understand the menu and choose between ordering and reserving a table, while retaining the character of the dining experience."
  ],
  [
    "A restaurant website with clear menu discovery and separate ordering and reservation journeys. The underlying concept also models the information needed to manage orders and availability.",
    "A restaurant website with clear menu discovery, distinct ordering and reservation journeys, and a data model for orders and availability."
  ],
  [
    "Le Saphir is a self-initiated restaurant concept for a fictional independent business in Paris. It brings a considered hospitality identity together with the practical journeys behind a restaurant website.",
    "Le Saphir brings the character of a Paris dining experience into a purposeful website. Restaurant storytelling and menu discovery lead naturally into ordering and reservation journeys."
  ],
  [
    "The existing implementation includes a database-backed menu, configurable dishes, demonstration orders and table reservations. These describe the scope of the portfolio build, rather than a commissioned restaurant service.",
    "The engineering connects a database-backed menu, configurable dishes and the records behind orders and table reservations. The study explores how the public experience and operational information can work together."
  ],
  [
    "Demonstration collection and delivery orders",
    "Collection and delivery ordering journeys"
  ],
  [
    "Restaurant story page from the existing Le Saphir build. The restaurant and its content are fictional.",
    "Restaurant storytelling and a considered hospitality identity."
  ],
  [
    "Le Saphir concept website showing its restaurant story page.",
    "Le Saphir restaurant website showing its story page."
  ],
  [
    "Illustrative restaurant imagery from the concept’s existing asset collection.",
    "Photography that carries the atmosphere of the dining experience."
  ],
  [
    "Two people discussing food in a kitchen, from the Le Saphir concept imagery.",
    "Two people discussing food in a kitchen."
  ],
  [
    "A service website and a guided quote request journey for a fictional Dublin cleaning company. Clear services, considered steps.",
    "A focused cleaning service website with a guided quote journey that turns customer requirements into a useful brief."
  ],
  [
    "The concept brief focuses on a common service-business task: turn a broad request for help into a clear brief, without making the visitor work through irrelevant questions.",
    "Turn a broad cleaning enquiry into a clear brief without asking visitors to work through irrelevant questions."
  ],
  [
    "A responsive service website and guided enquiry journey that adapts to the type of cleaning requested. Content, service choices and validation remain separate from the page layouts.",
    "A responsive service website with a guided enquiry that adapts to the type of cleaning requested. Service content and validation support a consistent, accessible experience."
  ],
  [
    "EcoShine explores how a focused service website can help people choose the right cleaning service and explain their requirements. The business, service areas and commercial details are fictional.",
    "EcoShine connects service discovery with a focused quote request. The experience helps visitors choose the right cleaning service and provide the information a team needs to respond."
  ],
  [
    "Its existing implementation pairs service pages with a five-step quote request. Residential and commercial branches collect relevant details, with a demonstration confirmation flow.",
    "Residential and commercial journeys collect relevant details through a guided form. Service content, conditional questions and validation work together to keep the enquiry clear."
  ],
  [
    "Five-step quote request with validation",
    "Guided quote request with validation"
  ],
  [
    "Homepage interface from the existing EcoShine build, cropped to its introduction. EcoShine is a fictional business.",
    "Service discovery with a direct path to a focused quote request."
  ],
  [
    "EcoShine concept website with its cleaning service introduction and interior photograph.",
    "EcoShine website introducing its cleaning services beside an interior photograph."
  ],
  [
    "Illustrative cleaning photograph from the project’s existing assets; it does not depict a commissioned client.",
    "Service photography supporting a clear, approachable visual identity."
  ],
  [
    "A cleaner working on upholstered furniture in the EcoShine concept imagery.",
    "A cleaner working on upholstered furniture."
  ],
  [
    "A fictional Manchester trades website, organising plumbing, heating and electrical services around clear visit enquiries.",
    "A service-led trades website making plumbing, heating and electrical work easier to find and enquire about."
  ],
  [
    "The concept brief asks how a multi-service trades company can help visitors identify the relevant service and reach a clear next step, across both desktop and mobile.",
    "Help customers identify the right trade, understand the service and reach a clear next step across desktop and mobile."
  ],
  [
    "A service-led website with dedicated service and location content, direct paths into visit enquiries and a consistent responsive interface.",
    "A service-led website with dedicated service and location content, direct paths into visit enquiries and a consistent responsive interface."
  ],
  [
    "Northfield Home Services is a website demonstration for a fictional Manchester trades business. It organises plumbing, heating and electrical work around the information a visitor needs before requesting a visit.",
    "Northfield Home Services organises a broad trades offering around the information customers need before requesting a visit. Dedicated service and location content give each enquiry a clear starting point."
  ],
  [
    "The portfolio scope covers the public service presentation and enquiry journey. Third-party packages in the original repository are not presented here as verified live business integrations.",
    "The work brings together public service presentation, visit enquiries and consistent responsive layouts. A shared structure keeps the experience useful across desktop and mobile."
  ],
  [
    "Introduction from the existing Northfield build. Fictional ratings and contact details are excluded from this interface crop.",
    "A clear introduction to plumbing, heating and electrical services."
  ],
  [
    "Northfield Home Services concept website introducing plumbing, heating and electrical services.",
    "Northfield Home Services website introducing plumbing, heating and electrical services."
  ],
  [
    "Illustrative trade photograph already used in the concept; it is not evidence of a delivered customer job.",
    "Trade photography supporting the service-led presentation."
  ],
  [
    "Tradesperson beside electrical equipment, from the Northfield concept imagery.",
    "Tradesperson standing beside electrical equipment."
  ],
  [
    "A healthcare portfolio concept exploring service discovery and appointment requests. A demonstration, with no real patient services.",
    "A considered healthcare information experience connecting departments, treatments and appointment requests."
  ],
  [
    "The concept brief explores how to make a broad set of healthcare services understandable and give visitors a considered route towards requesting an appointment.",
    "Make a broad set of healthcare services understandable and give visitors a considered route towards requesting an appointment."
  ],
  [
    "A care discovery interface with department and treatment information, supported by an appointment-request journey and a documented availability model.",
    "A care discovery interface with department and treatment information, supported by an appointment-request journey and an availability model."
  ],
  [
    "Aurelia Private Clinic is a healthcare portfolio implementation, with a public experience centred on departments, treatments and appointment requests. It does not offer real clinical services.",
    "Aurelia Private Clinic explores a calm, structured approach to healthcare information. Departments and treatments give visitors a clear route through the offering and towards an appointment request."
  ],
  [
    "The original project documents an availability and appointment-request model. This study describes that implementation scope without asserting clinical approval, real patient use or a production deployment.",
    "The interface pairs service information with an appointment-request model, including availability rules and validation. The project focuses on information architecture and request journeys."
  ],
  [
    "Practitioner information within the fictional concept",
    "Practitioner information architecture"
  ],
  [
    "Documented availability and request validation",
    "Availability model and request validation"
  ],
  [
    "Public homepage introduction from the original Aurelia concept build. No real clinic or patient service is represented.",
    "Care discovery with clear departments, treatments and next steps."
  ],
  [
    "Aurelia Private Clinic concept website showing its care discovery introduction.",
    "Aurelia Private Clinic website introducing its care discovery experience."
  ],
  [
    "Illustrative healthcare setting from the project’s existing image source; it is not a Bitmason client facility.",
    "Healthcare imagery supporting the calm visual direction."
  ],
  [
    "Bright healthcare interior used as illustrative imagery in the Aurelia concept.",
    "Bright healthcare interior."
  ],
  [
    "A private healthcare concept",
    "Considered healthcare"
  ],
  [
    "A fictional Geneva property agency with editorial property discovery and enquiry journeys. All listings are demonstration content.",
    "An editorial property experience pairing buying and rental discovery with structured, relevant enquiry journeys."
  ],
  [
    "The concept brief asks how to make property discovery feel clear and considered while connecting browsing with a relevant enquiry journey.",
    "Make property discovery clear and considered while connecting browsing with an enquiry relevant to the visitor's intent."
  ],
  [
    "An editorial property website with separate buying and rental paths, structured property information and enquiries related to the visitor’s intent.",
    "An editorial property website with separate buying and rental paths, structured property information and enquiries related to the visitor's intent."
  ],
  [
    "Linden & Co. is a fictional Geneva real estate agency website. Its editorial presentation gives property photography, location context and the distinction between buying and renting space to breathe.",
    "Linden & Co. gives property photography, location context and the distinction between buying and renting space to breathe. Its editorial design supports clear discovery and considered enquiries."
  ],
  [
    "The original implementation includes database-backed property discovery and structured enquiries. All property records are fictional demonstration content, rather than available market listings.",
    "Database-backed property information connects browsing with detailed records and structured enquiries. The experience shows how a catalogue can stay visually expressive while keeping the next step clear."
  ],
  [
    "Structured fictional property records",
    "Structured property information"
  ],
  [
    "Illustrative photography with clear captions",
    "Editorial photography and property presentation"
  ],
  [
    "Homepage from the existing Linden & Co. build. The agency and property records are fictional.",
    "Editorial property discovery with distinct buying and rental journeys."
  ],
  [
    "Linden and Co. concept homepage pairing its Geneva property introduction with a building photograph.",
    "Linden and Co. homepage pairing its property introduction with a building photograph."
  ],
  [
    "Illustrative interior from the original project’s local photography collection; no property availability is implied.",
    "Interior photography supporting the property presentation."
  ],
  [
    "Open-plan living room and kitchen used in the Linden property concept.",
    "Open-plan living room and kitchen."
  ]
]);

export function presentProject(project: PortfolioProject): PortfolioProject {
  if (project.status !== "concept") return project;
  const refine = (text: string) => refinedCopy.get(text) ?? text;
  return {
    ...project,
    summary: refine(project.summary),
    overview: project.overview.map(refine),
    businessProblem: refine(project.businessProblem),
    solution: refine(project.solution),
    features: project.features.map(refine),
    gallery: project.gallery.map((image) => ({ ...image, alt: refine(image.alt), caption: refine(image.caption) })),
    ...(project.preview ? { preview: { ...project.preview, label: refine(project.preview.label) } } : {}),
  };
}
