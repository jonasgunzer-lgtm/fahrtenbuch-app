/* Service Worker: legt die App im Geraetespeicher ab, damit sie ohne Netz laeuft. */
const CACHE = "bonjour-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/styles.css",
  "./data/alltag.js",
  "./data/reise.js",
  "./js/content.js",
  "./js/srs.js",
  "./js/tts.js",
  "./js/ui.js",
  "./js/store.js",
  "./js/session.js",
  "./js/app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  if (e.request.url.indexOf(self.location.origin) !== 0) return;

  // Aus dem Cache sofort ausliefern, im Hintergrund nach einer neueren Fassung sehen.
  e.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(e.request).then(function (hit) {
        const network = fetch(e.request).then(function (res) {
          if (res && res.ok) cache.put(e.request, res.clone());
          return res;
        }).catch(function () {
          return hit || (e.request.mode === "navigate" ? cache.match("./index.html") : Response.error());
        });
        return hit || network;
      });
    })
  );
});
