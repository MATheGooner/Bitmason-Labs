# Project imagery and presentation previews

Prepared on 15 November 2026 from the existing portfolio projects in the sibling
workspace directories. Images are resized, metadata stripped and encoded as
WebP; the five published files total approximately 378 KB. All are served locally
through `next/image`; visiting the homepage makes no request to a photo provider.

| File | Original source | Homepage scope evidence |
| --- | --- | --- |
| `le-saphir.webp` | `Le Saphir/public/images/hero.jpeg` | `Le Saphir/README.md` and `app/page.tsx`: fictional restaurant, menu, demonstration orders and reservations |
| `ecoshine.webp` | `EcoShine/public/images/cleaning-hero.jpg` | `EcoShine/README.md` and `src/pages/HomePage.jsx`: fictional cleaning company, service presentation and guided quote request |
| `northfield.webp` | [Existing hero photograph](https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=85) in `Northfield Home Services/data/images.ts` | `data/site.ts`, `components/home/Hero.tsx` and homepage source: fictional trades company, service discovery and visit enquiries |
| `aurelia.webp` | [Existing homepage photograph](https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1200&q=85) in `Aurelia Private Clinic/app/page.tsx` | Original repository's `DEPLOYMENT.md`, `docs/booking-architecture.md` and homepage: healthcare portfolio implementation and appointment requests |
| `linden.webp` | `Linden/public/images/apartment-facade-swiss.webp` | `Linden/README.md` and `src/app/page.tsx`: fictional Geneva agency, property discovery and enquiries |

The original Aurelia repository was used, not the separate `Aurelia Private
Clinic - Copy` directory. No sibling credentials or databases were accessed.
The Northfield photograph was fetched successfully from its original source;
the older sibling screenshot with a broken image was not reused.

The former homepage HTML/CSS presentation studies have been removed. Project
covers now show genuine desktop and mobile website captures, documented below.
All five businesses are fictional. Their sample contacts, ratings, testimonials,
prices and operational claims are not copied into the Bitmason homepage.

The hero and systems figures explain customer journeys and information handoffs
without invented customer records or a claim to represent a live Bitmason product.

## Batch 3 galleries — 16 November 2026

The dedicated portfolio uses genuine interface captures from existing compiled
public-page artifacts, plus verified project photography. Five interface WebP
files and four additional photographs total about 0.54 MB. The Northfield gallery
reuses its existing cover photograph as its second image.

| Gallery asset | Existing source | Capture / presentation scope |
| --- | --- | --- |
| `le-saphir/interface.webp` | `Le Saphir/.next/server/app/about.html` | Restaurant story-page introduction, 1440 × 782; no database-backed menu was invoked |
| `le-saphir/story.webp` | `Le Saphir/public/images/story.jpeg` | Illustrative kitchen photograph, 1000 × 667 |
| `ecoshine/interface.webp` | `EcoShine/dist/index.html` and its compiled public assets | Homepage crop, 1440 × 585; excludes fictional insurance claims and the trust strip |
| `ecoshine/cleaning.webp` | `EcoShine/public/images/about-cleaning.jpg` | Illustrative cleaning photograph, 1200 × 800 |
| `northfield/interface.webp` | `Northfield Home Services/.next/server/app/index.html` | Hero crop, 1440 × 630; excludes the fictional contact number, ratings and trust strip |
| `aurelia/interface.webp` | Original `Aurelia Private Clinic/.next/server/app/index.html` | Homepage introduction, 1440 × 795; excludes the trust strip and patient testimonials |
| `aurelia/facility.webp` | [Existing facility photograph](https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=85) in the original `app/page.tsx` | Illustrative healthcare setting, 1200 × 817 |
| `linden/interface.webp` | `Linden/.next/server/app/index.html` | Homepage interface, 1440 × 1000; fictional agency, with no live property availability claim |
| `linden/interior.webp` | `Linden/public/images/living-kitchen-open-plan.webp` | Illustrative property interior, 1200 × 800 |

Captures render the existing public artifacts through a temporary loopback static
server. Next.js artifact scripts are removed for captures; EcoShine uses its
existing compiled SPA. No sibling application server, private API, authentication,
credential file or database was used. The Northfield capture resolves its existing
hero image to the previously verified local copy of the same source photograph.

Only crops, image resizing and WebP encoding are applied; interface designs and
content are not invented. Captions identify the fictional context and illustrative
photographs. No interface capture is represented as commissioned client work,
real operational data or evidence of a public deployment. All images are local at
website runtime, and the full-image gallery links resolve to these actual assets.

## Responsive website covers — 20 November 2026

Every project uses `cover-desktop.webp` and `cover-mobile.webp` in its project
directory. Desktop captures show a complete 1440 × 900 viewport (8:5 landscape).
Mobile captures show a complete 390 × 844 viewport at double resolution
(780 × 1688, portrait). Mobile is captured independently using the original
responsive CSS. Covers use lossless WebP; no colours, fonts, layouts, imagery,
overlays or filters are added or changed by Bitmason. Original website overlays
remain part of the photographed interface. The shared cover component contains
the whole capture and selects mobile below 768 px, with no stretching or cropping.

| Project directory | Original website source | Page captured |
| --- | --- | --- |
| `le-saphir` | `Le Saphir/.next/server/app/about.html`, original CSS and public images | `/about` |
| `ecoshine` | `EcoShine/dist/index.html` and its original compiled assets | `/` |
| `northfield` | `Northfield Home Services/.next/server/app/index.html`, original CSS and public assets | `/` |
| `aurelia` | Original `Aurelia Private Clinic/.next/server/app/index.html`, original CSS and public assets | `/` |
| `linden` | `Linden/.next/server/app/index.html`, original CSS and public images | `/` |

Le Saphir's homepage cannot be captured with the available configuration: its
database-backed menu requires `DATABASE_URL`, which is not configured in the
original project. Its real About page is used instead; no homepage is fabricated.
All cover photography is available. Northfield and Aurelia's remote photographs
resolve to the previously verified local copies of the exact original sources
listed above. Public logos are served from the original project asset folders.

The cover manifest upgrades existing local cover references when rendering
published records; later administrator uploads retain their own image. No
database records or remote storage objects are overwritten.
