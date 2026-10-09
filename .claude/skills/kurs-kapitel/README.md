# Skill „kurs-kapitel“

Ein [Claude-Skill](https://docs.claude.com/de/docs/claude-code/skills), der neue Kapitel für
den Scratch-Einführungskurs schreibt. Kapitel bestehen aus kindgerechten Texten,
Ziel-Skripten, automatischen Prüfungen und Zeige-Hinweisen. Der Skill kennt das Datenformat
von `course/course-data.js`, alle Hinweis-Ziele und Prüf-Hilfen der Kurs-Engine. Am Ende
prüft er das Ergebnis mit `npm run check`.

```
.claude/skills/kurs-kapitel/
├── SKILL.md               Anleitung für Claude: Ablauf, Aufbau eines Kapitels, Regeln
├── references/api.md      Datenformat, Hinweis-Ziele, Prüf-Hilfen, Opcodes, scratchblocks
├── references/vorlage.js  Vollständiges Beispiel-Kapitel („Musik: Deine eigene Band“)
└── README.md              diese Datei
```

## Installation

### Variante A: Claude Code im Projekt (empfohlen)

Nichts zu tun. Claude Code lädt Skills aus `.claude/skills/` des geöffneten Projekts
automatisch.

1. Repository klonen und Abhängigkeiten installieren:

   ```bash
   git clone https://github.com/simonprell-dev/scratchExtention.git
   cd scratchExtention
   npm install
   ```

2. [Claude Code](https://docs.claude.com/de/docs/claude-code/overview) im Ordner starten
   (Terminal: `claude`, oder die Erweiterung in VS Code öffnen).
3. Prüfen: Mit `/skills` erscheint `kurs-kapitel` in der Liste.

### Variante B: Für alle Projekte (persönlicher Skill)

Den Ordner in das persönliche Skill-Verzeichnis kopieren. Danach steht der Skill in jedem
Projekt zur Verfügung. Er erwartet aber trotzdem die Dateien dieses Repositorys.

```bash
# macOS / Linux
mkdir -p ~/.claude/skills
cp -r .claude/skills/kurs-kapitel ~/.claude/skills/
```

```powershell
# Windows (PowerShell)
New-Item -ItemType Directory -Force "$env:USERPROFILE\.claude\skills" | Out-Null
Copy-Item -Recurse .claude\skills\kurs-kapitel "$env:USERPROFILE\.claude\skills\"
```

### Variante C: Claude.ai oder Claude-Desktop-App

1. Den Ordner `kurs-kapitel` als ZIP packen. `SKILL.md` muss im ZIP direkt im Ordner
   `kurs-kapitel/` liegen.
2. In Claude unter **Einstellungen → Funktionen → Skills** die ZIP-Datei hochladen und
   den Skill einschalten.
3. Im Chat zusätzlich `course/course-data.js` anhängen, damit Claude den aktuellen Stand
   kennt.

Ohne Zugriff auf das Repository kann Claude dort `npm run check` nicht ausführen. Das
fertige Kapitel also selbst einfügen und lokal prüfen.

## Benutzung

Einfach beschreiben, was du möchtest. Der Skill wird automatisch verwendet:

> Schreib ein neues Kapitel „Labyrinth“ für die Stufe „Schon mal ausprobiert“. Eine Figur
> wird mit den Pfeiltasten durch ein Labyrinth gesteuert und darf die Wände nicht berühren.

Oder direkt aufrufen:

> /kurs-kapitel Musik-Kapitel mit der Musik-Erweiterung für Profis

Claude liest dann die vorhandenen Kapitel, schlägt eine Schrittfolge vor, schreibt das
Kapitel in `course/course-data.js` und führt `npm run check` aus. CHANGELOG und
Kursübersicht im README werden mit angepasst.

**Danach immer selbst ausprobieren:** Erweiterung unter `brave://extensions` neu laden,
Scratch-Editor mit F5 aktualisieren und das Kapitel einmal komplett durchspielen. Achte
darauf, ob jede Aufgabe abgehakt wird und jeder Hinweis an die richtige Stelle zeigt.
Fehlerhafte Hinweise am besten mit einem Screenshot zurückmelden.

## Skill weiterentwickeln

- Ändert sich die Kurs-Engine (`course/course.js`), etwa durch neue Hinweis-Ziele oder
  Prüf-Hilfen, muss auch `references/api.md` angepasst werden.
- Die Vorlage `references/vorlage.js` lässt sich mit dem Kurs-Prüfer testen. Dazu das
  Kapitel probeweise in `course-data.js` einfügen und `npm run check -- -v` ausführen.
