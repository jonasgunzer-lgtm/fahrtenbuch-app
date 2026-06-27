// ============================================================
// osrm.js – Routenberechnung (OSRM) + Geocoding (Nominatim)
// Öffentliche Dienste, kein API-Key. Bei Nichterreichbarkeit greift
// überall ein Fallback bzw. die manuelle km-Eingabe.
// Hinweis: Nominatim erlaubt max. 1 Anfrage/Sekunde.
// ============================================================

import { ORTE, ortAdresse, distanzSchluessel, FALLBACK_DISTANZEN } from "./data.js";
import { DB } from "./db.js";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const OSRM = "https://router.project-osrm.org/route/v1/driving";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Adresse → Koordinaten
export async function geocode(adresse) {
  const url = `${NOMINATIM}?format=json&limit=1&countrycodes=de&q=${encodeURIComponent(adresse)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Geocoding fehlgeschlagen (" + res.status + ")");
  const data = await res.json();
  if (!data.length) throw new Error("Adresse nicht gefunden: " + adresse);
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

// Strecke (eine Richtung) zwischen zwei Koordinaten, in km
export async function routeKm(a, b) {
  const url = `${OSRM}/${a.lon},${a.lat};${b.lon},${b.lat}?overview=false`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Routing fehlgeschlagen (" + res.status + ")");
  const data = await res.json();
  if (data.code !== "Ok" || !data.routes || !data.routes.length) throw new Error("Keine Route gefunden");
  return data.routes[0].distance / 1000;
}

// Rundfahrt (Hin- und Rückfahrt) zwischen zwei Adressen, in km (auf 0,1 gerundet)
export async function entfernungRundfahrt(adrA, adrB) {
  const a = await geocode(adrA);
  await sleep(1100);
  const b = await geocode(adrB);
  const hin = await routeKm(a, b);
  let rueck;
  try { rueck = await routeKm(b, a); } catch { rueck = hin; }
  return Math.round((hin + rueck) * 10) / 10;
}

// Einmalig die vordefinierten Entfernungen berechnen und cachen.
export async function initVordefinierteDistanzen({ force = false } = {}) {
  const vorhanden = await DB.getMeta("distanzen");
  if (vorhanden && !force) return vorhanden;
  try {
    const coords = {};
    for (const o of ORTE) {
      coords[o.id] = await geocode(ortAdresse(o));
      await sleep(1100); // Nominatim-Limit beachten
    }
    const paare = [["zuhause", "ikg"], ["zuhause", "zfsl"], ["ikg", "zfsl"]];
    const distanzen = {};
    for (const [x, y] of paare) {
      const hin = await routeKm(coords[x], coords[y]);
      let rueck;
      try { rueck = await routeKm(coords[y], coords[x]); } catch { rueck = hin; }
      distanzen[distanzSchluessel(x, y)] = Math.round((hin + rueck) * 10) / 10;
      await sleep(300);
    }
    await DB.setMeta("distanzen", distanzen);
    console.log("Vordefinierte Entfernungen berechnet:", distanzen);
    return distanzen;
  } catch (e) {
    console.warn("Distanz-Init fehlgeschlagen – Fallback bleibt aktiv:", e.message);
    return { ...FALLBACK_DISTANZEN };
  }
}
