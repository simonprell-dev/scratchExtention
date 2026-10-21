// Prüft, ob alle Block-Skripte im Kurs gültige scratchblocks sind.
// Aufruf: node tools/check-course.mjs
import fs from 'fs';
import {parse, loadLanguages, allLanguages} from 'scratchblocks/syntax/index.js';

loadLanguages({de: JSON.parse(fs.readFileSync('node_modules/scratchblocks/locales/de.json', 'utf8'))});
globalThis.window = {};
eval(fs.readFileSync('course/course-data.js', 'utf8'));

function walk (node, out) {
    if (!node) return out;
    if (node.isBlock) out.push(node);
    (node.children || []).forEach(c => walk(c, out));
    (node.blocks || []).forEach(c => walk(c, out));
    (node.scripts || []).forEach(c => walk(c, out));
    return out;
}

let problems = 0;
const check = (where, code) => {
    const doc = parse(code, {languages: ['en']});
    // Eigene Blöcke (Meine Blöcke) haben keinen Selektor, sind aber gültig.
    const bad = walk(doc, []).filter(b => b.info.category === 'obsolete' || (!b.info.selector && !/^custom/.test(b.info.category)));
    bad.forEach(b => {
        problems++;
        console.log(`${where}: unbekannter Block „${b.stringify()}“`);
    });
    doc.translate(allLanguages.de);
    return doc.stringify();
};
// Variablen, die der Kurs anlegt (alles aus „set/change [Name v]“). Heißt eine davon wie ein
// eingebauter Block, zeichnet scratchblocks sonst den falschen Block: „(Tempo)“ wird zum
// grünen Musik-Block. Abhilfe: „(Tempo :: variables)“.
const courseVars = new Set();
const scripts = [];
window.EinfuehrungskursCourse.chapters.forEach((ch, ci) => ch.steps.forEach((s, si) => {
    const where = `${ci + 1}.${si + 1} ${s.title}`;
    if (s.blocks) scripts.push([where, s.blocks, true]);
    (s.hints || []).forEach(h => h.ghost && scripts.push([`${where} (Hinweis)`, h.ghost, false]));
}));
scripts.forEach(([, code]) => {
    for (const m of code.matchAll(/(?:set|change) \[([^\]]+?) v\]/g)) courseVars.add(m[1]);
});
const checkVars = (where, code) => {
    walk(parse(code, {languages: ['en']}), []).forEach(b => {
        const label = b.children.filter(c => c.isLabel).map(c => c.value).join(' ');
        if (courseVars.has(label) && b.info.category !== 'variables') {
            problems++;
            console.log(`${where}: Variable „${label}“ wird als ${b.info.category}-Block gezeichnet – „(${label} :: variables)“ schreiben`);
        }
    });
};
scripts.forEach(([where, code, isStep]) => {
    const de = check(where, code);
    checkVars(where, code);
    if (isStep && process.argv.includes('-v')) console.log(`--- ${where}\n${de}`);
});
console.log(problems ? `${problems} Probleme` : 'Alle Blöcke ok.');
process.exit(problems ? 1 : 0);
