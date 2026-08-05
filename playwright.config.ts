import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * End-to-end and accessibility suite.
 *
 * Runs against a production build rather than `next dev`, so what is asserted is
 * what actually ships — dev mode differs in hydration timing and error overlays.
 *
 * Demo personas are enabled for the run. They are the only login path available
 * without live Brightspace credentials, and NEXT_PUBLIC_* values are inlined at
 * build time, so one build can only have one setting. The consequence worth
 * knowing: proxy.ts short-circuits while personas are on, so the auth gate is
 * NOT exercised here — it is covered separately and deliberately.
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
      NEXT_PUBLIC_DEMO_MODE: "false",
      NEXT_PUBLIC_SHOW_DEMO_USERS: "true",
      SESSION_SECRET: "e2e-only-session-secret-not-used-in-any-real-deployment",
    },
  },
});
