# Bonjour – Französisch lernen

Eine Web-App für tägliches Vokabeltraining, ausgelegt auf 15 Minuten in der Bahn.
185 Vokabeln in 12 Lektionen, Niveau A1 mit Ausbau Richtung A2. Läuft offline,
speichert alles lokal auf dem Gerät, braucht kein Konto und keinen Server.

## Auf dem Mac starten

Doppelklick auf `START.command`. Der Browser öffnet sich auf `http://localhost:8123`.
Das Terminalfenster muss offen bleiben, solange die App läuft.

Falls macOS die Datei blockiert: Rechtsklick auf `START.command` › Öffnen › Öffnen.

## Auf dem iPhone

### Schnell ausprobieren (gleiches WLAN)

1. `START.command` auf dem Mac starten.
2. IP-Adresse des Macs herausfinden: Systemeinstellungen › Netzwerk › WLAN › Details.
3. Am iPhone in Safari `http://<IP-des-Macs>:8123` öffnen, zum Beispiel
   `http://192.168.1.42:8123`.

Das funktioniert nur, solange der Mac läuft und im selben WLAN hängt. Der Offline-Modus
greift dabei noch nicht, weil Safari den Service Worker erst über HTTPS zulässt.

### Dauerhaft offline auf dem Homescreen

Dafür braucht die App eine HTTPS-Adresse. Kostenlose Wege:

- **Netlify Drop** (`app.netlify.com/drop`): den Ordner `Französisch Lernapp` ins
  Browserfenster ziehen. Ohne Anmeldung ist die Adresse nur kurz gültig, mit
  kostenlosem Konto bleibt sie bestehen.
- **GitHub Pages** oder **Cloudflare Pages**: braucht ein Konto, dafür dauerhaft.

Danach am iPhone:

1. Die HTTPS-Adresse in **Safari** öffnen (nicht Chrome – nur Safari darf auf iOS
   zum Homescreen hinzufügen).
2. Teilen-Symbol › **Zum Home-Bildschirm**.
3. Die App vom Homescreen starten. Sie lädt sich beim ersten Start komplett in den
   Gerätespeicher und funktioniert ab dann im Flugmodus und im Funkloch.

Der Lernfortschritt liegt danach im Speicher der Homescreen-App, getrennt von Safari.

### Französische Sprachausgabe

Fehlt die Stimme, unter Einstellungen › Bedienungshilfen › Gesprochene Inhalte ›
Stimmen › Französisch eine Stimme laden. In der App zeigt der Reiter „Mehr" an,
welche Stimme gerade benutzt wird, mit Testknopf daneben.

## Wie das Lernsystem arbeitet

Jede Vokabel hat einen eigenen Wiederholungsrhythmus (Spaced Repetition, Variante von
SM-2). Nach der ersten richtigen Antwort kommt sie am nächsten Tag wieder, dann nach
drei Tagen, dann nach acht, und so weiter. Ein „Nochmal" wirft sie zurück in die
Minutenschleife und verkürzt den Abstand dauerhaft.

Die vier Knöpfe unter einer Karte bedeuten:

| Knopf | Wann | Folge |
|---|---|---|
| Nochmal | keine Ahnung gehabt | in einer Minute nochmal, Abstand schrumpft |
| Schwer | mit Mühe erinnert | leicht längerer Abstand |
| Gut | gewusst | Abstand mal Schwierigkeitsfaktor |
| Leicht | sofort da | deutlich längerer Abstand |

Drei Übungstypen wechseln sich pro Karte ab: Karteikarte, Tippen (Deutsch → Französisch)
und Hören. Tippen und Hören lassen sich unter „Mehr" abschalten, etwa wenn keine
Kopfhörer dabei sind. Bei den Tippaufgaben werden fehlende Akzente als richtig gewertet
und die korrekte Schreibweise trotzdem angezeigt.

XP gibt es pro Antwort, mehr für sichere und getippte Antworten. Level 2 beginnt bei
60 XP, Level 10 bei 1980 XP. Die Serie zählt Tage in Folge mit mindestens einer
beantworteten Karte und reißt, wenn ein Tag komplett ausfällt.

## Vokabeln ergänzen

Die Inhalte stehen in `data/alltag.js` und `data/reise.js`. Eine Vokabel sieht so aus:

```js
{ fr: "la gare", de: "der Bahnhof", ex: "La gare est à dix minutes à pied.",
  exDe: "Der Bahnhof ist zehn Minuten zu Fuß entfernt.",
  note: "optionaler Hinweis", alt: ["gare"] }
```

- `fr` bei Nomen immer mit Artikel, damit das Geschlecht mitgelernt wird.
- `alt` sind zusätzlich akzeptierte Eingaben beim Tippen.
- `note` erscheint als Hinweiskasten unter der Lösung.

Eine neue Lektion braucht eine `id`, `title`, `subtitle`, einen `tip` und die
`items`-Liste. Damit sie im automatischen Lernpfad auftaucht, die `id` in
`js/content.js` in das Feld `PATH` eintragen.

Nach Änderungen an den Dateien: die App einmal mit Netz starten, dann lädt der Service
Worker die neue Fassung im Hintergrund nach. Beim übernächsten Start ist sie aktiv.
Wer nicht warten will, erhöht in `sw.js` die Zeile `const CACHE = "bonjour-v1"` auf
`v2`.

## Sicherung

Unter „Mehr" › Sicherung lässt sich der Fortschritt als JSON-Datei speichern oder in
die Zwischenablage kopieren, und über „Einspielen" wieder zurückholen. Sinnvoll vor
einem Gerätewechsel, denn die Daten liegen ausschließlich im Browserspeicher des
jeweiligen Geräts.

## Dateien

```
index.html              Grundgerüst und Skript-Reihenfolge
css/styles.css          gesamtes Design, hell und dunkel
js/content.js           baut den Index aus den Vokabeldateien, definiert den Lernpfad
js/srs.js               Wiederholungsalgorithmus
js/store.js             Fortschritt, XP, Level, Serie, Abzeichen, Sicherung
js/session.js           Warteschlange und die drei Übungstypen
js/ui.js                Ringe, Balken, Meldungen, Konfetti
js/app.js               Bildschirme und Navigation
data/*.js               Vokabeln
sw.js                   Offline-Speicherung
manifest.webmanifest    Name, Farben und Icons der Homescreen-App
```
