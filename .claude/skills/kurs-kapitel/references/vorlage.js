// Vorlage für ein Kapitel in course/course-data.js (in das Array `chapters` einfügen).
// Beispiel: Musik-Kapitel für die Stufe „Schon mal ausprobiert“.
// Hilfsfunktionen (inScript, inside, keyScript, newSprites, userVar, libraryHints) stehen
// oben in course-data.js. Neue wiederkehrende Prüfungen dort ergänzen, z. B.:
//
//     const drumInLoop = c => inside(c, 'music_playDrumForBeats', 'control_forever');

        {
            id: 'musik',
            title: 'Musik: Deine eigene Band',
            level: 'probiert',
            type: 'Musik',
            icon: '🥁',
            autoHints: true,
            steps: [
                {
                    kind: 'info',
                    title: 'Wir gründen eine Band!',
                    text: '<p>In diesem Kapitel baust du eine <b>Band</b>: Ein Schlagzeug spielt einen Rhythmus, und wenn du auf die Musiker klickst, spielen sie los.</p>' +
                        '<p>Dafür brauchst du die Erweiterung <b>Musik</b>.</p>'
                },
                {
                    kind: 'creative',
                    title: 'Bühne und Schlagzeug',
                    text: '<p>Such dir einen Hintergrund aus der Kategorie <b>Musik</b> und eine Figur, die ein Instrument spielt, z. B. <b>Drum Kit</b>.</p>',
                    tasks: [
                        {text: 'Einen Musik-Hintergrund aussuchen', check: c => c.backdropChanged()},
                        {text: 'Eine Instrument-Figur aussuchen', check: c => newSprites(c) > 0}
                    ],
                    hints: [
                        ...libraryHints({button: 'backdropAdd', buttonText: 'Klicke hier: Hintergrund wählen', tag: 'Musik', itemText: 'Such dir eine Bühne aus', done: c => c.backdropChanged()}),
                        ...libraryHints({button: 'spriteAdd', buttonText: 'Klicke hier: Figur wählen', search: 'drum', item: 'Drum', itemText: 'Klicke auf ein Schlagzeug', done: c => newSprites(c) > 0})
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Die Musik-Erweiterung',
                    text: '<p>Klicke unten links auf den blauen Knopf <b>Erweiterung hinzufügen</b> und wähle <b>Musik</b>. Danach gibt es eine neue Kategorie mit Trommeln und Noten.</p>',
                    tasks: [
                        {text: 'Erweiterung „Musik“ hinzufügen', check: c => c.extension('music')}
                    ],
                    hints: [
                        {target: 'extensionAdd', text: 'Erweiterung hinzufügen', done: c => c.extension('music')}
                    ]
                },
                {
                    kind: 'learn',
                    title: 'Ein Rhythmus ohne Ende',
                    text: '<p>Das Schlagzeug soll immer weiter spielen. Lege <b>spiele Schlaginstrument</b> in eine <b>wiederhole fortlaufend</b>-Schleife.</p>' +
                        '<p>Probier verschiedene Trommeln und Schlagzahlen aus!</p>',
                    blocks: 'when flag clicked\nforever\n  play drum (\\(1\\) Snare Drum v) for (0.5) beats\n  play drum (\\(2\\) Bass Drum v) for (0.5) beats\nend',
                    tasks: [
                        {text: 'Wenn grüne Flagge → wiederhole fortlaufend', check: c => inScript(c, 'control_forever', 'event_whenflagclicked')},
                        {text: 'Trommel in die Schleife', check: c => inside(c, 'music_playDrumForBeats', 'control_forever')},
                        {text: 'Mindestens zwei Trommelschläge', check: c => c.find('music_playDrumForBeats').filter(({t, b}) => c.inC(t, b, 'control_forever')).length >= 2},
                        {text: 'Grüne Flagge klicken', check: c => c.flags > 0 && inside(c, 'music_playDrumForBeats', 'control_forever')}
                    ],
                    hints: [
                        {drag: 'event_whenflagclicked', to: 'ws', ghost: 'when flag clicked', text: 'Start-Block', done: c => c.editingHas('event_whenflagclicked')},
                        {drag: 'control_forever', to: 'under:event_whenflagclicked', ghost: 'forever\nend', text: 'Endlos-Schleife', done: c => inScript(c, 'control_forever', 'event_whenflagclicked')},
                        {drag: 'music_playDrumForBeats', to: 'inside:control_forever', ghost: 'play drum (\\(1\\) Snare Drum v) for (0.25) beats', text: 'Trommel in die Schleife', done: c => inside(c, 'music_playDrumForBeats', 'control_forever')},
                        {drag: 'music_playDrumForBeats', to: 'under:music_playDrumForBeats', ghost: 'play drum (\\(2\\) Bass Drum v) for (0.25) beats', text: 'Noch ein Schlag', done: c => c.find('music_playDrumForBeats').length >= 2},
                        {target: 'flag', text: 'Los geht\'s!', done: c => c.flags > 0}
                    ]
                },
                {
                    kind: 'game',
                    title: 'Mitspielen per Klick',
                    text: '<p>Hol dir eine zweite Figur, z. B. eine <b>Gitarre</b>. Wenn man sie anklickt, spielt sie ein paar Noten.</p>',
                    blocks: 'when this sprite clicked\nplay note (60) for (0.5) beats\nplay note (64) for (0.5) beats\nplay note (67) for (1) beats',
                    tasks: [
                        {text: 'Zweite Musiker-Figur', check: c => c.sprites.length >= 2},
                        {text: 'Wenn diese Figur angeklickt wird → spiele Note', check: c => inScript(c, 'music_playNoteForBeats', 'event_whenthisspriteclicked')},
                        {text: 'Ich habe zusammen mit dem Schlagzeug gespielt', manual: true}
                    ],
                    hints: [
                        ...libraryHints({button: 'spriteAdd', buttonText: 'Klicke hier: Figur wählen', tag: 'Musik', itemText: 'Wähle ein zweites Instrument', done: c => c.sprites.length >= 2}),
                        {drag: 'event_whenthisspriteclicked', to: 'ws', ghost: 'when this sprite clicked', text: 'Klick-Start', done: c => c.editingHas('event_whenthisspriteclicked')},
                        {drag: 'music_playNoteForBeats', to: 'under:event_whenthisspriteclicked', ghost: 'play note (60) for (0.25) beats', text: 'Eine Note', done: c => inScript(c, 'music_playNoteForBeats', 'event_whenthisspriteclicked')}
                    ]
                },
                {
                    kind: 'challenge',
                    title: 'Challenge: Tempo!',
                    autoHints: false,
                    text: '<p>Mit der <b>Leertaste</b> soll die Band schneller werden: Setze am Anfang das <b>Tempo auf 60</b> und erhöhe es bei jedem Druck auf die Leertaste um <b>20</b>.</p>',
                    blocks: 'when flag clicked\nset tempo to (60)\n\nwhen [Leertaste v] key pressed\nchange tempo by (20)',
                    tasks: [
                        {text: 'Tempo am Start setzen', check: c => inScript(c, 'music_setTempo', 'event_whenflagclicked')},
                        {text: 'Leertaste macht schneller', check: c => keyScript(c, 'space', 'music_changeTempo')},
                        {text: 'Ausprobieren', check: c => c.keys.has('space') && keyScript(c, 'space', 'music_changeTempo')}
                    ]
                },
                {
                    kind: 'creative',
                    title: 'Finale: Dein Konzert',
                    text: '<p>Mach aus deiner Band ein richtiges Konzert! Ideen:</p><ul>' +
                        '<li>Eine dritte Figur singt mit „sage“</li><li>Die Musiker wechseln beim Spielen das Kostüm</li>' +
                        '<li>Der Hintergrund blinkt im Takt</li><li>Ein eigenes Lied mit vielen Noten</li></ul>',
                    tasks: [
                        {text: 'Mindestens zwei eigene Ideen eingebaut', manual: true},
                        {text: 'Konzert jemandem vorgespielt', manual: true}
                    ]
                }
            ]
        },
