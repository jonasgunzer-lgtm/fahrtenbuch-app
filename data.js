// ============================================================
// data.js – Stammdaten/Konstanten und Formatierhilfen (Deutsch)
// ============================================================

// ---- Vordefinierte Orte (Schnellauswahl) ----
export const ORTE = [
  { id: "zuhause", name: "Zuhause",          strasse: "Umstraße 75",      plz: "45239", ort: "Essen" },
  { id: "ikg",     name: "IKG Heiligenhaus", strasse: "Herzogstraße 75",  plz: "42579", ort: "Heiligenhaus" },
  { id: "zfsl",    name: "Zfsl Essen",       strasse: "Hindenburgstraße 76", plz: "45127", ort: "Essen" },
];
export function ortAdresse(o) {
  return `${o.strasse}, ${o.plz} ${o.ort}`;
}
export function findeOrt(id) {
  return ORTE.find((o) => o.id === id) || null;
}

// ---- Art des Dienstgeschäfts (Kürzel + Bezeichnung) ----
export const DIENSTGESCHAEFT = [
  { code: "UB",       label: "Unterrichtsbesuch" },
  { code: "F",        label: "Fachsitzung" },
  { code: "K",        label: "Konferenz" },
  { code: "G",        label: "Gruppenhosp." },
  { code: "D",        label: "Dienstbesprechung" },
  { code: "APG",      label: "APG" },
  { code: "Coaching", label: "Coaching" },
];
export function findeDienstgeschaeft(code) {
  return DIENSTGESCHAEFT.find((d) => d.code === code) || null;
}

// ---- Fahrtarten ----
export const FAHRTARTEN = [
  { id: "pkw_ohne", label: "PKW ohne triftigen Grund", info: "0,30 €/km bis 50 km, 0,20 €/km ab 51 km", braucht: "km" },
  { id: "pkw_mit",  label: "PKW mit triftigem Grund",  info: "immer 0,30 €/km",                         braucht: "km" },
  { id: "oepnv",    label: "Öffentliche Verkehrsmittel", info: "Kosten manuell eingeben",                braucht: "kosten" },
  { id: "pkw_park", label: "PKW + Parkgebühren",       info: "km (0,30 €/km) + Quittungsbetrag",         braucht: "km_kosten" },
];
export function findeFahrtart(id) {
  return FAHRTARTEN.find((f) => f.id === id) || null;
}

// ---- Fallback-Entfernungen (Hin- UND Rückfahrt, in km) ----
// Grobe Schätzungen; werden beim ersten Start per OSRM überschrieben.
export const FALLBACK_DISTANZEN = {
  "ikg|zuhause": 26,
  "zfsl|zuhause": 20,
  "ikg|zfsl": 48,
};
export function distanzSchluessel(idA, idB) {
  return [idA, idB].sort().join("|");
}

// ---- Formatierung (Deutsch) ----
export function formatDatum(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}
export function formatEuro(n) {
  return (Number(n) || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}
export function formatKm(n) {
  return (Number(n) || 0).toLocaleString("de-DE", { maximumFractionDigits: 1 }) + " km";
}
export function heuteIso() {
  const d = new Date();
  const lokal = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return lokal.toISOString().slice(0, 10);
}
