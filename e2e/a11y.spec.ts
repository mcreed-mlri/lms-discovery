import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { SIGNED_IN_ROUTES, signIn } from "./support";

/**
 * Automated accessibility checks on every route, in both themes.
 *
 * The accessibility work in this app is deliberate and unusually thorough —
 * measured contrast values recorded per token, a real focus trap, reduced-motion
 * handled by narrowing transition-property rather than blanket-disabling it. None
 * of it was protected by anything. A single well-meaning colour tweak could have
 * undone months of care silently.
 *
 * axe cannot prove an interface is accessible; it catches the mechanical subset
 * (contrast, names, roles, landmarks). That subset is exactly what regresses
 * during a redesign, which is the risk worth automating.
 */

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function scan(page: import("@playwright/test").Page) {
  return new AxeBuilder({ page }).withTags(WCAG).analyze();
}

/** Readable failure output: axe's raw JSON is unusable in a CI log. */
function describe(violations: Awaited<ReturnType<typeof scan>>["violations"]) {
  return violations
    .map((v) => {
      const where = v.nodes.map((n) => `      ${n.target.join(" ")}`).join("\n");
      return `  [${v.impact}] ${v.id}: ${v.help}\n${where}`;
    })
    .join("\n");
}

test.describe("signed-in routes", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  for (const route of SIGNED_IN_ROUTES) {
    test(`${route.name} has no accessibility violations`, async ({ page }) => {
      await page.goto(route.path);
      // Wait for the client-side auth gate to resolve, or axe scans a spinner.
      await expect(page.locator("main")).toBeVisible();

      const { violations } = await scan(page);
      expect(violations, `\n${describe(violations)}`).toEqual([]);
    });
  }

  test("dark theme has no accessibility violations", async ({ page }) => {
    // Contrast is the rule most likely to break on a palette change, and the dark
    // ramp is a wholly separate set of values from the light one.
    await page.addInitScript(() => {
      window.localStorage.setItem("lace-learning-hub-theme", "dark");
    });
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    const { violations } = await scan(page);
    expect(violations, `\n${describe(violations)}`).toEqual([]);
  });

  test("the search dialog has no accessibility violations while open", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();

    await page.keyboard.press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog", { name: /search/i });
    await expect(dialog).toBeVisible();

    const { violations } = await scan(page);
    expect(violations, `\n${describe(violations)}`).toEqual([]);
  });
});

test("the login page has no accessibility violations", async ({ page }) => {
  await page.goto("/login/");
  const { violations } = await scan(page);
  expect(violations, `\n${describe(violations)}`).toEqual([]);
});

test("a learning detail page has no accessibility violations", async ({ page }) => {
  // Public by design — a shareable deep link, reachable without signing in.
  await page.goto("/learn/path-trial-readiness/");
  const { violations } = await scan(page);
  expect(violations, `\n${describe(violations)}`).toEqual([]);
});
