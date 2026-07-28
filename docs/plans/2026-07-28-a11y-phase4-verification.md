# A11y Phase 4 — WCAG 2.2 AA verification pass (issue #63)

Phase 4 of the accessibility remediation. Adds a durable automated a11y suite
and records the results of the one-time manual verification.

## Durable automated suite

New Playwright `axe` project (headless Chromium) added to the existing
`playwright.config.ts` alongside the Guidepup screen-reader projects. It shares
the same `webServer` (`tests/serve-site.js` serving the built `_site`), so
`npm run build` must run first. Run with `npm run test:a11y`.

- `tests/a11y/pages.ts` — single source of truth for the 13 canonical,
  nav-reachable pages (home, about, case-study index + 4 studies, resume index
  + 5 variants). Orphan/legacy pages not linked from the site nav
  (`pages/resume/federal-resume-opm.html`, `va-job-listing.html`) and internal
  docs are intentionally excluded.
- `tests/a11y/axe-scan.test.ts` — axe scan of every page, tagged
  `wcag2a/2aa/21a/21aa`, failing on any `critical`/`serious` violation (the VA
  prototyping-kit model). Verified with a canary that a deliberately broken page
  is flagged (`image-alt`, `label`, `document-title`).
- `tests/a11y/target-size.test.ts` — WCAG 2.2 §2.5.8: footer links, primary
  nav, and home nav measured ≥24×24 CSS px at a 376px viewport.
- `tests/a11y/reflow.test.ts` — WCAG §1.4.10: every page loaded at a 320px
  viewport (≈400% zoom) with no horizontal document overflow.

Result: **29/29 pass.**

Dependencies added: `@axe-core/playwright`, `axe-core` (dev). `npm run test:sr`
was scoped to `--project=voiceover --project=nvda` so it no longer sweeps in the
new axe project.

## Issues found and fixed

The reflow suite caught real horizontal-scroll bugs on the resume pages at 320px
(all in `_scss`, screen rendering of the print-styled resume):

1. **Header contact block** (`.header__portfolio`) — the long email and portfolio
   URL could not wrap in the 50%-width header column. Added
   `overflow-wrap: anywhere` (mirrors the existing case-study header fix).
2. **`white-space: nowrap` on contact links** — pinned the long email so it
   overflowed even with (1). Removed; the short phone number still fits on one
   line, and the email now breaks only when it must.
3. **Two-column job layout** — `.job__details` (float 33%) / `.accomplishments`
   (float 65%) never stacked, so at 320px the accomplishments column was ~171px
   and domain strings like `agencyportal.usajobs.gov` overflowed. Added
   `overflow-wrap: anywhere` to the column text and a `breakpoint(SM, "down")`
   rule that stacks both columns to full width below 480px. Print (~816px) never
   matches the max-width query, so the printed two-column resume is untouched.

## Manual verification results

- **Keyboard (2.1.1, 2.4.3, 2.4.7, 2.4.11)** — tabbed through home, about, a
  case study, and a resume: 23–25 stops each, a visible focus indicator on every
  stop, logical order, no traps. ✅
- **Zoom / reflow (1.4.10)** — covered by the durable reflow suite at 320px. ✅
- **Text spacing (1.4.12)** — applied the text-spacing bookmarklet CSS
  (line-height 1.5, letter 0.12em, word 0.16em, paragraph 2em) across the four
  page types: no overflow or clipping. ✅
- **Target size (2.5.8)** — covered by the durable target-size suite. ✅
- **Contrast (1.4.3, 1.4.11)** — axe's `color-contrast` passes on all pages
  (solid colors). The home overlay white text over `rgba(38,38,38,0.7)` on a
  worst-case pure-white image pixel composites to `rgb(103,103,103)` →
  **5.66:1** (AA normal needs 4.5). Home-nav red renders at ≥24px (large text),
  so its 3.23:1 passes the 3:1 large-text threshold. ✅

## VoiceOver spot-check (§1.3.1 / AT verification)

Automated via Guidepup rather than a manual pass. `tests/screen-reader/voiceover.spec.ts`
now covers all four page types from #63 — home, a case study (usajobs), the
resume, and about — navigating into the web content and asserting VoiceOver
announces each page's `<h1>`.

These run in **CI only** (`.github/workflows/screen-reader-tests.yml`, macOS
runner, on every PR to `main`) because screen readers can't drive a headless
browser and VoiceOver takes over the whole machine. Locally they are available
via `npm run test:sr:voiceover` after `npx @guidepup/setup`, but the workflow is
the source of truth. The parallel NVDA suite (`nvda.spec.ts`) still covers the
home page only.
