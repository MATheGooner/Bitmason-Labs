# Bitmason Labs

**From customer interest to everyday operations.**

Bitmason Labs builds websites, online stores and custom software around customer
journeys and business operations. **Working with businesses internationally.**
Europe remains the initial client-acquisition market, not a geographical limit.
This repository contains the application foundation, approved design research,
the completed public website and Batch 4 database, backend and administration.
About, Services, Portfolio, five project studies and Contact reuse the established
identity and components. The portfolio remains a collection of clearly labelled
concepts, with no claimed commissioned client delivery or business results.
**Batch 4 (Phases 06–07) is complete and final acceptance passed, including
actual owner-password login and logout. This execution stops after Batch 4;
Batch 5 has not started.**

All public routes remain a local preview with `noindex, nofollow`. Deployment and the
decision to enable search indexing belong to a later launch phase.

## Pre-Batch 4 refinement checkpoint — 16 November 2026

The approved proposition is **Make it easier to choose you. Make the work behind
it simpler.** Public copy now connects websites and software with enquiries,
sales, bookings and everyday operations. The former computing/craftsmanship
signature is retained only in historical design research.

Light/dark themes use semantic CSS tokens and a small native **System / Light /
Dark** control. Desktop navigation contains the control; mobile visitors find it
in Menu. System is the default. Explicit selections use the browser-only
`bitmason-theme` localStorage key; System removes that override. A fixed inline
head script applies valid saved choices before paint. CSS follows system changes
without an override, including with JavaScript disabled; the disabled no-JS
control explains that behaviour. Storage failures leave the current document
usable. There is no theme package, global provider, cookie or database preference.

The five concepts, fictional-business disclosures, null live URLs, server-only
portfolio reader and email-draft enquiry behaviour are preserved. No email is
sent or enquiry saved. This checkpoint leaves the six-batch roadmap unchanged
and preceded the Batch 4 (Phases 06–07) implementation.

Validation evidence is recorded in `PROJECT_PROGRESS.md`; temporary reports and
browser captures live under the ignored `.local/verification/refinement/` folder.

Lint, TypeScript and the final production build passed. All ten public routes
were checked in both palettes at 320/390/1024/1440px, alongside keyboard access,
contrast, storage failure cases, before-hydration theme frames and no-JS flows.
The draft-focus and stale-draft checks pass in production and development.
Use **http://localhost:3000** for the development preview: the installed framework
allows that origin by default; probing the dev HMR endpoint through 127.0.0.1
caused the audit's incomplete-hydration result. No origin-policy change is needed.

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

For Batch 4, copy `.env.example` to `.env.local` and configure the database and
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
| Cloudflare R2 | Planned server boundary and variables; no client, bucket or uploads |
| Vercel | Standard Next.js build is ready for future deployment; no project connected |
| Cloudflare DNS | Intended DNS provider; no records changed |
| GitHub | Local Git repository initialised on `main`; no remote created or push performed |

Runtime additions are Neon, Drizzle, Auth.js, Zod for nested input validation and
Next's environment loader for consistent CLI configuration. Drizzle Kit and tsx
are development tools. There is no UI kit, theme provider, state manager, local
database service, Docker stack, analytics script or image SDK. Auth.js is pinned
to its documented v5 beta; there is no database user/session adapter or registration.

The four moderate development-only findings from Drizzle Kit's legacy loader
were traced to esbuild 0.18.20 and
[GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99).
The advisory affects esbuild's development server through 0.24.2; this project
uses Turbopack, and the loader uses esbuild transforms. A scoped override now
uses esbuild 0.25.12, already present elsewhere in the toolchain. Full and
production audits both report zero findings. Legacy CJS/ESM transforms and
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
    storage/            Cloudflare R2 implementation notes
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

## Batch 4 database and admin setup

Use a Neon development branch for validation. Configure server-only variables:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Pooled Neon PostgreSQL runtime URL |
| `DATABASE_URL_UNPOOLED` | Direct Neon PostgreSQL migration URL |
| `AUTH_SECRET` | Unique random secret of at least 32 characters per environment |
| `ADMIN_EMAIL` | The single administrator's email; no public registration |
| `ADMIN_PASSWORD_HASH` | Hash generated by the password command below |
| `AUTH_URL` | Set to `http://localhost:3000` for local previews, including production; otherwise use the target origin or supported platform inference |

Next.js and the database CLI share Next's environment loader: `.env.local` takes
priority over `.env`; neither local file is committed. Never copy local credentials
into public variables or documentation. Migration commands run deliberately,
never during builds or website requests.

Local production authentication needs the canonical origin even when the email,
secret and password hash are valid. Without it, the installed Auth.js version
rejects requests with `UntrustedHost`. The local setup now includes this nonsecret
setting. The origin fix preserved existing credentials. Final acceptance later
replaced only `ADMIN_PASSWORD_HASH` with explicit owner approval, using a local
masked prompt and this project's generator. Actual owner login, protected admin
access and logout passed; all other environment bytes were preserved.

```powershell
npm run db:check
npm run db:migrate
npm run db:seed
```

The seed imports all five confirmed concepts as published concepts with their
existing slugs, galleries, disclosures and null live URLs. Existing slugs are
skipped, including drafts and edited records. It does not reset or replace data.
Projects, categories and gallery metadata are persisted; ordered short lists use
typed JSONB. Delivery status (`concept` / `completed`) and publication status
(`draft` / `published`) are separate database enums and editor controls.

To generate the password hash securely from the project root in PowerShell:

```powershell
& 'C:\Program Files\nodejs\node.exe' --conditions=react-server --import tsx .\scripts\admin-password.ts
```

`npm run admin:password` invokes the same command. Type the password at the hidden
prompt and press Enter. It must contain 12–256 characters. The command never puts
the plaintext in command arguments, terminal history, output, logs or a file; it
prints only the hash. Paste that hash into `ADMIN_PASSWORD_HASH`. It uses scrypt
with `N=131072`, `r=8`, `p=1`, a random 16-byte salt and a 64-byte derived key,
with constant-time comparison. Colon separators avoid dotenv dollar expansion.
Keep the resulting hash private. Do not pass the password as a shell argument.

A hash can have the supported format without matching the intended password.
Use this project's generator: external scrypt generators may use different
parameters or salt encoding. This verifier passes the hex-encoded salt as text.
Restart the Next.js server after changing administrator configuration.
Punctuation, including `!`, is supported. Every character is part of the password;
adding or removing punctuation requires a hash generated from that exact password.

Generate `AUTH_SECRET` separately; this prints a newly generated secret, not a password:

```powershell
& 'C:\Program Files\nodejs\node.exe' -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

Open `/admin/login`. The responsive dashboard supports search, create/edit/delete,
draft/published and concept/completed controls, featured ordering, case-study copy,
categories, technologies, features, use cases, cover references and ordered gallery
metadata. Existing image references are limited to `/images/projects/` assets;
remote storage and uploads remain Batch 5 work. Referenced files are not deleted.

Auth.js manages encrypted, HttpOnly, SameSite sessions with an eight-hour lifetime
and secure cookies on HTTPS. Credential or email changes invalidate existing JWTs
on subsequent access. Pages and every privileged data-access operation check the
session server-side. Login errors remain generic; logout removes access. Saves
reject stale edits and deletions require typing the current slug.

Public portfolio queries always restrict publication and run at request time.
There is no static/local fallback after a database failure: lists show an unavailable
state, and unavailable/draft detail routes return 404 without exposing sensitive
errors. Writes revalidate the homepage, listings and old/new detail URLs. A visitor
who already viewed a project can still retain its content in their browser history.

Validation results, test scope and remaining local access setup are recorded in
`PROJECT_PROGRESS.md`. R2, uploads, deployment and Batch 6 work remain deferred.

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
transactional administration and publication revalidation. Uploads and remote
image storage remain Batch 5 work.

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
Local fonts and project images require no external asset requests at runtime.

## Design, validation and future batches

[DESIGN_DIRECTION.md](DESIGN_DIRECTION.md) defines the visual identity,
three capability areas, responsive behaviour, imagery policy and section-level
homepage plan. Reference screenshots are local research artefacts under the
ignored `.local/research/` directory, never website assets.

[PROJECT_PROGRESS.md](PROJECT_PROGRESS.md) records implementation and validation
through Batch 4 (Phases 06–07), including the continuation checks and remaining
launch dependencies.
Portfolio content requires Neon; enquiry drafts still need no external service.
Uploads and deployment remain outside the implemented batches. Batch 5 has not started.

When deployment is later requested, connect the GitHub repository to Vercel,
use `npm run build`, select Node.js 24 and configure environment variables there
only for implemented features. Obtain the required domain records from Vercel
before changing Cloudflare DNS; no speculative DNS or deployment configuration
is included here.
