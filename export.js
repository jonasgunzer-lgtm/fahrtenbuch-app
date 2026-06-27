// ============================================================
// export.js – Export-Screen: Formular & Zeitraum wählen,
// Word-Dokument erzeugen und herunterladen.
// ============================================================

import { Router } from "../router.js";
import { DB } from "../db.js";
import { TEMPLATES, findeTemplate, berechneGesamt } from "../documentTemplates.js";
import { formatEuro } from "../data.js";

const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli",
  "August", "September", "Oktober", "November", "Dezember"];
function monatLabel(ym) {
  const [y, m] = ym.split("-");
  return `${MONATE[+m - 1]} ${y}`;
}

export async function renderExport(app) {
  Router.setTitle("Export");
  Router.setProgress();

  const fahrten = await DB.getAllFahrten();
  const settings = (await DB.getSettings()) || {};

  const monate = [...new Set(fahrten.map((f) => f.datum.slice(0, 7)))].sort().reverse();
  const templateOpts = TEMPLATES.map((t) => `<option value="${t.id}">${t.name}</option>`).join("");
  const monatOpts =
    `<option value="alle">Alle Einträge</option>` +
    monate.map((m) => `<option value="${m}">${monatLabel(m)}</option>`).join("");

  app.innerHTML = `
    <section class="screen">
      ${fahrten.length === 0 ? `<div class="banner info">Es sind noch keine Fahrten gespeichert.</div>` : ""}
      <label class="field">Formular
        <select id="exp-template">${templateOpts}</select>
      </label>
      <label class="field">Zeitraum
        <select id="exp-zeitraum">${monatOpts}</select>
      </label>
      <div class="card">
        <div class="summary-row"><span class="k">Fahrten im Zeitraum</span><span class="v" id="exp-anzahl">–</span></div>
        <div class="summary-row"><span class="k">Erstattung gesamt</span><span class="v summary-total" id="exp-summe">–</span></div>
      </div>
      ${!settings.name ? `<div class="banner info">Tipp: Trage zuerst unter „Einstellungen" deine Stammdaten ein – sie erscheinen im Formularkopf.</div>` : ""}
      <div class="banner error" id="exp-fehler" hidden></div>
      <div class="flow-actions">
        <button class="btn" id="exp-erstellen" type="button">📄 Word-Dokument erstellen</button>
      </div>
    </section>`;

  const tsel = app.querySelector("#exp-template");
  const zsel = app.querySelector("#exp-zeitraum");
  const anzahlEl = app.querySelector("#exp-anzahl");
  const summeEl = app.querySelector("#exp-summe");
  const fehler = app.querySelector("#exp-fehler");
  const btn = app.querySelector("#exp-erstellen");

  function gefiltert() {
    const z = zsel.value;
    return z === "alle" ? fahrten : fahrten.filter((f) => f.datum.slice(0, 7) === z);
  }
  function aktualisiere() {
    const fs = gefiltert();
    anzahlEl.textContent = String(fs.length);
    summeEl.textContent = formatEuro(berechneGesamt(fs).betrag);
    btn.disabled = fs.length === 0;
  }
  zsel.addEventListener("change", aktualisiere);
  aktualisiere();

  btn.addEventListener("click", async () => {
    fehler.hidden = true;
    const fs = gefiltert();
    if (!fs.length) return;
    const template = findeTemplate(tsel.value);
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Wird erstellt …";
    try {
      const blob = await template.baueExport(fs, settings);
      const name = `Fahrtkosten_${zsel.value}.docx`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      btn.textContent = "✅ Heruntergeladen";
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2200);
    } catch (e) {
      console.error("Export-Fehler:", e);
      fehler.textContent = "Fehler beim Erstellen: " + (e.message || e);
      fehler.hidden = false;
      btn.textContent = orig;
      btn.disabled = false;
    }
  });
}
