// ============================================================
// entries.js – Liste der gespeicherten Fahrten (neueste zuerst),
// mit Möglichkeit, einzelne Einträge zu löschen.
// ============================================================

import { Router } from "../router.js";
import { DB } from "../db.js";
import { formatDatum, formatEuro, formatKm, findeDienstgeschaeft, findeFahrtart } from "../data.js";
import { berechneFahrt, berechneGesamt } from "../documentTemplates.js";

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

export async function renderEntries(app) {
  Router.setTitle("Einträge");
  Router.setProgress();

  const fahrten = await DB.getAllFahrten();

  if (!fahrten.length) {
    app.innerHTML = `
      <section class="screen">
        <div class="empty-state">
          <div style="font-size:48px;">📋</div>
          <p>Noch keine Fahrten gespeichert.</p>
          <p class="hint">Lege über „Neue Fahrt" deinen ersten Eintrag an.</p>
        </div>
      </section>`;
    return;
  }

  const gesamt = berechneGesamt(fahrten);

  const items = fahrten.map((f) => {
    const b = berechneFahrt(f);
    const art = findeDienstgeschaeft(f.artCode);
    const fa = findeFahrtart(f.fahrtart);
    const detail =
      f.fahrtart === "oepnv" ? `ÖPNV · ${formatEuro(f.kostenBetrag)}`
      : f.fahrtart === "pkw_park" ? `${formatKm(f.kmRundfahrt)} · Parken ${formatEuro(f.kostenBetrag)}`
      : formatKm(f.kmRundfahrt);
    return `
      <div class="entry">
        <div style="min-width:0;">
          <div><strong>${formatDatum(f.datum)}</strong> · ${art ? art.code : "?"}</div>
          <div class="meta">${esc(f.start.name)} → ${esc(f.ziel.name)} → ${esc(f.start.name)}</div>
          <div class="meta">${fa ? fa.label : ""} · ${detail}</div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
          <span class="amount">${formatEuro(b.betrag)}</span>
          <button class="icon-btn" data-del="${f.id}" type="button" aria-label="Eintrag löschen" title="Löschen">🗑️</button>
        </div>
      </div>`;
  }).join("");

  app.innerHTML = `
    <section class="screen">
      <div class="card" style="display:flex; justify-content:space-between; align-items:center;">
        <span>${fahrten.length} ${fahrten.length === 1 ? "Fahrt" : "Fahrten"}</span>
        <span class="summary-total">${formatEuro(gesamt.betrag)}</span>
      </div>
      ${items}
    </section>`;

  app.querySelectorAll("[data-del]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.del);
      if (confirm("Diesen Eintrag wirklich löschen?")) {
        await DB.deleteFahrt(id);
        renderEntries(app);
      }
    })
  );
}
