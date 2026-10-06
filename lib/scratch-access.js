/*
 * Gemeinsamer Zugriff auf die Interna des Scratch-Editors:
 * Redux-Store, VM, Blockly-Workspace und deutsches Block-Rendering.
 */
(function () {
    'use strict';

    function reactKey (el) {
        return Object.keys(el).find(k =>
            k.startsWith('__reactInternalInstance$') ||
            k.startsWith('__reactFiber$') ||
            k.startsWith('__reactContainer$'));
    }

    // Redux-Store über die React-Fiber-Struktur der Seite finden.
    function findStore () {
        const candidates = [
            document.querySelector('[class*="gui_page-wrapper"]'),
            document.querySelector('[class*="menu-bar_menu-bar"]'),
            document.querySelector('[class*="gui_body-wrapper"]'),
            document.getElementById('app')
        ];
        for (const el of candidates) {
            if (!el) continue;
            const key = reactKey(el);
            let fiber = key && el[key];
            while (fiber) {
                const s = (fiber.memoizedProps && fiber.memoizedProps.store) ||
                    (fiber.stateNode && fiber.stateNode.props && fiber.stateNode.props.store);
                if (s && typeof s.getState === 'function' && s.getState().scratchGui) return s;
                fiber = fiber.return;
            }
        }
        return null;
    }

    let store = null;
    function getStore () {
        if (!store) store = findStore();
        return store;
    }

    function getVM () {
        const s = getStore();
        return s ? s.getState().scratchGui.vm : null;
    }

    // Blockly-Workspace der Blocks-Komponente (für den Zoomfaktor).
    function getWorkspace () {
        const el = document.querySelector('[class*="blocks_blocks"]');
        if (!el) return null;
        const key = reactKey(el);
        let fiber = key && el[key];
        for (let depth = 0; fiber && depth < 60; depth++) {
            if (fiber.stateNode && fiber.stateNode.workspace) return fiber.stateNode.workspace;
            fiber = fiber.return;
        }
        return null;
    }

    const svgCache = new Map();

    // Englischen scratchblocks-Code parsen und auf Deutsch rendern.
    function renderBlocksDe (code, scale) {
        const sb = window.scratchblocks;
        const cacheKey = `${scale}|${code}`;
        if (!svgCache.has(cacheKey)) {
            const doc = sb.parse(code, {languages: ['en']});
            doc.translate(sb.allLanguages.de);
            const svg = sb.render(doc, {style: 'scratch3', scale: scale || 0.675});
            const w = parseFloat(svg.getAttribute('width'));
            const h = parseFloat(svg.getAttribute('height'));
            if (!svg.getAttribute('viewBox') && w && h) svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
            svg.style.maxWidth = `${w}px`;
            svg.removeAttribute('width');
            svg.removeAttribute('height');
            svgCache.set(cacheKey, svg);
        }
        return svgCache.get(cacheKey).cloneNode(true);
    }

    window.BayernLabScratch = {findStore, getStore, getVM, getWorkspace, renderBlocksDe};
})();
