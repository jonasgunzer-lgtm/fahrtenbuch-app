// ============================================================
// newEntry.js – Eingabefluss (Screens 1–6)
// Hält den Zustand der aktuell erfassten Fahrt und rendert die
// Schritte nacheinander in #app. Interne Schritt-Navigation läuft
// über zeigeSchritt(), nicht über den Router.
// ============================================================

import { Router } from "../router.js";
import {
  ORTE, ortAdresse, DIENSTGESCHAEFT, findeDienstgeschaeft,
  FAHRTARTEN, findeFahrtart, FALLBACK_DISTANZEN, distanzSchluessel,
  heuteIso, formatDatum, formatEuro, formatKm,
} from "../data.js";
import { DB } from "../db.js";
import { berechneFahrt } from "../documentTemplates.js";
import { entfernungRundfahrt } from "../osrm.js";

const TOTAL = 6;
let state = null;
let appEl = null;

function neuerState(datum) {
  return {
    datum: datum || heuteIso(),
    artCode: null,
    start: null,        // { typ:'ort'|'manuell', ortId, name, adresse }
    ziel: null,
    fahrtart: null,     // pkw_ohne | pkw_mit | oepnv | pkw_park
    kmRundfahrt: null,
    kmQuelle: null,     // vordefiniert | osrm | manuell
    kostenBetrag: null,
    schritt: 1,
  };
}

// ---- Hilfsfunktionen ----
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}
function parseNum(v) {
  if (v == null) return null;
  const n = parseFloat(String(v).replace(",", ".").trim());
  return isNaN(n) ? null : n;
}
function kmAnzeige(n) {
  return n == null ? "" : String(n).replace(".", ",");
}

// Einstiegspunkt (über Router als "newEntry" registriert)
export function renderNewEntry(app) {
  appEl = app;
  state = neuerState();
  zeigeSchritt(1);
}

function zeigeSchritt(n) {
  state.schritt = n;
  Router.setTitle("Neue Fahrt");
  Router.setProgress(n, TOTAL);
  SCHRITTE[n]();
  appEl.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ---------- Schritt 1: Datum ----------
function renderDatum() {
  appEl.innerHTML = `
    <section class="screen">
      <div class="card">
        <label class="field">Datum der Fahrt
          <input type="date" id="f-datum" value="${state.datum}" />
        </label>
      </div>
      <div class="flow-actions">
        <button class="btn" id="weiter" type="button">Weiter</button>
      </div>
    </section>`;
  const input = appEl.querySelector("#f-datum");
  appEl.querySelector("#weiter").addEventListener("click", () => {
    state.datum = input.value || heuteIso();
    zeigeSchritt(2);
  });
}

// ---------- Schritt 2: Art des Dienstgeschäfts ----------
function renderArt() {
  const choices = DIENSTGESCHAEFT.map((d) => `
    <button class="choice ${state.artCode === d.code ? "selected" : ""}" data-code="${d.code}" type="button">
      <span class="choice-text"><strong>${d.code}</strong><span class="sub">${d.label}</span></span>
    </button>`).join("");
  appEl.innerHTML = `
    <section class="screen">
      <h2>Art des Dienstgeschäfts</h2>
      <div class="choice-grid">${choices}</div>
      <div class="flow-actions">
        <button class="btn secondary" id="zurueck" type="button">Zurück</button>
        <button class="btn" id="weiter" type="button" ${state.artCode ? "" : "disabled"}>Weiter</button>
      </div>
    </section>`;
  appEl.querySelectorAll(".choice").forEach((b) =>
    b.addEventListener("click", () => {
      state.artCode = b.dataset.code;
      appEl.querySelectorAll(".choice").forEach((x) =>
        x.classList.toggle("selected", x.dataset.code === state.artCode)
      );
      appEl.querySelector("#weiter").disabled = false;
    })
  );
  appEl.querySelector("#zurueck").addEventListener("click", () => zeigeSchritt(1));
  appEl.querySelector("#weiter").addEventListener("click", () => {
    if (state.artCode) zeigeSchritt(3);
  });
}

// ---------- Schritt 3 & 4: Start-/Zielort ----------
function renderOrt(rolle) {
  const istStart = rolle === "start";
  const current = istStart ? state.start : state.ziel;
  const ausschluss = !istStart && state.start && state.start.typ === "ort" ? state.start.ortId : null;
  const titel = istStart ? "Startort" : "Zielort";

  const choices = ORTE.map((o) => {
    const disabled = o.id === ausschluss;
    const selected = current && current.typ === "ort" && current.ortId === o.id;
    return `<button class="choice ${selected ? "selected" : ""}" data-ort="${o.id}" type="button" ${disabled ? "disabled" : ""}>
      <span class="choice-text"><strong>${o.name}</strong><span class="sub">${ortAdresse(o)}</span></span>
    </button>`;
  }).join("");

  const manuell = current && current.typ === "manuell";
  appEl.innerHTML = `
    <section class="screen">
      <h2>${titel}</h2>
      <div class="choice-grid">${choices}</div>
      <button class="btn ghost" id="toggle-manuell" type="button">✏️ Andere Adresse eingeben</button>
      <div id="manuell-wrap" ${manuell ? "" : "hidden"}>
        <label class="field">Adresse
          <input type="text" id="f-adresse" placeholder="Straße Hausnr., PLZ Ort" value="${manuell ? esc(current.adresse) : ""}" />
        </label>
      </div>
      <p class="banner error" id="ort-fehler" hidden></p>
      <div class="flow-actions">
        <button class="btn secondary" id="zurueck" type="button">Zurück</button>
        <button class="btn" id="weiter" type="button">Weiter</button>
      </div>
    </section>`;

  const wrap = appEl.querySelector("#manuell-wrap");
  const adrInput = appEl.querySelector("#f-adresse");
  const fehler = appEl.querySelector("#ort-fehler");

  appEl.querySelectorAll(".choice").forEach((b) =>
    b.addEventListener("click", () => {
      if (b.disabled) return;
      const o = ORTE.find((x) => x.id === b.dataset.ort);
      const auswahl = { typ: "ort", ortId: o.id, name: o.name, adresse: ortAdresse(o) };
      if (istStart) state.start = auswahl; else state.ziel = auswahl;
      wrap.hidden = true;
      adrInput.value = "";
      appEl.querySelectorAll(".choice").forEach((x) =>
        x.classList.toggle("selected", x.dataset.ort === o.id)
      );
      fehler.hidden = true;
    })
  );
  appEl.querySelector("#toggle-manuell").addEventListener("click", () => {
    wrap.hidden = false;
    appEl.querySelectorAll(".choice").forEach((x) => x.classList.remove("selected"));
    adrInput.focus();
  });
  appEl.querySelector("#zurueck").addEventListener("click", () => zeigeSchritt(istStart ? 2 : 3));
  appEl.querySelector("#weiter").addEventListener("click", () => {
    if (!wrap.hidden) {
      const txt = adrInput.value.trim();
      if (!txt) { fehler.textContent = "Bitte eine Adresse eingeben oder einen Ort wählen."; fehler.hidden = false; return; }
      const auswahl = { typ: "manuell", ortId: null, name: txt, adresse: txt };
      if (istStart) state.start = auswahl; else state.ziel = auswahl;
    }
    const sel = istStart ? state.start : state.ziel;
    if (!sel) { fehler.textContent = "Bitte einen Ort wählen oder eine Adresse eingeben."; fehler.hidden = false; return; }
    // Strecke kann sich geändert haben → km neu ermitteln lassen
    state.kmRundfahrt = null;
    state.kmQuelle = null;
    zeigeSchritt(istStart ? 4 : 5);
  });
}

// ---------- Schritt 5: Fahrtart ----------
function renderFahrtart() {
  const choices = FAHRTARTEN.map((f) => `
    <button class="choice ${state.fahrtart === f.id ? "selected" : ""}" data-fa="${f.id}" type="button">
      <span class="choice-text"><strong>${f.label}</strong><span class="sub">${f.info}</span></span>
    </button>`).join("");
  appEl.innerHTML = `
    <section class="screen">
      <h2>Wie bist du gefahren?</h2>
      <div class="choice-grid">${choices}</div>
      <div id="kosten-wrap" hidden>
        <label class="field"><span id="kosten-label">Betrag (€)</span>
          <input type="text" inputmode="decimal" id="f-kosten" placeholder="0,00" value="${kmAnzeige(state.kostenBetrag)}" />
        </label>
      </div>
      <p class="banner error" id="fa-fehler" hidden></p>
      <div class="flow-actions">
        <button class="btn secondary" id="zurueck" type="button">Zurück</button>
        <button class="btn" id="weiter" type="button">Weiter</button>
      </div>
    </section>`;

  const kostenWrap = appEl.querySelector("#kosten-wrap");
  const kostenLabel = appEl.querySelector("#kosten-label");
  const kostenInput = appEl.querySelector("#f-kosten");
  const fehler = appEl.querySelector("#fa-fehler");

  function aktualisiereKosten() {
    const fa = findeFahrtart(state.fahrtart);
    const braucht = fa && (fa.braucht === "kosten" || fa.braucht === "km_kosten");
    kostenWrap.hidden = !braucht;
    if (braucht) kostenLabel.textContent = state.fahrtart === "oepnv" ? "Fahrtkosten ÖPNV (€)" : "Parkgebühren (€)";
  }
  aktualisiereKosten();

  appEl.querySelectorAll(".choice").forEach((b) =>
    b.addEventListener("click", () => {
      state.fahrtart = b.dataset.fa;
      appEl.querySelectorAll(".choice").forEach((x) => x.classList.toggle("selected", x.dataset.fa === state.fahrtart));
      aktualisiereKosten();
      fehler.hidden = true;
    })
  );
  appEl.querySelector("#zurueck").addEventListener("click", () => zeigeSchritt(4));
  appEl.querySelector("#weiter").addEventListener("click", () => {
    if (!state.fahrtart) { fehler.textContent = "Bitte eine Fahrtart wählen."; fehler.hidden = false; return; }
    const fa = findeFahrtart(state.fahrtart);
    if (fa.braucht === "kosten" || fa.braucht === "km_kosten") {
      const betrag = parseNum(kostenInput.value);
      if (betrag == null) { fehler.textContent = "Bitte den Betrag eingeben."; fehler.hidden = false; return; }
      state.kostenBetrag = betrag;
    } else {
      state.kostenBetrag = null;
    }
    zeigeSchritt(6);
  });
}

// km-Ermittlung: vordefiniert/Fallback für bekannte Orte, OSRM für manuelle Adressen.
async function ermittleKm(start, ziel) {
  if (!start || !ziel) return null;
  if (start.typ === "ort" && ziel.typ === "ort") {
    const key = distanzSchluessel(start.ortId, ziel.ortId);
    const cache = (await DB.getMeta("distanzen")) || {};
    if (cache[key] != null) return { km: cache[key], quelle: "vordefiniert" };
    if (FALLBACK_DISTANZEN[key] != null) return { km: FALLBACK_DISTANZEN[key], quelle: "vordefiniert" };
    return null;
  }
  // mind. eine manuelle Adresse → OSRM/Nominatim
  try {
    const km = await entfernungRundfahrt(start.adresse, ziel.adresse);
    return { km, quelle: "osrm" };
  } catch {
    return null;
  }
}

// ---------- Schritt 6: Zusammenfassung ----------
async function renderZusammenfassung() {
  const fa = findeFahrtart(state.fahrtart);
  const istPkw = fa && fa.braucht !== "kosten"; // pkw_ohne/mit/park brauchen km

  // Für bekannte Orte sofort die (gecachte) Entfernung setzen.
  const beideOrte = state.start.typ === "ort" && state.ziel.typ === "ort";
  if (istPkw && state.kmRundfahrt == null && beideOrte) {
    const erg = await ermittleKm(state.start, state.ziel);
    if (erg) { state.kmRundfahrt = erg.km; state.kmQuelle = erg.quelle; }
    else state.kmQuelle = "manuell";
  } else if (istPkw && state.kmRundfahrt == null) {
    state.kmQuelle = "manuell"; // manuelle Adresse → wird unten automatisch berechnet
  }

  const art = findeDienstgeschaeft(state.artCode);
  const b = berechneFahrt(state);

  const kostenZeile = (state.fahrtart === "oepnv" || state.fahrtart === "pkw_park")
    ? `<div class="summary-row"><span class="k">${state.fahrtart === "oepnv" ? "Fahrtkosten ÖPNV" : "Parkgebühren"}</span><span class="v">${formatEuro(state.kostenBetrag)}</span></div>`
    : "";

  const kmQuelleText = state.kmQuelle === "vordefiniert" ? "Vorgegebene Entfernung – anpassbar"
    : state.kmQuelle === "osrm" ? "Automatisch berechnet – anpassbar"
    : "Bitte Entfernung eingeben";

  const kmBlock = istPkw ? `
    <div class="summary-row" style="flex-direction:column; align-items:stretch; gap:8px;">
      <label class="field">Entfernung Hin- und Rückfahrt (km)
        <input type="text" inputmode="decimal" id="f-km" placeholder="z. B. 24" value="${kmAnzeige(state.kmRundfahrt)}" />
      </label>
      <span class="hint" id="km-quelle">${kmQuelleText}</span>
      <button class="btn ghost" id="km-berechnen" type="button" style="align-self:flex-start; min-height:44px;">📍 Strecke berechnen</button>
    </div>` : "";

  appEl.innerHTML = `
    <section class="screen">
      <h2>Zusammenfassung</h2>
      <div class="card">
        <div class="summary-row"><span class="k">Datum</span><span class="v">${formatDatum(state.datum)}</span></div>
        <div class="summary-row"><span class="k">Dienstgeschäft</span><span class="v">${art ? art.code + " – " + art.label : "–"}</span></div>
        <div class="summary-row"><span class="k">Fahrt</span><span class="v">${esc(state.start.name)} → ${esc(state.ziel.name)} → ${esc(state.start.name)}</span></div>
        <div class="summary-row"><span class="k">Fahrtart</span><span class="v">${fa.label}</span></div>
        ${kostenZeile}
        ${kmBlock}
      </div>
      <div class="card">
        <div class="summary-row"><span class="k">Erstattung</span><span class="v summary-total" id="erstattung">${formatEuro(b.betrag)}</span></div>
        <p class="hint" id="erstattung-detail">${detailText(state, b)}</p>
      </div>
      <p class="banner error" id="save-fehler" hidden></p>
      <div class="flow-actions">
        <button class="btn secondary" id="korrigieren" type="button">Korrigieren</button>
        <button class="btn" id="speichern" type="button">Eintrag speichern</button>
      </div>
    </section>`;

  const kmInput = appEl.querySelector("#f-km");
  if (kmInput) {
    kmInput.addEventListener("input", () => {
      state.kmRundfahrt = parseNum(kmInput.value);
      state.kmQuelle = "manuell";
      const q = appEl.querySelector("#km-quelle");
      if (q) q.textContent = "Manuell eingegeben";
      aktualisiereErstattung();
    });
  }
  const berechnenBtn = appEl.querySelector("#km-berechnen");
  if (berechnenBtn) berechnenBtn.addEventListener("click", () => streckeBerechnen(true));

  // Bei manuellen Adressen ohne km automatisch einmal per OSRM versuchen.
  if (istPkw && state.kmRundfahrt == null && !beideOrte) {
    streckeBerechnen(false);
  }

  appEl.querySelector("#korrigieren").addEventListener("click", () => zeigeSchritt(1));
  appEl.querySelector("#speichern").addEventListener("click", speichern);
}

function aktualisiereErstattung() {
  const nb = berechneFahrt(state);
  const e = appEl.querySelector("#erstattung");
  const d = appEl.querySelector("#erstattung-detail");
  if (e) e.textContent = formatEuro(nb.betrag);
  if (d) d.textContent = detailText(state, nb);
}

// Strecke per OSRM/Nominatim berechnen (Knopf bzw. Auto-Versuch bei manuellen Adressen).
async function streckeBerechnen(force) {
  const quelleEl = appEl.querySelector("#km-quelle");
  const kmInput = appEl.querySelector("#f-km");
  const btn = appEl.querySelector("#km-berechnen");
  if (quelleEl) quelleEl.textContent = "Strecke wird berechnet …";
  if (btn) btn.disabled = true;
  try {
    let km = null;
    const beideOrte = state.start.typ === "ort" && state.ziel.typ === "ort";
    if (beideOrte && !force) {
      const erg = await ermittleKm(state.start, state.ziel);
      if (erg) { km = erg.km; state.kmQuelle = erg.quelle; }
    } else {
      km = await entfernungRundfahrt(state.start.adresse, state.ziel.adresse);
      state.kmQuelle = "osrm";
      if (beideOrte) { // Cache der vordefinierten Orte auffrischen
        const cache = (await DB.getMeta("distanzen")) || {};
        cache[distanzSchluessel(state.start.ortId, state.ziel.ortId)] = km;
        await DB.setMeta("distanzen", cache);
      }
    }
    if (km != null) {
      state.kmRundfahrt = km;
      if (kmInput) kmInput.value = kmAnzeige(km);
      aktualisiereErstattung();
    }
    if (quelleEl) {
      quelleEl.textContent = state.kmQuelle === "osrm" ? "Automatisch berechnet – anpassbar"
        : state.kmQuelle === "vordefiniert" ? "Vorgegebene Entfernung – anpassbar"
        : "Bitte Entfernung eingeben";
    }
  } catch (e) {
    state.kmQuelle = "manuell";
    if (quelleEl) quelleEl.textContent = "Automatische Berechnung nicht möglich – bitte km eingeben.";
  } finally {
    if (btn) btn.disabled = false;
  }
}

function detailText(s, b) {
  switch (s.fahrtart) {
    case "pkw_ohne":
      return b.km020 > 0
        ? `${formatKm(b.km030)} × 0,30 € + ${formatKm(b.km020)} × 0,20 €`
        : `${formatKm(b.km030)} × 0,30 €`;
    case "pkw_mit":
      return `${formatKm(b.km030)} × 0,30 €`;
    case "oepnv":
      return `Fahrtkosten ÖPNV: ${formatEuro(b.oepnvKosten)}`;
    case "pkw_park":
      return `${formatKm(b.km030)} × 0,30 € + Parkgebühren ${formatEuro(b.parkKosten)}`;
    default:
      return "";
  }
}

async function speichern() {
  const fa = findeFahrtart(state.fahrtart);
  const fehler = appEl.querySelector("#save-fehler");
  const istPkw = fa && fa.braucht !== "kosten";

  if (istPkw && (state.kmRundfahrt == null || state.kmRundfahrt <= 0)) {
    fehler.textContent = "Bitte eine gültige Entfernung (km) eingeben.";
    fehler.hidden = false;
    return;
  }
  if ((fa.braucht === "kosten" || fa.braucht === "km_kosten") && state.kostenBetrag == null) {
    fehler.textContent = "Bitte den Betrag eingeben.";
    fehler.hidden = false;
    return;
  }

  const fahrt = {
    datum: state.datum,
    artCode: state.artCode,
    start: state.start,
    ziel: state.ziel,
    fahrtart: state.fahrtart,
    kmRundfahrt: istPkw ? state.kmRundfahrt : null,
    kmQuelle: istPkw ? state.kmQuelle : null,
    kostenBetrag: (fa.braucht === "kosten" || fa.braucht === "km_kosten") ? state.kostenBetrag : null,
  };
  const b = berechneFahrt(fahrt);
  try {
    await DB.addFahrt(fahrt);
    renderGespeichert(b.betrag);
  } catch (e) {
    fehler.textContent = "Speichern fehlgeschlagen: " + e.message;
    fehler.hidden = false;
  }
}

// ---------- Nach dem Speichern ----------
function renderGespeichert(betrag) {
  Router.setProgress();
  appEl.innerHTML = `
    <section class="screen">
      <div class="banner success">✅ Eintrag gespeichert! (${formatEuro(betrag)})</div>
      <div class="card">
        <h2>Noch eine Fahrt für heute eintragen?</h2>
        <div class="flow-actions">
          <button class="btn" id="ja" type="button">Ja</button>
          <button class="btn secondary" id="nein" type="button">Nein</button>
        </div>
      </div>
    </section>`;
  appEl.querySelector("#ja").addEventListener("click", () => {
    const datum = state.datum;
    state = neuerState(datum);
    zeigeSchritt(2); // Datum bleibt, Rest neu
  });
  appEl.querySelector("#nein").addEventListener("click", () => {
    state = neuerState();
    zeigeSchritt(1);
  });
}

const SCHRITTE = {
  1: renderDatum,
  2: renderArt,
  3: () => renderOrt("start"),
  4: () => renderOrt("ziel"),
  5: renderFahrtart,
  6: renderZusammenfassung,
};
