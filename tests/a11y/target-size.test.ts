import { test, expect, type Page } from "@playwright/test";
import { PAGES } from "./pages";

/**
 * WCAG 2.2 — 2.5.8 Target Size (Minimum), AA (issue #63, Phase 4).
 *
 * Pointer targets must be at least 24×24 CSS px (or have ≥24px spacing). The
 * two clusters flagged in the audit are the footer links and the primary nav,
 * both of which shrink at small viewports. We measure them at a narrow
 * viewport, which is the worst case. The nav and footer are shared includes,
 * so a representative page of each kind is sufficient; if either include
 * regresses, every page carrying it regresses together.
 *
 * The 2.5.8 exception for inline links in a sentence does not apply here —
 * these are standalone navigation/footer controls.
 */

const MIN = 24;
// Small phone width — narrower than the SM breakpoint, so nav/footer links are
// at their most cramped.
const SMALL_VIEWPORT = { width: 376, height: 800 };

async function assertTargets(page: Page, selector: string): Promise<void> {
  const targets = page.locator(selector);
  const count = await targets.count();
  expect(count, `expected at least one "${selector}" target`).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const el = targets.nth(i);
    const box = await el.boundingBox();
    const text = ((await el.textContent()) ?? "").trim();
    expect(box, `"${selector}" #${i} (${text}) has no box`).not.toBeNull();
    expect(
      box!.width,
      `"${selector}" #${i} (${text}) width ${box!.width}px < ${MIN}px`,
    ).toBeGreaterThanOrEqual(MIN);
    expect(
      box!.height,
      `"${selector}" #${i} (${text}) height ${box!.height}px < ${MIN}px`,
    ).toBeGreaterThanOrEqual(MIN);
  }
}

test.use({ viewport: SMALL_VIEWPORT });

// Footer links: check on the first footer-bearing page.
const footerPage = PAGES.find((p) => p.hasFooter)!;
test(`target-size: footer links ≥24px (${footerPage.path})`, async ({ page }) => {
  await page.goto(footerPage.path, { waitUntil: "load" });
  await assertTargets(page, ".footer__links a");
});

// Standard primary nav: check on the first standard-nav page (not home).
const navPage = PAGES.find((p) => p.hasNav && p.path !== "/")!;
test(`target-size: primary nav links ≥24px (${navPage.path})`, async ({ page }) => {
  await page.goto(navPage.path, { waitUntil: "load" });
  await assertTargets(page, ".primary-nav__a");
});

// Home nav uses a distinct variant (larger red type on the dark hero).
test("target-size: home nav links ≥24px (/)", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });
  await assertTargets(page, ".primary-nav--home__a");
});
