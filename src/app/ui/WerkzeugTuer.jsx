// ── DIE TUER VOR DEN WERKZEUGEN (v1.0.39) ──────────────────────────────────
// Ein schlichter Schirm: ein Feld, ein Knopf. Er steht vor Schaukammer,
// Klangwerkstatt und Spielerbuch. Wer das Wort kennt, ist fuer diese Sitzung
// durch - beim naechsten Start fragt er wieder.
import { useState } from "react";
import { T } from "./theme.js";
import { Button } from "./primitives.jsx";
import { torOeffnen } from "./torschloss.js";

export function WerkzeugTuer({ was = "Werkzeug", onOffen }) {
  const [wort, setWort] = useState("");
  const [fehler, setFehler] = useState(false);
  const [prueft, setPrueft] = useState(false);

  async function versuchen() {
    if (prueft) return;
    setPrueft(true);
    const ok = await torOeffnen(wort);
    setPrueft(false);
    if (ok) onOffen();
    else { setFehler(true); setWort(""); }
  }

  return (
    <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 20,
      background: "#05060a", color: T.ink }}>
      <div style={{ width: "100%", maxWidth: 340, textAlign: "center" }}>
        <div className="gg-serif" style={{ fontSize: 22, color: T.gold, letterSpacing: ".04em" }}>
          {was}
        </div>
        <div style={{ fontSize: 12.5, color: T.dim, margin: "8px 0 18px", lineHeight: 1.5 }}>
          Dieser Raum gehört dem Haus. Bitte das Wort.
        </div>
        <input
          type="password"
          value={wort}
          autoFocus
          onChange={(e) => { setWort(e.target.value); setFehler(false); }}
          onKeyDown={(e) => e.key === "Enter" && versuchen()}
          style={{ width: "100%", padding: "12px 14px", fontSize: 15, fontFamily: "inherit",
            borderRadius: 10, boxSizing: "border-box", color: T.ink,
            background: "rgba(255,255,255,.05)",
            border: `1px solid ${fehler ? "rgba(216,72,72,.7)" : "rgba(255,255,255,.16)"}`,
            outline: "none" }}
        />
        {fehler && <div style={{ fontSize: 12, color: "#e08a8a", marginTop: 8 }}>
          Das war es nicht.
        </div>}
        <div style={{ marginTop: 14 }}>
          <Button variant="primary" onClick={versuchen} disabled={prueft || !wort}>
            {prueft ? "Prüft …" : "Eintreten"}
          </Button>
        </div>
      </div>
    </div>
  );
}
