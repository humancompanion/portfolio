import { voiceOverTest as test } from "@guidepup/playwright";
import { expect } from "@playwright/test";

test.describe("home page with VoiceOver", () => {
  test("announces the page heading", async ({ page, voiceOver }) => {
    await page.goto("/", { waitUntil: "load" });
    await voiceOver.navigateToWebContent();

    // Walk the first items in DOM order (skip link, primary nav, h1) and
    // collect what VoiceOver spoke. The h1 renders uppercase via CSS
    // text-transform and screen readers announce the rendered text, so
    // match case-insensitively.
    let spoken = "";
    for (let i = 0; i < 15 && !/matthew dingee/i.test(spoken); i++) {
      await voiceOver.next();
      spoken = (await voiceOver.spokenPhraseLog()).join(" | ");
    }

    expect(spoken).toMatch(/matthew dingee/i);
  });
});
