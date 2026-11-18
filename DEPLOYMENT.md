# Production deployment handoff

18 November 2026. **Prepared; not deployed. Public launch and indexing remain
blocked.** Vercel is not connected, the canonical HTTPS site is unavailable,
and owner launch checks are outstanding. Local validation is recorded in
`PROJECT_PROGRESS.md`.

## Hosting settings

| Setting | Required configuration |
| --- | --- |
| Source | Reviewed commits from `MATheGooner/Bitmason-Labs`, branch `main` |
| Framework / root | Next.js / repository root (`.`) |
| Node.js | `24.x`, already declared in `package.json`; select the same version in Vercel |
| Install / build | `npm ci --include=dev` / `npm run build` |
| Output | Next.js default; preserve server rendering, Auth.js, Server Actions and image optimization |
| Functions | Node.js with Fluid Compute; admin/media routes declare a 120-second maximum |
| Region / plan | Confirm the existing Neon region and intended commercial hosting plan in the owner account |

Use the existing architecture; no static export, Worker adapter, new storage
service or background scheduler is required. `.vercelignore` excludes local
credentials, verification fixtures, dependencies and generated output from CLI
uploads. The generated Next.js production build is the deployment artifact.

## Private environment configuration

Configure the intended existing values securely in Vercel's **Production** scope.
Do not copy credentials into Git, this document or `NEXT_PUBLIC_*` variables,
and do not overwrite `.env.local` or existing production credentials.

| Variable | Requirement |
| --- | --- |
| `DATABASE_URL` | Existing pooled Neon runtime connection |
| `DATABASE_URL_UNPOOLED` | Existing direct connection for the secure migration runner; not required in deployed runtime |
| `AUTH_SECRET` | Intended private session secret, at least 32 characters; preserve existing credentials |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` | Intended administrator and the existing supported scrypt hash, not the password |
| `AUTH_URL` | `https://bitmasonlabs.com`, the established canonical production origin |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` | Existing bucket-scoped R2 configuration |
| `R2_PUBLIC_BASE_URL` | Existing public image origin `https://assets.bitmasonlabs.com` |
| `SITE_INDEXING_ENABLED` | `false` for preparation and initial deployment |

Let Vercel supply its own platform/environment identifiers. For previews, omit
`AUTH_URL` to use Auth.js platform inference and keep indexing false. Leave
preview database/admin/R2 settings unset until the owner supplies an approved
isolated configuration; static previews do not verify portfolio features.

The configured database has the additive `0002_admin_login_limits` migration.
Reusing it needs no migration replay or seed. If the owner selects a different
approved database, deliberately apply committed migrations using the direct
connection. Never migrate, reset or seed from the deployment build command.

## Owner deployment and domain steps

1. Connect the already suggested Vercel plugin, or import the repository in the
   intended Vercel account/team. Push the reviewed local commits before choosing
   the deployment source. Configure the settings and production variables above.
2. Deploy with indexing disabled. Add `bitmasonlabs.com` and
   `www.bitmasonlabs.com` to that project; make the apex canonical and configure
   `www` to redirect to its HTTPS origin.
3. Copy the **actual records displayed by that Vercel project** into Cloudflare.
   No DNS targets or verification tokens are supplied here. Preserve the existing
   asset-domain and Zoho MX/TXT records. Verify domain ownership, DNS propagation
   and Vercel TLS issuance before calling the domain ready.
4. On a secure runner with the intended production variables supplied, run
   `npm run production:check -- --remote`. This checks Neon/R2 configuration and
   connectivity, migration history, published routes, HTTPS/security headers,
   redirects, protected administration and the delivered noindex policy. The
   unchanged local `AUTH_URL` is local, so a production check using only
   `.env.local` intentionally fails.
5. Verify actual owner-password login/logout on production, public portfolio
   images and responsive navigation. Confirm the enquiry draft opens the intended
   mail client, and separately send/receive a real test message in the intended
   inbox. MX records and a `mailto:` draft do not prove email delivery.
6. Approve the final company/contact details, five concept disclosures and any
   applicable legal content. Only after all launch checks pass, set
   `SITE_INDEXING_ENABLED=true` in Production and rebuild/redeploy. Run
   `npm run production:check -- --remote --indexing` to check served HTML/headers,
   robots and the published-only sitemap. Previews, admin and API routes stay
   unindexed. Search-engine discovery is not guaranteed by enabling the policy.

## Verification and rollback

Local commands: `npm run check`, `npm run test:images`, `npm run test:security`
and `npm run production:check -- --local`. These do not prove a hosted launch.
Production dependency audit passes. The full audit currently has 14 high-severity
development findings from [unpatched picomatch](https://github.com/advisories/GHSA-fc5q-39xc-vjpf).
Recheck for a supported upstream fix; do not force a framework downgrade.

If launch checks fail, leave indexing disabled and correct the configuration or
roll back the application deployment. Preserve the additive login-limit table,
portfolio records and R2 assets; application rollback does not require a database
reset. Image cleanup remains authenticated, bounded and retryable through the
dashboard, with no scheduler.

Hosting references: [Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions),
[function limits](https://vercel.com/docs/functions/limitations),
[domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain).
