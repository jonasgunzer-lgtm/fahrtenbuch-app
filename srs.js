/* Spaced-Repetition-Motor (Variante von SM-2).
   Bewertungen: 0 = nochmal, 1 = schwer, 2 = gut, 3 = leicht */
window.FR = window.FR || {};
FR.SRS = (function () {
  const MIN = 60 * 1000;
  const DAY = 24 * 60 * MIN;
  const LEARN_STEPS = [1, 10];          // Minuten fuer neue Karten
  const MAX_INTERVAL = 365;             // Tage
  const EASE_MIN = 1.3, EASE_MAX = 2.8;

  function newCard() {
    return { s: "new", due: 0, ivl: 0, ease: 2.5, reps: 0, lapses: 0, step: 0, correct: 0, wrong: 0, last: 0 };
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // Streuung, damit nicht alle Karten am selben Tag zusammenfallen
  function fuzz(days) {
    if (days < 3) return days;
    const spread = Math.max(1, Math.round(days * 0.05));
    return days + (Math.floor(Math.random() * (2 * spread + 1)) - spread);
  }

  function answer(c, grade, now) {
    now = now || Date.now();
    c.reps += 1;
    c.last = now;
    if (grade === 0) c.wrong += 1; else c.correct += 1;

    if (c.s === "new" || c.s === "learn") {
      if (grade === 0) {
        c.s = "learn"; c.step = 0; c.due = now + LEARN_STEPS[0] * MIN;
      } else if (grade === 1) {
        c.s = "learn"; c.due = now + LEARN_STEPS[Math.min(c.step, LEARN_STEPS.length - 1)] * MIN;
      } else if (grade === 2) {
        c.step += 1;
        if (c.step >= LEARN_STEPS.length) { graduate(c, 1, now); }
        else { c.s = "learn"; c.due = now + LEARN_STEPS[c.step] * MIN; }
      } else {
        graduate(c, 3, now);
      }
      return c;
    }

    // Wiederholungskarte
    if (grade === 0) {
      c.lapses += 1;
      c.ease = clamp(c.ease - 0.2, EASE_MIN, EASE_MAX);
      c.ivl = Math.max(1, Math.round(c.ivl * 0.4));
      c.s = "learn"; c.step = 0; c.due = now + LEARN_STEPS[0] * MIN;
      return c;
    }
    if (grade === 1) {
      c.ease = clamp(c.ease - 0.15, EASE_MIN, EASE_MAX);
      c.ivl = clamp(Math.round(Math.max(c.ivl + 1, c.ivl * 1.2)), 1, MAX_INTERVAL);
    } else if (grade === 2) {
      c.ivl = clamp(Math.round(Math.max(c.ivl + 1, c.ivl * c.ease)), 1, MAX_INTERVAL);
    } else {
      c.ease = clamp(c.ease + 0.15, EASE_MIN, EASE_MAX);
      c.ivl = clamp(Math.round(Math.max(c.ivl + 2, c.ivl * c.ease * 1.3)), 2, MAX_INTERVAL);
    }
    c.due = now + fuzz(c.ivl) * DAY;
    return c;
  }

  function graduate(c, ivl, now) {
    c.s = "rev"; c.step = 0; c.ivl = ivl; c.due = now + ivl * DAY;
  }

  // Wie sicher sitzt die Karte? 0 = neu ... 5 = gemeistert
  function strength(c) {
    if (!c || c.s === "new") return 0;
    if (c.s === "learn") return 1;
    if (c.ivl < 4) return 2;
    if (c.ivl < 10) return 3;
    if (c.ivl < 21) return 4;
    return 5;
  }

  function nextLabel(c, grade) {
    const probe = JSON.parse(JSON.stringify(c));
    answer(probe, grade, Date.now());
    const ms = probe.due - Date.now();
    if (ms < 60 * MIN) return Math.max(1, Math.round(ms / MIN)) + " Min";
    if (ms < DAY) return Math.round(ms / (60 * MIN)) + " Std";
    const d = Math.round(ms / DAY);
    if (d < 31) return d + (d === 1 ? " Tag" : " Tage");
    return Math.round(d / 30) + " Mon";
  }

  return { newCard: newCard, answer: answer, strength: strength, nextLabel: nextLabel, DAY: DAY, MIN: MIN };
})();
