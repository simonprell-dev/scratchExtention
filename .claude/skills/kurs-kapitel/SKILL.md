---
name: kurs-kapitel
description: Schreibt neue Kapitel und Schritte für den Scratch-Einführungskurs dieser Browser-Erweiterung (course/course-data.js) – mit kindgerechten Texten, Ziel-Skripten in scratchblocks-Syntax, automatischen Prüfungen und Zeige-Hinweisen. Verwende diesen Skill, wenn ein neues Kurs-Kapitel, ein neuer Kursschritt, eine Challenge oder Kursidee umgesetzt, ein bestehendes Kapitel erweitert oder umgebaut, oder Aufgaben-Prüfungen bzw. Hinweise im Einführungskurs geändert werden sollen.
---

# Kapitel für den Scratch-Einführungskurs schreiben

Der Kurs läuft als Browser-Erweiterung im Scratch-Editor. Alle Inhalte stehen in
`course/course-data.js`, die Engine in `course/course.js` liest sie und prüft alle 200 ms
die Blöcke in der Scratch-VM. **Für ein neues Kapitel wird nur `course-data.js` geändert.**
Die Engine (`course.js`) nur anfassen, wenn eine Prüf-Hilfe oder ein Hinweis-Ziel wirklich
fehlt – und das dann ausdrücklich sagen.

## Ablauf

1. **Verstehen:** Thema, Stufe (`neuling` | `probiert` | `profi`) und Lernziel klären.
   Fehlt etwas Wichtiges, kurz nachfragen; sonst sinnvoll annehmen und die Annahme nennen.
2. **Einlesen:** `course/course-data.js` lesen – vor allem die Hilfsfunktionen oben
   (`inScript`, `inside`, `keyScript`, `newSprites`, `userVar`, `libraryHints`) und ein
   Kapitel derselben Stufe als Stilvorlage. Prüfen, welche Blöcke frühere Kapitel schon
   eingeführt haben, damit das neue Kapitel darauf aufbaut statt alles zu wiederholen.
3. **Planen:** Schrittfolge kurz skizzieren (siehe „Aufbau eines Kapitels“) und dem Nutzer
   zeigen, bevor viel Code entsteht – außer der Auftrag ist schon sehr konkret.
4. **Schreiben:** Kapitel-Objekt nach [references/vorlage.js](references/vorlage.js) an
   der richtigen Stelle in `chapters` einfügen. Details zu Hinweis-Zielen, Prüf-Hilfen und
   Opcodes: [references/api.md](references/api.md).
5. **Prüfen:** `npm run check` (prüft alle scratchblocks-Skripte, `-v` zeigt die deutsche
   Übersetzung) und `node --check course/course-data.js`. Fehler beheben, bis beides grün ist.
6. **Abschließen:** Eintrag in `CHANGELOG.md` (Abschnitt „Neu“ der kommenden Version),
   Kapitel in die Kursübersicht im `README.md` aufnehmen und dort die Zahl der Kapitel und
   Schritte aktualisieren (steht an mehreren Stellen, z. B. „8 Kapitel, 68 Schritte“).
   Dem Nutzer sagen, dass das Kapitel einmal im echten Editor durchgespielt werden sollte
   (Erweiterung neu laden, Editor mit F5 aktualisieren) – das kann der Skill nicht selbst.

## Aufbau eines Kapitels

Ein gutes Kapitel hat 6–10 Schritte und führt zu **einem eigenen, fertigen Projekt**:

1. `info` – Worum geht es? Was bauen wir? (ohne Aufgaben, Hinweise sind hier aus)
2. `creative` – Figuren/Hintergrund aussuchen (mit `libraryHints`)
3. mehrere `learn` – je **ein** neues Konzept, Skript wächst Schritt für Schritt
4. `game` – das Projekt ist spielbar/anschaubar, ausprobieren
5. `challenge` – Erweiterung ohne Zieh-Hinweise (`autoHints: false` am Schritt)
6. `creative` – Finale mit Ideenliste und Selbst-Abhaken (`manual: true`)

Zwischen den Kapiteln fügt die Engine automatisch den Schritt „Projekt sichern“ ein – nicht
selbst schreiben.

Neuling-Kapitel: `autoHints: true`, kleine Schritte, jeder Block mit Zieh-Hinweis.
Profi-Kapitel: `autoHints: false` (Hinweise per 👆-Knopf), größere Schritte.

## Regeln für Texte

- Du-Form, kurze Sätze, kindgerechtes Deutsch für 8–14 Jahre. Kein Fachjargon ohne Erklärung.
- Blocknamen so schreiben, wie sie im **deutschen** Scratch-Editor heißen, fett:
  `<b>wiederhole fortlaufend</b>`, `<b>gehe zu Mauszeiger</b>`.
- `text` ist HTML (`<p>`, `<b>`, `<ul><li>`). Lange Texte mit `+` über Zeilen verteilen.
- Aufgabentexte (`tasks[].text`) sind kurz – sie stehen als Checkliste im schmalen Fenster.
- Hinweistexte (`hints[].text`) sind 2–6 Wörter, sie erscheinen in einer Sprechblase.
- Typografische Anführungszeichen „…“ verwenden.

## Regeln für Code

- **Kapitel-`id`** ist eindeutig, kurz, kleingeschrieben, ohne Umlaute (`musik`, `labyrinth`).
  Über sie wird der Fortschritt gespeichert – eine bestehende `id` nie umbenennen.
- Die **Reihenfolge** im `chapters`-Array ist die Kursreihenfolge. Neue Kapitel nach
  Stufe einsortieren (neuling → probiert → profi). Einstiegskapitel einer Stufe stehen in
  `levels` unten in der Datei; nur ändern, wenn das neue Kapitel neuer Einstieg sein soll.
- **`blocks`**: englische scratchblocks-Syntax, Menüwerte und Variablennamen deutsch
  (`[Pfeil nach rechts v]`, `[Punkte v]`, `(Mauszeiger v)`). Mehrere Skripte durch
  Leerzeile trennen. Wird automatisch deutsch gerendert.
- **`ghost`** bei Zieh-Hinweisen: nur der eine gezogene Block in scratchblocks-Syntax,
  C-Blöcke mit `end` (`'forever\nend'`).
- **Jede `learn`-Aufgabe braucht ein `check`**, das wirklich das Gelernte prüft.
  `manual: true` nur für Dinge, die die VM nicht sehen kann (gezeigt, ausprobiert, gezählt).
- Prüfungen großzügig formulieren: Kinder bauen Skripte oft anders. Lieber „Block X liegt
  in Schleife Y“ prüfen als die exakte Reihenfolge.
- Jeder Hinweis braucht ein `done(c)`, sonst bleibt er ewig stehen. `done` des letzten
  Hinweises sollte zur letzten Aufgabe passen.
- Hinweise laufen in Reihenfolge: Es wird immer der **erste** nicht erledigte gezeigt.
  `done` deshalb so schreiben, dass es auch wahr wird, wenn das Kind schon weiter ist.
- Wiederkehrende Prüfungen als kleine Hilfsfunktion oben in der Datei ablegen (wie
  `musicInLoop`), statt sie zu kopieren.
- Stil der Datei übernehmen: 4 Leerzeichen, einfache Anführungszeichen, ein Schritt-Objekt
  pro Block, `tasks`/`hints` als Arrays von Einzeilern.

## Typische Fehler

- Opcode falsch geschrieben (`control_forever_loop`) → Hinweis zeigt ins Leere, Prüfung nie
  wahr. Opcodes in [references/api.md](references/api.md) nachschlagen.
- `inside(c, op, 'control_if')` vergessen, dass `control_if_else` ein eigener Opcode ist.
- Menüwert falsch geprüft: `c.menu()` liefert interne Werte (`_mouse_`, `_edge_`,
  `space`, `right arrow`), nicht die deutsche Anzeige.
- Zieh-Ziel `under:<opcode>` zeigt auf einen Block, den es im Workspace (der aktuell
  bearbeiteten Figur) noch nicht gibt → vorher einen Hinweis einbauen, der ihn anlegt.
- Neue Figur verwendet, aber `blocks`/`check` nehmen an, es gäbe nur eine Figur.
