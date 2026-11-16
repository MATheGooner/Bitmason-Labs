# Server integration boundaries

`env.ts` reads named variables lazily and is guarded by `server-only`. Batch 4
implements the [database-backed public portfolio reader](portfolio/README.md),
guarded by the same boundary. An import from a Client Component fails at build time.
Builds require no credentials; active portfolio/admin features require configuration. The contact Server
Action validates form input and prepares an email draft; it does not persist
details or call an email provider.

Keep provider-specific work in the directories below. Add `import "server-only"`
to every adapter and data-access module when implementing it. Server Components,
Route Handlers and Server Actions can call these modules; Client Components
must receive only deliberate, serialisable public data.

| Directory | Responsibility | Activation point |
| --- | --- | --- |
| `db/` | Neon connections, Drizzle schema and query functions | A real persistence requirement and configured Neon database |
| `auth/` | Auth.js configuration, session helpers and access checks | A defined protected feature, providers and session strategy |
| `storage/` | Cloudflare R2 image storage and upload policy | An implemented image publishing or upload flow |
| `portfolio/` | Published-only reads, authorized admin access and transactional writes | Implemented; local catalogue remains a non-destructive seed source |

Keep routes thin. Validate feature input at the request boundary, then call a
specific server function. Do not create a catch-all service layer, an API just
to call local server code, or general-purpose mock providers.

`db/client.ts` uses lazy Neon HTTP readers and request-scoped WebSocket pools for
interactive transactions. The schema and migration configuration are tooling
entry points; they contain no credentials. Public readers always filter published
records. `portfolio/admin.ts` authorizes every privileged operation; internal
query/writer modules are not browser APIs. Auth.js configuration and hashing are
server-only. Storage clients, uploads and AI execution remain unimplemented.
