# Texte für den Chrome Web Store

Alle Bilder liegen in diesem Ordner (`docs/store/`). Sie werden mit der echten Erweiterung
im Scratch-Editor aufgenommen.

## Store-Eintrag

**Name** (aus `manifest.json`): Einführungskurs für Scratch – Tutorials auf Deutsch

**Zusammenfassung** (aus `manifest.json`, max. 132 Zeichen):
Deutsche Scratch-Tutorials und ein geführter Programmierkurs für Kinder – direkt im Scratch-Editor. Für Schule, AG und Zuhause.

**Beschreibung:**

Der Store lehnt Aufzählungen von Spiel- oder Kapitelnamen als „Keyword-Spam“ ab
(Version 1.2.0, Referenz „Yellow Argon“). Deshalb beschreibt der Text den Kurs in
ganzen Sätzen und nennt keine einzelnen Kapitel.

```
Programmieren lernen mit Scratch – auf Deutsch und Schritt für Schritt.

Die eingebauten Scratch-Tutorials zeigen ihre Blöcke immer auf Englisch, auch wenn der Editor auf Deutsch steht. Für Kinder, die gerade erst sicher lesen, ist das eine echte Hürde. Diese Erweiterung zeigt die Tutorials mit deutschen Blöcken und bringt einen geführten Einführungskurs direkt in den Scratch-Editor.

Deutsche Tutorials
Die Bilder in den eingebauten Scratch-Tutorials zeigen deutsche statt englischer Blöcke. Mit einem Klick lässt sich das Original wieder anzeigen.

Geführter Einführungskurs
Der Kurs besteht aus acht Kapiteln. In jedem Kapitel entsteht ein eigenes kleines Spiel, eine Animation oder ein Kunstprojekt – vom allerersten Block bis zu Variablen, eigenen Blöcken und Klonen. Zum Start wählt das Kind eine von drei Stufen, je nachdem, wie gut es Scratch schon kennt.

Eine animierte Hand zeigt, wo geklickt und wohin ein Block gezogen wird. Die Erweiterung erkennt selbst, ob die Blöcke richtig sitzen, und hakt die Aufgabe ab. Jedes Kapitel endet mit einer Aufgabe, in der die Kinder ihr Projekt nach eigenen Ideen weiterbauen.

So geht's
1. Auf das Symbol der Erweiterung klicken – der Scratch-Editor öffnet sich.
2. Oben in der Menüleiste auf „Einführungskurs starten“ klicken und eine Stufe wählen.

Mit einem Rechtsklick auf das Symbol lässt sich die Erweiterung ein- und ausschalten und der Lernfortschritt zurücksetzen, zum Beispiel an geteilten Schul-PCs.

Für wen?
Für Kinder von etwa 8 bis 14 Jahren, für Lehrkräfte, die Scratch im Unterricht oder in einer AG einsetzen, und für Eltern, die mit ihren Kindern programmieren möchten.

Datenschutz
Die Erweiterung braucht kein Konto und keinen Server. Sie sammelt keine Daten und überträgt nichts. Der Kursfortschritt bleibt im Browser. Sie läuft nur auf scratch.mit.edu.

Open Source
Die Erweiterung ist kostenlos und quelloffen (MIT-Lizenz). Anleitung und Tipps für Lehrkräfte: https://simonprell-dev.github.io/scratchExtention/

Dies ist ein unabhängiges Projekt und kein offizielles Produkt des Scratch-Teams. Scratch ist ein Projekt der Scratch Foundation in Zusammenarbeit mit der Lifelong Kindergarten Group am MIT Media Lab.
```

**Kategorie:** Bildung (falls nicht vorhanden: die nächstliegende Lern-/Bildungskategorie)

**Sprache:** Deutsch

## Grafische Elemente

| Feld | Datei |
|---|---|
| Händlersymbol 128 × 128 | `haendlersymbol-128.png` |
| Screenshots 1280 × 800 (Reihenfolge) | `screenshot-1.png` … `screenshot-5.png` |
| Kleine Werbekachel 440 × 280 | `promo-klein-440x280.png` |
| Große Werbekachel 1400 × 560 | `promo-gross-1400x560.png` |
| Globales Werbevideo | leer lassen |

Bildunterschriften der Screenshots:
1. Animierte Hinweise zeigen, wohin der Block gehört
2. Drei Einstiegsstufen – vom Neuling bis zum Profi
3. Aufgaben werden automatisch abgehakt
4. Der Kurs erklärt den Scratch-Editor Schritt für Schritt
5. Scratch-Tutorials mit deutschen Blöcken

## Weitere Felder

| Feld | Wert |
|---|---|
| Offizielle URL | Keine (oder die Projektseite, nachdem sie in der Google Search Console bestätigt wurde) |
| URL der Startseite | https://simonprell-dev.github.io/scratchExtention/ |
| Support-URL | https://github.com/simonprell-dev/scratchExtention/issues |
| Nicht jugendfreie Inhalte | aus |

## Tab „Datenschutz“

**Alleiniger Zweck:**

```
Die Erweiterung hilft Kindern beim Programmierenlernen im Scratch-Editor (scratch.mit.edu): Sie zeigt die eingebauten Scratch-Tutorials mit deutschen statt englischen Blöcken und bietet einen geführten Einführungskurs mit Hinweisen und automatisch geprüften Aufgaben direkt im Editor.
```

**Begründung der Berechtigungen:**

| Berechtigung | Begründung |
|---|---|
| `contextMenus` | Rechtsklick-Menü am Symbol der Erweiterung: Erweiterung ein-/ausschalten, Lernfortschritt zurücksetzen, Hilfe öffnen. |
| `scripting` | Registriert die Kurs- und Tutorial-Skripte für scratch.mit.edu dynamisch, damit Nutzer die Erweiterung über das Symbol ausschalten können. Setzt außerdem auf Wunsch den lokal gespeicherten Lernfortschritt in offenen Scratch-Tabs zurück. |
| `storage` | Speichert lokal, ob die Erweiterung ein- oder ausgeschaltet ist und ob ein Zurücksetzen des Lernfortschritts aussteht. |
| Hostberechtigung `https://scratch.mit.edu/*` | Die Erweiterung läuft ausschließlich im Scratch-Editor: Sie ersetzt dort die englischen Tutorial-Bilder durch deutsche Blöcke, blendet den Kurs ein und prüft die Blöcke des aktuellen Projekts, um Aufgaben automatisch abzuhaken. |

**Remote-Code:** Nein, ich verwende keinen Remote-Code. (Alle Skripte und Grafiken sind im Paket enthalten.)

**Datennutzung:** Keine der Kategorien ankreuzen – die Erweiterung erhebt keine
Nutzerdaten. Alle drei Bestätigungen (kein Verkauf, keine zweckfremde Nutzung, keine
Bonitätsprüfung) anhaken.

**Datenschutzerklärung (URL):**
https://simonprell-dev.github.io/scratchExtention/#datenschutz
