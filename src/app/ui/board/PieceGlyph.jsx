import { ABILITIES, TAGS } from "../../../content/index.js";
import { T } from "../theme.js";
import { PieceArt } from "./PieceArt.jsx";
import { BladesIc } from "../icons.jsx";
import { paintedForPiece, paintedById, CLASSIC_PAINTED, ENEMY_FILTER } from "./paintedArt.js";

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
function HpDots({ hp, max }) {
  const ratio = Math.max(0, Math.min(1, hp / max));
  const [col, deep] = ratio > 0.55 ? ["#22a763", "#0a5229"] : ratio > 0.28 ? ["#e8a33f", "#8a5312"] : ["#e6394a", "#7c1622"];
  if (max > 10) {
    // heavyweights: a vertical life column on the LEFT flank, filling bottom-up
    return <span style={{ position: "absolute", bottom: "0.07em", left: "-0.012em",
      display: "flex", alignItems: "flex-end", width: "max(3.5px, 0.05em)", height: "0.52em",
      background: "rgba(6,10,16,.7)", borderRadius: 99, overflow: "hidden", pointerEvents: "none",
      boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,.22), inset 0 1px 1px rgba(0,0,0,.5)" }}>
      <span style={{ display: "block", width: "100%", height: `${ratio * 100}%`, borderRadius: 99,
        background: `linear-gradient(0deg, ${deep} 0%, ${col} 66%, rgba(255,255,255,.4) 100%)`, transition: "height .2s ease" }} />
    </span>;
  }
  const d = Math.min(0.075, 0.5 / Math.ceil(max / 2));
  return <span style={{ position: "absolute", bottom: "0.07em", left: "-0.028em",
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

export function PieceGlyph({ piece, showLevel = true, pov = "w", artStyle = "painted" }) {
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
  const isBoss = !!piece.bossId;
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
  const glow = "drop-shadow(0 2px 3px rgba(0,0,0,.65))" + (AURA[heroTier - 1] ? " " + AURA[heroTier - 1] : "");
  const pieceSize = hpMode && piece.maxHp > 0 ? "0.99em" : "1.0em"; // the figures own the square now

  return (
    <div style={{ position: "relative", width: "1em", height: "1em", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "flex-end",
      paddingBottom: "0.015em", animation: "pop .18s ease",
      boxSizing: "border-box" }}>

      {/* the head may rise above the square: the art gets MORE than the tile */}
      <div style={{ position: "relative", zIndex: 1, width: pieceSize, height: "calc(" + pieceSize + " * 1.16)", filter: glow, flex: "0 0 auto",
        marginTop: "-0.16em" }}>
        {(() => {
          // the gallery: painted figurines when chosen — enemy turned to steel;
          // the risen Gambit wears his tier portrait (own side only)
          const painting = artStyle === "classic"
            ? (CLASSIC_PAINTED[piece.kind] || paintedForPiece(piece))
            : artStyle === "painted"
            ? (heroTier >= 2 && paintedById("gambit-t" + heroTier)) || paintedForPiece(piece)
            : null;
          if (painting) return <img src={painting} alt="" draggable={false} style={{ width: "100%", height: "100%",
            // the gallery hangs in a dim hall — lift the paintings a step:
            // your golden court shines brighter, the steel foe a touch too
            objectFit: "contain", objectPosition: "center bottom", filter: white ? "brightness(1.36) saturate(1.06) hue-rotate(8deg)" : ENEMY_FILTER + " brightness(1.2)",
            userSelect: "none", pointerEvents: "none" }} />;
          return <PieceArt kind={piece.kind} fill={fill} rim={rim} detail={detail} accent={accent} size="100%" level={showLevel ? lvl : 1} art={piece.art} hero={showHero} />;
        })()}
      </div>

      {/* the quiet ledger: TWO bare numbers, nothing else — level in gold
          (right), strike in red-gold (left). Every richer detail lives in the
          tap-to-inspect sheet. */}
      {showLevel && lvl > 1 && (
        <span aria-hidden style={{ position: "absolute", top: "-0.02em", right: "0.005em", pointerEvents: "none",
          fontSize: "max(8px, 0.13em)", fontWeight: 800, lineHeight: 1, color: "#f0d68a",
          fontVariantNumeric: "tabular-nums", textShadow: "0 1px 2px rgba(0,0,0,.95), 0 0 4px rgba(0,0,0,.7)" }}>{lvl}</span>
      )}
      {hpMode && (
        <span aria-hidden style={{ position: "absolute", top: "-0.02em", left: "0.005em", pointerEvents: "none",
          fontSize: "max(8px, 0.13em)", fontWeight: 800, lineHeight: 1, color: "#e5975f",
          fontVariantNumeric: "tabular-nums", textShadow: "0 1px 2px rgba(0,0,0,.95), 0 0 4px rgba(0,0,0,.7)" }}>{piece.atk}</span>
      )}

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
