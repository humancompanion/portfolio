import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PAGES } from "./pages";

/**
 * Automated WCAG 2.0/2.1 AA scan of every canonical page (issue #63, Phase 4).
 *
 * Each page gets an axe scan tagged for WCAG 2.0/2.1 A + AA. Following the VA
 * prototyping-kit model, the gate blocks only on `critical` and `serious`
 * violations — the impact levels that represent real barriers — so the suite
 * stays a reliable regression signal rather than a noise generator. WCAG 2.2
 * additions (target size 2.5.8) are covered by target-size.test.ts.
 *
 * Run: npm run build && npm run test:a11y
 */

const WCAG_AA_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

for (const { path, label } of PAGES) {
  test(`axe: ${label} (${path}) has no critical/serious violations`, async ({ page }) => {
    await page.goto(path, { waitUntil: "load" });

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_AA_TAGS)
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );

    expect(
      blocking,
      `axe found blocking violations on ${label} (${path}):\n` +
        blocking
          .map(
            (v) =>
              `  ${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)\n` +
              v.nodes.map((n) => `      ${n.target.join(" ")}`).join("\n"),
          )
          .join("\n"),
    ).toEqual([]);
  });
}
