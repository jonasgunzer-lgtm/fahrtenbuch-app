// ============================================================
// db.js – IndexedDB-Wrapper
// Stores: fahrten (Einträge), settings (Stammdaten), meta (z.B. Distanzen)
// ============================================================

const DB_NAME = "fahrtenbuch";
const DB_VERSION = 1;
let _db = null;

function open() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("fahrten")) {
        const s = db.createObjectStore("fahrten", { keyPath: "id", autoIncrement: true });
        s.createIndex("datum", "datum", { unique: false });
      }
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta", { keyPath: "key" });
      }
    };
    req.onsuccess = () => { _db = req.result; resolve(_db); };
    req.onerror = () => reject(req.error);
  });
}

// Hilfsfunktion: Transaktion + Request in ein Promise verpacken.
// Wichtig: open() wird zuerst awaited, danach KEIN await mehr vor dem
// Request – sonst läuft die IndexedDB-Transaktion ab.
async function run(store, mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const req = fn(t.objectStore(store));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    t.onerror = () => reject(t.error);
  });
}

export const DB = {
  open,

  // ---- Fahrten ----
  addFahrt(fahrt) {
    return run("fahrten", "readwrite", (os) =>
      os.add({ ...fahrt, erstellt: fahrt.erstellt || Date.now() })
    );
  },
  updateFahrt(fahrt) {
    return run("fahrten", "readwrite", (os) => os.put(fahrt));
  },
  getFahrt(id) {
    return run("fahrten", "readonly", (os) => os.get(id));
  },
  async getAllFahrten() {
    const all = await run("fahrten", "readonly", (os) => os.getAll());
    // Neueste zuerst: nach Datum, bei Gleichstand nach Erstellzeit.
    return all.sort(
      (a, b) =>
        (b.datum || "").localeCompare(a.datum || "") || (b.erstellt || 0) - (a.erstellt || 0)
    );
  },
  deleteFahrt(id) {
    return run("fahrten", "readwrite", (os) => os.delete(id));
  },

  // ---- Einstellungen (genau ein Datensatz) ----
  getSettings() {
    return run("settings", "readonly", (os) => os.get("stammdaten"));
  },
  saveSettings(obj) {
    return run("settings", "readwrite", (os) => os.put({ ...obj, id: "stammdaten" }));
  },

  // ---- Meta (Schlüssel/Wert) ----
  async getMeta(key) {
    const rec = await run("meta", "readonly", (os) => os.get(key));
    return rec ? rec.value : null;
  },
  setMeta(key, value) {
    return run("meta", "readwrite", (os) => os.put({ key, value }));
  },
};
