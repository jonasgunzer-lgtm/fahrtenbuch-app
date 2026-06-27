// ============================================================
// settings.js – Stammdaten (einmalig ausfüllbar, in IndexedDB)
// Diese Daten werden in den Kopf des Word-Formulars übernommen.
// ============================================================

import { Router } from "../router.js";
import { DB } from "../db.js";

// Felddefinition (Reihenfolge = Anzeigereihenfolge)
const FELDER = [
  { key: "name",                   label: "Name",        inputmode: null },
  { key: "vorname",                label: "Vorname",     inputmode: null },
  { key: "strasse",                label: "Straße",      inputmode: null },
  { key: "plz",                    label: "PLZ",         inputmode: "numeric" },
  { key: "wohnort",                label: "Wohnort",     inputmode: null },
  { key: "dienstort",              label: "Dienstort",   inputmode: null },
  { key: "dienststelle",           label: "Dienststelle", inputmode: null },
  { key: "entfernungDienststelle", label: "Entfernung Wohnung ↔ Dienststelle (km, einfach)", inputmode: "decimal" },
  { key: "bank",                   label: "Bank",        inputmode: null },
  { key: "blz",                    label: "BLZ",         inputmode: "numeric" },
  { key: "kontoNr",                label: "Konto-Nr.",   inputmode: null },
];

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

export async function renderSettings(app) {
  Router.setTitle("Einstellungen");
  Router.setProgress();

  const s = (await DB.getSettings()) || {};

  const felder = FELDER.map((f) => `
    <label class="field">${f.label}
      <input type="text" id="set-${f.key}" ${f.inputmode ? `inputmode="${f.inputmode}"` : ""} value="${esc(s[f.key] != null ? s[f.key] : "")}" />
    </label>`).join("");

  app.innerHTML = `
    <section class="screen">
      <p class="hint">Diese Stammdaten werden in den Kopf des Word-Formulars übernommen. Einmal ausfüllen, danach automatisch verwendet.</p>
      <div class="card" style="display:flex; flex-direction:column; gap:14px;">
        ${felder}
      </div>
      <div class="banner success" id="set-ok" hidden>✅ Gespeichert!</div>
      <div class="flow-actions">
        <button class="btn" id="set-speichern" type="button">Speichern</button>
      </div>
    </section>`;

  app.querySelector("#set-speichern").addEventListener("click", async () => {
    const obj = {};
    for (const f of FELDER) {
      obj[f.key] = app.querySelector("#set-" + f.key).value.trim();
    }
    await DB.saveSettings(obj);
    const ok = app.querySelector("#set-ok");
    ok.hidden = false;
    ok.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setTimeout(() => { ok.hidden = true; }, 2500);
  });
}
