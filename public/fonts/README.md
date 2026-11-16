# Self-hosted typography

The design direction selects Manrope for headings and body text, and IBM Plex
Mono for technical labels. Both are loaded with `next/font/local` from
`src/app/layout.tsx`, with `font-display: swap` and system fallbacks. No build or
runtime request to Google is needed. Only Manrope is preloaded.

| Asset | Coverage and weight | Source |
| --- | --- | --- |
| `manrope-latin-variable.woff2` | Latin; variable, used from 400–650 | [Manrope, Google Fonts](https://fonts.google.com/specimen/Manrope), [download](https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggexSg.woff2) |
| `ibm-plex-mono-latin-regular.woff2` | Latin; regular 400 | [IBM Plex Mono, Google Fonts](https://fonts.google.com/specimen/IBM+Plex+Mono), [download](https://fonts.gstatic.com/s/ibmplexmono/v23/-F63fjptAgt5VM-kVkqdyU8n1i8q1w.woff2) |

Retrieved 15 November 2026. The applicable SIL Open Font License texts are retained
as `manrope-OFL.txt` and `ibmplexmono-OFL.txt`, sourced from the corresponding
[`google/fonts` directories](https://github.com/google/fonts/tree/main/ofl).
The two WOFF2 files total approximately 39 KB. Add further coverage only when
content requires it; retain the licence alongside any future font variants.
