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
  { path: "/binder/litigation/", name: "litigation binder contents" },
  { path: "/binder/litigation/trial-skills/", name: "trial tab" },
  { path: "/binder/litigation/trial-skills/objections/", name: "objections topic" },
  { path: "/binder/litigation/trial-skills/discovery/", name: "planned topic" },
  { path: "/search/?q=hearsay+objection", name: "search results" },
  { path: "/binder/litigation/trial-skills/objections/hearsay/", name: "hearsay levels" },
  {
    path: "/binder/litigation/trial-skills/objections/hearsay/level-1/watch/",
    name: "hearsay level 1 watch",
  },
  {
    path: "/binder/litigation/trial-skills/objections/hearsay/level-1/help/",
    name: "hearsay level 1 help",
  },
  {
    path: "/binder/litigation/trial-skills/objections/hearsay/drills/hearsay-or-not/",
    name: "hearsay quick drill",
  },
  {
    path: "/binder/litigation/trial-skills/practice/hearsay-objection-in-writing/",
    name: "hearsay practice room",
  },
] as const;
