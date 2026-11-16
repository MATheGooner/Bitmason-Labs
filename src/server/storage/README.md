# Cloudflare R2 boundary — deferred

Install only `@aws-sdk/client-s3` when an image storage feature is implemented;
add `@aws-sdk/s3-request-presigner` if the upload flow specifically needs signed
URLs. R2 uses the S3-compatible API, not a separate storage service.

- Keep the lazy, server-only client in `src/server/storage/client.ts`.
- Derive `https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com` on the server. Use R2's
  `auto` region, the named bucket and scoped access credentials.
- An optional `R2_PUBLIC_BASE_URL` is the HTTPS public asset domain. It is not a
  credential and must not be confused with the private S3 API endpoint.
- Decide public delivery versus private reads from actual image requirements.
  Authorise uploads, validate media type and size, and generate object keys on
  the server. Add bucket CORS rules only for a required browser upload flow.
- Permit only the chosen public image host in Next.js `images.remotePatterns`
  after configuration. Do not add a wildcard remote image permission now.
- Use object keys and approved public URLs in page data; keep API keys private.

No R2 SDK, bucket, client, public host, uploads or asset service is configured
in Batch 1. All future variables are documented in `.env.example`.

Implementation source: [R2 S3 API with JavaScript](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/).
