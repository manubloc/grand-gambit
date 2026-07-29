// ── KONTRAST ALS PRUEFSTEIN, NICHT ALS VORSATZ ──────────────────────────────
// "Lesbarkeit vor Dekoration" (Auftrag §10.4) wird hier zur Regel mit Zahn:
// jede Textrolle wird gegen ihre ECHTE Flaeche gerechnet - durchscheinende
// Tafeln (panel mit Alpha) werden erst ueber den Grund gemischt, sonst luegt
// die Rechnung (Lehre aus v0.33). Faellt eine Paarung unter die Schwelle,
// faellt die Kette. Laeuft als 19. Suite in npm test.
import { T, setDesign } from "./src/app/ui/theme.js";

const hex = (h) => {
  h = h.replace("#", "");
  const n = (i, l) => parseInt(h.slice(i, i + l).padEnd(2, h[i]), 16);
  if (h.length === 3) return [n(0, 1) * 17, n(1, 1) * 17, n(2, 1) * 17, 255];
  return [n(0, 2), n(2, 2), n(4, 2), h.length >= 8 ? n(6, 2) : 255];
};
const misch = (oben, grund) => {
  const [r, g, b, a] = hex(oben), [R, G, B] = hex(grund), f = a / 255;
  return [r * f + R * (1 - f), g * f + G * (1 - f), b * f + B * (1 - f)];
};
const lum = ([r, g, b]) => {
  const c = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const rgb = (h, grund = null) => (hex(h)[3] < 255 && grund ? misch(h, grund) : hex(h).slice(0, 3));

let ok = 0, schlecht = 0;
const pruefe = (name, schrift, flaeche, soll) => {
  const r = ratio(rgb(schrift), flaeche);
  const gut = r >= soll;
  if (!gut) console.log(`  FEHLT ${name}: ${r.toFixed(2)}:1 < ${soll}:1`);
  gut ? ok++ : schlecht++;
  return r;
};

for (const livree of ["classic", "carved"]) {
  setDesign(livree);
  // die effektiven Flaechen: Tafel ueber Grund gemischt
  const tafel = rgb(T.panel, T.bg);
  const tafel2 = rgb(T.panel2, T.bg);
  const auswahl = misch(T.sel + "ff".slice(0, 0) || T.sel, T.bg2); // sel ist deckend, aber ueber bg2 gedacht
  const wahl = rgb(T.sel, T.bg2);
  console.log(`-- Livree ${livree} --`);
  pruefe("text/panel", T.text, tafel, 4.5);
  pruefe("text/panel2", T.text, tafel2, 4.5);
  pruefe("dim/panel", T.dim, tafel, 4.5);
  pruefe("faint/panel", T.faint, tafel, 4.5);
  pruefe("gold/panel", T.gold, tafel, 4.5);
  pruefe("lime/panel", T.lime, tafel, 4.5);
  pruefe("selInk/sel", T.selInk, wahl, 4.5);
  pruefe("selLine/sel", T.selLine, wahl, 3.0);      // Konturen: 3:1 (Nicht-Text)
  pruefe("riftInk/rift", T.riftInk, rgb(T.rift), 4.5);
  pruefe("limeInk/goldknopf", T.limeInk, rgb("#d4af37"), 4.5); // Mittelton des CTA-Verlaufs (Vorlage)
  pruefe("danger/panel", T.danger, tafel, 3.0);      // Statusfarbe an Konturen/Icons
  pruefe("warn/panel", T.warn, tafel, 3.0);
  pruefe("info/panel", T.info, tafel, 3.0);
  pruefe("text/bg2", T.text, rgb(T.bg2), 4.5);
  pruefe("mapText/mapSurface", "#393327", rgb("#e6dec8"), 4.5); // Pergament-Ausnahme der Kampagne
}
setDesign("carved");
console.log(`RESULT: ${ok} passed, ${schlecht} failed`);
console.log(schlecht === 0 ? "== KONTRAST SAUBER ==" : "== KONTRAST VERLETZT ==");
process.exit(schlecht === 0 ? 0 : 1);
