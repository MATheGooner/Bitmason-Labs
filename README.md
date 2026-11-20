# Bitmason Labs

**From customer interest to everyday operations.**

Bitmason Labs builds websites, online stores and custom software around customer journeys and business operations, working with businesses internationally.

This repository contains the Bitmason Labs website, including its public pages, portfolio, PostgreSQL-backed content management and administrator dashboard.

## Local setup

**Requirements:** Node.js 24 and npm.

```bash
npm ci
```

Copy `.env.example` to `.env.local`, configure the required environment variables, then run:

```bash
npm run dev
```

Open http://localhost:3000.

Keep credentials in local environment files or deployment environment settings. Never commit secrets.

## Commands

| Command               | Purpose                       |
| --------------------- | ----------------------------- |
| `npm run dev`         | Start development server      |
| `npm run lint`        | Run ESLint                    |
| `npm run typecheck`   | Check TypeScript              |
| `npm run build`       | Create production build       |
| `npm run start`       | Run production build locally  |
| `npm run check`       | Run lint, typecheck and build |
| `npm run db:generate` | Generate database migration   |
| `npm run db:migrate`  | Apply database migrations     |
| `npm run db:check`    | Check database connection     |
| `npm run db:seed`     | Seed portfolio projects       |

## Technology stack

- Next.js and React
- TypeScript
- Tailwind CSS
- PostgreSQL with Neon
- Drizzle ORM
- Auth.js
- Cloudflare R2
- Vercel

## Project structure

```text
src/
  app/          Public routes and application entry points
  components/   Shared interface components
  lib/          Public data, content and utilities
  server/       Database, authentication and storage
  styles/       Global styles and design tokens

public/
  fonts/
  images/

docs/           Design research and supporting documentation

.env.example
DEPLOYMENT.md
PROJECT_PROGRESS.md
```

## Public routes

| Route               | Description                |
| ------------------- | -------------------------- |
| `/`                 | Homepage                   |
| `/about`            | Company introduction       |
| `/services`         | Services and capabilities  |
| `/portfolio`        | Project portfolio          |
| `/portfolio/[slug]` | Individual project studies |
| `/contact`          | Business enquiries         |
| `/staff/login`      | Administrator login        |

## Portfolio projects

The portfolio currently features five fictional concept projects:

- Le Saphir — Hospitality
- EcoShine — Home services
- Northfield Home Services — Home services
- Aurelia Private Clinic — Healthcare
- Linden & Co. — Property

These projects demonstrate design and engineering capabilities. They are not commissioned client projects, and no client results or testimonials are claimed.

## Important notes

- Portfolio content is managed through PostgreSQL.
- Portfolio images are stored using Cloudflare R2.
- Administration is restricted to authorized users.
- The contact form validates enquiries and prepares an email draft; it does not automatically send or store submissions.
- Public pages remain excluded from search indexing until launch approval.

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment requirements and [PROJECT_PROGRESS.md](PROJECT_PROGRESS.md) for implementation status.
