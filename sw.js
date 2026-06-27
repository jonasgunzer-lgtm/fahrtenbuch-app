// ============================================================
// sw.js – Service Worker
// Strategie: Cache-First mit Hintergrund-Aktualisierung
// (stale-while-revalidate). App startet sofort und offline,
// erneuert die Dateien aber im Hintergrund.
// Bei Änderungen an gecachten Dateien CACHE-Version erhöhen.
// ============================================================

const CACHE = "fahrtenbuch-v2";

// Komplette App-Shell für den Offline-Betrieb.
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/app.js",
  "./js/router.js",
  "./js/db.js",
  "./js/data.js",
  "./js/osrm.js",
  "./js/documentTemplates.js",
  "./js/screens/newEntry.js",
  "./js/screens/entries.js",
  "./js/screens/export.js",
  "./js/screens/settings.js",
  "./vendor/pizzip.js",
  "./vendor/docxtemplater.js",
  "./templates/fahrtkostenerstattung-2026.docx",
  "./icons/icon.svg",
];

// Installation: App-Shell cachen (einzeln, damit ein fehlendes Asset
// nicht die gesamte Installation verhindert).
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.allSettled(ASSETS.map((u) => cache.add(u))))
      .then(() => self.skipWaiting())
  );
});

// Aktivierung: veraltete Caches entfernen.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch: nur gleiche Origin abfangen (OSRM/Nominatim immer direkt ins Netz).
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    )
  );
});
