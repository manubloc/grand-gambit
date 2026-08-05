// ── ZEITBALKEN ──────────────────────────────────────────────────────────────
// v1.0.3 (Besitzerwunsch): "die Nutzerzahlen und die Berichte bitte mit einem
// Diagramm ueber die Zeit." Keine Chart-Bibliothek - das Spiel laedt in einem
// Buendel, und fuer Balken ueber Tage reicht ein Blatt SVG: Werte bucketen,
// Hoehen rechnen, fertig. Das Diagramm ist bewusst still: keine Achsenlinien,
// nur Balken, drei Zahlen und die Randdaten.
import { T } from "./theme.js";

const TAG = 864e5;

/** Zeitstempel (ms) in Tages- oder Wochenkoerbe zaehlen.
 *  @returns {{ koerbe: number[], von: number, schritt: number }} */
export function zaehleZeit(zeiten, { tage = 30, wochen = false } = {}) {
  const jetzt = Date.now();
  const schritt = wochen ? 7 * TAG : TAG;
  const n = wochen ? Math.ceil(tage / 7) : tage;
  // Korb 0 beginnt vor (n-1) Schritten, der letzte Korb ist "heute"
  const von = jetzt - (n - 1) * schritt;
  const koerbe = new Array(n).fill(0);
  for (const t of zeiten) {
    if (!t) continue;
    const i = Math.floor((t - von) / schritt);
    if (i >= 0 && i < n) koerbe[i]++;
  }
  return { koerbe, von, schritt };
}

export function ZeitBalken({ zeiten, tage = 30, wochen = false, farbe = "#a78bfa",
  titel, leerText = "noch nichts in diesem Zeitraum" }) {
  const { koerbe, von, schritt } = zaehleZeit(zeiten, { tage, wochen });
  const max = Math.max(...koerbe, 1);
  const summe = koerbe.reduce((a, b) => a + b, 0);
  const H = 56, LUECKE = 2;
  const B = 100 / koerbe.length;
  const datum = (ms) => new Date(ms).toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" });
  return (
    <div>
      {titel && <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{titel}</span>
        <span style={{ fontSize: 11, color: T.faint }}>{summe} · max {max}/{wochen ? "Woche" : "Tag"}</span>
      </div>}
      {summe === 0
        ? <div style={{ fontSize: 11.5, color: T.faint, padding: "8px 0 4px" }}>{leerText}</div>
        : <svg viewBox={`0 0 100 ${H}`} preserveAspectRatio="none"
            style={{ width: "100%", height: H, display: "block" }}>
            {koerbe.map((v, i) => {
              const h = v ? Math.max(2, (v / max) * (H - 4)) : 0;
              return v ? <rect key={i}
                x={(i * B + LUECKE / koerbe.length).toFixed(2)} y={(H - h).toFixed(2)}
                width={(B - 2 * LUECKE / koerbe.length).toFixed(2)} height={h.toFixed(2)}
                rx="0.6" fill={farbe} opacity={0.55 + 0.45 * (v / max)}>
                <title>{datum(von + i * schritt)}: {v}</title>
              </rect> : null;
            })}
          </svg>}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.faint, marginTop: 2 }}>
        <span>{datum(von)}</span><span>heute</span>
      </div>
    </div>
  );
}
