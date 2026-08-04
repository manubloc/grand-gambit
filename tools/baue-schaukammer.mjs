// Legt die Bilder des Hauses als KOPIE unter public/schau/ ab und schreibt
// ein Verzeichnis dazu. So kennt kein Buendler diese Dateien - die
// Schaukammer holt sie zur Laufzeit. (Ein frueherer Versuch band sie ein:
// die Einzeldatei wuchs auf 119 MB.)
import { readdir, mkdir, copyFile, writeFile, rm } from "node:fs/promises";
import { join, extname } from "node:path";

const QUELLE = "src/app/ui/assets";
const ZIEL = "dist/schau";
const ARTEN = new Set([".webp", ".jpg", ".png", ".svg"]);

async function sammle(ordner, unter = "") {
  const out = [];
  for (const e of await readdir(join(ordner, unter), { withFileTypes: true })) {
    const rel = unter ? `${unter}/${e.name}` : e.name;
    if (e.isDirectory()) { if (!["audio", "klang"].includes(e.name)) out.push(...await sammle(ordner, rel)); }
    else if (ARTEN.has(extname(e.name).toLowerCase())) out.push(rel);
  }
  return out;
}

await rm(ZIEL, { recursive: true, force: true });
const dateien = (await sammle(QUELLE)).sort();
for (const rel of dateien) {
  const zielPfad = join(ZIEL, rel);
  await mkdir(zielPfad.slice(0, zielPfad.lastIndexOf("/")), { recursive: true });
  await copyFile(join(QUELLE, rel), zielPfad);
}
await writeFile("dist/schaukammer.json",
  JSON.stringify(dateien.map((r) => `/schau/${r}`), null, 0));
console.log(`schaukammer: ${dateien.length} Bilder nach ${ZIEL}`);

// Dasselbe fuer das MUSIKARCHIV: alle je erzeugten Stuecke liegen unter
// archiv/musik und werden neben das Spiel gelegt, nicht hineingebunden -
// 26 MB im Buendel waeren unvertretbar. Die Klangwerkstatt holt sie zur
// Laufzeit.
const MQ = "archiv/musik", MZ = "dist/klangarchiv";
await rm(MZ, { recursive: true, force: true });
await mkdir(MZ, { recursive: true });
let anzahl = 0;
for (const e of await readdir(MQ, { withFileTypes: true })) {
  if (!e.isFile()) continue;
  await copyFile(join(MQ, e.name), join(MZ, e.name));
  if (e.name.endsWith(".mp3")) anzahl++;
}
console.log(`klangarchiv: ${anzahl} Stuecke nach ${MZ}`);

// Und die BILD-ORIGINALE: sie liegen unter archiv/bilder und werden - wie
// Musik und Schaukammer - neben das Spiel gelegt, nie hineingebunden.
// (Gerettet aus der fal.ai-Auftragshistorie, siehe archiv/bilder/LIESMICH.md)
const BQ = "archiv/bilder", BZ = "dist/bildarchiv";
await rm(BZ, { recursive: true, force: true });
let bilder = 0;
async function kopiereBaum(von, nach) {
  await mkdir(nach, { recursive: true });
  for (const e of await readdir(von, { withFileTypes: true })) {
    if (e.isDirectory()) await kopiereBaum(join(von, e.name), join(nach, e.name));
    else { await copyFile(join(von, e.name), join(nach, e.name)); if (!e.name.endsWith(".md")) bilder++; }
  }
}
await kopiereBaum(BQ, BZ);
console.log(`bildarchiv: ${bilder} Originale nach ${BZ}`);
