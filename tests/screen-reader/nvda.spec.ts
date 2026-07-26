import { nvdaTest as test } from "@guidepup/playwright";
import { expect } from "@playwright/test";

test.describe("home page with NVDA", () => {
  test("announces the page heading", async ({ page, nvda }) => {
    await page.goto("/", { waitUntil: "load" });
    await nvda.navigateToWebContent();

    // Walk the first items in browse mode (skip link, primary nav, h1) and
    // collect what NVDA spoke. The h1 renders uppercase via CSS
    // text-transform and screen readers announce the rendered text, so
    // match case-insensitively.
    let spoken = "";
    for (let i = 0; i < 15 && !/matthew dingee/i.test(spoken); i++) {
      await nvda.next();
      spoken = (await nvda.spokenPhraseLog()).join(" | ");
    }

    expect(spoken).toMatch(/heading, level 1/);
    expect(spoken).toMatch(/matthew dingee/i);
  });
});
