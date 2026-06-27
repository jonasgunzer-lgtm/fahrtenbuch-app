// ============================================================
// documentTemplates.js – Formular-Vorlagen
// Jede Vorlage ist ein eigenständiges Objekt (Berechnung, Kopffelder,
// Spalten, Export-Funktion) → ein zweites Formular lässt sich später
// einfach als neues Objekt ergänzen, ohne den Rest der App anzufassen.
// ============================================================

// ---- Erstattungssätze nach § 9 LRKG NRW ----
const SATZ_HOCH = 0.30;    // €/km (mit triftigem Grund; ohne Grund bis 50 km)
const SATZ_NIEDRIG = 0.20; // €/km (ohne triftigen Grund ab dem 51. km)
const SCHWELLE_KM = 50;    // Grenze der Staffelung

// Berechnung EINER Fahrt → Beträge und km-Aufteilung.
// ANNAHMEN (mit Jonas per Zahlenbeispiel zu bestätigen):
//  - "PKW ohne triftigen Grund": gestaffelt pro Eintrag (Rundfahrt) –
//    die ersten 50 km zu 0,30 €, jeder weitere km zu 0,20 €.
//  - "PKW mit triftigem Grund": immer 0,30 €/km.
//  - "PKW + Parkgebühren": Parken laut Formular nur mit triftigem Grund →
//    0,30 €/km + Quittungsbetrag.
export function berechneFahrt(fahrt) {
  const km = Number(fahrt.kmRundfahrt) || 0;
  const kosten = Number(fahrt.kostenBetrag) || 0;
  let km030 = 0, km020 = 0, kmOhne = 0, kmMit = 0, oepnvKosten = 0, parkKosten = 0;

  switch (fahrt.fahrtart) {
    case "pkw_ohne":
      kmOhne = km;
      km030 = Math.min(km, SCHWELLE_KM);
      km020 = Math.max(km - SCHWELLE_KM, 0);
      break;
    case "pkw_mit":
      kmMit = km;
      km030 = km;
      break;
    case "oepnv":
      oepnvKosten = kosten;
      break;
    case "pkw_park":
      kmMit = km;
      km030 = km;
      parkKosten = kosten;
      break;
  }
  const betrag = km030 * SATZ_HOCH + km020 * SATZ_NIEDRIG + oepnvKosten + parkKosten;
  return { km030, km020, kmOhne, kmMit, oepnvKosten, parkKosten, betrag };
}

// Summen über mehrere Fahrten (für Fußbereich des Formulars).
export function berechneGesamt(fahrten) {
  const t = { km030: 0, km020: 0, kmOhne: 0, kmMit: 0, kosten: 0, betrag: 0 };
  for (const f of fahrten) {
    const b = berechneFahrt(f);
    t.km030 += b.km030;
    t.km020 += b.km020;
    t.kmOhne += b.kmOhne;
    t.kmMit += b.kmMit;
    t.kosten += b.oepnvKosten + b.parkKosten;
    t.betrag += b.betrag;
  }
  t.betragKm030 = t.km030 * SATZ_HOCH;
  t.betragKm020 = t.km020 * SATZ_NIEDRIG;
  t.betragKosten = t.kosten;
  return t;
}

export const SAETZE = { SATZ_HOCH, SATZ_NIEDRIG, SCHWELLE_KM };

// ---- Formatierung für das Dokument (ohne Einheit, Komma als Dezimaltrenner) ----
function numKm(n) {
  return (Number(n) || 0).toLocaleString("de-DE", { maximumFractionDigits: 1 });
}
function numEuro(n) {
  return (Number(n) || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fdatum(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

// Daten-Mapping für „Fahrtkostenerstattung 2026" → docxtemplater-Platzhalter
function baueDatenFahrtkosten2026(fahrten, settings = {}) {
  const g = berechneGesamt(fahrten);
  return {
    name: settings.name || "",
    vorname: settings.vorname || "",
    strasse: settings.strasse || "",
    plzWohnort: [settings.plz, settings.wohnort].filter(Boolean).join(" "),
    dienstort: settings.dienstort || "",
    dienststelle: settings.dienststelle || "",
    entfernung: settings.entfernungDienststelle || "",
    bank: settings.bank || "",
    blz: settings.blz || "",
    kontoNr: settings.kontoNr || "",
    fahrten: fahrten.map((f) => {
      const mitGrund = f.fahrtart === "pkw_mit" || f.fahrtart === "pkw_park";
      return {
        datum: fdatum(f.datum),
        art: f.artCode || "",
        strecke: `${f.start?.name ?? ""} – ${f.ziel?.name ?? ""} – ${f.start?.name ?? ""}`,
        fahrtMit: f.fahrtart === "oepnv" ? "ÖPNV" : "PKW",
        triftig: mitGrund ? "x" : "",
        kosten: (f.fahrtart === "oepnv" || f.fahrtart === "pkw_park") ? numEuro(f.kostenBetrag) : "",
        kmOhne: f.fahrtart === "pkw_ohne" ? numKm(f.kmRundfahrt) : "",
        kmMit: mitGrund ? numKm(f.kmRundfahrt) : "",
      };
    }),
    summeKmOhne: numKm(g.kmOhne),
    summeKmMit: numKm(g.kmMit),
    betragKm030: numEuro(g.betragKm030),
    betragKm020: numEuro(g.betragKm020),
    fahrtkostenOepnv: numEuro(g.kosten),
    summeGesamt: numEuro(g.betrag),
  };
}

// docxtemplater-Rendering: Vorlage laden, füllen, als Blob zurückgeben.
// (Vendor-Libs liegen global als window.PizZip / window.docxtemplater vor.)
async function rendereDocx(docxPfad, daten) {
  const PizZipLib = window.PizZip;
  const DocxtemplaterLib = window.docxtemplater && (window.docxtemplater.default || window.docxtemplater);
  if (!PizZipLib || !DocxtemplaterLib) throw new Error("docxtemplater/pizzip nicht geladen");
  const res = await fetch(docxPfad);
  if (!res.ok) throw new Error("Vorlage nicht gefunden: " + docxPfad);
  const zip = new PizZipLib(await res.arrayBuffer());
  const doc = new DocxtemplaterLib(zip, { paragraphLoop: true, linebreaks: true });
  doc.render(daten);
  return doc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

// ---- Vorlagen-Registry ----
// Jede Vorlage kapselt: Berechnung, Daten-Mapping und Export-Funktion.
export const TEMPLATES = [
  {
    id: "fahrtkosten-2026",
    name: "Fahrtkostenerstattung 2026",
    docxPfad: "templates/fahrtkostenerstattung-2026.docx",
    berechneFahrt,
    berechneGesamt,
    baueDaten(fahrten, settings) { return baueDatenFahrtkosten2026(fahrten, settings); },
    async baueExport(fahrten, settings) {
      return await rendereDocx(this.docxPfad, this.baueDaten(fahrten, settings));
    },
  },
];
export function findeTemplate(id) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}
