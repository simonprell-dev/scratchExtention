# Referenz: Datenformat, Hinweise, Prüfungen

Quelle der Wahrheit ist der Code: `course/course.js` (`makeContext`, `resolveTarget`,
`resolveDrop`) und der Kopfkommentar von `course/course-data.js`. Wenn diese Datei und der
Code sich widersprechen, gilt der Code.

## Kapitel

```js
{
    id: 'musik',              // eindeutig, nie umbenennen (Fortschritt hängt daran)
    title: 'Musik: Deine eigene Band',
    level: 'probiert',        // 'neuling' | 'probiert' | 'profi'
    type: 'Musik',            // Abzeichen in Stufenwahl und Übersicht: Grundlagen, Spiel, Animation, Kunst …
    icon: '🥁',               // ein Emoji
    autoHints: true,          // Zeige-Hinweise automatisch an? (pro Schritt überschreibbar)
    steps: [ /* … */ ]
}
```

## Schritt

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `kind` | ja | `info` · `learn` · `creative` · `game` · `challenge` |
| `title` | ja | Überschrift im Kursfenster |
| `text` | ja | HTML (`<p>`, `<b>`, `<ul><li>`) |
| `blocks` | nein | Ziel-Skript als scratchblocks-Code (englisch, Menüwerte deutsch) |
| `tasks` | nein | Checkliste: `{text, check: c => bool}` oder `{text, manual: true}` |
| `hints` | nein | Zeige-Hinweise, der erste nicht erledigte wird gezeigt |
| `labels` | nein | Mehrere Bereiche gleichzeitig beschriften (Tour): `[{target, text}]` – ersetzt `hints` |
| `autoHints` | nein | überschreibt den Kapitelwert; bei `info` sind Hinweise immer aus |

Eine erledigte Aufgabe bleibt in diesem Schritt erledigt, auch wenn der Block wieder
entfernt wird. Der Schritt gilt als geschafft, wenn alle Aufgaben erledigt sind.

## Hinweise

**Zeigen:** `{target, text, done: c => bool}`

**Ziehen:** `{drag: '<opcode>', to: '<ziel>', ghost: '<scratchblocks>', text, done: c => bool}`
Die Engine sucht den Block in der Palette. Ist die Kategorie nicht offen, zeigt sie
automatisch erst auf die Kategorie bzw. „Scrolle nach unten“.

### `target`-Werte

| Ziel | zeigt auf |
|---|---|
| `cat:<kategorie>` | Kategorie links: `motion`, `looks`, `sound`, `events`, `control`, `sensing`, `operators`, `variables`, `myBlocks`, `pen`, `music` |
| `fly:<opcode>` | Block in der Palette |
| `ws:<opcode>` | Block im Programmierbereich (aktuelle Figur) |
| `flybtn:<Text>` | Knopf in der Palette, z. B. `flybtn:Neue Variable`, `flybtn:Neuer Block` |
| `flag` | grüne Flagge |
| `stage` | Bühne |
| `spriteAdd` / `backdropAdd` | „Figur wählen“ / „Hintergrund wählen“ |
| `soundAdd` / `costumeAdd` | „Klang wählen“ / „Kostüm wählen“ (im jeweiligen Tab) |
| `spriteList` / `stageSelector` | Figurenliste / Bühnen-Auswahl rechts |
| `extensionAdd` | Erweiterungs-Knopf unten links |
| `tab:code` · `tab:costumes` · `tab:sounds` | Tabs oben |
| `palette` / `workspace` | ganze Blockpalette / ganzer Programmierbereich |
| `libSearch` · `libTag:<Kategorie>` · `libItem:<Name-Anfang>` | in einer offenen Bibliothek – besser über `libraryHints` |

### `to`-Werte (Zieh-Ziele)

| Ziel | Ablage |
|---|---|
| `ws` | freie Fläche im Programmierbereich |
| `ws:<opcode>` | auf einen vorhandenen Block |
| `under:<opcode>` | unter das Skript, das mit diesem Block beginnt bzw. ihn enthält |
| `above:<opcode>` | direkt über diesen Block |
| `inside:<opcode>` | in den Mund eines C-Blocks (`control_forever`, `control_if` …) |
| `cond:<opcode>` | in die Bedingungs-/Eingangslücke (`control_if`, `control_repeat_until`, `control_wait_until` …) |

### Bibliotheks-Hinweise

```js
...libraryHints({
    tab: 'sounds',              // optional: erst diesen Tab öffnen (sounds | costumes)
    button: 'soundAdd',         // spriteAdd | backdropAdd | soundAdd | costumeAdd
    buttonText: 'Klicke hier: Klang wählen',
    search: 'drum',             // ODER tag: 'Musik' (Kategorie-Knopf in der Bibliothek)
    item: 'Drum',               // optional: Anfang des Eintragsnamens (englisch, wie in der Bibliothek)
    itemText: 'Klicke auf ein Schlagzeug',
    done: c => c.newSound()     // beendet die ganze Kette
})
```

## Prüf-Kontext `c`

| Hilfe | liefert |
|---|---|
| `c.find(opcode)` | `[{t, b}]` – alle (nicht-Schatten-)Blöcke mit dem Opcode, in allen Figuren und der Bühne |
| `c.hatOf(t, b)` | oberster Block des Skripts (der „Hut“) |
| `c.inC(t, b, outer)` | liegt `b` in Mund oder Eingang eines Blocks `outer`? |
| `c.field(b, name)` | Feldwert, z. B. `c.field(hat, 'KEY_OPTION')` |
| `c.menu(t, b, input)` | Wert eines Menü-Eingangs, z. B. `c.menu(t, b, 'TO') === '_mouse_'` |
| `c.text(t, b, input)` | Eingangswert als String, z. B. `Number(c.text(t, b, 'STEPS'))` |
| `c.plugged(t, b, input)` | Opcode des eingesteckten Reporter-Blocks oder `null` |
| `c.vars()` | alle normalen Variablen `[{name, value, …}]` |
| `c.sprites` / `c.stage` / `c.editing` | Figuren-Targets / Bühne / aktuell bearbeitete Figur |
| `c.base` | Zustand bei Schrittbeginn: `spriteCount`, `backdropCount`, `backdrop`, `pos`, `sounds` |
| `c.flags` | wie oft in diesem Schritt die grüne Flagge geklickt wurde |
| `c.keys` | `Set` der in diesem Schritt gedrückten Tasten (`'space'`, `'right arrow'` …) |
| `c.moved()` | hat sich eine Figur seit Schrittbeginn bewegt? |
| `c.backdropChanged()` | neuer oder anderer Hintergrund? |
| `c.newSound()` | hat eine Figur einen neuen Klang bekommen? |
| `c.tab(name)` / `c.tabSeen(name)` | Tab offen / in diesem Schritt schon offen gewesen |
| `c.libraryOpen()` · `c.searchText()` · `c.tagActive(text)` | Zustand einer offenen Bibliothek |
| `c.extension(id)` | Erweiterung geladen, z. B. `c.extension('pen')`, `c.extension('music')` |
| `c.spritesWith(opcode, extra?)` | in wie vielen Figuren der Block vorkommt |
| `c.editingHas(opcode)` | hat die aktuell bearbeitete Figur den Block? |
| `c.categoryOpen(id)` | ist die Kategorie links ausgewählt? |

### Kurzformen aus `course-data.js`

```js
inScript(c, op, hat, extra?)   // Block op in einem Skript, das mit Hut hat beginnt
inside(c, op, outer, extra?)   // Block op in C-Block/Eingang von outer
keyScript(c, key, op)          // Block op unter „Wenn Taste key gedrückt“
newSprites(c)                  // Anzahl neuer Figuren seit Schrittbeginn
userVar(c)                     // erste selbst angelegte Variable (nicht „meine Variable“)
```

### Interne Menüwerte

- Ziele: `_mouse_` (Mauszeiger), `_random_` (Zufallsposition), `_edge_` (Rand), `_myself_` (mir selbst)
- Tasten: `space`, `left arrow`, `right arrow`, `up arrow`, `down arrow`, `any`, Buchstaben `a` …
- Figuren- und Variablennamen: so, wie das Kind sie benannt hat – deshalb lieber nicht auf
  konkrete Namen prüfen.

## Häufige Opcodes

Vollständige Liste: [scratch-vm/src/blocks](https://github.com/scratchfoundation/scratch-vm/tree/develop/src/blocks).

| Kategorie | Opcodes |
|---|---|
| Ereignisse | `event_whenflagclicked`, `event_whenkeypressed`, `event_whenthisspriteclicked`, `event_whenbackdropswitchesto`, `event_whenbroadcastreceived`, `event_broadcast`, `event_broadcastandwait` |
| Bewegung | `motion_movesteps`, `motion_turnright`, `motion_turnleft`, `motion_goto`, `motion_gotoxy`, `motion_glideto`, `motion_glidesecstoxy`, `motion_pointindirection`, `motion_changexby`, `motion_setx`, `motion_changeyby`, `motion_sety`, `motion_ifonedgebounce`, `motion_xposition`, `motion_yposition` |
| Aussehen | `looks_sayforsecs`, `looks_say`, `looks_thinkforsecs`, `looks_switchcostumeto`, `looks_nextcostume`, `looks_switchbackdropto`, `looks_nextbackdrop`, `looks_changesizeby`, `looks_setsizeto`, `looks_changeeffectby`, `looks_seteffectto`, `looks_show`, `looks_hide`, `looks_gotofrontback` |
| Klang | `sound_play`, `sound_playuntildone`, `sound_stopallsounds`, `sound_changevolumeby` |
| Steuerung | `control_wait`, `control_repeat`, `control_forever`, `control_if`, `control_if_else`, `control_wait_until`, `control_repeat_until`, `control_stop`, `control_start_as_clone`, `control_create_clone_of`, `control_delete_this_clone` |
| Fühlen | `sensing_touchingobject`, `sensing_touchingcolor`, `sensing_distanceto`, `sensing_askandwait`, `sensing_answer`, `sensing_keypressed`, `sensing_mousedown`, `sensing_mousex`, `sensing_mousey`, `sensing_timer`, `sensing_resettimer` |
| Operatoren | `operator_add`, `operator_subtract`, `operator_multiply`, `operator_divide`, `operator_random`, `operator_gt`, `operator_lt`, `operator_equals`, `operator_and`, `operator_or`, `operator_not`, `operator_join` |
| Variablen | `data_variable`, `data_setvariableto`, `data_changevariableby`, `data_showvariable`, `data_hidevariable` |
| Meine Blöcke | `procedures_definition`, `procedures_call` |
| Malstift | `pen_clear`, `pen_penDown`, `pen_penUp`, `pen_setPenColorToColor`, `pen_changePenSizeBy`, `pen_stamp` |
| Musik | `music_playDrumForBeats`, `music_restForBeats`, `music_playNoteForBeats`, `music_setInstrument`, `music_setTempo` |

## scratchblocks-Spickzettel

```
when flag clicked
when [Leertaste v] key pressed
when this sprite clicked
forever
  if <touching (Rand v)?> then
    turn right (15) degrees
  end
end
repeat (10)
end
repeat until <(Punkte) = (10)>
end
set [Punkte v] to (0)
change [Punkte v] by (1)
go to (Mauszeiger v)
go to x: (pick random (-200) to (200)) y: (150)
say [Hallo!] for (2) seconds
play sound (Meow v) until done
create clone of (mir selbst v)
when I start as a clone
delete this clone
define springe
erase all
pen down
```

Unbekannte Blöcke meldet `npm run check` mit Kapitel- und Schrittnummer.
