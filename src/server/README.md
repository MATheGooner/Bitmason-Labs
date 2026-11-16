# Server integration boundaries

Only `env.ts` is implemented in Batch 1. It reads named variables lazily and is
guarded by `server-only`. An import from a Client Component will fail at build
time. No credential is required to start or build the application.

Keep provider-specific work in the directories below. Add `import "server-only"`
to every adapter and data-access module when implementing it. Server Components,
Route Handlers and Server Actions can call these modules; Client Components
must receive only deliberate, serialisable public data.

| Directory | Responsibility | Activation point |
| --- | --- | --- |
| `db/` | Neon connections, Drizzle schema and query functions | A real persistence requirement and configured Neon database |
| `auth/` | Auth.js configuration, session helpers and access checks | A defined protected feature, providers and session strategy |
| `storage/` | Cloudflare R2 image storage and upload policy | An implemented image publishing or upload flow |

Keep routes thin. Validate feature input at the request boundary, then call a
specific server function. Do not create a catch-all service layer, an API just
to call local server code, or general-purpose mock providers.

There are no database clients, schema, migrations, authentication handlers,
storage clients, upload routes, AI integrations or external connections yet.
The per-directory notes describe the planned implementation only.
