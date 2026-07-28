import { test, expect } from "@playwright/test";
import { PAGES } from "./pages";

/**
 * WCAG 1.4.10 Reflow, AA (issue #63, Phase 4).
 *
 * At 400% zoom of a 1280px viewport, content must reflow into a 320 CSS px
 * column without requiring horizontal scrolling. We emulate that end state by
 * loading each page at a 320px-wide viewport and asserting the document does
 * not overflow horizontally. A few px of tolerance absorbs sub-pixel rounding.
 *
 * Exception (per 1.4.10): content that requires two-dimensional layout — wide
 * data tables, code blocks — may scroll on its own. None of these pages carry
 * such content at the document level, so the whole-page check is appropriate.
 */

const REFLOW_WIDTH = 320;
const REFLOW_HEIGHT = 512; // 1024 / 400% — tall enough to render normally.
const TOLERANCE = 1;

test.use({ viewport: { width: REFLOW_WIDTH, height: REFLOW_HEIGHT } });

for (const { path, label } of PAGES) {
  test(`reflow: ${label} (${path}) has no horizontal scroll at 320px`, async ({
    page,
  }) => {
    await page.goto(path, { waitUntil: "load" });

    const { scrollWidth, clientWidth, offender } = await page.evaluate(() => {
      const doc = document.documentElement;
      // Find the widest element overflowing the viewport, for a useful message.
      let offender = "";
      let maxRight = doc.clientWidth;
      for (const el of Array.from(document.body.querySelectorAll("*"))) {
        const right = el.getBoundingClientRect().right;
        if (right > maxRight + 1) {
          maxRight = right;
          offender =
            el.tagName.toLowerCase() +
            (el.className && typeof el.className === "string"
              ? "." + el.className.trim().split(/\s+/).join(".")
              : "");
        }
      }
      return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, offender };
    });

    expect(
      scrollWidth,
      `${label} (${path}) overflows: scrollWidth ${scrollWidth} > clientWidth ${clientWidth}` +
        (offender ? `; widest offender: ${offender}` : ""),
    ).toBeLessThanOrEqual(clientWidth + TOLERANCE);
  });
}
