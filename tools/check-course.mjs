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
window.EinfuehrungskursCourse.chapters.forEach((ch, ci) => ch.steps.forEach((s, si) => {
    const where = `${ci + 1}.${si + 1} ${s.title}`;
    if (s.blocks) {
        const de = check(where, s.blocks);
        if (process.argv.includes('-v')) console.log(`--- ${where}\n${de}`);
    }
    (s.hints || []).forEach(h => h.ghost && check(`${where} (Hinweis)`, h.ghost));
}));
console.log(problems ? `${problems} Probleme` : 'Alle Blöcke ok.');
process.exit(problems ? 1 : 0);
