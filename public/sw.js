// v2: pages are per-person now, so HTML is never cached. A cached dashboard
// would survive "Switch person" and show one person's day to another, and it
// would also bypass the sign-in redirect. Only identity-free static assets are
// cached; everything else goes to the network.
const CACHE_NAME = "macro-tracker-assets-v2";
const PRECACHE_URLS = [
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

function isCacheableAsset(url) {
  return (
    PRECACHE_URLS.includes(url.pathname) ||
    url.pathname.startsWith("/_next/static/")
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

// The page reports which build chunks it actually loaded, and they get cached
// for next launch. Without this the first launch after an install downloads the
// whole bundle before React can hydrate — which is exactly the window where
// taps feel dead.
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "cache-assets" || !Array.isArray(data.urls)) return;

  const urls = data.urls.filter((raw) => {
    try {
      const url = new URL(raw, self.location.origin);
      return url.origin === self.location.origin && isCacheableAsset(url);
    } catch {
      return false;
    }
  });

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        urls.map((url) =>
          cache.match(url).then((hit) => (hit ? null : cache.add(url).catch(() => null))),
        ),
      ),
    ),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Documents and API calls: always the network. Macro data and identity are
  // never served from a cache.
  if (event.request.mode === "navigate" || !isCacheableAsset(url)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    }),
  );
});
