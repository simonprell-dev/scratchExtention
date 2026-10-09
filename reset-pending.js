/*
 * Läuft auf scratch.mit.edu vor allen anderen Skripten (isolierte Welt, gleicher
 * localStorage wie die Seite). Wurde der Lernfortschritt über das Symbol zurückgesetzt,
 * während kein Scratch-Tab offen war, wird das hier nachgeholt.
 */
'use strict';

chrome.storage.local.get('resetPending').then(({resetPending}) => {
    if (!resetPending) return;
    try {
        localStorage.removeItem('einfuehrungskurs:v2');
        localStorage.removeItem('bayernlab-course:v2');
    } catch (e) { /* egal */ }
    chrome.storage.local.remove('resetPending');
});
