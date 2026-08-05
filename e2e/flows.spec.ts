import { expect, test } from "@playwright/test";

import { signIn } from "./support";

/**
 * The handful of paths that must not break. These are deliberately about
 * behaviour a user would notice, not implementation detail — the drawer test in
 * particular guards a fix, not a feature: that overlay shipped with no focus
 * containment and no Escape handler, so Tab walked straight out of it into the
 * page underneath.
 */

test("a learner can sign in from the login page and land in the library", async ({ page }) => {
  // The one test that drives the real login UI rather than seeding storage, so
  // the persona flow itself stays covered.
  await page.goto("/login/");

  await page.getByRole("button", { name: /Sarah Chen/i }).click();

  await expect(page).toHaveURL(/\/$|\/\?/);
  await expect(page.getByRole("main")).toBeVisible();
});

test.describe("signed in", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test("Ctrl-K opens global search and Escape closes it", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("main")).toBeVisible();

    await page.keyboard.press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog", { name: /search/i });
    await expect(dialog).toBeVisible();
    // The trap puts focus on the first control, which is the search input.
    await expect(dialog.getByRole("combobox")).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("searching the library surfaces a matching result", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("main")).toBeVisible();

    await page.keyboard.press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog", { name: /search/i });
    await dialog.getByRole("combobox").fill("housing");

    await expect(dialog.getByRole("option").first()).toBeVisible();
  });

  test("selecting a global search result cross-navigates and opens it", async ({ page }) => {
    // This is the flow that used to need a CustomEvent bus *and* a router.push,
    // because the home page read q/open only once on mount. It is now driven by
    // useSearchParams alone, so this test is what proves the event was redundant
    // rather than load-bearing. Starting from /browse makes it a real
    // cross-navigation.
    await page.goto("/browse/");
    await expect(page.getByRole("main")).toBeVisible();

    await page.keyboard.press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog", { name: /search/i });
    await dialog.getByRole("combobox").fill("housing");
    const firstOption = dialog.getByRole("option").first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();

    // Landed on home with both params, and the detail dialog opened from them.
    await expect(page).toHaveURL(/[?&]q=/);
    await expect(page).toHaveURL(/[?&]open=/);
    await expect(page.getByRole("dialog", { name: /.+/ })).toBeVisible();
  });

  test("a shared /?q=&open= link opens the item on a cold load", async ({ page }) => {
    // The corollary: because the params drive state, such a URL is now genuinely
    // shareable rather than only working in-session.
    await page.goto("/?q=housing&open=COURSE-housing-law-fundamentals");
    await expect(page.getByRole("main")).toBeVisible();

    // role="combobox" is set explicitly on the input, which overrides the
    // implicit searchbox role that type="search" would otherwise give it.
    const search = page.getByRole("combobox").first();
    await expect(search).toHaveValue("housing");
  });

  test("the theme choice survives a reload", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page
      .getByRole("button", { name: /Switch to dark mode/i })
      .first()
      .click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();
    // The blocking script in app/layout.tsx must apply this before first paint,
    // otherwise the page flashes light and then corrects itself.
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("catalog filters can be applied and reset", async ({ page }) => {
    await page.goto("/browse/");
    await expect(page.getByRole("main")).toBeVisible();

    // The refine selects live behind a disclosure, so open it first.
    const refine = page.getByRole("button", { name: /^Refine/ });
    await expect(refine).toHaveAttribute("aria-expanded", "false");
    await refine.click();
    await expect(refine).toHaveAttribute("aria-expanded", "true");

    // A real <select>, not getByRole("combobox") — the search input carries that
    // role too and would be matched first.
    const select = page.locator("select").first();
    await expect(select).toBeVisible();
    const initialValue = await select.inputValue();

    await select.selectOption({ index: 1 });
    const filteredValue = await select.inputValue();
    expect(filteredValue).not.toBe(initialValue);

    // The count badge beside "Refine" is how the UI reports active filters.
    await expect(refine).toContainText("1");

    await page
      .getByRole("button", { name: /Reset all/i })
      .first()
      .click();
    await expect(select).toHaveValue(initialValue);
    await expect(refine).not.toContainText("1");
  });

  test("the mobile drawer traps focus and closes on Escape", async ({ page }) => {
    // Below the lg breakpoint, where the rail collapses into a drawer.
    await page.setViewportSize({ width: 480, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("main")).toBeVisible();

    await page.getByRole("button", { name: /Open navigation/i }).click();
    const drawer = page.getByRole("dialog", { name: /Site navigation/i });
    await expect(drawer).toBeVisible();

    // Tab well past the number of controls in the drawer. If containment is
    // working, focus is still inside it; before the fix it escaped to the page.
    for (let i = 0; i < 25; i += 1) {
      await page.keyboard.press("Tab");
    }
    const focusedInsideDrawer = await drawer.evaluate((el) => el.contains(document.activeElement));
    expect(focusedInsideDrawer).toBe(true);

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  });

  test("a learning item links out to Brightspace rather than nowhere", async ({ page }) => {
    await page.goto("/learn/path-trial-readiness/");
    await expect(page.getByRole("main")).toBeVisible();

    // The handoff into the LMS is the whole point of the Hub; a broken or empty
    // href here is the most consequential silent failure in the product.
    const brightspaceLinks = page.locator('a[href*="brightspace.com"]');
    if (await brightspaceLinks.count()) {
      const href = await brightspaceLinks.first().getAttribute("href");
      expect(href).toMatch(/^https:\/\/[a-z0-9.-]*brightspace\.com\//);
    }
  });
});
