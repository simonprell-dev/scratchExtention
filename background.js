/*
 * Hintergrund der Erweiterung: Symbol in der Browserleiste.
 *
 *   Klick         öffnet den Scratch-Editor (oder holt einen offenen Editor-Tab nach vorn).
 *   Rechtsklick   Erweiterung an/aus, Lernfortschritt zurücksetzen, Hilfe.
 *
 * Die Skripte für scratch.mit.edu werden hier registriert statt im Manifest, damit sie
 * sich abschalten lassen. Der Kursfortschritt liegt im localStorage von scratch.mit.edu
 * und wird deshalb über ein Skript in der Seite gelöscht.
 */
'use strict';

const EDITOR_URL = 'https://scratch.mit.edu/projects/editor/';
const HELP_URL = 'https://github.com/simonprell-dev/scratchExtention#benutzung';
const SCRATCH_TABS = 'https://scratch.mit.edu/*';

const PAGE_SCRIPTS = {
    id: 'scratch-de',
    matches: [SCRATCH_TABS],
    js: [
        'lib/scratchblocks.min.js',
        'lib/scratchblocks-de.js',
        'lib/scratch-access.js',
        'data/steps-de.js',
        'content.js',
        'course/course-data.js',
        'course/course.js'
    ],
    css: ['content.css', 'course/course.css'],
    runAt: 'document_idle',
    world: 'MAIN'
};

// Läuft immer, auch bei abgeschalteter Erweiterung: holt ein Zurücksetzen nach, das
// angefordert wurde, während kein Scratch-Tab offen war.
const RESET_SCRIPT = {
    id: 'reset-pending',
    matches: [SCRATCH_TABS],
    js: ['reset-pending.js'],
    runAt: 'document_start'
};

// ---------- Ein/Aus ----------

async function isEnabled () {
    const {enabled = true} = await chrome.storage.local.get('enabled');
    return enabled;
}

async function applyEnabled (enabled) {
    const registered = (await chrome.scripting.getRegisteredContentScripts()).map(s => s.id);
    if (registered.length) await chrome.scripting.unregisterContentScripts({ids: registered});
    await chrome.scripting.registerContentScripts(enabled ? [PAGE_SCRIPTS, RESET_SCRIPT] : [RESET_SCRIPT]);

    await chrome.action.setBadgeText({text: enabled ? '' : 'AUS'});
    await chrome.action.setBadgeBackgroundColor({color: '#7D8299'});
    await chrome.action.setTitle({title: enabled ?
        'Scratch auf Deutsch + Einführungskurs\nKlick: Scratch öffnen · Rechtsklick: Einstellungen' :
        'Scratch auf Deutsch + Einführungskurs (ausgeschaltet)\nRechtsklick zum Einschalten'});
}

// ---------- Kontextmenü ----------

function createMenu (enabled) {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({id: 'enabled', type: 'checkbox', checked: enabled,
            title: 'Erweiterung eingeschaltet', contexts: ['action']});
        chrome.contextMenus.create({id: 'reset', title: 'Lernfortschritt zurücksetzen …', contexts: ['action']});
        chrome.contextMenus.create({id: 'help', title: 'Hilfe und Anleitung', contexts: ['action']});
    });
}

async function setup () {
    const enabled = await isEnabled();
    createMenu(enabled);
    await applyEnabled(enabled);
}

chrome.runtime.onInstalled.addListener(setup);
chrome.runtime.onStartup.addListener(setup);

chrome.contextMenus.onClicked.addListener(async info => {
    if (info.menuItemId === 'enabled') {
        await chrome.storage.local.set({enabled: info.checked});
        await applyEnabled(info.checked);
        notifyTabs(info.checked ?
            'Die Erweiterung ist eingeschaltet. Lade die Seite neu (F5), damit sie wirkt.' :
            'Die Erweiterung ist ausgeschaltet. Lade die Seite neu (F5), damit sie verschwindet.');
    } else if (info.menuItemId === 'reset') {
        await resetProgress();
    } else if (info.menuItemId === 'help') {
        chrome.tabs.create({url: HELP_URL});
    }
});

// ---------- Klick aufs Symbol ----------

chrome.action.onClicked.addListener(async () => {
    const [tab] = await chrome.tabs.query({url: 'https://scratch.mit.edu/projects/*'});
    if (tab) {
        await chrome.tabs.update(tab.id, {active: true});
        await chrome.windows.update(tab.windowId, {focused: true});
    } else {
        await chrome.tabs.create({url: EDITOR_URL});
    }
});

// ---------- Lernfortschritt zurücksetzen ----------

async function resetProgress () {
    const tabs = await chrome.tabs.query({url: SCRATCH_TABS});
    if (!tabs.length) {
        // Kein Scratch offen: beim nächsten Besuch erledigt reset-pending.js das.
        await chrome.storage.local.set({resetPending: true});
        return;
    }
    // Im ersten Tab nachfragen, damit nicht aus Versehen alles weg ist.
    const [answer] = await chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        world: 'MAIN',
        func: () => window.confirm('Lernfortschritt im Einführungskurs wirklich zurücksetzen?\n\n' +
            'Alle abgehakten Schritte und die gewählte Stufe gehen verloren. Deine Scratch-Projekte bleiben erhalten.')
    }).catch(() => [{result: true}]);
    if (!answer || !answer.result) return;

    await Promise.all(tabs.map(tab => chrome.scripting.executeScript({
        target: {tabId: tab.id},
        world: 'MAIN',
        func: () => {
            try {
                localStorage.removeItem('einfuehrungskurs:v2');
                localStorage.removeItem('bayernlab-course:v2');
            } catch (e) { /* egal */ }
            // Ein laufender Kurs (course.js) hält den Stand im Speicher und setzt sich selbst zurück.
            window.dispatchEvent(new CustomEvent('einfuehrungskurs-reset'));
        }
    }).catch(() => null)));
    notifyTabs('Der Lernfortschritt wurde zurückgesetzt.');
}

// ---------- Kurze Meldung in offenen Scratch-Tabs ----------

async function notifyTabs (text) {
    const tabs = await chrome.tabs.query({url: SCRATCH_TABS});
    tabs.forEach(tab => chrome.scripting.executeScript({
        target: {tabId: tab.id},
        args: [text],
        func: message => {
            const old = document.getElementById('ek-toast');
            if (old) old.remove();
            const toast = document.createElement('div');
            toast.id = 'ek-toast';
            toast.textContent = message;
            Object.assign(toast.style, {
                position: 'fixed', left: '50%', bottom: '24px', transform: 'translateX(-50%)',
                zIndex: 10002, maxWidth: '90vw', padding: '12px 18px', borderRadius: '10px',
                background: '#5A3BB0', color: '#fff', font: 'bold 14px "Helvetica Neue", Helvetica, Arial, sans-serif',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
            });
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 6000);
        }
    }).catch(() => null));
}
