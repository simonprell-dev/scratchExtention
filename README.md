<div align="center">

# Scratch auf Deutsch + Einführungskurs

**Deutsche Scratch-Tutorials und ein geführter Programmierkurs für Kinder – direkt im Scratch-Editor.**

Kostenlose Browser-Erweiterung für Brave, Chrome und Edge · Open Source · ohne Anmeldung

[![Version](https://img.shields.io/github/v/release/simonprell-dev/scratchExtention?label=Version&color=855CD6)](https://github.com/simonprell-dev/scratchExtention/releases/latest)
[![Lizenz: MIT](https://img.shields.io/badge/Lizenz-MIT-4C97FF)](LICENSE)
[![Prüfung](https://github.com/simonprell-dev/scratchExtention/actions/workflows/check.yml/badge.svg)](https://github.com/simonprell-dev/scratchExtention/actions/workflows/check.yml)
![Browser](https://img.shields.io/badge/Browser-Brave%20%7C%20Chrome%20%7C%20Edge-FFAB19)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-FFAB19)
![Sprache: Deutsch](https://img.shields.io/badge/Sprache-Deutsch-FFAB19)

[**⬇️ Herunterladen**](https://github.com/simonprell-dev/scratchExtention/releases/latest) ·
[Installation](#installation) ·
[Kursübersicht](#kursübersicht) ·
[Für Lehrkräfte](#tipps-für-lehrkräfte) ·
[Mitmachen](CONTRIBUTING.md)

![Animierter Hinweis zeigt, wie ein Block in die Schleife gezogen wird](docs/demo.gif)

</div>

## Warum?

Scratch ist ein wunderbarer Einstieg ins Programmieren – aber die eingebauten Tutorials
zeigen ihre Blöcke **immer auf Englisch**, auch wenn der Editor auf Deutsch steht. Für
Kinder, die gerade erst sicher lesen, ist das eine echte Hürde. Und wer einen Kurs gibt,
braucht einen roten Faden vom ersten Block bis zum eigenen Spiel.

Diese Erweiterung löst beides:

| | |
|---|---|
| 🇩🇪 **Deutsche Tutorials** | 96 Tutorial-Bilder von Scratch zeigen deutsche Blöcke statt englischer |
| 🧭 **Geführter Kurs** | 8 Kapitel, 68 Schritte – von „Dein erster Block“ bis zu Klonen und eigenen Blöcken |
| 👆 **Zeige-Hinweise** | Animierte Hand und fliegende Blöcke zeigen, wo geklickt und wohin gezogen wird |
| ✅ **Automatisches Abhaken** | Die Erweiterung erkennt selbst, ob die Blöcke richtig sitzen |
| 🎮 **Spiele & Animationen** | Fang-Spiel, Pong, Hüpf-Spiel, Weltraum-Spiel, Tanz-Party, Trickfilm, Malstift-Kunst |
| 🎨 **Kreativ-Aufgaben** | Jedes Kapitel lässt Raum für eigene Ideen |
| 🐣🚀🏆 **Drei Einstiegsstufen** | Neuling, Schon mal ausprobiert, Ich kenne mich aus |
| 💾 **Ein Projekt pro Kapitel** | Führt zwischen den Kapiteln durch Speichern und „Datei → Neu“ |
| 🔒 **Datenschutzfreundlich** | Kein Konto, kein Server, keine Datenübertragung |

**Für wen?** Kinder von etwa 8 bis 14 Jahren, Lehrkräfte im Informatik- und
Medienunterricht, Ganztag und AGs, Workshops in Makerspaces und digitalen Lernorten wie
dem BayernLab – und Eltern, die mit ihren Kindern programmieren.

---

## Inhalt

- [Installation](#installation)
- [Aktualisieren](#aktualisieren)
- [Benutzung](#benutzung)
- [Kursübersicht](#kursübersicht)
- [Tipps für Lehrkräfte](#tipps-für-lehrkräfte)
- [Problemlösung](#problemlösung)
- [Datenschutz](#datenschutz)
- [Mitmachen](#mitmachen)
- [Lizenz und Danksagung](#lizenz-und-danksagung)
- [English summary](#english-summary)

---

## Installation

Die Erweiterung wird als **entpackte Erweiterung** geladen. Das dauert etwa zwei Minuten.

### Voraussetzungen

- **Brave**, **Google Chrome** oder **Microsoft Edge** in einer aktuellen Version
  (mindestens Chromium 111, also jede Version ab 2023)

### Schritt für Schritt (Brave)

1. **Herunterladen:** Unter [Releases](https://github.com/simonprell-dev/scratchExtention/releases/latest) die Datei
   `scratch-auf-deutsch-vX.Y.Z.zip` herunterladen.
2. **Entpacken:** Rechtsklick auf die ZIP-Datei → **Alle extrahieren**. Den Ordner
   `scratch-auf-deutsch` an einen festen Ort legen, z. B. nach `Dokumente`.
3. Neuen Tab öffnen und `brave://extensions` in die Adresszeile eingeben.
4. Oben rechts den Schalter **Entwicklermodus** einschalten.
5. Auf **Entpackte Erweiterung laden** klicken und den Ordner `scratch-auf-deutsch`
   auswählen (darin liegt die Datei `manifest.json`).
6. In der Liste erscheint **Scratch Tutorials auf Deutsch + Einführungskurs**. Der Schalter
   daneben muss eingeschaltet sein.
7. [scratch.mit.edu/projects/editor](https://scratch.mit.edu/projects/editor/) öffnen
   (oder die Seite neu laden, falls sie schon offen war).

Oben in der lila Menüleiste erscheint jetzt der Button **Einführungskurs starten**. ✅

> **Wichtig:** Der Ordner muss dauerhaft an seinem Platz bleiben. Der Browser lädt die
> Erweiterung bei jedem Start aus diesem Ordner. Wird er gelöscht oder verschoben, ist die
> Erweiterung weg.

> **Noch kein Release vorhanden?** Oben auf der GitHub-Seite **Code → Download ZIP**
> wählen, entpacken und den entpackten Ordner wie in Schritt 5 laden.

### Chrome und Edge

Das Vorgehen ist gleich, nur die Adresse ist anders:

| Browser | Adresse | Schalter |
|---|---|---|
| Brave | `brave://extensions` | Entwicklermodus |
| Chrome | `chrome://extensions` | Entwicklermodus |
| Edge | `edge://extensions` | Entwicklermodus (links in der Seitenleiste) |

### Sprache von Scratch auf Deutsch stellen

Der Kurs ist für den deutschen Scratch-Editor geschrieben. Falls Scratch englisch
angezeigt wird: oben links auf das **Zahnrad-Symbol (Settings)** → **Language** →
**Deutsch**.

---

## Aktualisieren

Wenn es eine neue Version gibt:

1. Die neue ZIP-Datei von [Releases](https://github.com/simonprell-dev/scratchExtention/releases/latest) herunterladen und den
   Inhalt über den bisherigen Ordner kopieren (Ordnername und Ort beibehalten).
2. `brave://extensions` öffnen und bei der Erweiterung auf den **Pfeil-Kreis (Neu laden)**
   klicken.
3. Den Scratch-Editor neu laden.

---

## Benutzung

### Deutsche Tutorials

Einfach wie gewohnt in Scratch oben auf **Tutorials** klicken und eine Anleitung
auswählen. Wo die Tutorial-Karte englische Blöcke zeigen würde, erscheinen jetzt deutsche.

![Scratch-Tutorial mit deutschen Blöcken](docs/tutorial-deutsch.png)

- Oben rechts im Bild schaltet **Original** zurück zum englischen Bild, **Deutsch**
  wieder zu den deutschen Blöcken. Die Wahl wird gespeichert.
- 96 von 110 Tutorial-Bildern sind übersetzt. Die übrigen zeigen keine Blöcke,
  sondern nur Bedienschritte (z. B. „Erweiterung hinzufügen“) und bleiben unverändert.
- Die **Videos** in den Tutorials sind weiterhin englisch.

### Einführungskurs starten

1. In der Menüleiste auf **Einführungskurs starten** klicken.
2. Die passende **Stufe** wählen:

   | Stufe | Für wen? | Start |
   |---|---|---|
   | 🐣 **Neuling** | Noch nie mit Scratch programmiert | Kapitel 1 |
   | 🚀 **Schon mal ausprobiert** | Kennt die Blöcke, hat schon etwas gebaut | Kapitel 3 |
   | 🏆 **Ich kenne mich aus** | Schleifen, Variablen, Bedingungen sind kein Problem | Kapitel 6 |

3. Das Kursfenster öffnet sich im Programmierbereich. Los geht's!

Die Stufe legt nur fest, wo man einsteigt. Über die Kapitelübersicht ☰ sind jederzeit alle
Kapitel erreichbar.

### Das Kursfenster

| Element | Funktion |
|---|---|
| Blaue Kopfzeile | Gedrückt halten und ziehen, um das Fenster zu verschieben |
| ☰ | Kapitelübersicht: zu jedem Schritt springen, Stufe neu wählen |
| ▾ / ▴ | Fenster **einklappen** auf eine schmale Leiste (bei wenig Platz) bzw. wieder ausklappen |
| ✕ | Kurs schließen. Der Fortschritt bleibt erhalten, über den Menü-Button geht es weiter |
| Fortschrittsbalken | Ein Strich pro Schritt: grün = geschafft, umrandet = aktueller Schritt |
| **So soll es aussehen** | Das Ziel-Skript mit deutschen Blöcken |
| Aufgabenliste | Wird automatisch abgehakt. Aufgaben mit Mauszeiger-Hand hakt man selbst per Klick ab |
| 👆 **Zeig mir wie** | Blendet Hinweise im Editor ein oder aus |
| **Weiter →** | Nächster Schritt. Leuchtet, sobald alles erledigt ist. Man kann auch vorher weiter |

![Eingeklapptes Kursfenster](docs/eingeklappt.png)

### Hinweise im Editor

Animierte Hinweise zeigen Schritt für Schritt, was als Nächstes zu tun ist:

- **Gelber, pulsierender Rahmen + Hand 👆:** Hier klicken (z. B. Kategorie, grüne Flagge,
  Figur wählen).
- **Fliegender Block + Faust ✊:** Diesen Block aus der Palette an die markierte Stelle
  ziehen. Der Block wird dabei auf Deutsch angezeigt.
- **„Klicke zuerst hier“:** Der benötigte Block liegt in einer anderen Kategorie.
- **„Scrolle nach unten“:** Der Block ist in der Palette weiter unten.
- **Durch die Bibliotheken:** Bei neuen Figuren, Hintergründen und Klängen führen die
  Hinweise Schritt für Schritt: Tab öffnen → „… wählen“ → Suchbegriff eintippen oder
  Kategorie anklicken → Eintrag auswählen → zurück zu „Skripte“.

![Zieh-Hinweis: Block in die Schleife ziehen](docs/zieh-hinweis.png)

Bei Neulingen sind die Hinweise automatisch an. Bei **Challenges ⭐** und ab Kapitel 6
erscheinen sie nur auf Knopfdruck. Dort sollen die Kinder es erst selbst versuchen.

Ist ein Schritt geschafft, gibt es Konfetti 🎉 und eine Vorschau auf die nächste Aufgabe:

![Geschaffter Schritt](docs/aufgabe-geschafft.png)

### Zwischen den Kapiteln: speichern und neu starten

Jedes Kapitel ist ein eigenes Projekt. Wer ein Kapitel abschließt oder in ein anderes
Kapitel wechselt, sieht zuerst den Schritt **💾 Projekt sichern**:

1. **Projekt speichern:** **Datei → Auf deinem Computer speichern**. Mit Scratch-Konto
   geht auch **Datei → Jetzt speichern**.
2. **Neues Projekt anlegen:** **Datei → Neu**. Scratch fragt nach, ob das aktuelle Projekt
   ersetzt werden soll. Das mit **OK** bestätigen.

Die Hinweise zeigen auf das Datei-Menü und den richtigen Eintrag. Beide Aufgaben werden
automatisch abgehakt. Danach startet das nächste Kapitel mit **Los geht's →**. Wer nicht
speichern möchte, kann mit **Überspringen** direkt weiter.

Ist das Projekt schon leer (z. B. direkt nach dem Öffnen des Editors), entfällt dieser
Schritt.

> **Gespeicherte Projekte weiterbauen:** **Datei → Load from your computer** und die
> `.sb3`-Datei auswählen. Diesen Menüpunkt hat Scratch selbst noch nicht übersetzt.

### Schritt-Arten

| Abzeichen | Bedeutung |
|---|---|
| 💡 Info | Erklärung, nichts zu bauen |
| 🧩 Lernen | Neues Konzept mit Anleitung |
| 🎨 Kreativ | Eigene Ideen umsetzen: Figuren, Hintergründe, Effekte |
| 🎮 Spiel | Zwischenspiel: das Gebaute spielen und ein Ziel erreichen |
| ⭐ Challenge | Selbst lösen, Hinweise nur bei Bedarf |

---

## Kursübersicht

| # | Kapitel | Typ | Stufe | Das lernen die Kinder |
|---|---|---|---|---|
| 1 | 🐣 Erste Schritte | Grundlagen | Neuling | Oberfläche, Blöcke ziehen, grüne Flagge, Sprechen, Figuren & Hintergründe, Pfeiltasten, Zwischenspiel „Klick-Jagd“ mit Punkten |
| 2 | 💃 Tanz-Party | **Animation** | Neuling | Kostüme & Daumenkino-Prinzip, Wiederholen, Warten, Musik in Schleifen, Grafikeffekte, Gleiten |
| 3 | 🎯 Fang-Spiel mit der Maus | Spiel | Schon mal ausprobiert | Endlosschleife, Mauszeiger folgen, falls/dann, Berührung, Variablen, Stoppuhr, Gegner |
| 4 | 🎬 Trickfilm | **Animation** | Schon mal ausprobiert | Dialoge, Nachrichten senden/empfangen, Szenenwechsel, zeigen/verstecken, interaktive Geschichte mit Fragen |
| 5 | 🦘 Hüpf-Spiel | Spiel | Schon mal ausprobiert | Springen mit Schleifen, Hindernisse, Kollision, Punkte, Challenge: echte Schwerkraft |
| 6 | 🏓 Pong | Spiel | Ich kenne mich aus | Richtung & Abprallen, Steuern mit Maus-x, Game Over per Farbe, Tempo-Variable |
| 7 | 🖌️ Kunst mit dem Malstift | Kunst | Ich kenne mich aus | Erweiterung Malstift, Geometrie, verschachtelte Schleifen, eigene Blöcke, Malprogramm |
| 8 | 🚀 Weltraum-Abenteuer mit Klonen | Spiel | Ich kenne mich aus | Tastenabfrage in Schleifen, Klone, Zufallszahlen, wiederhole bis, Laser-Challenge |

Jedes Kapitel endet mit einer **Kreativ-Aufgabe**, in der die Kinder das Projekt zu ihrem
eigenen machen. Danach gibt es eine 🏆-Seite mit Übergang ins nächste Kapitel.

---

## Tipps für Lehrkräfte

- **Ein Projekt pro Kapitel:** Der Kurs führt zwischen den Kapiteln automatisch durch
  „Speichern“ und „Datei → Neu“. Das ist wichtig, weil die automatischen Prüfungen das
  ganze Projekt ansehen. Alte Skripte aus früheren Kapiteln könnten sonst Aufgaben
  fälschlich abhaken.
- **Wohin wird gespeichert?** Ohne Scratch-Konto landet die `.sb3`-Datei im
  Download-Ordner, je nach Browser auch mit Nachfrage nach dem Speicherort. Gut ist ein
  eigener Ordner pro Kind, z. B. auf dem USB-Stick oder im Schulnetz. Mit Konto speichert
  Scratch online im Profil.
- **Fortschritt pro Browser:** Der Kursfortschritt wird im Browser gespeichert, nicht im
  Scratch-Projekt. An geteilten Schul-PCs übernimmt das nächste Kind den Stand. Mit
  ☰ → **Stufe neu wählen** beginnt man von vorn. Am besten hat jedes Kind ein eigenes
  Browser-Profil.
- **Selbst abhaken:** Manche Aufgaben kann die Erweiterung nicht prüfen, z. B. „rote Linie
  gemalt“ oder „Spiel jemandem vorgeführt“. Diese hakt das Kind per Klick ab. Ein guter
  Moment für einen kurzen Blick der Lehrkraft.
- **Wenig Bildschirmplatz:** Fenster mit ▾ einklappen oder an den Rand ziehen. Bei kleinen
  Fenstern blendet der Kurs die Vorschau-Blöcke automatisch aus.
- **Ohne Hinweise üben:** 👆 **Hinweise aus** schaltet die Animationen ab. Das ist gut für
  Kinder, die es allein schaffen wollen.

---

## Problemlösung

**Der Button „Einführungskurs starten“ fehlt.**
- Ist die Erweiterung in `brave://extensions` eingeschaltet?
- Die Erweiterung läuft nur auf `https://scratch.mit.edu`, nicht in der Scratch-Desktop-App
  und nicht auf anderen Scratch-Seiten wie TurboWarp.
- Den Editor einmal neu laden (F5).
- Bei sehr schmalem Fenster passt der Button eventuell nicht mehr in die Menüleiste.
  Fenster breiter ziehen oder mit Strg + Minus herauszoomen.

**Die Hinweise zeigen an die falsche Stelle.**
- Die Hinweise orientieren sich an der Bildschirmposition. Nach dem Scrollen oder Zoomen
  im Programmierbereich passen sie sich innerhalb einer Sekunde an.
- Mit dem **=**-Knopf unten rechts im Programmierbereich die Ansicht zurücksetzen.

**Eine Aufgabe wird nicht abgehakt, obwohl alles stimmt.**
- Sitzen die Blöcke wirklich zusammen? Lose Blöcke, die nur nah beieinander liegen,
  zählen nicht.
- Stimmt der Menüwert? Beispiel: „gehe zu **Mauszeiger**“ statt „Zufallsposition“.
- Notfalls mit **Weiter →** einfach fortfahren. Man kann jeden Schritt überspringen.

**„Projekt speichern“ wird nicht abgehakt.**
Das Abhaken passiert beim Klick auf den Speichern-Eintrag im Datei-Menü. Wurde stattdessen
mit Strg + S oder anders gespeichert, einfach **Los geht's →** oder **Überspringen**
klicken.

**Das Kursfenster verdeckt etwas.**
Fenster an der lila Kopfzeile wegziehen oder mit ▾ einklappen.

**Die deutschen Tutorial-Bilder erscheinen nicht.**
Nur Tutorial-Schritte mit Blöcken werden ersetzt. Prüfen, ob oben rechts im Bild
**Deutsch** steht. Dann ist gerade das Original ausgewählt.

**Nach einem Scratch-Update funktioniert etwas nicht mehr.**
Die Erweiterung nutzt interne Strukturen des Scratch-Editors. Größere Umbauten bei Scratch
können eine Anpassung nötig machen. Bitte ein [Issue](https://github.com/simonprell-dev/scratchExtention/issues/new/choose) erstellen
und unter Releases nach einer neuen Version schauen.

**Browser meldet „Erweiterungen im Entwicklermodus deaktivieren“.**
Chrome und Edge zeigen diesen Hinweis manchmal beim Start. Einfach schließen
(**Abbrechen** bzw. **Nicht deaktivieren**).

---

## Datenschutz

- Die Erweiterung läuft **nur** auf `https://scratch.mit.edu`.
- Sie sendet **keine Daten** irgendwohin und lädt nichts aus dem Internet nach. Alle
  Dateien, auch die Block-Grafiken, sind im Ordner enthalten.
- Gespeichert werden nur der Kursfortschritt und die Einstellung „Original/Deutsch“ im
  lokalen Speicher des Browsers (`localStorage` von scratch.mit.edu).
- Zum Zurücksetzen: in den Browser-Einstellungen die Website-Daten von scratch.mit.edu
  löschen, oder im Kurs ☰ → **Stufe neu wählen**.

---

---

## Mitmachen

Ideen aus dem Unterricht, Fehlerberichte, bessere Texte oder ganze neue Kapitel sind
herzlich willkommen!

- 🐞 [Fehler melden](https://github.com/simonprell-dev/scratchExtention/issues/new?template=fehler.yml)
- 💡 [Idee für den Kurs einreichen](https://github.com/simonprell-dev/scratchExtention/issues/new?template=kursidee.yml)
- 🛠️ [Anleitung für Beiträge](CONTRIBUTING.md): Projektaufbau, Kursschritte schreiben,
  neue Kapitel, Releases
- 🤖 [Claude-Skill „kurs-kapitel“](.claude/skills/kurs-kapitel/README.md): schreibt neue
  Kapitel mit Texten, Prüfungen und Zeige-Hinweisen. Mit Installationsanleitung.
- 📝 [Änderungen pro Version](CHANGELOG.md)

Gefällt dir das Projekt? Ein ⭐ auf GitHub hilft anderen Lehrkräften, es zu finden.

---

## Lizenz und Danksagung

- Diese Erweiterung ist **Open Source** unter der [MIT-Lizenz](LICENSE). Sie darf frei
  genutzt, verändert und weitergegeben werden – auch in Schulen und Kursen.
- Blöcke werden mit [scratchblocks](https://github.com/scratchblocks/scratchblocks) von
  Tim Radvan gezeichnet (MIT-Lizenz, siehe `lib/scratchblocks-LICENSE`).
- Die Tutorial-Zuordnung basiert auf dem Quellcode von
  [scratch-gui](https://github.com/scratchfoundation/scratch-gui).
- Scratch ist ein Projekt der Scratch Foundation in Zusammenarbeit mit der Lifelong
  Kindergarten Group am MIT Media Lab. Diese Erweiterung ist ein unabhängiges Projekt und
  steht in keiner Verbindung zur Scratch Foundation.

---

## English summary

**Scratch auf Deutsch** is a free, open-source browser extension (Brave, Chrome, Edge –
Manifest V3) for the [Scratch](https://scratch.mit.edu) online editor:

- **German Scratch tutorials:** Scratch's built-in tutorials show English block images
  even when the editor is set to German. The extension replaces 96 of them with the same
  blocks rendered in German.
- **Guided coding course for kids:** 8 chapters (games, animations, pen art, clones) with
  three entry levels, animated drag-and-drop hints, automatic task checking via the Scratch
  VM, and a save-and-start-fresh step between chapters.
- No account, no server, no tracking. MIT licensed. Contributions welcome – see
  [CONTRIBUTING.md](CONTRIBUTING.md).
