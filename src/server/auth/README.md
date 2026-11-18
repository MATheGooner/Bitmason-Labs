# Auth.js boundary — Batch 4

The pinned Auth.js v5 Credentials provider protects portfolio administration.
There is one administrator configured by `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH`;
there is no registration, account database or user-management interface.

- Keep configuration and session helpers under `src/server/auth/`.
- Auth.js handlers live at `src/app/api/auth/[...nextauth]/route.ts` (GET/POST).
  Missing or invalid credentials fail closed with a generic 503 response.
- Keep `AUTH_SECRET`, provider credentials and session access on the server.
  Use a fresh secret per environment. Set `AUTH_URL=http://localhost:3000` for
  local previews, including `next start`. The installed Auth.js version infers
  trusted hosts in development and on recognised deployment platforms; local
  production without a canonical origin rejects requests with `UntrustedHost`.
  Use the target origin or supported platform inference when deploying.
- Sessions use Auth.js encrypted JWTs, HttpOnly/SameSite cookies and an eight-hour
  lifetime; HTTPS uses secure cookies. Email/hash changes invalidate older tokens.
- Authorise every sensitive Route Handler or Server Action. Hiding controls in
  the UI or checking a session only in navigation does not secure a resource.
- Batch 6 persists atomic login budgets in PostgreSQL: five attempts per client
  and 50 globally per ten minutes. Expiring HMAC keys retain no raw addresses;
  only Vercel's trusted header selects a client, and other hosts share a budget.
  Missing database/schema protection fails closed at the Credentials provider.

Run `npm run admin:password` or the explicit PowerShell command in README.
The hidden prompt never echoes or writes the plaintext; only a scrypt hash is
printed (N=131072, r=8, p=1, random 16-byte salt, 64-byte key). The salt is
hex-encoded and passed to scrypt as text; other generators can produce a valid
format with incompatible parameters or salt encoding. A supported format does
not establish that the intended password matches. Store the hash
and a random `AUTH_SECRET` in `.env.local`. Comparisons use `timingSafeEqual`.
Login failures retain only the email, clear the password and remain generic.
Protected pages and every privileged DAL operation authorize on the server,
at request time even when configuration was absent during the build. No global
session provider or proxy-only security boundary is used.
Restart the server after administrator configuration changes before verifying
an actual owner login; changing credentials invalidates previous sessions.

Implementation source: [Auth.js installation](https://authjs.dev/getting-started/installation).
