/*
 * BayernLab-Kurs: Menü-Button, Stufenwahl, Kursfenster und Zeige-Hinweise.
 *
 * Prüft den Fortschritt direkt in der Scratch-VM (welche Blöcke wo liegen)
 * und zeigt im Stil von LEGO Education an, wo geklickt und wohin gezogen wird.
 */
(function () {
    'use strict';

    const S = window.BayernLabScratch;
    const {chapters, levels} = window.BayernLabCourse;
    const STATE_KEY = 'bayernlab-course:v2';
    const TICK_MS = 200;

    const CATEGORY = {
        motion: 'motion', looks: 'looks', sound: 'sound', event: 'events', control: 'control',
        sensing: 'sensing', operator: 'operators', data: 'variables', procedures: 'myBlocks',
        pen: 'pen', music: 'music'
    };
    const chapterIndex = id => Math.max(0, chapters.findIndex(ch => ch.id === id));
    const KIND = {
        info: {label: 'Info', icon: '💡'},
        learn: {label: 'Lernen', icon: '🧩'},
        creative: {label: 'Kreativ', icon: '🎨'},
        game: {label: 'Spiel', icon: '🎮'},
        challenge: {label: 'Challenge', icon: '⭐'}
    };

    // ---------- Gespeicherter Zustand ----------

    // Kapitel werden über ihre id gespeichert, damit neue Kapitel den Fortschritt nicht verschieben.
    function loadState () {
        let loaded = defaultState();
        try {
            loaded = Object.assign(loaded, JSON.parse(localStorage.getItem(STATE_KEY) || '{}'));
        } catch (e) { /* Standardwerte */ }
        loaded.chapter = chapterIndex(loaded.chapterId);
        const steps = chapters[loaded.chapter].steps.length;
        loaded.step = Math.min(Math.max(0, loaded.step || 0), steps - 1);
        return loaded;
    }
    function defaultState () {
        return {started: false, open: false, collapsed: false, chapterId: chapters[0].id, step: 0, done: {}, manual: {}, pos: null};
    }
    function saveState () {
        state.chapterId = chapters[state.chapter].id;
        try {
            const {chapter, ...stored} = state;
            localStorage.setItem(STATE_KEY, JSON.stringify(stored));
        } catch (e) { /* egal */ }
    }
    const state = loadState();

    // ---------- Laufzeit des aktuellen Schritts ----------

    const run = {base: null, flags: 0, keys: new Set(), tabsSeen: new Set(), hintsOn: false, wasComplete: false, taskDone: [], view: 'step'};

    const currentChapter = () => chapters[state.chapter];
    const currentStep = () => currentChapter().steps[state.step];
    const stepId = (ci, si) => `${chapters[ci].id}.${si}`;

    function snapshot () {
        const vm = S.getVM();
        if (!vm) return {spriteCount: 0, backdropCount: 0, backdrop: 0, pos: {}};
        const sprites = vm.runtime.targets.filter(t => t.isOriginal && !t.isStage);
        const stage = vm.runtime.getTargetForStage();
        const pos = {};
        sprites.forEach(t => {
            pos[t.id] = [t.x, t.y];
        });
        return {
            spriteCount: sprites.length,
            backdropCount: stage ? stage.getCostumes().length : 0,
            backdrop: stage ? stage.currentCostume : 0,
            pos
        };
    }

    function enterStep () {
        const step = currentStep();
        run.base = snapshot();
        run.flags = 0;
        run.keys = new Set();
        run.tabsSeen = new Set();
        run.wasComplete = !!state.done[stepId(state.chapter, state.step)];
        run.taskDone = [];
        const auto = step.autoHints !== undefined ? step.autoHints : currentChapter().autoHints;
        run.hintsOn = auto && step.kind !== 'info';
        run.view = 'step';
        saveState();
        renderPanel();
    }

    // ---------- Prüf-Kontext für die Aufgaben ----------

    function makeContext () {
        const vm = S.getVM();
        const targets = vm ? vm.runtime.targets.filter(t => t.isOriginal) : [];
        const sprites = targets.filter(t => !t.isStage);
        const stage = targets.find(t => t.isStage);
        const blocksOf = t => t.blocks._blocks;

        const c = {
            sprites,
            stage,
            editing: vm && vm.editingTarget,
            base: run.base,
            flags: run.flags,
            keys: run.keys,
            find (opcode) {
                const out = [];
                targets.forEach(t => {
                    Object.values(blocksOf(t)).forEach(b => {
                        if (b.opcode === opcode && !b.shadow) out.push({t, b});
                    });
                });
                return out;
            },
            hatOf (t, b) {
                const blocks = blocksOf(t);
                let cur = b;
                while (cur.parent && blocks[cur.parent]) cur = blocks[cur.parent];
                return cur;
            },
            // Liegt b innerhalb (Substack oder Eingang) eines Blocks mit opcode outer?
            inC (t, b, outer) {
                const blocks = blocksOf(t);
                let cur = b;
                while (cur.parent && blocks[cur.parent]) {
                    const p = blocks[cur.parent];
                    if (p.opcode === outer && p.next !== cur.id) return true;
                    cur = p;
                }
                return false;
            },
            field (b, name) {
                return b.fields[name] ? b.fields[name].value : undefined;
            },
            // Wert eines Menüs (Schatten-Block im Eingang) oder Feldes.
            menu (t, b, name) {
                const input = b.inputs[name];
                if (!input) return c.field(b, name);
                const inner = blocksOf(t)[input.block];
                if (!inner) return undefined;
                const f = Object.values(inner.fields)[0];
                return f ? f.value : undefined;
            },
            text (t, b, name) {
                const v = c.menu(t, b, name);
                return v === undefined ? '' : String(v);
            },
            // Opcode des Blocks, der in einen Eingang gesteckt wurde.
            plugged (t, b, name) {
                const input = b.inputs[name];
                const inner = input && blocksOf(t)[input.block];
                return inner && !inner.shadow ? inner.opcode : null;
            },
            vars () {
                const out = [];
                targets.forEach(t => Object.values(t.variables).forEach(v => {
                    if (v.type === '') out.push(v);
                }));
                return out;
            },
            moved () {
                return sprites.some(t => {
                    const p = run.base.pos[t.id];
                    return p && (p[0] !== t.x || p[1] !== t.y);
                });
            },
            backdropChanged () {
                return !!stage && (stage.getCostumes().length > run.base.backdropCount ||
                    stage.currentCostume !== run.base.backdrop);
            },
            // Ist der Tab (code, costumes, sounds) gerade offen?
            tab (name) {
                const open = selectedTab() === name;
                if (open) run.tabsSeen.add(name);
                return open;
            },
            // War der Tab in diesem Schritt schon einmal offen?
            tabSeen (name) {
                c.tab(name);
                return run.tabsSeen.has(name);
            },
            extension (id) {
                return !!vm && vm.extensionManager.isExtensionLoaded(id);
            },
            // In wie vielen Figuren kommt der Block vor?
            spritesWith (opcode, extra) {
                return new Set(c.find(opcode).filter(({t, b}) => !extra || extra(t, b)).map(({t}) => t.id)).size;
            },
            editingHas (opcode) {
                return !!c.editing && Object.values(blocksOf(c.editing)).some(b => b.opcode === opcode);
            },
            categoryOpen (cat) {
                const el = document.querySelector(`.blocklyToolboxCategoryContainer[id="${cat}"]`);
                return !!el && el.getAttribute('aria-selected') === 'true';
            }
        };
        return c;
    }

    function selectedTab () {
        const tabs = [...document.querySelectorAll('[class*="gui_tab_"]')];
        const index = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
        return ['code', 'costumes', 'sounds'][index] || null;
    }

    function evaluateTasks (c) {
        const step = currentStep();
        const id = stepId(state.chapter, state.step);
        return (step.tasks || []).map((task, i) => {
            if (task.manual) return !!state.manual[`${id}.${i}`];
            // Einmal erledigt bleibt erledigt (z. B. „Flagge geklickt“).
            if (run.taskDone[i]) return true;
            let ok = false;
            try {
                ok = !!task.check(c);
            } catch (e) { /* Projekt im Umbau */ }
            run.taskDone[i] = ok;
            return ok;
        });
    }

    // ---------- Elemente im Editor finden ----------

    function rectOf (el) {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return r.width || r.height ? r : null;
    }

    function flyoutRect () {
        return rectOf(document.querySelector('svg.blocklyFlyout'));
    }

    function workspaceBlock (op) {
        return document.querySelector(`.injectionDiv > svg.blocklySvg .blocklyBlockCanvas g.blocklyBlock.${op}`);
    }

    function ownRect (g) {
        // Rechteck nur dieses Blocks (ohne angehängte Blöcke).
        const path = g && g.querySelector(':scope > path');
        return rectOf(path) || rectOf(g);
    }

    function workspaceRect () {
        const ws = rectOf(document.querySelector('.injectionDiv'));
        const fly = flyoutRect();
        if (!ws) return null;
        const left = fly ? fly.right : ws.left;
        return new DOMRect(left, ws.top, ws.right - left, ws.height);
    }

    function zoom () {
        const ws = S.getWorkspace();
        return (ws && ws.scale) || 0.675;
    }

    // Liefert {rect} oder {redirect: {...}} wenn erst etwas anderes passieren muss.
    function resolveTarget (target) {
        const [kind, arg] = target.split(/:(.*)/);
        switch (kind) {
        case 'cat':
            return {rect: rectOf(document.querySelector(`.blocklyToolboxCategoryContainer[id="${arg}"]`))};
        case 'fly': {
            const g = document.querySelector(`svg.blocklyFlyout .blocklyBlockCanvas > g.${arg}`);
            const r = ownRect(g);
            const fly = flyoutRect();
            const visible = r && fly && r.top >= fly.top - 2 && r.bottom <= fly.bottom + 2;
            if (visible) return {rect: r};
            const cat = CATEGORY[arg.split('_')[0]];
            const catEl = document.querySelector(`.blocklyToolboxCategoryContainer[id="${cat}"]`);
            if (catEl && catEl.getAttribute('aria-selected') === 'true' && r && fly && r.top > fly.bottom) {
                return {redirect: {rect: fly, text: 'Scrolle in der Blockliste nach unten', scroll: true}};
            }
            return {redirect: {rect: rectOf(catEl), text: 'Klicke zuerst hier'}};
        }
        case 'ws':
            return {rect: ownRect(workspaceBlock(arg))};
        case 'flag':
            return {rect: rectOf(document.querySelector('[class*="green-flag_green-flag"]'))};
        case 'stage':
            return {rect: rectOf(document.querySelector('[class*="stage_stage-wrapper"] canvas')) ||
                rectOf(document.querySelector('[class*="stage_stage-wrapper"]'))};
        case 'spriteAdd':
            return {rect: rectOf(document.querySelector('[class*="sprite-selector_add-button"]'))};
        case 'backdropAdd':
            return {rect: rectOf(document.querySelector('[class*="stage-selector_add-button"]'))};
        case 'spriteList':
            return {rect: rectOf(document.querySelector('[class*="sprite-selector_items-wrapper"]'))};
        case 'stageSelector':
            return {rect: rectOf(document.querySelector('[class*="stage-selector_stage-selector"]'))};
        case 'extensionAdd':
            return {rect: rectOf(document.querySelector('[class*="extension-button_extension-button_"]'))};
        case 'palette':
            return {rect: flyoutRect()};
        case 'workspace':
            return {rect: workspaceRect()};
        case 'tab': {
            const tabs = document.querySelectorAll('[class*="gui_tab_"]');
            const index = {code: 0, costumes: 1, sounds: 2}[arg];
            return {rect: rectOf(tabs[index])};
        }
        case 'flybtn': {
            const btn = [...document.querySelectorAll('.blocklyFlyoutButton')].find(b => b.textContent.trim() === arg);
            const r = rectOf(btn);
            if (r) return {rect: r};
            return resolveTarget(`cat:${arg === 'Neuer Block' ? 'myBlocks' : 'variables'}`);
        }
        }
        return {rect: null};
    }

    // Zielpunkt für eine Zieh-Animation.
    function resolveDrop (to) {
        const [kind, op] = to.split(/:(.*)/);
        const wsRect = workspaceRect();
        const fallback = wsRect ? {x: wsRect.left + 120, y: wsRect.top + 120} : null;
        if (kind === 'ws' && !op) return fallback;
        const g = workspaceBlock(op);
        if (!g) return fallback;
        const all = rectOf(g);
        const own = ownRect(g);
        const z = zoom();
        switch (kind) {
        case 'ws': return {x: own.left + own.width * 0.6, y: own.top + own.height / 2};
        case 'under': return {x: all.left + 8, y: all.bottom + 4};
        case 'above': return {x: own.left + 8, y: own.top - 40 * z};
        case 'inside': return {x: own.left + 24 * z, y: own.top + 52 * z};
        case 'cond':
            if (op === 'control_if') return {x: own.left + 60 * z, y: own.top + 24 * z};
            return {x: own.right - 24 * z, y: own.top + 24 * z};
        }
        return fallback;
    }

    // ---------- Overlay mit Hinweisen ----------

    let overlay;
    function ensureOverlay () {
        if (overlay && document.body.contains(overlay)) return overlay;
        overlay = document.createElement('div');
        overlay.className = 'bl-overlay';
        document.body.appendChild(overlay);
        return overlay;
    }

    let lastHintKey = '';
    function clearOverlay () {
        if (overlay) overlay.innerHTML = '';
        lastHintKey = '';
    }

    function placeRing (rect, pad) {
        const ring = document.createElement('div');
        ring.className = 'bl-ring';
        Object.assign(ring.style, {
            left: `${rect.left - pad}px`, top: `${rect.top - pad}px`,
            width: `${rect.width + 2 * pad}px`, height: `${rect.height + 2 * pad}px`
        });
        return ring;
    }

    // Bereiche, die Hinweise nicht verdecken dürfen: offene Auswahlmenüs,
    // Texteingaben im Block und das Kursfenster.
    function avoidRects () {
        const rects = [];
        document.querySelectorAll('.blocklyDropDownDiv, .blocklyWidgetDiv > *, ul[class*="menu_menu"]').forEach(e => {
            const style = getComputedStyle(e);
            if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return;
            const r = rectOf(e);
            if (r) rects.push(r);
        });
        const p = panel && state.open && rectOf(panel);
        if (p) rects.push(p);
        return rects;
    }

    const overlaps = (a, b, gap = 4) => a.left < b.right + gap && a.right > b.left - gap &&
        a.top < b.bottom + gap && a.bottom > b.top - gap;

    const fits = r => r.left >= 4 && r.top >= 4 && r.right <= window.innerWidth - 4 &&
        r.bottom <= window.innerHeight - 4;

    // Sprechblase neben anchor setzen: unten, oben, rechts oder links –
    // die erste Position, die nichts Wichtiges verdeckt.
    function placeBubble (text, anchor, order) {
        const bubble = document.createElement('div');
        bubble.className = 'bl-bubble';
        bubble.textContent = text;
        overlay.appendChild(bubble);
        const w = bubble.offsetWidth;
        const h = bubble.offsetHeight;
        const cx = anchor.left + anchor.width / 2;
        const cy = anchor.top + anchor.height / 2;
        const spots = {
            below: new DOMRect(cx - w / 2, anchor.bottom + 8, w, h),
            above: new DOMRect(cx - w / 2, anchor.top - h - 8, w, h),
            right: new DOMRect(anchor.right + 12, cy - h / 2, w, h),
            left: new DOMRect(anchor.left - w - 12, cy - h / 2, w, h)
        };
        const avoid = avoidRects();
        const candidates = (order || ['below', 'above', 'right', 'left']).map(k => spots[k]);
        const spot = candidates.find(r => fits(r) && !avoid.some(a => overlaps(r, a))) ||
            candidates.find(fits) || candidates[0];
        bubble.style.left = `${Math.max(8, Math.min(window.innerWidth - w - 8, spot.left))}px`;
        bubble.style.top = `${Math.max(8, Math.min(window.innerHeight - h - 8, spot.top))}px`;
        return bubble;
    }

    function drawPoint (rect, text, scroll, order) {
        overlay.appendChild(placeRing(rect, scroll ? 0 : 6));
        const above = rect.bottom + 110 > window.innerHeight;
        const cx = rect.left + Math.min(rect.width / 2, 60);
        const cy = scroll ? rect.bottom - 80 : (above ? rect.top - 44 : rect.bottom + 2);
        const handRect = new DOMRect(cx - 18, cy, 36, 40);
        // Bei offenem Menü keine Hand – sie würde die Einträge verdecken.
        const showHand = !avoidRects().some(a => overlaps(handRect, a, 0));
        if (showHand) {
            const hand = document.createElement('div');
            hand.className = `bl-hand ${above ? 'bl-hand-down' : ''} ${scroll ? 'bl-hand-scroll' : ''}`;
            hand.textContent = scroll || above ? '👇' : '👆';
            hand.style.left = `${handRect.left}px`;
            hand.style.top = `${handRect.top}px`;
            overlay.appendChild(hand);
        }
        const anchor = showHand && !scroll ?
            new DOMRect(Math.min(rect.left, handRect.left), Math.min(rect.top, handRect.top),
                Math.max(rect.right, handRect.right) - Math.min(rect.left, handRect.left),
                Math.max(rect.bottom, handRect.bottom) - Math.min(rect.top, handRect.top)) :
            rect;
        placeBubble(text, anchor, order || (above ? ['above', 'right', 'left', 'below'] : null));
    }

    function drawDrag (fromRect, to, hint) {
        overlay.appendChild(placeRing(fromRect, 5));
        const target = document.createElement('div');
        target.className = 'bl-drop';
        target.style.left = `${to.x - 14}px`;
        target.style.top = `${to.y - 14}px`;
        overlay.appendChild(target);

        const mover = document.createElement('div');
        mover.className = 'bl-mover';
        const sx = fromRect.left;
        const sy = fromRect.top;
        mover.style.setProperty('--sx', `${sx}px`);
        mover.style.setProperty('--sy', `${sy}px`);
        mover.style.setProperty('--dx', `${to.x - 8}px`);
        mover.style.setProperty('--dy', `${to.y - 8}px`);
        if (hint.ghost) {
            try {
                const ghost = S.renderBlocksDe(hint.ghost, zoom());
                ghost.classList.add('bl-ghost');
                mover.appendChild(ghost);
            } catch (e) { /* ohne Geister-Block */ }
        }
        const hand = document.createElement('div');
        hand.className = 'bl-mover-hand';
        hand.textContent = '✊';
        mover.appendChild(hand);
        overlay.appendChild(mover);
        placeBubble(hint.text || 'Ziehen', new DOMRect(to.x - 14, to.y - 14, 28, 28), ['below', 'right', 'above', 'left']);
    }

    function drawLabels (labels) {
        labels.forEach(label => {
            const {rect} = resolveTarget(label.target);
            if (!rect) return;
            const box = document.createElement('div');
            box.className = 'bl-label-box';
            Object.assign(box.style, {
                left: `${rect.left + 4}px`, top: `${rect.top + 4}px`,
                width: `${rect.width - 8}px`, height: `${rect.height - 8}px`
            });
            const tag = document.createElement('div');
            tag.className = 'bl-label-tag';
            tag.textContent = label.text;
            box.appendChild(tag);
            overlay.appendChild(box);
        });
    }

    function updateOverlay (c) {
        ensureOverlay();
        const step = currentStep();
        if (state.open && run.view === 'transition') {
            const h = transitionHint();
            if (!h || !h.rect) return clearOverlay();
            const key = `t|${rk(h.rect)}|${h.text}|${avoidRects().map(rk).join(';')}`;
            if (key === lastHintKey) return;
            overlay.innerHTML = '';
            drawPoint(h.rect, h.text, false, ['right', 'below', 'left', 'above']);
            lastHintKey = key;
            return;
        }
        if (!state.open || run.view !== 'step') {
            clearOverlay();
            return;
        }
        if (step.labels) {
            const key = `labels|${state.chapter}.${state.step}|${geometryKey()}`;
            if (key !== lastHintKey) {
                overlay.innerHTML = '';
                drawLabels(step.labels);
                lastHintKey = key;
            }
            return;
        }
        const hint = run.hintsOn && (step.hints || []).find(h => {
            try {
                return !(h.done && h.done(c));
            } catch (e) {
                return true;
            }
        });
        if (!hint) {
            clearOverlay();
            return;
        }

        let draw;
        let key;
        if (hint.drag) {
            const from = resolveTarget(`fly:${hint.drag}`);
            if (from.redirect) {
                const r = from.redirect;
                if (!r.rect) return clearOverlay();
                key = `p|${rk(r.rect)}|${r.text}`;
                draw = () => drawPoint(r.rect, r.text, r.scroll);
            } else {
                const to = resolveDrop(hint.to);
                if (!from.rect || !to) return clearOverlay();
                key = `d|${rk(from.rect)}|${Math.round(to.x)},${Math.round(to.y)}|${hint.drag}`;
                draw = () => drawDrag(from.rect, to, hint);
            }
        } else {
            const res = resolveTarget(hint.target);
            const r = res.redirect || {rect: res.rect, text: hint.text};
            if (!r.rect) return clearOverlay();
            key = `p|${rk(r.rect)}|${r.text}`;
            draw = () => drawPoint(r.rect, r.text, r.scroll);
        }
        // Neu zeichnen, wenn ein Menü auf- oder zugeht oder das Fenster bewegt wird.
        key += `|${avoidRects().map(rk).join(';')}`;
        if (key === lastHintKey) return;
        overlay.innerHTML = '';
        draw();
        lastHintKey = key;
    }

    const rk = r => `${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.width)},${Math.round(r.height)}`;
    const geometryKey = () => `${window.innerWidth}x${window.innerHeight}|${rk(workspaceRect() || new DOMRect())}`;

    // ---------- Kursfenster ----------

    let panel;

    function el (tag, cls, html) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html !== undefined) e.innerHTML = html;
        return e;
    }

    function button (cls, html, title, onClick) {
        const b = el('button', cls, html);
        b.type = 'button';
        if (title) b.title = title;
        b.addEventListener('click', e => {
            e.stopPropagation();
            onClick(e);
        });
        return b;
    }

    function ensurePanel () {
        if (panel && document.body.contains(panel)) return panel;
        panel = el('div', 'bl-panel');
        document.body.appendChild(panel);
        return panel;
    }

    function totalSteps () {
        return currentChapter().steps.length;
    }

    function renderPanel () {
        ensurePanel();
        panel.style.display = state.open ? '' : 'none';
        if (!state.open) {
            clearOverlay();
            return;
        }
        panel.classList.toggle('bl-collapsed', state.collapsed);
        panel.innerHTML = '';

        const chapter = currentChapter();
        const step = currentStep();

        // Kopfzeile
        const header = el('div', 'bl-header');
        const titles = el('div', 'bl-header-titles');
        titles.appendChild(el('div', 'bl-header-brand', 'BayernLab Kurs'));
        titles.appendChild(el('div', 'bl-header-sub', state.transition ?
            `Projekt sichern → Kapitel ${chapterIndex(state.transition.chapterId) + 1}` :
            `Kapitel ${state.chapter + 1}: ${chapter.title} · ${state.step + 1}/${totalSteps()}`));
        header.appendChild(titles);
        const actions = el('div', 'bl-header-actions');
        actions.appendChild(button('bl-icon-btn', '☰', 'Kapitelübersicht', () => {
            run.view = run.view === 'menu' ? (state.transition ? 'transition' : 'step') : 'menu';
            state.collapsed = false;
            renderPanel();
        }));
        actions.appendChild(button('bl-icon-btn', state.collapsed ? '▴' : '▾',
            state.collapsed ? 'Ausklappen' : 'Einklappen', () => {
                state.collapsed = !state.collapsed;
                saveState();
                renderPanel();
            }));
        actions.appendChild(button('bl-icon-btn', '✕', 'Kurs schließen (Fortschritt bleibt gespeichert)', () => {
            state.open = false;
            saveState();
            renderPanel();
        }));
        header.appendChild(actions);
        makeDraggable(header);
        panel.appendChild(header);

        // Fortschrittsbalken
        const progress = el('div', 'bl-progress');
        chapter.steps.forEach((s, i) => {
            const pip = el('span', 'bl-pip');
            if (state.done[stepId(state.chapter, i)]) pip.classList.add('bl-pip-done');
            if (i === state.step) pip.classList.add('bl-pip-active');
            pip.title = s.title;
            progress.appendChild(pip);
        });
        panel.appendChild(progress);

        if (state.collapsed) {
            const mini = el('div', 'bl-mini');
            mini.textContent = state.transition ? '💾 Projekt sichern und neu starten' : `${KIND[step.kind].icon} ${step.title}`;
            mini.addEventListener('click', () => {
                state.collapsed = false;
                saveState();
                renderPanel();
            });
            panel.appendChild(mini);
            clampPanel();
            return;
        }

        const body = el('div', 'bl-body');
        if (run.view === 'menu') {
            renderMenu(body);
        } else if (run.view === 'transition') {
            renderTransition(body);
        } else {
            renderStep(body, step);
        }
        panel.appendChild(body);
        if (run.view === 'step') panel.appendChild(renderFooter(step));
        if (run.view === 'transition') panel.appendChild(renderTransitionFooter());
        clampPanel();
        lastHintKey = '';
        lastResultsKey = '';
    }

    function renderStep (body, step) {
        const kind = KIND[step.kind];
        body.appendChild(el('div', `bl-kind bl-kind-${step.kind}`, `${kind.icon} ${kind.label}`));
        body.appendChild(el('h3', 'bl-title', step.title));
        body.appendChild(el('div', 'bl-text', step.text));

        if (step.blocks) {
            const wrap = el('div', 'bl-blocks');
            wrap.appendChild(el('div', 'bl-blocks-label', 'So soll es aussehen:'));
            try {
                wrap.appendChild(S.renderBlocksDe(step.blocks, 0.6));
            } catch (e) {
                console.warn('[BayernLab] Blöcke konnten nicht gerendert werden', e);
            }
            body.appendChild(wrap);
        }

        if (step.tasks && step.tasks.length) {
            const list = el('ul', 'bl-tasks');
            step.tasks.forEach((task, i) => {
                const li = el('li', 'bl-task');
                li.dataset.index = i;
                const box = el('span', 'bl-check');
                li.appendChild(box);
                li.appendChild(el('span', 'bl-task-text', task.text));
                if (task.manual) {
                    li.classList.add('bl-task-manual');
                    li.title = 'Zum Abhaken klicken';
                    li.addEventListener('click', () => {
                        const key = `${stepId(state.chapter, state.step)}.${i}`;
                        state.manual[key] = !state.manual[key];
                        saveState();
                    });
                }
                list.appendChild(li);
            });
            body.appendChild(list);
        }

        body.appendChild(el('div', 'bl-success'));
    }

    function renderFooter (step) {
        const footer = el('div', 'bl-footer');
        footer.appendChild(button('bl-btn bl-btn-secondary', '←', 'Zurück', () => go(-1)));
        if (step.hints && step.hints.length) {
            const hintBtn = button(`bl-btn bl-btn-hint ${run.hintsOn ? 'bl-on' : ''}`,
                run.hintsOn ? '👆 Hinweise aus' : '👆 Zeig mir wie', 'Zeigt, wo du klicken musst', () => {
                    run.hintsOn = !run.hintsOn;
                    renderPanel();
                });
            footer.appendChild(hintBtn);
        } else {
            footer.appendChild(el('span', 'bl-spacer'));
        }
        const next = button('bl-btn bl-btn-primary bl-next', 'Weiter →', '', () => go(1));
        footer.appendChild(next);
        return footer;
    }

    function renderMenu (body) {
        body.appendChild(el('h3', 'bl-title', 'Kapitel'));
        chapters.forEach((chapter, ci) => {
            const section = el('div', 'bl-menu-chapter');
            section.appendChild(el('div', 'bl-menu-chapter-title',
                `${ci + 1}. ${chapter.icon || ''} ${chapter.title} <span class="bl-menu-level">${chapter.type}</span>`));
            chapter.steps.forEach((s, si) => {
                const done = state.done[stepId(ci, si)];
                const item = button(`bl-menu-step ${ci === state.chapter && si === state.step ? 'bl-current' : ''}`,
                    `<span>${done ? '✅' : KIND[s.kind].icon}</span> ${s.title}`, '', () => openChapter(ci, si));
                section.appendChild(item);
            });
            body.appendChild(section);
        });
        body.appendChild(button('bl-btn bl-btn-secondary bl-menu-level-btn', 'Stufe neu wählen', '', () => {
            showLevelDialog();
        }));
        requestAnimationFrame(() => {
            const current = body.querySelector('.bl-current');
            if (current) current.scrollIntoView({block: 'center'});
        });
    }

    function updatePanelTasks (results, complete) {
        if (!panel || state.collapsed || run.view !== 'step') return;
        panel.querySelectorAll('.bl-task').forEach(li => {
            li.classList.toggle('bl-task-done', !!results[li.dataset.index]);
        });
        const step = currentStep();
        const next = panel.querySelector('.bl-next');
        const success = panel.querySelector('.bl-success');
        const hasTasks = step.tasks && step.tasks.length;
        if (next) {
            const last = isLastStep();
            next.textContent = last ? 'Kapitel fertig ✓' : 'Weiter →';
            next.classList.toggle('bl-pulse', !!(complete && hasTasks));
            next.classList.toggle('bl-muted', !!(hasTasks && !complete));
            next.title = hasTasks && !complete ? 'Du kannst auch überspringen' : '';
        }
        if (success) {
            if (complete && hasTasks) {
                const following = nextStepInfo();
                success.innerHTML = `<b>Super gemacht! 🎉</b>${following ? `<br>Als Nächstes: ${following}` : ''}`;
                success.style.display = 'block';
            } else {
                success.style.display = 'none';
            }
        }
        clampPanel();
    }

    function isLastStep () {
        return state.step === totalSteps() - 1;
    }

    function nextStepInfo () {
        if (!isLastStep()) {
            const s = currentChapter().steps[state.step + 1];
            return `${KIND[s.kind].icon} ${s.title}`;
        }
        const nc = chapters[state.chapter + 1];
        return nc ? `📘 Kapitel ${state.chapter + 2}: ${nc.title}` : '';
    }

    function go (delta) {
        if (delta > 0 && isLastStep()) {
            state.done[stepId(state.chapter, state.step)] = true;
            showChapterDone();
            return;
        }
        const target = state.step + delta;
        if (target < 0) {
            if (state.chapter === 0) return;
            state.chapter--;
            state.step = totalSteps() - 1;
        } else {
            state.step = target;
        }
        enterStep();
    }

    function showChapterDone () {
        const nextChapter = chapters[state.chapter + 1];
        saveState();
        const body = panel.querySelector('.bl-body');
        const footer = panel.querySelector('.bl-footer');
        if (footer) footer.remove();
        run.view = 'done';
        clearOverlay();
        body.innerHTML = '';
        body.appendChild(el('div', 'bl-trophy', '🏆'));
        body.appendChild(el('h3', 'bl-title bl-center', `Kapitel „${currentChapter().title}“ geschafft!`));
        body.appendChild(el('div', 'bl-text bl-center',
            nextChapter ?
                `<p>Stark! Bereit für das nächste Abenteuer: <b>${nextChapter.title}</b>?</p>` :
                '<p>Du hast den ganzen BayernLab-Kurs geschafft. Jetzt bist du ein echter Scratch-Profi!</p>'));
        const row = el('div', 'bl-footer');
        row.appendChild(button('bl-btn bl-btn-secondary', 'Zur Übersicht', '', () => {
            run.view = 'menu';
            renderPanel();
        }));
        if (nextChapter) {
            row.appendChild(button('bl-btn bl-btn-primary', 'Weiter →', 'Projekt sichern und nächstes Kapitel starten', () => {
                openChapter(state.chapter + 1, 0);
            }));
        }
        panel.appendChild(row);
        confetti();
    }

    // ---------- Projekt sichern & neues Projekt zwischen Kapiteln ----------

    const SAVE_LABELS = /^(Auf deinem Computer speichern|Jetzt speichern|Als Kopie speichern|Save to your computer|Save now|Save as a copy)$/;

    // Speichern erkennen: Klicks auf die Speichern-Einträge von Scratch mitlesen.
    document.addEventListener('click', e => {
        if (!state.transition) return;
        const item = e.target.closest && e.target.closest('li, button, [class*="save-now"]');
        if (item && SAVE_LABELS.test(item.textContent.trim())) {
            state.transition.saved = true;
            saveState();
        }
    }, true);

    // Leeres Projekt wie nach „Datei → Neu“: höchstens eine Figur, keine Blöcke, ein Bühnenbild.
    function isFreshProject () {
        const vm = S.getVM();
        if (!vm) return false;
        const targets = vm.runtime.targets.filter(t => t.isOriginal);
        const stage = targets.find(t => t.isStage);
        return targets.filter(t => !t.isStage).length <= 1 &&
            targets.every(t => Object.keys(t.blocks._blocks).length === 0) &&
            (!stage || stage.getCostumes().length <= 1);
    }

    // Angemeldete Nutzer haben „Jetzt speichern“ in der Menüleiste.
    function loggedIn () {
        return [...document.querySelectorAll('[class*="menu-bar_menu-bar"] *')]
            .some(e => e.children.length === 0 && e.textContent.trim() === 'Jetzt speichern');
    }

    // Zu einem Kapitel wechseln – bei vorhandener Arbeit erst sichern und neu anlegen.
    function openChapter (ci, si) {
        if (ci === state.chapter || isFreshProject()) {
            state.transition = null;
            state.chapter = ci;
            state.step = si;
            enterStep();
            return;
        }
        state.transition = {chapterId: chapters[ci].id, step: si, saved: false, fresh: false};
        run.view = 'transition';
        saveState();
        renderPanel();
    }

    function finishTransition () {
        const t = state.transition;
        state.transition = null;
        state.chapter = chapterIndex(t.chapterId);
        state.step = t.step;
        enterStep();
    }

    function transitionResults () {
        const t = state.transition;
        if (!t.fresh && isFreshProject()) {
            t.fresh = true;
            saveState();
        }
        return [t.saved, t.fresh];
    }

    function renderTransition (body) {
        const target = chapters[chapterIndex(state.transition.chapterId)];
        const saveWay = loggedIn() ? 'Datei → Jetzt speichern' : 'Datei → Auf deinem Computer speichern';
        body.appendChild(el('div', 'bl-kind bl-kind-save', '💾 Projekt sichern'));
        body.appendChild(el('h3', 'bl-title', 'Speichern und neu starten'));
        body.appendChild(el('div', 'bl-text',
            `<p>Bevor es mit <b>${target.icon} ${target.title}</b> weitergeht: Speichere dein Projekt, damit nichts verloren geht. ` +
            'Danach startest du mit einem <b>neuen, leeren Projekt</b>.</p>'));
        const list = el('ul', 'bl-tasks');
        [`Projekt speichern (${saveWay})`, 'Neues Projekt anlegen (Datei → Neu)'].forEach((text, i) => {
            const li = el('li', 'bl-task');
            li.dataset.index = i;
            li.appendChild(el('span', 'bl-check'));
            li.appendChild(el('span', 'bl-task-text', text));
            list.appendChild(li);
        });
        body.appendChild(list);
        body.appendChild(el('div', 'bl-tip', loggedIn() ?
            '💡 Gib dem Projekt vorher oben in der Menüleiste einen Namen, z. B. „Kapitel 2 – Tanz-Party“.' :
            '💡 Nenne die Datei z. B. „Kapitel 2 – Tanz-Party.sb3“. Mit <b>Datei → Load from your computer</b> kannst du später weiterbauen.'));
    }

    function renderTransitionFooter () {
        const footer = el('div', 'bl-footer');
        footer.appendChild(button('bl-btn bl-btn-secondary', 'Überspringen', 'Ohne Speichern weiter', finishTransition));
        footer.appendChild(button('bl-btn bl-btn-primary bl-next', 'Los geht\'s →', '', finishTransition));
        return footer;
    }

    function updateTransitionTasks () {
        const results = transitionResults();
        const complete = results.every(Boolean);
        const key = `transition|${results.join()}|${state.collapsed}`;
        if (key === lastResultsKey || !panel) return;
        lastResultsKey = key;
        panel.querySelectorAll('.bl-task').forEach(li => {
            li.classList.toggle('bl-task-done', !!results[li.dataset.index]);
        });
        const next = panel.querySelector('.bl-next');
        if (next) {
            next.classList.toggle('bl-pulse', complete);
            next.classList.toggle('bl-muted', !complete);
        }
        clampPanel();
    }

    function transitionHint () {
        const [saved, fresh] = transitionResults();
        if (saved && fresh) return null;
        const fileButton = [...document.querySelectorAll('[class*="menu-bar_menu-bar-item"]')]
            .find(b => b.textContent.trim().startsWith('Datei'));
        const menuItem = text => [...document.querySelectorAll('li[class*="menu_menu-item"]')]
            .find(li => li.textContent.trim() === text);
        if (!saved) {
            const label = loggedIn() ? 'Jetzt speichern' : 'Auf deinem Computer speichern';
            const item = menuItem(label);
            if (item) return {rect: rectOf(item), text: 'Speichern'};
            return {rect: rectOf(fileButton), text: 'Klicke auf „Datei“ zum Speichern'};
        }
        const item = menuItem('Neu');
        if (item) return {rect: rectOf(item), text: 'Neues Projekt'};
        return {rect: rectOf(fileButton), text: 'Klicke auf „Datei“ und dann auf „Neu“'};
    }

    // ---------- Konfetti ----------

    function confetti () {
        const rect = panel.getBoundingClientRect();
        const colors = ['#003E7E', '#006EB7', '#3CB4E1', '#FFBF00', '#FF8C1A', '#59C059', '#9966FF'];
        for (let i = 0; i < 40; i++) {
            const piece = el('div', 'bl-confetti');
            piece.style.left = `${rect.left + rect.width / 2}px`;
            piece.style.top = `${rect.top + 40}px`;
            piece.style.background = colors[i % colors.length];
            piece.style.setProperty('--x', `${(Math.random() - 0.5) * 420}px`);
            piece.style.setProperty('--y', `${-80 - Math.random() * 220}px`);
            piece.style.setProperty('--r', `${Math.random() * 720}deg`);
            document.body.appendChild(piece);
            setTimeout(() => piece.remove(), 1600);
        }
    }

    // ---------- Fenster verschieben ----------

    function makeDraggable (handle) {
        handle.addEventListener('pointerdown', e => {
            if (e.target.closest('button')) return;
            const start = panel.getBoundingClientRect();
            const ox = e.clientX - start.left;
            const oy = e.clientY - start.top;
            handle.setPointerCapture(e.pointerId);
            const move = ev => {
                state.pos = {x: ev.clientX - ox, y: ev.clientY - oy};
                clampPanel();
            };
            const up = () => {
                handle.removeEventListener('pointermove', move);
                handle.removeEventListener('pointerup', up);
                saveState();
            };
            handle.addEventListener('pointermove', move);
            handle.addEventListener('pointerup', up);
        });
    }

    function clampPanel () {
        if (!panel) return;
        const w = panel.offsetWidth;
        const h = panel.offsetHeight;
        let pos = state.pos;
        if (!pos) {
            const fly = flyoutRect();
            pos = {x: fly ? fly.right + 16 : 330, y: window.innerHeight - h - 24};
        }
        const x = Math.max(4, Math.min(window.innerWidth - w - 4, pos.x));
        const y = Math.max(4, Math.min(window.innerHeight - h - 4, pos.y));
        panel.style.left = `${x}px`;
        panel.style.top = `${y}px`;
    }

    // ---------- Stufenwahl ----------

    function showLevelDialog () {
        const old = document.querySelector('.bl-modal-backdrop');
        if (old) old.remove();
        const backdrop = el('div', 'bl-modal-backdrop');
        const modal = el('div', 'bl-modal');
        modal.appendChild(button('bl-modal-close', '✕', 'Schließen', () => backdrop.remove()));
        modal.appendChild(el('div', 'bl-modal-brand', 'BayernLab'));
        modal.appendChild(el('h2', 'bl-modal-title', 'Scratch-Kurs starten'));
        modal.appendChild(el('p', 'bl-modal-text', 'Wie gut kennst du dich mit Scratch schon aus? Je nach Stufe startest du an einer anderen Stelle im Kurs.'));

        const grid = el('div', 'bl-level-grid');
        levels.forEach(level => {
            const card = button('bl-level-card', '', '', () => {
                backdrop.remove();
                state.started = true;
                state.open = true;
                state.collapsed = false;
                state.level = level.id;
                openChapter(chapterIndex(level.chapter), 0);
            });
            card.appendChild(el('div', 'bl-level-icon', level.icon));
            card.appendChild(el('div', 'bl-level-title', level.title));
            card.appendChild(el('div', 'bl-level-text', level.text));
            const own = chapters.filter(ch => ch.level === level.id);
            const list = el('ul', 'bl-level-chapters');
            own.forEach(ch => list.appendChild(el('li', '', `${ch.icon} ${ch.title}`)));
            card.appendChild(list);
            card.appendChild(el('div', 'bl-level-start',
                `Start: Kapitel ${chapterIndex(level.chapter) + 1}`));
            grid.appendChild(card);
        });
        modal.appendChild(grid);

        if (state.started) {
            const step = currentStep();
            modal.appendChild(button('bl-btn bl-btn-primary bl-resume',
                `Weitermachen: Kapitel ${state.chapter + 1}, „${step.title}“`, '', () => {
                    backdrop.remove();
                    state.open = true;
                    state.collapsed = false;
                    if (state.transition) {
                        renderPanel();
                    } else {
                        enterStep();
                    }
                }));
        }

        backdrop.appendChild(modal);
        backdrop.addEventListener('click', e => {
            if (e.target === backdrop) backdrop.remove();
        });
        document.body.appendChild(backdrop);
    }

    // ---------- Menü-Button ----------

    function ensureMenuButton () {
        if (document.querySelector('.bl-menu-button')) return;
        const groups = document.querySelectorAll('[class*="menu-bar_file-group"]');
        const group = groups[groups.length - 1];
        if (!group) return;
        const reference = group.querySelector('[class*="menu-bar_menu-bar-item"]');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `${reference ? reference.className.replace('tutorials-button', '') : ''} bl-menu-button`;
        btn.innerHTML = '<span class="bl-menu-logo">BL</span><span>BayernLab Kurs starten</span>';
        btn.addEventListener('click', e => {
            e.stopPropagation();
            showLevelDialog();
        });
        group.appendChild(btn);
    }

    // ---------- Hauptschleife ----------

    let vmHooked = null;
    function hookVM () {
        const vm = S.getVM();
        if (!vm || vmHooked === vm) return;
        vmHooked = vm;
        vm.runtime.on('PROJECT_START', () => {
            run.flags++;
        });
        vm.runtime.on('KEY_PRESSED', key => {
            run.keys.add(key);
        });
    }

    let lastResultsKey = '';
    function tick () {
        ensureMenuButton();
        if (!S.getStore()) return;
        hookVM();
        if (!state.open) {
            if (overlay) clearOverlay();
            return;
        }
        if (!panel || !document.body.contains(panel)) renderPanel();
        if (state.transition && run.view === 'step') {
            run.view = 'transition';
            renderPanel();
        }
        if (!state.transition && !run.base) enterStep();
        if (run.view === 'transition') {
            updateTransitionTasks();
            updateOverlay(null);
            return;
        }
        if (run.view !== 'step') {
            clearOverlay();
            return;
        }

        const c = makeContext();
        const results = evaluateTasks(c);
        const step = currentStep();
        const complete = !(step.tasks && step.tasks.length) || results.every(Boolean);
        const resultsKey = `${state.chapter}.${state.step}|${results.join()}|${complete}|${state.collapsed}`;
        if (resultsKey !== lastResultsKey) {
            lastResultsKey = resultsKey;
            updatePanelTasks(results, complete);
            if (complete && step.tasks && step.tasks.length && !run.wasComplete) {
                run.wasComplete = true;
                state.done[stepId(state.chapter, state.step)] = true;
                saveState();
                renderProgressPips();
                confetti();
            }
        }
        updateOverlay(c);
    }

    function renderProgressPips () {
        if (!panel) return;
        panel.querySelectorAll('.bl-pip').forEach((pip, i) => {
            pip.classList.toggle('bl-pip-done', !!state.done[stepId(state.chapter, i)]);
        });
    }

    window.addEventListener('resize', () => {
        clampPanel();
        lastHintKey = '';
    });

    setInterval(tick, TICK_MS);
})();
