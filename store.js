/* Fortschritt, XP, Level, Streak und Abzeichen. Alles bleibt lokal auf dem Geraet. */
window.FR = window.FR || {};
FR.Store = (function () {
  const KEY = "fr_lernapp_v1";

  const TITLES = [
    { min: 1, name: "Débutant" }, { min: 3, name: "Curieux" }, { min: 5, name: "Apprenti" },
    { min: 8, name: "Voyageur" }, { min: 11, name: "Bavard" }, { min: 15, name: "Habitué" },
    { min: 20, name: "Connaisseur" }, { min: 25, name: "Bon vivant" }, { min: 30, name: "Francophile" },
    { min: 40, name: "Maître de la langue" }
  ];

  const BADGES = [
    { id: "start", emoji: "🥐", name: "Le début", desc: "Erste Session abgeschlossen" },
    { id: "streak3", emoji: "🔥", name: "Drei am Stück", desc: "3 Tage in Folge gelernt" },
    { id: "streak7", emoji: "🔥", name: "Eine ganze Woche", desc: "7 Tage in Folge gelernt" },
    { id: "streak30", emoji: "🏅", name: "Un mois !", desc: "30 Tage in Folge gelernt" },
    { id: "goal5", emoji: "🎯", name: "Zielsicher", desc: "5-mal das Tagesziel erreicht" },
    { id: "words25", emoji: "🌱", name: "25 Wörter", desc: "25 Vokabeln in die Wiederholung gebracht" },
    { id: "words100", emoji: "🌳", name: "100 Wörter", desc: "100 Vokabeln in die Wiederholung gebracht" },
    { id: "master25", emoji: "💎", name: "Sitzt", desc: "25 Vokabeln gemeistert (Intervall über 3 Wochen)" },
    { id: "perfect", emoji: "✨", name: "Sans faute", desc: "Eine Session ohne einen einzigen Fehler" },
    { id: "typing50", emoji: "⌨️", name: "Accent aigu", desc: "50 Tippaufgaben richtig gelöst" },
    { id: "earlybird", emoji: "🌅", name: "Lève-tôt", desc: "Vor 7 Uhr morgens gelernt" },
    { id: "nightowl", emoji: "🌙", name: "Nuit blanche", desc: "Nach 22 Uhr gelernt" },
    { id: "lesson1", emoji: "📘", name: "Erste Lektion", desc: "Eine Lektion komplett durchgearbeitet" },
    { id: "unitAlltag", emoji: "☕", name: "Alltag im Griff", desc: "Alle Lektionen der Themenwelt Alltag begonnen" },
    { id: "unitReise", emoji: "🚄", name: "Reisefertig", desc: "Alle Lektionen der Themenwelt Reise begonnen" },
    { id: "xp2000", emoji: "🚀", name: "2000 XP", desc: "Insgesamt 2000 Erfahrungspunkte gesammelt" }
  ];

  function fresh() {
    return {
      v: 1,
      createdAt: Date.now(),
      cards: {},
      xp: 0,
      goal: 20,
      newPerSession: 8,
      days: {},
      streak: 0, best: 0, lastDay: null,
      badges: [],
      totals: { answers: 0, correct: 0, seconds: 0, typedCorrect: 0, sessions: 0, goalsHit: 0 },
      settings: { typing: true, listening: true, autoplay: true, theme: "auto" }
    };
  }

  let state = fresh();
  let saveTimer = null;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = Object.assign(fresh(), parsed);
        state.totals = Object.assign(fresh().totals, parsed.totals || {});
        state.settings = Object.assign(fresh().settings, parsed.settings || {});
      }
    } catch (e) { console.warn("Konnte Fortschritt nicht laden:", e); }
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {});
    return state;
  }

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(KEY, JSON.stringify(state)); }
      catch (e) { console.warn("Speichern fehlgeschlagen:", e); }
    }, 120);
  }

  function saveNow() {
    clearTimeout(saveTimer);
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  /* ---------- Datum ---------- */
  function dayKey(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function shiftDay(key, delta) {
    const p = key.split("-").map(Number);
    const d = new Date(p[0], p[1] - 1, p[2]);
    d.setDate(d.getDate() + delta);
    return dayKey(d);
  }
  function today() { return dayKey(); }

  /* ---------- Karten ---------- */
  function card(id) {
    if (!state.cards[id]) state.cards[id] = FR.SRS.newCard();
    return state.cards[id];
  }
  function rawCard(id) { return state.cards[id]; }

  function counts() {
    const now = Date.now();
    let due = 0, learned = 0, mastered = 0, seen = 0, learning = 0;
    FR.CONTENT.cardOrder.forEach(function (id) {
      const c = state.cards[id];
      if (!c || c.reps === 0) return;
      seen++;
      if (c.s === "rev") learned++;
      if (c.s === "learn") learning++;
      if (FR.SRS.strength(c) >= 5) mastered++;
      if (c.due <= now && c.s !== "new") due++;
    });
    return {
      due: due, learned: learned, mastered: mastered, seen: seen, learning: learning,
      fresh: FR.CONTENT.totalCards - seen
    };
  }

  function lessonStats(lessonId) {
    const lesson = FR.CONTENT.lessons[lessonId];
    let seen = 0, learned = 0, strengthSum = 0, due = 0;
    const now = Date.now();
    lesson.cardIds.forEach(function (id) {
      const c = state.cards[id];
      if (!c || c.reps === 0) return;
      seen++;
      if (c.s === "rev") learned++;
      if (c.due <= now && c.s !== "new") due++;
      strengthSum += FR.SRS.strength(c);
    });
    const total = lesson.cardIds.length;
    return {
      total: total, seen: seen, learned: learned, due: due,
      pct: Math.round((strengthSum / (total * 5)) * 100),
      started: seen > 0, done: seen === total
    };
  }

  function unitStats(unitId) {
    const unit = FR.CONTENT.unit(unitId);
    let total = 0, strengthSum = 0, seen = 0, due = 0;
    unit.lessons.forEach(function (l) {
      const s = lessonStats(l.id);
      total += s.total; seen += s.seen; due += s.due;
      strengthSum += (s.pct / 100) * s.total * 5;
    });
    return { total: total, seen: seen, due: due, pct: Math.round((strengthSum / (total * 5)) * 100) };
  }

  /* ---------- Lernpfad ---------- */
  function currentLessonId() {
    for (const id of FR.CONTENT.path) {
      const s = lessonStats(id);
      if (!s.done) return id;
    }
    return FR.CONTENT.path[FR.CONTENT.path.length - 1];
  }

  /* ---------- XP & Level ---------- */
  function levelFromXp(xp) { return Math.max(1, Math.floor(Math.sqrt(xp / 20 + 1))); }
  function xpForLevel(l) { return 20 * (l * l - 1); }
  function titleFor(l) {
    let t = TITLES[0].name;
    TITLES.forEach(function (x) { if (l >= x.min) t = x.name; });
    return t;
  }
  function levelInfo() {
    const lvl = levelFromXp(state.xp);
    const base = xpForLevel(lvl), next = xpForLevel(lvl + 1);
    return {
      level: lvl, title: titleFor(lvl), xp: state.xp,
      inLevel: state.xp - base, needed: next - base,
      pct: Math.round(((state.xp - base) / (next - base)) * 100),
      toNext: next - state.xp
    };
  }

  function addXp(n) {
    const before = levelFromXp(state.xp);
    state.xp += n;
    const after = levelFromXp(state.xp);
    save();
    return after > before ? after : 0;   // gibt neues Level zurueck, sonst 0
  }

  /* ---------- Tag & Streak ---------- */
  function day(key) {
    key = key || today();
    if (!state.days[key]) state.days[key] = { c: 0, x: 0, s: 0, n: 0 };
    return state.days[key];
  }

  function touchDay() {
    const t = today();
    if (state.lastDay === t) return;
    if (state.lastDay === shiftDay(t, -1)) state.streak += 1;
    else state.streak = 1;
    state.lastDay = t;
    if (state.streak > state.best) state.best = state.streak;
    save();
  }

  // Streak verfaellt, wenn gestern und heute nichts passiert ist
  function streakValue() {
    if (!state.lastDay) return 0;
    const t = today();
    if (state.lastDay === t || state.lastDay === shiftDay(t, -1)) return state.streak;
    return 0;
  }

  function registerAnswer(opt) {
    const d = day();
    d.c += 1;
    d.x += opt.xp || 0;
    if (opt.isNew) d.n += 1;
    state.totals.answers += 1;
    if (opt.correct) state.totals.correct += 1;
    if (opt.typed && opt.correct) state.totals.typedCorrect += 1;
    save();
  }

  function addSeconds(sec) {
    day().s += sec;
    state.totals.seconds += sec;
    save();
  }

  function goalProgress() {
    const d = day();
    return { done: d.c, goal: state.goal, pct: Math.min(100, Math.round((d.c / state.goal) * 100)), hit: d.c >= state.goal };
  }

  /* ---------- Abzeichen ---------- */
  function checkBadges(ctx) {
    ctx = ctx || {};
    const gained = [];
    const has = function (id) { return state.badges.indexOf(id) >= 0; };
    const give = function (id) { if (!has(id)) { state.badges.push(id); gained.push(BADGES.find(function (b) { return b.id === id; })); } };
    const c = counts();
    const hour = new Date().getHours();

    if (state.totals.sessions >= 1) give("start");
    if (streakValue() >= 3) give("streak3");
    if (streakValue() >= 7) give("streak7");
    if (streakValue() >= 30) give("streak30");
    if (state.totals.goalsHit >= 5) give("goal5");
    if (c.learned >= 25) give("words25");
    if (c.learned >= 100) give("words100");
    if (c.mastered >= 25) give("master25");
    if (state.totals.typedCorrect >= 50) give("typing50");
    if (state.xp >= 2000) give("xp2000");
    if (ctx.perfectSession) give("perfect");
    if (ctx.sessionEnded && hour < 7) give("earlybird");
    if (ctx.sessionEnded && hour >= 22) give("nightowl");
    if (FR.CONTENT.path.some(function (id) { return lessonStats(id).done; })) give("lesson1");
    if (FR.CONTENT.unit("alltag").lessons.every(function (l) { return lessonStats(l.id).started; })) give("unitAlltag");
    if (FR.CONTENT.unit("reise").lessons.every(function (l) { return lessonStats(l.id).started; })) give("unitReise");

    if (gained.length) save();
    return gained;
  }

  /* ---------- Sicherung ---------- */
  function exportJson() { return JSON.stringify(state, null, 2); }
  function importJson(text) {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || !parsed.cards) throw new Error("Das sieht nicht nach einer Sicherung dieser App aus.");
    state = Object.assign(fresh(), parsed);
    saveNow();
  }
  function reset() { state = fresh(); saveNow(); }

  return {
    load: load, save: save, saveNow: saveNow,
    get state() { return state; },
    card: card, rawCard: rawCard, counts: counts,
    lessonStats: lessonStats, unitStats: unitStats, currentLessonId: currentLessonId,
    levelInfo: levelInfo, addXp: addXp, titleFor: titleFor,
    today: today, dayKey: dayKey, shiftDay: shiftDay, day: day,
    touchDay: touchDay, streakValue: streakValue,
    registerAnswer: registerAnswer, addSeconds: addSeconds, goalProgress: goalProgress,
    checkBadges: checkBadges, BADGES: BADGES,
    exportJson: exportJson, importJson: importJson, reset: reset
  };
})();
