import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { SIGNED_IN_ROUTES, signIn } from "./support";

/**
 * Phone-width checks.
 *
 * Everything else in this suite runs at Desktop Chrome, which is how a broken
 * skip link shipped: it was parked with `translateY(-150%)` — 1.5x its own
 * height, 72px — while it had to clear `top + height`, where `top` was
 * `calc(1rem + env(safe-area-inset-top))`. At an inset of 0 it cleared by 8px;
 * on a notched iPhone the inset is ~50px, so it needed 114px and left 42px of a
 * "Skip to main content" pill sitting over the status bar on every page.
 *
 * The trap worth knowing: **no headless browser reports a non-zero
 * `env(safe-area-inset-*)`**, and Playwright's device descriptors do not
 * emulate one. A test that merely loads the page at phone width passes against
 * the broken CSS — verified, not assumed. So the inset is exposed as
 * `--safe-top` in globals.css and this spec overrides it to simulate real
 * hardware. Keep that override, or this stops testing anything.
 */

/**
 * iPhone 12 mini geometry, spelled out rather than spread from
 * `devices["iPhone 12 Mini"]`. That descriptor carries
 * `defaultBrowserType: "webkit"`, which silently switches these tests to a
 * browser CI does not install — the workflow runs
 * `npx playwright install --with-deps chromium`. Spreading it turns every test
 * here into "Executable doesn't exist at .../webkit-2336/pw_run.sh".
 *
 * `userAgent` is omitted deliberately: the descriptor's is a Safari string, and
 * claiming it while running Chromium would be a lie to anything that sniffs it.
 */
test.use({
  // 375x629 is the descriptor's own viewport: a 375x812 device minus Safari's
  // chrome. Only the width matters to anything asserted here.
  viewport: { width: 375, height: 629 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/** Top insets in CSS px: no notch, iPhone 12/13/14, Dynamic Island. */
const INSETS = [0, 47, 50, 59];

test.describe("on a phone", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test("the skip link stays off screen at every device inset", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.locator(".skip-link");

    for (const inset of INSETS) {
      await page.evaluate((px) => {
        document.documentElement.style.setProperty("--safe-top", `${px}px`);
      }, inset);

      // Parked: the whole element above the viewport, not merely most of it.
      // `bottom <= 0` is the assertion the old rule failed at any inset over 8px.
      const parked = await skipLink.boundingBox();
      expect(parked, `no box at inset ${inset}px`).not.toBeNull();
      expect(parked!.y + parked!.height, `parked bottom at inset ${inset}px`).toBeLessThanOrEqual(
        0,
      );
    }

    // The parked position must not depend on a top offset at all: an
    // inset-dependent `top` combined with a self-relative transform is exactly
    // what broke. This fails immediately if someone reintroduces one, in any
    // browser, whatever the inset reports.
    const parkedTop = await skipLink.evaluate((el) => getComputedStyle(el).top);
    expect(parkedTop).toBe("0px");
  });

  test("the skip link drops below the inset when focused", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.locator(".skip-link");

    for (const inset of INSETS) {
      await page.evaluate((px) => {
        document.documentElement.style.setProperty("--safe-top", `${px}px`);
      }, inset);

      await skipLink.focus();
      await expect(skipLink).toBeFocused();
      await page.waitForTimeout(250); // the 160ms reveal transition

      // Clear of the status bar / notch, not merely on screen.
      const shown = await skipLink.boundingBox();
      expect(shown!.y, `focused top at inset ${inset}px`).toBeGreaterThanOrEqual(inset);
      expect(shown!.x).toBeGreaterThanOrEqual(0);

      await skipLink.blur();
    }
  });

  for (const route of SIGNED_IN_ROUTES) {
    test(`${route.name} does not scroll sideways`, async ({ page }) => {
      await page.goto(route.path);

      // Only deliberate scrollers may exceed the viewport, and they clip
      // themselves — the page itself must never scroll horizontally.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  }

  test("home has no accessibility violations at phone width", async ({ page }) => {
    await page.goto("/");
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(violations.map((v) => `${v.id} x${v.nodes.length}`)).toEqual([]);
  });
});
