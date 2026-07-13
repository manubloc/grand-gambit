import { ABILITIES, TAGS } from "../../../content/index.js";
import { T } from "../theme.js";
import { PieceArt } from "./PieceArt.jsx";
import { BladesIc } from "../icons.jsx";
import { paintedForPiece, ENEMY_FILTER } from "./paintedArt.js";

// Fixed display order so the emblem row is stable as abilities are gained.
const TAG_ORDER = ["move", "ranged", "blink", "aoe", "control", "sustain", "promo"];

// A piece = a thin neon-OUTLINE silhouette whose glow grows with level, topped by
// a row of category emblems (one per distinct ability category it has — more
// abilities ⇒ more emblems), plus its exact LEVEL, its ATK (HP mode) and shield
// pips (chess mode). Player glows cyan, enemy magenta.
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
    .map((ab) => ({ id: ab.id, color: TAGS[ab.tag].color, spent: !!(ab.once && piece.used?.[ab.id]) }));

  // Crisp, modern: a short drop shadow for depth — no neon bloom.
  const glow = "drop-shadow(0 2px 3px rgba(0,0,0,.65))";
  const pieceSize = "0.9em";

  return (
    <div style={{ position: "relative", width: "1em", height: "1em", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "flex-end", animation: "pop .18s ease",
      paddingBottom: "0.055em", boxSizing: "border-box" }}>
      <div style={{ width: pieceSize, height: pieceSize, filter: glow }}>
        {(() => {
          // the gallery: painted figurines when chosen — enemy turned to steel
          const painting = artStyle === "painted" ? paintedForPiece(piece) : null;
          if (painting) return <img src={painting} alt="" draggable={false} style={{ width: "100%", height: "100%",
            objectFit: "contain", objectPosition: "bottom", filter: white ? undefined : ENEMY_FILTER,
            userSelect: "none", pointerEvents: "none" }} />;
          return <PieceArt kind={piece.kind} fill={fill} rim={rim} detail={detail} accent={accent} size="100%" level={showLevel ? lvl : 1} art={piece.art} hero={showHero} />;
        })()}
      </div>

      {showLevel && lvl > 1 && (
        <span aria-hidden style={{ position: "absolute", top: "-0.035em", left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: "0.032em", pointerEvents: "none" }}>
          {Array.from({ length: Math.min(lvl, 10) }).map((_, i) => (
            <span key={i} style={{ width: "max(3px, 0.07em)", height: "max(3px, 0.07em)", transform: "rotate(45deg)",
              background: "linear-gradient(135deg, #f0d68a, #a17f3e)",
              boxShadow: "0 0 3px #d9b56599, 0 1px 1px rgba(0,0,0,.55)" }} />
          ))}
        </span>
      )}
      {hpMode && (
        <span style={{ position: "absolute", left: "-0.045em", bottom: "0.16em", display: "flex",
          flexDirection: "column", alignItems: "center", gap: "0.005em", pointerEvents: "none",
          filter: "drop-shadow(0 1px 2px rgba(0,0,0,.85))" }}>
          <span style={{ fontSize: "0.185em", fontWeight: 900, color: neon, lineHeight: 1,
            textShadow: "0 1px 2px rgba(0,0,0,.9)" }}>{piece.atk}</span>
          <BladesIc color={neon} size={"0.16em"} />
        </span>
      )}
      {abilityDots.length > 0 && (
        <span aria-hidden style={{ position: "absolute", right: "-0.035em", top: "50%", transform: "translateY(-50%)",
          display: "flex", flexDirection: "column", gap: "0.04em", pointerEvents: "none" }}>
          {isBoss && <span style={{ width: "max(3px, 0.075em)", height: "max(3px, 0.075em)", transform: "rotate(45deg)",
            background: T.danger, boxShadow: `0 0 4px ${T.danger}88` }} />}
          {abilityDots.map((d) => (
            <span key={d.id} style={{ width: "max(3px, 0.08em)", height: "max(3px, 0.08em)", borderRadius: "50%",
              background: d.spent ? "#454a58" : d.color,
              boxShadow: d.spent ? "inset 0 0 0 1px rgba(255,255,255,.12)" : `0 0 4px ${d.color}77`,
              opacity: d.spent ? 0.6 : 1 }} />
          ))}
        </span>
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
