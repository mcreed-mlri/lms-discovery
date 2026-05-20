const CACHE_NAME = "mlri-hub-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching static core app shell");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Clearing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event (Stale-While-Revalidate strategy)
self.addEventListener("fetch", (event) => {
  // Only handle GET requests and same-origin / specific CDNs (fonts, polyfills)
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip browser extensions or Next.js hot-reloading in dev mode
  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  if (url.pathname.includes("_next/webpack") || url.pathname.includes("hot-update")) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Fetch fresh resource from the network in background
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // If valid response, update cache
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          console.warn("[Service Worker] Network fetch failed, serving cached fallback if available.", err);
          // If network fails and we are requesting an HTML page that is not cached, we could return a fallback:
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        });

      // Return cached response instantly, fallback to network request if uncached
      return cachedResponse || fetchPromise;
    })
  );
});
