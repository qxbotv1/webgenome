import { defineConfig } from "@playwright/test";

/**
 * WebGenome E2E smoke test configuration.
 *
 * Runs against the live deployed Vercel URL by default.
 * Override with: BASE_URL=http://localhost:3000 npx playwright test
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false, // smoke tests run sequentially — order matters
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [["html"], ["github"]] : [["html"]],

  use: {
    baseURL: process.env.BASE_URL || "https://webgenome.vercel.app",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],

  /* No webServer — tests run against the live deployed URL */
});
