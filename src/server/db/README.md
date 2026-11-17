# Neon + Drizzle boundary — Batches 4–5

`@neondatabase/serverless`, `drizzle-orm` and development-only `drizzle-kit` are installed.

- Runtime queries use `DATABASE_URL`, the pooled Neon PostgreSQL connection.
- Migration tooling uses `DATABASE_URL_UNPOOLED`, the direct connection. Keep
  migration credentials outside the client and production runtime where possible.
- `schema.ts` defines portfolio projects, categories and gallery metadata.
  Batch 5 adds the image ownership/cleanup ledger and restrictive nullable asset
  references; legacy records and local image paths remain valid.
  Ordered text lists and the existing cover/preview metadata use typed JSONB.
  Independent delivery/publication enums preserve concept honesty.
- `client.ts` provides lazy HTTP reads and request-scoped WebSocket pools,
  with Node 24's native WebSocket and guaranteed cleanup. Writers use interactive
  transactions; row locking and version checks prevent stale saves.
- `drizzle.config.ts` and the `0000_portfolio` / `0001_project_images` migrations are versioned tooling.
  Run migrations deliberately; never on page requests or during `next build`.
- Validate connection URLs without including their contents in errors or logs.

Run `npm run db:check`, `npm run db:migrate`, then `npm run db:seed`.
The scripts use Next's environment loader and tsx with the `react-server`
condition to retain `server-only` guards outside Next.js. Seed imports skip
existing slugs without changing edits, statuses or publication decisions.
For an existing Batch 4 database, apply only the new pending migration; do not
reseed or reset records for image setup. The media ledger retains ownership after
project deletion so R2 cleanup can finish. Image references use restrictive foreign
keys, and cleanup rechecks references before storage deletion. No auth-user tables,
contact persistence or speculative models are included. Use a Neon development
branch and temporary records for validation.

Implementation sources: [Neon with Drizzle](https://neon.com/docs/guides/drizzle),
[Drizzle with Neon](https://orm.drizzle.team/docs/connect-neon).
