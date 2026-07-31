// ── DIE KAMPFLEISTE ─────────────────────────────────────────────────────────
// v0.50: Figur gross + Bubbles. v0.64, nach der Bildvorlage des Besitzers:
// KEIN Gross-Portraet mehr ("die Figur wird ja schon beim Auswaehlen gross" -
// auf dem Brett), stattdessen KARTEN-SCHALTFLAECHEN wie in seiner Vorlage:
// ein schmaler violetter Kartenrahmen, darin der bewaehrte Goldring-Bubble,
// darunter der Name. Die Reihe scrollt seitlich, wenn mehr Karten da sind,
// als der Schirm traegt. Sonderzuege (Rochade, En passant) stehen als
// gruen markierte Karten voran. Und NEU: die NAECHSTE noch gesperrte
// Faehigkeit der Figur erscheint als Schloss-Karte mit ihrer Stufe - man
// sieht im Gefecht, was die Figur noch lernen kann (Freischalten geschieht
// im Hofstaat; eines Tages vielleicht im Spiel selbst).
import { useState, useEffect } from "react";
import { legalMovesFrom } from "../../core/index.js";
import { ABILITIES, CHARACTERS } from "../../content/index.js";
import { StatOrbBadge } from "./board/PieceGlyph.jsx";
import { T } from "./theme.js";

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

// Der Goldring aus v0.50 - unveraendert, nur als reiner Schmuck (kein
// eigener Knopf mehr; die KARTE ist die Schaltflaeche).
function Ring({ icon, dry, gruen }) {
  return (
    <span style={{ width: 42, height: 42, borderRadius: "50%", display: "grid", placeItems: "center", flex: "0 0 auto",
      background: dry
        ? "radial-gradient(circle at 35% 28%, #6b6252 0%, #4a4438 55%, #2e2a22 100%)"
        : "radial-gradient(circle at 35% 28%, #f0d68a 0%, #d4af37 48%, #8a6a1f 100%)",
      boxShadow: "0 1px 2px rgba(0,0,0,.5), 0 3px 10px rgba(0,0,0,.45)" }}>
      <span style={{ width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center",
        background: "radial-gradient(circle at 38% 30%, #4a3a6e 0%, #241a3a 100%)",
        border: "1px solid rgba(0,0,0,.45)",
        color: dry ? "#8d8674" : gruen ? "#9fe0b0" : "#f0d68a", fontSize: 17, lineHeight: 1 }}>{icon}</span>
    </span>
  );
}

// DIE KARTE (nach der Vorlage): schmaler violetter Rahmen, Ring oben,
// Name darunter - und bei der gesperrten Karte die Stufe als Untertitel.
function Karte({ icon, label, unter, dry, gruen, active, lock, onTap }) {
  return (
    <button onClick={onTap} title={label}
      style={{ width: 66, minHeight: 78, flex: "0 0 auto", cursor: "pointer", fontFamily: "inherit",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "7px 3px 5px",
        borderRadius: 12,
        border: active ? `1.5px solid ${T.goldBright}` : `1px solid ${lock ? "rgba(233,210,150,.2)" : "rgba(233,210,150,.42)"}`,
        background: lock
          ? "linear-gradient(180deg, rgba(20,16,32,.55), rgba(10,9,16,.6))"
          : "linear-gradient(180deg, rgba(38,28,64,.78), rgba(16,12,30,.9))",
        boxShadow: active ? "0 0 10px rgba(240,214,138,.35)" : "0 2px 8px rgba(0,0,0,.4)",
        opacity: lock ? 0.78 : 1 }}>
      <Ring icon={lock ? "🔒" : icon} dry={dry || lock} gruen={gruen} />
      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase",
        color: lock ? T.faint : gruen ? "#9fe0b0" : T.goldBright, lineHeight: 1.15, textAlign: "center",
        maxWidth: 60, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
        {label}</span>
      {unter && <span style={{ fontSize: 8.5, fontWeight: 800, color: T.faint }}>{unter}</span>}
    </button>
  );
}

export function KampfLeiste({ state, inspect, en, myColor = "w", banner = false }) {
  const [offen, setOffen] = useState(null); // { art: "ab"|"sonder"|"lock", id, level? }
  const pc = inspect && inspect.mode === "own" && state.board[inspect.i] ? state.board[inspect.i] : null;
  useEffect(() => { setOffen(null); }, [inspect && inspect.i, state]);
  if (banner) return null;

  const abIds = pc ? (pc.abilities || []).filter((id) => ABILITIES[id] && ABILITIES[id].live) : [];
  const dry = pc ? Object.keys(pc.used || {}).length > 0 : false;
  let sonder = [];
  if (pc && pc.color === myColor) {
    try {
      const setS = new Set(legalMovesFrom(state, inspect.i).map((m) => m.special).filter(Boolean));
      sonder = ["castle", "enpassant"].filter((k) => setS.has(k));
    } catch { sonder = []; }
  }

  const ch = pc ? Object.values(CHARACTERS).find((c) => c.kind === pc.kind) : null;
  const nm = pc ? (pc.name ? (en ? pc.name.en : pc.name.de) : ch ? (en ? ch.nameEn : ch.nameDe) : pc.kind) : "";
  // DIE NAECHSTE GESPERRTE: der erste Leiter-Eintrag der Figur, dessen
  // Faehigkeit sie noch nicht traegt - nur EINER, wie gewuenscht. Der Held
  // traegt seinen eigenen Baum im Hofstaat und bleibt hier ohne Schloss.
  const naechste = (pc && !pc.hero && ch?.ladder)
    ? ch.ladder
        .filter((e) => e.ability && ABILITIES[e.ability]?.live && !abIds.includes(e.ability))
        .sort((a, b) => a.level - b.level)[0] || null
    : null;

  const beschreibung = offen && (offen.art === "sonder" ? SONDER[offen.id] : ABILITIES[offen.id]);

  return (
    <div style={{ position: "relative", flex: "0 0 auto", padding: "0 10px 6px" }}>
      {beschreibung && (
        <div onClick={() => setOffen(null)} style={{ position: "absolute", left: 10, right: 10, bottom: "100%",
          marginBottom: 6, zIndex: 8, borderRadius: 12, padding: "9px 12px 10px", cursor: "pointer",
          background: "rgba(12, 10, 22, .94)", border: "1px solid rgba(233,210,150,.55)",
          boxShadow: "0 8px 24px rgba(0,0,0,.55)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
            <span className="gg-serif" style={{ fontSize: 14, color: T.goldBright, letterSpacing: ".04em" }}>
              {en ? beschreibung.nameEn : beschreibung.nameDe}</span>
            {offen.art === "ab" && ABILITIES[offen.id]?.once && (
              <span style={{ fontSize: 10.5, fontWeight: 800, color: dry ? T.faint : "#cbbcf5" }}>
                {dry ? (en ? "spell spent" : "Zauber verbraucht") : (en ? "once per battle" : "einmal pro Gefecht")}</span>)}
            {offen.art === "sonder" && (
              <span style={{ fontSize: 10.5, fontWeight: 800, color: "#9fe0b0" }}>
                {en ? "available now" : "jetzt möglich"}</span>)}
            {offen.art === "lock" && (
              <span style={{ fontSize: 10.5, fontWeight: 800, color: "#e0b46a" }}>
                {en ? `locked · unlock in the court from Lv ${offen.level}` : `gesperrt · freischaltbar im Hofstaat ab Lv ${offen.level}`}</span>)}
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.5, color: T.text }}>
            {en ? beschreibung.descEn : beschreibung.descDe}</div>
        </div>
      )}

      <div style={{ minHeight: 108, borderRadius: 14, display: "flex", flexDirection: "column", justifyContent: "center",
        gap: 6, padding: "7px 10px", background: "linear-gradient(180deg, rgba(18,15,30,.86), rgba(10,9,16,.9))",
        border: "1px solid rgba(233,210,150,.28)", boxShadow: "0 4px 16px rgba(0,0,0,.4)" }}>
        {pc ? (<>
          {/* KOPFZEILE: Name, Stufe, Kugeln - schlank, kein Portraet (die
              gewaehlte Figur steht ja gross markiert auf dem Brett) */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span className="gg-serif" style={{ fontSize: 13, color: T.goldBright, letterSpacing: ".04em",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 170 }}>{nm}</span>
            {(pc.level || 1) > 1 && <span style={{ fontSize: 11, fontWeight: 800, color: "#f0d68a" }}>Lv {pc.level}</span>}
            {pc.maxHp > 0 && <StatOrbBadge kind="life" v={pc.hp} size={19} />}
            {pc.atk != null && <StatOrbBadge kind="power" v={pc.atk} size={19} />}
            {pc.shield > 0 && <span style={{ fontSize: 11, fontWeight: 800, color: "#9fc1e8" }}>⛨ {pc.shield}</span>}
          </div>
          {/* DIE KARTENREIHE: Sonderzuege · Faehigkeiten · die naechste Gesperrte */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
            {sonder.map((k) => (
              <Karte key={k} icon={SONDER[k].icon} label={en ? SONDER[k].nameEn : SONDER[k].nameDe} gruen
                active={offen?.art === "sonder" && offen.id === k}
                onTap={() => setOffen((o) => o?.id === k ? null : { art: "sonder", id: k })} />
            ))}
            {abIds.map((id) => (
              <Karte key={id} icon={ABILITIES[id].icon}
                label={en ? ABILITIES[id].nameEn : ABILITIES[id].nameDe}
                dry={dry && ABILITIES[id].once} active={offen?.art === "ab" && offen.id === id}
                onTap={() => setOffen((o) => o?.id === id ? null : { art: "ab", id })} />
            ))}
            {naechste && (
              <Karte lock icon="🔒"
                label={en ? ABILITIES[naechste.ability].nameEn : ABILITIES[naechste.ability].nameDe}
                unter={`Lv ${naechste.level}`}
                active={offen?.art === "lock" && offen.id === naechste.ability}
                onTap={() => setOffen((o) => o?.id === naechste.ability ? null : { art: "lock", id: naechste.ability, level: naechste.level })} />
            )}
            {sonder.length === 0 && abIds.length === 0 && !naechste && (
              <span style={{ fontSize: 11.5, color: T.faint, alignSelf: "center" }}>
                {en ? "No talents — this piece fights with its movement alone."
                    : "Keine Talente — diese Figur kämpft allein mit ihrer Gangart."}</span>
            )}
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
