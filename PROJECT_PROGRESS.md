# Bitmason Labs — project progress

Last updated: 15 November 2026 (Africa/Lagos).

## Batch 1 status

**Complete — 100% of Batch 1.** Foundation, design research and local verification
are finished. Batch 2 has not started.

## Work completed

- Initialised the empty workspace as a local Git repository on `main`.
- Configured Next.js App Router, React, strict TypeScript, Tailwind CSS 4 and
  ESLint with clear development, lint, type-check and production scripts.
- Corrected Windows CLI-wrapper launch failures by invoking installed Node CLI
  entry points directly. Retained Next.js's generated `AGENTS.md` guidance.
- Created the `src/app`, `components`, `lib`, `server`, `styles` and `public`
  structure with a root layout and a temporary runtime verification route.
- Added Container, Button/link styling, an accessible skip link and a 404 page.
- Established a restrained semantic colour palette, shared typography/gutters,
  keyboard focus, reduced-motion styles and high-contrast focus handling.
- Added `.env.example` with empty future credential placeholders and Git rules
  that exclude local secrets, dependencies, builds and local research artefacts.
- Created lazy, server-only environment reads and documented distinct Neon/
  Drizzle, Auth.js and R2 implementation boundaries. No adapters are active.
- Researched Futurice, Netguru, DEPT, ustwo and Made Tech through genuine primary
  pages, with rendered desktop/mobile checks for the accessible references and
  detailed project reviews. Documented the Made Tech browser restriction.
- Defined the visual identity, three capability areas, service content, imagery
  rules, interaction principles and complete proposed homepage section hierarchy.
- Created README, design direction and lightweight dated research observations.

## Validation

Verified locally on 15 November 2026 with Node.js 24.20.0 and npm 11.19.0.

| Check | Result | Evidence |
| --- | --- | --- |
| Clean `npm ci` | PASS | Lockfile installation completed successfully |
| Dependency audit | PASS | Zero reported vulnerabilities, including development dependencies |
| `npm run check` | PASS | Exit code 0; includes ESLint, route type generation, strict TypeScript and production build |
| ESLint | PASS | Zero errors or warnings after the launcher correction |
| Type checking | PASS | Route types generated; `tsc --noEmit` and build-time checking succeeded |
| Production build | PASS | Next.js 16.4.6 / Turbopack compiled and prerendered `/` and the 404 route |
| Development server | PASS | Started on loopback; normal GET, localhost GET, HEAD and RSC prefetch returned 200; missing route returned 404 |
| Production server | PASS | Built application returned the same expected HTTP statuses |
| Browser layouts | PASS | 1440, 390 and 360px widths; CSS loaded, no horizontal overflow or runtime page errors |
| Keyboard and reduced motion | PASS | Skip link focused main content; 404 return link worked; reduced-motion transitions disabled |
| JavaScript disabled | PASS | Foundation content remained readable and server-rendered |
| Runtime external requests | PASS | No external asset/service requests in the production browser checks |
| Local credential setup | PASS | No `.env.local` or integration credentials were needed |

The initial minimatch development-tool advisory was resolved using a documented,
scoped patched-version override. ESLint 10 uses Next.js 16.4's documented support;
the lockfile was regenerated and validated with a clean install.

HTTP results and browser captures are kept locally under the ignored
`.local/verification/` directory. Temporary verification servers were stopped.
No additional application features or permanent test dependencies were added.

### Reported 400 Bad Request

Investigated both development and production using ordinary browser GET requests,
localhost GET, HEAD and valid React Server Component prefetch requests. All
returned 200; the intentionally missing route correctly returned 404. The 400
response could not be reproduced, and no corresponding 400 was present in the
verification server logs. No original failing URL, headers or trace was supplied,
so its specific cause remains unconfirmed. The confirmed Windows launch failures
were separate process-start errors and were corrected in the project scripts.

## Deliberately deferred

- Marketing homepage and its navigation, hero, service/project sections and CTA.
- Final original SVG brand assets, licensed local fonts and product figures.
- Neon database provisioning, Drizzle dependencies, schema and migrations.
- Auth.js dependencies, providers, sessions, adapters and protected routes.
- R2 SDK, bucket, image delivery host, uploads and storage policy implementation.
- AI models/providers, agents and automation execution.
- GitHub remote, Vercel connection/deployment and Cloudflare DNS changes.
- Contact form delivery, booking tools and analytics.

## Outstanding inputs and issues

- No verified Bitmason project/case-study material was supplied. Do not fill a
  Selected projects section with fictional deliveries. The design document gives
  an honest omission or demonstrator fallback for the next batch.
- Verify business contact and legal/company details before publication. These
  are not needed to run the foundation or complete the Batch 1 blueprint.
- Made Tech's protection page prevented direct rendered visual inspection; its
  accessible primary text was used for messaging research only.
- No outstanding application build, lint, type or runtime failures were found.
  The reported 400 remains unreproduced; its original request details would be
  needed for a specific diagnosis if it recurs.

## Next batch — proposed scope only

Batch 2: implement the responsive homepage using `DESIGN_DIRECTION.md`, add the
original brand assets and licensed typography, use verified work or clearly
labelled concept figures, and choose a working enquiry route. Validate mobile
layout, keyboard access, reduced motion and production output.

Keep backend services optional until a real feature requires them. The temporary
route's `noindex, nofollow` policy must be deliberately replaced during launch
preparation for the finished website. No Batch 2 work is authorised or started
by this progress document.
