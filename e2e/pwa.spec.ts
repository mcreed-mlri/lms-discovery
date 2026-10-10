import { expect, test } from "@playwright/test";
import { signIn } from "./support";

/* The installable hub in a real browser: the service worker must store only
   static build files, never a page or an API response (shared office
   computers), and must show the offline page when the network is gone. */

test("the service worker caches no pages or API responses, and works offline", async ({
  page,
  context,
}) => {
  await signIn(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Welcome back/ })).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  // A reload puts the page under the worker's control; then browse a little.
  await page.reload();
  await expect(page.getByRole("heading", { name: /Welcome back/ })).toBeVisible();
  await page.goto("/binder/litigation/trial-skills/");
  await expect(page.getByRole("heading", { level: 1, name: "Trial" })).toBeVisible();

  const cached = await page.evaluate(async () => {
    const urls: string[] = [];
    for (const key of await caches.keys()) {
      const cache = await caches.open(key);
      for (const request of await cache.keys()) urls.push(new URL(request.url).pathname);
    }
    return urls;
  });
  expect(cached).toContain("/offline.html");
  const unexpected = cached.filter(
    (path) =>
      path !== "/offline.html" &&
      !path.startsWith("/_next/static/") &&
      !/^\/(icon(-maskable)?-\d+\.png|icon\.svg|manifest\.json)$/.test(path),
  );
  expect(unexpected).toEqual([]);

  await context.setOffline(true);
  await page.goto("/updates/").catch(() => undefined);
  await expect(page.getByRole("heading", { name: "You're offline" })).toBeVisible();
  await context.setOffline(false);
});

test("the manifest is linked and served", async ({ page, request }) => {
  await page.goto("/login/");
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/manifest.json");
  const response = await request.get("/manifest.json");
  expect(response.ok()).toBe(true);
  expect((await response.json()).display).toBe("standalone");
});
