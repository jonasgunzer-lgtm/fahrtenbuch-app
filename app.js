/* Bildschirme, Navigation und Verdrahtung der App. */
window.FR = window.FR || {};
FR.App = (function () {
  const $ = function (s) { return document.querySelector(s); };
  let view = "home", lessonId = null, openUnit = null;

  /* ---------- Navigation ---------- */
  function go(v, arg) {
    if (v === "lesson") lessonId = arg;
    view = v;
    document.querySelectorAll(".view").forEach(function (el) { el.classList.toggle("active", el.id === "view-" + v); });
    document.querySelectorAll("#tabbar button").forEach(function (b) {
      b.classList.toggle("on", b.dataset.nav === v || (v === "lesson" && b.dataset.nav === "themen"));
    });
    render();
    window.scrollTo(0, 0);
    document.getElementById("views").scrollTop = 0;
  }

  function render() {
    if (view === "home") renderHome();
    else if (view === "themen") renderThemen();
    else if (view === "stats") renderStats();
    else if (view === "mehr") renderMehr();
    else if (view === "lesson") renderLesson();
  }

  /* ---------- Vorschau der Tagessession ---------- */
  function preview() {
    const c = FR.Store.counts();
    const st = FR.Store.state;
    const path = FR.CONTENT.path;
    const start = Math.max(0, path.indexOf(FR.Store.currentLessonId()));
    let fresh = 0;
    for (let i = start; i < path.length && fresh < st.newPerSession; i++) {
      for (const id of FR.CONTENT.lessons[path[i]].cardIds) {
        const c = FR.Store.rawCard(id);
        if (!c || c.reps === 0) { fresh++; if (fresh >= st.newPerSession) break; }
      }
    }
    return { due: c.due, fresh: fresh, total: c.due + fresh };
  }

  /* ---------- Start ---------- */
  function renderHome() {
    const lvl = FR.Store.levelInfo();
    const c = FR.Store.counts();
    const goal = FR.Store.goalProgress();
    const streak = FR.Store.streakValue();
    const p = preview();
    const name = (FR.Store.state.settings.name || "").trim();
    const hour = new Date().getHours();
    const hello = hour < 18 ? "Bonjour" : "Bonsoir";
    const lid = FR.Store.currentLessonId();
    const lesson = FR.CONTENT.lessons[lid];
    const ls = FR.Store.lessonStats(lid);
    const unit = FR.CONTENT.unit(lesson.unitId);
    const earned = FR.Store.state.badges.slice(-4).map(function (id) {
      return FR.Store.BADGES.find(function (b) { return b.id === id; });
    }).filter(Boolean);

    $("#view-home").innerHTML =
      '<header class="hero">' +
        '<div class="hero-top">' +
          '<div><p class="hello">' + hello + (name ? ", " + FR.UI.esc(name) : "") + " !</p>" +
          '<p class="hero-sub">' + (p.total ? "Heute warten " + FR.UI.plural(p.total, "Karte", "Karten") + " auf dich." : "Alles erledigt – du kannst trotzdem üben.") + "</p></div>" +
          '<div class="streak' + (streak > 0 ? " hot" : "") + '"><span>🔥</span><b>' + streak + "</b></div>" +
        "</div>" +
        '<div class="hero-level">' +
          FR.UI.ring(lvl.pct, 78, 8, "level-ring", '<b>' + lvl.level + "</b><span>Level</span>") +
          '<div class="level-meta">' +
            "<p class=\"title\">" + FR.UI.esc(lvl.title) + "</p>" +
            "<p class=\"xp\">" + lvl.xp + " XP · noch " + lvl.toNext + " bis Level " + (lvl.level + 1) + "</p>" +
            FR.UI.bar(lvl.pct, "light") +
          "</div>" +
        "</div>" +
      "</header>" +

      '<section class="panel goal-panel">' +
        '<div class="goal-head"><span>Tagesziel</span><b>' + goal.done + " / " + goal.goal + " Karten</b></div>" +
        FR.UI.bar(goal.pct, goal.hit ? "done" : "") +
        (goal.hit ? '<p class="goal-hit"><span class="emo">✅</span>Tagesziel geschafft – schön, dass du dabei bleibst.</p>' : "") +
      "</section>" +

      '<button class="cta" data-act="start-daily">' +
        "<span class=\"cta-main\">Session starten</span>" +
        '<span class="cta-sub">' + p.due + " zur Wiederholung · " + p.fresh + " neu · ca. " + Math.max(3, Math.round(p.due * 0.25 + p.fresh * 0.9)) + " Min</span>" +
      "</button>" +

      '<section class="tiles">' +
        tile("📚", c.learned, "gelernt") +
        tile("⏰", c.due, "fällig") +
        tile("💎", c.mastered, "gemeistert") +
      "</section>" +

      '<section class="panel path" data-lesson="' + lid + '">' +
        '<p class="panel-label">Weiter im Lernpfad</p>' +
        '<div class="path-row">' +
          '<div class="path-emoji" style="--accent:' + unit.accent + '">' + unit.emoji + "</div>" +
          "<div class=\"path-text\"><b>" + FR.UI.esc(lesson.title) + "</b><span>" + FR.UI.esc(lesson.subtitle) + "</span>" +
          FR.UI.bar(ls.pct) + "</div>" +
          '<div class="path-pct">' + ls.pct + "%</div>" +
        "</div>" +
      "</section>" +

      (earned.length ? '<section class="panel"><p class="panel-label">Zuletzt verdient</p><div class="badge-row">' +
        earned.map(function (b) { return '<div class="badge-mini" title="' + FR.UI.attr(b.desc) + '"><span>' + b.emoji + "</span><em>" + FR.UI.esc(b.name) + "</em></div>"; }).join("") +
        '</div></section>' : "") +

      '<p class="footnote">Alles läuft offline. Dein Fortschritt bleibt auf diesem Gerät.</p>';
  }

  function tile(emoji, value, label) {
    return '<div class="tile"><span class="tile-emoji">' + emoji + '</span><b>' + value + "</b><em>" + label + "</em></div>";
  }

  /* ---------- Themenwelten ---------- */
  function renderThemen() {
    const html = FR.CONTENT.units.map(function (unit) {
      const us = FR.Store.unitStats(unit.id);
      const open = openUnit === unit.id;
      return '<section class="panel unit' + (open ? " open" : "") + '" style="--accent:' + unit.accent + '">' +
        '<button class="unit-head" data-unit="' + unit.id + '">' +
          '<div class="unit-emoji">' + unit.emoji + "</div>" +
          "<div class=\"unit-text\"><b>" + FR.UI.esc(unit.title) + "</b><span>" + unit.lessons.length + " Lektionen · " + us.total + " Vokabeln</span>" +
          FR.UI.bar(us.pct) + "</div>" +
          '<div class="unit-pct">' + us.pct + "%<i class=\"chev\">›</i></div>" +
        "</button>" +
        '<div class="lesson-list">' + unit.lessons.map(function (l) {
          const s = FR.Store.lessonStats(l.id);
          return '<button class="lesson-row" data-lesson="' + l.id + '">' +
            FR.UI.ring(s.pct, 40, 5, "mini", "<b>" + (s.seen ? s.pct + "%" : "") + "</b>") +
            "<div class=\"lesson-text\"><b>" + FR.UI.esc(l.title) + "</b><span>" + FR.UI.esc(l.subtitle) + "</span></div>" +
            '<div class="lesson-meta">' + (s.due ? '<em class="due">' + s.due + " fällig</em>" : "") +
            "<em>" + s.seen + "/" + s.total + "</em></div>" +
            "</button>";
        }).join("") + "</div>" +
      "</section>";
    }).join("");
    $("#view-themen").innerHTML = '<h1 class="screen-title">Themenwelten</h1>' + html +
      '<p class="footnote">Tippe eine Lektion an, um sie anzusehen oder gezielt zu üben.</p>';
  }

  /* ---------- Lektionsansicht ---------- */
  function renderLesson() {
    const l = FR.CONTENT.lessons[lessonId];
    const s = FR.Store.lessonStats(lessonId);
    const unit = FR.CONTENT.unit(l.unitId);
    $("#view-lesson").innerHTML =
      '<button class="back" data-nav="themen">‹ Themenwelten</button>' +
      '<header class="lesson-hero" style="--accent:' + unit.accent + '">' +
        '<div class="lesson-hero-emoji">' + unit.emoji + "</div>" +
        "<h1>" + FR.UI.esc(l.title) + "</h1>" +
        "<p>" + FR.UI.esc(l.subtitle) + "</p>" +
        '<div class="lesson-hero-bar">' + FR.UI.bar(s.pct, "light") + "<span>" + s.pct + "% sitzt · " + s.seen + "/" + s.total + " begonnen</span></div>" +
      "</header>" +
      '<section class="panel tipbox"><p class="tip-title">Le petit plus · ' + FR.UI.esc(l.tip.title) + "</p><p>" + FR.UI.esc(l.tip.text) + "</p></section>" +
      '<button class="cta alt" data-act="start-lesson" data-lesson="' + l.id + '">' +
        '<span class="cta-main">Diese Lektion üben</span>' +
        '<span class="cta-sub">' + (s.seen < s.total ? (s.total - s.seen) + " neue Wörter" : "Wiederholung") + (s.due ? " · " + s.due + " fällig" : "") + "</span>" +
      "</button>" +
      '<section class="panel"><p class="panel-label">Alle Vokabeln</p><ul class="vocab">' +
        l.cardIds.map(function (id) {
          const card = FR.CONTENT.cards[id];
          const prog = FR.Store.rawCard(id);
          return "<li>" +
            '<button class="icon-btn" data-speak="' + FR.UI.attr(card.fr) + '" aria-label="Vorlesen">🔊</button>' +
            "<div class=\"vocab-text\"><b>" + FR.UI.esc(card.fr) + "</b><span>" + FR.UI.esc(card.de) + "</span></div>" +
            FR.UI.dots(FR.SRS.strength(prog)) +
          "</li>";
        }).join("") +
      "</ul></section>";
  }

  /* ---------- Statistik ---------- */
  function renderStats() {
    const st = FR.Store.state;
    const c = FR.Store.counts();
    const lvl = FR.Store.levelInfo();
    const acc = st.totals.answers ? Math.round((st.totals.correct / st.totals.answers) * 100) : 0;
    const daysLearned = Object.keys(st.days).filter(function (k) { return st.days[k].c > 0; }).length;

    // Balken der letzten 7 Tage
    let bars = "", maxDay = Math.max(st.goal, 1);
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const key = FR.Store.shiftDay(FR.Store.today(), -i);
      const v = (st.days[key] && st.days[key].c) || 0;
      maxDay = Math.max(maxDay, v);
      last7.push({ key: key, v: v });
    }
    bars = last7.map(function (d) {
      const label = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][new Date(d.key.replace(/-/g, "/")).getDay()];
      return '<div class="wbar"><i style="height:' + Math.max(3, Math.round((d.v / maxDay) * 100)) + '%" class="' + (d.v >= st.goal ? "hit" : "") + '"></i>' +
        "<em>" + label + "</em><b>" + (d.v || "") + "</b></div>";
    }).join("");

    // Heatmap: 10 Wochen
    let cells = "";
    const todayKey = FR.Store.today();
    const dow = (new Date(todayKey.replace(/-/g, "/")).getDay() + 6) % 7; // Mo = 0
    const startOffset = 69 + dow;
    for (let col = 0; col < 10; col++) {
      cells += '<div class="hm-col">';
      for (let row = 0; row < 7; row++) {
        const idx = startOffset - (col * 7 + row);
        if (idx < 0) { cells += '<i class="hm-cell empty"></i>'; continue; }
        const key = FR.Store.shiftDay(todayKey, -idx);
        const v = (st.days[key] && st.days[key].c) || 0;
        const lvlC = v === 0 ? 0 : v < 8 ? 1 : v < 16 ? 2 : v < 30 ? 3 : 4;
        cells += '<i class="hm-cell l' + lvlC + '" title="' + key + ": " + v + ' Karten"></i>';
      }
      cells += "</div>";
    }

    const badgeGrid = FR.Store.BADGES.map(function (b) {
      const owned = st.badges.indexOf(b.id) >= 0;
      return '<div class="badge' + (owned ? " owned" : "") + '"><span>' + b.emoji + "</span><b>" + FR.UI.esc(b.name) + "</b><em>" + FR.UI.esc(b.desc) + "</em></div>";
    }).join("");

    $("#view-stats").innerHTML =
      '<h1 class="screen-title">Statistik</h1>' +
      '<section class="panel level-panel">' +
        FR.UI.ring(lvl.pct, 92, 9, "level-ring big", "<b>" + lvl.level + "</b><span>Level</span>") +
        '<div class="level-meta"><p class="title">' + FR.UI.esc(lvl.title) + "</p>" +
        "<p class=\"xp\">" + lvl.xp + " XP gesamt</p><p class=\"xp\">Noch " + lvl.toNext + " XP bis Level " + (lvl.level + 1) + "</p></div>" +
      "</section>" +
      '<section class="stat-grid">' +
        stat(c.learned, "Wörter gelernt") + stat(c.mastered, "gemeistert") +
        stat(c.fresh, "noch neu") + stat(acc + "%", "Trefferquote") +
        stat(daysLearned, "Lerntage") + stat(FR.UI.fmtTimeShort(st.totals.seconds), "Lernzeit") +
        stat(FR.Store.streakValue(), "Tage in Folge") + stat(st.best, "beste Serie") +
      "</section>" +
      '<section class="panel"><p class="panel-label">Letzte 7 Tage</p><div class="week">' + bars + "</div></section>" +
      '<section class="panel"><p class="panel-label">Die letzten 10 Wochen</p><div class="heatmap">' + cells + "</div>" +
        '<div class="hm-legend"><span>wenig</span><i class="hm-cell l1"></i><i class="hm-cell l2"></i><i class="hm-cell l3"></i><i class="hm-cell l4"></i><span>viel</span></div>' +
      "</section>" +
      '<section class="panel"><p class="panel-label">Abzeichen (' + st.badges.length + "/" + FR.Store.BADGES.length + ')</p><div class="badges">' + badgeGrid + "</div></section>";
  }

  function stat(v, label) { return '<div class="stat"><b>' + v + "</b><em>" + label + "</em></div>"; }

  /* ---------- Einstellungen ---------- */
  function renderMehr() {
    const s = FR.Store.state.settings;
    const st = FR.Store.state;
    $("#view-mehr").innerHTML =
      '<h1 class="screen-title">Einstellungen</h1>' +
      '<section class="panel"><p class="panel-label">Dein Name</p>' +
        '<input class="text-input" id="set-name" type="text" placeholder="z. B. Jonas" value="' + FR.UI.attr(s.name || "") + '" />' +
      "</section>" +
      '<section class="panel"><p class="panel-label">Tagesziel</p>' +
        '<div class="chips" data-set="goal">' + [10, 20, 30, 50].map(function (n) {
          return '<button class="chip' + (st.goal === n ? " on" : "") + '" data-value="' + n + '">' + n + " Karten</button>";
        }).join("") + "</div>" +
        '<p class="panel-label" style="margin-top:16px">Neue Wörter pro Session</p>' +
        '<div class="chips" data-set="newPerSession">' + [4, 8, 12, 20].map(function (n) {
          return '<button class="chip' + (st.newPerSession === n ? " on" : "") + '" data-value="' + n + '">' + n + "</button>";
        }).join("") + "</div>" +
      "</section>" +
      '<section class="panel"><p class="panel-label">Übungstypen</p>' +
        toggle("typing", "Schreiben (tippen)", "Aktives Abrufen – am stärksten, braucht aber beide Hände.", s.typing) +
        toggle("listening", "Hören", "Französische Sprachausgabe, danach selbst bewerten.", s.listening) +
        toggle("autoplay", "Automatisch vorlesen", "Spricht jede Karte beim Erscheinen aus.", s.autoplay) +
        '<p class="hint-small">Stimme: ' + FR.UI.esc(FR.TTS.voiceName()) + ' <button class="btn ghost tiny" data-act="test-voice">Testen</button></p>' +
      "</section>" +
      '<section class="panel"><p class="panel-label">Darstellung</p>' +
        '<div class="chips" data-set="theme">' + [["auto", "Automatisch"], ["light", "Hell"], ["dark", "Dunkel"]].map(function (t) {
          return '<button class="chip' + (s.theme === t[0] ? " on" : "") + '" data-value="' + t[0] + '">' + t[1] + "</button>";
        }).join("") + "</div>" +
      "</section>" +
      '<section class="panel"><p class="panel-label">Sicherung</p>' +
        '<p class="hint-small">Dein Fortschritt liegt nur auf diesem Gerät. Sichere ihn ab und zu.</p>' +
        '<div class="btn-row">' +
          '<button class="btn ghost" data-act="export">Sicherung speichern</button>' +
          '<button class="btn ghost" data-act="copy">Kopieren</button>' +
          '<button class="btn ghost" data-act="import">Einspielen</button>' +
        "</div>" +
        '<input type="file" id="import-file" accept="application/json,.json" hidden />' +
      "</section>" +
      '<section class="panel"><p class="panel-label">Zurücksetzen</p>' +
        '<p class="hint-small">Löscht Fortschritt, XP und Abzeichen unwiderruflich.</p>' +
        '<button class="btn danger-ghost" data-act="reset">Alles zurücksetzen</button>' +
      "</section>" +
      '<section class="panel"><p class="panel-label">Auf dem iPhone installieren</p>' +
        '<ol class="howto"><li>Diese Seite in <b>Safari</b> öffnen.</li><li>Auf <b>Teilen</b> (Quadrat mit Pfeil) tippen.</li>' +
        "<li><b>Zum Home-Bildschirm</b> wählen.</li><li>App vom Home-Bildschirm starten – ab dann läuft alles offline.</li></ol>" +
        '<p class="hint-small">Französische Stimme fehlt? Einstellungen › Bedienungshilfen › Gesprochene Inhalte › Stimmen › Französisch.</p>' +
      "</section>" +
      '<p class="footnote">' + FR.CONTENT.totalCards + " Vokabeln in " + Object.keys(FR.CONTENT.lessons).length + " Lektionen · Version 1.0</p>";
  }

  function toggle(key, title, desc, on) {
    return '<label class="switch-row"><div><b>' + title + "</b><span>" + desc + "</span></div>" +
      '<input type="checkbox" class="switch" data-toggle="' + key + '"' + (on ? " checked" : "") + " /><i class=\"switch-ui\"></i></label>";
  }

  /* ---------- Session starten & auswerten ---------- */
  function startSession(o) {
    FR.TTS.warmup();
    FR.Session.start(Object.assign({ onFinish: showResult }, o));
  }

  function showResult(r) {
    render();
    if (r.empty) {
      FR.UI.toast("Gerade gibt es nichts zu wiederholen. Wähle eine Lektion aus.");
      return;
    }
    const acc = r.done ? Math.round((r.correct / r.done) * 100) : 0;
    const goal = FR.Store.goalProgress();
    const badgeHtml = r.badges.length
      ? '<div class="result-badges"><p>Neue Abzeichen</p>' + r.badges.map(function (b) {
          return '<div class="badge-mini"><span>' + b.emoji + "</span><em>" + FR.UI.esc(b.name) + "</em></div>";
        }).join("") + "</div>"
      : "";
    FR.UI.modal(
      '<div class="result-head">' + (r.perfect ? "✨" : acc >= 80 ? "🎉" : "💪") + "</div>" +
      "<h2>" + (r.perfect ? "Sans faute !" : acc >= 80 ? "Très bien !" : "Weiter so!") + "</h2>" +
      '<div class="result-grid">' +
        '<div><b>' + r.done + "</b><em>Karten</em></div>" +
        "<div><b>" + acc + "%</b><em>richtig</em></div>" +
        "<div><b>+" + r.xp + "</b><em>XP</em></div>" +
        "<div><b>" + FR.UI.fmtTime(r.seconds) + "</b><em>Zeit</em></div>" +
      "</div>" +
      (r.newCount ? '<p class="result-note">' + FR.UI.plural(r.newCount, "neues Wort", "neue Wörter") + " kennengelernt.</p>" : "") +
      '<div class="result-goal"><span>Tagesziel</span>' + FR.UI.bar(goal.pct, goal.hit ? "done" : "") + "<b>" + goal.done + "/" + goal.goal + "</b></div>" +
      badgeHtml +
      '<div class="btn-row"><button class="btn ghost" data-act="close-modal">Fertig</button>' +
      '<button class="btn primary" data-act="again">Weiter lernen</button></div>'
    );
    if (goal.hit && r.done > 0) setTimeout(function () { FR.UI.celebrate("Tagesziel erreicht !"); }, 400);
  }

  /* ---------- Klicks ---------- */
  function bind() {
    document.addEventListener("click", function (e) {
      const sp = e.target.closest("[data-speak]");
      if (sp && !sp.closest("#session")) { FR.TTS.warmup(); FR.TTS.speak(sp.dataset.speak); return; }

      const nav = e.target.closest("[data-nav]");
      if (nav) { go(nav.dataset.nav); return; }

      const unitBtn = e.target.closest("[data-unit]");
      if (unitBtn) { openUnit = openUnit === unitBtn.dataset.unit ? null : unitBtn.dataset.unit; renderThemen(); return; }

      const les = e.target.closest("[data-lesson]");
      if (les && !les.dataset.act) { go("lesson", les.dataset.lesson); return; }

      const chip = e.target.closest(".chip");
      if (chip) {
        const group = chip.parentElement.dataset.set;
        const val = isNaN(Number(chip.dataset.value)) ? chip.dataset.value : Number(chip.dataset.value);
        if (group === "theme") { FR.Store.state.settings.theme = val; applyTheme(); }
        else FR.Store.state[group] = val;
        FR.Store.saveNow(); renderMehr(); return;
      }

      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const act = btn.dataset.act;
      if (act === "start-daily") startSession({ mode: "daily" });
      else if (act === "start-lesson") startSession({ mode: "lesson", lessonId: btn.dataset.lesson });
      else if (act === "again") { FR.UI.closeModal(); startSession({ mode: "daily" }); }
      else if (act === "close-modal") FR.UI.closeModal();
      else if (act === "test-voice") { FR.TTS.warmup(); FR.TTS.refresh(); FR.TTS.speak("Bonjour ! Je suis ta voix française."); }
      else if (act === "export") exportBackup();
      else if (act === "copy") copyBackup();
      else if (act === "import") document.getElementById("import-file").click();
      else if (act === "reset") doReset();
    });

    document.addEventListener("change", function (e) {
      const t = e.target.closest("[data-toggle]");
      if (t) {
        FR.Store.state.settings[t.dataset.toggle] = t.checked;
        FR.Store.saveNow();
        return;
      }
      if (e.target.id === "import-file" && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function () {
          try { FR.Store.importJson(reader.result); FR.UI.toast("Sicherung eingespielt.", "ok"); render(); }
          catch (err) { FR.UI.toast("Datei konnte nicht gelesen werden.", "bad"); }
        };
        reader.readAsText(e.target.files[0]);
      }
    });

    document.addEventListener("input", function (e) {
      if (e.target.id === "set-name") {
        FR.Store.state.settings.name = e.target.value.slice(0, 24);
        FR.Store.save();
      }
    });

    document.getElementById("modal").addEventListener("click", function (e) {
      if (e.target.id === "modal") FR.UI.closeModal();
    });
  }

  function exportBackup() {
    try {
      const blob = new Blob([FR.Store.exportJson()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "franzoesisch-sicherung-" + FR.Store.today() + ".json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 3000);
      FR.UI.toast("Sicherung erstellt.", "ok");
    } catch (e) { FR.UI.toast("Speichern hat nicht geklappt – nimm „Kopieren“.", "bad"); }
  }

  function copyBackup() {
    const text = FR.Store.exportJson();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { FR.UI.toast("In die Zwischenablage kopiert.", "ok"); },
        function () { FR.UI.toast("Kopieren nicht erlaubt.", "bad"); });
    } else FR.UI.toast("Kopieren wird hier nicht unterstützt.", "bad");
  }

  function doReset() {
    FR.UI.modal("<h2>Wirklich alles zurücksetzen?</h2><p class=\"result-note\">Fortschritt, XP, Serie und Abzeichen werden gelöscht. Das lässt sich nicht rückgängig machen.</p>" +
      '<div class="btn-row"><button class="btn ghost" data-act="close-modal">Abbrechen</button>' +
      '<button class="btn danger" id="confirm-reset">Ja, löschen</button></div>');
    document.getElementById("confirm-reset").addEventListener("click", function () {
      FR.Store.reset(); FR.UI.closeModal(); applyTheme(); go("home"); FR.UI.toast("Zurückgesetzt.");
    });
  }

  function applyTheme() {
    const t = FR.Store.state.settings.theme;
    document.documentElement.setAttribute("data-theme", t === "auto" ? "" : t);
  }

  function init() {
    FR.Store.load();
    FR.TTS.init();
    applyTheme();
    bind();
    FR.Session.bind();
    go("home");
    window.addEventListener("pagehide", FR.Store.saveNow);
    document.addEventListener("visibilitychange", function () { if (document.hidden) FR.Store.saveNow(); });
  }

  return { init: init, go: go, render: render };
})();

document.addEventListener("DOMContentLoaded", FR.App.init);
