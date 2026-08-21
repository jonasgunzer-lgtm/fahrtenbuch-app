/* Kleine Helfer fuer Darstellung, Ringe, Meldungen und Konfetti. */
window.FR = window.FR || {};
FR.UI = (function () {
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function attr(s) { return esc(s); }

  // SVG-Fortschrittsring
  function ring(pct, size, stroke, cls, inner) {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r;
    const off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
    return '<div class="ring ' + (cls || "") + '" style="width:' + size + "px;height:" + size + 'px">' +
      '<svg viewBox="0 0 ' + size + " " + size + '" width="' + size + '" height="' + size + '">' +
        '<circle class="ring-bg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '" fill="none"/>' +
        '<circle class="ring-fg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '" fill="none" ' +
          'stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '" stroke-linecap="round" ' +
          'transform="rotate(-90 ' + size / 2 + " " + size / 2 + ')"/>' +
      "</svg>" + (inner ? '<div class="ring-inner">' + inner + "</div>" : "") + "</div>";
  }

  function bar(pct, cls) {
    return '<div class="bar ' + (cls || "") + '"><i style="width:' + Math.max(0, Math.min(100, pct)) + '%"></i></div>';
  }

  function dots(strength) {
    return '<span class="dots">' + [0, 1, 2, 3, 4].map(function (i) {
      return '<i class="' + (i < strength ? "on" : "") + '"></i>';
    }).join("") + "</span>";
  }

  let toastTimer = null;
  function toast(msg, kind) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.className = "show " + (kind || "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.className = ""; }, 2600);
  }

  function celebrate(text) {
    const host = document.getElementById("celebrate");
    host.innerHTML = '<div class="celebrate-inner"><div class="celebrate-badge">🎉</div><p>' + esc(text) + "</p></div>";
    host.classList.add("show");
    const emojis = ["🎉", "✨", "🥐", "🇫🇷", "⭐️", "🎊"];
    for (let i = 0; i < 26; i++) {
      const p = document.createElement("span");
      p.className = "confetti";
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDelay = (Math.random() * 0.4).toFixed(2) + "s";
      p.style.animationDuration = (1.4 + Math.random() * 1.1).toFixed(2) + "s";
      p.style.fontSize = (14 + Math.random() * 16).toFixed(0) + "px";
      host.appendChild(p);
    }
    setTimeout(function () { host.classList.remove("show"); host.innerHTML = ""; }, 2400);
  }

  function modal(html) {
    const m = document.getElementById("modal");
    m.innerHTML = '<div class="modal-card">' + html + "</div>";
    m.classList.add("open");
  }
  function closeModal() {
    const m = document.getElementById("modal");
    m.classList.remove("open");
    m.innerHTML = "";
  }

  function fmtTime(sec) {
    if (sec < 60) return sec + " Sek";
    const m = Math.round(sec / 60);
    if (m < 60) return m + " Min";
    const h = Math.floor(m / 60);
    return h + " Std " + (m % 60) + " Min";
  }

  // Kompakte Variante fuer die schmalen Statistik-Kacheln
  function fmtTimeShort(sec) {
    if (sec < 60) return sec + " Sek";
    const m = Math.round(sec / 60);
    if (m < 90) return m + " Min";
    return String((m / 60).toFixed(1)).replace(".", ",") + " Std";
  }

  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }

  return { esc: esc, attr: attr, ring: ring, bar: bar, dots: dots, toast: toast, celebrate: celebrate, modal: modal, closeModal: closeModal, fmtTime: fmtTime, fmtTimeShort: fmtTimeShort, plural: plural };
})();
