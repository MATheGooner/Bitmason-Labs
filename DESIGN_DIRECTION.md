# Bitmason Labs — design direction

Batch 1 · 14 November 2026 · Research and blueprint only.

## Current direction — approved refinement, 16 November 2026

This checkpoint preceded Batch 4, after the completion of Batch 3. The
six-batch roadmap is unchanged. This section supersedes the historical public
positioning and exact-tagline requirements below; the original research remains
as a record of Batch 1.

- Eyebrow: **Digital engineering for business.**
- Headline: **Make it easier to choose you. Make the work behind it simpler.**
- Supporting copy: **We build websites, online stores and custom software that
  help customers understand your offer, enquire, buy and book. We connect those
  journeys to the tools and workflows your team uses.**
- Signature: **From customer interest to everyday operations.**
- Actions: **Discuss a project** and **Explore what we build**.
- Geographic wording: **Working with businesses internationally.** Europe is the
  initial acquisition focus, not a service boundary.

Lead with the commercial purpose of each service. Describe how customer journeys
and team workflows can improve, without guaranteed results, invented clients or
unsupported metrics. Retain all five fictional concepts and their disclosures.

Preserve the logo, Manrope/IBM Plex Mono typography, warm light palette, green and
copper identity, editorial layouts and original illustrations. Small labels are
at least 12px; open service rows have a quiet surface treatment. The About mark
remains a visual brand device without origin-story annotations.

Theme choices are System, Light and Dark. Semantic tokens define both palettes,
including contrasting on-accent text and a separate inverse systems-section
palette. CSS provides automatic system behaviour; valid manual preferences are
applied before paint and saved in localStorage. Controls stay native and keyboard
accessible. No new dependency, provider or backend theme storage is needed.

The implemented checkpoint passed lint, strict TypeScript, production build,
responsive public-page and contrast checks in both palettes, preference and
before-hydration checks, and native no-JS navigation/form flows. Production and
localhost development checks confirmed draft focus and stale-draft removal.
Detailed results and testing limits are recorded in `PROJECT_PROGRESS.md`.

**Batch 4 (Phases 06–07) is now complete.** Current implementation and validation
are recorded in `PROJECT_PROGRESS.md`. Batch 5 has not started; the approved
design and six-batch roadmap are unchanged.

## Historical Batch 1 positioning and design objective

Bitmason Labs is a B2B digital engineering company for European SMEs. It combines
customer-facing digital experiences, operational software and applied AI.
**Computing + craftsmanship.** expresses the relationship between rigorous
engineering and considered design.

The site should help an owner, operations lead or technology lead understand
what Bitmason can build, how that relates to their business, and how a project
would be delivered. Use the voice of a company: clear scope, accountable work,
maintainable systems and thoughtful execution. Avoid a personal portfolio voice,
inflated transformation promises, invented scale and a technology-logo sales pitch.

## Research method and genuine references

Reviewed primary websites and service/case-study pages on 14 November 2026.
Rendered Chromium inspection covered desktop at **1440 × 1000** and mobile at
**390 × 844**. Computed typography, screenshots and navigation controls informed
the observations below; these are observations of those viewports, not exhaustive
accessibility or performance audits. Company sites change over time.

The firms below are benchmarks with European roots or operations. Their scale
and audiences differ from Bitmason's SME market. Borrow communication principles,
then develop an original layout, identity, wording and imagery.

| Reference | Why it is useful | Pages reviewed |
| --- | --- | --- |
| Futurice, Finland | Engineering, design and AI presented through business problems | [Homepage](https://www.futurice.com/), [services](https://www.futurice.com/services), [case-study index](https://www.futurice.com/case-studies), [EnBW AI case](https://www.futurice.com/case-studies/enbw-genai-customercare) |
| Netguru, Poland | Software breadth, commerce systems and integration evidence | [Homepage](https://www.netguru.com/), [software services](https://www.netguru.com/services/software-development), [project index](https://www.netguru.com/clients), [Żabka systems case](https://www.netguru.com/clients/autonomous-stores-zabka) |
| DEPT, Netherlands / international | Confident editorial hierarchy and broad engineering services | [Homepage](https://www.dept.global/), [tech and data services](https://www.dept.global/solutions/tech-data/), [work](https://www.dept.global/work/) |
| ustwo, United Kingdom / Sweden | Distinctive product studio identity and interface-led project storytelling | [Homepage](https://ustwo.com/), [services](https://ustwo.com/services/), [The i Paper case](https://ustwo.com/work/the-i-paper/), [AI](https://ustwo.com/ai/) |
| Made Tech, United Kingdom | Explicit separation of engineering services and actual products | [Homepage](https://www.madetech.com/), [cloud and engineering](https://www.madetech.com/services/cloud-and-engineering/), [case studies](https://www.madetech.com/case-studies/) |

Made Tech's text pages were accessible through the research tool, but direct
Chromium requests received an HTTP 403 protection page. It is a messaging and
service-structure benchmark only; no typography or rendered-layout conclusions
are drawn from that protection page. The other four homepages and three detailed
cases were rendered successfully. Small, dated technical observations are kept
in [docs/research/reference-observations.json](docs/research/reference-observations.json).
Local screenshots remain in `.local/research/`, outside published assets and Git.

### Typography and visual identity observed

| Site | Computed type at the reviewed desktop viewport | Visual observation | Useful principle for Bitmason |
| --- | --- | --- | --- |
| Futurice | Manrope; main heading 56px, weight 450; mobile heading 32px | Deep green, white type, a wide geometric illustration and generous empty space | Calm spacing and a legible hierarchy can carry technical authority |
| Netguru | DM Sans; main heading 90px, weight 400; mobile heading about 51px | Dark hero, vivid green emphasis, then lighter project and service areas | Let a precise positioning statement precede detailed capabilities |
| DEPT | Inter Variable; main heading 112px, weight 900; mobile heading 44px | Black/white, orange emphasis, very large editorial type | Establish a strong type scale and clear section changes |
| ustwo | ABC Diatype Condensed for display; ABC Diatype for body; responsive oversized display type | Handwritten wordmark, coloured moving surfaces, condensed typography and varied project compositions | Distinctiveness comes from a coherent identity and product storytelling |

The figures describe observed CSS, not font licensing rights or specifications to
copy. Bitmason's sentence-case type, restrained palette, drawing details and
system-focused imagery will create a separate identity.

### Homepage hierarchy, navigation and services

**Futurice:** the homepage moves from positioning into outcomes, capability
groups, work and client evidence. Its navigation exposes services, case studies
and company information. Mobile navigation uses an explicitly labelled toggle.
The EnBW case separates the operational problem, exploratory work, implementation
and measured results. This is a useful model for explaining applied AI through
an actual workflow and the evidence behind a claim.
Sources: [homepage](https://www.futurice.com/),
[EnBW case](https://www.futurice.com/case-studies/enbw-genai-customercare).

**Netguru:** the homepage now leads with commerce positioning and a media-rich
hero, followed by projects and broad capabilities. Its navigation has a large
services taxonomy. The Żabka case describes connected system components and
uses an ecosystem illustration alongside real retail imagery. This demonstrates
engineering contribution beyond a polished front end. Bitmason needs a shorter
SME-oriented service index and clear explanations of integration responsibilities.
Sources: [homepage](https://www.netguru.com/),
[Żabka case](https://www.netguru.com/clients/autonomous-stores-zabka).

**DEPT:** an oversized headline and a visible contact action lead into AI,
project stories and numbered service groups. Work teasers pair a client/sector
context with an outcome-oriented title. Its tech page moves through architecture,
data, product development and platform integration. Bitmason can use confident
type and varied section proportions while retaining concrete, narrower service
language for smaller businesses.
Sources: [homepage](https://www.dept.global/),
[tech and data](https://www.dept.global/solutions/tech-data/).

**ustwo:** the homepage introduces product-focused positioning before work,
feedback and delivery capabilities. Navigation gives work and services clear
destinations. The i Paper case alternates a readable narrative column with
large interface and design artefacts; its delivery list distinguishes design
outputs and prototypes from launched experiences. Use that specificity when
describing what Bitmason actually contributed to a project.
Sources: [homepage](https://ustwo.com/),
[The i Paper case](https://ustwo.com/work/the-i-paper/).

**Made Tech:** the primary text explicitly separates consultancy services from
named housing products, with engineering, design and AI in the service structure.
Its public-sector audience differs from Bitmason's target. The transferable
principle is to distinguish what a company offers to build from products that
already exist. Source: [homepage](https://www.madetech.com/).

### Interactions and imagery: conclusions

The references use prominent contact routes, service navigation, mobile menus,
large media and case narratives. Futurice's mobile toggle was exercised and
changed `aria-expanded` from false to true; DEPT's mobile Menu control was also
opened. Some other menu and consent behaviour limited automated inspection, so
their complete interaction behaviour is not asserted here.

Bitmason should keep the navigation compact, make important content immediately
visible, and use transitions only to explain state changes. Product screenshots
need readable interface details and captions; system illustrations need meaningful
connections. Neither decorative motion nor a mock dashboard establishes delivery
evidence. These are design decisions drawn from the research, not claims about
competitor implementation quality.

## Bitmason's visual identity

### Overall direction

An editorial technology company with the precision of a working drawing.
Use warm paper surfaces, dark ink, fine rules, restrained numbered annotations,
and carefully composed product interfaces. Craft appears in proportion, alignment,
type and small details. Computing appears in meaningful system relationships and
real software artefacts.

The proposed wordmark is **Bitmason Labs** in a precise sans-serif arrangement,
with a compact original geometric mark built from two offset rectangular units.
The mark should suggest assembly and a positive junction without resembling a
blockchain token, generic brackets icon or another company's logo. Final SVG
drawing belongs to Batch 2. Use the tagline exactly, including its full stop.

### Palette

These semantic tokens already exist in `src/styles/globals.css`. Paper and ink
dominate; green identifies actions and selected technical accents. Copper is
limited to small annotations. Project screenshots may contain their own colours.

| Token | Hex | Role |
| --- | --- | --- |
| `paper` | `#F6F5F0` | Main canvas |
| `surface` | `#ECECE4` | Quiet inset fields and diagram backgrounds |
| `ink` | `#202623` | Text and one substantial systems/AI section |
| `muted` | `#57615A` | Secondary text and captions |
| `line` | `#CBD0C7` | Decorative separators and drawing guides |
| `accent` | `#185442` | Primary action, active state, useful connectors |
| `accent-hover` | `#123E31` | Primary action hover state |
| `copper` | `#A4492D` | Occasional index or engineering annotation |

Calculated WCAG contrast ratios: ink on paper **14.12:1**, muted on paper
**5.90:1**, white on accent **8.80:1**, copper on paper **5.39:1**. The pale line
token has only **1.44:1** against paper: use it for decoration, and use a darker
boundary when a control's shape or state must be perceivable. Dark sections need
light text and a light, clearly visible focus outline.

### Typography

Select **Manrope** for headlines, navigation and body; pair **IBM Plex Mono**
with short technical annotations, indices and diagram labels. Use sentence case
for substantial headings. The rounded details in Manrope add warmth; restrained
mono labels add precision without making the whole site resemble a terminal.

| Role | Desktop target | Mobile target | Treatment |
| --- | --- | --- | --- |
| Main heading | 64–80px | 38–44px | 600, line height about 1.08, modest negative tracking |
| Section heading | 40–48px | 28–34px | 500–600, line height about 1.15 |
| Feature / service title | 24–28px | 21–24px | 500–600 |
| Body | 18px | 16–18px | 400, line height 1.6–1.7, measure around 60 characters |
| Navigation | 14–15px | 18–22px in menu | 500 |
| Caption / technical label | 12–13px | 12–13px | Mono for short labels; avoid tiny essential text |

Use fluid sizes with limits; wrap naturally rather than forcing desktop line
breaks onto mobile. Limit weights to those used. Add locally hosted WOFF2 assets
and their licences in Batch 2 with `font-display: swap`; Batch 1 deliberately uses
system fallbacks and needs no font network access.
Sources: [Manrope](https://fonts.google.com/specimen/Manrope),
[IBM Plex and its Open Font License](https://github.com/IBM/plex).

### Grid, spacing and shape

Use a centred container up to 1280px, including 48px inner desktop gutters,
32px tablet gutters and 20px mobile gutters. Build within a 12-column desktop
grid with approximately 24px gaps; collapse to a readable single column on
mobile. Section spacing is roughly 96–128px desktop and 56–72px mobile.

Alternate a split composition, open columns, ruled service rows, large project
figures and one darker systems section. Do not wrap every item in the same card.
Most corners remain square or use a 4px radius; large pills, floating glass panels,
gradient blobs and heavy shadows are outside this direction. Use a sparse
technical grid only inside a relevant figure, never behind every section.

## Capability model and messaging

These describe **services Bitmason proposes to deliver**, not a catalogue of
completed or currently available products.

| Capability | Business need | Scope to communicate |
| --- | --- | --- |
| Digital experiences | Help customers understand, buy and use a service | Business websites, e-commerce and customer-facing applications |
| Software engineering | Give teams reliable tools and connected information | Business management systems, operational dashboards, APIs and integrations |
| AI-powered solutions | Assist decisions and reduce repetitive work within software | Agents, assistants and automation connected to business applications |

Explain the operational outcome before technical details. Use language such as
“connect order information across your tools” or “help staff find answers in
business documents”. Avoid “AI-native everything”, unsupported efficiency
percentages, fabricated certifications and claims that a concept is live.

## Proposed homepage blueprint

The sequence below is a section-level design and content proposal. No section
has been implemented in this batch. Draft copy is a starting point for Batch 2;
facts about clients, delivery, locations, contact details and products require
actual evidence before publication.

| Order | Section and purpose | Desktop composition | Mobile treatment |
| --- | --- | --- | --- |
| 0 | Navigation: orient visitors and provide contact | Wordmark left; Services, Work, Approach, Company; one contact action right | Wordmark plus labelled Menu button; a simple vertical navigation panel |
| 1 | Hero: identify the company, audience and work | 7/5 split: editorial headline and copy beside an annotated product/system figure | Copy and primary action first; figure below with a useful crop and caption |
| 2 | Company positioning: establish the engineering partner | Small section label left, a statement and short explanation across the remaining width | Label, heading and short body in reading order |
| 3 | Engineering capabilities: show the three related areas | Three open columns separated by fine rules and numbered labels | Three stacked entries, each with a short description |
| 4 | Services: help buyers locate their project | Six ruled rows with name, business need and short deliverable description | Title then explanation; avoid a compressed desktop table |
| 5 | Selected projects: show verified contribution | One substantial feature and one or two smaller, differently sized project figures | Single-column project sequence with readable captions |
| 6 | Software systems and AI: demonstrate engineering depth | One dark section with a readable operational interface and a connected workflow diagram | Interface detail and explanatory copy stacked; simplify diagram connections |
| 7 | Engineering approach: explain delivery and ownership | Numbered progression with concrete outputs for each stage | Vertical sequence with short paragraphs |
| 8 | Contact CTA: make the next step clear | Large, quiet type and a project-enquiry action | Short heading, full-width action and verified alternative contact route |
| 9 | Footer: close with company and practical information | Wordmark/tagline, navigation, contact and verified legal links | Stacked groups with clear spacing and 44px touch targets |

### Navigation and hero

Navigation targets the relevant sections on the initial one-page site. Use
Services `#services`, Work `#selected-work`, Approach `#approach`, Company
`#company` and the primary action `#contact`. Show Work only when a truthful
project section exists. Do not include client login, an empty blog or a large
enterprise-style mega-menu. A sticky header, if used, stays opaque and shallow.

Hero draft:

- Eyebrow: **Digital engineering for European SMEs.**
- H1: **Business websites. Connected software. Carefully engineered.**
- Supporting copy: “We design and build websites, commerce platforms and business
  applications, with integrations and applied AI shaped around how your business works.”
- Primary action: **Discuss a project** → contact section.
- Secondary action: **Explore our capabilities** → `#capabilities`.
- Signature: **Computing + craftsmanship.**

The proposed figure combines a tightly cropped operational interface with a
small, legible system diagram. Use at most one major visual rather than an
assortment of floating browser windows. Until a real build is available, label
an authored illustration **Concept illustration — example business workflow**.
No animated counters, fictional uptime, fabricated client logos or fake live
status indicators accompany the hero.

### Company positioning

Heading draft: **An engineering partner for the way your business works.**

Draft body: “Bitmason Labs brings design and software engineering together for
SMEs across Europe. We begin with the operational problem, shape a practical
solution, and build with long-term maintainability in mind.”

Use a broad editorial text block and a small brand assembly detail. Do not
invent offices, team size, awards, partnerships or years of experience to create
an established-company impression.

### Capabilities and services

Capability descriptions should establish the three areas in about two sentences
each. Follow them with concrete services, which answer a different question:
what a prospective client can commission.

| Service | Short content direction | Capability |
| --- | --- | --- |
| Business websites | Clear, fast, accessible websites that explain the business and support enquiries | Digital experiences |
| E-commerce platforms | Product discovery, purchase journeys and the operational connections behind commerce | Digital experiences + software engineering |
| Web applications | Customer portals, booking flows and useful browser-based tools | Digital experiences + software engineering |
| Business management systems | Practical software for orders, records, approvals and internal reporting | Software engineering |
| APIs and integrations | Connect existing platforms and keep information moving between them | Software engineering |
| Workflow automation and applied AI | Reduce repetitive steps and add useful assistants or agents inside applications | Software engineering + AI-powered solutions |

Use open rows with short supporting text, not a grid of six identical icon cards.
All essential descriptions remain visible; any later disclosure reveals optional
detail and supports both keyboard and touch. Do not add dead service-page links.

### Selected projects and case-study layout

Each real project needs a verified name or approved anonymous description,
business context, Bitmason's contribution, actual delivery status, permission
to show the assets and a concrete result. Display measured results only when a
measurement and its source exist. A prototype and a production launch must have
different status labels.

Use a large 16:10 project image with a restrained metadata line and a concise
problem → contribution → result narrative. A future detailed case page should
include context, constraints, scope, interface or architecture artefacts, delivery
status and substantiated outcomes. Let a website project show real page details
and a software project show real workflow/interface details.

**Content dependency:** no Bitmason project evidence was supplied in this batch.
The blueprint reserves this section but does not invent its content. If evidence
is still unavailable when building, omit Selected projects and the Work link.
Alternatively, show an honestly labelled **Engineering studies** section only
after actual demonstrators exist, with explicit concept/prototype status and no
fictional clients. Decorative mockups do not become completed projects.

### Software systems and AI capabilities

Heading draft: **Software that connects the work.**

Use the page's single substantial dark section to explain how a customer-facing
experience relates to internal software and integrations. The main figure could
show an example order/approval interface with useful labels, statuses, records
and a readable detail panel. A secondary diagram connects customer action,
business application, existing systems and a reviewable assistant step.

Present these as potential commissioned workflows: an assistant that retrieves
business information with source references; an agent that prepares an action
for staff review; automation that routes records between an application and
existing systems. Tie AI to the application, data and user action instead of
presenting a standalone chatbot product or implying a built platform.

Concept figures must show sample data and carry a visible concept caption.
Implementation technologies, credential setup and internal architecture notes
do not belong in the visitor flow. Prefer static, authored diagrams; any future
interactive demo needs real behaviour, clear scope and an equivalent explanation.

### Engineering approach

Heading draft: **A considered process. A dependable build.**

| Stage | What the page should explain | Concrete project output |
| --- | --- | --- |
| 01 — Understand | Business need, users, current systems and constraints | Agreed scope, priorities and success criteria |
| 02 — Shape | Workflows, information structure, interface and technical decisions | Prototype, delivery plan and architecture appropriate to the project |
| 03 — Engineer | Implementation, review and testing of important journeys | Working software and tested integrations |
| 04 — Handover and evolve | Documentation, ownership and a practical support plan | Handover material and agreed next steps |

Use a numbered sequence with specific outputs. These are proposed delivery
practices; service levels or support commitments must match the eventual
agreement. Avoid borrowed certification badges and unsubstantiated guarantees.

### Contact CTA and footer

CTA heading draft: **Let's build the right thing.** Supporting copy: “Tell us what
your business needs to do better. We can help shape the next step.”

In Batch 2, choose an enquiry route using verified business contact details. A
form belongs in the interface only when submission, errors and success feedback
work. Suggested fields are name, work email, company and a short project brief;
include a relevant privacy notice when implementing the collection of details.
Do not invent an inbox, response-time promise or booking integration.

The footer repeats the exact tagline and gives useful navigation, verified
contact information, privacy/legal destinations and a copyright line. Add company
registration or location details only when supplied and verified. Do not publish
empty legal links, unused social icons or unimplemented account controls.

## Imagery, accessibility and interaction rules

- Use owned or permissioned product screenshots and credible, authored technical
  illustrations. Keep competitor assets in research only. A concept caption must
  remain visible and must not look like a client-project attribution.
- Make interface figures readable: meaningful table columns, plausible records,
  clear actions and coherent states. Show useful crops on small screens rather
  than shrinking a full dashboard to illegible text. Never place secrets or real
  private customer records in a figure.
- Use one primary action per composition, clear text links and 44px touch targets.
  Navigation works without hover; the mobile control has a name, `aria-expanded`
  and an explicit relationship to the menu. Closing restores focus appropriately.
- Keep content visible by default. Use roughly 150–200ms colour, underline or
  disclosure transitions; respect reduced motion. No scroll hijacking, autoplay
  hero video, glowing effects, parallax, cursor trails or staged content reveals.
- Use semantic headings and landmarks, a skip link, obvious keyboard focus,
  meaningful alt text and sufficiently contrasting text and controls. Informative
  diagrams have a text explanation; purely decorative SVG is hidden from assistive
  technology. Do not rely on colour alone for a status or diagram relationship.
- Validate the future homepage at 360, 390, 768, 1024 and 1440px, with keyboard,
  200% zoom and reduced motion. Static content must read without client JavaScript;
  isolate any necessary interactive controls.

## Batch 2 handoff

The direction is ready for homepage implementation when Batch 2 is requested.
That batch should create the original wordmark/mark, add licensed local fonts,
implement responsive sections from this blueprint, create honest concept visuals
or use verified project assets, and implement an appropriate contact route.

Project evidence and verified contact/legal details are content inputs still to
resolve before publication. Authentication, a database, R2 uploads, AI providers,
deployment and DNS remain separate features to implement only when required.
Batch 2 has not begun.
