# Scratch Tutorials auf Deutsch

Brave/Chrome-Erweiterung: Ersetzt in den Tutorial-Karten des Scratch-Editors
(scratch.mit.edu) die englischen Schritt-Bilder durch dieselben Blöcke auf Deutsch.
Über den Knopf „Original“ oben rechts im Bild lässt sich das englische Bild wieder anzeigen.

## Installieren (Brave)

1. `brave://extensions` öffnen
2. Oben rechts den **Entwicklermodus** einschalten
3. **Entpackte Erweiterung laden** → diesen Ordner auswählen
4. Scratch-Editor neu laden

## Wie es funktioniert

- `content.js` liest aus dem Redux-Store von Scratch, welcher Tutorial-Schritt angezeigt
  wird (Schlüssel wie `moveArrowKeysLeftRight` aus scratch-gui `en-steps.js`).
- `data/steps-de.js` enthält für jeden Schritt den Block-Code auf Deutsch, der mit
  [scratchblocks](https://scratchblocks.github.io/) gerendert wird.
- Schritte ohne Blöcke (z. B. „Erweiterung hinzufügen“, Klang aufnehmen) und die Videos
  bleiben unverändert.

## BayernLab Kurs

In der Menüleiste erscheint **BayernLab Kurs starten**. Dort wählt man die Einstiegsstufe:

| Stufe | Kapitel |
|---|---|
| Neuling | 1 Erste Schritte · 2 Animation: Tanz-Party |
| Schon mal ausprobiert | 3 Fang-Spiel mit der Maus · 4 Animation: Trickfilm · 5 Hüpf-Spiel |
| Ich kenne mich aus | 6 Pong · 7 Kunst mit dem Malstift · 8 Weltraum-Abenteuer mit Klonen |

Die Stufe bestimmt nur, wo man einsteigt – über ☰ sind alle Kapitel erreichbar.

- Das Kursfenster lässt sich verschieben (an der blauen Kopfzeile ziehen), mit ▾ einklappen
  und mit ☰ zur Kapitelübersicht umschalten. Der Fortschritt wird im Browser gespeichert.
- Aufgaben werden automatisch abgehakt: Die Erweiterung liest in der Scratch-VM, welche
  Blöcke wo liegen, ob die Flagge geklickt oder eine Taste gedrückt wurde.
- **Zeig mir wie** blendet Hinweise ein: ein gelber Rahmen, eine Hand und eine animierte
  Zieh-Bewegung mit dem passenden deutschen Block. Bei Neulingen sind die Hinweise
  automatisch an, bei Challenges und ab Kapitel 6 nur auf Knopfdruck.
- Kursinhalte stehen in `course/course-data.js`. Nach Änderungen prüft `npm run check`,
  ob alle Block-Skripte gültig sind.

## Daten ändern

Die englische Vorlage steht in `tools/source-en.json`, Wörterbücher für Menüwerte und
Texte in `tools/build-data.mjs`. Danach neu erzeugen:

```
npm install
npm run build
```
