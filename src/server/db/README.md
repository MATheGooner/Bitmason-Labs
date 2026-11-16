# Neon + Drizzle boundary — deferred

Install `@neondatabase/serverless`, `drizzle-orm` and development-only
`drizzle-kit` when a persistence feature is actually scoped.

- Runtime queries use `DATABASE_URL`, the pooled Neon PostgreSQL connection.
- Migration tooling uses `DATABASE_URL_UNPOOLED`, the direct connection. Keep
  migration credentials outside the client and production runtime where possible.
- Define real tables in `src/server/db/schema.ts`; do not add speculative tables.
- Add the lazy, server-only client in `src/server/db/client.ts` and focused query
  modules beside it. Use the Neon driver suitable for the required query and
  transaction semantics rather than adding a separate PostgreSQL server.
- Create `drizzle.config.ts` and versioned SQL migrations when schema exists.
  Run migrations deliberately; never on page requests or during `next build`.
- Validate connection URLs without including their contents in errors or logs.

No packages, database connection, schema, migration configuration or migration
commands are installed or executable in Batch 1. Environment placeholders live
in the root `.env.example`; lazy reads are available in `../env.ts`.

Implementation sources: [Neon with Drizzle](https://neon.com/docs/guides/drizzle),
[Drizzle with Neon](https://orm.drizzle.team/docs/connect-neon).
