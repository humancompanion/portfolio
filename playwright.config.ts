import { defineConfig } from "@playwright/test";
import { screenReaderConfig } from "@guidepup/playwright";

// Screen readers can't drive headless browsers, so these tests always run
// against a real browser window. VoiceOver pairs with WebKit (Safari-like),
// NVDA with Firefox.
export default defineConfig({
  ...screenReaderConfig,
  testDir: "./tests/screen-reader",
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
      name: "voiceover",
      testMatch: /voiceover\.spec\.ts/,
      use: { browserName: "webkit", headless: false },
    },
    {
      name: "nvda",
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
