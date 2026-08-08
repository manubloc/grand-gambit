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
  const [form, setForm] = useState(null);   // v1.0.51: Form des letzten Versuchs

  async function versuchen() {
    if (prueft) return;
    setPrueft(true);
    const ok = await torOeffnen(wort);
    setPrueft(false);
    if (ok) onOffen();
    else {
      /* v1.0.51: Der Besitzer stand dreimal vor dieser Tuer, und jedes Mal
         sagte sie nur "Das war es nicht". Jetzt sagt sie, WAS ankam - Laenge
         und ob unsichtbare Zeichen dabei waren. Das Wort selbst steht
         nirgends; nur seine Form. Damit sieht man in einem Blick, ob beim
         Einfuegen ein Leerzeichen mitkam. */
      setForm({ laenge: wort.length, rand: wort !== wort.trim(), gross: /^[A-Z]/.test(wort) });
      setFehler(true); setWort("");
    }
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
          /* v1.0.51: die Telefontastatur macht sonst gern den ersten
             Buchstaben gross und "verbessert" das Zufallswort. */
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => { setWort(e.target.value); setFehler(false); }}
          onKeyDown={(e) => e.key === "Enter" && versuchen()}
          style={{ width: "100%", padding: "12px 14px", fontSize: 15, fontFamily: "inherit",
            borderRadius: 10, boxSizing: "border-box", color: T.ink,
            background: "rgba(255,255,255,.05)",
            border: `1px solid ${fehler ? "rgba(216,72,72,.7)" : "rgba(255,255,255,.16)"}`,
            outline: "none" }}
        />
        {fehler && <div style={{ fontSize: 12, color: "#e08a8a", marginTop: 8, lineHeight: 1.5 }}>
          Das war es nicht.
          {form && <span style={{ display: "block", color: T.faint, fontSize: 11, marginTop: 3 }}>
            {form.laenge} Zeichen angekommen
            {form.rand ? " · mit Leerzeichen am Rand (wird jetzt entfernt)" : ""}
            {form.gross ? " · beginnt mit Grossbuchstabe" : ""}
          </span>}
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
