# Bitmason Labs

**From customer interest to everyday operations.**

Bitmason Labs builds websites, online stores and custom software around customer
journeys and business operations. **Working with businesses internationally.**
Europe remains the initial client-acquisition market, not a geographical limit.
This repository contains the application foundation, approved design research,
the completed public website, database, backend, administration and Batch 5
image management and publishing.
About, Services, Portfolio, five project studies and Contact reuse the established
identity and components. The portfolio remains a collection of clearly labelled
concepts, with no claimed commissioned client delivery or business results.
**Batches 1–5 are complete. Batch 6 implements application hardening and
production preparation; public launch remains blocked by hosting, domain and
owner verification.** See `PROJECT_PROGRESS.md` for Phase 09–10 status.

Public routes remain unindexed by default. The [deployment handoff](DEPLOYMENT.md)
records hosting settings, environment requirements, domain checks and the
owner-controlled indexing gate.

## Local setup

Use **Node.js 24 LTS** and npm. `.nvmrc` and `package.json` declare the Node version.
From the project directory:

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Static company pages and the
email-draft contact form need no credentials; the portfolio now needs Neon.
Use `npm install` when intentionally changing dependencies, and
commit the resulting `package-lock.json` with the manifest.

For local setup, copy `.env.example` to `.env.local` and configure the database and
administrator settings below. Preserve an existing local environment file. In PowerShell:

```powershell
if (-not (Test-Path -LiteralPath '.env.local')) {
  Copy-Item -LiteralPath '.env.example' -Destination '.env.local'
}
```

Local environment files are ignored by Git. Never put credentials in client
components, public assets, `NEXT_PUBLIC_*` variables or committed documents.

## Project commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js development server with Turbopack |
| `npm run lint` | Check Next.js, React, accessibility and TypeScript rules; warnings fail |
| `npm run lint:fix` | Apply safe ESLint fixes |
| `npm run typecheck` | Generate Next.js route types, then check strict TypeScript |
| `npm run build` | Generate the production build |
| `npm run start` | Serve the existing production build locally |
| `npm run check` | Run lint, type checking and production build in sequence |
| `npm run db:generate` | Generate a versioned Drizzle migration after schema changes |
| `npm run db:migrate` | Apply committed migrations using the direct Neon connection |
| `npm run db:check` | Check the configured Neon runtime connection |
| `npm run db:seed` | Import missing concept slugs without overwriting existing projects |
| `npm run admin:password` | Securely prompt for a password and print its salted scrypt hash |
| `npm run test:images` | Check raster validation, normalization, reference policy and storage ownership protections with memory-only fixtures |
| `npm run test:security` | Check launch-policy safeguards, trusted login-budget keys and password verification with disposable inputs |
| `npm run production:check -- --local` | Read-only local environment, Neon migration and R2 preflight; not a deployment check |
| `npm run production:check -- --remote` | Verify production configuration and the canonical HTTPS deployment with indexing still disabled |

Production verification:

```sh
npm run check
npm run start
```

`next-env.d.ts`, route types and `.next/` are generated locally and ignored by
Git. `typecheck` generates route types so it works before starting the dev server.
Stop the dev server before rebuilding into the same `.next/` directory.

Scripts invoke the installed Node CLI entry points directly. This preserves the
usual Next.js/ESLint commands while avoiding Windows batch-wrapper launch failures
observed during local verification; no additional tooling is needed.

## Stack and integration status

| Technology | Current status |
| --- | --- |
| Next.js 16.4, App Router | Configured; Server Components by default |
| React 19.3 | Configured |
| TypeScript 5.9 | Strict checking, explicit imports and `@/` source alias |
| Tailwind CSS 4.3 | CSS-first theme tokens and PostCSS integration |
| ESLint 10 | Flat Next.js configuration; no deprecated `next lint` command |
| Neon PostgreSQL + Drizzle | Server-only HTTP reads, transactional WebSocket writes, schema, migrations and non-destructive seed |
| Auth.js | One environment-configured administrator, Credentials provider and encrypted JWT sessions |
| Cloudflare R2 | Server-only S3 SDK, validated uploads, ownership ledger and delivery through assets.bitmasonlabs.com |
| Vercel | Node.js 24 / Next.js production preparation ready; project connection and deployment pending |
| Cloudflare DNS | Intended DNS provider; no records changed |
| GitHub | `origin` is MATheGooner/Bitmason-Labs; Batch 6 commits are local, with no Batch 6 push performed |

Runtime additions are Neon, Drizzle, Auth.js, Zod for nested input validation and
Next's environment loader for consistent CLI configuration. Drizzle Kit and tsx
are development tools. There is no UI kit, theme provider, state manager, local
database service, Docker stack or analytics script. The S3 SDK handles R2 storage;
Sharp validates and normalizes rasters using the version already used by Next.js. Auth.js is pinned
to its documented v5 beta; there is no database user/session adapter or registration.

The four moderate development-only findings from Drizzle Kit's legacy loader
were traced to esbuild 0.18.20 and
[GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99).
The advisory affects esbuild's development server through 0.24.2; this project
uses Turbopack, and the loader uses esbuild transforms. A scoped override now
uses esbuild 0.25.12, already present elsewhere in the toolchain. The Batch 6
production-only audit is clean; the full audit has 14 high-severity development
findings from unpatched picomatch (see `DEPLOYMENT.md`). Legacy CJS/ESM transforms and
Drizzle generation were checked; migration SQL and schema definitions are
unchanged. No direct dependency upgrade or migration rerun was needed. Do not
use `npm audit fix --force` to downgrade Drizzle Kit to 0.18.1.

Three scoped npm overrides are documented. The ESLint override keeps a single
supported ESLint 10: the
[Next.js 16.4 documentation](https://nextjs.org/docs/app/api-reference/config/eslint#setup-eslint)
confirms compatibility while some included plugins still declare older peer
ranges. The `typescript-estree` override uses patched `minimatch` 11.0.8 for
[GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249).
The `@esbuild-kit/core-utils` override selects esbuild 0.25.12 only for that
legacy dependency. The deprecated loader packages are merged into tsx; remove
this override when Drizzle Kit drops them or adopts a patched dependency range.
Review and remove each override when the upstream dependency metadata or version
range incorporates the fix. TypeScript is pinned to the established 5.9 line
supported by the selected lint and framework toolchain.

## Structure

```text
src/
  app/
    layout.tsx          Root layout, public metadata and skip link
    page.tsx            Homepage composition and metadata
    about/              Company philosophy, values and delivery approach
    services/           Detailed services and business use cases
    portfolio/          Category-filtered project listing
      [slug]/           Reusable project studies and generated public slugs
    contact/            Enquiry page and draft preparation Server Action
    icon.svg            Original geometric brand icon
    not-found.tsx       Accessible 404 route
  components/
    home/               Homepage sections and authored interface illustrations
    layout/             Brand, header, mobile navigation, footer and skip link
    public/             Shared page hero, contact CTA and detailed service rows
    portfolio/          Linked figures, original previews and reusable case study
    contact/            Progressively enhanced validated enquiry form
    ui/                 Container, Button/link styling and original SVG icons
  lib/
    cn.ts               Optional class-name composition
    homepage.ts         Shared capabilities, services and delivery copy
    navigation.ts       Public routes and navigation labels
    portfolio.ts        Typed public project contract and presentation helpers
    company.ts          Company working principles
    service-details.ts  Detailed service scope and use cases
    enquiry.ts          Public form types, validation and email draft construction
    metadata.ts         Shared public page metadata
    site.ts             Public brand constants and email enquiry draft
  server/
    env.ts              Lazy, server-only reads of named environment variables
    portfolio/          Published-only reader, authorized admin access and transactional writer
    db/                 Lazy Neon clients and Drizzle project/category/gallery schema
    auth/               Auth.js configuration, authorization and password hashing
    storage/            R2 client, raster validation, ownership and cleanup services
  styles/
    globals.css         Tailwind import, design tokens and accessible base styles
    homepage.css        Responsive homepage compositions and interaction states
    public-pages.css    Public page layouts, portfolio and enquiry states
public/
  fonts/                Self-hosted Manrope and IBM Plex Mono with OFL licences
  images/projects/      Existing covers, interface captures, gallery photos and notes
docs/
  research/             Lightweight, dated reference observations
AGENTS.md               Framework-generated guidance for future code changes
DESIGN_DIRECTION.md     Competitor research and proposed homepage blueprint
PROJECT_PROGRESS.md     Batch status, validation and remaining work
```

## Architecture and styling conventions

- Keep route files responsible for route composition, metadata and request
  boundaries. Put reusable presentation in `components/` and public pure logic
  in `lib/`. Introduce route groups only when separate layouts are required.
- Keep components on the server unless a specific interaction needs browser
  state or events. Place `"use client"` at the smallest necessary boundary.
- Put provider adapters and data access in `server/` and guard them with
  `import "server-only"`. Read configuration only inside an active feature;
  missing optional integrations must not break static pages or builds.
- Use the semantic Tailwind tokens (`paper`, `ink`, `muted`, `accent`, `line`)
  rather than repeating colour values. Use responsive utilities and `Container`
  for page gutters. Theme configuration is in CSS, not a Tailwind v3 config file.
- `cn` composes class names; it does not resolve conflicting Tailwind utilities.
  Avoid passing competing utilities for the same property. Add a merging library
  only if real component usage later requires one.
- Use links for navigation and buttons for actions. `buttonClassName` provides
  matching styling for `next/link` without polymorphic component machinery.
- Preserve keyboard focus, semantic landmarks, meaningful link text and reduced
  motion. All public routes inherit `noindex, nofollow`; replace that policy
  deliberately when preparing the finished site for launch.

Read [the server boundary notes](src/server/README.md) before implementing an
integration. No credentials are read at import time, and the public `site.url`
constant does not connect the application to the domain.


## Public routes and portfolio architecture

| Local route | Current behaviour |
| --- | --- |
| `/` | Completed homepage; featured projects use the shared portfolio reader |
| `/about` | Company introduction, engineering philosophy, values and approach |
| `/services` | Three capabilities, eight detailed services, use cases and systems illustration |
| `/portfolio` | Published projects; category links work with or without JavaScript |
| `/portfolio/[slug]` | Reusable project study, structured scope, gallery and project navigation |
| `/contact` | Validated enquiry form that prepares an email draft, plus direct email links |
| Unknown route or project slug | Accessible 404 with working public navigation |

Category filtering uses `?category=healthcare`, `home-services`, `hospitality` or
`property`. Unknown or repeated categories show a clear empty state and a return
link. Category counts and generated project slugs come from published records.

| Project | Slug | Category | Delivery status |
| --- | --- | --- | --- |
| Le Saphir | `le-saphir` | Hospitality | Concept |
| EcoShine | `ecoshine` | Home services | Concept |
| Northfield Home Services | `northfield-home-services` | Home services | Concept |
| Aurelia Private Clinic | `aurelia-private-clinic` | Healthcare | Concept |
| Linden & Co. | `linden-and-co` | Property | Concept |

`src/lib/portfolio.ts` defines the public data contract. It supports delivery and
publication status independently, cover and ordered gallery images with captions,
overview, business problem, solution, features, technologies, use cases, live URL
and featured selection. All current projects are `concept` and `published` in
this local preview; each live URL is `null` because none is verified.

Pages and the homepage read through `src/server/portfolio/reader.ts`; they never
import the local catalogue directly. Its async functions list published records,
filter categories/featured work, fetch a published detail record, derive category
counts and provide public slugs. Missing or unpublished records return `null` and
the project route returns 404. Both the reader and local catalogue are guarded by
`server-only`. PostgreSQL now supplies these reads; the local catalogue remains
the non-destructive seed source. See the
[portfolio boundary notes](src/server/portfolio/README.md) for published queries,
transactional administration, media ownership and publication revalidation.

The homepage's HTML/CSS project previews retain their established compositions.
Dedicated portfolio pages use genuine interface captures from existing compiled
public-page artifacts, with original-project photography and explicit concept
captions. Case studies separate the fictional brief from the implementation scope;
there are no invented client results, testimonials or public demo links.

## Homepage content and enquiries

The homepage includes navigation, hero, company introduction, three engineering
capabilities, eight service disclosures, selected projects, systems and AI,
a four-stage engineering approach, contact CTA and footer. Shared navigation now
links to the implemented public pages. Enquiry CTAs lead to `/contact`, while
homepage section links and the existing direct email-draft action remain usable.

Le Saphir, EcoShine, Northfield Home Services, Aurelia Private Clinic and
Linden & Co. are portfolio demonstrations for fictional businesses. Each carries
a visible **Concept project** label. Their descriptions and images use the
existing sibling repositories; homepage HTML/CSS previews are composed
presentations. Portfolio gallery screenshots capture actual concept interfaces,
not evidence of a commissioned client launch. See the
[project asset notes](public/images/projects/README.md) for sources and scope.
The hero and systems interfaces use labelled sample data and describe possible
workflows rather than live Bitmason products. No client results are claimed.

The enquiry inbox is **contact@bitmasonlabs.com**, confirmed by the business
owner on 15 November 2026. The original direct email action opens a draft in the
visitor's email application with an encoded subject and project prompts, and
remains configured centrally in `src/lib/site.ts`. The plain inbox is also visible.

The Contact page validates name, email, business and a 20–2,000 character brief;
service and timeline are optional. Native constraints and a Server Action validate
the input. Inline errors preserve details, pending feedback prevents duplicate
submission, and the successful result says **Your email draft is ready**. The
visitor reviews the text, opens it in an email app and chooses to send it. Editing
details hides the old draft when JavaScript is enabled; the native result also
explains that edited details need a new draft. Form validation and draft results
work without JavaScript through a native POST.

No enquiry is stored, no email provider is called and no delivery-success claim
is shown. The form explains this behaviour before submission and provides a
selectable draft if an email app cannot open or populate it. Automatic delivery
and mailbox delivery verification remain separate work; no email was sent during
validation. Keep the approved inbox in `src/lib/site.ts` if delivery is added later.

The mobile menu and service disclosures use native `details`/`summary` controls
and work without JavaScript. The isolated mobile client component adds Escape
handling, outside-click dismissal, focus handling, breakpoint closing and
expanded-state announcements. Content remains visible without staged reveals.
Local fonts and the original project assets remain self-hosted. Newly uploaded
portfolio images use the configured Cloudflare R2 public asset domain.