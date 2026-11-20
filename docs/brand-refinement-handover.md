# Bitmason Labs — brand refinement handover

Local implementation is complete. Production deployment and owner-authenticated login verification remain outstanding. No production mobile login fix is claimed.

## Changes

### Meaningful hierarchy

Removed section, capability, service, workflow, project and gallery numbering from public pages. Updated the corresponding grids and spacing so headings carry the hierarchy. Portfolio category filters use names; the result count remains because it communicates the actual filter result.

### Business positioning

Reframed the five projects as selected work and design/engineering case studies. Removed repeated concept labels, fictional-business explanations, missing-demo notices and development disclaimers. Case-study facts identify the work as an independent study without implying commissioned clients. No testimonials, customer metrics or verified results were introduced.

Refined the public summaries, briefs, feature descriptions and gallery captions through exact matches against the existing approved wording. Stored portfolio records, project identities, image references and custom admin edits remain intact. Delivery status remains available in the admin interface. Strengthened capability and delivery copy while keeping the brand, layouts and established service offering.

### Restrained interaction

Replaced sample-record interfaces with selectable enquiry, purchase and booking journeys that explain the relationship between the customer experience and business operations. Added a keyboard/touch preview control to switch between each project's visual direction and existing interface capture. Refined focus and hover feedback, gallery transitions and service disclosures.

Added small section entrance animations using native browser APIs. Content stays visible without JavaScript. Animation and transitions respect reduced-motion preferences, including preference changes. No application dependencies were added. Corrected the operations panel's text contrast after browser accessibility testing.

### Authentication

Read-only production inspection reproduced the problem: `GET https://www.bitmasonlabs.com/api/auth/providers` returned `http://localhost:3000/api/auth/signin/credentials` and `http://localhost:3000/api/auth/callback/credentials`. Unauthenticated dashboard access redirected to `/admin/login`; the provider/action URL generation was the broken layer.

The installed Auth.js version gives `AUTH_URL`, followed by legacy `NEXTAUTH_URL`, precedence over request-host inference. A localhost effective origin therefore affects provider URLs, server actions and secure-cookie selection. The specific variable and its scope in Vercel were not inspected; the owner is handling configuration.

The code now normalizes the Auth.js origin before initialization for Vercel production, uses `https://www.bitmasonlabs.com` for admin navigation and callbacks, and rejects external or stale localhost callback destinations. Development and preview behavior remain separate. Canonical metadata and the production checker now follow the existing apex-to-www domain routing.

## Routes and components

- `/`: section headings, capabilities, services, delivery approach, hero and operations journeys, selected-work cards.
- `/about`: company presentation, working principles and shared delivery approach.
- `/services`: service directory, shared capabilities and operations journeys.
- `/contact`: company wording and enquiry presentation; existing email-draft behavior retained.
- `/portfolio`, including category queries: filters and selected-work previews.
- `/portfolio/le-saphir`, `/portfolio/ecoshine`, `/portfolio/northfield-home-services`, `/portfolio/aurelia-private-clinic`, `/portfolio/linden-and-co`: shared case studies, gallery captions and metadata.
- `/admin`, `/admin/login`, `/admin/projects` and protected admin routes: canonical login/dashboard redirects and shared authorization.
- `/api/auth/[...nextauth]`: provider URLs, callbacks, session origin and signout behavior through shared configuration.
- Shared public layout: section entrance enhancement. Metadata, sitemap and Open Graph URLs inherit the canonical `site.url`.

Core files: `src/components/home/business-journey.tsx`, `src/components/layout/entrance-motion.tsx`, `src/components/portfolio/{project-preview,project-card,case-study,gallery-image}.tsx`, `src/lib/project-presentation.ts`, `src/server/auth/{origin,config,authorization}.ts`, shared public-page components and styles, `scripts/test-security.ts`, `scripts/check-production.ts`, and `.env.example`.

## Validation

- PASS: lint with zero warnings.
- PASS: route generation and TypeScript.
- PASS: optimized production build after the contrast correction.
- PASS: all seven security tests, including production-origin normalization, actual Auth.js action URL construction, preview/development isolation, callback rejection and existing password/security checks.
- PASS: all six image/storage regression tests.
- PASS: all ten public routes on desktop and a mobile viewport, including canonical metadata, horizontal overflow, WCAG serious/critical checks, light/dark homepage contrast, keyboard/touch controls, filtering, gallery decoding, reduced motion and anonymous dashboard access/refresh. The public-route pass completed before a separate anonymous-logout test assumption was corrected; its output is in the tool log.
- PASS: a targeted follow-up verified canonical provider URLs, protected redirects, secure cookies and anonymous logout in a locally simulated Vercel production environment, plus JavaScript-disabled content and service disclosures. Results are in `.local/brand-review/after/validation.json`. These checks do not verify owner-authenticated production login.
- NOT VERIFIED: real production login, authenticated dashboard refresh and logout on mobile and desktop.

An initial browser pass encountered an intermittent database-read failure on one case-study route. The existing reader returns unavailable portfolio data on connection failure. No database or storage architecture was changed; the final browser pass retries a failed route read up to twice.

Existing unrelated edits in `README.md` and `docs/research/README.md` were preserved. No migrations, database writes, R2 uploads/deletions or credential changes were performed by this continuation.

## Owner Vercel and deployment steps

1. In Vercel project settings, set **Production** `AUTH_URL=https://www.bitmasonlabs.com`. Remove `NEXTAUTH_URL` if unnecessary, or set it to the identical origin. Scope localhost values to Development. Omit both variables in Preview when using platform URL inference.
2. Keep the existing `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, database and R2 credentials. Do not rotate or replace them for this fix.
3. Preserve the intended `SITE_INDEXING_ENABLED` setting. If indexing was already approved/enabled, the production `AUTH_URL` must match the new canonical www origin before building so the existing launch gate continues to permit indexing.
4. Deploy these changes and redeploy after environment changes. Confirm `www.bitmasonlabs.com` is attached to the production deployment and the apex domain redirects to it.
5. Inspect `/api/auth/providers`: both credential URLs must start with `https://www.bitmasonlabs.com/api/auth/`. Inspect the delivered canonical URL, robots policy and sitemap as appropriate. The updated production checker can be run with `npm run production:check -- --remote`, adding `--indexing` only when indexing is already intended.
6. Using existing credentials privately, test on a real phone and a desktop browser: open `/admin/projects` while signed out; sign in; confirm the dashboard stays on canonical HTTPS; refresh; open the dashboard in another tab; log out; refresh/revisit the protected dashboard and confirm it returns to canonical `/admin/login`. Check a normal browser session and a fresh/private session so stale callback cookies are covered.
7. Only after those checks pass should the production mobile authentication issue be marked fixed.
