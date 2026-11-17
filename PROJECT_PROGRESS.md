# Bitmason Labs — project progress

Last updated: 18 November 2026 (Africa/Lagos).

## Batch 5 status — Phase 08

**Complete — implementation and final validation PASS.** Continued from the
existing Batch 4 editor, authentication, transactional CRUD and portfolio image
contracts. Privately verified R2 configuration and captured a read-only baseline
before implementation. No environment values, existing portfolio content or
original assets were changed. The approved six-batch plan is unchanged.
**Stop after Batch 5 (Phase 08); Batch 6 has not started.**

### Phase 08 — image management and publishing

- Added a server-only AWS S3 SDK adapter for the configured Cloudflare R2 bucket.
  It constructs the private endpoint from `R2_ACCOUNT_ID`, uses region `auto`
  and validates `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`
  and `R2_PUBLIC_BASE_URL`. Public URLs use `https://assets.bitmasonlabs.com`.
  Configuration errors identify variable names without exposing their values.
- Extended the existing editor with cover/gallery uploads, local previews,
  progress, replacement, removal, alternative text/captions and gallery ordering.
  Saves are blocked during uploads; failed validation/database saves preserve
  entered details and uploaded identities. Native content/reference editing,
  project CRUD and independent draft/published controls remain available.
- Enforced authorization on every media endpoint and administrative storage
  operation, with same-origin mutations and bounded multipart/JSON streams.
  JPEG/PNG/WebP files require matching MIME, extension and actual content.
  Complete raster decoding rejects corrupt/animated images and enforces 8 MiB,
  8192 pixels per side and 24 megapixels. Sharp normalizes orientation, strips
  metadata and stores WebP under server-generated UUID keys.
- Applied only additive migration `0001_project_images`: an ownership/cleanup
  ledger and nullable restrictive cover/gallery references. The original
  migration was not replayed; no reseed or database reset occurred. Project
  transactions claim scope/project-owned images, use authoritative dimensions
  and retire objects only after their final cover/gallery reference disappears.
- Reserved ownership before upload; conditional writes protect existing objects.
  Failed saves roll back references and retain pending uploads. Storage cleanup
  runs after commit, verifies ledger and R2 ownership metadata and retains failed
  deletions for retry. Unused completed uploads expire after 24 hours;
  interrupted uploads retain a 15-minute cleanup delay. The dashboard retries
  queued/expired objects, up to 30 candidates per request.
- Preserved published-only public queries, portfolio filters, case-study routes,
  authored project previews and responsive presentation. Replacements use new
  immutable public URLs. Missing/unavailable images display accessible
  placeholders; failed gallery images disable both full-image links.

### Batch 5 validation

Verified on 17 November 2026 (Africa/Lagos), with Node.js 24.20.0 and Next.js
16.4.6. Only generated images and disposable records were used for mutation tests.

| Check | Result | Evidence |
| --- | --- | --- |
| Lint, TypeScript and production build | PASS | Final `npm run check`: zero ESLint errors/warnings, Next route type generation, strict `tsc --noEmit` and production Turbopack build |
| Raster validation and reference policy | PASS | Six memory-only image tests: supported rasters, normalization, corrupt/mismatched/animated files, size/dimension limits, public reference policy and managed object ownership |
| Existing database/CRUD regression | PASS | 13 disposable PostgreSQL checks covering existing validation, migration repeatability, draft isolation, stale edits, rollback, conflicts and deletion |
| Media/database consistency | PASS | Eight disposable database checks: additive migration/preservation, cover/gallery claims, authoritative dimensions, scope/project isolation, restrictive references, rollback, replacement/order, shared-reference protection, expiry and deletion |
| Authorization and failure recovery | PASS | Eight checks: independent endpoint/DAL authorization, origin/body limits, safe errors, reservation/upload/database failures, conditional collisions, interrupted cleanup, attached-object protection and queues exceeding 30 candidates |
| Live R2 and custom-domain delivery | PASS | Three checks: authenticated upload/connectivity, delivery and content integrity through the custom domain, authorized discard and confirmed object removal |
| Admin/browser image workflows | PASS | 14 browser checks plus two final closeout checks: previews/progress, retained uploads after errors, create/replace/order/delete, invalid/oversized files, unauthorized/cross-origin refusal, rollback, native editing, publish/unpublish, fallbacks, navigation discard, slug-confirmed deletion and logout |
| Responsive admin and public regression | PASS | Eight editor layouts across 320/390/1024/1440px in both themes; all ten public routes, portfolio filters, current published images and responsive presentation checked |
| Failed-upload cleanup closeout | PASS | Delayed live upload reservation recovered through authenticated cleanup: HTTP 200, removed 1, pending 0, errors 0; final ledger contains zero assets |
| Original data and asset preservation | PASS | Exact baseline match for five projects, four categories, ten gallery images and edit versions; original local content/images/fonts and Batch 4 migration fingerprints unchanged; no temporary database records or managed R2 objects remain |
| Environment and secret handling | PASS | `.env.local` bytes unchanged; configured `AUTH_URL` and supported owner hash retained; no configured secrets/private R2 endpoints in prospective source or browser assets; local environment and verification helpers remain ignored |
| Dependencies | PASS | Full and production-only npm audits: zero vulnerabilities after the scoped SDK/Sharp additions; existing Batch 4 fixes retained |
| Final Git/diff review | PASS | Full prospective diff includes inherited untracked work, checked through an isolated index; whitespace clean, HEAD and real index unchanged, zero staged files and no verification artifacts staged |

Evidence remains under ignored `.local/verification/batch5/`: `baseline.json`,
`migration-report.json`, `database-report.json`, `recovery-report.json`,
`connectivity-report.json`, `browser/report.json`, `finish-browser-report.json`,
`cleanup-report.json` and `review-report.json`. The baseline was never overwritten.
Earlier partial browser reports retain failed attempts from ambiguous selectors,
version waits and Windows browser/native-process crashes. Corrected reruns and
the final closeout checks above supersede those attempts. A transient live R2
upload failure retained its cleanup reservation and was recovered after its
normal delay. Final diff review found surplus EOF blank lines in new source
files; those were removed and the check rerun successfully. No application
validation failure remains. Automated checks do not claim exhaustive browser
coverage or certification.

### Batch 5 remaining issues and limits

No Batch 5 implementation blocker remains. Cleanup on navigation is best effort;
after a closed browser or failed network request, use the authenticated dashboard
cleanup control once the relevant delay expires. Retries are bounded to 30
candidates per request; there is no background scheduler in this batch. Uploads
require JavaScript, while existing native editing remains supported.

Project pages and queries exclude drafts. R2 asset URLs are public, including
images associated with drafts, and browser/CDN copies may remain after origin
deletion. This is documented storage behaviour for public portfolio imagery.
Existing local assets and unrelated bucket objects are never deleted.

At the original implementation closeout, the Batch 4 commit was present but Git
still listed inherited implementation files as untracked. They were preserved
and included in prospective review. That closeout staged or committed nothing.
The Git completeness recovery below resolves those omitted application files.
The existing legacy Drizzle loader deprecation remains a low-severity maintenance
issue; the completed dependency audits are clean.

### Batch 5 files changed

Relative to the preserved start-of-batch baseline, 30 existing files changed and
18 files were added. This list excludes inherited untracked files that were not
changed during Batch 5 and ignored verification reports.

- Configuration/tooling: `.env.example`, `next.config.ts`, `package.json`,
  `package-lock.json`, `scripts/test-images.ts` (new).
- Migration/schema: `drizzle/0001_project_images.sql` (new),
  `drizzle/meta/0001_snapshot.json` (new), `drizzle/meta/_journal.json`,
  `src/server/db/schema.ts`.
- Media services (all new): `src/lib/media.ts`, `src/server/storage/admin.ts`,
  `client.ts`, `errors.ts`, `image.ts`, `references.ts`, `request.ts`.
- Media endpoints (all new): `src/app/api/admin/images/route.ts`,
  `src/app/api/admin/images/[id]/route.ts`,
  `src/app/api/admin/images/discard/route.ts`,
  `src/app/api/admin/images/cleanup/route.ts`.
- Admin integration: `src/app/admin/actions.ts`,
  `src/app/admin/(protected)/layout.tsx`,
  `src/app/admin/(protected)/projects/page.tsx`,
  `src/app/admin/(protected)/projects/new/page.tsx`,
  `src/app/admin/(protected)/projects/[id]/edit/page.tsx`,
  `src/components/admin/project-form.tsx`, `delete-project-form.tsx`,
  `image-fields.tsx` (new), `image-cleanup.tsx` (new),
  `src/lib/admin-project.ts`, `src/styles/admin.css`.
- Portfolio integration: `src/lib/portfolio.ts`,
  `src/server/portfolio/admin.ts`, `queries.ts`, `writer.ts`,
  `src/components/portfolio/case-study.tsx`, `project-card.tsx`,
  `project-preview.tsx`, `portfolio-image.tsx` (new), `gallery-image.tsx` (new),
  `src/styles/public-pages.css`.
- Documentation: `README.md`, `PROJECT_PROGRESS.md`, `DESIGN_DIRECTION.md`,
  `src/server/README.md`, `src/server/db/README.md`,
  `src/server/portfolio/README.md`, `src/server/storage/README.md`.

### Batch 5 Git completeness recovery — 18 November 2026

**Fresh-checkout validation PASS; staged for approval.** The 48-file Batch 5
checkpoint is already commit `7283b58`. This recovery preserves that commit and
recovers the 71 earlier application files that remained untracked. All 71 were
read, classified and traced through framework entry points, local TypeScript
imports, stylesheet imports, seed image references, documented commands and
licence/provenance companions. None are unrelated work or temporary artifacts.

Recovered files comprise three database configuration/migration-history files,
two documented setup/database commands, six authentication/backend modules,
11 application routes/layouts (including the icon), 30 shared components/content/
style files and 19 public assets, licences and provenance notes. The original
schema snapshot is a necessary versioned migration input. Published interface
captures are portfolio assets; temporary verification captures remain excluded.

The complete index contains 142 repository files. A separate checkout exported
from the index matched every staged file and initially contained no `.env.local`,
`.local`, `node_modules`, `.next`, `next-env.d.ts` or Git metadata. Its dependencies
were installed from its own lockfile. Application configuration variables were
removed from verification subprocesses; no owner credentials were copied.

| Recovery check | Result | Evidence |
| --- | --- | --- |
| Dependency and asset completeness | PASS | Every local import resolves; all 71 recovered files have an application, tooling, migration, asset or licence/provenance dependency |
| Fresh dependency install | PASS | Clean `npm ci --include=dev` from the exported manifest/lockfile; 398 packages installed; project dependency files unchanged |
| Fresh lint, TypeScript and production build | PASS | `npm run check` in the isolated checkout, including all public/admin/auth/image routes; no application credentials configured |
| Fresh image validation | PASS | Six tests pass using the isolated checkout's source and dependencies |
| Fresh migration generation | PASS | `npm run db:generate` finds four tables and no schema changes; both migrations, snapshots and journal remain unchanged |
| Blank-database migrations and setup | PASS | Five fixture checks: documented environment template, both migrations/four-table schema, repeat-run journal skipping, five concepts/four categories/ten gallery rows and private password CLI/verifier round-trip |
| Staged security and whitespace | PASS | Exact recovered-file whitelist, full staged-blob secret scan, clean `git diff --cached --check` and retained ignore rules |
| Preservation | PASS | Existing HEAD, local environment bytes and application/asset file contents preserved; only this progress document changes; no live Neon migration/reseed or R2 mutation |

The database fixture uses the existing ignored PGlite test engine with the
isolated checkout's Drizzle, migrations, schema, writer, reader and seed source.
It adds no production dependency. Its optional test adapter was resolved to that
test installation. The first clean install encountered Windows `EPERM` launching
esbuild's post-install binary check; a normal retry completed successfully. Legacy
loader and npm install-script notices remain informational maintenance items;
all final application and setup checks pass.

Final staging contains **72 files: 71 recovered additions and this progress
document**. No inherited application file remains untracked. Local credentials,
verification helpers/reports, dependencies and build outputs remain excluded.
Full file classifications, the staged summary and fresh-checkout evidence are in
ignored `.local/verification/batch5/git-recovery/`. The validation checkout and
its generated outputs are outside the repository. No commit, push or deployment
was performed by this recovery. **Await approval; Batch 6 has not started.**

The Batch 4 and earlier sections below are historical completed checkpoints;
their next-batch/stop wording describes those earlier checkpoints.

## Batch 4 status — Phases 06–07

**Complete — implementation and final acceptance PASS, including owner login.**
The existing implementation and all completed Batch 1–3/refinement work were
preserved. This continuation inspected Git changes, documentation, schema,
migration history, authentication, administration and saved verification reports
before making changes. No implementation restart, dependency reset, migration
replay, reseed or destructive database operation was needed.

The earlier continuation completed local authentication-origin configuration and
Batch 4 closeout documentation. The saved `ADMIN_PASSWORD_HASH` has the supported
format and the runtime reads the same value. Its earlier reported invalid format
was not assumed to be corrected. Two initial owner-password attempts in a local
masked prompt failed the old hash comparison. With explicit owner approval,
replaced only `ADMIN_PASSWORD_HASH` using the project's generator and a local
two-field masked prompt. All other environment bytes, including owner edits,
were preserved. Actual login, owner session, admin access and logout now pass.
Checks exposed no hash, password, configured email value, database URL or
authentication secret.

The earlier production check found `UntrustedHost`: `AUTH_URL` was absent. Added
only the nonsecret `AUTH_URL=http://localhost:3000` setting to ignored `.env.local`.
All pre-existing file bytes, including every secret value, were preserved and
verified. Restarting the local preview resolved the error without changing the
authentication implementation or trusting arbitrary hosts.

**Stop after Batch 4. Batch 5 has not started.** The approved six-batch execution
plan is unchanged. Storage and uploads remain deferred.

### Phase 06 — database and backend

- Added Neon PostgreSQL and Drizzle with lazy HTTP reads, request-scoped
  WebSocket pools and transactional writes. Runtime and direct migration
  connection configuration stays server-only; errors omit credential values.
- Implemented projects, categories and ordered gallery metadata, independent
  concept/completed and draft/published enums, relational constraints, unique
  slugs, typed JSONB content and millisecond timestamps for edit versions.
- Added the versioned `0000_portfolio` migration and explicit check/migrate/seed
  commands. The repeatable seed skips existing slugs and preserves edited data.
  Builds and website requests never apply migrations or seeds.
- Persisted all five existing concept studies, four categories and ten gallery
  entries with their disclosures, cover references, previews and null live URLs.
- Replaced the local public reader with published-only PostgreSQL queries.
  Request-time rendering, request-only memoization and mutation revalidation
  cover the homepage, listing and old/new detail routes. Missing, draft and
  unavailable details return 404; failures never expose local fallback records.

### Phase 07 — authentication and administration

- Added the pinned Auth.js Credentials provider for one environment-configured
  administrator, encrypted eight-hour JWT sessions, HttpOnly/SameSite cookies,
  secure cookies on HTTPS, logout and credential-change session invalidation.
- Added hidden-input password hashing with salted scrypt and constant-time
  verification. Credentials remain on the server. Protected pages and each
  privileged data-access operation independently authorise the session.
- Built the responsive dashboard, search, create/edit/delete forms, independent
  delivery/publication controls, featured selection and ordering, categories,
  project-study content, technologies, use cases, covers and gallery metadata.
- Added nested server validation, publication-completeness checks, retained form
  details, pending/error feedback, stale-edit protection, atomic gallery writes
  and slug-confirmed deletion. Referenced image files are retained.
- Kept image handling limited to existing local references. No R2 client,
  bucket, upload endpoint or upload flow was implemented.
- Completed local authentication setup and documented the canonical origin
  required by the installed Auth.js version for local production previews.

### Batch 4 validation

Verified on 16–17 November 2026 (Africa/Lagos), with Node.js 24.20.0 and Next.js
16.4.6. Existing completed reports were inspected and retained; fresh continuation
checks verified current configuration, live data and the production application.

| Check | Result | Evidence |
| --- | --- | --- |
| ESLint | PASS | Fresh check completed with zero errors/warnings |
| TypeScript | PASS | Fresh Next route type generation and strict `tsc --noEmit`; production build also checked types |
| Production build | PASS | Fresh Turbopack build; portfolio/admin/auth routes render at request time and static company/contact routes remain buildable |
| Live Neon connections | PASS | Fresh HTTP state queries and the existing database CLI's WebSocket connection check |
| Migration state | PASS | Live Drizzle journal matches the committed migration hash and timestamp; three tables and all enum values exist; no migration rerun |
| Data preservation | PASS | All five concepts round-trip exactly against the completed catalogue; four categories, ten gallery images, disclosures and null live URLs retained; no temporary records remain |
| Local credentials | PASS | Existing password pattern and verifier accept the saved format; secret length and email format meet authentication requirements; values withheld |
| Local production auth | PASS | After the nonsecret origin addition, the real Credentials endpoint and login form are enabled; invalid login returns a generic error and establishes no session |
| Actual owner-password login | PASS | 12 local checks using configured ADMIN_EMAIL and the privately entered owner password: hash match, real Credentials login, owner session, cookie protections, dashboard/editor/new form, logout and access refusal afterward |
| Temporary credentials/accounts | PASS | Legacy credentials refused by the real endpoint, no temporary session issued, no account adapter or temporary records, obsolete preview launcher disabled |
| Anonymous access | PASS | All four protected route probes redirect to login; the session endpoint exposes no administrator identity |
| Production public routes | PASS | Fresh checks of all ten public routes, inherited noindex/nofollow and two expected 404s |
| Migration, transactions and validation | PASS | Existing disposable PostgreSQL report: 13 checks covering migration repeatability, publication isolation, stale writes/deletes, duplicate/category conflicts, rollback, gallery cascade and nested validation |
| Live backend writes | PASS | Existing live Neon report: five checks covering HTTP/WebSocket create/read/edit/delete, stale-write protection and rollback; temporary draft removed and pre-existing records unchanged |
| Authenticated admin behaviour | PASS | Existing live Neon browser report: 14 checks covering temporary-identity login, encrypted session, CSRF, CRUD, validation, expired-session action refusal, logout and native no-JS login |
| Admin layouts/accessibility | PASS | Existing report: list/new/editor at 320/390/1024/1440px in both themes; 24 layouts, selected axe checks and no recorded browser errors |
| Public regression coverage | PASS | Existing reports: 80 responsive layouts, 40 accessibility scans, 138 link checks, 13 behaviour checks and 20 theme checks; no recorded errors |
| Production dependency audit | PASS | Fresh `npm audit --omit=dev`: zero findings |
| Full dependency audit | PASS | Fresh `npm audit`: zero findings after a scoped transitive esbuild fix; all four moderate development entries resolved |
| Dependency compatibility | PASS | Patched legacy CJS/ESM transformations; Drizzle generates identical migration SQL and schema definitions without accessing the live database |
| Whitespace and preservation | PASS | Full prospective diff including untracked files checked with an isolated index; inherited implementation and migrations preserved, font-license trailing whitespace removed, real index unchanged |
| Secret handling | PASS | Current `.env.local`/`AUTH_URL` privately checked; no configured secrets in prospective files or client assets, no credentials or temporary helpers staged; owner environment edits retained |
| Approved hash replacement | PASS | Only ADMIN_PASSWORD_HASH bytes changed; all other bytes preserved and actual owner login verified; partial-write rollback and concurrent-edit safeguards checked with fixtures |
| Password punctuation | PASS | Project generator/verifier accept `!`; removing it fails the exact comparison, using a disposable memory-only fixture |

Existing successful-login and CRUD coverage uses the previous temporary test
identity. Final owner verification used the real environment-configured identity
and password entered only in the local masked prompt and passed through process
stdin. The project's running development server reloaded the approved hash
change; all 12 owner-login checks passed. Production build and endpoint checks
remain separately recorded above. No plaintext credentials were written to files,
arguments, logs or reports. Automated Chromium/axe results do not claim exhaustive
browser testing or certification.

The first continuation production probe exposed the missing origin and was rerun
successfully after that setting was added. Intermittent Windows native-process
launch failures were retried, as in earlier batches; completed application checks
pass. The final acceptance checkpoint traced all four development findings to
`drizzle-kit@0.31.11` → `@esbuild-kit/esm-loader@2.6.5` →
`@esbuild-kit/core-utils@3.3.2` → `esbuild@0.18.20`, with one underlying advisory,
GHSA-67mh-4wv8-2f99. A scoped override selects esbuild 0.25.12, already present
in the toolchain. Isolated and installed-package transformations and migration
generation passed. The lockfile removes only the obsolete nested esbuild package
records; direct dependency versions and earlier overrides are unchanged. Full
and production audits are clean. The offered forced Drizzle Kit downgrade was
not applied. Remove the override when upstream drops the deprecated loaders or
adopts a patched range. Their deprecation remains a low-severity maintenance
concern; the current audits contain zero vulnerability findings.

No Batch 4 acceptance blocker remains. The owner explicitly approved replacing
only the administrator hash, superseding the original prohibition for that one
field. The first reset-helper attempt stopped before modifying `.env.local` and
did not test the newly entered password. Read-only checks verified the field,
generator and local endpoint; a retry with a longer startup deadline and precise
step reporting completed the replacement and actual login/logout. The earlier
failure report did not identify its exact cause. Byte-preservation and partial-
write rollback safeguards passed fixture checks; concurrent edits remain intact.
Local configuration saved by the owner during troubleshooting was retained.
The app accepts punctuation, including `!`. The exact cause of the old mismatch
remains unknown because the old hash's original password and generation method
were not recorded.

Existing evidence remains under ignored `.local/verification/batch4/`; new state,
HTTP, configuration-preservation and continuation reports are under its `resume/`
directory. Final acceptance evidence and private helpers are under `acceptance/`.
No permanent test dependency or external message was added.

### Batch 4 files

The inherited implementation was reviewed and preserved:

- Tooling: `package.json`, `package-lock.json`, `tsconfig.json`,
  `drizzle.config.ts`, `drizzle/0000_portfolio.sql`,
  `drizzle/meta/0000_snapshot.json`, `drizzle/meta/_journal.json`.
- Database/authentication: `src/server/env.ts`, `src/server/db/client.ts`,
  `schema.ts`, `src/server/auth/config.ts`, `authorization.ts`, `password.ts`,
  `scripts/database.ts`, `scripts/admin-password.ts`.
- Portfolio backend: `src/server/portfolio/reader.ts`, `queries.ts`, `admin.ts`,
  `writer.ts`, and the existing public route/reader integration.
- Admin routes: `src/app/admin/actions.ts`, `layout.tsx`, `login/page.tsx`,
  `(protected)/layout.tsx`, `(protected)/page.tsx`,
  `(protected)/projects/page.tsx`, `(protected)/projects/new/page.tsx`,
  `(protected)/projects/[id]/edit/page.tsx`, and
  `src/app/api/auth/[...nextauth]/route.ts`.
- Admin UI: `src/lib/admin-project.ts`, `src/components/admin/login-form.tsx`,
  `project-form.tsx`, `delete-project-form.tsx`, `src/styles/admin.css`.
- Server integration, database, authentication and portfolio boundary notes.

The earlier continuation changed only `.env.example`, `README.md`,
`DESIGN_DIRECTION.md`, `PROJECT_PROGRESS.md`, `src/server/auth/README.md`, and
ignored `.env.local` (the nonsecret origin addition only). Temporary verification
helpers and reports are ignored. Existing staged/untracked work is retained;
no commit, push, deployment or Batch 5 implementation was performed.

The final acceptance checkpoint changes `package.json`, `package-lock.json`,
`README.md`, `PROJECT_PROGRESS.md`, `src/server/auth/README.md`,
`public/fonts/ibmplexmono-OFL.txt` and `public/fonts/manrope-OFL.txt`.
Ignored verification helpers/reports and the disabled legacy preview launcher
remain local. Ignored `.env.local` received only the explicitly approved
ADMIN_PASSWORD_HASH replacement; the owner's other file bytes and every other
secret value are preserved. Nothing was staged or committed. Batch 4 is ready
to commit; Batch 5 has not started.

Sections below record earlier completed checkpoints. Their “next batch” wording
describes the historical state at each checkpoint, not the current Batch 4 status.

## Historical pre-Batch 4 refinement checkpoint

**Complete — implemented and validated.** This is a focused checkpoint
between Batches 3 and 4, not a seventh batch or a change to the approved roadmap.
**Batch 4 (Phases 06–07) is next and has not started.**

- Applied the approved homepage proposition, supporting copy, eyebrow, signature
  and secondary CTA. Public pages, shared service descriptions, metadata and
  footer now connect customer journeys with business operations.
- Replaced restrictive European-market wording with **Working with businesses
  internationally.** Europe remains the initial acquisition market internally.
- Retained the identity, layouts and illustrations; removed About origin-story
  annotations, raised small labels to 12px and subtly highlighted open services.
- Added native System/Light/Dark controls with semantic palettes, before-paint
  preference initialisation, safe localStorage handling and CSS no-JS fallback.
- Preserved contact@bitmasonlabs.com, email-draft-only enquiries, all five concept
  projects and null live URLs, fictional disclosures, portfolio contracts and
  server-only readers, and noindex/nofollow. No dependency or Batch 4 feature was
  added.

### Refinement validation

| Check | Result | Evidence |
| --- | --- | --- |
| Lint | PASS | ESLint completed with zero errors/warnings |
| TypeScript | PASS | Next route type generation and strict tsc checking; production build also checked types |
| Production build | PASS | Final Turbopack build compiled and generated all public routes |
| Public routes and responsive layouts | PASS | All ten routes in both palettes at 320, 390, 1024 and 1440px; no overflow, clipped preview headings, broken anchors or failed images. Homepage checks repeated after the final mobile headline break |
| Route, anchor, image and 404 links | PASS | 69 internal checks per palette; unknown pages and projects return the expected 404 |
| Accessible page states | PASS | 40 axe WCAG A/AA and best-practice page checks at 390/1440px in both palettes, plus mobile menu, invalid form and draft-ready states; no selected violations |
| Contrast | PASS | 18 semantic text/background combinations meet 4.5:1; copper errors on surface are 4.95:1 light and 6.65:1 dark. Primary labels are 8.80:1 light and 8.25:1 dark |
| System and saved preferences | PASS | Fresh light/dark system defaults, live OS changes, explicit Light/Dark selections, reload/client-navigation persistence and System removing the override |
| Invalid or unavailable storage | PASS | Invalid values cleared safely; blocked storage allows switching and client navigation |
| Before-paint theme | PASS | Script is in the generated head. Four first-frame cases with framework hydration blocked show the correct scheme/background for saved and system settings |
| JavaScript-disabled fallback | PASS | All ten routes in both system palettes; native menu, service disclosure, category filtering and email-draft POST validation/preparation work |
| Keyboard, reduced motion and short screens | PASS | Skip link, focus outlines, mobile Enter/Space/Escape, native theme selection at 320px, reduced motion and reachable menu actions at 390 x 300px |
| Portfolio preservation | PASS | All five concepts, category counts, project detail/breadcrumb links and null live URLs retained; server-only catalogue, reader and public contract unchanged |
| Enquiry behaviour | PASS | Required/server validation, preserved values, pending feedback, recipient/encoding, result focus and stale-draft removal; no delivery or storage added |
| Development hydration / audit follow-up | PASS | Using http://localhost:3000, HMR connects, saved dark theme survives Strict Mode, draft focus works and editing removes stale drafts; no browser/hydration errors |
| Scope preservation | PASS | Hash checks confirm unchanged manifests, configuration, enquiry logic, portfolio contracts/readers and server boundaries; all eight service IDs unchanged |

The audit's inconclusive development checks used 127.0.0.1. Repeating that probe
reproduced an HMR WebSocket handshake failure and incomplete hydration. Installed
Next.js 16.4 documentation confirms that localhost is allowed by default and
other development hostnames need explicit allowedDevOrigins. The same checks
pass using the advertised localhost URL. No origin-policy relaxation or form
logic change was needed. Production verification uses its loopback-IP preview.

Some Windows native-process and browser launch attempts were interrupted and
rerun. The completed reports above record passes; automated accessibility and
Chromium checks do not claim certification or exhaustive cross-browser testing.
No email was sent. No application blocker remains for this checkpoint.

Reports, fixtures and captures are under ignored
`.local/verification/refinement/`. No permanent browser-test dependency was added.

### Refinement files changed

- Documentation: `README.md`, `DESIGN_DIRECTION.md`, `PROJECT_PROGRESS.md`.
- Routes: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/about/page.tsx`,
  `src/app/services/page.tsx`, `src/app/portfolio/page.tsx`,
  `src/app/contact/page.tsx`.
- Homepage: `src/components/home/hero.tsx`, `company.tsx`, `services.tsx`,
  `selected-work.tsx`, `contact.tsx`.
- Shared layout: `src/components/layout/site-header.tsx`, `site-footer.tsx`,
  `skip-link.tsx`, plus new `theme-control.tsx`.
- Shared UI/copy: `src/components/ui/button.tsx`,
  `src/components/public/page-cta.tsx`, `src/lib/site.ts`, `homepage.ts`,
  `service-details.ts`, plus new `src/lib/theme.ts`.
- Styles: `src/styles/globals.css`, `homepage.css`, `public-pages.css`.

These are 27 source/documentation files relative to the checkpoint baseline.
Pre-existing staged/untracked Batch 1–3 work remains intact. No package or lockfile
change, database, authentication, admin, publishing, upload or email-delivery
implementation is included. **Batch 4 (Phases 06–07) remains next; not started.**

## Batch 3 status — Phases 04–05

**Complete — public pages and portfolio architecture implemented and validated.**
Batch 4 (Phases 06–07) is next and has not started. The completed homepage,
foundation, original branding, fonts, existing imagery and approved enquiry inbox
were preserved. No new dependencies or backend providers were introduced.

## Batch 3 work completed

### Phase 04 — public pages

- Built About with company positioning, engineering philosophy, four working
  principles and the existing four-stage delivery approach.
- Built Services with the three established capabilities, detailed scope and
  business use cases for all eight services, service anchors and the existing
  labelled systems/AI illustration.
- Built a dedicated Portfolio listing with four data-derived categories and
  server-rendered category filters. Links work without JavaScript; invalid or
  repeated categories have a clear empty state and a return to all projects.
- Built five reusable project studies at `/portfolio/[slug]`, with overview,
  fictional business brief, solution, features, technologies, use cases, gallery,
  publication-safe lookup, breadcrumbs and next-project navigation. Known public
  slugs are prerendered; missing or unpublished records return 404.
- Built Contact with native and server validation, inline errors, preserved form
  details, pending feedback, keyboard focus and a reviewable email draft. The
  form works through a native POST without JavaScript. Editing details hides the
  previous draft when JavaScript is enabled.
- Retained **contact@bitmasonlabs.com** and the existing direct email-draft
  configuration. Successful validation says **Your email draft is ready**.
  Nothing is stored or sent by the website, and no delivery-success claim is
  shown. The visitor chooses to send the draft from an email application.
- Connected shared header/footer navigation, brand links and enquiry CTAs to the
  completed pages. Added current-page states, useful project and full-image links,
  unique metadata, canonical destinations and social-preview metadata. All public
  pages continue to inherit `noindex, nofollow`.
- Reused the homepage's typography, palette, section conventions, components and
  project presentation studies. The 404 page now shares the public navigation and
  visual system. Corrected the contact introduction's landmark grouping after
  the initial accessibility scan.

### Phase 05 — portfolio architecture

- Defined a typed public project contract with name, slug, category, summary,
  independent delivery/publication status, featured flag, ordered cover/gallery
  data with captions and dimensions, overview, business problem, solution,
  features, technologies, use cases and nullable live URL.
- Kept all five projects as **concepts**. Their `published` state means visible
  in the local preview; it does not imply commissioned delivery or public launch.
  No public demo URLs are verified, so all live URLs remain `null`.
- Separated the local catalogue from presentation behind one `server-only`,
  asynchronous reader. Homepage selection, listing, filters, detail lookup,
  category counts and generated slugs use this boundary. Drafts are excluded from
  every public read, independently of delivery or featured status.
- Extracted reusable project previews and linked figures, preserving the
  homepage compositions. Public components also support completed-project
  labels and a cover fallback for future records without a presentation study.
- Added five genuine public-interface captures and four verified project photos.
  Each gallery contains an interface and illustrative imagery; Northfield reuses
  its existing cover as the second image. Documented sources, crops and scope in
  `public/images/projects/README.md`. No sibling credentials, private APIs,
  authentication or databases were accessed.
- Documented the future database adapter and deliberate publication revalidation
  boundary. No schema, migrations, database client, authentication, admin,
  uploads or publishing backend has been implemented.

## Batch 3 validation

Verified on 16 November 2026 (Africa/Lagos), with Node.js 24.20.0, npm 11.19.0
and the final Next.js 16.4.6 production build.

| Check | Result | Evidence |
| --- | --- | --- |
| `npm run check` | PASS | Final exit code 0 after the landmark correction; ESLint, route type generation, strict TypeScript and production build |
| ESLint | PASS | Zero errors or warnings; explicit image alternatives satisfy the configured accessibility lint rules |
| TypeScript | PASS | Generated route types, `tsc --noEmit` and build-time checking succeeded |
| Production build | PASS | Homepage, About, Services, Contact, five generated project studies, 404 and icon built; Portfolio is server-rendered for query filtering |
| Public routes and links | PASS | All ten public routes returned 200; 69 internal route, anchor, image and expected-404 checks passed |
| Metadata | PASS | Unique page titles, descriptions, correct canonical URLs, British English and inherited `noindex, nofollow` on all public routes |
| Responsive layouts | PASS | All ten routes at 320, 390, 768, 1024 and 1440px; no horizontal overflow, clipped preview headlines, unloaded images or runtime page errors |
| Keyboard and navigation | PASS | Visible 2px focus, skip link, mobile Enter/Space, Escape focus return, current-page state, cross-page approach anchor, project/breadcrumb navigation and back-to-top |
| Portfolio contract | PASS | Published-only listing/detail/slugs/categories, independent concept/completed state, featured selection and ordered galleries; fixture checks use temporary compiled copies |
| Assets and concept status | PASS | Five accurate concept records, no verified live URLs, all cover/gallery paths and intrinsic dimensions verified; original scope checked against the existing projects |
| Enquiry validation | PASS | Required fields, valid/invalid email, short/oversized input, unsupported controls, invalid options, duplicate fields and file values; client constraints bypassed to exercise server errors |
| Form interaction | PASS | Preserved details, inline errors and focus, disabled fields while pending, approved recipient and encoded draft, honest ready feedback and removal of stale drafts after editing |
| JavaScript disabled | PASS | All ten routes render; native menu expanded state confirmed through Chromium accessibility data; service disclosure, category filtering, detail navigation and invalid/valid native form POSTs work |
| Accessibility | PASS | axe-core 4.10.3: no selected WCAG A/AA or best-practice violations at 390/1440px across all ten routes, plus open menu, form errors and draft-ready state |
| Zoom and reduced motion | PASS | Five representative public pages at 720 × 500 CSS pixels / pixel ratio 2, equivalent to 200% desktop zoom; no overflow and tested transitions become 0s |
| Short-screen navigation | PASS | At 390 × 300px the menu scrolls and its enquiry link remains reachable |
| External requests | PASS | Public browser checks use local fonts and images; no runtime external requests or external messages were made |
| `git diff --check` | PASS | Working and staged tracked diffs have no whitespace errors; existing staging was retained |

Rendered desktop/mobile page, service, gallery and form captures were inspected.
Reports, screenshots, contract fixtures and verification helpers remain under
the ignored `.local/verification/batch3/` directory and `.local/`. No permanent
browser-test dependency was added and no email was sent. Verification servers
were stopped after testing.

The initial accessibility scan identified a nested complementary landmark on
Contact; its introduction now uses normal content grouping, and the final scans
pass. Some Windows shell/Node launches exited with the previously observed native
process crash; successful retries completed without framework changes. Browser
interaction assertions were adjusted to await native disclosure state and client
navigation commits. These tooling observations are not outstanding application
failures.

## Batch 3 files changed

New public routes:

- `src/app/about/page.tsx`
- `src/app/services/page.tsx`
- `src/app/portfolio/page.tsx`
- `src/app/portfolio/[slug]/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/contact/actions.ts`

New reusable components:

- `src/components/layout/public-page.tsx`
- `src/components/public/page-hero.tsx`
- `src/components/public/page-cta.tsx`
- `src/components/public/service-directory.tsx`
- `src/components/portfolio/project-preview.tsx`
- `src/components/portfolio/project-card.tsx`
- `src/components/portfolio/case-study.tsx`
- `src/components/contact/enquiry-form.tsx`

New content, validation and data boundary:

- `src/lib/company.ts`
- `src/lib/service-details.ts`
- `src/lib/navigation.ts`
- `src/lib/metadata.ts`
- `src/lib/portfolio.ts`
- `src/lib/enquiry.ts`
- `src/server/portfolio/local-projects.ts`
- `src/server/portfolio/reader.ts`
- `src/server/portfolio/README.md`
- `src/styles/public-pages.css`

Updated existing files:

- `src/app/page.tsx`
- `src/app/not-found.tsx`
- `src/components/home/hero.tsx`
- `src/components/home/services.tsx`
- `src/components/home/systems.tsx`
- `src/components/home/selected-work.tsx`
- `src/components/home/contact.tsx`
- `src/components/layout/brand.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`
- `src/lib/homepage.ts`
- `src/styles/globals.css`
- `src/server/README.md`
- `public/images/projects/README.md`
- `README.md`
- `PROJECT_PROGRESS.md`

New gallery assets:

- `public/images/projects/le-saphir/interface.webp`
- `public/images/projects/le-saphir/story.webp`
- `public/images/projects/ecoshine/interface.webp`
- `public/images/projects/ecoshine/cleaning.webp`
- `public/images/projects/northfield/interface.webp`
- `public/images/projects/aurelia/interface.webp`
- `public/images/projects/aurelia/facility.webp`
- `public/images/projects/linden/interface.webp`
- `public/images/projects/linden/interior.webp`

The existing package manifests, enquiry configuration, fonts, five cover images
and homepage stylesheet are unchanged from the Batch 3 starting point. All
previous staged and unstaged work was preserved; no commit or push was created.

## Batch 2 status

**Complete — homepage development implemented and validated.** Its completed
components and design system are retained in Batch 3. The existing foundation
and interrupted homepage work were
preserved; no other public pages, admin dashboard or backend integrations were
implemented in this batch.

## Batch 2 work completed

- Completed the one-page homepage with brand navigation, hero, company
  introduction, three engineering capabilities, eight services, selected
  projects, systems and AI, engineering approach, contact CTA and footer.
- Retained the approved paper/ink/green identity, original geometric brand mark
  and SVG icon, locally hosted Manrope and IBM Plex Mono with their OFL licences,
  editorial section compositions and reusable components.
- Preserved Le Saphir, EcoShine, Northfield Home Services, Aurelia Private Clinic
  and Linden & Co. as visibly labelled **Concept project** portfolio studies.
  Checked descriptions and imagery against the existing sibling repositories.
  The showcase uses composed previews, without claimed client results or live
  production delivery. Asset provenance is in `public/images/projects/README.md`.
- Kept the hero and systems figures as original, labelled sample-data
  illustrations. Clarified connections between websites, applications/APIs,
  business databases, team dashboards and reviewable AI-agent workflows.
- Confirmed **contact@bitmasonlabs.com** with the owner on 15 November 2026.
  The enquiry action opens an email draft with project prompts; a direct email
  link is also available. No website form, email-sending backend, unverified
  social destination or empty legal link is presented.
- Fixed the desktop enquiry button appearing on mobile and pushing the Menu
  control off-screen. Kept desktop and mobile navigation at the intended
  breakpoint, with no horizontal overflow down to 320px.
- Improved mobile expanded-state announcements, Escape/outside-click dismissal,
  focus handling, keyboard exit and short-screen menu scrolling. Native menu and
  service disclosures remain usable without JavaScript.
- Moved the `#top` target from the sticky header to the hero so the brand and
  footer return links actually reach the page start. Corrected the Le Saphir
  photograph's alternative text.
- Adjusted the clinic preview to stack its headline and image at smaller widths,
  preventing the tablet headline from overlapping the photograph. Checked all
  project preview headlines for internal clipping as well as page overflow.
- Updated README to reflect the implemented homepage, actual contact behaviour,
  concept evidence, self-hosted assets and remaining launch boundaries.

### Files changed when resuming this batch

- `src/components/layout/site-header.tsx`
- `src/components/layout/mobile-navigation.tsx`
- `src/components/home/hero.tsx`
- `src/components/home/systems.tsx`
- `src/lib/homepage.ts`
- `src/lib/site.ts`
- `src/styles/homepage.css`
- `README.md`
- `PROJECT_PROGRESS.md`

The existing homepage section components, brand, fonts, five project images,
root page/layout changes and shared primitives remain in place. Existing staged
and unstaged work was preserved; this continuation did not create a commit.

## Batch 1 status

**Complete — 100% of Batch 1.** Foundation, design research and local verification
are finished and remain the foundation for the completed homepage.

## Batch 1 work completed

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

## Batch 2 validation

Verified on 15 November 2026 (Africa/Lagos), using Node.js 24.20.0, npm 11.19.0
and the final Next.js 16.4.6 production build.

| Check | Result | Evidence |
| --- | --- | --- |
| `npm run check` | PASS | Final exit code 0: ESLint, route type generation, strict TypeScript and production build |
| ESLint | PASS | Zero errors or warnings; warnings fail the configured command |
| TypeScript | PASS | Route types generated; `tsc --noEmit` and build-time checking succeeded |
| Production build | PASS | `/`, the 404 route and the SVG icon prerendered successfully |
| Production HTTP | PASS | GET, HEAD, localhost GET and RSC prefetch returned 200; missing route returned 404; brand icon returned 200 |
| Responsive layouts | PASS | 320, 360, 390, 768, 1024 and 1440px; no horizontal overflow or runtime page errors; all five project images loaded |
| Navigation and keyboard | PASS | Skip link, visible focus, desktop section links, eight service disclosures, mobile Enter/Space, Escape focus return, outside click, link focus, resize closing and back-to-top |
| Short-screen menu | PASS | At 390 × 300px the menu scrolls, its enquiry action stays reachable and tabbing out closes the disclosure |
| 200% zoom equivalent | PASS | 720 × 500 CSS-pixel viewport at pixel ratio 2, representing 1440 × 1000 at 200%; no overflow or clipped content |
| Reduced motion | PASS | Tested action transitions become 0s and scrolling remains automatic |
| JavaScript disabled | PASS | All eight content sections render; native menu/service disclosures work; Chromium's accessibility tree exposes the menu's expanded state |
| Automated accessibility | PASS | axe-core 4.10.3 found no selected WCAG A/AA or best-practice violations at 390 and 1440px, including the open mobile menu |
| Concept honesty and assets | PASS | Five visible concept labels, sample-data captions, source notes, licensed local fonts and no external asset requests |
| Email enquiry draft | PASS | Approved recipient and correctly encoded subject/body; no form or delivery-success claim. No email was sent during verification |
| `git diff --check` | PASS | No whitespace errors in the tracked working diff |

Rendered hero, project, systems, contact and footer captures were inspected.
Reports, screenshots and temporary validation helpers are in the ignored
`.local/verification/batch2/` directory and `.local/`. No permanent browser-test
dependency was added, and no external message was sent.

Some Windows shell/browser processes and one Next build worker exited with a
native process crash during verification. The affected checks were rerun; the
final build and application checks passed without changing the framework
configuration. The cause of those intermittent host/tooling exits was not
established. The local reports retain the affected audit and its retry.

## Batch 1 validation (historical)

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

- R2 SDK, bucket, image delivery host, uploads and storage policy implementation.
- AI models/providers, agents and automation execution.
- GitHub remote, Vercel connection/deployment and Cloudflare DNS changes.
- Automatic website contact-form delivery, booking tools and analytics. The
  validated email-draft enquiry form and direct email route are implemented and
  do not depend on these features.

## Outstanding inputs and issues

- No outstanding application lint, TypeScript, production-build or tested
  public/admin interaction failures remain. The local production authentication
  origin issue is resolved, and the current saved password hash has a supported
  format.
- The full dependency audit reports four moderate development-only findings in
  Drizzle Kit's legacy esbuild chain. Production dependencies have zero findings;
  compatible upstream tooling should be reviewed during launch checks.
- The five showcased businesses remain fictional portfolio concepts. Verified
  commissioned work, delivery evidence and measured outcomes are still needed
  before presenting any of them as real client case studies.
- The enquiry inbox is owner-approved. Email delivery depends on the visitor's
  email application and the mailbox; actual delivery was not tested by sending.
- Company registration, physical address, legal copy and social accounts have
  not been supplied or verified. They are omitted rather than invented.
- All public pages remain `noindex, nofollow` until a separately requested public
  launch. Deployment, DNS, final launch-content review and any legal pages remain
  outside the completed batches.
- Intermittent Windows native process crashes affected verification tooling;
  successful retries are recorded above. The earlier reported HTTP 400 remains
  unreproduced, including against the completed homepage. Original failing
  request details would be needed if it recurs.

## Batch 4 stop point

**Batch 4 (Phases 06–07) is complete. Stop here.** Batch 5 has not started.
Image uploads and remote storage require a separately requested continuation of
the unchanged six-batch roadmap. Deployment, DNS and launch work remain deferred.
Deliberately revisit `noindex, nofollow` during launch preparation.
