// ── DIE ANIMATIONEN HALTEN WORT (v1.0.67) ───────────────────────────────────
// Der Besitzer will die Animationen testgetrieben: was das Register
// verspricht, muss die Kammer vorfuehren, der Schalter muss ueberall
// dieselbe Stelle stellen, und die Schlagarten muessen jede Figurenart
// abdecken. Diese Suite prueft das Modul und die Deckung der Bauteile -
// die Strukturproben am gerenderten Baum liegen in test_ui.jsx.
import { readFileSync } from "node:fs";

let pass = 0, fail = 0;
const ok = (name, cond) => {
  if (cond) { pass++; console.log("  ok  -", name); }
  else { fail++; console.log("  not ok -", name); }
};

/* localStorage-Attrappe VOR dem Modulimport - anim.js liest beim Laden. */
const speicher = new Map();
globalThis.localStorage = {
  getItem: (k) => (speicher.has(k) ? speicher.get(k) : null),
  setItem: (k, v) => speicher.set(k, String(v)),
  removeItem: (k) => speicher.delete(k),
};

const { ANIMATIONEN, animById, animAn, setAnimAn, schlagArt, SCHLAG_ARTEN } =
  await import("./src/app/ui/anim.js");

console.log("\n== test_anim: das Register ==");
ok("das Register traegt zehn Bewegungen", ANIMATIONEN.length === 10);
ok("jede hat Kennung, Namen, Bereich und Beschreibung",
  ANIMATIONEN.every((a) => a.id && a.name && a.bereich && a.was && a.was.length > 30));
ok("keine Kennung doppelt", new Set(ANIMATIONEN.map((a) => a.id)).size === ANIMATIONEN.length);
ok("die drei Bereiche sind brett, belohnung, figuren",
  [...new Set(ANIMATIONEN.map((a) => a.bereich))].sort().join(",") === "belohnung,brett,figuren");
ok("animById findet den Schweif", animById("schweif")?.name === "Zugschweif");
ok("animById kennt Erfundenes nicht", animById("quatsch") === null);
const PFLICHT = ["schweif", "einschlag", "feuer", "atmen", "schach", "matt", "stufe", "muenzen", "beute", "glanz"];
ok("alle vom Besitzer verlangten Bewegungen stehen darin",
  PFLICHT.every((id) => animById(id)));

console.log("\n== test_anim: der Schalter ==");
ok("an ist der Alltag", animAn() === true);
setAnimAn(false);
ok("aus wirkt sofort", animAn() === false);
ok("und liegt im Geraetespeicher", speicher.get("gg:anim") === "0");
setAnimAn(true);
ok("an kommt zurueck", animAn() === true && speicher.get("gg:anim") === "1");

console.log("\n== test_anim: die Schlagarten ==");
const KINDS = ["P", "N", "B", "R", "A", "C", "Q", "K", "D", "X", "G", "H"];
ok("jede Figurenart hat eine Schlagart", KINDS.every((k) => SCHLAG_ARTEN.includes(schlagArt(k))));
ok("der Schildtraeger STOESST (Besitzerbild)", schlagArt("P") === "stoss" && schlagArt("G") === "stoss");
ok("der Drache traegt das Feuer", schlagArt("D") === "feuer");
ok("die Dame richtet (bann), sie prueglt nicht", schlagArt("Q") === "bann");
ok("Unbekanntes faellt sicher auf stoss", schlagArt("?") === "stoss");

console.log("\n== test_anim: Kammer und Spiel decken das Register ==");
const kammer = readFileSync("src/app/ui/AnimKammerScreen.jsx", "utf8");
ok("die Kammer fuehrt JEDE Registerbewegung vor (case je id)",
  ANIMATIONEN.every((a) => kammer.includes(`case "${a.id}"`)));
const theme = readFileSync("src/app/ui/theme.js", "utf8");
for (const kf of ["ggAtmen", "ggStoss", "ggKlinge", "ggWucht", "ggBann", "ggFeuer", "ggFunken",
  "ggZielGlut", "ggSchachPuls", "ggKoenigFall", "ggStufenStern", "ggMuenzFall", "ggAuftritt", "ggGlanzLauf"])
  ok(`Keyframe ${kf} existiert im Theme`, theme.includes(`@keyframes ${kf}`));
{
  /* Die Ruckel-Lehre je BLOCK pruefen, nicht ueber Blockgrenzen hinweg -
     die erste Fassung dieser Probe lief in fremde Keyframes hinein
     (ggSetzPuls traegt zu Recht box-shadow) und schlug falsch an. */
  const MEINE = ["ggAtmen", "ggStoss", "ggKlinge", "ggWucht", "ggBann", "ggFeuer", "ggFunken",
    "ggZielGlut", "ggSchachPuls", "ggKoenigFall", "ggStufenStern", "ggMuenzFall", "ggAuftritt", "ggGlanzLauf"];
  const bloecke = theme.split("@keyframes ").slice(1);
  const suender = MEINE.filter((n) => {
    const b = bloecke.find((x) => x.startsWith(n + " "));
    return !b || /width:|height:|box-shadow:/.test(b.split("@keyframes")[0].split("\n").slice(0, 6).join("\n"));
  });
  ok("die Keyframes halten die Ruckel-Lehre: kein width/height/box-shadow im Takt", suender.length === 0);
}
const orte = {
  "BoardView nutzt den Schalter": ["src/app/ui/board/BoardView.jsx", "animAn()"],
  "BoardView kennt die Schlagarten": ["src/app/ui/board/BoardView.jsx", "schlagArt("],
  "PieceGlyph atmet": ["src/app/ui/board/PieceGlyph.jsx", "ggAtmen"],
  "PieceGlyph feiert die Stufe": ["src/app/ui/board/PieceGlyph.jsx", "ggStufenStern"],
  "GameScreen laesst Muenzen fallen": ["src/app/ui/screens/GameScreen.jsx", "ggMuenzFall"],
  "GameScreen reicht die Mattseite": ["src/app/ui/screens/GameScreen.jsx", "mattSeite="],
  "ArmyScreen glaenzt beim Verbessern": ["src/app/ui/screens/ArmyScreen.jsx", "ggGlanzLauf"],
  "das Profil traegt den Schalter": ["src/app/ui/screens/ProfileScreen.jsx", "setAnimAn"],
  "die App kennt die Kammer": ["src/app/App.jsx", "animkammer"],
  "die Verwaltung im Profil verlinkt die Kammer": ["src/app/ui/screens/ProfileScreen.jsx", '["?animkammer", "Die Animationskammer"'],
};
for (const [name, [datei, marke]] of Object.entries(orte))
  ok(name, readFileSync(datei, "utf8").includes(marke));

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
