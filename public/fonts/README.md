# Planned self-hosted typography

The design direction selects Manrope for headings and body text, and IBM Plex
Mono for technical labels. Font assets are deferred to Batch 2. The foundation
uses local system fallbacks and makes no font requests during builds or browsing.

When adding fonts, retain the applicable SIL Open Font License, subset Latin
coverage as needed, use WOFF2 and `font-display: swap`, and load only the weights
used in the final design. Prefer `next/font/local` or a small local `@font-face`
configuration; avoid adding a font package or a runtime Google Fonts dependency.
