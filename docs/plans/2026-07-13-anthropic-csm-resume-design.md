# Anthropic CSM Resume Variant — Design

**Date:** 2026-07-13
**Target:** [Customer Success Manager, Public Sector at Anthropic](https://job-boards.greenhouse.io/anthropic/jobs/5262369008)

## Goal

A 2-page-max print resume tailored to a Customer Success Manager (Public Sector)
role, with email and phone in place of the site footer.

## Approach

Follow the existing per-application pattern (`pages/resume/gsa.html`, `opm.html`,
`federal.html`): a static page at `pages/resume/anthropic.html` using the
`print-resume` layout and `l-federal-resume` body class. The public `/resume/`
page is untouched.

## Changes

1. **`_layouts/print-resume.html`** — render an email/phone contact line in the
   header when a page sets `contact: true` in front matter. Existing variant
   pages are unaffected.
2. **`pages/resume/anthropic.html`** — new page:
   - Profile: "Government + AI adoption" framing (validated with Matthew),
     ending with intent to help agencies get mission value from Claude.
   - Experience re-weighted for CSM values: stakeholder relationships, driving
     adoption across 60+ teams, change management, quantified ROI, hands-on
     AI/MCP tooling. All claims traceable to `_data/experience.yml`.
   - Compression: USDS → 3 bullets, OPM → 2, EightShapes → 1, Microsoft → 1.

## Verification

Build the site, render the page to PDF with headless Chrome, confirm ≤ 2 pages
and that contact info appears in the header.
