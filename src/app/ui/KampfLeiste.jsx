// ── DIE KAMPFLEISTE ─────────────────────────────────────────────────────────
// Auftrag des Besitzers (v0.50): "Die Ausruestung hat man immer unten in der
// Legende, und on top diese Faehigkeiten - wenn man die Figur drueckt, sieht
// man unten die entsprechende Figur GROSS mit ihren Faehigkeiten" - als
// ECHTE Schaltflaechen in goldenen Ringen, mit einer Beschreibung auf Druck.
//
// Bauart: die Leiste steht IMMER im Gefecht (feste Hoehe - das Brett springt
// nicht, wenn man waehlt und abwaehlt). Ohne Wahl traegt sie einen leisen
// Hinweis. Mit Wahl: links die Figur gross (geschnitzte Kunst), daneben ihre
// Faehigkeiten UND die gerade moeglichen Sonderzuege (Rochade, En passant)
// als Bubbles. Ein Druck oeffnet die Beschreibung als Karte UEBER der Leiste
// (absolut - nichts im Fluss verschiebt sich). Die Ausruestung (Trank,
// Zeitriss, Sanduhr) bleibt die bestehende Legende direkt darunter.
import { useState, useEffect } from "react";
import { legalMovesFrom } from "../../core/index.js";
import { ABILITIES, CHARACTERS } from "../../content/index.js";
import { carvedForPiece, carvedFitFor } from "./board/carvedArt.js";
import { StatOrbBadge } from "./board/PieceGlyph.jsx";
import { T } from "./theme.js";

// Die Sonderzuege tragen ihre eigene kleine Karteikarte - sie sind keine
// erlernten Talente, sondern uraltes Schachrecht, das nur in seltenen
// Augenblicken offensteht. Genau deshalb gehoeren sie in die Liste: man soll
// SEHEN, wenn der Augenblick da ist.
const SONDER = {
  castle: {
    icon: "⇄", nameDe: "Rochade", nameEn: "Castling",
    descDe: "König und Turm ziehen im selben Zug: der König zwei Felder zum Turm, der Turm springt auf seine Innenseite. Nur wenn beide noch nie gezogen haben, die Gasse frei ist und der König weder im Schach steht noch über ein bedrohtes Feld zieht. Tippe das markierte Feld zwei Schritte neben dem König.",
    descEn: "King and rook move together: the king steps two squares toward the rook, the rook jumps to his inner side. Only while both are unmoved, the lane is clear and the king neither stands in check nor crosses an attacked square. Tap the marked square two steps beside the king.",
  },
  enpassant: {
    icon: "⚔", nameDe: "En passant", nameEn: "En passant",
    descDe: "Zog der gegnerische Bauer eben per Doppelschritt an deinem vorbei, darfst du ihn im Vorbeigehen schlagen: Zug auf das übersprungene Feld, der überholte Bauer verschwindet. Das Fenster steht genau einen Zug lang offen.",
    descEn: "If an enemy pawn just double-stepped past yours, you may capture it in passing: move onto the skipped square and the overtaken pawn vanishes. The window stays open for exactly one move.",
  },
};

function Bubble({ icon, label, dry, active, onTap }) {
  return (
    <button onClick={onTap} title={label}
      style={{ width: 46, height: 46, borderRadius: "50%", cursor: "pointer", flex: "0 0 auto",
        display: "grid", placeItems: "center", padding: 0, fontFamily: "inherit",
        // der goldene Ring: aussen Metall, innen violettes Email
        border: "none",
        background: dry
          ? "radial-gradient(circle at 35% 28%, #6b6252 0%, #4a4438 55%, #2e2a22 100%)"
          : "radial-gradient(circle at 35% 28%, #f0d68a 0%, #d4af37 48%, #8a6a1f 100%)",
        boxShadow: active
          ? "0 0 0 2px rgba(240,214,138,.9), 0 3px 10px rgba(0,0,0,.55)"
          : "0 1px 2px rgba(0,0,0,.5), 0 3px 10px rgba(0,0,0,.45)",
        opacity: dry ? 0.62 : 1 }}>
      <span style={{ width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center",
        background: "radial-gradient(circle at 38% 30%, #4a3a6e 0%, #241a3a 100%)",
        border: "1px solid rgba(0,0,0,.45)",
        color: dry ? "#8d8674" : "#f0d68a", fontSize: 19, lineHeight: 1 }}>{icon}</span>
    </button>
  );
}

export function KampfLeiste({ state, inspect, en, myColor = "w", banner = false }) {
  const [offen, setOffen] = useState(null); // { art: "ab"|"sonder", id }
  const pc = inspect && inspect.mode === "own" && state.board[inspect.i] ? state.board[inspect.i] : null;
  // Wahlwechsel schliesst eine offene Beschreibung - sie gehoert zur Figur.
  useEffect(() => { setOffen(null); }, [inspect && inspect.i, state]);
  if (banner) return null;

  const abIds = pc ? (pc.abilities || []).filter((id) => ABILITIES[id] && ABILITIES[id].live) : [];
  const dry = pc ? Object.keys(pc.used || {}).length > 0 : false;
  // Sonderzuege, die JETZT offenstehen (aus den legalen Zuegen der Figur):
  let sonder = [];
  if (pc && pc.color === myColor) {
    try {
      const setS = new Set(legalMovesFrom(state, inspect.i).map((m) => m.special).filter(Boolean));
      sonder = ["castle", "enpassant"].filter((k) => setS.has(k));
    } catch { sonder = []; }
  }

  const ch = pc ? Object.values(CHARACTERS).find((c) => c.kind === pc.kind) : null;
  const nm = pc ? (pc.name ? (en ? pc.name.en : pc.name.de) : ch ? (en ? ch.nameEn : ch.nameDe) : pc.kind) : "";
  const fit = pc ? carvedFitFor(pc) : null;
  const src = pc ? carvedForPiece(pc) : null;

  const beschreibung = offen && (offen.art === "sonder"
    ? SONDER[offen.id]
    : ABILITIES[offen.id]);

  return (
    <div style={{ position: "relative", flex: "0 0 auto", padding: "0 10px 6px" }}>
      {/* die Beschreibungskarte schwebt UEBER der Leiste - nichts verschiebt sich */}
      {beschreibung && (
        <div onClick={() => setOffen(null)} style={{ position: "absolute", left: 10, right: 10, bottom: "100%",
          marginBottom: 6, zIndex: 8, borderRadius: 12, padding: "9px 12px 10px", cursor: "pointer",
          background: "rgba(12, 10, 22, .94)", border: "1px solid rgba(233,210,150,.55)",
          boxShadow: "0 8px 24px rgba(0,0,0,.55)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
            <span className="gg-serif" style={{ fontSize: 14, color: T.goldBright, letterSpacing: ".04em" }}>
              {en ? beschreibung.nameEn : beschreibung.nameDe}</span>
            {offen.art === "ab" && ABILITIES[offen.id]?.once && (
              <span style={{ fontSize: 10.5, fontWeight: 800, color: dry ? T.faint : "#cbbcf5" }}>
                {dry ? (en ? "spell spent" : "Zauber verbraucht") : (en ? "once per battle" : "einmal pro Gefecht")}</span>)}
            {offen.art === "sonder" && (
              <span style={{ fontSize: 10.5, fontWeight: 800, color: "#9fe0b0" }}>
                {en ? "available now" : "jetzt möglich"}</span>)}
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.5, color: T.text }}>
            {en ? beschreibung.descEn : beschreibung.descDe}</div>
        </div>
      )}

      <div style={{ minHeight: 92, borderRadius: 14, display: "flex", alignItems: "center", gap: 11,
        padding: "7px 10px", background: "linear-gradient(180deg, rgba(18,15,30,.86), rgba(10,9,16,.9))",
        border: "1px solid rgba(233,210,150,.28)", boxShadow: "0 4px 16px rgba(0,0,0,.4)" }}>
        {pc ? (<>
          {/* DIE FIGUR GROSS - dieselbe geschnitzte Kunst wie auf dem Brett */}
          <div style={{ width: 66, height: 80, flex: "0 0 auto", display: "grid", placeItems: "end center",
            filter: "drop-shadow(0 3px 6px rgba(0,0,0,.6))" }}>
            {src && <img src={src} alt="" decoding="async"
              style={{ maxWidth: 66, maxHeight: 80 * (fit?.h || 1) > 80 ? 80 : undefined,
                height: Math.min(80, 80 * (fit?.h || 1)), objectFit: "contain" }} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
              <span className="gg-serif" style={{ fontSize: 13.5, color: T.goldBright, letterSpacing: ".04em",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>{nm}</span>
              {(pc.level || 1) > 1 && <span style={{ fontSize: 11.5, fontWeight: 800, color: "#f0d68a" }}>Lv {pc.level}</span>}
              {pc.maxHp > 0 && <StatOrbBadge kind="life" v={pc.hp} size={20} />}
              {pc.atk != null && <StatOrbBadge kind="power" v={pc.atk} size={20} />}
              {pc.shield > 0 && <span style={{ fontSize: 11.5, fontWeight: 800, color: "#9fc1e8" }}>⛨ {pc.shield}</span>}
            </div>
            <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
              {sonder.map((k) => (
                <Bubble key={k} icon={SONDER[k].icon} label={en ? SONDER[k].nameEn : SONDER[k].nameDe}
                  active={offen?.art === "sonder" && offen.id === k}
                  onTap={() => setOffen((o) => o?.id === k ? null : { art: "sonder", id: k })} />
              ))}
              {abIds.map((id) => (
                <Bubble key={id} icon={ABILITIES[id].icon}
                  label={en ? ABILITIES[id].nameEn : ABILITIES[id].nameDe}
                  dry={dry && ABILITIES[id].once} active={offen?.art === "ab" && offen.id === id}
                  onTap={() => setOffen((o) => o?.id === id ? null : { art: "ab", id })} />
              ))}
              {sonder.length === 0 && abIds.length === 0 && (
                <span style={{ fontSize: 11.5, color: T.faint, alignSelf: "center" }}>
                  {en ? "No talents — this piece fights with its movement alone."
                      : "Keine Talente — diese Figur kämpft allein mit ihrer Gangart."}</span>
              )}
            </div>
          </div>
        </>) : (
          <span style={{ fontSize: 11.5, color: T.faint, padding: "0 4px" }}>
            {en ? "Tap one of your pieces — its talents and special moves appear here."
                : "Tippe eine deiner Figuren an — ihre Talente und Sonderzüge erscheinen hier."}</span>
        )}
      </div>
    </div>
  );
}
