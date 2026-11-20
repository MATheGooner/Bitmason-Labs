# Portfolio imagery and workflow refinement

Completed 20 November 2026. The existing site structure, typography and colour
tokens are preserved. No dependencies were added.

Portfolio previews now show original website interfaces immediately. The
composed headers, replacement copy, tinting and visual-direction toggle have
been removed. One shared cover component serves the featured projects, main
portfolio and case-study covers. It selects independently captured mobile views
below 768 px and contains the entire screenshot without stretching or cropping.

Every desktop asset is 1440 × 900 (8:5). Every mobile asset is 780 × 1688,
captured from the original 390 × 844 mobile viewport at double resolution. The
source assets use lossless WebP. Each project's own typography, colours,
photography, layout and original website overlays remain intact.

| Project | Cover asset pair under `public/images/projects/` | Original source |
| --- | --- | --- |
| Le Saphir | `le-saphir/cover-desktop.webp`, `le-saphir/cover-mobile.webp` | Original Le Saphir About page, compiled HTML, CSS and public imagery |
| EcoShine | `ecoshine/cover-desktop.webp`, `ecoshine/cover-mobile.webp` | Original EcoShine homepage and compiled SPA assets |
| Northfield Home Services | `northfield/cover-desktop.webp`, `northfield/cover-mobile.webp` | Original Northfield homepage, CSS, logo and verified original hero photograph |
| Aurelia Private Clinic | `aurelia/cover-desktop.webp`, `aurelia/cover-mobile.webp` | Original Aurelia homepage, CSS, logos and verified original healthcare photograph |
| Linden & Co. | `linden/cover-desktop.webp`, `linden/cover-mobile.webp` | Original Linden homepage, CSS and local photography |

All cover images are available. Le Saphir's homepage requires an unconfigured
`DATABASE_URL`, so its genuine About page is used instead. No replacement
homepage has been fabricated. Detailed provenance is recorded in
[the image source notes](../public/images/projects/README.md).

The workflow now follows a customer action, the information it carries,
connected business operations and a useful next action. Open typography and a
single directional handoff replace the boxed selectors, nested panels and
separate progression. Enquire, Buy and Book each change the customer interest,
interaction, shared details, relevant operations and resulting action. The
compact hero carries the same story; the larger section gives the operations
more detail and uses the existing dark section palette.

The text tabs support arrow keys, Home and End, with visible focus, selected
states and labelled panels. Changes are announced politely to screen readers.
Reduced-motion preferences disable the short content transition. No stages
are numbered and no customer records are invented.

Changed implementation and documentation files:

- `src/components/home/business-journey.tsx`
- `src/components/home/hero-workspace.tsx`
- `src/components/home/systems.tsx`
- `src/components/portfolio/project-cover.tsx`
- `src/components/portfolio/project-preview.tsx`
- `src/components/portfolio/project-card.tsx`
- `src/components/portfolio/portfolio-image.tsx`
- `src/components/portfolio/case-study.tsx`
- `src/lib/project-covers.ts`
- `src/server/portfolio/local-projects.ts`
- `src/styles/homepage.css`
- `src/styles/public-pages.css`
- `public/images/projects/README.md`
- `docs/portfolio-workflow-refinement.md`

The ten new cover files are listed in the table above. Existing published local
cover references are upgraded during presentation; subsequent administrator
uploads remain authoritative. No database or remote storage records were edited.

Validation completed:

- Lint passed with zero warnings.
- Next.js route type generation and TypeScript `tsc --noEmit` passed.
- Production build passed: compilation, TypeScript and all 18 static pages.
- All five original projects were inspected individually on desktop and mobile.
- Homepage and portfolio passed at 390, 768 and 1440 px: all five covers decoded,
  selected the correct variant, retained the shared aspect ratio, used no image
  filters and had no horizontal overflow or browser errors.
- All five case-study routes returned 200 and decoded the genuine cover images.
- Both workflow instances passed keyboard selection and reduced-motion checks.
- The workflow passed its scoped WCAG accessibility check with no violations.

Source contact sheets, final workflow screenshots and browser results are retained
locally in `.local/verification/portfolio-workflow/`.
