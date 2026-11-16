# Neon + Drizzle boundary — Batch 4

`@neondatabase/serverless`, `drizzle-orm` and development-only `drizzle-kit` are installed.

- Runtime queries use `DATABASE_URL`, the pooled Neon PostgreSQL connection.
- Migration tooling uses `DATABASE_URL_UNPOOLED`, the direct connection. Keep
  migration credentials outside the client and production runtime where possible.
- `schema.ts` defines portfolio projects, categories and gallery metadata.
  Ordered text lists and the existing cover/preview metadata use typed JSONB.
  Independent delivery/publication enums preserve concept honesty.
- `client.ts` provides lazy HTTP reads and request-scoped WebSocket pools,
  with Node 24's native WebSocket and guaranteed cleanup. Writers use interactive
  transactions; row locking and version checks prevent stale saves.
- `drizzle.config.ts` and `drizzle/0000_portfolio.sql` are versioned tooling.
  Run migrations deliberately; never on page requests or during `next build`.
- Validate connection URLs without including their contents in errors or logs.

Run `npm run db:check`, `npm run db:migrate`, then `npm run db:seed`.
The scripts use Next's environment loader and tsx with the `react-server`
condition to retain `server-only` guards outside Next.js. Seed imports skip
existing slugs without changing edits, statuses or publication decisions.
No auth-user tables, contact persistence, upload tables or speculative models
are included. Use a Neon development branch for test records.

Implementation sources: [Neon with Drizzle](https://neon.com/docs/guides/drizzle),
[Drizzle with Neon](https://orm.drizzle.team/docs/connect-neon).
