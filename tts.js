/* Franzoesische Sprachausgabe ueber die Stimmen des Geraets (offline verfuegbar). */
window.FR = window.FR || {};
FR.TTS = (function () {
  let voice = null, warmedUp = false, available = false;

  function pickVoice() {
    if (!("speechSynthesis" in window)) return null;
    const voices = speechSynthesis.getVoices() || [];
    const fr = voices.filter(function (v) { return /^fr/i.test(v.lang); });
    if (!fr.length) return null;
    // bevorzugt eine hochwertige fr-FR-Stimme
    const preferred = ["Thomas", "Amélie", "Audrey", "Marie", "Aurelie", "Google français"];
    for (const name of preferred) {
      const hit = fr.find(function (v) { return v.name.indexOf(name) >= 0; });
      if (hit) return hit;
    }
    return fr.find(function (v) { return v.lang === "fr-FR"; }) || fr[0];
  }

  function refresh() {
    voice = pickVoice();
    available = !!voice;
    return available;
  }

  function init() {
    if (!("speechSynthesis" in window)) return;
    refresh();
    speechSynthesis.onvoiceschanged = refresh;
  }

  // iOS gibt erst nach einer echten Nutzerinteraktion Ton frei
  function warmup() {
    if (warmedUp || !("speechSynthesis" in window)) return;
    warmedUp = true;
    refresh();
    try {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0; u.lang = "fr-FR";
      speechSynthesis.speak(u);
    } catch (e) { /* egal */ }
  }

  function speak(text, opts) {
    if (!("speechSynthesis" in window) || !text) return false;
    opts = opts || {};
    if (!voice) refresh();
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      u.lang = "fr-FR";
      if (voice) u.voice = voice;
      u.rate = opts.slow ? 0.62 : 0.88;
      u.pitch = 1;
      speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  }

  return {
    init: init, warmup: warmup, speak: speak, refresh: refresh,
    get available() { return available; },
    voiceName: function () { return voice ? voice.name + " (" + voice.lang + ")" : "keine französische Stimme gefunden"; }
  };
})();
