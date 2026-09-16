import { expect, test } from "@playwright/test";
import { signIn } from "./support";
import { intakeToVerdictPath } from "../lib/mocks/core-curriculum";

test.beforeEach(async ({ page }) => {
  await signIn(page);
});

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]) {
  test(`attorney demo is clear and usable at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const main = page.getByRole("main");
    await expect(main.getByText("Legal skills", { exact: true })).toBeVisible();
    await expect(main.getByRole("heading", { name: intakeToVerdictPath.title })).toHaveCount(1);
    await expect(main.getByText("Advocate & Paralegal Foundations")).toHaveCount(0);
    await expect(main.getByText("Experienced Attorney: Advanced Practice")).toHaveCount(0);
    const explore = main.getByRole("link", { name: "Explore the path" });
    await explore.scrollIntoViewIfNeeded();
    await explore.focus();
    await expect(explore).toBeFocused();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await page.evaluate(() => {
      (document.activeElement as HTMLElement)?.blur();
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.screenshot({ path: testInfo.outputPath("home.png"), fullPage: true });
    await main
      .getByRole("link")
      .filter({ has: page.getByRole("heading", { name: "Legal Research", exact: true }) })
      .click();
    await expect(page).toHaveURL(/learn\/course-legal-research/);
    await expect(
      page.getByRole("heading", { name: "Legal Research", exact: true }).first(),
    ).toBeVisible();
    await page.goto("/");
    await page.getByRole("link", { name: "Explore the path" }).click();
    await expect(page).toHaveURL(/browse\/paths\/intake-to-verdict/);
    await expect(page.getByRole("heading", { name: intakeToVerdictPath.title })).toBeVisible();
    await expect(page.getByText("Sample progress shown for this demo.")).toBeVisible();
    await page.evaluate(() => {
      (document.activeElement as HTMLElement)?.blur();
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.screenshot({ path: testInfo.outputPath("journey.png"), fullPage: true });
    await page
      .getByRole("link", { name: intakeToVerdictPath.upNext.ctaLabel, exact: true })
      .click();
    const nextUrl = new URL(intakeToVerdictPath.upNext.ctaHref, "http://localhost");
    await expect(page).toHaveURL(
      (url) =>
        url.pathname.replace(/\/$/, "") === nextUrl.pathname && url.search === nextUrl.search,
    );
    await expect(page.getByRole("main")).toBeVisible();
  });
}

test("path landing page, catalog, and global search share one example", async ({ page }) => {
  await page.goto("/browse/paths");
  await expect(page.getByRole("link", { name: "Explore the path" })).toHaveCount(1);
  await expect(page.getByRole("main").getByText("Non-attorney staff", { exact: true })).toHaveCount(
    0,
  );
  await page.goto("/browse");
  await page.getByRole("button", { name: "Learning paths", exact: true }).click();
  await expect(page.getByRole("heading", { name: intakeToVerdictPath.title })).toHaveCount(1);
  await expect(page.getByText("No matching learning content", { exact: true })).toHaveCount(0);
  await page.keyboard.press("ControlOrMeta+k");
  const search = page.getByRole("dialog", { name: /search/i });
  await search.getByRole("combobox").fill(intakeToVerdictPath.title);
  await expect(search.getByRole("option").first()).toContainText(intakeToVerdictPath.title);
  await search.getByRole("option").first().click();
  const detail = page.getByRole("dialog", { name: intakeToVerdictPath.title });
  await expect(detail.getByRole("link", { name: "Open in Learning Hub" })).toHaveAttribute(
    "href",
    intakeToVerdictPath.href,
  );
  await detail.getByRole("link", { name: "Open in Learning Hub" }).click();
  await expect(page).toHaveURL(/browse\/paths\/intake-to-verdict/);
  await page.goto("/learn/path-new-attorney");
  await expect(
    page.getByRole("heading", { name: "New Attorney", exact: true }).first(),
  ).toBeVisible();
});
