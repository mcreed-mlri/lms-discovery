import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

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
    test(`${route.name} keeps its content inside the viewport`, async ({ page }) => {
      await page.goto(route.path);
      expect(await overhangingElements(page)).toEqual([]);
    });
  }

  test("the search dialog keeps its content inside the viewport", async ({ page }) => {
    await page.goto("/");
    await openSearch(page);
    expect(await overhangingElements(page), "empty dialog").toEqual([]);

    await page.locator("input[type=search]").last().fill("housing eviction");
    await expect(page.getByRole("option").first()).toBeVisible();
    expect(await overhangingElements(page), "dialog showing suggestions").toEqual([]);
  });

  /**
   * Every text control renders at 16px or larger on a phone.
   *
   * Below 16px, iOS Safari zooms the page in when the control takes focus, and
   * does not zoom back out on blur. A zoomed page is wider than the visual
   * viewport, so from that tap onwards the whole app pans sideways — the
   * `overflow-x: clip` in globals.css cannot prevent it, because panning a
   * zoomed visual viewport is not document scroll. Tapping the 14px search
   * field was the way most people met this.
   *
   * No headless browser applies that zoom, so this asserts the input that
   * triggers it rather than the symptom.
   */
  for (const route of [...SIGNED_IN_ROUTES, { path: "/login/", name: "login" }]) {
    test(`${route.name} has no control iOS would zoom into`, async ({ page }) => {
      await page.goto(route.path);
      expect(await undersizedControls(page)).toEqual([]);
    });
  }

  test("the search dialog has no control iOS would zoom into", async ({ page }) => {
    await page.goto("/");
    await openSearch(page);
    expect(await undersizedControls(page)).toEqual([]);
  });

  /**
   * The catalog's filter selects, which only exist once Refine is open, and
   * which declare `sm:text-sm` — 14px. They are checked in both orientations
   * because the floor in globals.css is scoped by pointer rather than width:
   * a phone held sideways is wider than every breakpoint and still zooms, so a
   * `max-width` guard would have let 14px back in at exactly that size.
   */
  for (const orientation of [
    { name: "upright", width: 375, height: 629 },
    { name: "sideways", width: 812, height: 375 },
  ]) {
    test(`the catalog filters have no control iOS would zoom into, ${orientation.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: orientation.width, height: orientation.height });
      await page.goto("/browse/");
      await page.getByRole("button", { name: "Refine" }).click();
      await expect(page.getByLabel("Practice area")).toBeVisible();
      expect(await undersizedControls(page)).toEqual([]);
    });
  }

  test("home has no accessibility violations at phone width", async ({ page }) => {
    await page.goto("/");
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(violations.map((v) => `${v.id} x${v.nodes.length}`)).toEqual([]);
  });
});

/** Opens the global search dialog from the mobile bottom nav. */
async function openSearch(page: Page) {
  await page.getByRole("button", { name: "Search" }).first().click();
  await expect(page.getByRole("dialog", { name: "Search learning library" })).toBeVisible();
}

/**
 * Elements sticking out past the right edge of the viewport, or off its left.
 *
 * Deliberate horizontal scrollers — the popular-search chips, the path journey
 * stepper, the curriculum map columns — are `overflow-x: auto`, and anything
 * inside one is meant to be wider than the screen, so those are skipped along
 * with their descendants. Only the outermost offender in a chain is reported,
 * so one wide element is one failure rather than forty.
 *
 * Why not `documentElement.scrollWidth - clientWidth`, the obvious check: the
 * shell sets `overflow-x: clip` on <html>, the body, and <main>, which erases
 * scrollable overflow. Append a 2000px-wide div to <main> and that difference
 * is still 0 — verified. The assertion it replaces could not fail.
 */
async function overhangingElements(page: Page) {
  return page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;

    const insideAScroller = (element: Element) => {
      for (let parent = element.parentElement; parent; parent = parent.parentElement) {
        const overflowX = getComputedStyle(parent).overflowX;
        if (overflowX === "auto" || overflowX === "scroll") return true;
      }
      return false;
    };

    const overhangs = (element: Element) => {
      const box = element.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) return false;
      return box.right + window.scrollX > viewportWidth + 1 || box.left + window.scrollX < -1;
    };

    return [...document.querySelectorAll("body *")]
      .filter(
        (element) =>
          overhangs(element) &&
          getComputedStyle(element).position !== "fixed" &&
          !insideAScroller(element) &&
          !(element.parentElement && overhangs(element.parentElement)),
      )
      .map((element) => {
        const box = element.getBoundingClientRect();
        return `${element.tagName.toLowerCase()} runs to ${Math.round(box.right)}px of ${viewportWidth}px: ${String(element.className).slice(0, 80)}`;
      });
  });
}

/** Text controls rendering below the 16px floor iOS Safari zooms in on. */
async function undersizedControls(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("input, select, textarea")]
      .filter((control) => {
        const type = control.getAttribute("type");
        if (type === "checkbox" || type === "radio") return false;
        return parseFloat(getComputedStyle(control).fontSize) < 16;
      })
      .map(
        (control) =>
          `${control.tagName.toLowerCase()} at ${getComputedStyle(control).fontSize}: ${String(control.className).slice(0, 80)}`,
      ),
  );
}
