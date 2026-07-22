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

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
