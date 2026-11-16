# Design reference evidence

Reviewed on 14 November 2026. The main synthesis and source links are in
[`DESIGN_DIRECTION.md`](../../DESIGN_DIRECTION.md).

`reference-observations.json` records a small subset of primary-site observations:
final URL, response status, computed font families, heading sizes and mobile
navigation controls. Desktop viewport: 1440 × 1000. Mobile viewport: 390 × 844.
These measurements describe the sampled views, not the full responsive systems.

Screenshots were captured in isolated headless Chromium sessions. The four
accessible company homepages and three detailed cases were rendered; Made Tech
returned HTTP 403 in direct browser inspection and is a text-only messaging
reference. Futurice was also captured with ordinary motion settings after its
initial content appeared; early reduced-motion captures are not a basis for
judging its design.

Local captures and temporary inspection scripts remain under the Git-ignored
`.local/` directory. They are research artefacts, not Bitmason product imagery.
No competitor logo, illustration, interface screenshot or font was incorporated
into the application's public assets.
