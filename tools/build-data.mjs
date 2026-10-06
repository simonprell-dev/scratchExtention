/*
 * Erzeugt data/steps-de.js aus tools/source-en.json.
 *
 * source-en.json enthält die Blöcke jedes englischen Tutorial-Bilds als
 * scratchblocks-Code (Schlüssel = Bild-Schlüssel aus scratch-gui en-steps.js).
 * Hier werden die Blöcke ins Deutsche übersetzt und Menüwerte sowie Texte
 * über die Wörterbücher unten ersetzt.
 *
 * Aufruf (scratchblocks muss per npm installiert sein):
 *   npm install --no-save scratchblocks
 *   node tools/build-data.mjs
 */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {parse, loadLanguages, allLanguages} from 'scratchblocks/syntax/index.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const de = JSON.parse(fs.readFileSync(path.join(root, 'node_modules/scratchblocks/locales/de.json'), 'utf8'));
loadLanguages({de});

// Menüwerte, wie sie im deutschen Scratch heißen.
const MENU = {
    'right arrow': 'Pfeil nach rechts',
    'left arrow': 'Pfeil nach links',
    'up arrow': 'Pfeil nach oben',
    'down arrow': 'Pfeil nach unten',
    'space': 'Leertaste',
    'random position': 'Zufallsposition',
    'mouse-pointer': 'Mauszeiger',
    'color': 'Farbe',
    'all': 'alles',
    'my variable': 'meine Variable',
    'Meow': 'Miau',
    'pop': 'Plopp',
    'recording1': 'Aufnahme1',
    'alto': 'Alt',
    'squeak': 'Quietschen',
    'giant': 'Riese',
    'kitten': 'Kätzchen'
};

// Namen von Variablen, Figuren, Kostümen, Klängen und Hintergründen.
// Achtung: In der Scratch-Bibliothek heißen diese weiterhin englisch.
const NAMES = {
    'Score': 'Punkte',
    'score': 'Punkte',
    'Ball': 'Ball',
    'Paddle': 'Schläger',
    'Star': 'Stern',
    'Heart': 'Herz',
    'Wand': 'Zauberstab',
    'Garnet': 'Granat',
    'Penguin2-a': 'Pinguin2-a',
    'Penguin2-b': 'Pinguin2-b',
    'dinosaur4-a': 'Dinosaurier4-a',
    'dinosaur4-d': 'Dinosaurier4-d',
    'dragon-a': 'Drache-a',
    'dragon-c': 'Drache-c',
    'rooster-a': 'Hahn-a',
    'rooster-b': 'Hahn-b',
    'Birds-Flying': 'Vogelflug',
    'C Sax': 'C Saxofon',
    'C2 Sax': 'C2 Saxofon',
    'G Sax': 'G Saxofon',
    'Chirp': 'Zwitschern',
    'Collect': 'Einsammeln',
    'Drum': 'Trommel',
    'Drum Bass2': 'Basstrommel2',
    'High Tom': 'Hohe Tom',
    'Hip Hop': 'Hip-Hop',
    'Magic Spell': 'Zauberspruch',
    'Jurassic': 'Urzeit',
    'Mountain': 'Berg',
    'Savanna': 'Savanne',
    'Spotlight': 'Scheinwerfer',
    'Underwater 1': 'Unterwasser 1',
    'Witch House': 'Hexenhaus'
};
Object.assign(MENU, NAMES);

// Texte in Sage-/Frage-Blöcken.
const TEXT = {
    'Beep boop bop': 'Piep bup bop',
    'Check out these moves!': 'Schau dir diese Moves an!',
    'Hello friends!': 'Hallo Freunde!',
    'Hello!': 'Hallo!',
    'Hi there': 'Hallo du',
    'I am a robot': 'Ich bin ein Roboter',
    'I like to dance a lot': 'Ich tanze sehr gerne',
    'I like to spin!': 'Ich drehe mich gerne!',
    'I\'m going on a quest!': 'Ich gehe auf Abenteuerreise!',
    'Imagine if...': 'Stell dir vor ...',
    'Let\'s collect gems!': 'Lass uns Edelsteine sammeln!',
    'Let\'s explore!': 'Lass uns auf Entdeckungstour gehen!',
    'Let\'s go!': 'Los geht\'s!',
    'There\'s no place like home!': 'Zuhause ist es am schönsten!',
    'This is fun!': 'Das macht Spaß!',
    'Time to fly!': 'Zeit zum Fliegen!',
    'Welcome to Magic School!': 'Willkommen in der Zauberschule!',
    'What\'s your name?': 'Wie heißt du?',
    'Whoa! Look at me!': 'Wow! Schau mich an!'
};

// Hinweise unter den Blöcken (nur für Schritte mit Code).
const NOTES = {
    codeCartoonUseMinusSign: 'Tippe ein Minuszeichen, damit die Zahl negativ wird.',
    imagineChooseSound: 'Wähle im Menü deine Aufnahme aus.',
    imagineClickGreenFlag: 'Klicke auf die grüne Flagge.',
    imagineTypeWhatYouWant: 'Tippe ein, was deine Figur sagen soll, und klicke auf die grüne Flagge.',
    introGreenFlag: 'Setze „Wenn die grüne Flagge angeklickt“ oben an und klicke auf die grüne Flagge.',
    introMove: 'Ziehe den Block in den Programmierbereich und klicke darauf.',
    introSay: 'Hänge den „sage“-Block unter den „gehe“-Block.',
    pongAddMoreCodeToBall: 'Rechts ist der neue Code.',
    pongChooseScoreFromMenu: 'Wähle im Menü die Variable „Punkte“ aus.',
    pongInsertChangeScoreBlock: 'Füge den Block „ändere Punkte um 1“ ein.',
    recordASoundChooseSound: 'Wähle im Menü deine Aufnahme aus.'
};

function translateInputs (node) {
    if (!node) return;
    // „sprich“ (Text zu Sprache) heißt auf Deutsch wie „sage“ (Aussehen) –
    // die Kategorie explizit mitschreiben, sonst wird der Block lila.
    if (node.isBlock && node.info.category === 'tts') node.info.categoryIsDefault = false;
    // Variablen-Reporter wie (score) bestehen nur aus einem Label.
    if (node.isBlock && node.info.selector === 'readVariable') {
        const label = node.children[0];
        if (label && Object.prototype.hasOwnProperty.call(NAMES, label.value)) label.value = NAMES[label.value];
    }
    if (node.isInput && typeof node.value === 'string') {
        const dict = node.hasArrow ? MENU : TEXT;
        if (Object.prototype.hasOwnProperty.call(dict, node.value)) node.value = dict[node.value];
    }
    (node.children || []).forEach(translateInputs);
    (node.blocks || []).forEach(translateInputs);
    (node.scripts || []).forEach(translateInputs);
}

function categories (node, list = []) {
    if (!node) return list;
    if (node.isBlock) list.push(node.info.category);
    (node.children || []).forEach(c => categories(c, list));
    (node.blocks || []).forEach(c => categories(c, list));
    (node.scripts || []).forEach(c => categories(c, list));
    return list;
}

const source = JSON.parse(fs.readFileSync(path.join(root, 'tools/source-en.json'), 'utf8'));
const out = {};
let missing = 0;
for (const [key, entry] of Object.entries(source)) {
    if (!entry.code) continue;
    const doc = parse(entry.code, {languages: ['en']});
    const expected = categories(doc).join();
    doc.translate(allLanguages.de);
    translateInputs(doc);
    const code = doc.stringify();

    // Kontrolle: der deutsche Code muss sich wieder gleich einlesen lassen.
    const reparsed = parse(code, {languages: ['de', 'en']});
    if (reparsed.stringify() !== code || categories(reparsed).join() !== expected) {
        console.warn(`Achtung, ${key} übersteht keinen Rundlauf:\n${code}`);
    }
    if (entry.note && !NOTES[key]) {
        missing++;
        console.warn(`Kein deutscher Hinweis für ${key}: ${entry.note}`);
    }
    out[key] = NOTES[key] ? {code, note: NOTES[key]} : {code};
}

const banner = '// Automatisch erzeugt von tools/build-data.mjs – Änderungen besser in tools/source-en.json oder dort vornehmen.\n';
fs.writeFileSync(
    path.join(root, 'data/steps-de.js'),
    `${banner}window.__scratchDeSteps = ${JSON.stringify(out, null, 2)};\n`
);
console.log(`${Object.keys(out).length} Schritte geschrieben, ${missing} Hinweise ohne Übersetzung.`);
