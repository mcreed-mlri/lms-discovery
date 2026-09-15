import { demoUser } from "../lib/auth-constants";
import type { Page } from "@playwright/test";

/** localStorage key read by AuthProvider in lib/auth.tsx. */
const STORAGE_KEY = "mlri-demo-user";

/**
 * Seeds a signed-in persona before any app script runs.
 *
 * One spec drives the real login UI end to end; everywhere else this is used, so
 * a test about the catalog is not also a test about logging in — and does not
 * fail for the wrong reason when login changes.
 */
export async function signIn(page: Page) {
  await page.addInitScript(
    ([key, user]) => {
      window.localStorage.setItem(key as string, JSON.stringify(user));
    },
    [STORAGE_KEY, demoUser] as const,
  );
}

/** Every route a signed-in learner can reach, for sweeping checks. */
export const SIGNED_IN_ROUTES = [
  { path: "/", name: "home" },
  { path: "/browse/", name: "browse" },
  { path: "/browse/paths/intake-to-verdict/", name: "intake to verdict path" },
  { path: "/curriculum-map/", name: "curriculum map" },
  { path: "/updates/", name: "updates" },
  { path: "/my-learning/", name: "my learning" },
] as const;
