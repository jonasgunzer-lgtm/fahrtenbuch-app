// ============================================================
// router.js – einfache Screen-Navigation ohne Framework
// Jeder Screen registriert eine Render-Funktion render(app, params).
// ============================================================

export const Router = {
  routes: {},      // name -> render(app, params)
  current: null,

  /** Einen Screen registrieren. */
  register(name, renderFn) {
    this.routes[name] = renderFn;
  },

  /** Einen Screen anzeigen. */
  async show(name, params = {}) {
    const render = this.routes[name];
    if (!render) {
      console.error("Unbekannter Screen:", name);
      return;
    }
    this.current = name;
    const app = document.getElementById("app");
    app.innerHTML = "";
    this._setActiveNav(name);
    await render(app, params);
    app.scrollTop = 0;
    window.scrollTo(0, 0);
  },

  /** Den passenden Navigationsknopf hervorheben. */
  _setActiveNav(name) {
    const topLevel = ["newEntry", "entries", "export", "settings"];
    const navName = topLevel.includes(name) ? name : null;
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.nav === navName);
    });
  },

  /** Titel in der Kopfzeile setzen. */
  setTitle(title) {
    document.getElementById("screen-title").textContent = title;
  },

  /** Fortschrittsanzeige setzen oder ausblenden (ohne Argumente). */
  setProgress(step, total) {
    const wrap = document.getElementById("progress");
    const text = document.getElementById("progress-text");
    const fill = document.getElementById("progress-fill");
    if (!step || !total) {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    text.textContent = `Schritt ${step} von ${total}`;
    fill.style.width = `${Math.round((step / total) * 100)}%`;
  },
};
