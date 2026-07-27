// Wacht ueber EINE Regel, die der Besitzer nie wieder brechen sehen will:
// Knoepfe tragen DUENNE Konturen (hoechstens 1px) und KEINE plastischen
// Innenkanten. Kein 3D-Rahmen, kein eingelassener Schein, keine Doppelkontur -
// weder auf goldenen noch auf dunklen Knoepfen.
//
//   node tools/pruefe-buttons.mjs      -> "== KNOEPFE SAUBER ==" oder Fundliste
//
// Geprueft wird der Quelltext, weil dort die Stile stehen; jeder <button ...>
// samt seines style={{...}} wird gelesen, dazu die zentralen Bausteine.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const dateien = [];
(function sammle(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) { if (e !== "node_modules") sammle(p); }
    else if (/\.(jsx|js)$/.test(e)) dateien.push(p);
  }
})("src");

const funde = [];

// Innenkanten, die Plastik erzeugen: "inset ... 0 rgba(hell)" als Lichtkante
// oder "inset 0 0 0 Npx" als zweite Kontur. Ein reiner Innenschatten zur
// Tiefe (z.B. auf Brettfeldern) ist erlaubt - Knoepfe aber tragen gar keinen.
const istLichtkante = (s) => /inset\s+[-\d.]+(px)?\s+[-\d.]+(px)?\s+[-\d.]+(px)?(\s+[-\d.]+(px)?)?\s+(rgba\(\s*(1[5-9][0-9]|2[0-9][0-9])|#[def])/i.test(s);
const istZweitkontur = (s) => /inset\s+0\s+0\s+0\s+[\d.]+px/.test(s);

for (const f of dateien) {
  const txt = readFileSync(f, "utf8");
  const zeilen = txt.split("\n");

  // 1) Jeder <button ...> mit seinem Stilblock (bis zum schliessenden >)
  let i = 0;
  while ((i = txt.indexOf("<button", i)) !== -1) {
    let e = i, tiefe = 0;
    for (; e < txt.length; e++) {
      const c = txt[e];
      if (c === "{") tiefe++;
      else if (c === "}") tiefe--;
      else if (c === ">" && tiefe === 0) break;
    }
    const block = txt.slice(i, e);
    const nr = txt.slice(0, i).split("\n").length;
    const dick = block.match(/border(?:Width)?:\s*`?([2-9](?:\.\d+)?)px/);
    if (dick) funde.push(`${f}:${nr} Knopf mit ${dick[1]}px-Kontur`);
    if (istLichtkante(block)) funde.push(`${f}:${nr} Knopf mit plastischer Innen-Lichtkante`);
    if (istZweitkontur(block)) funde.push(`${f}:${nr} Knopf mit zweiter Kontur (inset 0 0 0 Npx)`);
    i = e;
  }

  // 2) Die zentralen Bausteine (Button/Chip/Pill) - dort wirkt ein Fehler ueberall
  zeilen.forEach((z, k) => {
    if (!/(primary|ghost|danger|subtle|chip|pill|Btn)\s*:/i.test(z)) return;
    if (istLichtkante(z)) funde.push(`${f}:${k + 1} Knopf-Baustein mit plastischer Innen-Lichtkante`);
    const d = z.match(/border(?:Width)?:\s*`?([2-9](?:\.\d+)?)px/);
    if (d) funde.push(`${f}:${k + 1} Knopf-Baustein mit ${d[1]}px-Kontur`);
  });
}

if (funde.length) {
  console.log("KNOPF-BEFUNDE:\n" + funde.map((f) => "  - " + f).join("\n"));
  process.exit(1);
}
console.log("== KNOEPFE SAUBER ==");
