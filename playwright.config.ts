import { defineConfig } from "@playwright/test";
import { screenReaderConfig } from "@guidepup/playwright";

// Two kinds of accessibility tests live here:
//
//   1. Screen-reader journeys (tests/screen-reader/, Guidepup). Screen readers
//      can't drive headless browsers, so these run against a real window —
//      VoiceOver pairs with WebKit, NVDA with Firefox. screenReaderConfig sets
//      headless:false, workers:1, fullyParallel:false.
//
//   2. Automated axe-core WCAG scans (tests/a11y/, headless Chromium). These
//      want the opposite of the SR profile, so the "axe" project overrides
//      browserName/headless. Run with `npm run test:a11y`.
//
// Both projects share the same webServer, which serves the built _site — run
// `npm run build` first so the tests exercise the HTML that ships.
export default defineConfig({
  ...screenReaderConfig,
  timeout: 5 * 60 * 1000,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reportSlowTests: null,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:4000",
  },
  projects: [
    {
      name: "axe",
      testDir: "./tests/a11y",
      use: { browserName: "chromium", headless: true },
    },
    {
      name: "voiceover",
      testDir: "./tests/screen-reader",
      testMatch: /voiceover\.spec\.ts/,
      use: { browserName: "webkit", headless: false },
    },
    {
      name: "nvda",
      testDir: "./tests/screen-reader",
      testMatch: /nvda\.spec\.ts/,
      use: { browserName: "firefox", headless: false },
    },
  ],
  webServer: {
    command: "node tests/serve-site.js",
    port: 4000,
    reuseExistingServer: !process.env.CI,
  },
});
