# Portfolio rendering audit

Verified 23 November 2026 against the existing database and the production build.

## Cause and record trace

AlphaLynx has a complete published record, a managed cover and two managed gallery
images. Its optional `preview` is null. All image references resolve, their
dimensions match their source files, and their ownership records identify the
AlphaLynx project. Neither missing content nor broken uploads caused the collapse.

The record follows the same path as the seeded catalogue:

1. `src/components/admin/project-form.tsx` submits the existing publication,
   featured and display-order fields, alongside cover and gallery references.
2. `src/lib/admin-project.ts` parses the form, including an absent optional
   preview and an empty gallery. `src/app/admin/actions.ts` authorizes saving.
3. `src/server/portfolio/writer.ts` writes the project and gallery transactionally.
   `src/server/storage/references.ts` checks ownership and takes managed image
   dimensions from the asset ledger rather than editable form values.
4. `src/server/portfolio/queries.ts` filters published records, orders them by
   display order, name and slug, and maps them into `PortfolioProject`. A null
   preview remains absent; gallery length does not determine the card structure.
5. `src/server/portfolio/reader.ts` provides these records to the public pages.
   `ProjectCard`, `ProjectPreview` and `ProjectCover` render every record.

Before this change, `ProjectCard` derived a CSS class from `preview.theme`. At
1024 px and above, the shared homepage grid had twelve columns, but only the five
seeded themes received column spans. AlphaLynx's ordinary card occupied one
column: **62 px within an 1184 px grid at a 1440 px viewport**. The full
`/portfolio` page already overrode that grid with two columns and rendered its
AlphaLynx card at 572 px in this checkout. The reproduced collapse was therefore
in the homepage's shared grid, rather than a database or portfolio-reader defect.

There was a separate mobile image assumption: every cover used a 390:844 frame.
That matched the seeded mobile captures but left a large empty area around
AlphaLynx's landscape upload.

## Presentation and selection

All cards now use the same markup and layout classes, independently of preview
metadata or record origin. Homepage cards occupy one full-width row each, with
the cover followed by category, title, summary and case-study link. Scope remains
available on portfolio cards and in case studies. Existing typography, colours
and link/focus feedback are retained; screenshot hover zooms are removed.

The homepage requests only published, featured projects, sorts by administrator
display order with deterministic name/slug ties, and takes at most five **after**
filtering. Portfolio and category selections retain every published project.
The dashboard explains the limit beside its existing display-order field. No
database field or migration is needed.

The current homepage contains AlphaLynx, Le Saphir, EcoShine, Northfield Home
Services and Aurelia Private Clinic. Linden & Co. remains published and
accessible in the six-project portfolio and through its case-study route.

## Image pipeline

The existing Sharp upload processing correctly normalizes orientation, strips
metadata and produces WebP without resizing or cropping the screenshot. R2
stores each immutable managed object with ownership, asset ID and SHA-256
metadata. This upload and ownership pipeline is preserved.

Public covers and galleries continue through Next.js image optimization and its
cached responsive variants. Their `sizes` now match the actual container padding,
portfolio columns and photograph width limits. Small portfolio cards receive
resized images rather than full-resolution R2 originals; full-image gallery links
retain their original references.

A fresh desktop portfolio visit delivered a 640 × 371, 13,632-byte AlphaLynx
thumbnail for its 572 px card, rather than the 2442 × 1414, 111,236-byte original.

Portfolio thumbnails share an 8:5 frame and contain the complete desktop image.
Homepage and case-study covers follow the selected source's intrinsic ratio,
using independently captured mobile images where available. An upload without a
mobile capture keeps its own ratio at every viewport. Galleries retain natural
proportions, alternative text and captions. Unavailable images keep their frame;
unavailable gallery images lose both links to the full image.

AlphaLynx's preserved source dimensions are 2442 × 1414 for its cover,
2467 × 1781 for Command Center and 2562 × 1439 for Launches. All eighteen stored
cover/gallery references were decoded and checked against their metadata.

## Verification and preservation

Passed `npm run lint`, `npm run typecheck`, `npm run build`,
`npm run test:portfolio` and `npm run test:images`. The twelve automated tests
cover dashboard form parsing without preview/gallery data, public selection,
ordering, authoritative uploads, and image processing that retains the source
dimensions and both screenshot corners.

Production Chromium checks passed at 320, 390, 640, 768, 1024 and 1440 px:

- Five full-width homepage projects; six consistent portfolio cards.
- Equal portfolio image frames, row alignment and case-study link alignment.
- All six case studies and all twelve gallery images at 390 and 1440 px.
- Correct source proportions, desktop/mobile variants and high-density sizing.
- Live viewport changes, stable unavailable-image fallbacks, retained captions,
  and removal of unavailable gallery links.
- No broken image references, horizontal overflow or browser errors in normal
  rendering. Scoped project-grid accessibility checks passed at 390 and 1440 px.

Disposable in-memory projects were also rendered through the production app,
with real database access blocked by the fixture transport. Changing only those
fixtures verified public display-order and featured-setting changes, portfolio
access for unfeatured projects, draft/unpublished exclusion and 404 responses,
category filters, and desktop/mobile layout without optional preview or gallery
data. No disposable records were inserted into the live database.

Read-only before/after snapshots are identical for every project, category,
gallery reference and media ownership row. Their canonical SHA-256 is
`b43a1c707d35e424afd1c4fad007feb68b25a114247ac79dbd51db9b7484fd6e`.
R2 HEAD metadata, ETags, byte sizes, decoded dimensions and downloaded SHA-256
hashes also match for all three managed objects. AlphaLynx retains every original
content field, status, featured setting, display order and image reference.
No live database writes, seeds, migrations, resets or asset cleanup ran.

Local snapshots, browser reports, fixture checks and screenshots are retained in
`.local/verification/portfolio-rendering/` (ignored by Git).
