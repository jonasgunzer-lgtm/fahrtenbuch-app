// ============================================================
// app.js – Haupt-Controller
// Bootstrapping: Service Worker, Navigation, Start-Screen.
// ============================================================

import { Router } from "./router.js";
import { renderNewEntry } from "./screens/newEntry.js";
import { renderEntries } from "./screens/entries.js";
import { renderSettings } from "./screens/settings.js";
import { initVordefinierteDistanzen } from "./osrm.js";
import { renderExport } from "./screens/export.js";

// ---------- Service Worker (Offline-Fähigkeit) ----------
// Während der Entwicklung deaktiviert, damit Code-Änderungen nicht aus
// dem Cache überdeckt werden. TODO(Schritt 8): auf true setzen + Offline testen.
const SW_AKTIV = true;
function registerServiceWorker() {
  if (!SW_AKTIV) return;
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(
      (reg) => console.log("Service Worker registriert:", reg.scope),
      (err) => console.warn("Service Worker fehlgeschlagen:", err)
    );
  });
}

// ---------- "Zum Homescreen hinzufügen" (Android) ----------
let deferredInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  zeigeInstallBanner();
});
window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  const b = document.getElementById("install-banner");
  if (b) b.remove();
});

function zeigeInstallBanner() {
  if (document.getElementById("install-banner")) return;
  const bar = document.createElement("div");
  bar.id = "install-banner";
  bar.className = "install-banner";
  bar.innerHTML = `
    <span>📲 Fahrtenbuch zum Startbildschirm hinzufügen?</span>
    <span class="install-actions">
      <button class="btn-mini" id="install-yes" type="button">Installieren</button>
      <button class="btn-mini ghost" id="install-no" type="button" aria-label="Schließen">×</button>
    </span>`;
  document.body.appendChild(bar);
  document.getElementById("install-yes").addEventListener("click", async () => {
    bar.remove();
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    try { await deferredInstallPrompt.userChoice; } catch {}
    deferredInstallPrompt = null;
  });
  document.getElementById("install-no").addEventListener("click", () => bar.remove());
}

// ---------- Platzhalter-Screens (werden Schritt für Schritt ersetzt) ----------
function placeholder(title, text) {
  return (app) => {
    Router.setTitle(title);
    Router.setProgress();
    app.innerHTML = `
      <section class="screen">
        <div class="card">
          <h2>${title}</h2>
          <p class="hint">${text}</p>
        </div>
      </section>`;
  };
}

function registerScreens() {
  Router.register("newEntry", renderNewEntry);
  Router.register("entries", renderEntries);
  Router.register("export", renderExport);
  Router.register("settings", renderSettings);
}

// ---------- Untere Navigation verdrahten ----------
function wireNav() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => Router.show(btn.dataset.nav));
  });
}

// ---------- Start ----------
function init() {
  registerServiceWorker();
  registerScreens();
  wireNav();
  Router.show("newEntry"); // Startscreen
  // Vordefinierte Entfernungen einmalig im Hintergrund berechnen & cachen.
  initVordefinierteDistanzen().catch(() => {});
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
