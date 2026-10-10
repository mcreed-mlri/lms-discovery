/* The Learning Hub's service worker. It exists so the hub can be installed on
   a phone's home screen and still say something useful when there is no
   connection. It is deliberately narrow:

   - It caches only files that never change once published: Next.js build
     assets (/_next/static/, content-hashed), fonts, and icons.
   - It NEVER caches pages, API responses (/api/…) or anything else that can
     carry a signed-in person's data. Offices share computers; a cached page
     or /api/me response could show one advocate's name or notes to the next.
   - When a page cannot load because the device is offline, it shows
     /offline.html, a static page with no personal data.

   Bump VERSION when this file changes; old caches are deleted on activate. */

const VERSION = "v2";
const STATIC_CACHE = `lace-static-${VERSION}`;
const OFFLINE_URL = "/offline.html";

/** Whether a request may be served from, and stored in, the cache. */
function isCacheable(url, request) {
  if (request.method !== "GET") return false;
  if (url.origin !== self.location.origin) return false;
  if (url.pathname.startsWith("/api/")) return false;
  if (url.pathname.startsWith("/_next/static/")) return true;
  if (/^\/(icon(-maskable)?-\d+\.png|icon\.svg|manifest\.json)$/.test(url.pathname)) return true;
  return false;
}

// Exposed for tests, which load this file in a sandbox.
self.__laceIsCacheable = isCacheable;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      // Deletes every older cache, including the earlier "mlri-hub-v1", which
      // could hold pages and API responses.
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== STATIC_CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Pages: always from the network. Offline, show the offline page.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  if (!isCacheable(url, request)) return;

  // Immutable static files: cache first, then network (and keep a copy).
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
