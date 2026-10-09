/*
 * Scratch Tutorials auf Deutsch
 *
 * Scratch liefert für die Tutorial-Karten keine deutschen Bilder – die
 * Schritt-Bilder zeigen immer englische Blöcke. Dieses Skript läuft in der
 * Seite (MAIN world), liest aus dem Redux-Store von Scratch, welcher
 * Tutorial-Schritt gerade angezeigt wird, und ersetzt das englische Bild
 * durch dieselben Blöcke, gerendert mit scratchblocks auf Deutsch.
 */
(function () {
    'use strict';

    const STEPS = window.__scratchDeSteps || {};
    const PREF_KEY = 'scratch-tutorials-de:show-original';
    const WRAPPER_CLASS = 'scratch-de-wrapper';

    let store = null;
    let showOriginal = readPref();
    const svgCache = new Map();

    function readPref () {
        try {
            return localStorage.getItem(PREF_KEY) === '1';
        } catch (e) {
            return false;
        }
    }

    function writePref (value) {
        try {
            localStorage.setItem(PREF_KEY, value ? '1' : '0');
        } catch (e) { /* egal */ }
    }

    const findStore = window.EinfuehrungskursScratch.findStore;

    function currentStep () {
        if (!store) return null;
        const cards = store.getState().scratchGui.cards;
        if (!cards || !cards.visible || !cards.activeDeckId) return null;
        const deck = cards.content && cards.content[cards.activeDeckId];
        const step = deck && deck.steps && deck.steps[cards.step];
        return step && step.image ? step.image : null;
    }

    function renderSvg (key) {
        if (svgCache.has(key)) return svgCache.get(key).cloneNode(true);
        const doc = window.scratchblocks.parse(STEPS[key].code, {languages: ['de', 'en']});
        const svg = window.scratchblocks.render(doc, {style: 'scratch3', scale: 0.675});
        const w = parseFloat(svg.getAttribute('width'));
        const h = parseFloat(svg.getAttribute('height'));
        if (!svg.getAttribute('viewBox') && w && h) svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.style.maxWidth = `${w}px`;
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svgCache.set(key, svg);
        return svg.cloneNode(true);
    }

    function buildWrapper (key) {
        const entry = STEPS[key];
        const wrapper = document.createElement('div');
        wrapper.className = WRAPPER_CLASS;
        wrapper.dataset.key = key;

        const blocks = document.createElement('div');
        blocks.className = 'scratch-de-blocks';
        try {
            blocks.appendChild(renderSvg(key));
        } catch (e) {
            console.warn('[Scratch Tutorials DE] Rendern fehlgeschlagen:', key, e);
            return null;
        }
        wrapper.appendChild(blocks);

        if (entry.note) {
            const note = document.createElement('div');
            note.className = 'scratch-de-note';
            note.textContent = entry.note;
            wrapper.appendChild(note);
        }
        return wrapper;
    }

    function buildToggle () {
        const btn = document.createElement('button');
        btn.className = 'scratch-de-toggle';
        btn.type = 'button';
        btn.addEventListener('click', e => {
            e.stopPropagation();
            showOriginal = !showOriginal;
            writePref(showOriginal);
            update();
        });
        return btn;
    }

    function update () {
        const img = document.querySelector('img[class*="card_step-image"]');
        if (!img) return;
        const container = img.parentElement;
        if (!store) store = findStore();
        const key = currentStep();
        const hasTranslation = key && STEPS[key] && STEPS[key].code;

        let wrapper = container.querySelector(`.${WRAPPER_CLASS}`);
        let toggle = container.querySelector('.scratch-de-toggle');

        if (!hasTranslation) {
            if (wrapper) wrapper.remove();
            if (toggle) toggle.remove();
            img.style.display = '';
            return;
        }

        if (!wrapper || wrapper.dataset.key !== key) {
            if (wrapper) wrapper.remove();
            wrapper = buildWrapper(key);
            if (!wrapper) return;
            container.appendChild(wrapper);
        }
        if (!toggle) {
            toggle = buildToggle();
            container.appendChild(toggle);
        }
        container.classList.add('scratch-de-container');

        wrapper.style.display = showOriginal ? 'none' : '';
        img.style.display = showOriginal ? '' : 'none';
        toggle.textContent = showOriginal ? 'Deutsch' : 'Original';
        toggle.title = showOriginal ?
            'Blöcke auf Deutsch anzeigen' :
            'Originalbild (Englisch) anzeigen';
    }

    let scheduled = false;
    function scheduleUpdate () {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
            scheduled = false;
            update();
        });
    }

    new MutationObserver(scheduleUpdate).observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Schrittwechsel kommen auch über den Store, falls React das <img> wiederverwendet.
    const storeTimer = setInterval(() => {
        store = store || findStore();
        if (store) {
            clearInterval(storeTimer);
            store.subscribe(scheduleUpdate);
            scheduleUpdate();
        }
    }, 1000);
})();
