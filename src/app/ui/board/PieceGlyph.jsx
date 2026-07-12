import { ABILITIES, TAGS } from "../../../content/index.js";
import { T } from "../theme.js";
import { PieceArt, CategoryMark } from "./PieceArt.jsx";
import { paintedForPiece, ENEMY_FILTER } from "./paintedArt.js";

// Fixed display order so the emblem row is stable as abilities are gained.
const TAG_ORDER = ["move", "ranged", "blink", "aoe", "control", "sustain", "promo"];

// A piece = a thin neon-OUTLINE silhouette whose glow grows with level, topped by
// a row of category emblems (one per distinct ability category it has — more
// abilities ⇒ more emblems), plus its exact LEVEL, its ATK (HP mode) and shield
// pips (chess mode). Player glows cyan, enemy magenta.
export function PieceGlyph({ piece, showLevel = true, pov = "w", artStyle = "svg" }) {
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

  const tags = [];
  for (const id of piece.abilities || []) {
    const ab = ABILITIES[id];
    if (ab && !tags.includes(ab.tag)) tags.push(ab.tag);
  }
  tags.sort((x, y) => TAG_ORDER.indexOf(x) - TAG_ORDER.indexOf(y));

  // Crisp, modern: a short drop shadow for depth — no neon bloom.
  const glow = "drop-shadow(0 2px 3px rgba(0,0,0,.65))";
  const shownTags = tags.slice(0, isBoss ? 4 : 5);
  if (isBoss) shownTags.unshift("boss");
  const pieceSize = shownTags.length ? "0.83em" : "0.93em";

  return (
    <div style={{ position: "relative", width: "1em", height: "1em", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", animation: "pop .18s ease" }}>
      {shownTags.length > 0 && (
        <div style={{ display: "flex", gap: "0.04em", height: "0.17em", alignItems: "center", marginBottom: "-0.01em" }}>
          {shownTags.map((tg) => <CategoryMark key={tg} tag={tg} color={tg === "boss" ? T.danger : TAGS[tg].color} size="0.16em" />)}
        </div>
      )}
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
        <span style={{ position: "absolute", top: "-0.06em", left: "-0.08em", fontSize: "0.23em", fontWeight: 900,
          color: neon, background: "#0d1017", border: `1px solid ${neon}`, borderRadius: "0.3em",
          padding: "0 0.26em", lineHeight: 1.5, boxShadow: "0 1px 2px rgba(0,0,0,.6)" }}>{lvl}</span>
      )}
      {hpMode && (
        <span style={{ position: "absolute", bottom: "-0.05em", right: "-0.09em", fontSize: "0.22em", fontWeight: 900,
          color: neon, background: "#0d1017", border: `1px solid ${neon}aa`, borderRadius: "0.3em",
          padding: "0 0.24em", lineHeight: 1.5 }}>{piece.atk}</span>
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
