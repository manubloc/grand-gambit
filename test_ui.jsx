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
import { ABILITIES } from "./src/content/index.js";
import { readFileSync, readdirSync } from "node:fs";
import { AchievementsScreen } from "./src/app/ui/screens/AchievementsScreen.jsx";
import { defaultProfile } from "./src/meta/index.js";
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
  ok("your piece carries two orb images", imgs(w) === 2);
  ok("the enemy piece carries two orb images", imgs(b) === 2);
  ok("both sides wear the SAME pair (attack blue, life red)", imgs(w) === imgs(b));
  ok("the values are actually printed", w.includes(">4<") && w.includes(">7<"));
}

// ── 3. ONE SIZE OF NUMERAL ──────────────────────────────────────────────────
// "die zahlen überall gleiche größe egal ob ein oder zweistellig"
{
  const one = fontSizes(html(<StatTriad piece={piece({ atk: 4, hp: 7 })} />));
  const two = fontSizes(html(<StatTriad piece={piece({ atk: 12, hp: 34 })} />));
  ok("single and double digits share one font size on the board", one.join() === two.join());
  ok("both orbs of a piece share one font size", new Set(one).size === 1);
}

// ── 4. THE SPELL STAR IS AN HONEST PROMISE ──────────────────────────────────
// One spell per game: the star must mean "you may still act", nothing else.
const star = (m) => m.includes("<svg") || m.includes("<path");
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
  ok("both badges pull an orb image", imgs(plain) === 1 && imgs(delta) === 1);
  // the optical correction must be applied — the sphere sits high in its box
  ok("the numeral is nudged onto the sphere's true centre", plain.includes("translate("));
  ok("multi-glyph values shrink a step to stay inside the cavity",
    parseFloat(fontSizes(delta)[0]) < parseFloat(fontSizes(plain)[0]));
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

  // the dim plate variant must be gone entirely — every card is lit
  const dimPlate = "rgba(46,38,22,.4)";
  ok("no card is left in the dark", !bare.includes(dimPlate) && !rich.includes(dimPlate));
  const litPlate = (m) => (m.match(/rgba\(74,58,28,\.55\)/g) || []).length;
  ok("untouched and earned plates share the same lit ground", litPlate(bare) > 5 && litPlate(bare) === litPlate(rich));

  // a waiting purse enlarges its plate and its button
  ok("a claimable plate sits roomier than the rest", rich.includes("padding:19px") && bare.includes("padding:16px"));
  ok("an untouched treasury offers nothing to claim", !bare.includes("padding:19px"));
  ok("the claim button is full width with air above it",
    rich.includes("padding:13px 18px 12px") && rich.includes("margin-top:9px"));
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
