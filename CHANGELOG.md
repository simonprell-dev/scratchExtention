# Änderungen

Alle nennenswerten Änderungen an der Erweiterung. Versionsnummern folgen
[Semantic Versioning](https://semver.org/lang/de/).

## [Unveröffentlicht]

### Neu
- Die Erweiterung ist im [Chrome Web Store](https://chromewebstore.google.com/detail/cdbeogkjkkjocdlahkdbfiddpbiccnef) veröffentlicht. README und
  Projektseite verlinken jetzt dorthin; die Installation von Hand bleibt als Alternative
  für Schulrechner ohne Store-Zugang beschrieben.

## [1.2.0] – 2026-10-12

### Neu
- Schritt **„Projekt sichern“** zwischen den Kapiteln: Speichern und „Datei → Neu“ mit
  Zeige-Hinweisen und automatischem Abhaken.
- Fünf neue Kapitel: **Tanz-Party** (Animation), **Trickfilm** (Animation), **Hüpf-Spiel**,
  **Kunst mit dem Malstift**, **Weltraum-Abenteuer mit Klonen**. Insgesamt 8 Kapitel mit 68 Schritten.
- Geführte Hinweise durch die Scratch-Bibliotheken (Figuren, Hintergründe, Klänge):
  Knopf „… wählen“, Suche bzw. Kategorie und Eintrag werden gezeigt, die Hinweise liegen
  dabei über dem Bibliotheksfenster.
- Stufenwahl zeigt die Kapitel jeder Stufe, Kapitelübersicht mit Typ-Abzeichen.
- Open-Source-Lizenz (MIT), GitHub-Vorlagen, automatische Prüfung und Release-ZIP.
- **Symbol in der Browserleiste:** Klick öffnet den Scratch-Editor, Rechtsklick schaltet
  die Erweiterung ein/aus und setzt den Lernfortschritt zurück.
- **Projektseite** auf GitHub Pages (`docs/index.html`) mit Funktionen, Kapiteln, Installation, Tipps für Lehrkräfte und Datenschutz.
- Releases enthalten zusätzlich eine ZIP-Datei für den Chrome Web Store.
- Texte und Grafiken für den Chrome Web Store unter `docs/store/`, neue Screenshots im README.
- Claude-Skill **kurs-kapitel** unter `.claude/skills/` zum Schreiben neuer Kapitel, mit
  Installationsanleitung.

### Behoben
- Beim Zieh-Hinweis war der fliegende Block unsichtbar, nur die Hand war zu sehen.

### Geändert
- Neuer Name: **Einführungskurs für Scratch – Tutorials auf Deutsch**. Das Release-ZIP heißt jetzt `einfuehrungskurs-scratch-vX.Y.Z.zip`.
- Der Kurs heißt jetzt **Einführungskurs** (vorher „BayernLab-Kurs“), Button
  „Einführungskurs starten“. Neue Farben angelehnt an den Scratch-Editor (Lila, Orange,
  Blockfarben).
- Interne Namen umbenannt (CSS-Präfix `ek-`, `window.EinfuehrungskursScratch`,
  `window.EinfuehrungskursCourse`). Der gespeicherte Fortschritt wird einmalig vom alten
  Speicherschlüssel `bayernlab-course:v2` nach `einfuehrungskurs:v2` übernommen.
- Fortschritt wird über Kapitel-IDs gespeichert, damit neue Kapitel ihn nicht verschieben.
  (Einmaliger Neustart des Fortschritts beim Update von 1.1.)
- Hinweise weichen offenen Menüs, Texteingaben und dem Kursfenster aus.
- Kursfenster liegt unter Scratch-Dialogen und Auswahlmenüs.

## [1.1.0]

### Neu
- **BayernLab-Kurs** mit Button in der Menüleiste, Stufenwahl (Neuling / Schon mal
  ausprobiert / Ich kenne mich aus), einklappbarem Kursfenster, Zeige-Hinweisen im Stil
  von LEGO Education und automatischem Abhaken über die Scratch-VM.
- Kapitel Erste Schritte, Fang-Spiel und Pong.

## [1.0.0]

### Neu
- Deutsche Blöcke statt englischer Bilder in den eingebauten Scratch-Tutorials
  (96 von 110 Bildern), umschaltbar auf das Original.
