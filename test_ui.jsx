// UI CONTRACT TESTS — the layer no logic suite ever touched.
//
// Every bug this file guards against was live in production at some point:
// enemy champions rendered as plain queens, orbs vanished from the enemy's
// rank, digits changed size between one and two figures, the spell star kept
// burning after the spell was spent. These are RENDER truths, so they are
// asserted on the actual server-rendered markup — not on props or intentions.
import { renderToStaticMarkup as html } from "react-dom/server";
import { PieceGlyph, StatTriad, StatOrbBadge } from "./src/app/ui/board/PieceGlyph.jsx";
import { paintedForPiece, paintedFitFor } from "./src/app/ui/board/paintedArt.js";
import { ABILITIES, BOSSES } from "./src/content/index.js";
import { ACHIEVEMENTS } from "./src/meta/achievements.js";
import { PIECE_ART, BOSS_ART } from "./src/app/ui/art.generated.js";
import { itemArt } from "./src/app/ui/assets/items/itemArt.js";
import { ITEMS } from "./src/content/index.js";
import { ItemIcon } from "./src/app/ui/ItemIcon.jsx";
import { readFileSync, readdirSync } from "node:fs";
import { AchievementsScreen } from "./src/app/ui/screens/AchievementsScreen.jsx";
import { GameScreen } from "./src/app/ui/screens/GameScreen.jsx";
import { LeaveMatchAsk, GameIntro } from "./src/app/App.jsx";
import { rissStufe } from "./src/app/ui/RissBoden.jsx";
import { TutorialScreen } from "./src/app/ui/screens/TutorialScreen.jsx";
import { buildStageMatch, withProgressPct } from "./src/meta/index.js";
import { CAMPAIGN, TIME_MODES, timeModeById, clockFor } from "./src/content/index.js";
import { AkademieScreen } from "./src/app/ui/screens/AkademieScreen.jsx";
import { ArmyScreen, GearPanel, MoveDiagram } from "./src/app/ui/screens/ArmyScreen.jsx";
import { CHARACTER_LIST } from "./src/content/index.js";
import { defaultProfile, evaluate } from "./src/meta/index.js";
import { makeT } from "./src/app/i18n/strings.js";

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log("  ok  -", n); } else { fail++; console.log(" FAIL -", n); } };

// how many background images does this markup pull in?
const imgs = (m) => (m.match(/url\(data:image/g) || []).length;
// pull every font-size the markup declares, in order
const fontSizes = (m) => (m.match(/font-size:\s*([^;"]+)/g) || []).map((s) => s.split(":")[1].trim());

const piece = (x = {}) => ({ id: 1, kind: "Q", color: "w", level: 1, abilities: [], used: {}, shield: 0,
  hp: 7, maxHp: 7, atk: 4, ...x });

// ── 1. THE CHAMPION SHOWS HIS FACE ──────────────────────────────────────────
// A master stands in the queen's PLACE; that is formation, not disguise. For a
// while the enemy's champion was painted as a queen and the whole point of
// meeting him — seeing whom you face — was lost.
{
  const boss = piece({ bossId: "b01", color: "b", name: { de: "Ork", en: "Orc" } });
  const own = html(<PieceGlyph piece={boss} pov="b" />);
  const foe = html(<PieceGlyph piece={boss} pov="w" />);
  ok("champion renders identically to both sides (no disguise)", own === foe);

  const bossArt = paintedForPiece(boss);
  const queenArt = paintedForPiece(piece({ kind: "Q" }));
  ok("the champion has his own portrait, not the queen's", bossArt && bossArt !== queenArt);
  ok("the enemy's markup carries that champion portrait", foe.includes(bossArt.slice(0, 60)));

  // and his SIZE is queen-class, as the formation promises
  const fb = paintedFitFor(boss), fq = paintedFitFor(piece({ kind: "Q" }));
  ok("champion is scaled to queen format (within 6%)", Math.abs(fb.h - fq.h) / fq.h < 0.06);
}

// ── 2. BOTH SIDES WEAR THEIR JEWELS ─────────────────────────────────────────
// The enemy once showed bare numerals: the orb image failed to reach the page
// and nobody noticed, because no test ever looked at the enemy's markup.
{
  const w = html(<StatTriad piece={piece({ color: "w" })} focus={false} />);
  const b = html(<StatTriad piece={piece({ color: "b" })} focus={false} />);
  const kugeln = (h) => (h.match(/<svg/g) || []).length;
  ok("your piece carries two sealed spheres", kugeln(w) >= 2 && w.includes("#e3c07a"));
  ok("the enemy piece carries two sealed spheres", kugeln(b) >= 2 && b.includes("#e3c07a"));
  ok("both sides wear the SAME pair (attack blue, life red)", imgs(w) === imgs(b));
  ok("the values are actually printed", w.includes(">4<") && w.includes(">7<"));
}


// ── DAS KANTENGLÜHEN ────────────────────────────────────────────────────────
// "starke leuchtende kante um die kontur der figur und langsam ins lilane" -
// gestapelte Schatten mit 0 Versatz und WACHSENDEM Radius; die eigenen leiser
// als die Gegner, und beim Auswaehlen glimmt die Figur auf.
{
  const radien = (h) => [...h.matchAll(/drop-shadow\(0 0 (\d+)px/g)].map((m) => +m[1]);
  const eigen = html(<PieceGlyph piece={piece({ color: "w" })} />);
  const feind = html(<PieceGlyph piece={piece({ color: "b" })} />);
  const gewaehlt = html(<PieceGlyph piece={{ ...piece({ color: "w" }), selected: true }} />);
  const r = radien(eigen);
  ok("the glow hugs the contour: radii grow outward", r.length >= 3 && r[0] < r[1] && r[1] < r[2]);
  const staerke = (h, farbe) => [...h.matchAll(new RegExp(farbe.replace(/,/g, ",\\s*") + ",\\s*([\\d.]+)\\)", "g"))].map((m) => +m[1]);
  /* v1.0.11 (Besitzer): der Riss traegt jetzt das HELLERE Violett 184,146,255
     - beide Seiten leuchten auf Koenigs-Mass, die Relation bleibt. */
  const meine = staerke(eigen, "240,214,138"), seine = staerke(feind, "184,146,255");
  const meineGew = staerke(gewaehlt, "240,214,138");
  ok("your pieces glow softer than the enemy's", Math.max(...meine) < Math.max(...seine));
  ok("a chosen piece flares up", Math.max(...meineGew) > Math.max(...meine));
  ok("the enemy wears the rift, you wear gold", feind.includes("184,146,255") && eigen.includes("240,214,138"));
}

// ── 3. ONE SIZE OF NUMERAL ──────────────────────────────────────────────────
// "die zahlen überall gleiche größe egal ob ein oder zweistellig"
{
  const svgFsAll = (h) => (h.match(/font-size="([\d.]+)"/g) || []).map((x) => parseFloat(x.match(/[\d.]+/)[0]));
  const one = svgFsAll(html(<StatTriad piece={piece({ atk: 4, hp: 7 })} />));
  const two = svgFsAll(html(<StatTriad piece={piece({ atk: 12, hp: 34 })} />));
  ok("both orbs of a piece share one font size", new Set(one).size === 1);
  ok("double digits shrink a step, but both orbs stay equal", new Set(two).size === 1 && two[0] < one[0]);
  // die Zahl sitzt auf dem BRETT auf derselben Mittellinie wie im Hofstaat
  const mitteBrett = (h) => (h.match(/dominant-baseline="central"/g) || []).length;
  ok("board numerals sit on the same centre line as the court's", mitteBrett(html(<StatTriad piece={piece({ atk: 4, hp: 7 })} />)) >= 2);
}

// ── 4. THE SPELL STAR IS AN HONEST PROMISE ──────────────────────────────────
// One spell per game: the star must mean "you may still act", nothing else.
// the star is a painting now — its data-URL fingerprint is the promise
const star = (m) => m.includes(IC_SPELLSTAR.slice(40, 104));
{
  const live = Object.keys(ABILITIES).find((id) => ABILITIES[id].live);
  const passive = Object.keys(ABILITIES).find((id) => !ABILITIES[id].live);
  ok("the content actually holds both a live and a passive talent", !!live && !!passive);

  ok("a piece with an unspent castable talent shows the star",
    star(html(<StatTriad piece={piece({ abilities: [live] })} />)));
  ok("after the one cast the star is gone",
    !star(html(<StatTriad piece={piece({ abilities: [live], used: { [live]: true } })} />)));
  ok("a piece with no talents shows no star",
    !star(html(<StatTriad piece={piece()} />)));
  ok("purely passive gifts promise no act",
    !star(html(<StatTriad piece={piece({ abilities: [passive] })} />)));
}

// ── 5. BADGES CARRY THEIR VALUE, DELTAS INCLUDED ────────────────────────────
// "+1" is a value like any other — it must land inside the sphere, centred.
{
  const plain = html(<StatOrbBadge kind="power" v={5} size={24} />);
  const delta = html(<StatOrbBadge kind="life" v="+2" size={24} />);
  ok("a plain badge prints its number", plain.includes(">5<"));
  ok("a delta badge prints its sign and number", delta.includes("+2"));
  // v0.38.1: Siegel-Stil — die Kugel ist gezeichnet (SVG mit Goldrand), kein
  // Bild mehr; die Zahl steht per Grid mittig, keine Versatz-Korrektur noetig.
  ok("both badges are cast as sealed spheres (svg, gold rim)", plain.includes("<svg") && delta.includes("<svg") && plain.includes("#e3c07a"));
  ok("the numeral rides the sphere, white and bold", plain.includes("#ffffff") || plain.includes("rgb(255, 255, 255)"));
  // v0.38.4: die Zahl sitzt GEOMETRISCH mittig (SVG-Text, dominantBaseline
  // central) - als HTML-span schwankte sie mit der Schriftgrundlinie, "+2"
  // sass anders als "5". Fuer JEDEN Wert dieselbe Mitte.
  const mitte = (h) => (h.match(/y="12"[^>]*dominant-baseline="central"|dominant-baseline="central"[^>]*y="12"/) || []).length;
  ok("every value sits on the SAME centre line", mitte(plain) === 1 && mitte(delta) === 1 && mitte(html(<StatOrbBadge kind="power" v={12} size={24} />)) === 1);
  const svgFs = (h) => parseFloat((h.match(/font-size="([\d.]+)"/) || [0, "0"])[1]);
  ok("multi-glyph values shrink a step to stay inside the cavity", svgFs(delta) < svgFs(plain));
}

// ── 6. NO EMPTY RENDERS ─────────────────────────────────────────────────────
// A component that quietly returns nothing is the hardest bug to see.
{
  ok("a piece always renders something", html(<PieceGlyph piece={piece()} />).length > 200);
  ok("a pawn renders too", html(<PieceGlyph piece={piece({ kind: "P", hp: 2, maxHp: 2, atk: 1 })} />).length > 200);
  ok("the hero renders", html(<PieceGlyph piece={piece({ kind: "P", hero: true, tier: 3 })} />).length > 200);
  ok("a nulled piece renders nothing rather than crashing", html(<PieceGlyph piece={null} />) === "");
}

// ── 7. THE ART CONTRACT — every painting fits a square frame ────────────────
// The campaign popup shows champions in a SQUARE frame so they fill its full
// height (the old 84x108 box was width-limited and wasted a quarter of it).
// That only holds while no painting is markedly wider than tall — a future
// wide canvas would spill over the name beside it. Dimensions are read from
// the WebP header on disk, so a new file is checked the moment it lands.
{
  const dims = (file) => {
    const b = readFileSync(file);
    if (b.toString("latin1", 0, 4) !== "RIFF" || b.toString("latin1", 8, 12) !== "WEBP") return null;
    const chunk = b.toString("latin1", 12, 16);
    if (chunk === "VP8X") return { w: b.readUIntLE(24, 3) + 1, h: b.readUIntLE(27, 3) + 1 };
    if (chunk === "VP8 ") return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") {                       // 14 bits each, packed after the 0x2f signature
      const bits = b.readUInt32LE(21);
      return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
    }
    return null;
  };
  const dir = "src/app/ui/assets/painted";
  const files = readdirSync(dir).filter((f) => f.endsWith(".webp"));
  ok("the gallery is on disk and readable", files.length > 30);

  const unreadable = files.filter((f) => !dims(`${dir}/${f}`));
  ok("every painting's header parses", unreadable.length === 0 || console.log("     ", unreadable.join(", ")));

  const tooWide = files.map((f) => ({ f, d: dims(`${dir}/${f}`) })).filter((x) => x.d && x.d.w / x.d.h > 1.1);
  ok("no painting is wider than its frame allows (aspect <= 1.1)",
    tooWide.length === 0 || console.log("     ", tooWide.map((x) => `${x.f} ${x.d.w}x${x.d.h}`).join(", ")));

  // In a height-filling frame only the HEIGHT is ever upscaled — several
  // figures are legitimately narrow (a queen is 198x384). The popup draws at
  // ~139 CSS px, so 280+ rows keep it sharp even on a 2x screen.
  const shallow = files.map((f) => ({ f, d: dims(`${dir}/${f}`) })).filter((x) => x.d && x.d.h < 280);
  ok("every painting has the rows to stay sharp when it fills the frame",
    shallow.length === 0 || console.log("     ", shallow.map((x) => `${x.f} ${x.d.w}x${x.d.h}`).join(", ")));

  // THE TREASURY'S EMBLEMS: one painted medallion per achievement, square (they
  // are cast as discs) and big enough for the 54px rim on a 2x screen.
  const achDir = "src/app/ui/assets/ach";
  const achFiles = readdirSync(achDir).filter((f) => f.endsWith(".webp"));
  const achIds = evaluate({}).items.map((i) => i.id);
  const missing = achIds.filter((id) => !achFiles.includes(`ach-${id}.webp`));
  ok("every achievement has its own painted emblem", missing.length === 0 || console.log("     ", missing.join(", ")));
  // Every emblem may wear TWO liveries since the carved repaint — "ach-x.webp"
  // (classic) and "ach-x.carved.webp". Both must belong to a real deed.
  ok("no emblem is orphaned", achFiles.every((f) => achIds.includes(f.slice(4, -5).replace(/\.carved$/, ""))));
  const badMedal = achFiles.map((f) => ({ f, d: dims(`${achDir}/${f}`) }))
    .filter((x) => !x.d || x.d.w !== x.d.h || x.d.w < 128);
  ok("emblems are square and large enough for a crisp medallion",
    badMedal.length === 0 || console.log("     ", badMedal.map((x) => x.f).join(", ")));
}

// ── 8. THE TREASURY MUST BE READABLE ────────────────────────────────────────
// The gilding once left text at 2.9:1 on its own plates — with unstarted cards
// faded to 62% on top, effectively invisible. Contrast is arithmetic, so it
// can simply be asserted: every colour the screen prints is measured against
// the darkest plate it can sit on.
{
  const lin = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const lum = (hex) => {
    const h = hex.replace("#", "");
    const [r, g, b] = [0, 2, 4].map((i) => lin(parseInt(h.slice(i, i + 2), 16) / 255));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)]; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  ok("the contrast maths is sound (white on black is 21:1)", Math.round(ratio("#ffffff", "#000000")) === 21);

  const markup = html(<AchievementsScreen profile={defaultProfile()} t={makeT("de")} initialOpenId="wins" />);
  const PLATE = "#2e2413";                       // the lit half of a card's gradient — the worst case
  const colours = [...new Set((markup.match(/color:\s*(#[0-9a-fA-F]{6})/g) || [])
    .map((c) => c.split(":")[1].trim()))];
  ok("the treasury actually prints text colours", colours.length >= 3);

  const dark = colours.filter((c) => ratio(c, PLATE) < 3);
  // ink on gold BUTTONS is meant to be dark — those sit on a bright pill, not the plate
  const onPlate = dark.filter((c) => ratio(c, "#e8c96a") < 4.5);
  ok("no text colour falls below the readable floor on the plates",
    onPlate.length === 0 || console.log("     ", onPlate.map((c) => `${c} = ${ratio(c, PLATE).toFixed(1)}:1`).join(", ")));

  const faded = (markup.match(/opacity:\s*0?\.\d+/g) || []).map((o) => Number(o.split(":")[1]));
  ok("nothing is faded past legibility", faded.every((o) => o >= 0.55));
}

// ── 9. THE TREASURY LOOKS LIKE TREASURE ─────────────────────────────────────
// Two defects this pins down: half the plates were dimmed to "switched off",
// and the lit ones carried a 3px gold bar down the LEFT edge only, reading as
// a lopsided frame instead of a rim of gold.
{
  const bare = html(<AchievementsScreen profile={defaultProfile()} t={makeT("de")} />);
  const rich = html(<AchievementsScreen
    profile={{ ...defaultProfile(), stats: { wins: 30, checkmates: 12, games: 60, captures: 200 } }}
    t={makeT("de")} />);

  ok("no plate wears a one-sided rim", !bare.includes("inset 3px") && !rich.includes("inset 3px"));

  // Every card must be lit, and lit THE SAME — asserted without naming a
  // colour, so a repaint cannot quietly reintroduce a dim variant.
  // plates are painted in rgba; the gold claim button is a solid gradient
  const grounds = (m) => [...new Set((m.match(/background:linear-gradient\(160deg, rgba[^;"]*/g) || []))];
  ok("all plates share one ground, untouched or earned", grounds(bare).length === 1);
  ok("earned plates use that very same ground", grounds(rich).length === 1 && grounds(rich)[0] === grounds(bare)[0]);
  ok("the treasury actually draws its plates", (bare.match(/background:linear-gradient\(160deg, rgba/g) || []).length >= 14);

  // a waiting purse enlarges its plate and its button
  // DS1 §19.6: die Platten sind kompakter (17/13 statt 19/16, gemessen 84 px
  // Kartenhoehe) - die ABSICHT des Waechters bleibt: belohnbar > geschlossen.
  ok("a claimable plate sits roomier than the rest", rich.includes("padding:17px") && bare.includes("padding:13px"));
  ok("an untouched treasury offers nothing to claim", !bare.includes("padding:19px"));
  ok("the claim button is full width with air above it",
    rich.includes("padding:13px 18px 12px") && rich.includes("margin-top:9px"));

  // THE EMBLEMS ARE SHOWN AS PAINTED. They were greyed and darkened until an
  // achievement was under way, and at that strength you could not make out what
  // the picture showed at all.
  ok("no emblem is greyed or dimmed", !bare.includes("grayscale") && !rich.includes("grayscale"));
  ok("every emblem is drawn at full strength", (bare.match(/<img/g) || []).length >= 14);
  // the rim was tamed on request: quiet gold instead of near-white — it must
  // still be there, just no longer shouting
  ok("the rim is drawn strongly enough to read", bare.includes("2px solid #d9b565"));
  ok("the near-white rim is gone for good", !bare.includes("#f6e4a2") && !bare.includes("#fff6d8"));
}

// ── 10. THE CHRONICLE ───────────────────────────────────────────────────────
// For a player the record is earned page by page. For an admin it is a working
// reference: every figure legible at once, nothing to unlock first. And each
// entry shows BOTH faces — the battle painting and the plain vector sigil.
{
  const t = makeT("de");
  // v0.51: die Chronik wohnt in der AKADEMIE (Besitzer: "Regeln, Figuren und
  // Chronik sind dasselbe") - der Waechter zieht mit um und prueft sie dort.
  const chron = (account) => html(<AkademieScreen profile={defaultProfile()}
    t={t} en={false} account={account} onDone={() => {}} />);
  const player = chron(null);
  const admin = chron({ id: "a", name: "Admin", isAdmin: true });

  const veiled = (m) => (m.match(/>\?\?\?</g) || []).length;
  const named = (m) => CHARACTER_LIST.filter((c) => m.includes(">" + c.nameDe + "<")).length;

  ok("a fresh player's chronicle still keeps its secrets", veiled(player) > 20);
  ok("the admin's chronicle hides nothing", veiled(admin) === 0);
  ok("the admin sees every figure by name", named(admin) === CHARACTER_LIST.length);
  ok("the player does not", named(player) < CHARACTER_LIST.length);

  // both faces, on every row — paintings are <img>, sigils are inline <svg>
  const sigils = (admin.match(/Vektor-Zeichen/g) || []).length;
  const chipMarks = [IC_COIN, IC_SKILL].map((u) => u.slice(40, 104));
  const chips = chipMarks.reduce((n, mark) => n + (admin.split(mark).length - 1), 0);
  const plates = (admin.match(/<img/g) || []).length - chips;
  ok("every chronicle row carries a vector sigil", sigils >= CHARACTER_LIST.length);
  ok("the paintings are there too, one per row", plates >= CHARACTER_LIST.length);
  ok("sigils and paintings pair up one for one", sigils === plates);
}

// ── 11. THE EMPTY MAP MUST STILL DRAW ───────────────────────────────────────
// A painted chapter map brings its own scenery, so the generator hands back an
// EMPTY_SCENERY object instead of computing hills and huts. If that object is
// ever missing one field the map still reaches for, the campaign screen dies
// with "Cannot read properties of undefined (reading 'map')" — which is exactly
// the crash that came in from a phone on 22 July (a sibling of it, in the
// treasury). This path gets hot the moment painted maps arrive, so it is
// checked against the source itself.
{
  const src = readFileSync("src/app/ui/screens/CampaignScreen.jsx", "utf8");
  const block = src.slice(src.indexOf("const EMPTY_SCENERY"), src.indexOf("function useScenery"));
  const declared = new Set([...block.matchAll(/([a-zA-Z0-9_]+):/g)].map((m) => m[1]));
  const used = new Set([...src.matchAll(/scenery\.([a-zA-Z0-9_]+)/g)].map((m) => m[1]));
  const missing = [...used].filter((f) => !declared.has(f));
  ok("the blank scenery declares every field the map draws",
    missing.length === 0 || console.log("     fehlt:", missing.join(", ")));
  ok("the blank scenery is not itself empty", declared.size > 20);
}

// ── 12. NOTHING RENDERS ON A THIN PROFILE ───────────────────────────────────
// Save files from older builds lack fields that newer screens expect. Rendering
// each screen against a profile stripped of its optional parts proves no screen
// assumes more than it is given.
{
  const thin = defaultProfile();
  delete thin.codex; delete thin.records; delete thin.loadout.boosts;
  const t = makeT("de");
  const cases = [
    ["treasury", () => html(<AchievementsScreen profile={thin} t={t} dispatch={() => {}} initialOpenId="wins" />)],
    ["court", () => html(<ArmyScreen profile={thin} dispatch={() => {}} t={t} />)],
    ["chronicle", () => html(<ArmyScreen profile={thin} dispatch={() => {}} t={t} initialTab="chron" />)],
  ];
  for (const [name, fn] of cases) {
    let survived = true;
    try { fn(); } catch (e) { survived = false; console.log("     ", name, "→", e.message); }
    ok(`${name} survives a profile with missing optional parts`, survived);
  }
}

// ── 10. THE SIMPLE PIECES MUST BE READABLE AND COMPLETE ─────────────────────
// The vector set exists for one reason: recognition at a glance. That means a
// shape for EVERY figure (the Gambit borrowed the pawn's for months) and a
// contour on BOTH sides (gold pieces carried none at all and melted into a
// light square).
{
  const kinds = [...new Set(CHARACTER_LIST.map((c) => c.kind))];
  const missing = kinds.filter((k) => !PIECE_ART[k]);
  ok("every figure kind owns a vector shape",
    missing.length === 0 || console.log("     ", missing.join(", ")));
  ok("the Gambit has a silhouette of its own", !!PIECE_ART.GAMBIT);
  ok("and it is not simply the pawn's", PIECE_ART.GAMBIT !== PIECE_ART.P);

  const svg = (p) => html(<PieceGlyph piece={piece(p)} artStyle="svg" />);
  const mine = svg({ color: "w", kind: "N" });
  const foe = svg({ color: "b", kind: "N" });
  const rimOf = (m) => (m.match(/--rim:\s*([^;"]+)/) || [])[1];
  ok("your pieces wear a contour", !!rimOf(mine));
  ok("the enemy's pieces wear one too", !!rimOf(foe));
  ok("the two contours are opposites, not the same tone", rimOf(mine) !== rimOf(foe));
  ok("the contour has real weight", mine.includes("--rimW"));

  // the Gambit must actually render its own shape, not the pawn's
  const gambit = html(<PieceGlyph piece={piece({ color: "w", kind: "P", hero: true })} artStyle="svg" pov="w" />);
  const pawn = html(<PieceGlyph piece={piece({ color: "w", kind: "P" })} artStyle="svg" pov="w" />);
  ok("the Gambit draws its own figure on the board", gambit !== pawn);
}

// ── 11. EVERY MONSTER ITS OWN FACE ──────────────────────────────────────────
// Twenty-five monsters once shared five family silhouettes: in simple mode the
// Warden, the Bulwark, the Cannoneer, the Colossus and Ironfist were the same
// drawing. A campaign of champions cannot have five faces.
{
  const missing = BOSSES.filter((b) => !BOSS_ART[b.id]).map((b) => b.id);
  ok("every monster owns a silhouette of its own",
    missing.length === 0 || console.log("     ", missing.join(", ")));

  const shapes = new Set(BOSSES.map((b) => BOSS_ART[b.id] || BOSS_ART[b.art]));
  ok(`all ${BOSSES.length} monsters look different from one another`, shapes.size === BOSSES.length);

  ok("the family shapes survive as a fallback for anything new",
    ["golem", "beast", "serpent", "wraith", "tyrant"].every((f) => !!BOSS_ART[f]) && !!BOSS_ART._default);

  // each drawing must actually carry the theme variables, or it cannot be
  // recoloured for the enemy and would render as a flat default
  const flat = BOSSES.filter((b) => BOSS_ART[b.id] && !BOSS_ART[b.id].includes("var(--fill")).map((b) => b.id);
  ok("every monster drawing takes the board's colours",
    flat.length === 0 || console.log("     ", flat.join(", ")));
  const noRim = BOSSES.filter((b) => BOSS_ART[b.id] && !BOSS_ART[b.id].includes("var(--rim")).map((b) => b.id);
  ok("and every one of them wears the contour",
    noRim.length === 0 || console.log("     ", noRim.join(", ")));

  // a monster renders its OWN shape on the board, not its family's
  const asBoss = (bossId, art) => html(<PieceGlyph piece={piece({ kind: "X", color: "b", bossId, art })} artStyle="svg" pov="w" />);
  ok("two monsters of one family draw differently", asBoss("b01", "golem") !== asBoss("b06", "golem"));
}

// ── 12. THE RULES MUST BE SAID OUT LOUD ─────────────────────────────────────
// Two orbs decide every exchange, and an attacker springs BACK when the
// defender survives — which reads as a bug to anyone who was never told. The
// briefing must appear before a life battle, and must stay away once waved off.
{
  const hpNode = CAMPAIGN.find((n) => n.rules === "hp");
  ok("the campaign has a life battle to brief for", !!hpNode);
  const t = makeT("de");
  // A campaign station tells its tale FIRST — the briefing waits behind the
  // story card, so a quick life battle (no tale) is where it shows on sight.
  const screen = (prof) => html(<GameScreen profile={prof} dispatch={() => {}} t={t}
    quick={{ mapId: "classic", mode: "hp", difficulty: "easy" }} />);

  const fresh = screen(defaultProfile());
  ok("a life battle explains the blue orb", fresh.includes(t("hpb.atk").slice(0, 30)));
  ok("a life battle explains the red orb", fresh.includes(t("hpb.hp").slice(0, 30)));
  ok("and it explains the rebound", fresh.includes(t("hpb.bounce").slice(0, 40)));
  ok("the briefing offers a way to silence it", fresh.includes(t("hpb.never")));

  const quiet = screen({ ...defaultProfile(), notices: { hpBrief: true } });
  ok("once waved off it stays away", !quiet.includes(t("hpb.bounce").slice(0, 40)));

  // and the same lesson must be readable later, on demand — the academy is a
  // stepper, so every page gets rendered and searched
  const pages = Array.from({ length: 14 }, (_, n) =>
    html(<TutorialScreen t={t} en={false} onDone={() => {}} startAt={n} />)).join("");
  ok("the academy teaches the two orbs", pages.includes("Die zwei Kugeln") && pages.includes("Kampfkraft"));
  ok("the academy teaches the rebound", pages.includes("Rückprall") && pages.includes("ZURÜCK"));
  ok("the academy shows the actual orbs, not a stand-in", pages.includes("data:image/webp"));
}

// ── 13. THE MENU MUST NOT BE A DEAD END ─────────────────────────────────────
// On a wide screen the main rail stays visible during a match, and tapping it
// did nothing whatsoever — the fight simply kept rendering over the tab you
// picked. It asks now, and it must say the TRUTH about the cost: a campaign
// fight is saved, a quick or online game is forfeited.
{
  const t = makeT("de");
  const paused = html(<LeaveMatchAsk t={t} resumable onLeave={() => {}} onStay={() => {}} />);
  const lost = html(<LeaveMatchAsk t={t} resumable={false} onLeave={() => {}} onStay={() => {}} />);

  ok("leaving a campaign fight promises it is saved", paused.includes(t("leave.pause").slice(0, 30)));
  ok("leaving a quick game warns that it is lost", lost.includes(t("leave.quit").slice(0, 30)));
  ok("the two cases do not read the same", paused !== lost);
  ok("both offer a way back to the board", paused.includes(t("leave.stay")) && lost.includes(t("leave.stay")));
  // rendered markup escapes "&" — compare like for like
  const esc = (x) => x.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  ok("the campaign button speaks of pausing", paused.includes(esc(t("leave.pauseGo"))));
  ok("the quick-game button speaks of forfeiting", lost.includes(esc(t("leave.quitGo"))));

  // the warning must exist in both tongues, or an English player gets nothing
  const te = makeT("en");
  ok("the question is asked in English too",
    html(<LeaveMatchAsk t={te} resumable onLeave={() => {}} onStay={() => {}} />).includes(esc(te("leave.pauseGo"))));
}

// ── 14. THE REGISTER READS LIKE A CHRONICLE ─────────────────────────────────
// Three things were asked for repeatedly and kept slipping: the house caption
// belongs UNDER a figure's name (it sat in the tile's top-right corner), every
// tile should carry its bare vector figure in that corner instead, and the
// twenty-five masters should stand in ONE hall rather than five thin rows of
// question marks.
{
  const t = makeT("de");
  const prof = withProgressPct(defaultProfile(), 100, 5);
  const tree = html(<ArmyScreen profile={prof} dispatch={() => {}} t={t} initialTab="tree" />);
  // ── DER GROSSE DRACHE IM BLATT (Besitzer, v0.72.3) ──────────────────────
  // Er deckt 2x2 und schiebt diesen Block - das Blatt zeigte ihn als Punkt.
  {
    const dia = html(<MoveDiagram kind="D" />);
    const gold = (dia.match(/linear-gradient\(160deg,#e7c877,#b1863c\)/g) || []).length;
    ok("the dragon covers four squares, not one", gold >= 4);
    const blau = (dia.match(/rgba\(74,163,232,\.42\)/g) || []).length;
    ok("and his step reaches beyond the block", blau >= 8);
  }

  ok("the register opens", tree.length > 1000);
  // the chronicle waits for its paintings, so the grid itself is proven in the
  // browser (test_layout); what SSR can prove is the NAMING and the card
  ok("the register knows a single hall for the masters", !!t("tree.masters") && t("tree.masters") !== "tree.masters");
  ok("nothing still says the old house names",
    !tree.includes("Kronenfiguren") && !tree.includes("Schattenwesen"));

  // The tiles themselves need loaded paintings, so their geometry is proven in
  // the browser (test_layout). Here we hold the naming and the corner rule.
  ok("no caption is pinned to a tile corner", !/top:4px;right:6px/.test(tree));
}

// ── 15. THE OPENED PLATE PUTS ITS EMBLEM ON STAGE ───────────────────────────
{
  const t = makeT("de");
  const prof = { ...defaultProfile(), stats: { wins: 30, games: 60 } };
  const open = html(<AchievementsScreen profile={prof} t={t} initialOpenId="wins" />);
  const shut = html(<AchievementsScreen profile={prof} t={t} />);

  ok("opening stands the plate upright (emblem on top)", open.includes("flex-direction:column"));
  ok("the emblem grows when opened", /width:104px/.test(open) && !/width:104px/.test(shut));
  ok("it rises into place", open.includes("ggMedalRise"));
  ok("its ring of light turns", open.includes("ggRingSpin"));
  ok("sparks leave the rim", (open.match(/ggSpark/g) || []).length >= 4);
  ok("each spark rides its own tangent", /--a:\s*\d+deg/.test(open));
  ok("a closed plate stays quiet", !shut.includes("ggSpark") && !shut.includes("ggRingSpin"));
}

// ── 16. THE COURT WARNS WHILE A FIGHT RESTS ─────────────────────────────────
{
  const t = makeT("de");
  const base = withProgressPct(defaultProfile(), 100, 5);
  const resting = { ...base, pausedMatch: { v: 1, nodeId: "n03", enc: "x", potionsUsed: 0, hourglassUsed: 0 } };
  const withWarn = html(<ArmyScreen profile={resting} dispatch={() => {}} t={t} initialTab="formation" />);
  const without = html(<ArmyScreen profile={base} dispatch={() => {}} t={t} initialTab="formation" />);
  ok("a resting fight is announced in the formation editor", withWarn.includes(t("army.pausedHint").slice(0, 30)));
  ok("with no fight resting the note stays away", !without.includes(t("army.pausedHint").slice(0, 30)));
}

// ── 17. THE FIRST TWO QUESTIONS ─────────────────────────────────────────────
// Piece style and difficulty lived in the profile screen, where a newcomer
// never looks. They are asked once, at the door — and the door must also say
// that nothing is locked in.
{
  const t = makeT("de");
  const intro = html(<GameIntro t={t} dispatch={() => {}} onStart={() => {}} />);
  ok("the door asks which figures you want", intro.includes(t("setup.style").toUpperCase()));
  ok("both piece styles are offered", intro.includes(t("profile.styleSvg")) && intro.includes(t("profile.stylePainted")));
  ok("the door asks how hard it should be", intro.includes(t("setup.diff").toUpperCase()));
  ok("all three difficulties are offered",
    [t("diff.easy"), t("diff.normal"), t("diff.hard")].every((d) => intro.includes(d)));
  ok("it says the campaign climbs on its own", intro.includes(t("setup.diffHint").slice(0, 30)));
  ok("and that both can be changed later", intro.includes(t("setup.lead").slice(0, 30)));
}

// ── 18. FACTS IN THE TREASURY'S OWN WORDS ───────────────────────────────────
// The descriptions must match what the code actually counts. Two were wrong:
// the lightning mate never named its limit, and forgecraft spoke of a "forge"
// the game does not have.
{
  const byId = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));
  ok("the lightning mate names its move limit", /40/.test(byId.fast.descDe) && /40/.test(byId.fast.descEn));
  ok("no description invents a forge", !/Schmiede|at the forge/.test(byId.upgrades.descDe + byId.upgrades.descEn));
  ok("forgecraft names the currency it costs", /Skillpunkte|skill points/.test(byId.upgrades.descDe + byId.upgrades.descEn));
  ok("the wayfarer names how many stations exist", /51/.test(byId.stages.descDe));
  ok("every achievement explains itself in both tongues",
    ACHIEVEMENTS.every((a) => a.descDe.length > 40 && a.descEn.length > 40));
  ok("captures make clear whose captures count", /DU|YOU/.test(byId.captures.descDe + byId.captures.descEn));
}

// ── 19. A TAPPED PLATE CATCHES THE LIGHT ────────────────────────────────────
{
  const t = makeT("de");
  const prof = { ...defaultProfile(), stats: { wins: 30, games: 60 } };
  const m = html(<AchievementsScreen profile={prof} t={t} initialOpenId="wins" />);
  ok("the plate carries a sweep of light", m.includes("ggPlateSheen") || m.includes("translateX(-120%)"));
  ok("the emblems are lifted brighter", /brightness\(1\.[23]/.test(m));
}

// ── 17. THE FOUR GAMBITS ────────────────────────────────────────────────────
// A duel is only fair if both sides start on the same budget, so the table of
// clocks is one source of truth for lobby, board and matchmaker.
{
  ok("there are four gambits", TIME_MODES.length === 4);
  ok("every one names itself in both tongues",
    TIME_MODES.every((m) => m.de.name && m.en.name && m.de.blurb && m.en.blurb));
  ok("every one shows its clock at a glance", TIME_MODES.every((m) => m.de.tag && m.en.tag));
  ok("every one carries a colour and a mark", TIME_MODES.every((m) => /^#/.test(m.color) && m.glyph));

  const ids = TIME_MODES.map((m) => m.id);
  ok("the ids are unique", new Set(ids).size === 4);
  ok("exactly one is featured", TIME_MODES.filter((m) => m.featured).length === 1);

  // the clocks must climb: bullet < blitz < rapid < correspondence
  const secs = ["quick", "rush", "prime", "daily"].map((id) => timeModeById(id).base);
  ok("the budgets rise from bullet to correspondence",
    secs.every((v, i) => i === 0 || v > secs[i - 1]));
  ok("the fast formats hand time back", timeModeById("quick").inc > 0 && timeModeById("rush").inc > 0);

  const c = clockFor("rush");
  ok("a clock arrives in the board's own shape", c.type === "total" && c.seconds === 180 && c.inc === 2);
  ok("correspondence is a per-move deadline", clockFor("daily").type === "move");
  ok("an unknown clock falls back rather than crashing", clockFor("nonsense").seconds > 0);
  // correspondence is playable now — its card explains how the format behaves
  ok("correspondence explains itself in both tongues",
    TIME_MODES.some((m) => m.id === "daily" && m.noteDe && m.noteEn));
  ok("no gambit is left merely announced", TIME_MODES.every((m) => !m.pending));
}

// ── 18. THE CHEST IS PAINTED ────────────────────────────────────────────────
// Every item shows its painting wherever it appears — chest, battle HUD, a
// barred path, the academy — because they all pass through ONE component.
{
  const ids = Object.keys(ITEMS);
  const painted = ids.filter((id) => itemArt(id));
  ok(`most of the chest is painted (${painted.length}/${ids.length})`, painted.length >= 12);
  const missing = ids.filter((id) => !itemArt(id));
  ok("what is missing falls back rather than breaking",
    missing.every((id) => html(<ItemIcon id={id} size={22} />).length > 20));
  if (missing.length) console.log("      noch ungemalt:", missing.join(", "));

  const potion = html(<ItemIcon id="potion" size={22} />);
  // (the test bundle inlines assets, so the src is a data URL rather than a
  // hashed filename — what matters is that an IMAGE is drawn, not a glyph)
  ok("a painted item renders as an image", potion.includes("<img") && /src="(data:image|[^"]*\.webp)/.test(potion));
  ok("it is sized as asked", potion.includes("width:22px") && potion.includes("height:22px"));
  ok("and it keeps its aspect", potion.includes("object-fit:contain"));

  // the academy must show the paintings too, not a stray vector
  const t = makeT("de");
  const pages = Array.from({ length: 12 }, (_, n) =>
    html(<TutorialScreen t={t} en={false} onDone={() => {}} startAt={n} />)).join("");
  const imgs = (pages.match(/<img/g) || []).length;
  ok(`the academy shows painted items (${imgs} images drawn)`, imgs >= 2);

  // and its campaign card must match the story as it stands today
  ok("the academy no longer speaks of a League Keep",
    !pages.includes("Ligafeste") && !pages.includes("League Keep"));
  ok("it names the citadel and the grandmaster", pages.includes("Zitadelle") && pages.includes("Großmeister"));
  ok("it teaches the one-spell rule", /pro Partie nur EINE/.test(pages));
  ok("it names the four gambits", ["Quick Gambit", "Rush Gambit", "Prime Gambit", "Classic Gambit"].every((x) => pages.includes(x)));
}

// ── 19. EVERY PIECE OF GEAR OPENS ITS SHEET ─────────────────────────────────
// The sheet reads ITEMS at render time — and a missing import there crashed
import { IC_SPELLSTAR, IC_COIN, IC_SKILL } from "./src/app/ui/assets/icons/iconAssets.js";
// the whole court the moment a row was tapped, while build, smoke and SSR all
// stayed green because nothing ever OPENED it. So each sheet is rendered here.
{
  const t = makeT("de");
  const prof = withProgressPct(defaultProfile(), 100, 5);
  const ids = Object.keys(ITEMS);
  const broken = [];
  for (const id of [...ids, "shard"]) {
    try {
      const m = html(<ArmyScreen profile={prof} dispatch={() => {}} t={t} initialTab="gear" initialGearInfo={id} />);
      if (m.length < 500) broken.push(id + " (leer)");
    } catch (e) { broken.push(id + ": " + e.message.slice(0, 40)); }
  }
  ok(`every sheet opens without crashing (${ids.length + 1})`,
    broken.length === 0 || console.log("     ", broken.join(" | ")));

  const sheet = html(<ArmyScreen profile={prof} dispatch={() => {}} t={t} initialTab="gear" initialGearInfo="bergschluessel" />);
  ok("the sheet shows the painting large", sheet.includes("width:116px"));
  ok("it carries the short line", sheet.includes(ITEMS.bergschluessel.textDe.slice(0, 24)));
  ok("and the longer word beneath", sheet.includes(ITEMS.bergschluessel.loreDe.slice(0, 30)));

  ok("every item has a longer word in both tongues",
    ids.every((id) => ITEMS[id].loreDe && ITEMS[id].loreEn));
  const needsHelper = ["bergschluessel", "kriegsaxt", "donnerpulver", "sternenkompass", "anker", "boat"];
  ok("the pieces that need a companion say so",
    needsHelper.every((id) => /ACHTUNG|NOTE/.test(ITEMS[id].loreDe + ITEMS[id].loreEn)));
  ok("no heart glyph is left in the gear texts",
    ids.every((id) => !/[♥⚔]/.test(ITEMS[id].textDe + ITEMS[id].loreDe)));

  // the shard sits among the wares now, with no pedestal of its own
  const gear = html(<ArmyScreen profile={prof} dispatch={() => {}} t={t} initialTab="gear" />);
  // (a shine elsewhere on the page is fine — what mattered was the shard's OWN
  // gilded plate: its border, its ground and its gold lettering)
  ok("the star shard no longer sits on its own gilded plate",
    !gear.includes("rgba(43, 36, 16, .4)") && !gear.includes("1px solid #8a6d3566"));
  const shardSheet = html(<ArmyScreen profile={prof} dispatch={() => {}} t={t} initialTab="gear" initialGearInfo="shard" />);
  ok("its sheet explains the ration per chapter", /je erreichtem Kapitel/.test(shardSheet));
}

// ── 20. THE MASTERS STAND AS CHESS PIECES ───────────────────────────────────
// They were free-floating creatures with eyes and a mouth — one of them read
// as a smiley. Every one is built on the SAME chess armature now (the queen's
// skirt and collar, since a master takes her square); only the head tells them
// apart. These checks hold that shape.
{
  const bosses = BOSSES.map((b) => BOSS_ART[b.id]).filter(Boolean);
ok("every master has a drawing", bosses.length === BOSSES.length);

  // the shared armature: the queen's skirt and collar, literally the same path
  const SKIRT = "M20 27 L28 27";
  const COLLAR = "M18.4 23 L29.6 23";
  const noStand = BOSSES.filter((b) => !(BOSS_ART[b.id] || "").includes(SKIRT)).map((b) => b.id);
  ok("every master stands on a chess base",
    noStand.length === 0 || console.log("     ", noStand.join(", ")));
  const noCollar = BOSSES.filter((b) => !(BOSS_ART[b.id] || "").includes(COLLAR)).map((b) => b.id);
  ok("and wears the collar of the piece", noCollar.length === 0 || console.log("     ", noCollar.join(", ")));

  // no faces: circles were what made them smile
  const faces = BOSSES.filter((b) => /<circle/.test(BOSS_ART[b.id] || "")).map((b) => b.id);
  ok("none of them has eyes drawn on", faces.length === 0 || console.log("     ", faces.join(", ")));

  // one path each — a silhouette, not an assembly
  const multi = BOSSES.filter((b) => ((BOSS_ART[b.id] || "").match(/<path/g) || []).length !== 1).map((b) => b.id);
  ok("each is a single silhouette", multi.length === 0 || console.log("     ", multi.join(", ")));

  // the heads must actually differ — same skirt means the head carries the identity
  const head = (id) => (BOSS_ART[id] || "").split("M18.4 23")[0];
  const ids = BOSSES.map((b) => b.id);
  const same = [];
  for (let i = 0; i < ids.length; i++)
    for (let j = i + 1; j < ids.length; j++)
      if (head(ids[i]) === head(ids[j])) same.push(`${ids[i]}/${ids[j]}`);
  ok("no two masters share a head", same.length === 0 || console.log("     ", same.join(", ")));

  ok("the queen herself keeps the same stand", (PIECE_ART.Q || "").includes(SKIRT));
}


// ── DER RISSBODEN: WANN REISST ER AUF? ─────────────────────────────────────
// Diese Pruefungen gehoeren HIERHER und nicht in test_saves.mjs: RissBoden.jsx
// importiert zehn .webp-Dateien. Node laedt die nicht von sich aus - die
// Suite starb beim Import, und weil die Kette mit && verbunden ist, fielen
// die fuenf folgenden Suiten stumm mit aus (875 -> 656 Assertions, ohne eine
// einzige Fehlermeldung). Hier buendelt esbuild mit --loader:.webp=dataurl,
// also laeuft der Import.
// ── v1.0.4: DER RISS ENTSTEHT FRUEH UND WAECHST AUS JEDER QUELLE ───────────
{
  const n = (k) => Array.from({ length: k }, (_, i) => "n" + i);
  const st = (c) => rissStufe({ campaign: c });
  ok("frisches Spiel zeigt den ungebrochenen Boden", st({ league: 1, cleared: [], unlocked: [] }) === 1);
  ok("die ersten Stationen lassen den Riss schon aufblitzen",
    st({ league: 1, cleared: n(3), unlocked: [] }) >= 2);
  ok("ein echter Riss steht spaetestens ab Kapitel III",
    st({ league: 3, cleared: [], unlocked: [] }) >= 5);
  ok("die Stufe waechst ueber die Kapitel nie rueckwaerts", (() => {
    let vorher = 0;
    for (const lg of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
      for (const k of [0, 25, 50]) {
        const s2 = st({ league: lg, cleared: n(k), unlocked: [] });
        if (s2 < vorher) return false;
        vorher = s2;
      }
    return true;
  })());
  ok("der volle Hofstaat allein reisst den Boden ganz auf",
    st({ league: 1, cleared: [], unlocked: n(27) }) === 10);
  ok("das letzte Kapitel erreicht die letzte Stufe",
    st({ league: 10, cleared: n(50), unlocked: [] }) === 10);
  ok("ohne Profil bleibt es bei Stufe 1", rissStufe(null) === 1);
}



// ── DER NAME IN DER CHRONIK (v1.0.13, Besitzer-Punkt 6) ──────────────────
import { loreText } from "./src/app/ui/worldMap.js";
{
  const t = loreText(9, false, "Manu");
  ok("the chronicle takes the hero's name", t.includes("Manu") && !t.includes("{held}"));
  ok("without a name the chronicle says: Namenloser", loreText(12, false, "").includes("Corvin — und Namenloser"));
  ok("the english chronicle bows too", loreText(1, true, "Ada").includes(", Ada "));
}


// ── DIE KNOPFREGEL (v1.0.16, Besitzer) ──────────────────────────────────────
// "Buttons muessen nicht zweizeilig sein, und der Text darf nie verschwinden."
import { Button as _Btn, Segmented as _Seg } from "./src/app/ui/primitives.jsx";
{
  const h = html(<_Btn>Abgeschlossen</_Btn>);
  ok("a button never shrinks below its longest word", h.includes("min-content"));
  ok("a button wraps instead of clipping", /overflow-wrap:\s*break-word/.test(h) && !/text-overflow/.test(h));
  ok("the side padding survives", /padding:\s*12px 16px/.test(h) && /box-sizing:\s*border-box/.test(h));
  // Ein sehr langes Wort (englische Beschriftungen sind oft laenger)
  const lang = html(<_Btn>Unvergleichlichkeitsbeschriftung</_Btn>);
  ok("even an absurd label keeps hyphenation", /hyphens/.test(lang));
  const seg = html(<_Seg options={[{ value: "a", label: "Aufstellung" }, { value: "b", label: "Figuren" }]} value="a" onChange={() => {}} />);
  const hoehen = [...seg.matchAll(/min-height:\s*(\d+)px/g)].map((m) => +m[1]);
  ok("a switch declares exactly one minimum height per option", hoehen.length === 2);
}


// ── BEIDE SPRACHEN TRAGEN DIESELBEN SCHLUESSEL (v1.0.17, Besitzer) ──────────
// Elf Schluessel fehlten im englischen Block - die ganze Passwort-Karte und
// zwei Weltkarten-Knoepfe. Sie fielen STUMM auf Deutsch zurueck, also stand
// im englischen Spiel "Passwort aendern". Genau das faellt niemandem auf,
// solange es niemand zaehlt.
import { readFileSync as _lies } from "node:fs";
{
  const roh = _lies("src/app/i18n/strings.js", "utf8");
  const schnitt = roh.indexOf("const EN = {");
  const schluessel = (x) => new Set([...x.matchAll(/"([a-zA-Z]+\.[a-zA-Z0-9]+)":/g)].map((m) => m[1]));
  const de = schluessel(roh.slice(0, schnitt)), en = schluessel(roh.slice(schnitt));
  const fehltEn = [...de].filter((k) => !en.has(k));
  const fehltDe = [...en].filter((k) => !de.has(k));
  ok("every german key has an english twin", fehltEn.length === 0);
  if (fehltEn.length) console.log("   ohne Englisch:", fehltEn.slice(0, 12).join(", "));
  ok("and no english key stands alone", fehltDe.length === 0);
  if (fehltDe.length) console.log("   ohne Deutsch:", fehltDe.slice(0, 12).join(", "));
}


// ── KEINE UNSICHTBARE EBENE IM KAMPF (v1.0.25, Besitzer: "es ruckelt") ──────
// Die Halle (MysticBackground) rendert ein 168 % breites Bild MIT CSS-Maske.
// Im Kampf verdeckt das Kapitelgemaelde sie vollstaendig - der Browser rechnete
// sie trotzdem jeden Frame mit. Diese Probe haelt fest, dass die beiden
// Ebenen einander nie ueberlagern.
import { MysticBackground as _MB } from "./src/app/ui/MysticBackground.jsx";
import { BrettHintergrund as _BH } from "./src/app/ui/BrettHintergrund.jsx";
{
  const halle = html(<_MB league={2} />);
  const grund = html(<_BH liga={2} />);
  ok("the hall carries an expensive css mask", /mask-image/.test(halle));
  ok("the board backdrop carries NO mask", !/mask-image/.test(grund));
  ok("and it sits on its own paint layer", /translateZ\(0\)/.test(grund) && /contain:/.test(grund));
  /* v1.0.27 (Besitzer: "die Hintergruende sind immer noch nicht da"): DER
     TEUERSTE FEHLER DIESER REIHE. Das Bild lag im DOM, in voller Groesse,
     mit Deckkraft 1 - und kam nie auf den Schirm: gemessen 0.004 Helligkeit
     statt 0.22. Grund war zIndex -1; der Seitenkoerper traegt Schwarz, und
     ein negativer zIndex malt HINTER den Hintergrund des Stapel-Vorfahren.
     Ein negativer zIndex darf hier nie zurueckkehren. */
  ok("the backdrop is NOT hidden behind the page background",
    !/z-index:\s*-/.test(grund) && /z-index:\s*0/.test(grund));
  // Der Quelltext der App: beide Ebenen haengen am inMatch-Schalter
  const roh = _lies("src/app/App.jsx", "utf8");
  const halleStellen = [...roh.matchAll(/<MysticBackground/g)].length;
  const mitGate = [...roh.matchAll(/!inMatch && <MysticBackground/g)].length;
  ok("every hall render is gated on inMatch", halleStellen > 0 && halleStellen === mitGate);
}


// ── DER KLASSISCHE SATZ FUELLT SEIN FELD (v1.0.26, Besitzer) ────────────────
{
  const glyph = (kind) => html(<PieceGlyph piece={{ kind, color: "w", hp: 0, maxHp: 0, level: 1, abilities: [] }} artStyle="classic" />);
  /* Der AEUSSERE Rahmen misst immer 1em - gemeint ist die Figur darin, also
     der groesste width-Wert im Markup. */
  const groesse = (h) => Math.max(0, ...[...h.matchAll(/width:\s*([0-9.]+)em/g)].map((m) => +m[1]));
  const bauer = groesse(glyph("P")), turm = groesse(glyph("R"));
  ok("the classic pawn fills its square", bauer >= 1.4);
  ok("and stands taller than the rest", bauer > turm);
  /* v1.0.34: der Bauer steht jetzt HOEHER als die uebrigen Figuren - das war
     der ausdrueckliche Wunsch ("Bauern viel groesser, alle anderen minimal
     kleiner"), also misst die Probe genau dieses Verhaeltnis. */
  ok("the rest stepped back a little", turm >= 1.0 && turm < bauer);
  ok("and the pawn now towers over them", bauer - turm >= 0.3);
  /* v1.0.26: die Flug-Fahne muss ANKOMMEN. Stand sie als zweiter
     Funktionsparameter, war sie immer false und das Pop blieb. */
  const ruhig = html(<PieceGlyph piece={{ kind: "R", color: "w", hp: 0, maxHp: 0, level: 1, abilities: [] }} artStyle="classic" fliegt />);
  const normal = html(<PieceGlyph piece={{ kind: "R", color: "w", hp: 0, maxHp: 0, level: 1, abilities: [] }} artStyle="classic" />);
  ok("a flying piece is not told to pop", /animation:\s*none/.test(ruhig) && !/animation:\s*none/.test(normal));
}


// ── DIE RANDWEICHE (v1.0.34, Besitzer) ─────────────────────────────────────
// "Das Zickzack ist doof am Rand, geht gar nicht - dann eher mit Transparenz
// und Schatten." Die gesprungene Kante ist fort. Wichtiger noch: der alte
// Kantenverlauf lag UEBER den Koepfen der hinteren Reihe (gleicher zIndex,
// spaeter im DOM) - genau die Kante, die der Besitzer auf den Figuren sah.
{
  const brett = _lies("src/app/ui/board/BoardView.jsx", "utf8");
  ok("the zigzag fracture is gone", !/viewBox="0 0 100 100"[\s\S]{0,400}path fill="#05070c"/.test(brett));
  ok("the edge veil that cut the heads is gone",
    !/zIndex:\s*3,[\s\S]{0,200}linear-gradient\(180deg, rgba\(5,7,12/.test(brett));
  /* v1.0.37: Die Randweiche ist geblieben, ihre BAUART hat gewechselt - von
     28 CSS-Masken auf einen Farbverlauf. Sichtbar dasselbe, fuer die
     Grafikeinheit ein Bruchteil der Arbeit. Die Probe verlangt darum
     ausdruecklich, dass am Brett KEINE Masken mehr haengen. */
  ok("every rim square still fades outward", /const randVerlauf = \(\(\) =>/.test(brett));
  ok("and it costs no css mask any more", !/maskImage: randMaske|WebkitMaskComposite/.test(brett));
  ok("the selected piece gets its own paint layer",
    /willChange: \(!ruhig && \(isSel \|\| isSpy\)\) \? "transform" : "auto"/.test(brett));
  ok("the board fades in once, not 64 times",
    /opacity: artReady \? 1 : 0,\s*\n\s*transition: "opacity 1\.6s/.test(brett));
}



// ── DER ABGEWEHRTE SCHLAG (v1.0.32, Besitzer) ──────────────────────────────
// "Wenn man nicht beim ersten Mal schlaegt, sollte man anders zurueckfliegen,
// und der Angriff sichtbar werden." Die alte Kurve lief symmetrisch hin und
// zurueck - weich, ohne Widerstand. Jetzt: Vorstoss, Aufprall, Rueckschleudern.
{
  const thema = _lies("src/app/ui/theme.js", "utf8");
  const kurve = thema.slice(thema.indexOf("@keyframes ggBounce"));
  const block = kurve.slice(0, kurve.indexOf("}\n") + 400).split("@keyframes")[1] || "";
  ok("the bounce has more than a there-and-back", (block.match(/%\s*\{/g) || []).length >= 5);
  ok("it squashes on impact", /scale\(1\.14,\s*\.88\)/.test(block));
  ok("and is thrown BACK past its own square", /-\.34/.test(block));
  // Der Funke am Beruehrungspunkt
  const brett = _lies("src/app/ui/board/BoardView.jsx", "utf8");
  ok("a spark marks where the strike landed",
    /anim\.bounced && \(\(\) =>/.test(brett) && /ggAufprall .34s/.test(brett));
}


// ── SITZ UND GROESSE AUF DEM BRETT (v1.0.35, Besitzer) ─────────────────────
// "Alle Figuren koennten noch etwas groesser sein, und sie sitzen sehr weit
// unten am Rand." Im laufenden Brett nachgemessen: der Bauer fuellt jetzt
// 133 % der Feldhoehe (vorher 122), der Turm 187 % - eine Figur STEHT auf
// ihrem Feld und waechst nach oben heraus, das ist gewollt. Der Hub hebt sie
// dabei zur Feldmitte, statt sie auf der Kante kleben zu lassen.
{
  const brett = _lies("src/app/ui/board/BoardView.jsx", "utf8");
  const hub = brett.match(/pieceLift = artStyle === "svg" \? "(-?[\d.]+)%" : bigScreen \? "(-?[\d.]+)%" : "(-?[\d.]+)%"/);
  ok("the pieces are lifted off the bottom edge", !!hub && Math.abs(+hub[3]) >= 15);
  const font = brett.match(/kind === "P" \? "([\d.]+)em" : "([\d.]+)em"\);/);
  ok("and every piece grew", !!font && +font[1] >= 1.15 && +font[2] >= 1.35);
}


// ── DER SPARMODUS WIRKT WIRKLICH (v1.0.37, Besitzer) ───────────────────────
// Ein Schalter, der nur im Profil steht und nichts bewegt, waere schlimmer
// als keiner: der Besitzer wuerde damit messen und ein falsches Ergebnis
// bekommen. Diese Probe legt jeden Posten um und sieht im Markup nach.
import { setSparmodus, SPAR_POSTEN, sparsam } from "./src/app/ui/sparmodus.js";
import { BrettHintergrund as _BHG } from "./src/app/ui/BrettHintergrund.jsx";
{
  ok("all four items exist", SPAR_POSTEN.length === 4);
  setSparmodus({});
  ok("nothing is saved by default", !sparsam());
  const voll = html(<_BHG liga={2} />);
  ok("the painting is drawn by default", /<img/.test(voll));
  setSparmodus({ gemaelde: true });
  const spar = html(<_BHG liga={2} />);
  ok("and it is GONE when switched off", !/<img/.test(spar));
  ok("the switch reports itself as active", sparsam());
  setSparmodus({});   // fuer alle folgenden Proben zuruecksetzen
  ok("switching back restores it", /<img/.test(html(<_BHG liga={2} />)));
  // Die drei Brett-Posten haengen im BoardView am selben Helfer
  const brett = _lies("src/app/ui/board/BoardView.jsx", "utf8");
  for (const posten of ["schatten", "randweich", "uebergang"])
    ok(`the board honours "${posten}"`, new RegExp(`gespart\\("${posten}"\\)`).test(brett));
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
