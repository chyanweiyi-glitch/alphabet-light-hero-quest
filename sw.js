const CACHE_NAME = "alphabet-light-hero-quest-v3";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/game.js",
  "/manifest.webmanifest",
  "/assets/generated/hero-nova-actions.png",
  "/assets/generated/hero-aqua-actions.png",
  "/assets/generated/hero-solar-actions.png",
  "/assets/generated/kaiju-purple-actions.png",
  "/assets/generated/kaiju-red-actions.png",
  "/assets/generated/kaiju-green-actions.png",
  "/assets/generated/kaiju-orange-actions.png",
  "/assets/generated/backgrounds/level-01.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (url.origin !== location.origin || request.method !== "GET" || url.pathname === "/api/transcribe") return;

  if (url.pathname.startsWith("/api/speech")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      }),
    );
    return;
  }

  if (request.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith(".js") || url.pathname.endsWith(".css") || url.pathname.endsWith(".webmanifest")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && url.pathname.startsWith("/assets/")) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
