# Public portfolio boundary

Batch 4 replaces Batch 3's local reads with database-backed queries while
preserving the existing asynchronous public contract. Batch 5 extends image
references with optional managed asset identities without changing original records.

- `src/lib/portfolio.ts` defines the serialisable public project contract and
  presentation helpers. Content is independent from React components.
- `local-projects.ts` is the verified seed catalogue. All five records are
  **concepts** with `published` publication status. Publication means visible in
  this preview, not delivered to a client or launched under a public domain.
- `reader.ts` is the only data source imported by public pages and the homepage.
  Its asynchronous functions return published records, category counts, featured
  selections and published slugs. Unknown or unpublished detail records return
  `null`. Gallery order and project order are applied at this boundary.
- `queries.ts` maps PostgreSQL records to the same serializable contract.
- `admin.ts` authorizes every privileged read/write; `writer.ts` performs atomic
  category/project/gallery writes and version-checked deletion. Internal writers
  are also used by the explicit, non-destructive CLI seed command.
- Media identities are claimed in the same project transaction, with scope,
  project ownership, lifecycle and authoritative-dimension checks. Old objects
  become eligible for cleanup only after their last reference disappears.
  `admin.ts` performs authenticated storage cleanup after the transaction commits;
  cleanup failures preserve the saved project and a retryable ledger.

The model includes name, slug, category, summary, delivery status, publication
status, feature selection, cover, ordered gallery items with captions and image
dimensions, overview, business problem, solution, features, technologies, use
cases and a nullable live URL. The optional preview object preserves the existing
homepage presentation studies; an ordinary cover remains the fallback.

Public SQL filters `publication_status = 'published'`. Request-time rendering and
request-only React memoization avoid stale server snapshots after unpublishing;
Server Actions revalidate the homepage, portfolio and old/new detail routes.
The dynamic route accepts new slugs and returns 404 for missing, draft or
unavailable records. Failures never fall back to local published records and never
expose database errors. Completed status never follows automatically from publication.
Public image components retain the authored layouts and show an accessible
fallback when delivery fails. Gallery fallbacks remove both full-image links.
