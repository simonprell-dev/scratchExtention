# Mitmachen

Schön, dass du helfen möchtest! Ob Tippfehler, neue Kursidee oder ganzes Kapitel – jeder
Beitrag hilft Kindern beim Programmierenlernen.

## Wie kann ich helfen?

- **Fehler melden oder Ideen einbringen:** [Issue erstellen](https://github.com/simonprell-dev/scratchExtention/issues/new/choose).
  Erfahrungen aus Unterricht und Workshops sind besonders wertvoll.
- **Texte verbessern:** Alle Kurstexte stehen in [`course/course-data.js`](course/course-data.js).
  Kindgerechtes Deutsch, Du-Form, kurze Sätze.
- **Neues Kapitel schreiben:** siehe [Ein neues Kapitel hinzufügen](#ein-neues-kapitel-hinzufügen).
- **Code verbessern:** Pull Requests sind willkommen.

## Ablauf für Pull Requests

1. Repository forken und einen Branch anlegen, z. B. `kapitel-musik`.
2. Änderungen machen und mit `npm run check` prüfen.
3. Im Scratch-Editor ausprobieren: Erweiterung unter `brave://extensions` neu laden,
   Editor aktualisieren.
4. Bei sichtbaren Änderungen einen Eintrag in [`CHANGELOG.md`](CHANGELOG.md) ergänzen.
5. Pull Request öffnen. Die automatische Prüfung (GitHub Actions) muss grün sein.

## Inhalte und Code anpassen

### Projektstruktur

```
scratchExtention/
├── manifest.json            Erweiterungs-Manifest (Manifest V3)
├── content.js / .css        Deutsche Tutorial-Bilder
├── course/
│   ├── course-data.js       ← Kursinhalte: Kapitel, Schritte, Aufgaben, Hinweise
│   ├── course.js            Kurs-Engine: Button, Stufenwahl, Fenster, Hinweise, Prüfungen
│   └── course.css           Gestaltung (BayernLab-Farben)
├── data/steps-de.js         Erzeugt: deutsche Blöcke für die Scratch-Tutorials
├── lib/
│   ├── scratch-access.js    Zugriff auf Redux-Store, VM und Workspace von Scratch
│   ├── scratchblocks.min.js Rendert Blöcke aus Text (scratchblocks 3.7.1, MIT)
│   └── scratchblocks-de.js  Deutsche Übersetzung für scratchblocks
├── tools/
│   ├── source-en.json       Englische Vorlage der 110 Tutorial-Bilder
│   ├── build-data.mjs       Erzeugt data/steps-de.js (inkl. Wörterbücher)
│   └── check-course.mjs     Prüft alle Block-Skripte im Kurs
├── docs/                    Screenshots, Demo-GIF, Vorschaubild für GitHub
├── .github/                 Issue-Vorlagen, Prüfung und Release-Workflow
├── CHANGELOG.md             Änderungen pro Version
└── LICENSE                  MIT-Lizenz
```

### So funktioniert es

- Alle Skripte laufen als Content-Scripts in der Seite selbst (`"world": "MAIN"`). Nur so
  kommen sie an die Interna von Scratch.
- `lib/scratch-access.js` findet über die React-Struktur der Seite den **Redux-Store**
  von Scratch. Darüber erreicht es die **Scratch-VM** und den **Blockly-Workspace**.
- **Tutorials:** Der Store verrät, welcher Tutorial-Schritt offen ist, z. B.
  `moveArrowKeysLeftRight`. Das Bild wird durch den passenden Eintrag aus
  `data/steps-de.js` ersetzt.
- **Kurs:** Alle 200 ms liest die Engine die Blöcke aller Figuren aus der VM und prüft die
  Aufgaben des aktuellen Schritts. Hinweise werden an echte Elemente im Editor geheftet,
  z. B. Kategorien, Blöcke in der Palette oder die grüne Flagge.

### Werkzeuge einrichten

Benötigt [Node.js](https://nodejs.org/) ab Version 18:

```bash
npm install        # installiert scratchblocks für die Werkzeuge
npm run check      # prüft alle Block-Skripte in course/course-data.js
npm run build      # erzeugt data/steps-de.js neu aus tools/source-en.json
```

Nach jeder Änderung die Erweiterung in `brave://extensions` neu laden und den Editor
aktualisieren.

### Einen Kursschritt schreiben

Kapitel und Schritte stehen in `course/course-data.js`. Ein Schritt sieht so aus:

```js
{
    kind: 'learn',                       // info | learn | creative | game | challenge
    title: 'Der Fänger folgt der Maus',
    text: '<p>Erklärung mit <b>HTML</b>.</p>',
    // Ziel-Skript in englischer scratchblocks-Syntax – wird automatisch deutsch angezeigt.
    // Menüwerte direkt deutsch schreiben.
    blocks: 'when flag clicked\nforever\n  go to (Mauszeiger v)\nend',
    tasks: [
        {text: 'Schleife unter die Flagge', check: c => inScript(c, 'control_forever', 'event_whenflagclicked')},
        {text: '„gehe zu Mauszeiger“ in die Schleife',
            check: c => inside(c, 'motion_goto', 'control_forever', (t, b) => c.menu(t, b, 'TO') === '_mouse_')},
        {text: 'Ich habe es jemandem gezeigt', manual: true}   // selbst abhaken
    ],
    hints: [   // es wird immer der erste noch nicht erledigte Hinweis gezeigt
        {drag: 'control_forever', to: 'under:event_whenflagclicked', ghost: 'forever\nend',
            text: 'Schleife darunter', done: c => inScript(c, 'control_forever', 'event_whenflagclicked')},
        {target: 'ws:motion_goto', text: 'Wähle „Mauszeiger“', done: c => /* … */ true}
    ]
}
```

**Hinweis-Ziele** (`target`): `cat:<kategorie>`, `fly:<opcode>`, `ws:<opcode>`, `flag`,
`stage`, `spriteAdd`, `backdropAdd`, `spriteList`, `stageSelector`, `extensionAdd`,
`tab:code|costumes|sounds`, `flybtn:<Beschriftung>`, `palette`, `workspace`.

**Zieh-Ziele** (`to`): `ws` (freie Fläche), `under:<opcode>`, `above:<opcode>`,
`inside:<opcode>` (in einen C-Block), `cond:<opcode>` (in die Lücke eines Blocks),
`ws:<opcode>` (auf einen Block).

**Prüf-Hilfen** im Kontext `c`: `c.find(opcode)`, `c.inC(t, b, outerOpcode)`,
`c.hatOf(t, b)`, `c.menu(t, b, input)`, `c.text(t, b, input)`, `c.field(b, name)`,
`c.plugged(t, b, input)`, `c.vars()`, `c.sprites`, `c.flags`, `c.keys`, `c.moved()`,
`c.backdropChanged()`, `c.tab(name)`, `c.tabSeen(name)`, `c.extension(id)`,
`c.spritesWith(opcode)`, `c.editingHas(opcode)`, `c.categoryOpen(id)`.
Dazu die Kurzformen `inScript`, `inside`, `keyScript`, `newSprites` und `userVar` oben in
der Datei.

Opcodes wie `motion_goto` oder `control_forever` stammen aus der Scratch-VM. Eine Liste
gibt es im [scratch-vm-Quellcode](https://github.com/scratchfoundation/scratch-vm/tree/develop/src/blocks).

### Ein neues Kapitel hinzufügen

1. In `course/course-data.js` ein Objekt in `chapters` einfügen, mit eindeutiger `id`,
   `title`, `level` (`neuling` | `probiert` | `profi`), `type`, `icon`, `autoHints` und
   `steps`.
2. Die Reihenfolge im Array ist die Reihenfolge im Kurs. Gespeichert wird über die `id`,
   deshalb verschieben neue Kapitel den Fortschritt nicht.
3. `npm run check` ausführen und das Kapitel im Editor durchspielen.

### Tutorial-Übersetzungen ändern

- Block-Code der Tutorial-Bilder (englisch): `tools/source-en.json`
- Übersetzungen von Menüwerten, Figurennamen und Sprechtexten: Wörterbücher `MENU`,
  `NAMES`, `TEXT` und `NOTES` in `tools/build-data.mjs`
- Danach `npm run build`

## Neue Version veröffentlichen

1. Version in `manifest.json` und `package.json` erhöhen, z. B. `1.3.0`.
2. Abschnitt `## [1.3.0] – Datum` in `CHANGELOG.md` anlegen.
3. Commit erstellen, Tag setzen und hochladen:

   ```bash
   git tag v1.3.0
   git push origin main --tags
   ```

4. GitHub Actions baut automatisch die ZIP-Datei `scratch-auf-deutsch-v1.3.0.zip` und
   veröffentlicht sie unter [Releases](https://github.com/simonprell-dev/scratchExtention/releases)
   mit dem Changelog-Abschnitt als Beschreibung.

## Lizenz

Mit einem Beitrag erklärst du dich einverstanden, dass er unter der
[MIT-Lizenz](LICENSE) dieses Projekts veröffentlicht wird.
