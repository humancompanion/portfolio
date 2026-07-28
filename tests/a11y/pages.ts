// Single source of truth for the canonical, nav-reachable pages the automated
// a11y suite scans. Adding a page to the site means adding one line here.
//
// Orphan/legacy pages that are not linked from the site navigation
// (pages/resume/federal-resume-opm.html, va-job-listing.html) and internal
// docs (SETUP-INSTRUCTIONS, docs/plans/*) are intentionally excluded — see the
// Phase 4 verification notes on issue #63.

export interface SitePage {
  /** URL path served by tests/serve-site.js (relative to baseURL). */
  path: string;
  /** Human label used in test titles. */
  label: string;
  /** Whether this page renders the shared footer (.footer). */
  hasFooter: boolean;
  /** Whether this page renders the primary nav (standard or --home variant). */
  hasNav: boolean;
}

export const PAGES: SitePage[] = [
  { path: "/", label: "home", hasFooter: false, hasNav: true },
  { path: "/about/", label: "about", hasFooter: true, hasNav: true },
  { path: "/case-study/", label: "case-study index", hasFooter: true, hasNav: true },
  { path: "/case-study/cisco/", label: "case study — cisco", hasFooter: true, hasNav: true },
  { path: "/case-study/marriott/", label: "case study — marriott", hasFooter: true, hasNav: true },
  { path: "/case-study/smeqa/", label: "case study — smeqa", hasFooter: true, hasNav: true },
  { path: "/case-study/usajobs/", label: "case study — usajobs", hasFooter: true, hasNav: true },
  { path: "/resume/", label: "resume index", hasFooter: true, hasNav: true },
  // Resume variant pages are standalone print resumes with no shared nav/footer.
  { path: "/resume/anthropic/", label: "resume — anthropic", hasFooter: false, hasNav: false },
  { path: "/resume/federal/", label: "resume — federal", hasFooter: false, hasNav: false },
  { path: "/resume/gsa/", label: "resume — gsa", hasFooter: false, hasNav: false },
  { path: "/resume/nava/", label: "resume — nava", hasFooter: false, hasNav: false },
  { path: "/resume/opm/", label: "resume — opm", hasFooter: false, hasNav: false },
];
