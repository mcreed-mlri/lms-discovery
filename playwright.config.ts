import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * End-to-end and accessibility suite.
 *
 * Runs against a production build rather than `next dev`, so what is asserted is
 * what actually ships — dev mode differs in hydration timing and error overlays.
 *
 * The suite runs in explicit demo mode. Persona localStorage is intentionally
 * trusted only under NEXT_PUBLIC_DEMO_MODE=true; showing stakeholder preview
 * cards beside Brightspace is not enough to authenticate a test user.
 */
export default defineConfig({
  testDir: "./e2e",
  // Keep Vitest and Playwright from claiming each other's files.
  testMatch: /.*\.spec\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    // A cold production build plus 130 static pages needs real headroom.
    timeout: 240_000,
    env: {
      NEXT_PUBLIC_DEMO_MODE: "true",
      NEXT_PUBLIC_SHOW_DEMO_USERS: "true",
      LACE_DEPLOYMENT_KIND: "demo",
      LACE_DATA_MODE: "mock",
      SESSION_SECRET: "e2e-only-session-secret-not-used-in-any-real-deployment",
    },
  },
});
