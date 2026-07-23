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
import { PIECE_ART, BOSS_ART } from "./src/app/ui/art.generated.js";
import { readFileSync, readdirSync } from "node:fs";
import { AchievementsScreen } from "./src/app/ui/screens/AchievementsScreen.jsx";
import { GameScreen } from "./src/app/ui/screens/GameScreen.jsx";
import { LeaveMatchAsk } from "./src/app/App.jsx";
import { TutorialScreen } from "./src/app/ui/screens/TutorialScreen.jsx";
import { buildStageMatch, withProgressPct } from "./src/meta/index.js";
import { CAMPAIGN } from "./src/content/index.js";
import { ArmyScreen } from "./src/app/ui/screens/ArmyScreen.jsx";
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

  // THE TREASURY'S EMBLEMS: one painted medallion per achievement, square (they
  // are cast as discs) and big enough for the 54px rim on a 2x screen.
  const achDir = "src/app/ui/assets/ach";
  const achFiles = readdirSync(achDir).filter((f) => f.endsWith(".webp"));
  const achIds = evaluate({}).items.map((i) => i.id);
  const missing = achIds.filter((id) => !achFiles.includes(`ach-${id}.webp`));
  ok("every achievement has its own painted emblem", missing.length === 0 || console.log("     ", missing.join(", ")));
  ok("no emblem is orphaned", achFiles.every((f) => achIds.includes(f.slice(4, -5))));
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
  ok("a claimable plate sits roomier than the rest", rich.includes("padding:19px") && bare.includes("padding:16px"));
  ok("an untouched treasury offers nothing to claim", !bare.includes("padding:19px"));
  ok("the claim button is full width with air above it",
    rich.includes("padding:13px 18px 12px") && rich.includes("margin-top:9px"));

  // THE EMBLEMS ARE SHOWN AS PAINTED. They were greyed and darkened until an
  // achievement was under way, and at that strength you could not make out what
  // the picture showed at all.
  ok("no emblem is greyed or dimmed", !bare.includes("grayscale") && !rich.includes("grayscale"));
  ok("every emblem is drawn at full strength", (bare.match(/<img/g) || []).length >= 14);
  ok("the rim is drawn strongly enough to read", bare.includes("2.5px solid #f6e4a2"));
}

// ── 10. THE CHRONICLE ───────────────────────────────────────────────────────
// For a player the record is earned page by page. For an admin it is a working
// reference: every figure legible at once, nothing to unlock first. And each
// entry shows BOTH faces — the battle painting and the plain vector sigil.
{
  const t = makeT("de");
  const chron = (account) => html(<ArmyScreen profile={defaultProfile()} dispatch={() => {}}
    t={t} initialTab="chron" account={account} />);
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
  const plates = (admin.match(/<img/g) || []).length;
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

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
