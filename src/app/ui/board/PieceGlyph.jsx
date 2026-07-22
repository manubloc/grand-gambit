import { ABILITIES, TAGS } from "../../../content/index.js";
import { T } from "../theme.js";
import { PieceArt } from "./PieceArt.jsx";
import { BladesIc } from "../icons.jsx";
import { paintedForPiece, paintedById, paintedFitFor, CLASSIC_PAINTED, ENEMY_FILTER } from "./paintedArt.js";

// Fixed display order so the emblem row is stable as abilities are gained.
const TAG_ORDER = ["move", "ranged", "blink", "aoe", "control", "sustain", "promo"];

// A piece = a thin neon-OUTLINE silhouette whose glow grows with level, topped by
// a row of category emblems (one per distinct ability category it has — more
// abilities ⇒ more emblems), plus its exact LEVEL, its ATK (HP mode) and shield
// pips (chess mode). Player glows cyan, enemy magenta.

// Little glass orbs of life, resting on the square's lower edge — the figure
// always stands above them. Deep bottle-green glass with a bright specular
// window and a shaded floor, so each bead reads as a tiny sphere. Giants
// (>10 HP) keep a slim glass bar instead.
function HpDots({ hp, max, side = "left", palette = "life" }) {
  const ratio = Math.max(0, Math.min(1, hp / max));
  // life speaks in the old traffic tongue; ENERGY is always the same cold blue
  const [col, deep] = palette === "energy" ? ["#4aa3e8", "#123a66"]
    : ratio > 0.55 ? ["#22a763", "#0a5229"] : ratio > 0.28 ? ["#e8a33f", "#8a5312"] : ["#e6394a", "#7c1622"];
  if (max > 10) {
    // heavyweights: a vertical life column on the LEFT flank, filling bottom-up
    return <span style={{ position: "absolute", bottom: "0.07em", [side]: "-0.012em",
      display: "flex", alignItems: "flex-end", width: "max(3.5px, 0.05em)", height: "0.52em",
      background: "rgba(6,10,16,.7)", borderRadius: 99, overflow: "hidden", pointerEvents: "none",
      boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,.22), inset 0 1px 1px rgba(0,0,0,.5)" }}>
      <span style={{ display: "block", width: "100%", height: `${ratio * 100}%`, borderRadius: 99,
        background: `linear-gradient(0deg, ${deep} 0%, ${col} 66%, rgba(255,255,255,.4) 100%)`, transition: "height .2s ease" }} />
    </span>;
  }
  const d = Math.min(0.075, 0.5 / Math.ceil(max / 2));
  return <span style={{ position: "absolute", bottom: "0.07em", [side]: "-0.028em",
    display: "grid", gridAutoFlow: "column", gridTemplateRows: `repeat(${Math.ceil(max / 2)}, auto)`,
    gap: "0.024em", pointerEvents: "none",
    filter: "drop-shadow(0 1px 1px rgba(0,0,0,.55))" }}>
    {Array.from({ length: max }).map((_, i) => (
      <span key={i} style={{ width: `max(3.5px, ${d}em)`, height: `max(3.5px, ${d}em)`, borderRadius: "50%",
        background: i < hp
          ? `radial-gradient(circle at 32% 26%, #ffffffe8 0%, rgba(255,255,255,.28) 17%, ${col} 50%, ${deep} 100%)`
          : "radial-gradient(circle at 32% 26%, rgba(255,255,255,.14) 0%, rgba(8,12,18,.78) 60%)",
        boxShadow: i < hp
          ? `inset 0 0 0 0.5px rgba(255,255,255,.3), inset 0 -0.6px 1px ${deep}, 0 0 3px ${col}55`
          : "inset 0 0 0 1px rgba(255,255,255,.12)",
        transition: "background .2s ease" }} />
    ))}
  </span>;
}


// ── THE STAT TRIAD: three orbs anchored to the BOTTOM-LEFT corner. Life is
// always the corner stone (bottom-left); Power sits ABOVE it; Energy sits to
// the RIGHT of life. They keep a small tangential gap between them. One design,
// three colours, BOTH armies alike. Each orb GROWS with its number (two digits
// need a wider home) and grows again when the piece is pressed (focus). Rims
// run to near-black with a vivid inner colour. Numbers live inside. ──
import "@fontsource/spectral/700.css";
import { ORB_BLUE, ORB_RED } from "../assets/stat/statAssets.js";
const ORB = { power: ORB_BLUE, life: ORB_RED }; // blue = attack, red = life
function numeralStyle(px) {
  return { fontFamily: NUM_FONT, fontWeight: 700, lineHeight: 1, fontSize: px,
    color: "#FCF5E2", WebkitTextStroke: "0.018em #15120D",
    textShadow: "0 0.06em 0 rgba(255,248,226,.26)", fontVariantNumeric: "tabular-nums" };
}

// MEASURED on the artwork (144x144): the sphere's visible mass centres at
// 49.6% / 48.2% of the image — it sits a hair left and noticeably HIGH in its
// box. A numeral centred on the BOX therefore reads ~1.8% too low and 0.4%
// too far right. ORB_TRUE_CENTER pulls it back onto the sphere's real middle,
// so single digits, double digits and "+1" all sit dead centre.
const ORB_TRUE_CENTER = { x: -0.004, y: -0.018 };

const NUM_FONT = "'Spectral', Georgia, serif";

// THE SPELL STAR — one gold star hovering in the seam between the two orbs:
// it burns while the piece still holds its single cast, and goes out the
// moment any talent fires (one spell per game — the star IS the ledger).
function SpellStar({ size }) {
  return <svg viewBox="0 0 24 24" aria-hidden style={{ width: size, height: size, display: "block",
    filter: "drop-shadow(0 0 3px rgba(240,214,138,.85)) drop-shadow(0 1px 1px rgba(0,0,0,.6))" }}>
    <defs><linearGradient id="ggStar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fdf0bd" /><stop offset=".55" stopColor="#e9c877" /><stop offset="1" stopColor="#a97f38" />
    </linearGradient></defs>
    <path d="M12 1.6 14.9 8.4 22.2 9 16.7 13.9 18.4 21.1 12 17.3 5.6 21.1 7.3 13.9 1.8 9 9.1 8.4Z"
      fill="url(#ggStar)" stroke="#5d451c" strokeWidth="1.1" strokeLinejoin="round" />
    <circle cx="9.6" cy="8.6" r="1.5" fill="rgba(255,250,225,.85)" />
  </svg>;
}

// TWO JEWELS UNDER EVERY FIGHTER: blue attack left, red life right — the same
// diameter and the same engraved numerals the old strip carried, for both
// sides alike (the figure itself tells friend from foe).
function StatDuo({ piece, focus, shrink = 1 }) {
  const d = 0.32 * (focus ? 1.4 : 1) * shrink;   // orb diameter in em
  const gap = d * 0.045;                         // a hair apart — nearly kissing
  // the star promises an ACT: only castable (live) talents count — a piece
  // with purely passive gifts has nothing left to "use", so no star for it
  const spell = (piece.abilities || []).some((id) => ABILITIES[id]?.live) && Object.keys(piece.used || {}).length === 0;
  const orb = (img, v) => <span style={{ width: d + "em", height: d + "em", display: "grid", placeItems: "center",
      backgroundImage: `url(${img})`, backgroundSize: "100% 100%" }}>
    {/* same optical correction as the badges: the sphere sits high in its box */}
    <span style={{ ...numeralStyle(d * 0.6 + "em"),
      transform: `translate(${(ORB_TRUE_CENTER.x * d).toFixed(4)}em, ${(ORB_TRUE_CENTER.y * d).toFixed(4)}em)` }}>{v}</span>
  </span>;
  return <span style={{ position: "absolute", bottom: "-0.09em", left: "50%", transform: "translateX(-50%)", zIndex: 3,
    display: "inline-flex", gap: gap + "em", pointerEvents: "none",
    filter: "drop-shadow(0 1px 1.5px rgba(0,0,0,.55))" }}>
    {orb(ORB.power, piece.atk)}
    {orb(ORB.life, piece.hp)}
    {spell && <span style={{ position: "absolute", left: "50%", top: 0, transform: "translate(-50%, -58%)" }}>
      <SpellStar size={d * 0.72 + "em"} />
    </span>}
  </span>;
}

// bare jewel sphere as an ICON — replaces the old sword/heart/bolt glyphs
export function JewelIc({ kind, size = 13 }) {
  return <span aria-hidden style={{ width: size, height: size, display: "inline-block", verticalAlign: "-0.15em",
    backgroundImage: `url(${ORB[kind]})`, backgroundSize: "100% 100%" }} />;
}

// px-based jewel badge for sheets & the court roster — the separately cut orbs.
export function StatOrbBadge({ kind, v, size = 26, num = 0.58 }) {
  // multi-glyph values ("+1", "12") get a touch more room so they stay inside
  // the cavity without shrinking below legibility
  const chars = String(v ?? "").length;
  const scale = chars >= 3 ? 0.78 : chars === 2 ? 0.88 : 1;
  return <span style={{ width: size, height: size, display: "grid", placeItems: "center", flex: "0 0 auto",
    backgroundImage: `url(${ORB[kind]})`, backgroundSize: "100% 100%",
    filter: "drop-shadow(0 1px 1.5px rgba(0,0,0,.45))" }}>
    <span style={{ ...numeralStyle(size * num * scale), textShadow: "0 1px 0 rgba(255,245,216,.22)",
      transform: `translate(${(ORB_TRUE_CENTER.x * size).toFixed(2)}px, ${(ORB_TRUE_CENTER.y * size).toFixed(2)}px)` }}>{v}</span>
  </span>;
}

// Exported: the CELL renders this now (BoardView), anchored to the SQUARE —
// not to the piece's own em-box, whose size varies per figure (pawn 0.98em,
// court 1.16em, dragon 1.48em) and silently shifted the orbs up and down.
// Only the 2x2 dragon overlay still draws its own (no cell to sit in).
export function StatTriad({ piece, focus, shrink = 1 }) {
  // the board wears the DUO now: blue attack + red life, spell star between
  return <StatDuo piece={piece} focus={focus} shrink={shrink} />;
}

export function PieceGlyph({ piece, showLevel = true, pov = "w", artStyle = "painted", focus = false, big = false }) {
  if (!piece) return null;
  const white = piece.color === "w";
  const neon = white ? T.lime : T.magenta; // badge/frame color per faction
  // Grand Gambit faction colors: the player is antique gold, the enemy deep navy.
  const fill = white ? "#c9a45c" : "#1a2233";
  const rim = white ? null : "#7e8dab";      // solid gold needs no edge; navy gets a hairline
  const detail = white ? "#7a5c26" : "#8fa0bb";
  const accent = piece.accent || T.gold;
  const lvl = piece.level || 1;
  const hpMode = piece.atk != null;
  // A master stands in the QUEEN'S PLACE — that is a matter of formation, not
  // of disguise. He shows his true face to both sides: the whole point of
  // meeting a champion is SEEING whom you face.
  const isBoss = !!piece.bossId;
  const paintPiece = piece;
  // The Grand Gambit wears his crest openly — unless Masquerade is learned:
  // then only his OWN commander (pov) still sees who he is.
  const showHero = !!piece.hero && (piece.color === pov || !(piece.abilities || []).includes("gambit_masquerade"));

  // Ability dots (right rail): sorted by tag for a stable column; once-spent
  // talents fade to ash so a glance tells you what is left in the tank.
  const abilityDots = (piece.abilities || [])
    .map((id) => ABILITIES[id]).filter(Boolean)
    .sort((x, y) => TAG_ORDER.indexOf(x.tag) - TAG_ORDER.indexOf(y.tag))
    .slice(0, 6)
    .map((ab) => ({ id: ab.id, color: (TAGS[ab.tag] || { color: T.gold }).color, spent: !!(ab.once && piece.used?.[ab.id]) }));

  // Crisp, modern: a short drop shadow for depth — no neon bloom. The risen
  // Gambit (Stufe II-VI) carries a quiet golden aura on top — OWN side only;
  // the opponent always sees the plain hero. The glow deepens per tier.
  const heroTier = piece.hero && white ? Math.min(6, piece.tier || 1) : 1;
  const AURA = [
    "", // tier 1: plain
    "drop-shadow(0 0 6px rgba(240,214,138,.38))",
    "drop-shadow(0 0 5px rgba(240,214,138,.5)) drop-shadow(0 0 11px rgba(240,214,138,.28))",
    "drop-shadow(0 0 6px rgba(240,214,138,.58)) drop-shadow(0 0 13px rgba(240,214,138,.34))",
    "drop-shadow(0 0 7px rgba(240,214,138,.66)) drop-shadow(0 0 15px rgba(240,214,138,.4))",
    "drop-shadow(0 0 8px rgba(246,224,150,.74)) drop-shadow(0 0 18px rgba(240,214,138,.46))",
  ];
  // POWER READS AS LIGHT: the mightier the piece, the brighter and shinier.
  // King > queen > masters-in-the-queen's-place > everyone else > pawns. The
  // king's portrait is painted far darker than the queen's (measured: median
  // 32 against her 58), so he needs a heavier hand to stand beside her. The
  // Gambit is a pawn — painted as dark as one — but he GLEAMS: a quiet sheen
  // even at tier one (gold for your own, cold steel for a foe's), beneath the
  // tier aura that grows with his rank.
  const isKing = !piece.hero && !isBoss && piece.kind === "K";
  const isQueen = !piece.hero && !isBoss && piece.kind === "Q";
  const isPawn = !piece.hero && !isBoss && piece.kind === "P";
  const royal = isKing || isQueen || isBoss;
  const ROYAL_HALO = white
    ? (isKing ? "drop-shadow(0 0 6px rgba(248,228,158,.64)) drop-shadow(0 0 16px rgba(240,214,138,.4))"
              : "drop-shadow(0 0 5px rgba(246,224,150,.5)) drop-shadow(0 0 12px rgba(240,214,138,.3))")
    : (isKing ? "drop-shadow(0 0 6px rgba(218,232,246,.54)) drop-shadow(0 0 16px rgba(190,212,232,.32))"
              : "drop-shadow(0 0 5px rgba(214,228,242,.42)) drop-shadow(0 0 12px rgba(190,212,232,.24))");
  const HERO_SHEEN = white
    ? "drop-shadow(0 0 5px rgba(240,214,138,.45)) drop-shadow(0 0 10px rgba(240,214,138,.22))"
    : "drop-shadow(0 0 5px rgba(214,228,242,.4)) drop-shadow(0 0 10px rgba(190,212,232,.2))";
  const glow = "drop-shadow(0 2px 3px rgba(0,0,0,.65))"
    + (AURA[heroTier - 1] ? " " + AURA[heroTier - 1] : "")
    + (piece.hero ? " " + HERO_SHEEN : "")
    + (royal ? " " + ROYAL_HALO : "");
  const pieceSize = hpMode && piece.maxHp > 0 ? "0.99em" : "1.0em"; // the figures own the square now

  // Resolve the painting up-front (if any) so we can level its base width. The
  // enemy's gallery is turned to steel; the risen Gambit wears his tier portrait.
  const painting = artStyle === "classic"
    ? (CLASSIC_PAINTED[paintPiece.kind] || paintedForPiece(paintPiece))
    : artStyle === "painted"
    ? ((heroTier >= 2 && paintedById("gambit-t" + heroTier)) || paintedForPiece(paintPiece))
    : null;
  // every painting fitted to one box (uniform height) and dropped onto one
  // baseline; big pieces and the drawn SVG opt out
  const fit = (painting && !big) ? paintedFitFor(paintPiece) : { h: 1, y: 0 };

  return (
    <div style={{ position: "relative", width: "1em", height: "1em", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: big ? "center" : "flex-end",
      paddingBottom: big ? 0 : "0.015em", animation: "pop .18s ease",
      boxSizing: "border-box" }}>

      {/* the head may rise above the square: the art gets MORE than the tile.
          A big piece (the 2x2 dragon) fills its whole block, centred. The scale
          levels each figure's base to one width, anchored at the foot so the
          base stays planted on the square. */}
      <div style={{ position: "relative", zIndex: 1, width: big ? "1.48em" : pieceSize, height: big ? "1.48em" : "calc(" + pieceSize + " * 1.16)", filter: glow, flex: "0 0 auto",
        marginTop: big ? 0 : "-0.16em",
        // the horizontal nudge re-centres each painting: its subject sits a
        // touch off the image middle (measured per file), and scaling would
        // otherwise push that bias outward — so we pull it back by x·h.
        transform: (fit.h !== 1 || fit.y !== 0 || fit.x) ? `translate(${(-(fit.x || 0) * fit.h).toFixed(4)}em, ${fit.y}em) scale(${fit.h})` : undefined, transformOrigin: "50% 100%" }}>
        {painting
          ? <img src={painting} alt="" draggable={false} decoding="async" style={{ width: "100%", height: "100%",
              // the gallery hangs in a dim hall — lift the paintings a step:
              // your golden court shines brighter, the steel foe a touch too
              objectFit: "contain", objectPosition: big ? "center" : "center bottom",
              filter: white
                ? (isKing ? "brightness(2.1) saturate(1.24) hue-rotate(8deg)"
                  : isQueen ? "brightness(1.62) saturate(1.24) hue-rotate(8deg)"
                  : isBoss ? "brightness(1.62) saturate(1.24) hue-rotate(8deg)"
                  : piece.hero ? "brightness(1.12) saturate(1) hue-rotate(8deg)"
                  : isPawn ? "brightness(0.97) saturate(0.82) hue-rotate(8deg)"
                  : "brightness(1.32) saturate(1.02) hue-rotate(8deg)")
                : ENEMY_FILTER + (isKing ? " brightness(1.85) saturate(1.2)"
                  : isQueen ? " brightness(1.42) saturate(1.18)"
                  : isBoss ? " brightness(1.42) saturate(1.18)"
                  : piece.hero ? " brightness(1)"
                  : isPawn ? " brightness(0.9) saturate(0.8)"
                  : " brightness(1.16) saturate(0.98)"),
              userSelect: "none", pointerEvents: "none" }} />
          : <PieceArt kind={piece.kind} fill={fill} rim={rim} detail={detail} accent={accent} size="100%" level={showLevel ? lvl : 1} art={piece.art} hero={showHero} />}
      </div>

      {/* the twin gauges: LIFE bubbles on the left flank, ENERGY bubbles on the
          right — same jewel language, only the cold blue tells them apart.
          Level, strike and every richer detail live in the tap-to-inspect sheet. */}
      {big && hpMode && piece.maxHp > 0 && <StatTriad piece={piece} focus={focus} shrink={0.98 / 1.48} />}


      {!hpMode && piece.shield > 0 && (
        <span style={{ position: "absolute", bottom: "-0.02em", right: "-0.04em", display: "flex", gap: "0.05em" }}>
          {Array.from({ length: Math.min(piece.shield, 4) }).map((_, i) => (
            <span key={i} style={{ width: "max(4px,0.1em)", height: "max(4px,0.1em)", borderRadius: "50%",
              background: T.blue, boxShadow: "0 1px 2px rgba(0,0,0,.6)" }} />
          ))}
        </span>
      )}
    </div>
  );
}
