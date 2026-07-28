import { voiceOverTest as test } from "@guidepup/playwright";
import { expect } from "@playwright/test";

/**
 * VoiceOver spot-check of the four page types called out in issue #63:
 * home, a case study, the resume, and about. These run in CI only
 * (.github/workflows/screen-reader-tests.yml, macOS runner) — screen readers
 * can't drive a headless browser, so they aren't part of the local test flow.
 *
 * Each test navigates into the web content and walks VoiceOver forward until it
 * reaches the page's <h1>, then asserts the heading text was spoken. Screen
 * readers announce the RENDERED text, and several of these headings are
 * uppercased via CSS text-transform, so the matches are case-insensitive.
 */

interface SRPage {
  path: string;
  name: string;
  /** Text of the page's single <h1>, as VoiceOver will speak it. */
  h1: RegExp;
}

const PAGES: SRPage[] = [
  { path: "/", name: "home", h1: /matthew dingee/i },
  { path: "/case-study/usajobs/", name: "usajobs case study", h1: /case study/i },
  { path: "/resume/", name: "resume", h1: /resume/i },
  { path: "/about/", name: "about", h1: /skills/i },
];

for (const { path, name, h1 } of PAGES) {
  test.describe(`${name} with VoiceOver`, () => {
    test("announces the page heading", async ({ page, voiceOver }) => {
      await page.goto(path, { waitUntil: "load" });
      await voiceOver.navigateToWebContent();

      // Walk forward (skip link, primary nav, then the header) until the h1 is
      // spoken or we run out of a reasonable number of steps.
      let spoken = "";
      for (let i = 0; i < 20 && !h1.test(spoken); i++) {
        await voiceOver.next();
        spoken = (await voiceOver.spokenPhraseLog()).join(" | ");
      }

      expect(spoken, `VoiceOver never announced the ${name} <h1>`).toMatch(h1);
    });
  });
}
