import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PAGES } from "./pages";

/**
 * Axe best-practice scan of every canonical page (issue #63 follow-up).
 *
 * The WCAG A/AA gate in axe-scan.test.ts blocks only on `critical` and
 * `serious` impact, which by design excludes axe's `best-practice` tag —
 * landmark/region structure, heading order, a single h1 per page, and similar
 * conventions that aren't strict WCAG A/AA failures but are the difference
 * between a document a screen-reader user can navigate and one they can't.
 *
 * This suite runs the `best-practice` tag on its own and blocks on ANY
 * best-practice violation regardless of impact (most are `moderate`, so the
 * critical/serious filter would have swallowed them). Keeping it separate from
 * the WCAG gate preserves that gate's noise floor while giving best-practice
 * its own signal.
 *
 * Run: npm run build && npm run test:a11y
 */

for (const { path, label } of PAGES) {
  test(`axe best-practice: ${label} (${path}) has no violations`, async ({ page }) => {
    await page.goto(path, { waitUntil: "load" });

    const results = await new AxeBuilder({ page })
      .withTags(["best-practice"])
      .analyze();

    expect(
      results.violations,
      `axe best-practice violations on ${label} (${path}):\n` +
        results.violations
          .map(
            (v) =>
              `  ${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)\n` +
              v.nodes.map((n) => `      ${n.target.join(" ")}`).join("\n"),
          )
          .join("\n"),
    ).toEqual([]);
  });
}
