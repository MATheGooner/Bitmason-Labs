# Bitmason Labs

**Computing + craftsmanship.**

Bitmason Labs is a B2B digital engineering company serving European SMEs.
This repository contains the Batch 1 application foundation and design research.
The root route is a temporary verification page; the marketing homepage has not
been implemented.

## Local setup

Use **Node.js 24 LTS** and npm. `.nvmrc` and `package.json` declare the Node version.
From the project directory:

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No credentials or environment
file are needed. Use `npm install` when intentionally changing dependencies, and
commit the resulting `package-lock.json` with the manifest.

If a later feature needs external credentials, copy `.env.example` to
`.env.local` and populate only that feature's variables. In PowerShell:

```powershell
Copy-Item .env.example .env.local
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

| Technology | Status in Batch 1 |
| --- | --- |
| Next.js 16.4, App Router | Configured; Server Components by default |
| React 19.3 | Configured |
| TypeScript 5.9 | Strict checking, explicit imports and `@/` source alias |
| Tailwind CSS 4.3 | CSS-first theme tokens and PostCSS integration |
| ESLint 10 | Flat Next.js configuration; no deprecated `next lint` command |
| Neon PostgreSQL + Drizzle | Planned server boundary and variables; no installed SDK, database or schema |
| Auth.js | Planned server boundary and variables; no providers, sessions or routes |
| Cloudflare R2 | Planned server boundary and variables; no client, bucket or uploads |
| Vercel | Standard Next.js build is ready for future deployment; no project connected |
| Cloudflare DNS | Intended DNS provider; no records changed |
| GitHub | Local Git repository initialised on `main`; no remote created or push performed |

Only Next.js, React, React DOM and the small `server-only` boundary guard are
runtime dependencies. Build tools are development dependencies. There is no UI
kit, animation library, state manager, database server, Docker stack, backend
service, analytics script or image SDK.

Two scoped npm overrides are documented rather than silently ignoring dependency
checks. The ESLint override keeps a single supported ESLint 10: the
[Next.js 16.4 documentation](https://nextjs.org/docs/app/api-reference/config/eslint#setup-eslint)
confirms compatibility while some included plugins still declare older peer
ranges. The `typescript-estree` override uses patched `minimatch` 11.0.8 for
[GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249).
Review and remove each override when the upstream dependency metadata or version
range incorporates the fix. TypeScript is pinned to the established 5.9 line
supported by the selected lint and framework toolchain.

## Structure

```text
src/
  app/
    layout.tsx          Root layout, public metadata and skip link
    page.tsx            Temporary foundation verification route
    not-found.tsx       Accessible 404 route
  components/
    layout/             Shared layout elements
    ui/                 Small reusable primitives: Container and Button
  lib/
    cn.ts               Optional class-name composition
    site.ts             Public brand constants
  server/
    env.ts              Lazy, server-only reads of named environment variables
    db/                 Neon + Drizzle implementation notes
    auth/               Auth.js implementation notes
    storage/            Cloudflare R2 implementation notes
  styles/
    globals.css         Tailwind import, design tokens and accessible base styles
public/
  fonts/                Font asset plan; system fallbacks used in Batch 1
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
  motion. The temporary route is explicitly `noindex, nofollow`; replace that
  policy deliberately when preparing the finished site for launch.

Read [the server boundary notes](src/server/README.md) before implementing an
integration. No credentials are read at import time, and the public `site.url`
constant does not connect the application to the domain.

## Design and future batches

[DESIGN_DIRECTION.md](DESIGN_DIRECTION.md) defines the visual identity,
three capability areas, responsive behaviour, imagery policy and section-level
homepage plan. Reference screenshots are local research artefacts under the
ignored `.local/research/` directory, never website assets.

[PROJECT_PROGRESS.md](PROJECT_PROGRESS.md) records actual validation results,
content dependencies and the proposed next batch. Batch 2 has not started.

When deployment is later requested, connect the GitHub repository to Vercel,
use `npm run build`, select Node.js 24 and configure environment variables there
only for implemented features. Obtain the required domain records from Vercel
before changing Cloudflare DNS; no speculative DNS or deployment configuration
is included here.
