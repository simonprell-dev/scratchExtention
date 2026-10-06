/*
 * Inhalte des BayernLab-Scratch-Kurses.
 *
 * Aufbau eines Schritts:
 *   kind   'info' | 'learn' | 'creative' | 'game' | 'challenge'
 *   title, text (HTML)
 *   blocks Ziel-Skript als englischer scratchblocks-Code (wird deutsch gerendert).
 *          Menüwerte direkt auf Deutsch schreiben, z. B. [Pfeil nach rechts v].
 *   tasks  [{text, check(c)}] oder [{text, manual: true}] zum Selbst-Abhaken
 *   hints  Zeige-Hinweise, es wird immer der erste noch nicht erledigte gezeigt:
 *          {target, text, done(c)}            zeigt auf ein Element
 *          {drag, to, ghost, text, done(c)}   animiert das Ziehen eines Blocks
 *          Ziele: 'cat:motion', 'fly:<opcode>', 'ws:<opcode>', 'flag', 'stage',
 *          'spriteAdd', 'backdropAdd', 'spriteList', 'stageSelector',
 *          'tab:costumes', 'tab:sounds', 'tab:code', 'flybtn:<Text>'
 *          drag-Ziele: 'ws', 'under:<opcode>', 'above:<opcode>', 'inside:<opcode>',
 *          'cond:<opcode>'
 *   labels Beschriftungen für mehrere Bereiche gleichzeitig (Tour).
 *
 * Prüf-Hilfen in c (siehe course.js): c.find, c.inC, c.hatOf, c.menu, c.text,
 * c.field, c.plugged, c.vars, c.sprites, c.base, c.flags, c.keys.
 */
(function () {
    'use strict';

    // Liegt ein Block mit opcode op in einem Skript, das mit hat beginnt?
    function inScript (c, op, hat, extra) {
        return c.find(op).some(({t, b}) => {
            const h = c.hatOf(t, b);
            return (!hat || h.opcode === hat) && (!extra || extra(t, b, h));
        });
    }

    // Liegt ein Block op innerhalb (Substack/Bedingung) eines C-Blocks outer?
    function inside (c, op, outer, extra) {
        return c.find(op).some(({t, b}) => c.inC(t, b, outer) && (!extra || extra(t, b)));
    }

    function keyScript (c, key, op) {
        return inScript(c, op, 'event_whenkeypressed', (t, b, h) => c.field(h, 'KEY_OPTION') === key);
    }

    const newSprites = c => c.sprites.length - c.base.spriteCount;
    const userVar = c => c.vars().find(v => !/^(my variable|meine Variable)$/i.test(v.name));

    const chapters = [
        {
            id: 'start',
            title: 'Erste Schritte',
            level: 'neuling',
            type: 'Grundlagen',
            icon: '🐣',
            autoHints: true,
            steps: [
                {
                    kind: 'info',
                    title: 'Willkommen beim BayernLab-Kurs!',
                    text: '<p>Hier lernst du Schritt für Schritt, wie du mit Scratch eigene Spiele und Geschichten programmierst.</p>' +
                        '<p>Schau dir die vier Bereiche an, die gerade markiert sind. Dann klicke auf <b>Weiter</b>.</p>',
                    labels: [
                        {target: 'palette', text: '1  Blöcke'},
                        {target: 'workspace', text: '2  Programmierbereich'},
                        {target: 'stage', text: '3  Bühne'},
                        {target: 'spriteList', text: '4  Figuren'}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Dein erster Block',
                    text: '<p>Programme bestehen aus Blöcken. Ziehe den blauen Block <b>gehe 10er Schritt</b> in den Programmierbereich und klicke darauf.</p>',
                    blocks: 'move (10) steps',
                    tasks: [
                        {text: 'Block in den Programmierbereich ziehen', check: c => c.find('motion_movesteps').length > 0},
                        {text: 'Auf den Block klicken – die Figur bewegt sich!', check: c => c.moved()}
                    ],
                    hints: [
                        {drag: 'motion_movesteps', to: 'ws', ghost: 'move (10) steps', text: 'Ziehe den Block nach rechts', done: c => c.find('motion_movesteps').length > 0},
                        {target: 'ws:motion_movesteps', text: 'Klick mich an!', done: c => c.moved()}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Start mit der grünen Flagge',
                    text: '<p>Programme starten meistens mit der <b>grünen Flagge</b>. Hänge den gelben Block <b>Wenn die grüne Flagge angeklickt</b> oben an deinen Block.</p>',
                    blocks: 'when flag clicked\nmove (10) steps',
                    tasks: [
                        {text: 'Flaggen-Block oben andocken', check: c => inScript(c, 'motion_movesteps', 'event_whenflagclicked')},
                        {text: 'Auf die grüne Flagge klicken', check: c => c.flags > 0}
                    ],
                    hints: [
                        {drag: 'event_whenflagclicked', to: 'above:motion_movesteps', ghost: 'when flag clicked', text: 'Docke ihn oben an', done: c => inScript(c, 'motion_movesteps', 'event_whenflagclicked')},
                        {target: 'flag', text: 'Jetzt hier klicken!', done: c => c.flags > 0}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Lass deine Figur sprechen',
                    text: '<p>Aus der Kategorie <b>Aussehen</b> holst du den Block <b>sage Hallo! für 2 Sekunden</b>. Hänge ihn unten an und schreib deinen eigenen Text hinein.</p>',
                    blocks: 'when flag clicked\nmove (10) steps\nsay [Ich bin Programmierer!] for (2) seconds',
                    tasks: [
                        {text: '„sage … für 2 Sekunden“ unten anhängen', check: c => inScript(c, 'looks_sayforsecs', 'event_whenflagclicked')},
                        {text: 'Eigenen Text eintippen', check: c => c.find('looks_sayforsecs').some(({t, b}) => !/^(Hallo!|Hello!|)$/.test(c.text(t, b, 'MESSAGE')))},
                        {text: 'Mit der grünen Flagge testen', check: c => c.flags > 0 && inScript(c, 'looks_sayforsecs', 'event_whenflagclicked')}
                    ],
                    hints: [
                        {drag: 'looks_sayforsecs', to: 'under:motion_movesteps', ghost: 'say [Hallo!] for (2) seconds', text: 'Unten anhängen', done: c => inScript(c, 'looks_sayforsecs', 'event_whenflagclicked')},
                        {target: 'ws:looks_sayforsecs', text: 'Klicke auf „Hallo!“ und tippe deinen Text', done: c => c.find('looks_sayforsecs').some(({t, b}) => !/^(Hallo!|Hello!|)$/.test(c.text(t, b, 'MESSAGE')))},
                        {target: 'flag', text: 'Teste es!', done: c => c.flags > 0}
                    ]
                },
                {
                    kind: 'creative',
                    title: 'Kreativ: Deine Welt',
                    text: '<p>Jetzt bist du dran! Such dir eine <b>Figur</b> und einen <b>Hintergrund</b> aus, die dir gefallen. Fahre dazu mit der Maus über die runden Knöpfe unten rechts und klicke auf die Lupe.</p>',
                    tasks: [
                        {text: 'Eine neue Figur aussuchen', check: c => newSprites(c) > 0},
                        {text: 'Einen Hintergrund aussuchen', check: c => c.backdropChanged()}
                    ],
                    hints: [
                        {target: 'spriteAdd', text: 'Neue Figur', done: c => newSprites(c) > 0},
                        {target: 'backdropAdd', text: 'Neuer Hintergrund', done: c => c.backdropChanged()}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Steuern mit den Pfeiltasten',
                    text: '<p>Deine Figur soll sich mit der Tastatur bewegen. Nimm <b>Wenn Taste Leertaste gedrückt wird</b>, stelle <b>Pfeil nach rechts</b> ein und hänge <b>ändere x um 10</b> darunter.</p>' +
                        '<p>Danach dasselbe für <b>Pfeil nach links</b> mit <b>-10</b>.</p>',
                    blocks: 'when [Pfeil nach rechts v] key pressed\nchange x by (10)\n\nwhen [Pfeil nach links v] key pressed\nchange x by (-10)',
                    tasks: [
                        {text: 'Pfeil nach rechts → ändere x um 10', check: c => keyScript(c, 'right arrow', 'motion_changexby')},
                        {text: 'Pfeil nach links → ändere x um -10', check: c => keyScript(c, 'left arrow', 'motion_changexby')},
                        {text: 'Ausprobieren: Drücke die Pfeiltasten', check: c => c.keys.has('right arrow') || c.keys.has('left arrow')}
                    ],
                    hints: [
                        {drag: 'event_whenkeypressed', to: 'ws', ghost: 'when [Leertaste v] key pressed', text: 'Ziehe den Block herüber', done: c => c.find('event_whenkeypressed').length > 0},
                        {target: 'ws:event_whenkeypressed', text: 'Klicke auf „Leertaste“ und wähle „Pfeil nach rechts“', done: c => c.find('event_whenkeypressed').some(({b}) => /arrow/.test(c.field(b, 'KEY_OPTION')))},
                        {drag: 'motion_changexby', to: 'under:event_whenkeypressed', ghost: 'change x by (10)', text: 'Darunter hängen', done: c => keyScript(c, 'right arrow', 'motion_changexby') || keyScript(c, 'left arrow', 'motion_changexby')},
                        {target: 'stage', text: 'Klicke auf die Bühne und drücke die Pfeiltasten', done: c => keyScript(c, 'right arrow', 'motion_changexby') && keyScript(c, 'left arrow', 'motion_changexby')}
                    ]
                },
                {
                    kind: 'challenge',
                    title: 'Challenge: Hoch und runter',
                    text: '<p>Schaffst du es allein? Lass deine Figur mit <b>Pfeil nach oben</b> und <b>Pfeil nach unten</b> fliegen.</p>' +
                        '<p>Tipp: Für oben und unten brauchst du <b>ändere y um</b>.</p>',
                    blocks: 'when [Pfeil nach oben v] key pressed\nchange y by (10)\n\nwhen [Pfeil nach unten v] key pressed\nchange y by (-10)',
                    autoHints: false,
                    tasks: [
                        {text: 'Pfeil nach oben → ändere y um 10', check: c => keyScript(c, 'up arrow', 'motion_changeyby')},
                        {text: 'Pfeil nach unten → ändere y um -10', check: c => keyScript(c, 'down arrow', 'motion_changeyby')}
                    ],
                    hints: [
                        {drag: 'event_whenkeypressed', to: 'ws', ghost: 'when [Pfeil nach oben v] key pressed', text: 'Neuer Tasten-Block', done: c => keyScript(c, 'up arrow', 'motion_changeyby') || c.find('event_whenkeypressed').length > 2},
                        {drag: 'motion_changeyby', to: 'under:event_whenkeypressed', ghost: 'change y by (10)', text: 'ändere y um 10', done: c => keyScript(c, 'up arrow', 'motion_changeyby') && keyScript(c, 'down arrow', 'motion_changeyby')}
                    ]
                },
                {
                    kind: 'game',
                    title: 'Zwischenspiel: Klick-Jagd',
                    text: '<p>Wir bauen ein kleines Spiel: Wenn du die Figur anklickst, springt sie woanders hin und du bekommst einen Punkt.</p>' +
                        '<p>Für die Punkte legst du unter <b>Variablen</b> eine <b>neue Variable</b> namens <b>Punkte</b> an.</p>',
                    blocks: 'when this sprite clicked\ngo to (Zufallsposition v)\nchange [Punkte v] by (1)',
                    tasks: [
                        {text: 'Wenn diese Figur angeklickt wird → gehe zu Zufallsposition', check: c => inScript(c, 'motion_goto', 'event_whenthisspriteclicked', (t, b) => c.menu(t, b, 'TO') === '_random_')},
                        {text: 'Variable „Punkte“ anlegen', check: c => !!userVar(c)},
                        {text: '„ändere Punkte um 1“ anhängen', check: c => inScript(c, 'data_changevariableby', 'event_whenthisspriteclicked')},
                        {text: 'Spielen: Hol dir 5 Punkte!', check: c => c.vars().some(v => Number(v.value) >= 5)}
                    ],
                    hints: [
                        {drag: 'event_whenthisspriteclicked', to: 'ws', ghost: 'when this sprite clicked', text: 'Ziehe ihn herüber', done: c => c.find('event_whenthisspriteclicked').length > 0},
                        {drag: 'motion_goto', to: 'under:event_whenthisspriteclicked', ghost: 'go to (Zufallsposition v)', text: 'Darunter hängen', done: c => inScript(c, 'motion_goto', 'event_whenthisspriteclicked')},
                        {target: 'flybtn:Neue Variable', text: 'Neue Variable „Punkte“', done: c => !!userVar(c)},
                        {drag: 'data_changevariableby', to: 'under:event_whenthisspriteclicked', ghost: 'change [Punkte v] by (1)', text: 'Punkte dazuzählen', done: c => inScript(c, 'data_changevariableby', 'event_whenthisspriteclicked')},
                        {target: 'stage', text: 'Fang die Figur!', done: c => c.vars().some(v => Number(v.value) >= 5)}
                    ]
                },
                {
                    kind: 'creative',
                    title: 'Kreativ: Mach es zu deinem Spiel',
                    text: '<p>Peppe dein Spiel auf! Ein paar Ideen:</p><ul>' +
                        '<li>Ein <b>Klang</b>, wenn man die Figur trifft</li>' +
                        '<li>Die Figur wechselt ihr <b>Kostüm</b> oder ihre <b>Farbe</b></li>' +
                        '<li>Am Anfang werden die Punkte auf 0 gesetzt</li></ul>',
                    blocks: 'when this sprite clicked\nstart sound (Plopp v)\nchange [Farbe v] effect by (25)\ngo to (Zufallsposition v)\nchange [Punkte v] by (1)\n\nwhen flag clicked\nset [Punkte v] to (0)',
                    autoHints: false,
                    tasks: [
                        {text: 'Mindestens eine Idee eingebaut', check: c => ['sound_play', 'sound_playuntildone', 'looks_nextcostume', 'looks_switchcostumeto', 'looks_changeeffectby', 'data_setvariableto'].some(op => c.find(op).length > 0)},
                        {text: 'Ich habe mein Spiel getestet', manual: true}
                    ],
                    hints: [
                        {drag: 'sound_play', to: 'under:event_whenthisspriteclicked', ghost: 'start sound (Plopp v)', text: 'Ein Klang beim Treffen', done: c => c.find('sound_play').length > 0}
                    ]
                }
            ]
        },
        {
            id: 'tanz',
            title: 'Animation: Tanz-Party',
            level: 'neuling',
            type: 'Animation',
            icon: '💃',
            autoHints: true,
            steps: [
                {
                    kind: 'info',
                    title: 'Wie funktioniert Animation?',
                    text: '<p>Kennst du ein <b>Daumenkino</b>? Viele Bilder, die schnell nacheinander kommen, sehen aus wie eine Bewegung. Genau so funktionieren Zeichentrickfilme.</p>' +
                        '<p>In Scratch heißen die Bilder einer Figur <b>Kostüme</b>. Wechselst du sie schnell, fängt deine Figur an zu tanzen!</p>'
                },
                {
                    kind: 'creative',
                    title: 'Tänzer und Bühne',
                    text: '<p>Such dir eine Figur aus der Kategorie <b>Tanz</b> aus – die haben viele Kostüme. Dazu passt ein Hintergrund wie <b>Spotlight</b> oder <b>Concert</b>.</p>',
                    tasks: [
                        {text: 'Eine Tanz-Figur aussuchen', check: c => newSprites(c) > 0},
                        {text: 'Einen Hintergrund aussuchen', check: c => c.backdropChanged()}
                    ],
                    hints: [
                        {target: 'spriteAdd', text: 'Neue Figur – Kategorie „Tanz“', done: c => newSprites(c) > 0},
                        {target: 'backdropAdd', text: 'Neuer Hintergrund', done: c => c.backdropChanged()}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Schau dir die Kostüme an',
                    text: '<p>Wähle deine Tanz-Figur aus und öffne oben den Tab <b>Kostüme</b>. Dort siehst du alle Bilder der Figur. Danach geht es zurück zu <b>Skripte</b>.</p>',
                    tasks: [
                        {text: 'Tab „Kostüme“ öffnen', check: c => c.tab('costumes')},
                        {text: 'Zurück zum Tab „Skripte“', check: c => c.tabSeen('costumes') && c.tab('code')},
                        {text: 'Ich habe gezählt, wie viele Kostüme meine Figur hat', manual: true}
                    ],
                    hints: [
                        {target: 'tab:costumes', text: 'Hier sind die Kostüme', done: c => c.tabSeen('costumes')},
                        {target: 'tab:code', text: 'Zurück zu den Skripten', done: c => c.tab('code')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Kostüme wechseln',
                    text: '<p>Jetzt bewegt sich deine Figur: <b>wechsle zum nächsten Kostüm</b>, kurz <b>warten</b> – und das 10-mal.</p>' +
                        '<p>Probier verschiedene Wartezeiten aus. Was passiert bei 0.1, was bei 1?</p>',
                    blocks: 'when flag clicked\nrepeat (10)\n  next costume\n  wait (0.3) seconds\nend',
                    tasks: [
                        {text: 'Wenn grüne Flagge → wiederhole 10 mal', check: c => inScript(c, 'control_repeat', 'event_whenflagclicked')},
                        {text: '„wechsle zum nächsten Kostüm“ in die Schleife', check: c => inside(c, 'looks_nextcostume', 'control_repeat')},
                        {text: '„warte“ in die Schleife', check: c => inside(c, 'control_wait', 'control_repeat')},
                        {text: 'Grüne Flagge klicken', check: c => c.flags > 0 && inside(c, 'looks_nextcostume', 'control_repeat')}
                    ],
                    hints: [
                        {drag: 'event_whenflagclicked', to: 'ws', ghost: 'when flag clicked', text: 'Start-Block', done: c => c.editingHas('event_whenflagclicked')},
                        {drag: 'control_repeat', to: 'under:event_whenflagclicked', ghost: 'repeat (10)\nend', text: 'Schleife darunter', done: c => inScript(c, 'control_repeat', 'event_whenflagclicked')},
                        {drag: 'looks_nextcostume', to: 'inside:control_repeat', ghost: 'next costume', text: 'In die Schleife', done: c => inside(c, 'looks_nextcostume', 'control_repeat')},
                        {drag: 'control_wait', to: 'under:looks_nextcostume', ghost: 'wait (1) seconds', text: 'Kurz warten', done: c => inside(c, 'control_wait', 'control_repeat')},
                        {target: 'ws:control_wait', text: 'Tippe 0.3 ein', done: c => c.find('control_wait').some(({t, b}) => Number(c.text(t, b, 'DURATION')) < 1)},
                        {target: 'flag', text: 'Tanz los!', done: c => c.flags > 0}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Tanzen ohne Ende – mit Musik',
                    text: '<p>Tausche <b>wiederhole 10 mal</b> gegen <b>wiederhole fortlaufend</b>. Dann brauchst du noch Musik: Im Tab <b>Klänge</b> findest du unter <b>Schleifen</b> Tanzmusik.</p>',
                    blocks: 'when flag clicked\nforever\n  next costume\n  wait (0.3) seconds\nend\n\nwhen flag clicked\nforever\n  play sound (Dance Around v) until done\nend',
                    tasks: [
                        {text: 'Kostüme wechseln in „wiederhole fortlaufend“', check: c => inside(c, 'looks_nextcostume', 'control_forever')},
                        {text: 'Musik in einer eigenen Schleife', check: c => inside(c, 'sound_playuntildone', 'control_forever') || inside(c, 'sound_play', 'control_forever')}
                    ],
                    hints: [
                        {drag: 'control_forever', to: 'ws', ghost: 'forever\nend', text: 'Endlos-Schleife', done: c => c.find('control_forever').length > 0},
                        {drag: 'looks_nextcostume', to: 'inside:control_forever', ghost: 'next costume', text: 'Kostüm wechseln', done: c => inside(c, 'looks_nextcostume', 'control_forever')},
                        {target: 'tab:sounds', text: 'Musik aussuchen (Kategorie „Schleifen“)', done: c => c.tab('sounds') || c.find('sound_playuntildone').length > 0},
                        {drag: 'sound_playuntildone', to: 'ws', ghost: 'play sound (Miau v) until done', text: 'Musik abspielen', done: c => inside(c, 'sound_playuntildone', 'control_forever') || inside(c, 'sound_play', 'control_forever')}
                    ]
                },
                {
                    kind: 'creative',
                    title: 'Kreativ: Disco-Lichter',
                    text: '<p>Bei einer Party blinkt das Licht! Lass deine Figur oder die Bühne die <b>Farbe</b> wechseln. Probiere auch andere Effekte wie <b>Wirbel</b> oder <b>Fischauge</b>.</p>',
                    blocks: 'when flag clicked\nforever\n  change [Farbe v] effect by (25)\n  wait (0.5) seconds\nend',
                    tasks: [
                        {text: 'Ein Effekt in einer Schleife', check: c => inside(c, 'looks_changeeffectby', 'control_forever') || inside(c, 'looks_seteffectto', 'control_forever')}
                    ],
                    hints: [
                        {drag: 'looks_changeeffectby', to: 'inside:control_forever', ghost: 'change [Farbe v] effect by (25)', text: 'Farbe ändern', done: c => inside(c, 'looks_changeeffectby', 'control_forever')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Ein Tanzpartner',
                    text: '<p>Hol eine zweite Figur auf die Tanzfläche. Sie <b>gleitet</b> hin und her: erst nach links, dann nach rechts – für immer.</p>',
                    blocks: 'when flag clicked\nforever\n  glide (1) secs to x: (-150) y: (-50)\n  glide (1) secs to x: (150) y: (-50)\nend',
                    tasks: [
                        {text: 'Zweite Figur hinzufügen', check: c => newSprites(c) > 0},
                        {text: 'Zwei „gleite“-Blöcke in „wiederhole fortlaufend“', check: c => c.find('motion_glidesecstoxy').filter(({t, b}) => c.inC(t, b, 'control_forever')).length >= 2}
                    ],
                    hints: [
                        {target: 'spriteAdd', text: 'Neue Figur', done: c => newSprites(c) > 0},
                        {drag: 'event_whenflagclicked', to: 'ws', ghost: 'when flag clicked', text: 'Start-Block', done: c => c.editingHas('event_whenflagclicked')},
                        {drag: 'control_forever', to: 'under:event_whenflagclicked', ghost: 'forever\nend', text: 'Schleife', done: c => c.editingHas('control_forever')},
                        {drag: 'motion_glidesecstoxy', to: 'inside:control_forever', ghost: 'glide (1) secs to x: (0) y: (0)', text: 'Gleiten – zweimal!', done: c => c.find('motion_glidesecstoxy').filter(({t, b}) => c.inC(t, b, 'control_forever')).length >= 2}
                    ]
                },
                {
                    kind: 'challenge',
                    title: 'Challenge: Tanzschritt auf Knopfdruck',
                    text: '<p>Wenn du die <b>Leertaste</b> drückst, macht deine Figur einen Spezial-Move: Sie dreht sich viermal und wird dabei größer.</p>' +
                        '<p>Tipp: <b>wiederhole 4 mal</b> mit <b>drehe dich um 90 Grad</b> und <b>ändere Größe um</b>.</p>',
                    blocks: 'when [Leertaste v] key pressed\nrepeat (4)\n  turn cw (90) degrees\n  change size by (10)\nend\nset size to (100) %',
                    autoHints: false,
                    tasks: [
                        {text: 'Leertaste startet eine Schleife mit Drehung', check: c => ['motion_turnright', 'motion_turnleft'].some(op => c.find(op).some(({t, b}) => c.inC(t, b, 'control_repeat') && c.hatOf(t, b).opcode === 'event_whenkeypressed'))},
                        {text: 'Die Größe ändert sich', check: c => c.find('looks_changesizeby').length > 0}
                    ],
                    hints: [
                        {drag: 'event_whenkeypressed', to: 'ws', ghost: 'when [Leertaste v] key pressed', text: 'Tasten-Start', done: c => c.find('event_whenkeypressed').length > 0},
                        {drag: 'control_repeat', to: 'under:event_whenkeypressed', ghost: 'repeat (4)\nend', text: '4-mal', done: c => inScript(c, 'control_repeat', 'event_whenkeypressed')},
                        {drag: 'motion_turnright', to: 'inside:control_repeat', ghost: 'turn cw (90) degrees', text: 'Drehen', done: c => inside(c, 'motion_turnright', 'control_repeat')},
                        {drag: 'looks_changesizeby', to: 'under:motion_turnright', ghost: 'change size by (10)', text: 'Wachsen', done: c => c.find('looks_changesizeby').length > 0}
                    ]
                },
                {
                    kind: 'creative',
                    title: 'Kreativ: Deine Tanz-Show',
                    text: '<p>Mach eine richtige Show daraus! Ideen:</p><ul>' +
                        '<li>Mehr Tänzer mit eigenen Bewegungen</li>' +
                        '<li>Die Bühne wechselt das Bühnenbild im Takt</li>' +
                        '<li>Ein Moderator sagt die Show an</li></ul>',
                    blocks: 'when flag clicked\nforever\n  next backdrop\n  wait (2) seconds\nend',
                    tasks: [
                        {text: 'Mindestens eine eigene Idee eingebaut', manual: true},
                        {text: 'Show jemandem vorgeführt', manual: true}
                    ]
                }
            ]
        },
        {
            id: 'fangen',
            title: 'Fang-Spiel mit der Maus',
            level: 'probiert',
            type: 'Spiel',
            icon: '🎯',
            autoHints: true,
            steps: [
                {
                    kind: 'info',
                    title: 'Das baust du jetzt',
                    text: '<p>Ein <b>Fänger</b> folgt deiner Maus. Damit fängst du ein Objekt, das danach woanders auftaucht. Jeder Fang gibt einen Punkt – aber pass auf den Gegner auf!</p>' +
                        '<p>Tipp: Starte mit <b>Datei → Neu</b> ein frisches Projekt. Die Katze ist dein Fänger.</p>'
                },
                {
                    kind: 'learn',
                    title: 'Der Fänger folgt der Maus',
                    text: '<p>Damit die Figur der Maus <b>die ganze Zeit</b> folgt, brauchst du eine Schleife: <b>wiederhole fortlaufend</b>. Darin steht <b>gehe zu Mauszeiger</b>.</p>',
                    blocks: 'when flag clicked\nforever\n  go to (Mauszeiger v)\nend',
                    tasks: [
                        {text: 'Wenn grüne Flagge → wiederhole fortlaufend', check: c => inScript(c, 'control_forever', 'event_whenflagclicked')},
                        {text: '„gehe zu Mauszeiger“ in die Schleife', check: c => inside(c, 'motion_goto', 'control_forever', (t, b) => c.menu(t, b, 'TO') === '_mouse_')},
                        {text: 'Flagge klicken und Maus bewegen', check: c => c.flags > 0 && inside(c, 'motion_goto', 'control_forever')}
                    ],
                    hints: [
                        {drag: 'event_whenflagclicked', to: 'ws', ghost: 'when flag clicked', text: 'Start-Block', done: c => c.find('event_whenflagclicked').length > 0},
                        {drag: 'control_forever', to: 'under:event_whenflagclicked', ghost: 'forever\nend', text: 'Schleife darunter', done: c => inScript(c, 'control_forever', 'event_whenflagclicked')},
                        {drag: 'motion_goto', to: 'inside:control_forever', ghost: 'go to (Zufallsposition v)', text: 'In die Schleife hinein', done: c => inside(c, 'motion_goto', 'control_forever')},
                        {target: 'ws:motion_goto', text: 'Wähle „Mauszeiger“ im Menü', done: c => inside(c, 'motion_goto', 'control_forever', (t, b) => c.menu(t, b, 'TO') === '_mouse_')},
                        {target: 'flag', text: 'Los geht\'s!', done: c => c.flags > 0}
                    ]
                },
                {
                    kind: 'creative',
                    title: 'Was willst du fangen?',
                    text: '<p>Such dir etwas zum Fangen aus: einen Apfel, einen Stern, einen Donut … oder <b>male selbst</b> etwas mit dem Pinsel!</p>',
                    tasks: [
                        {text: 'Neue Figur zum Fangen hinzufügen', check: c => newSprites(c) > 0}
                    ],
                    hints: [
                        {target: 'spriteAdd', text: 'Neue Figur', done: c => newSprites(c) > 0}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Gefangen!',
                    text: '<p>Wähle unten in der Figurenliste dein neues Objekt aus. Es prüft immer wieder: <b>Werde ich vom Fänger berührt?</b> Wenn ja, springt es an eine Zufallsposition.</p>',
                    blocks: 'when flag clicked\nforever\n  if <touching (Figur1 v)?> then\n    go to (Zufallsposition v)\n  end\nend',
                    tasks: [
                        {text: 'Wenn grüne Flagge → wiederhole fortlaufend → falls … dann', check: c => inside(c, 'control_if', 'control_forever')},
                        {text: 'Bedingung „wird Fänger berührt?“', check: c => inside(c, 'sensing_touchingobject', 'control_if', (t, b) => !/^_(mouse|edge)_$/.test(c.menu(t, b, 'TOUCHINGOBJECTMENU')))},
                        {text: '„gehe zu Zufallsposition“ in das falls', check: c => inside(c, 'motion_goto', 'control_if', (t, b) => c.menu(t, b, 'TO') === '_random_')}
                    ],
                    hints: [
                        {target: 'spriteList', text: 'Wähle zuerst dein neues Objekt aus', done: c => c.editing && c.editing !== c.sprites[0]},
                        {drag: 'event_whenflagclicked', to: 'ws', ghost: 'when flag clicked', text: 'Start-Block', done: c => c.editingHas('event_whenflagclicked')},
                        {drag: 'control_forever', to: 'under:event_whenflagclicked', ghost: 'forever\nend', text: 'Schleife', done: c => c.editingHas('control_forever')},
                        {drag: 'control_if', to: 'inside:control_forever', ghost: 'if <> then\nend', text: 'falls … dann hinein', done: c => inside(c, 'control_if', 'control_forever')},
                        {drag: 'sensing_touchingobject', to: 'cond:control_if', ghost: '<touching (Mauszeiger v)?>', text: 'In die Lücke', done: c => inside(c, 'sensing_touchingobject', 'control_if')},
                        {target: 'ws:sensing_touchingobject', text: 'Wähle deinen Fänger aus', done: c => inside(c, 'sensing_touchingobject', 'control_if', (t, b) => !/^_(mouse|edge)_$/.test(c.menu(t, b, 'TOUCHINGOBJECTMENU')))},
                        {drag: 'motion_goto', to: 'inside:control_if', ghost: 'go to (Zufallsposition v)', text: 'Weg hier!', done: c => inside(c, 'motion_goto', 'control_if')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Punkte zählen',
                    text: '<p>Lege eine Variable <b>Punkte</b> an. Am Anfang wird sie auf <b>0</b> gesetzt, bei jedem Fang um <b>1</b> erhöht.</p>',
                    blocks: 'when flag clicked\nset [Punkte v] to (0)\nforever\n  if <touching (Figur1 v)?> then\n    change [Punkte v] by (1)\n    go to (Zufallsposition v)\n  end\nend',
                    tasks: [
                        {text: 'Variable „Punkte“ anlegen', check: c => !!userVar(c)},
                        {text: '„setze Punkte auf 0“ direkt unter die Flagge', check: c => inScript(c, 'data_setvariableto', 'event_whenflagclicked')},
                        {text: '„ändere Punkte um 1“ in das falls', check: c => inside(c, 'data_changevariableby', 'control_if')}
                    ],
                    hints: [
                        {target: 'cat:variables', text: 'Variablen', done: c => !!userVar(c) || c.categoryOpen('variables')},
                        {target: 'flybtn:Neue Variable', text: 'Neue Variable', done: c => !!userVar(c)},
                        {drag: 'data_setvariableto', to: 'under:event_whenflagclicked', ghost: 'set [Punkte v] to (0)', text: 'Unter die Flagge', done: c => inScript(c, 'data_setvariableto', 'event_whenflagclicked')},
                        {drag: 'data_changevariableby', to: 'inside:control_if', ghost: 'change [Punkte v] by (1)', text: 'In das falls', done: c => inside(c, 'data_changevariableby', 'control_if')}
                    ]
                },
                {
                    kind: 'creative',
                    title: 'Kreativ: Mit Klang!',
                    text: '<p>Ein Spiel macht mehr Spaß mit Geräuschen. Suche dir im Tab <b>Klänge</b> einen Klang aus und spiele ihn beim Fangen ab.</p>',
                    blocks: 'if <touching (Figur1 v)?> then\n  start sound (Plopp v)\n  change [Punkte v] by (1)\n  go to (Zufallsposition v)\nend',
                    tasks: [
                        {text: 'Klang im falls abspielen', check: c => inside(c, 'sound_play', 'control_if') || inside(c, 'sound_playuntildone', 'control_if')}
                    ],
                    hints: [
                        {drag: 'sound_play', to: 'inside:control_if', ghost: 'start sound (Plopp v)', text: 'Klang beim Fangen', done: c => inside(c, 'sound_play', 'control_if') || inside(c, 'sound_playuntildone', 'control_if')}
                    ]
                },
                {
                    kind: 'challenge',
                    title: 'Challenge: 30 Sekunden',
                    text: '<p>Wie viele Punkte schaffst du in <b>30 Sekunden</b>? Baue einen Countdown mit der <b>Stoppuhr</b> aus der Kategorie <b>Fühlen</b>.</p>',
                    blocks: 'when flag clicked\nreset timer\nwait until <(timer) > (30)>\nstop [alles v]',
                    autoHints: false,
                    tasks: [
                        {text: 'Stoppuhr zurücksetzen', check: c => c.find('sensing_resettimer').length > 0},
                        {text: 'warte bis Stoppuhr > 30', check: c => c.find('sensing_timer').length > 0 && c.find('control_wait_until').length > 0},
                        {text: 'stoppe alles', check: c => c.find('control_stop').length > 0}
                    ],
                    hints: [
                        {drag: 'sensing_resettimer', to: 'ws', ghost: 'reset timer', text: 'Stoppuhr auf 0', done: c => c.find('sensing_resettimer').length > 0},
                        {drag: 'control_wait_until', to: 'under:sensing_resettimer', ghost: 'wait until <>', text: 'Warten …', done: c => c.find('control_wait_until').length > 0},
                        {drag: 'control_stop', to: 'under:control_wait_until', ghost: 'stop [alles v]', text: '… und Ende', done: c => c.find('control_stop').length > 0}
                    ]
                },
                {
                    kind: 'creative',
                    title: 'Kreativ: Ein Gegner',
                    text: '<p>Füge einen <b>Gegner</b> hinzu, der über die Bühne gleitet. Wenn er den Fänger berührt, verlierst du einen Punkt – oder das Spiel ist vorbei. Du entscheidest!</p>',
                    blocks: 'when flag clicked\nforever\n  glide (1) secs to (Zufallsposition v)\nend\n\nwhen flag clicked\nforever\n  if <touching (Figur1 v)?> then\n    change [Punkte v] by (-1)\n    wait (1) seconds\n  end\nend',
                    autoHints: false,
                    tasks: [
                        {text: 'Gegner-Figur hinzufügen', check: c => newSprites(c) > 0},
                        {text: 'Gegner gleitet herum', check: c => inside(c, 'motion_glideto', 'control_forever')},
                        {text: 'Etwas passiert bei Berührung', manual: true}
                    ],
                    hints: [
                        {target: 'spriteAdd', text: 'Neue Figur', done: c => newSprites(c) > 0},
                        {drag: 'motion_glideto', to: 'inside:control_forever', ghost: 'glide (1) secs to (Zufallsposition v)', text: 'Gleiten in der Schleife', done: c => inside(c, 'motion_glideto', 'control_forever')}
                    ]
                },
                {
                    kind: 'game',
                    title: 'Zwischenspiel: Highscore!',
                    text: '<p>Dein Spiel ist fertig – jetzt wird gespielt! Schaffst du <b>10 Punkte</b>? Fordere danach deine Nachbarin oder deinen Nachbarn heraus.</p>',
                    tasks: [
                        {text: '10 Punkte erreichen', check: c => c.vars().some(v => Number(v.value) >= 10)}
                    ],
                    hints: [
                        {target: 'flag', text: 'Start!', done: c => c.flags > 0}
                    ]
                }
            ]
        },
        {
            id: 'geschichte',
            title: 'Animation: Trickfilm',
            level: 'probiert',
            type: 'Animation',
            icon: '🎬',
            autoHints: true,
            steps: [
                {
                    kind: 'info',
                    title: 'Du wirst Regisseur!',
                    text: '<p>In diesem Kapitel drehst du einen kleinen <b>Trickfilm</b>: Zwei Figuren unterhalten sich, dann wechselt die Szene und jemand Neues tritt auf.</p>' +
                        '<p>Wie beim Film gibt es <b>Regieanweisungen</b>: In Scratch heißen sie <b>Nachrichten</b>.</p>'
                },
                {
                    kind: 'creative',
                    title: 'Bühne frei',
                    text: '<p>Such dir einen <b>Hintergrund</b> für die erste Szene und <b>zwei Figuren</b> aus, die sich unterhalten. Ein Drache und eine Ritterin? Ein Hai und ein Fisch? Du entscheidest!</p>',
                    tasks: [
                        {text: 'Hintergrund für Szene 1', check: c => c.backdropChanged()},
                        {text: 'Zwei Figuren für die Geschichte', check: c => newSprites(c) >= 2 || c.sprites.length >= 2}
                    ],
                    hints: [
                        {target: 'backdropAdd', text: 'Hintergrund wählen', done: c => c.backdropChanged()},
                        {target: 'spriteAdd', text: 'Figuren wählen', done: c => newSprites(c) >= 2 || c.sprites.length >= 2}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Der erste Dialog',
                    text: '<p>Die erste Figur sagt etwas. Die zweite <b>wartet 2 Sekunden</b> und antwortet dann – sonst reden beide gleichzeitig.</p>',
                    blocks: 'when flag clicked\nsay [Hallo! Wer bist du?] for (2) seconds\n\nwhen flag clicked\nwait (2) seconds\nsay [Ich bin ein Drache!] for (2) seconds',
                    tasks: [
                        {text: 'Figur 1: Wenn Flagge → sage …', check: c => c.spritesWith('looks_sayforsecs', (t, b) => c.hatOf(t, b).opcode === 'event_whenflagclicked') >= 1},
                        {text: 'Figur 2: Wenn Flagge → warte 2 Sekunden → sage …', check: c => c.spritesWith('looks_sayforsecs', (t, b) => c.hatOf(t, b).opcode === 'event_whenflagclicked') >= 2 && inScript(c, 'control_wait', 'event_whenflagclicked')},
                        {text: 'Mit der grünen Flagge anschauen', check: c => c.flags > 0}
                    ],
                    hints: [
                        {drag: 'event_whenflagclicked', to: 'ws', ghost: 'when flag clicked', text: 'Start-Block', done: c => c.editingHas('event_whenflagclicked')},
                        {drag: 'looks_sayforsecs', to: 'under:event_whenflagclicked', ghost: 'say [Hallo!] for (2) seconds', text: 'Etwas sagen', done: c => c.editingHas('looks_sayforsecs')},
                        {target: 'spriteList', text: 'Jetzt die zweite Figur auswählen', done: c => c.spritesWith('looks_sayforsecs') >= 2 || (c.editing && !c.editingHas('looks_sayforsecs'))},
                        {drag: 'event_whenflagclicked', to: 'ws', ghost: 'when flag clicked', text: 'Start-Block', done: c => c.editingHas('event_whenflagclicked')},
                        {drag: 'control_wait', to: 'under:event_whenflagclicked', ghost: 'wait (2) seconds', text: 'Erst warten …', done: c => c.editingHas('control_wait')},
                        {drag: 'looks_sayforsecs', to: 'under:control_wait', ghost: 'say [Hallo!] for (2) seconds', text: '… dann antworten', done: c => c.spritesWith('looks_sayforsecs') >= 2},
                        {target: 'flag', text: 'Film ab!', done: c => c.flags > 0}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Regie mit Nachrichten',
                    text: '<p>Mit Warten wird es bei langen Dialogen schnell kompliziert. Besser: Figur 1 <b>sendet eine Nachricht</b>, wenn sie fertig ist. Figur 2 startet erst, <b>wenn sie die Nachricht empfängt</b>.</p>' +
                        '<p>Im Menü des Blocks kannst du eine <b>neue Nachricht</b> anlegen, z. B. „Antwort“.</p>',
                    blocks: 'when flag clicked\nsay [Hallo! Wer bist du?] for (2) seconds\nbroadcast (Antwort v)\n\nwhen I receive [Antwort v]\nsay [Ich bin ein Drache!] for (2) seconds',
                    tasks: [
                        {text: 'Figur 1 sendet eine Nachricht', check: c => c.find('event_broadcast').length + c.find('event_broadcastandwait').length > 0},
                        {text: 'Figur 2: Wenn ich … empfange → sage …', check: c => inScript(c, 'looks_sayforsecs', 'event_whenbroadcastreceived')}
                    ],
                    hints: [
                        {drag: 'event_broadcast', to: 'under:looks_sayforsecs', ghost: 'broadcast (Nachricht1 v)', text: 'Nachricht senden', done: c => c.find('event_broadcast').length + c.find('event_broadcastandwait').length > 0},
                        {target: 'spriteList', text: 'Zur zweiten Figur wechseln', done: c => c.find('event_whenbroadcastreceived').length > 0 || (c.editing && !c.editingHas('event_broadcast'))},
                        {drag: 'event_whenbroadcastreceived', to: 'ws', ghost: 'when I receive [Nachricht1 v]', text: 'Auf die Nachricht warten', done: c => c.find('event_whenbroadcastreceived').length > 0},
                        {drag: 'looks_sayforsecs', to: 'under:event_whenbroadcastreceived', ghost: 'say [Hallo!] for (2) seconds', text: 'Antworten', done: c => inScript(c, 'looks_sayforsecs', 'event_whenbroadcastreceived')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Szenenwechsel',
                    text: '<p>Ein Film hat mehrere Szenen. Füge ein <b>zweites Bühnenbild</b> hinzu. Am Anfang wird immer Szene 1 gezeigt, nach dem Dialog wechselt das Bild.</p>',
                    blocks: 'when flag clicked\nswitch backdrop to (Szene 1 v)\nsay [Hallo! Wer bist du?] for (2) seconds\nbroadcast (Antwort v)\n\nwhen I receive [Antwort v]\nsay [Ich bin ein Drache!] for (2) seconds\nswitch backdrop to (Szene 2 v)',
                    tasks: [
                        {text: 'Zweites Bühnenbild hinzufügen', check: c => !!c.stage && c.stage.getCostumes().length >= 2},
                        {text: 'Am Anfang: wechsle zu Bühnenbild (Szene 1)', check: c => inScript(c, 'looks_switchbackdropto', 'event_whenflagclicked')},
                        {text: 'Nach dem Dialog: wechsle zu Szene 2', check: c => c.find('looks_switchbackdropto').length >= 2}
                    ],
                    hints: [
                        {target: 'backdropAdd', text: 'Zweites Bühnenbild', done: c => !!c.stage && c.stage.getCostumes().length >= 2},
                        {drag: 'looks_switchbackdropto', to: 'under:event_whenflagclicked', ghost: 'switch backdrop to (backdrop1 v)', text: 'Start mit Szene 1', done: c => inScript(c, 'looks_switchbackdropto', 'event_whenflagclicked')},
                        {drag: 'looks_switchbackdropto', to: 'under:event_whenbroadcastreceived', ghost: 'switch backdrop to (backdrop1 v)', text: 'Dann Szene 2', done: c => c.find('looks_switchbackdropto').length >= 2}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Großer Auftritt',
                    text: '<p>In Szene 2 taucht eine <b>neue Figur</b> auf! Am Anfang ist sie <b>versteckt</b>. Wenn das Bühnenbild wechselt, <b>zeigt sie sich</b> und gleitet herein.</p>',
                    blocks: 'when flag clicked\nhide\ngo to x: (-240) y: (0)\n\nwhen backdrop switches to [Szene 2 v]\nshow\nglide (2) secs to x: (0) y: (0)',
                    tasks: [
                        {text: 'Neue Figur hinzufügen', check: c => newSprites(c) > 0},
                        {text: 'Am Anfang: verstecke dich', check: c => inScript(c, 'looks_hide', 'event_whenflagclicked')},
                        {text: 'Wenn das Bühnenbild wechselt → zeige dich', check: c => inScript(c, 'looks_show', 'event_whenbackdropswitchesto')},
                        {text: '… und gleite herein', check: c => inScript(c, 'motion_glidesecstoxy', 'event_whenbackdropswitchesto') || inScript(c, 'motion_glideto', 'event_whenbackdropswitchesto')}
                    ],
                    hints: [
                        {target: 'spriteAdd', text: 'Neue Figur', done: c => newSprites(c) > 0},
                        {drag: 'looks_hide', to: 'under:event_whenflagclicked', ghost: 'hide', text: 'Erst unsichtbar', done: c => inScript(c, 'looks_hide', 'event_whenflagclicked')},
                        {drag: 'event_whenbackdropswitchesto', to: 'ws', ghost: 'when backdrop switches to [backdrop1 v]', text: 'Wenn Szene 2 kommt …', done: c => c.find('event_whenbackdropswitchesto').length > 0},
                        {drag: 'looks_show', to: 'under:event_whenbackdropswitchesto', ghost: 'show', text: '… zeig dich', done: c => inScript(c, 'looks_show', 'event_whenbackdropswitchesto')},
                        {drag: 'motion_glidesecstoxy', to: 'under:looks_show', ghost: 'glide (1) secs to x: (0) y: (0)', text: 'Hereingleiten', done: c => inScript(c, 'motion_glidesecstoxy', 'event_whenbackdropswitchesto')}
                    ]
                },
                {
                    kind: 'challenge',
                    title: 'Challenge: Du entscheidest!',
                    text: '<p>Mach eine <b>interaktive Geschichte</b>: Eine Figur fragt, wohin die Reise geht. Je nach <b>Antwort</b> wechselt das Bühnenbild.</p>',
                    blocks: 'ask [Wohin soll die Reise gehen? Wald oder Meer?] and wait\nif <(answer) = [Wald]> then\n  switch backdrop to (Forest v)\nelse\n  switch backdrop to (Underwater 1 v)\nend',
                    autoHints: false,
                    tasks: [
                        {text: 'frage … und warte', check: c => c.find('sensing_askandwait').length > 0},
                        {text: 'falls Antwort = … dann / sonst', check: c => inside(c, 'sensing_answer', 'control_if_else') || inside(c, 'sensing_answer', 'control_if')},
                        {text: 'Je nach Antwort ein anderes Bühnenbild', check: c => inside(c, 'looks_switchbackdropto', 'control_if_else') || inside(c, 'looks_switchbackdropto', 'control_if')}
                    ],
                    hints: [
                        {drag: 'sensing_askandwait', to: 'ws', ghost: 'ask [Wie heißt du?] and wait', text: 'Frage stellen', done: c => c.find('sensing_askandwait').length > 0},
                        {drag: 'control_if_else', to: 'under:sensing_askandwait', ghost: 'if <> then\nelse\nend', text: 'falls … sonst', done: c => c.find('control_if_else').length > 0},
                        {drag: 'operator_equals', to: 'cond:control_if_else', ghost: '<[] = (50)>', text: 'Vergleich', done: c => inside(c, 'operator_equals', 'control_if_else')},
                        {drag: 'sensing_answer', to: 'cond:operator_equals', ghost: '(answer)', text: 'Antwort hinein', done: c => inside(c, 'sensing_answer', 'control_if_else')}
                    ]
                },
                {
                    kind: 'creative',
                    title: 'Kreativ: Abspann',
                    text: '<p>Jeder Film braucht ein Ende! Male ein Bühnenbild mit <b>ENDE</b> oder deinem Namen als Regisseur. Ideen:</p><ul>' +
                        '<li>Musik im Abspann</li><li>Die Figuren verbeugen sich</li><li>Ein Bonus-Szene nach dem Abspann</li></ul>',
                    tasks: [
                        {text: 'Abspann-Szene gebaut', manual: true},
                        {text: 'Film jemandem vorgeführt', manual: true}
                    ]
                }
            ]
        },
        {
            id: 'huepf',
            title: 'Hüpf-Spiel',
            level: 'probiert',
            type: 'Spiel',
            icon: '🦘',
            autoHints: true,
            steps: [
                {
                    kind: 'info',
                    title: 'Jump and Run',
                    text: '<p>Hindernisse rollen von rechts heran – deine Figur muss <b>darüber springen</b>. Jeder geschaffte Sprung gibt einen Punkt.</p>' +
                        '<p>Tipp: Starte mit <b>Datei → Neu</b>.</p>'
                },
                {
                    kind: 'creative',
                    title: 'Deine Spielwelt',
                    text: '<p>Such dir einen Hintergrund mit Boden aus, z. B. <b>Blue Sky</b> oder <b>Desert</b>. Deine Spielfigur kann die Katze sein – oder du suchst dir eine andere aus.</p>',
                    tasks: [
                        {text: 'Hintergrund aussuchen', check: c => c.backdropChanged()},
                        {text: 'Spielfigur festgelegt', manual: true}
                    ],
                    hints: [
                        {target: 'backdropAdd', text: 'Hintergrund', done: c => c.backdropChanged()}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Springen',
                    text: '<p>Beim Druck auf die <b>Leertaste</b> geht die Figur 10-mal ein Stück <b>nach oben</b> und dann 10-mal <b>nach unten</b>. Am Anfang steht sie links unten.</p>',
                    blocks: 'when flag clicked\ngo to x: (-150) y: (-100)\n\nwhen [Leertaste v] key pressed\nrepeat (10)\n  change y by (15)\nend\nrepeat (10)\n  change y by (-15)\nend',
                    tasks: [
                        {text: 'Start: gehe zu x: -150 y: -100', check: c => inScript(c, 'motion_gotoxy', 'event_whenflagclicked')},
                        {text: 'Leertaste: hoch …', check: c => c.find('motion_changeyby').some(({t, b}) => c.inC(t, b, 'control_repeat') && c.hatOf(t, b).opcode === 'event_whenkeypressed' && Number(c.text(t, b, 'DY')) > 0)},
                        {text: '… und wieder runter', check: c => c.find('motion_changeyby').some(({t, b}) => c.inC(t, b, 'control_repeat') && c.hatOf(t, b).opcode === 'event_whenkeypressed' && Number(c.text(t, b, 'DY')) < 0)},
                        {text: 'Springen ausprobieren', check: c => c.keys.has('space')}
                    ],
                    hints: [
                        {drag: 'event_whenflagclicked', to: 'ws', ghost: 'when flag clicked', text: 'Start-Block', done: c => c.editingHas('event_whenflagclicked')},
                        {drag: 'motion_gotoxy', to: 'under:event_whenflagclicked', ghost: 'go to x: (0) y: (0)', text: 'Startposition', done: c => inScript(c, 'motion_gotoxy', 'event_whenflagclicked')},
                        {drag: 'event_whenkeypressed', to: 'ws', ghost: 'when [Leertaste v] key pressed', text: 'Sprung-Taste', done: c => c.find('event_whenkeypressed').length > 0},
                        {drag: 'control_repeat', to: 'under:event_whenkeypressed', ghost: 'repeat (10)\nend', text: 'Schleife', done: c => inScript(c, 'control_repeat', 'event_whenkeypressed')},
                        {drag: 'motion_changeyby', to: 'inside:control_repeat', ghost: 'change y by (10)', text: 'Hoch!', done: c => inside(c, 'motion_changeyby', 'control_repeat')},
                        {drag: 'control_repeat', to: 'under:control_repeat', ghost: 'repeat (10)\nend', text: 'Zweite Schleife – runter', done: c => c.find('motion_changeyby').filter(({t, b}) => c.inC(t, b, 'control_repeat')).length >= 2},
                        {target: 'stage', text: 'Klicke auf die Bühne und drücke die Leertaste', done: c => c.keys.has('space')}
                    ]
                },
                {
                    kind: 'creative',
                    title: 'Das Hindernis',
                    text: '<p>Füge ein Hindernis hinzu, z. B. einen <b>Stein</b>, einen <b>Kaktus</b> oder male eins. Es startet rechts und gleitet immer wieder nach links.</p>',
                    blocks: 'when flag clicked\nforever\n  go to x: (240) y: (-100)\n  glide (2) secs to x: (-240) y: (-100)\nend',
                    tasks: [
                        {text: 'Hindernis-Figur hinzufügen', check: c => newSprites(c) > 0},
                        {text: 'In der Schleife: rechts starten', check: c => inside(c, 'motion_gotoxy', 'control_forever')},
                        {text: 'In der Schleife: nach links gleiten', check: c => inside(c, 'motion_glidesecstoxy', 'control_forever')}
                    ],
                    hints: [
                        {target: 'spriteAdd', text: 'Neue Figur', done: c => newSprites(c) > 0},
                        {drag: 'event_whenflagclicked', to: 'ws', ghost: 'when flag clicked', text: 'Start-Block', done: c => c.editingHas('event_whenflagclicked')},
                        {drag: 'control_forever', to: 'under:event_whenflagclicked', ghost: 'forever\nend', text: 'Schleife', done: c => c.editingHas('control_forever')},
                        {drag: 'motion_gotoxy', to: 'inside:control_forever', ghost: 'go to x: (240) y: (-100)', text: 'Rechts starten', done: c => inside(c, 'motion_gotoxy', 'control_forever')},
                        {drag: 'motion_glidesecstoxy', to: 'under:motion_gotoxy', ghost: 'glide (2) secs to x: (-240) y: (-100)', text: 'Nach links gleiten', done: c => inside(c, 'motion_glidesecstoxy', 'control_forever')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Autsch!',
                    text: '<p>Berührt das Hindernis die Spielfigur, ist das Spiel vorbei. Das Hindernis bekommt dafür ein <b>zweites Skript</b>, weil das erste mit dem Gleiten beschäftigt ist.</p>',
                    blocks: 'when flag clicked\nforever\n  if <touching (Figur1 v)?> then\n    say [Autsch!] for (1) seconds\n    stop [alles v]\n  end\nend',
                    tasks: [
                        {text: 'falls wird Spielfigur berührt? in einer Schleife', check: c => inside(c, 'sensing_touchingobject', 'control_if', (t, b) => !/^_(mouse|edge)_$/.test(c.menu(t, b, 'TOUCHINGOBJECTMENU')))},
                        {text: 'stoppe alles', check: c => inside(c, 'control_stop', 'control_if')}
                    ],
                    hints: [
                        {drag: 'control_if', to: 'ws', ghost: 'if <> then\nend', text: 'falls … dann', done: c => c.find('control_if').length > 0},
                        {drag: 'sensing_touchingobject', to: 'cond:control_if', ghost: '<touching (Mauszeiger v)?>', text: 'Berührt?', done: c => inside(c, 'sensing_touchingobject', 'control_if')},
                        {drag: 'control_stop', to: 'inside:control_if', ghost: 'stop [alles v]', text: 'Game Over', done: c => inside(c, 'control_stop', 'control_if')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Punkte für jeden Sprung',
                    text: '<p>Jedes Mal, wenn das Hindernis links angekommen ist, hast du es geschafft: <b>ändere Punkte um 1</b> – direkt nach dem Gleiten.</p>',
                    blocks: 'when flag clicked\nset [Punkte v] to (0)\nforever\n  go to x: (240) y: (-100)\n  glide (2) secs to x: (-240) y: (-100)\n  change [Punkte v] by (1)\nend',
                    tasks: [
                        {text: 'Variable „Punkte“ anlegen', check: c => !!userVar(c)},
                        {text: 'Punkte am Start auf 0', check: c => inScript(c, 'data_setvariableto', 'event_whenflagclicked')},
                        {text: 'Punkte in der Schleife erhöhen', check: c => inside(c, 'data_changevariableby', 'control_forever')}
                    ],
                    hints: [
                        {target: 'flybtn:Neue Variable', text: 'Neue Variable „Punkte“', done: c => !!userVar(c)},
                        {drag: 'data_setvariableto', to: 'under:event_whenflagclicked', ghost: 'set [Punkte v] to (0)', text: 'Start bei 0', done: c => inScript(c, 'data_setvariableto', 'event_whenflagclicked')},
                        {drag: 'data_changevariableby', to: 'under:motion_glidesecstoxy', ghost: 'change [Punkte v] by (1)', text: 'Geschafft: +1', done: c => inside(c, 'data_changevariableby', 'control_forever')}
                    ]
                },
                {
                    kind: 'challenge',
                    title: 'Challenge: Echte Schwerkraft',
                    text: '<p>Profis springen mit <b>Schwerkraft</b>: Eine Variable <b>Tempo y</b> sagt, wie schnell die Figur nach oben fliegt. Jeden Moment wird sie um 1 kleiner – die Figur wird langsamer und fällt wieder. Am Boden wird gestoppt.</p>',
                    blocks: 'when flag clicked\nset [Tempo y v] to (0)\nforever\n  change y by (Tempo y)\n  change [Tempo y v] by (-1)\n  if <(y position) < (-100)> then\n    set [Tempo y v] to (0)\n    set y to (-100)\n  end\nend\n\nwhen [Leertaste v] key pressed\nset [Tempo y v] to (15)',
                    autoHints: false,
                    tasks: [
                        {text: '„ändere y um (Tempo y)“ in der Schleife', check: c => c.find('motion_changeyby').some(({t, b}) => c.inC(t, b, 'control_forever') && c.plugged(t, b, 'DY') === 'data_variable')},
                        {text: 'Tempo wird immer kleiner', check: c => inside(c, 'data_changevariableby', 'control_forever')},
                        {text: 'Am Boden stoppen (y-Position < -100)', check: c => inside(c, 'motion_yposition', 'control_if') && inside(c, 'operator_lt', 'control_if')}
                    ],
                    hints: [
                        {target: 'ws:motion_changeyby', text: 'Ziehe die Variable „Tempo y“ in das Zahlenfeld', done: c => c.find('motion_changeyby').some(({t, b}) => c.plugged(t, b, 'DY') === 'data_variable')},
                        {drag: 'operator_lt', to: 'cond:control_if', ghost: '<() < (50)>', text: 'kleiner als', done: c => inside(c, 'operator_lt', 'control_if')}
                    ]
                },
                {
                    kind: 'game',
                    title: 'Zwischenspiel: 10 Sprünge',
                    text: '<p>Jetzt wird gespielt! Schaffst du <b>10 Punkte</b>? Wenn es zu leicht ist: Mach das Hindernis schneller oder baue ein zweites ein.</p>',
                    tasks: [
                        {text: '10 Punkte erreichen', check: c => c.vars().some(v => Number(v.value) >= 10)}
                    ],
                    hints: [
                        {target: 'flag', text: 'Start!', done: c => c.flags > 0}
                    ]
                }
            ]
        },
        {
            id: 'pong',
            title: 'Pong',
            level: 'profi',
            type: 'Spiel',
            icon: '🏓',
            autoHints: false,
            steps: [
                {
                    kind: 'info',
                    title: 'Das Spiel Pong',
                    text: '<p>Pong ist eines der ersten Videospiele überhaupt: Ein Ball fliegt herum, du hältst ihn mit einem Schläger im Spiel. Fällt er unten durch, ist das Spiel vorbei.</p>' +
                        '<p>Tipp: Starte mit <b>Datei → Neu</b>. Wenn du nicht weiterkommst, hilft dir <b>Zeig mir wie</b>.</p>'
                },
                {
                    kind: 'creative',
                    title: 'Ball und Schläger',
                    text: '<p>Du brauchst einen <b>Ball</b> und einen <b>Schläger</b>. Nimm sie aus der Bibliothek (z. B. „Ball“ und „Paddle“) oder male sie selbst.</p>',
                    tasks: [
                        {text: 'Ball und Schläger hinzufügen', check: c => newSprites(c) >= 2}
                    ],
                    hints: [
                        {target: 'spriteAdd', text: 'Figur wählen oder malen', done: c => newSprites(c) >= 2}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Der Ball fliegt',
                    text: '<p>Beim Ball: Er startet schräg und fliegt für immer weiter. Am Rand prallt er ab.</p>',
                    blocks: 'when flag clicked\npoint in direction (45)\nforever\n  move (10) steps\n  if on edge, bounce\nend',
                    tasks: [
                        {text: 'Startrichtung 45 Grad', check: c => inScript(c, 'motion_pointindirection', 'event_whenflagclicked')},
                        {text: 'In der Schleife: gehe + pralle vom Rand ab', check: c => inside(c, 'motion_movesteps', 'control_forever') && inside(c, 'motion_ifonedgebounce', 'control_forever')}
                    ],
                    hints: [
                        {target: 'spriteList', text: 'Wähle den Ball aus', done: c => c.editingHas('event_whenflagclicked') || c.find('motion_ifonedgebounce').length > 0},
                        {drag: 'event_whenflagclicked', to: 'ws', ghost: 'when flag clicked', text: 'Start', done: c => c.editingHas('event_whenflagclicked')},
                        {drag: 'motion_pointindirection', to: 'under:event_whenflagclicked', ghost: 'point in direction (90)', text: 'Richtung 45', done: c => inScript(c, 'motion_pointindirection', 'event_whenflagclicked')},
                        {drag: 'control_forever', to: 'under:motion_pointindirection', ghost: 'forever\nend', text: 'Schleife', done: c => c.editingHas('control_forever')},
                        {drag: 'motion_movesteps', to: 'inside:control_forever', ghost: 'move (10) steps', text: 'Fliegen', done: c => inside(c, 'motion_movesteps', 'control_forever')},
                        {drag: 'motion_ifonedgebounce', to: 'under:motion_movesteps', ghost: 'if on edge, bounce', text: 'Abprallen', done: c => inside(c, 'motion_ifonedgebounce', 'control_forever')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Schläger mit der Maus',
                    text: '<p>Beim Schläger: Er folgt der Maus, aber nur <b>nach links und rechts</b>. Setze x immer wieder auf die <b>Maus x-Position</b> aus <b>Fühlen</b>.</p>',
                    blocks: 'when flag clicked\nforever\n  set x to (mouse x)\nend',
                    tasks: [
                        {text: 'setze x auf (Maus x-Position) in einer Schleife', check: c => inside(c, 'motion_setx', 'control_forever', (t, b) => c.plugged(t, b, 'X') === 'sensing_mousex')}
                    ],
                    hints: [
                        {target: 'spriteList', text: 'Wähle den Schläger aus', done: c => c.find('motion_setx').length > 0},
                        {drag: 'motion_setx', to: 'inside:control_forever', ghost: 'set x to (0)', text: 'setze x auf', done: c => c.find('motion_setx').length > 0},
                        {drag: 'sensing_mousex', to: 'cond:motion_setx', ghost: '(mouse x)', text: 'Maus x-Position hinein', done: c => c.find('motion_setx').some(({t, b}) => c.plugged(t, b, 'X') === 'sensing_mousex')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Abprallen am Schläger',
                    text: '<p>Zurück zum Ball: Wenn er den Schläger berührt, dreht er sich um und fliegt wieder nach oben.</p>',
                    blocks: 'forever\n  move (10) steps\n  if on edge, bounce\n  if <touching (Paddle v)?> then\n    turn cw (180) degrees\n    move (15) steps\n  end\nend',
                    tasks: [
                        {text: 'falls wird Schläger berührt? in der Schleife', check: c => inside(c, 'control_if', 'control_forever') && inside(c, 'sensing_touchingobject', 'control_if')},
                        {text: 'Ball dreht sich um', check: c => inside(c, 'motion_turnright', 'control_if') || inside(c, 'motion_turnleft', 'control_if') || inside(c, 'motion_pointindirection', 'control_if')}
                    ],
                    hints: [
                        {drag: 'control_if', to: 'inside:control_forever', ghost: 'if <> then\nend', text: 'falls … dann', done: c => inside(c, 'control_if', 'control_forever')},
                        {drag: 'sensing_touchingobject', to: 'cond:control_if', ghost: '<touching (Mauszeiger v)?>', text: 'Schläger berührt?', done: c => inside(c, 'sensing_touchingobject', 'control_if')},
                        {drag: 'motion_turnright', to: 'inside:control_if', ghost: 'turn cw (15) degrees', text: '180 Grad drehen', done: c => inside(c, 'motion_turnright', 'control_if')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Game Over',
                    text: '<p>Male im <b>Bühnenbild</b> unten eine <b>rote Linie</b>. Berührt der Ball die Farbe Rot, ist das Spiel vorbei.</p>' +
                        '<p>Tipp: Klicke im Farbfeld auf die Pipette und dann auf deine rote Linie.</p>',
                    blocks: 'if <touching color [#ff0000]?> then\n  stop [alles v]\nend',
                    tasks: [
                        {text: 'Rote Linie ins Bühnenbild malen', manual: true},
                        {text: 'falls wird Farbe berührt? → stoppe alles', check: c => inside(c, 'sensing_touchingcolor', 'control_if') && inside(c, 'control_stop', 'control_if')}
                    ],
                    hints: [
                        {target: 'stageSelector', text: 'Bühne auswählen, dann Tab „Bühnenbilder“', done: c => c.editing && c.editing.isStage},
                        {drag: 'sensing_touchingcolor', to: 'ws', ghost: '<touching color [#ff0000]?>', text: 'Farbe berührt?', done: c => c.find('sensing_touchingcolor').length > 0}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Punkte für jeden Treffer',
                    text: '<p>Lege eine Variable <b>Punkte</b> an. Sie startet bei 0 und steigt, wenn der Ball den Schläger trifft.</p>',
                    blocks: 'when flag clicked\nset [Punkte v] to (0)\n\nif <touching (Paddle v)?> then\n  change [Punkte v] by (1)\n  turn cw (180) degrees\n  move (15) steps\nend',
                    tasks: [
                        {text: 'Punkte am Start auf 0', check: c => inScript(c, 'data_setvariableto', 'event_whenflagclicked')},
                        {text: 'Punkte beim Treffer erhöhen', check: c => inside(c, 'data_changevariableby', 'control_if')}
                    ],
                    hints: [
                        {target: 'flybtn:Neue Variable', text: 'Neue Variable', done: c => !!userVar(c)},
                        {drag: 'data_setvariableto', to: 'under:event_whenflagclicked', ghost: 'set [Punkte v] to (0)', text: 'Start bei 0', done: c => inScript(c, 'data_setvariableto', 'event_whenflagclicked')},
                        {drag: 'data_changevariableby', to: 'inside:control_if', ghost: 'change [Punkte v] by (1)', text: '+1', done: c => inside(c, 'data_changevariableby', 'control_if')}
                    ]
                },
                {
                    kind: 'challenge',
                    title: 'Challenge: Immer schneller',
                    text: '<p>Mach Pong spannender: Lege eine Variable <b>Tempo</b> an und benutze sie im Block <b>gehe (Tempo) er Schritt</b>. Bei jedem Treffer wird der Ball etwas schneller.</p>',
                    blocks: 'when flag clicked\nset [Tempo v] to (8)\nforever\n  move (Tempo) steps\n  if <touching (Paddle v)?> then\n    change [Tempo v] by (1)\n  end\nend',
                    tasks: [
                        {text: 'Variable im „gehe“-Block', check: c => c.find('motion_movesteps').some(({t, b}) => c.plugged(t, b, 'STEPS') === 'data_variable')},
                        {text: 'Tempo wird erhöht', check: c => c.find('data_changevariableby').length >= 2}
                    ],
                    hints: [
                        {target: 'ws:motion_movesteps', text: 'Ziehe deine Variable in das Zahlenfeld', done: c => c.find('motion_movesteps').some(({t, b}) => c.plugged(t, b, 'STEPS') === 'data_variable')}
                    ]
                },
                {
                    kind: 'creative',
                    title: 'Kreativ: Dein Pong',
                    text: '<p>Jetzt wird es dein Spiel! Ideen:</p><ul>' +
                        '<li>Ein Klang beim Treffer</li><li>Ein eigenes Bühnenbild</li>' +
                        '<li>Bei 10 Punkten: „Gewonnen!“</li><li>Ein zweiter Ball</li></ul>',
                    tasks: [
                        {text: 'Mindestens zwei eigene Ideen eingebaut', manual: true},
                        {text: 'Jemand anderes hat dein Spiel getestet', manual: true}
                    ]
                }
            ]
        },
        {
            id: 'malstift',
            title: 'Kunst mit dem Malstift',
            level: 'profi',
            type: 'Kunst',
            icon: '🖌️',
            autoHints: false,
            steps: [
                {
                    kind: 'info',
                    title: 'Code wird Kunst',
                    text: '<p>Mit der Erweiterung <b>Malstift</b> hinterlässt deine Figur eine Spur auf der Bühne. Mit Schleifen entstehen daraus Muster, die man von Hand kaum zeichnen könnte.</p>' +
                        '<p>Tipp: Starte mit <b>Datei → Neu</b>. Die Katze kannst du mit <b>verstecke dich</b> unsichtbar machen.</p>'
                },
                {
                    kind: 'learn',
                    title: 'Erweiterung Malstift',
                    text: '<p>Klicke unten links auf <b>Erweiterung hinzufügen</b> und wähle <b>Malstift</b>. Danach gibt es links eine neue, grüne Kategorie.</p>',
                    autoHints: true,
                    tasks: [
                        {text: 'Malstift hinzufügen', check: c => c.extension('pen')}
                    ],
                    hints: [
                        {target: 'extensionAdd', text: 'Hier klicken und „Malstift“ wählen', done: c => c.extension('pen')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Ein Quadrat',
                    text: '<p>Ein Quadrat hat 4 gleiche Seiten und 4 Ecken mit 90 Grad. Also: <b>4-mal</b> geradeaus gehen und um <b>90 Grad</b> drehen.</p>',
                    blocks: 'when flag clicked\nerase all\ngo to x: (0) y: (0)\npen down\nrepeat (4)\n  move (100) steps\n  turn cw (90) degrees\nend',
                    tasks: [
                        {text: 'wische alles weg + schalte Stift ein', check: c => c.find('pen_clear').length > 0 && c.find('pen_penDown').length > 0},
                        {text: 'wiederhole 4 mal: gehe + drehe dich', check: c => inside(c, 'motion_movesteps', 'control_repeat') && inside(c, 'motion_turnright', 'control_repeat')},
                        {text: 'Mit der Flagge zeichnen', check: c => c.flags > 0 && c.find('pen_penDown').length > 0}
                    ],
                    hints: [
                        {drag: 'pen_clear', to: 'under:event_whenflagclicked', ghost: 'erase all', text: 'Alles wegwischen', done: c => c.find('pen_clear').length > 0},
                        {drag: 'pen_penDown', to: 'under:pen_clear', ghost: 'pen down', text: 'Stift ein', done: c => c.find('pen_penDown').length > 0},
                        {drag: 'control_repeat', to: 'under:pen_penDown', ghost: 'repeat (10)\nend', text: '4-mal', done: c => c.find('control_repeat').length > 0},
                        {drag: 'motion_movesteps', to: 'inside:control_repeat', ghost: 'move (10) steps', text: 'Seite', done: c => inside(c, 'motion_movesteps', 'control_repeat')},
                        {drag: 'motion_turnright', to: 'under:motion_movesteps', ghost: 'turn cw (15) degrees', text: 'Ecke', done: c => inside(c, 'motion_turnright', 'control_repeat')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Farbe und Dicke',
                    text: '<p>Mach den Stift <b>dicker</b> und lass die <b>Farbe</b> bei jeder Seite ein Stück weiterwandern – so entsteht ein Regenbogen-Effekt.</p>',
                    blocks: 'when flag clicked\nerase all\nset pen size to (5)\npen down\nrepeat (4)\n  move (100) steps\n  turn cw (90) degrees\n  change pen (Farbe v) by (10)\nend',
                    tasks: [
                        {text: 'setze Stiftdicke auf …', check: c => c.find('pen_setPenSizeTo').length > 0},
                        {text: 'ändere Stift Farbe um … in der Schleife', check: c => inside(c, 'pen_changePenColorParamBy', 'control_repeat')}
                    ],
                    hints: [
                        {drag: 'pen_setPenSizeTo', to: 'under:pen_clear', ghost: 'set pen size to (1)', text: 'Dicke', done: c => c.find('pen_setPenSizeTo').length > 0},
                        {drag: 'pen_changePenColorParamBy', to: 'under:motion_turnright', ghost: 'change pen (Farbe v) by (10)', text: 'Farbe wandert', done: c => inside(c, 'pen_changePenColorParamBy', 'control_repeat')}
                    ]
                },
                {
                    kind: 'creative',
                    title: 'Kreativ: Die Rosette',
                    text: '<p>Jetzt wird es magisch: Zeichne das Quadrat <b>36-mal</b> und drehe dich nach jedem Quadrat um <b>10 Grad</b>. Eine Schleife in einer Schleife!</p>' +
                        '<p>Experimentiere: Was passiert mit 5 Ecken und 72 Grad? Mit anderen Zahlen?</p>',
                    blocks: 'when flag clicked\nerase all\npen down\nrepeat (36)\n  repeat (4)\n    move (100) steps\n    turn cw (90) degrees\n  end\n  turn cw (10) degrees\n  change pen (Farbe v) by (5)\nend',
                    tasks: [
                        {text: 'Schleife in einer Schleife', check: c => inside(c, 'control_repeat', 'control_repeat')},
                        {text: 'Ich habe mit den Zahlen experimentiert', manual: true}
                    ],
                    hints: [
                        {drag: 'control_repeat', to: 'under:pen_penDown', ghost: 'repeat (36)\nend', text: 'Äußere Schleife', done: c => inside(c, 'control_repeat', 'control_repeat')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Dein eigener Block: Vieleck',
                    text: '<p>Unter <b>Meine Blöcke</b> kannst du eigene Blöcke erfinden. Lege einen Block <b>Vieleck</b> mit einer Zahl-Eingabe <b>Ecken</b> an. Die Drehung ist immer <b>360 / Ecken</b>.</p>',
                    blocks: 'define Vieleck (Ecken)\nrepeat (Ecken)\n  move (60) steps\n  turn cw ((360) / (Ecken)) degrees\nend\n\nwhen flag clicked\nerase all\npen down\nVieleck (6) :: custom',
                    tasks: [
                        {text: 'Eigenen Block „Vieleck“ anlegen', check: c => c.find('procedures_definition').length > 0},
                        {text: 'Drehung mit 360 / Ecken', check: c => c.find('operator_divide').length > 0},
                        {text: 'Den eigenen Block benutzen', check: c => c.find('procedures_call').length > 0}
                    ],
                    hints: [
                        {target: 'cat:myBlocks', text: 'Meine Blöcke', done: c => c.find('procedures_definition').length > 0 || c.categoryOpen('myBlocks')},
                        {target: 'flybtn:Neuer Block', text: 'Neuer Block – mit Eingabe „Ecken“', done: c => c.find('procedures_definition').length > 0},
                        {drag: 'operator_divide', to: 'ws', ghost: '(() / ())', text: 'Geteilt durch', done: c => c.find('operator_divide').length > 0}
                    ]
                },
                {
                    kind: 'challenge',
                    title: 'Challenge: Dein Malprogramm',
                    text: '<p>Baue ein Malprogramm: Die Figur folgt der Maus. Nur wenn die <b>Maustaste gedrückt</b> ist, ist der Stift unten.</p>',
                    blocks: 'when flag clicked\nerase all\nforever\n  go to (Mauszeiger v)\n  if <mouse down?> then\n    pen down\n  else\n    pen up\n  end\nend',
                    tasks: [
                        {text: 'falls Maustaste gedrückt? … sonst …', check: c => inside(c, 'sensing_mousedown', 'control_if_else')},
                        {text: 'Stift ein / Stift aus', check: c => inside(c, 'pen_penDown', 'control_if_else') && inside(c, 'pen_penUp', 'control_if_else')}
                    ],
                    hints: [
                        {drag: 'control_if_else', to: 'inside:control_forever', ghost: 'if <> then\nelse\nend', text: 'falls … sonst', done: c => c.find('control_if_else').length > 0},
                        {drag: 'sensing_mousedown', to: 'cond:control_if_else', ghost: '<mouse down?>', text: 'Maustaste gedrückt?', done: c => inside(c, 'sensing_mousedown', 'control_if_else')}
                    ]
                },
                {
                    kind: 'creative',
                    title: 'Kreativ: Deine Galerie',
                    text: '<p>Erschaffe dein eigenes Kunstwerk! Ideen:</p><ul>' +
                        '<li>Ein Sternenhimmel mit <b>Stempel</b> und Zufallspositionen</li>' +
                        '<li>Eine Blume aus vielen Vielecken</li>' +
                        '<li>Tasten wechseln die Stiftfarbe in deinem Malprogramm</li></ul>',
                    tasks: [
                        {text: 'Eigenes Kunstwerk programmiert', manual: true},
                        {text: 'Kunstwerk in der Gruppe gezeigt', manual: true}
                    ]
                }
            ]
        },
        {
            id: 'klone',
            title: 'Weltraum-Abenteuer mit Klonen',
            level: 'profi',
            type: 'Spiel',
            icon: '🚀',
            autoHints: false,
            steps: [
                {
                    kind: 'info',
                    title: 'Was sind Klone?',
                    text: '<p>Ein <b>Klon</b> ist eine Kopie einer Figur, die das Programm selbst erzeugt. So kannst du hunderte Asteroiden fliegen lassen, ohne hundert Figuren zu bauen.</p>' +
                        '<p>Das Spiel: Deine Rakete weicht Asteroiden aus. Tipp: Starte mit <b>Datei → Neu</b>.</p>'
                },
                {
                    kind: 'creative',
                    title: 'Rakete im All',
                    text: '<p>Such dir eine Rakete aus (z. B. <b>Rocketship</b>) und einen Weltraum-Hintergrund wie <b>Stars</b> oder <b>Galaxy</b>. Stell die Rakete unten auf die Bühne.</p>',
                    tasks: [
                        {text: 'Raketen-Figur hinzufügen', check: c => newSprites(c) > 0},
                        {text: 'Weltraum-Hintergrund', check: c => c.backdropChanged()}
                    ],
                    hints: [
                        {target: 'spriteAdd', text: 'Rakete', done: c => newSprites(c) > 0},
                        {target: 'backdropAdd', text: 'Weltraum', done: c => c.backdropChanged()}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Rakete steuern',
                    text: '<p>Diesmal fragen wir die Tasten in einer Schleife ab: <b>falls Taste Pfeil nach rechts gedrückt?</b> Das ist flüssiger als „Wenn Taste gedrückt wird“.</p>',
                    blocks: 'when flag clicked\nforever\n  if <key (Pfeil nach rechts v) pressed?> then\n    change x by (10)\n  end\n  if <key (Pfeil nach links v) pressed?> then\n    change x by (-10)\n  end\nend',
                    tasks: [
                        {text: 'falls Taste Pfeil nach rechts gedrückt?', check: c => inside(c, 'sensing_keypressed', 'control_if', (t, b) => c.menu(t, b, 'KEY_OPTION') === 'right arrow')},
                        {text: 'falls Taste Pfeil nach links gedrückt?', check: c => inside(c, 'sensing_keypressed', 'control_if', (t, b) => c.menu(t, b, 'KEY_OPTION') === 'left arrow')},
                        {text: 'ändere x in den falls-Blöcken', check: c => inside(c, 'motion_changexby', 'control_if')}
                    ],
                    hints: [
                        {drag: 'control_if', to: 'inside:control_forever', ghost: 'if <> then\nend', text: 'falls … dann', done: c => inside(c, 'control_if', 'control_forever')},
                        {drag: 'sensing_keypressed', to: 'cond:control_if', ghost: '<key (Leertaste v) pressed?>', text: 'Taste gedrückt?', done: c => inside(c, 'sensing_keypressed', 'control_if')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Die Asteroiden-Fabrik',
                    text: '<p>Neue Figur: ein Asteroid (z. B. <b>Rocks</b>). Das Original versteckt sich und erzeugt jede Sekunde einen <b>Klon von sich selbst</b>.</p>',
                    blocks: 'when flag clicked\nhide\nforever\n  create clone of (mir selbst v)\n  wait (1) seconds\nend',
                    tasks: [
                        {text: 'Asteroiden-Figur hinzufügen', check: c => newSprites(c) > 0},
                        {text: 'Original versteckt sich', check: c => inScript(c, 'looks_hide', 'event_whenflagclicked')},
                        {text: 'erzeuge Klon in einer Schleife', check: c => inside(c, 'control_create_clone_of', 'control_forever')}
                    ],
                    hints: [
                        {target: 'spriteAdd', text: 'Asteroid', done: c => newSprites(c) > 0},
                        {drag: 'control_create_clone_of', to: 'inside:control_forever', ghost: 'create clone of (mir selbst v)', text: 'Klonen', done: c => inside(c, 'control_create_clone_of', 'control_forever')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Wenn ich als Klon entstehe',
                    text: '<p>Jeder Klon startet an einer <b>zufälligen Stelle oben</b>, zeigt sich und fällt nach unten. Unten angekommen, <b>löscht</b> er sich.</p>',
                    blocks: 'when I start as a clone\ngo to x: (pick random (-220) to (220)) y: (180)\nshow\nrepeat until <(y position) < (-170)>\n  change y by (-5)\nend\ndelete this clone',
                    tasks: [
                        {text: 'Zufällige Startposition', check: c => inScript(c, 'operator_random', 'control_start_as_clone')},
                        {text: 'wiederhole bis … mit ändere y', check: c => inScript(c, 'control_repeat_until', 'control_start_as_clone') && inside(c, 'motion_changeyby', 'control_repeat_until')},
                        {text: 'lösche diesen Klon', check: c => inScript(c, 'control_delete_this_clone', 'control_start_as_clone')}
                    ],
                    hints: [
                        {drag: 'control_start_as_clone', to: 'ws', ghost: 'when I start as a clone', text: 'Klon-Start', done: c => c.find('control_start_as_clone').length > 0},
                        {drag: 'operator_random', to: 'ws:motion_gotoxy', ghost: '(pick random (1) to (10))', text: 'Zufallszahl für x', done: c => inScript(c, 'operator_random', 'control_start_as_clone')},
                        {drag: 'control_repeat_until', to: 'under:control_start_as_clone', ghost: 'repeat until <>\nend', text: 'Fallen bis unten', done: c => inScript(c, 'control_repeat_until', 'control_start_as_clone')},
                        {drag: 'control_delete_this_clone', to: 'under:control_start_as_clone', ghost: 'delete this clone', text: 'Aufräumen', done: c => inScript(c, 'control_delete_this_clone', 'control_start_as_clone')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Zusammenstoß!',
                    text: '<p>Trifft ein Asteroid die Rakete, ist das Spiel vorbei. Prüfe das <b>im Klon</b>, während er fällt.</p>',
                    blocks: 'repeat until <(y position) < (-170)>\n  change y by (-5)\n  if <touching (Rocketship v)?> then\n    stop [alles v]\n  end\nend',
                    tasks: [
                        {text: 'Im Klon: falls wird Rakete berührt?', check: c => c.find('sensing_touchingobject').some(({t, b}) => c.hatOf(t, b).opcode === 'control_start_as_clone' && c.inC(t, b, 'control_if'))},
                        {text: 'stoppe alles', check: c => inScript(c, 'control_stop', 'control_start_as_clone')}
                    ],
                    hints: [
                        {drag: 'control_if', to: 'inside:control_repeat_until', ghost: 'if <> then\nend', text: 'falls … dann', done: c => inside(c, 'control_if', 'control_repeat_until')},
                        {drag: 'sensing_touchingobject', to: 'cond:control_if', ghost: '<touching (Mauszeiger v)?>', text: 'Rakete berührt?', done: c => inside(c, 'sensing_touchingobject', 'control_if')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Punkte fürs Überleben',
                    text: '<p>Jeder Asteroid, der unten ankommt, ohne dich zu treffen, bringt einen Punkt. Erhöhe die Punkte direkt <b>vor „lösche diesen Klon“</b>.</p>',
                    blocks: 'when flag clicked\nset [Punkte v] to (0)\n\nwhen I start as a clone\ngo to x: (pick random (-220) to (220)) y: (180)\nshow\nrepeat until <(y position) < (-170)>\n  change y by (-5)\nend\nchange [Punkte v] by (1)\ndelete this clone',
                    tasks: [
                        {text: 'Punkte am Start auf 0', check: c => inScript(c, 'data_setvariableto', 'event_whenflagclicked')},
                        {text: 'Punkte im Klon erhöhen', check: c => inScript(c, 'data_changevariableby', 'control_start_as_clone')}
                    ],
                    hints: [
                        {target: 'flybtn:Neue Variable', text: 'Neue Variable „Punkte“', done: c => !!userVar(c)},
                        {drag: 'data_changevariableby', to: 'above:control_delete_this_clone', ghost: 'change [Punkte v] by (1)', text: 'Vor dem Löschen', done: c => inScript(c, 'data_changevariableby', 'control_start_as_clone')}
                    ]
                },
                {
                    kind: 'challenge',
                    title: 'Challenge: Laser!',
                    text: '<p>Deine Rakete bekommt einen Laser: Eine neue Figur <b>Laser</b> (male einen Strich) erzeugt bei der <b>Leertaste</b> einen Klon. Der Klon startet bei der Rakete und fliegt nach oben, bis er den Rand berührt.</p>' +
                        '<p>Extra: Treffen sich Laser und Asteroid, verschwindet der Asteroid.</p>',
                    blocks: 'when [Leertaste v] key pressed\ncreate clone of (mir selbst v)\n\nwhen I start as a clone\ngo to (Rocketship v)\nshow\nrepeat until <touching (Rand v)?>\n  change y by (10)\nend\ndelete this clone',
                    tasks: [
                        {text: 'Leertaste erzeugt einen Klon', check: c => c.find('control_create_clone_of').some(({t, b}) => c.hatOf(t, b).opcode === 'event_whenkeypressed')},
                        {text: 'Zwei Figuren nutzen Klone', check: c => c.spritesWith('control_start_as_clone') >= 2}
                    ]
                },
                {
                    kind: 'creative',
                    title: 'Finale: Dein Weltraum-Spiel',
                    text: '<p>Letzter Schliff für dein Meisterwerk! Ideen:</p><ul>' +
                        '<li>Explosion mit Klang und Kostümwechsel</li><li>Asteroiden werden mit der Zeit schneller</li>' +
                        '<li>Leben statt sofortigem Game Over</li><li>Ein Startbildschirm</li></ul>',
                    tasks: [
                        {text: 'Mindestens zwei eigene Ideen eingebaut', manual: true},
                        {text: 'Spiel von jemand anderem testen lassen', manual: true}
                    ]
                }
            ]
        }
    ];

    const levels = [
        {id: 'neuling', icon: '🐣', title: 'Neuling', text: 'Ich habe noch nie mit Scratch programmiert.', chapter: 'start'},
        {id: 'probiert', icon: '🚀', title: 'Schon mal ausprobiert', text: 'Ich kenne die Blöcke und habe schon etwas gebaut.', chapter: 'fangen'},
        {id: 'profi', icon: '🏆', title: 'Ich kenne mich aus', text: 'Schleifen, Variablen und Bedingungen sind kein Problem.', chapter: 'pong'}
    ];

    window.BayernLabCourse = {chapters, levels};
})();
