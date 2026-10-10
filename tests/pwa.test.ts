import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, test } from "vitest";

/* The installable hub: public/manifest.json and public/sw.js. The service
   worker must never cache pages or API responses (shared office computers);
   these tests load it in a sandbox and ask what it would cache. */

const root = join(__dirname, "..");
const manifest = JSON.parse(readFileSync(join(root, "public/manifest.json"), "utf8")) as {
  name: string;
  description: string;
  start_url: string;
  display: string;
  orientation?: string;
  icons: { src: string; sizes: string; purpose?: string }[];
};

type IsCacheable = (url: URL, request: { method: string }) => boolean;

function loadServiceWorker(): IsCacheable {
  const self: { location: URL; addEventListener: () => void; __laceIsCacheable?: IsCacheable } = {
    location: new URL("https://hub.example/"),
    addEventListener: () => {},
  };
  runInNewContext(readFileSync(join(root, "public/sw.js"), "utf8"), { self, URL });
  if (!self.__laceIsCacheable) throw new Error("sw.js did not expose its cache rule");
  return self.__laceIsCacheable;
}

describe("manifest", () => {
  test("has what browsers need to offer installing it", () => {
    expect(manifest.start_url).toBe("/");
    expect(manifest.display).toBe("standalone");
    const sizes = manifest.icons.map((icon) => icon.sizes);
    expect(sizes).toContain("192x192");
    expect(sizes).toContain("512x512");
    expect(manifest.icons.some((icon) => icon.purpose === "maskable")).toBe(true);
    for (const icon of manifest.icons)
      expect(existsSync(join(root, "public", icon.src))).toBe(true);
  });

  test("does not lock orientation (WCAG 2.2, 1.3.4) or name Brightspace to learners", () => {
    expect(manifest.orientation).toBeUndefined();
    expect(`${manifest.name} ${manifest.description}`).not.toMatch(/brightspace/i);
  });
});

describe("service worker cache rule", () => {
  const isCacheable = loadServiceWorker();
  const get = { method: "GET" };
  const at = (path: string) => new URL(path, "https://hub.example");

  test("caches content-hashed build files and icons", () => {
    expect(isCacheable(at("/_next/static/chunks/app-123.js"), get)).toBe(true);
    expect(isCacheable(at("/icon-512.png"), get)).toBe(true);
    expect(isCacheable(at("/icon-maskable-192.png"), get)).toBe(true);
  });

  test("never caches pages, API responses, other sites or writes", () => {
    expect(isCacheable(at("/api/me"), get)).toBe(false);
    expect(isCacheable(at("/api/catalog"), get)).toBe(false);
    expect(isCacheable(at("/"), get)).toBe(false);
    expect(isCacheable(at("/binder/litigation/trial-skills/"), get)).toBe(false);
    expect(isCacheable(at("/legal-skills-hearsay/Home.html"), get)).toBe(false);
    expect(isCacheable(new URL("https://mlri.brightspace.com/d2l/home"), get)).toBe(false);
    expect(isCacheable(at("/_next/static/chunks/app-123.js"), { method: "POST" })).toBe(false);
  });
});
