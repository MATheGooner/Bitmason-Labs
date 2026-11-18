# Cloudflare R2 image boundary — Batch 5

All adapters and administrative data access are guarded by `server-only`.
`client.ts` lazily validates the five existing R2 variables, derives the S3
endpoint from `R2_ACCOUNT_ID` and uses the AWS S3 SDK with region `auto`.
`R2_PUBLIC_BASE_URL` must be `https://assets.bitmasonlabs.com`. No credentials,
private endpoints, bucket paths or provider error objects reach browser responses.

`image.ts` verifies file size, extension, MIME and signature, then decodes the
complete raster with Sharp. Static JPEG/PNG/WebP, up to 4 MiB, 8192 pixels per
side and 24 megapixels, are normalized into metadata-free WebP. Actual request
streams are bounded before multipart parsing. No browser S3 access, presigning,
additional provider or bucket CORS changes are needed.

`admin.ts` independently authorizes uploads, discard, cleanup and status reads.
Route Handlers also authorize and enforce same-origin mutations. Object keys are
server-generated UUIDs under `portfolio/images/`; callers submit editing/asset
identities, never bucket names or arbitrary paths.

Ownership is reserved before upload. Conditional puts (`If-None-Match: *`) and
Content-MD5 protect creation. A collision removes only the new reservation and
never deletes the existing object. Network ambiguity retains a 15-minute cleanup
delay; completed uncommitted uploads have a 24-hour lifetime.

`references.ts` locks assets within the existing project transaction, verifies
scope/project ownership and lifecycle, attaches authoritative dimensions and
retires old assets after their final reference disappears. Database failure
rolls back claims and retains pending uploads. Project deletion retains the
ledger identity until storage cleanup finishes.

After commit, cleanup verifies managed key, object metadata, size and ETag before
deletion. Attached or referenced objects are protected. Errors retain ledger
entries for authenticated retry; missing objects allow idempotent recovery after
a storage delete followed by a database failure. Navigation discards ready uploads
within that editing scope. The dashboard cleanup control handles queued/expired
objects, up to 30 per request; no background scheduler is added in this batch.

Public asset URLs remain public even for draft-associated images; project pages
and portfolio queries still exclude drafts. Replacements receive new immutable
URLs, preserving current image delivery without overwriting old object keys.
Existing local image files and objects outside this ledger are retained. Browser
and CDN copies can outlive origin deletion.

Relevant tests: `npm run test:images`; disposable database/fault-recovery and live
R2/browser reports are in ignored `.local/verification/batch5/`.

Implementation sources:
[R2 AWS SDK v3](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/),
[S3 compatibility](https://developers.cloudflare.com/r2/api/s3/api/),
[conditional operations](https://developers.cloudflare.com/r2/api/s3/conditional-operations/).
