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
