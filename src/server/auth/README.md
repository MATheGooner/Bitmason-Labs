# Auth.js boundary — deferred

Install the Next.js Auth.js package (`next-auth`) when a protected feature is
defined. Choose providers and the session strategy before configuring an adapter.
Do not expose sign-in UI for a public brochure website without a business need.

- Keep configuration and session helpers under `src/server/auth/`.
- Add Auth.js handlers to `src/app/api/auth/[...nextauth]/route.ts` only when
  authentication is implemented. Expose only the required HTTP methods.
- Keep `AUTH_SECRET`, provider credentials and session access on the server.
  Use a fresh secret per environment. `AUTH_URL` is optional with supported
  auto-detection; configure it when the target environment requires it.
- Use `@auth/drizzle-adapter` only if the chosen session/provider strategy needs
  persisted accounts. Define its real tables with the database feature.
- Authorise every sensitive Route Handler or Server Action. Hiding controls in
  the UI or checking a session only in navigation does not secure a resource.

No Auth.js dependency, secret, provider, session, adapter, protected route or
authentication endpoint exists in Batch 1.

Implementation source: [Auth.js installation](https://authjs.dev/getting-started/installation).
