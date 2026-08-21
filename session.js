/* Die Lernsession: baut die Warteschlange und steuert die drei Uebungstypen. */
window.FR = window.FR || {};
FR.Session = (function () {
  const XP = { 0: 2, 1: 6, 2: 10, 3: 12 };
  const NEW_BONUS = 5, TYPE_BONUS = 3;
  const MAX_STEPS = 140;

  let queue = [], current = null, opts = {}, active = false;
  let planned = 0, done = 0, correctCount = 0, wrongCount = 0, newCount = 0, sessionXp = 0;
  let startedAt = 0, revealed = false, answeredThisStep = false;
  let onFinish = null;

  const $ = function (sel) { return document.querySelector(sel); };

  /* ---------- Aufbau ---------- */
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function enabledKinds() {
    const s = FR.Store.state.settings;
    const kinds = ["recall"];
    if (s.typing) kinds.push("type");
    if (s.listening) kinds.push("listen");
    return kinds;
  }

  function pickKind(cardId) {
    const card = FR.CONTENT.cards[cardId];
    const prog = FR.Store.card(cardId);
    let kinds = enabledKinds().filter(function (k) { return k !== "type" || card.typable; });
    if (kinds.indexOf("listen") >= 0 && !FR.TTS.available) kinds = kinds.filter(function (k) { return k !== "listen"; });
    if (!kinds.length) kinds = ["recall"];
    return kinds[prog.reps % kinds.length];
  }

  function dueIds() {
    const now = Date.now();
    return FR.CONTENT.cardOrder
      .filter(function (id) { const c = FR.Store.rawCard(id); return c && c.s !== "new" && c.due <= now; })
      .sort(function (a, b) { return FR.Store.rawCard(a).due - FR.Store.rawCard(b).due; });
  }

  function freshIdsFrom(lessonIds, limit) {
    const out = [];
    for (const lid of lessonIds) {
      for (const id of FR.CONTENT.lessons[lid].cardIds) {
        const c = FR.Store.rawCard(id);
        if (!c || c.reps === 0) out.push(id);
        if (out.length >= limit) return out;
      }
    }
    return out;
  }

  function build(o) {
    opts = o || {};
    const st = FR.Store.state;
    let due, fresh;

    if (opts.mode === "lesson") {
      const lesson = FR.CONTENT.lessons[opts.lessonId];
      due = lesson.cardIds.filter(function (id) { const c = FR.Store.rawCard(id); return c && c.s !== "new" && c.due <= Date.now(); });
      fresh = lesson.cardIds.filter(function (id) { const c = FR.Store.rawCard(id); return !c || c.reps === 0; }).slice(0, opts.newLimit || 12);
      if (!due.length && !fresh.length) {
        // alles frisch gelernt: die schwaechsten Karten der Lektion wiederholen
        due = lesson.cardIds.slice().sort(function (a, b) {
          return FR.SRS.strength(FR.Store.card(a)) - FR.SRS.strength(FR.Store.card(b));
        }).slice(0, 10);
      }
    } else {
      due = dueIds().slice(0, 80);
      const path = FR.CONTENT.path;
      const startIdx = Math.max(0, path.indexOf(FR.Store.currentLessonId()));
      fresh = freshIdsFrom(path.slice(startIdx), st.newPerSession);
      // Wenn wenig zu tun ist, mit den wackeligsten Karten auffuellen
      if (due.length + fresh.length < Math.min(st.goal, 10)) {
        const extra = FR.CONTENT.cardOrder
          .filter(function (id) { const c = FR.Store.rawCard(id); return c && c.reps > 0 && due.indexOf(id) < 0; })
          .sort(function (a, b) { return FR.SRS.strength(FR.Store.rawCard(a)) - FR.SRS.strength(FR.Store.rawCard(b)); })
          .slice(0, Math.min(st.goal, 10) - due.length - fresh.length);
        due = due.concat(extra);
      }
    }

    const items = shuffle(due.map(function (id) { return { id: id, kind: pickKind(id) }; }));
    fresh.forEach(function (id, i) {
      items.splice(Math.min(items.length, i * 3 + 1), 0, { id: id, kind: "intro", isNew: true });
    });
    return items;
  }

  /* ---------- Ablauf ---------- */
  function start(o) {
    queue = build(o);
    onFinish = (o && o.onFinish) || null;
    planned = queue.length;
    done = correctCount = wrongCount = newCount = sessionXp = 0;
    startedAt = Date.now();
    active = true;
    FR.TTS.warmup();
    document.body.classList.add("in-session");
    $("#session").classList.add("open");
    if (!queue.length) { finish(true); return; }
    nextStep();
  }

  function nextStep() {
    revealed = false; answeredThisStep = false;
    if (!queue.length || done >= MAX_STEPS) { finish(); return; }
    current = queue.shift();
    render();
    updateBar();
  }

  function requeue(step, offsetMin, offsetMax) {
    const pos = Math.min(queue.length, offsetMin + Math.floor(Math.random() * (offsetMax - offsetMin + 1)));
    queue.splice(pos, 0, step);
  }

  function finish(empty) {
    active = false;
    const seconds = Math.round((Date.now() - startedAt) / 1000);
    const st = FR.Store.state;
    if (!empty && done > 0) {
      st.totals.sessions += 1;
      FR.Store.addSeconds(Math.min(seconds, 60 * 60));
      FR.Store.touchDay();
      const goal = FR.Store.goalProgress();
      if (goal.hit && st._lastGoalDay !== FR.Store.today()) {
        st._lastGoalDay = FR.Store.today();
        st.totals.goalsHit += 1;
      }
    }
    const perfect = done >= 10 && wrongCount === 0;
    const gained = FR.Store.checkBadges({ sessionEnded: !empty && done > 0, perfectSession: perfect });
    FR.Store.saveNow();
    document.body.classList.remove("in-session");
    $("#session").classList.remove("open");
    if (onFinish) onFinish({ done: done, correct: correctCount, wrong: wrongCount, newCount: newCount, xp: sessionXp, seconds: seconds, badges: gained, empty: !!empty, perfect: perfect });
  }

  function abort() { if (active) finish(); else { document.body.classList.remove("in-session"); $("#session").classList.remove("open"); } }

  function updateBar() {
    const total = done + queue.length + 1;
    const pct = Math.round((done / Math.max(total, 1)) * 100);
    $("#s-progress").style.width = pct + "%";
    $("#s-count").textContent = done + " / " + total;
  }

  /* ---------- Bewerten ---------- */
  function grade(g, meta) {
    if (answeredThisStep) return;
    answeredThisStep = true;
    meta = meta || {};
    const id = current.id;
    const wasNew = !FR.Store.rawCard(id) || FR.Store.card(id).s === "new";
    const prog = FR.Store.card(id);
    FR.SRS.answer(prog, g);

    let xp = XP[g];
    if (wasNew) { xp += NEW_BONUS; newCount += 1; }
    if (meta.typed && g >= 2) xp += TYPE_BONUS;
    const newLevel = FR.Store.addXp(xp);
    sessionXp += xp;
    FR.Store.registerAnswer({ xp: xp, correct: g >= 2, isNew: wasNew, typed: !!meta.typed });

    done += 1;
    if (g >= 2) correctCount += 1; else wrongCount += 1;

    flyXp(xp);
    if (newLevel) FR.UI.celebrate("Level " + newLevel + " – " + FR.Store.titleFor(newLevel) + " !");

    // Karte in der Lernphase kommt in derselben Session nochmal dran
    if (prog.s === "learn" && prog.due <= Date.now() + 12 * 60 * 1000 && queue.length < MAX_STEPS) {
      const kind = (prog.reps >= 2 && FR.CONTENT.cards[id].typable && FR.Store.state.settings.typing) ? "type" : "recall";
      requeue({ id: id, kind: kind }, g === 0 ? 2 : 5, g === 0 ? 4 : 9);
    }
    setTimeout(nextStep, g === 0 ? 260 : 160);
  }

  function flyXp(n) {
    const el = document.createElement("div");
    el.className = "xp-fly";
    el.textContent = "+" + n + " XP";
    $("#session").appendChild(el);
    setTimeout(function () { el.remove(); }, 900);
  }

  /* ---------- Eingabe pruefen ---------- */
  function norm(s) {
    return String(s).toLowerCase().trim()
      .replace(/[‘’ʼ]/g, "'")
      .replace(/ /g, " ")
      .replace(/\s+/g, " ")
      .replace(/\s*'\s*/g, "'")
      .replace(/[.!?]+$/, "");
  }
  function deacc(s) {
    return norm(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/g, "oe").replace(/æ/g, "ae");
  }
  function checkAnswer(input, card) {
    const targets = [card.fr].concat(card.alt || []);
    const inN = norm(input);
    if (!inN) return "empty";
    if (targets.some(function (t) { return norm(t) === inN; })) return "exact";
    if (targets.some(function (t) { return deacc(t) === deacc(input); })) return "accent";
    return "wrong";
  }

  /* ---------- Darstellung ---------- */
  function speak(card, slow) { FR.TTS.speak(card.ex && !slow ? card.fr : card.fr, { slow: slow }); }

  function audioBtn(text, label) {
    return '<button class="icon-btn speak" data-speak="' + FR.UI.attr(text) + '" aria-label="' + (label || "Vorlesen") + '">' +
      '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 2v2a8 8 0 0 1 0 16v2a10 10 0 0 0 0-20z"/></svg></button>';
  }

  function noteHtml(card) {
    return card.note ? '<p class="card-note"><span class="emo">💡</span>' + FR.UI.esc(card.note) + "</p>" : "";
  }
  function exampleHtml(card) {
    return '<div class="example"><p class="ex-fr">' + FR.UI.esc(card.ex) + " " + audioBtn(card.ex, "Beispielsatz vorlesen") +
      '</p><p class="ex-de">' + FR.UI.esc(card.exDe) + "</p></div>";
  }
  function gradeBar(prog) {
    const labels = [["Nochmal", 0, "g0"], ["Schwer", 1, "g1"], ["Gut", 2, "g2"], ["Leicht", 3, "g3"]];
    return '<div class="grades">' + labels.map(function (l) {
      return '<button class="grade ' + l[2] + '" data-grade="' + l[1] + '"><span>' + l[0] + "</span><em>" + FR.SRS.nextLabel(prog, l[1]) + "</em></button>";
    }).join("") + "</div>";
  }

  function render() {
    const card = FR.CONTENT.cards[current.id];
    const prog = FR.Store.card(current.id);
    const lesson = FR.CONTENT.lessons[card.lessonId];
    const body = $("#s-body");
    const foot = $("#s-foot");
    $("#s-lesson").textContent = lesson.title;
    const strength = FR.SRS.strength(prog);
    $("#s-strength").innerHTML = '<span class="dots">' + [0, 1, 2, 3, 4].map(function (i) {
      return '<i class="' + (i < strength ? "on" : "") + '"></i>';
    }).join("") + "</span>";

    if (current.kind === "intro") return renderIntro(card, prog, body, foot);
    if (current.kind === "type") return renderType(card, prog, body, foot);
    if (current.kind === "listen") return renderListen(card, prog, body, foot);
    return renderRecall(card, prog, body, foot);
  }

  function renderIntro(card, prog, body, foot) {
    body.innerHTML =
      '<div class="card intro">' +
        '<div class="tag tag-new">Neues Wort</div>' +
        '<h2 class="fr-word">' + FR.UI.esc(card.fr) + " " + audioBtn(card.fr) + "</h2>" +
        '<p class="de-word">' + FR.UI.esc(card.de) + "</p>" +
        exampleHtml(card) + noteHtml(card) +
      "</div>";
    foot.innerHTML = '<button class="btn ghost small" data-act="speak-slow" data-speak="' + FR.UI.attr(card.fr) + '"><span class="emo">🐢</span>Langsam anhören</button>' +
      '<button class="btn primary big" data-act="intro-next">Verstanden – weiter</button>';
    if (FR.Store.state.settings.autoplay) setTimeout(function () { FR.TTS.speak(card.fr); }, 260);
  }

  function renderRecall(card, prog, body, foot) {
    body.innerHTML =
      '<div class="card">' +
        '<div class="tag">Was heißt das?</div>' +
        '<h2 class="fr-word">' + FR.UI.esc(card.fr) + " " + audioBtn(card.fr) + "</h2>" +
        '<div class="reveal hidden" id="reveal">' +
          '<p class="de-word">' + FR.UI.esc(card.de) + "</p>" + exampleHtml(card) + noteHtml(card) +
        "</div>" +
      "</div>";
    foot.innerHTML = '<button class="btn primary big" data-act="reveal">Lösung zeigen</button>';
    if (FR.Store.state.settings.autoplay) setTimeout(function () { FR.TTS.speak(card.fr); }, 200);
  }

  function renderListen(card, prog, body, foot) {
    body.innerHTML =
      '<div class="card listen">' +
        '<div class="tag tag-listen">Hören</div>' +
        '<button class="big-speaker" data-speak="' + FR.UI.attr(card.fr) + '" aria-label="Nochmal anhören">' +
          '<svg viewBox="0 0 24 24" width="46" height="46"><path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 2v2a8 8 0 0 1 0 16v2a10 10 0 0 0 0-20z"/></svg>' +
        "</button>" +
        '<p class="hint-line">Tippe auf den Lautsprecher, um es nochmal zu hören.</p>' +
        '<div class="reveal hidden" id="reveal">' +
          '<h2 class="fr-word small">' + FR.UI.esc(card.fr) + "</h2>" +
          '<p class="de-word">' + FR.UI.esc(card.de) + "</p>" + exampleHtml(card) +
        "</div>" +
      "</div>";
    foot.innerHTML = '<button class="btn ghost small" data-act="speak-slow" data-speak="' + FR.UI.attr(card.fr) + '"><span class="emo">🐢</span>Langsam</button>' +
      '<button class="btn primary big" data-act="reveal">Lösung zeigen</button>';
    setTimeout(function () { FR.TTS.speak(card.fr); }, 300);
  }

  function renderType(card, prog, body, foot) {
    const accents = ["é", "è", "ê", "à", "ç", "ù", "ô", "î", "û", "œ"];
    body.innerHTML =
      '<div class="card">' +
        '<div class="tag tag-type">Schreiben</div>' +
        '<p class="de-word big">' + FR.UI.esc(card.de) + "</p>" +
        '<p class="hint-line">Wie heißt das auf Französisch?</p>' +
        '<input id="type-input" class="type-input" type="text" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" inputmode="text" placeholder="…" />' +
        '<div class="accents">' + accents.map(function (a) { return '<button class="acc" data-acc="' + a + '">' + a + "</button>"; }).join("") + "</div>" +
        '<div class="feedback" id="feedback"></div>' +
      "</div>";
    foot.innerHTML = '<button class="btn ghost small" data-act="dontknow">Weiß ich nicht</button>' +
      '<button class="btn primary big" data-act="check">Prüfen</button>';
    setTimeout(function () { const i = document.getElementById("type-input"); if (i) i.focus(); }, 120);
  }

  function doReveal() {
    if (revealed) return;
    revealed = true;
    const r = document.getElementById("reveal");
    if (r) r.classList.remove("hidden");
    $("#s-foot").innerHTML = gradeBar(FR.Store.card(current.id));
  }

  function doCheck() {
    const input = document.getElementById("type-input");
    if (!input) return;
    const card = FR.CONTENT.cards[current.id];
    const res = checkAnswer(input.value, card);
    if (res === "empty") { input.focus(); return; }
    const fb = document.getElementById("feedback");
    input.blur();
    input.disabled = true;
    if (res === "exact" || res === "accent") {
      input.classList.add("ok");
      fb.className = "feedback ok";
      fb.innerHTML = (res === "accent"
        ? "<strong>Fast perfekt – Akzente fehlen:</strong> " + FR.UI.esc(card.fr)
        : "<strong>Richtig!</strong> " + FR.UI.esc(card.fr)) + exampleHtml(card) + noteHtml(card);
      FR.TTS.speak(card.fr);
      $("#s-foot").innerHTML = '<button class="btn ghost small" data-act="grade-easy">War leicht</button>' +
        '<button class="btn success big" data-act="continue" data-grade="2">Weiter</button>';
    } else {
      input.classList.add("bad");
      fb.className = "feedback bad";
      fb.innerHTML = "<strong>Richtig wäre:</strong> " + FR.UI.esc(card.fr) + exampleHtml(card) + noteHtml(card);
      FR.TTS.speak(card.fr);
      $("#s-foot").innerHTML = '<button class="btn danger big" data-act="continue" data-grade="0">Weiter</button>';
    }
    answeredThisStep = false;
  }

  function doDontKnow() {
    const card = FR.CONTENT.cards[current.id];
    const input = document.getElementById("type-input");
    if (input) { input.value = card.fr; input.disabled = true; }
    const fb = document.getElementById("feedback");
    fb.className = "feedback bad";
    fb.innerHTML = "<strong>Die Lösung:</strong> " + FR.UI.esc(card.fr) + exampleHtml(card) + noteHtml(card);
    FR.TTS.speak(card.fr);
    $("#s-foot").innerHTML = '<button class="btn danger big" data-act="continue" data-grade="0">Weiter</button>';
  }

  /* ---------- Klicks in der Session ---------- */
  function bind() {
    $("#session").addEventListener("click", function (e) {
      const sp = e.target.closest("[data-speak]");
      if (sp) {
        const slow = sp.dataset.act === "speak-slow" || sp.classList.contains("slow");
        FR.TTS.speak(sp.dataset.speak, { slow: slow });
        if (sp.dataset.act !== "speak-slow") return;
      }
      const acc = e.target.closest("[data-acc]");
      if (acc) {
        const i = document.getElementById("type-input");
        if (i && !i.disabled) { i.value += acc.dataset.acc; i.focus(); }
        return;
      }
      const g = e.target.closest("[data-grade]");
      if (g && !g.dataset.act) { grade(Number(g.dataset.grade)); return; }

      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const act = btn.dataset.act;
      if (act === "intro-next") {
        // Direkt danach nochmal abfragen, damit das Wort haengen bleibt
        requeue({ id: current.id, kind: "recall" }, 1, 2);
        nextStep();
      } else if (act === "reveal") doReveal();
      else if (act === "check") doCheck();
      else if (act === "dontknow") doDontKnow();
      else if (act === "continue") grade(Number(btn.dataset.grade), { typed: true });
      else if (act === "grade-easy") grade(3, { typed: true });
      else if (act === "close") {
        if (done === 0 || confirm("Session beenden? Dein Fortschritt bis hierhin ist gespeichert.")) abort();
      }
    });

    $("#session").addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const input = document.getElementById("type-input");
        if (input && !input.disabled) { e.preventDefault(); doCheck(); return; }
        const cont = $("#s-foot [data-act='continue']");
        if (cont) { e.preventDefault(); cont.click(); }
      }
    });
  }

  return { start: start, bind: bind, abort: abort, checkAnswer: checkAnswer, isActive: function () { return active; } };
})();
