import { nvdaTest as test } from "@guidepup/playwright";
import { expect } from "@playwright/test";

test.describe("home page with NVDA", () => {
  test("announces the skip link and page heading", async ({ page, nvda }) => {
    await page.goto("/", { waitUntil: "load" });
    await nvda.navigateToWebContent();

    // Walk the first few items in browse mode and collect what NVDA spoke.
    // The skip link is the first element in the DOM and the h1 follows the
    // primary nav, so both should appear early in the spoken phrase log.
    let spoken = "";
    for (let i = 0; i < 12 && !spoken.includes("Matthew"); i++) {
      await nvda.next();
      spoken = (await nvda.spokenPhraseLog()).join(" | ");
    }

    expect(spoken).toContain("Skip to main content");
    expect(spoken).toContain("Matthew");
  });
});
