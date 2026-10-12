# Texte für den Chrome Web Store

Alle Bilder liegen in diesem Ordner (`docs/store/`). Sie werden mit der echten Erweiterung
im Scratch-Editor aufgenommen.

## Store-Eintrag

**Name** (aus `manifest.json`): Scratch Tutorials auf Deutsch + Einführungskurs

**Zusammenfassung** (aus `manifest.json`, max. 132 Zeichen):
Scratch-Tutorials mit deutschen Blöcken und ein geführter Scratch-Einführungskurs direkt im Editor.

**Beschreibung:**

```
Programmieren lernen mit Scratch – auf Deutsch und Schritt für Schritt.

Die eingebauten Scratch-Tutorials zeigen ihre Blöcke immer auf Englisch, auch wenn der Editor auf Deutsch steht. Für Kinder, die gerade erst sicher lesen, ist das eine echte Hürde. Diese Erweiterung zeigt die Tutorials mit deutschen Blöcken und bringt einen geführten Einführungskurs direkt in den Scratch-Editor.

DEUTSCHE TUTORIALS
• 96 Tutorial-Bilder von Scratch zeigen deutsche statt englischer Blöcke
• Mit einem Klick zurück zum Original

GEFÜHRTER EINFÜHRUNGSKURS
• 8 Kapitel mit 68 Schritten – vom ersten Block bis zu Klonen und eigenen Blöcken
• Spiele und Animationen: Fang-Spiel, Pong, Hüpf-Spiel, Weltraum-Spiel, Tanz-Party, Trickfilm, Kunst mit dem Malstift
• Drei Einstiegsstufen: Neuling, Schon mal ausprobiert, Ich kenne mich aus
• Animierte Zeige-Hinweise: Eine Hand und ein fliegender Block zeigen, wo geklickt und wohin gezogen wird
• Automatisches Abhaken: Die Erweiterung erkennt selbst, ob die Blöcke richtig sitzen
• Kreativ-Aufgaben und Challenges in jedem Kapitel
• Zwischen den Kapiteln hilft der Kurs beim Speichern und Neustarten des Projekts

SO GEHT'S
1. Erweiterung installieren
2. Auf das Symbol der Erweiterung klicken – der Scratch-Editor öffnet sich
3. Oben in der Menüleiste auf „Einführungskurs starten“ klicken und eine Stufe wählen

Rechtsklick auf das Symbol: Erweiterung ein- oder ausschalten, Lernfortschritt zurücksetzen (praktisch an geteilten Schul-PCs), Hilfe öffnen.

FÜR WEN?
Kinder von etwa 8 bis 14 Jahren, Lehrkräfte im Informatik- und Medienunterricht, Ganztag und AGs, Workshops in Makerspaces und Bibliotheken – und Eltern, die mit ihren Kindern programmieren.

DATENSCHUTZ
• Kein Konto, keine Anmeldung, kein Server
• Es werden keine Daten gesammelt oder übertragen
• Der Kursfortschritt bleibt lokal im Browser
• Läuft nur auf scratch.mit.edu

OPEN SOURCE
Kostenlos und quelloffen (MIT-Lizenz). Fehler melden, Ideen einbringen oder neue Kapitel beisteuern:
https://github.com/simonprell-dev/scratchExtention

Hinweis: Dies ist ein unabhängiges Projekt und kein offizielles Produkt des Scratch-Teams. Scratch ist ein Projekt der Scratch Foundation in Zusammenarbeit mit der Lifelong Kindergarten Group am MIT Media Lab.
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
| Offizielle URL | Keine |
| URL der Startseite | https://github.com/simonprell-dev/scratchExtention |
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
https://github.com/simonprell-dev/scratchExtention#datenschutz
