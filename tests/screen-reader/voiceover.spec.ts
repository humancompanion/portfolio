import { voiceOverTest as test } from "@guidepup/playwright";
import { expect } from "@playwright/test";

test.describe("home page with VoiceOver", () => {
  test("announces the skip link and page heading", async ({
    page,
    voiceOver,
  }) => {
    await page.goto("/", { waitUntil: "load" });
    await voiceOver.navigateToWebContent();

    // The skip link is the first element in the DOM, so it should be the
    // first item VoiceOver lands on inside the web content.
    expect(await voiceOver.itemText()).toContain("Skip to main content");

    // Walk forward until the h1 is announced.
    let spoken = "";
    for (let i = 0; i < 10 && !spoken.includes("Matthew"); i++) {
      await voiceOver.next();
      spoken = await voiceOver.lastSpokenPhrase();
    }

    expect(spoken).toContain("Matthew");
  });
});
