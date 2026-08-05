// ── DIE SCHAUKAMMER ─────────────────────────────────────────────────────────
// v0.88, auf Wunsch des Besitzers an die Stelle der alten Figurenwerkstatt
// getreten. Die Werkstatt wollte Figuren VERAENDERN und hat das nie gut
// gekonnt - Auswahlfelder, umstaendliche Wege, halbe Ergebnisse. Diese
// Kammer will etwas anderes und Einfacheres: ALLES ZEIGEN, nichts verstecken.
//
//   - jedes Bild des Hauses, nach Gruppen sortiert, zum Durchscrollen
//   - kein Auswahlfeld: die Gruppen stehen als Reiter nebeneinander
//   - Titel und Dateiname unter jedem Bild - man weiss immer, was man sieht
//   - ein Griff aufs Bild laedt das ORIGINAL herunter
//
// Erreichbar ueber ?werkstatt (der alte Weg bleibt, damit nichts verlernt
// werden muss).
import { useEffect, useMemo, useState } from "react";
import { T } from "./theme.js";

/* Die Bilder werden NICHT statisch eingebunden. Der erste Versuch tat das
   (348 Importe) und blies das Spielbuendel von 1,7 auf 2,82 MB auf - so
   gross, dass die Offline-Ablage es nicht mehr aufnahm und der Bau
   abbrach. Die Schaukammer ist ein WERKZEUG, kein Teil des Spiels: sie holt
   ihre Bilder erst beim Oeffnen und nur die der gewaehlten Gruppe. */
/* ZWEI BAUWEGE, EIN MODUL - und das war die Falle. import.meta.glob kennt
   nur Vite; esbuild (Rauchtest und Einzeldatei) warf erst zur Laufzeit
   ("glob is not a function"). Ein try/catch fing das zwar ab - aber esbuild
   BUENDELT die 382 Bilder trotzdem als Datenketten mit: die Einzeldatei
   wuchs von 12 MB auf 119 MB und der Boot-Test erstickte daran.
   Also fragt die Kammer den Bestand jetzt zur LAUFZEIT ueber das Netz ab:
   sie holt die Liste aus einer kleinen Beilage, die der Bau erzeugt. Kein
   Buendler sieht die Bilder je - weder Vite noch esbuild. */
const VERZEICHNIS = "/schaukammer.json";
const BESTAND = "/bildarchiv/bestand.json";

const GRUPPEN = [
  ["Geschnitzte Figuren", /\/assets\/carved\//],
  ["Gemalte Figuren", /\/assets\/painted\//],
  ["Turnierfiguren", /\/assets\/klassik\//],
  ["Ausrüstung", /\/assets\/items\//],
  ["Bodentexturen", /\/assets\/felder\//],
  ["Auszeichnungen", /\/assets\/ach\//],
  ["Kulisse und Wappen", /\/assets\/[^/]+$/],
];

function gruppeVon(pfad) {
  for (const [name, muster] of GRUPPEN) if (muster.test(pfad)) return name;
  return "Weiteres";
}
function titelVon(pfad) {
  const n = pfad.split("/").pop().replace(/\.(webp|jpg|png|svg)$/, "");
  return n.replace(/^carved-/, "").replace(/-light$/, " · hell").replace(/-dark$/, " · dunkel")
          .replace(/-hell$/, " · hell").replace(/-dunkel$/, " · dunkel");
}


export function SchaukammerScreen() {
  const [ALLE, setAlle] = useState([]);
  useEffect(() => {
    let lebt = true;
    fetch(VERZEICHNIS).then((r) => r.json()).then((liste) => {
      if (!lebt) return;
      setAlle(liste.map((p) => ({ pfad: p, datei: p.split("/").pop(),
        titel: titelVon(p), gruppe: gruppeVon(p), quelle: p,
        vorschau: p.replace(/^\/schau\//, "/schau-klein/").replace(/\.(png|jpg|jpeg)$/i, ".webp") })));
    }).catch(() => {});
    return () => { lebt = false; };
  }, []);
  const gruppen = useMemo(() => {
    const g = [];
    for (const e of ALLE) if (!g.includes(e.gruppe)) g.push(e.gruppe);
    return g;
  }, [ALLE]);
  const [gruppe, setGruppe] = useState(null);
  /* v0.95 (Besitzerfrage: "kann ich das im Admin einsehen?"): ja - die
     Bestandsaufnahme steht jetzt hier, nicht nur als Datei im Bestand.
     Sie sagt, welche Spielfassung ihr Original hat und welche nicht. */
  const [bestand, setBestand] = useState(null);
  useEffect(() => {
    let lebt = true;
    fetch(BESTAND).then((r) => r.json()).then((b) => lebt && setBestand(b)).catch(() => {});
    return () => { lebt = false; };
  }, []);
  const zeigeGruppe = gruppe || gruppen[0];
  const [suche, setSuche] = useState("");
  const [gross, setGross] = useState(null);

  const sichtbar = useMemo(() => {
    const s = suche.trim().toLowerCase();
    return ALLE.filter((e) => e.gruppe === zeigeGruppe &&
      (!s || e.titel.toLowerCase().includes(s) || e.datei.toLowerCase().includes(s)));
  }, [ALLE, zeigeGruppe, suche]);

  /* v0.96 (Besitzerwunsch): AUSSORTIEREN. Die Kammer laeuft im Browser und
     darf nicht selbst im Bestand loeschen - das waere ein Schreibrecht, das
     eine Anzeigeseite nicht haben sollte. Stattdessen fuehrt sie eine
     MERKLISTE: was hier als "archivieren" oder "loeschen" markiert wird,
     sammelt sich und laesst sich als Liste ausgeben. Der naechste Bau (oder
     ich) fuehrt sie aus. So bleibt jede Loeschung nachvollziehbar und
     umkehrbar, bis sie wirklich geschieht. */
  const [merk, setMerk] = useState({});
  const markiere = (datei, art) =>
    setMerk((m) => ({ ...m, [datei]: m[datei] === art ? undefined : art }));
  const merkListe = () => {
    const z = Object.entries(merk).filter(([, a]) => a);
    if (!z.length) return;
    const text = z.map(([d, a]) => `${a}\t${d}`).join("\n");
    const blob = new Blob(["art\tdatei\n" + text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "aussortiert.txt";
    document.body.appendChild(a); a.click(); a.remove();
  };
  const laden = (e) => {
    const a = document.createElement("a");
    a.href = e.quelle; a.download = e.datei;
    document.body.appendChild(a); a.click(); a.remove();
  };

  return (
    <div style={{ minHeight: "100dvh", background: "radial-gradient(120% 80% at 50% -10%, #1a1430, #0a0812 70%)",
      color: "#e8e2cf", padding: "18px 14px 60px", fontFamily: "inherit" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="gg-serif" style={{ fontSize: 22, letterSpacing: ".08em", color: T.goldBright, marginBottom: 4 }}>
          DIE SCHAUKAMMER
        </div>
        <div className="gg-serif" style={{ fontSize: 12.5, color: T.dim, fontStyle: "italic", marginBottom: 14 }}>
          {ALLE.length} Bilder des Hauses. Antippen zeigt gross, der Knopf lädt das Original.
        </div>

        {bestand && (
          <div style={{ background: "linear-gradient(165deg,rgba(30,22,52,.55),rgba(14,10,24,.6))",
            border: "1px solid rgba(167,139,250,.26)", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
            <div className="gg-serif" style={{ fontSize: 12.5, letterSpacing: ".12em", textTransform: "uppercase",
              color: T.goldBright, marginBottom: 8 }}>Bestand · haben wir die Originale?</div>
            <div style={{ display: "grid", gap: 5 }}>
              {bestand.gruppen.map((g) => {
                const anteil = g.gesamt ? Math.round((g.original / g.gesamt) * 100) : 0;
                return (
                  <div key={g.gruppe} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5 }}>
                    <span style={{ flex: "1 1 auto", minWidth: 0 }}>{g.gruppe}</span>
                    <span style={{ flex: "0 0 92px", height: 7, borderRadius: 99, background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
                      <span style={{ display: "block", width: anteil + "%", height: "100%",
                        background: anteil > 60 ? "#6fbf59" : anteil > 25 ? "#d3ae5c" : "#c2606a" }} />
                    </span>
                    <span style={{ flex: "0 0 74px", textAlign: "right", color: g.fehlt ? "#e0a0a8" : "#a7e08f" }}>
                      {g.original}/{g.gesamt}{g.fehlt ? ` · ${g.fehlt} fehlt` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="gg-serif" style={{ fontSize: 11.5, color: T.dim, fontStyle: "italic", marginTop: 9, lineHeight: 1.5 }}>
              {bestand.offen.map((o) => `${o.was} (${o.anzahl}) — ${o.wo}`).join(" · ")}
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
          {gruppen.map((g) => {
            const n = ALLE.filter((e) => e.gruppe === g).length;
            const an = g === zeigeGruppe;
            return (
              <button key={g} onClick={() => { setGruppe(g); setSuche(""); }}
                style={{ cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: 700,
                  color: an ? "#241a08" : "#d8d2ea",
                  background: an ? "linear-gradient(180deg,#f0d68f,#d3ae5c)" : "rgba(30,22,52,.6)",
                  border: `1px solid ${an ? T.gold : "rgba(167,139,250,.3)"}`,
                  borderRadius: 999, padding: "7px 13px" }}>
                {g} <span style={{ opacity: .65 }}>{n}</span>
              </button>
            );
          })}
        </div>

        {Object.values(merk).filter(Boolean).length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
            background: "rgba(194,96,106,.12)", border: "1px solid rgba(194,96,106,.4)",
            borderRadius: 11, padding: "9px 12px", marginBottom: 12 }}>
            <span style={{ fontSize: 12.5, flex: "1 1 auto" }}>
              {Object.values(merk).filter((a) => a === "archivieren").length} zum Archivieren ·{" "}
              {Object.values(merk).filter((a) => a === "loeschen").length} zum Löschen vorgemerkt
            </span>
            <button onClick={merkListe} style={{ cursor: "pointer", fontFamily: "inherit", fontSize: 11.5,
              fontWeight: 700, color: "#241a08", background: "linear-gradient(180deg,#f0d68f,#d3ae5c)",
              border: "none", borderRadius: 8, padding: "6px 12px" }}>Liste laden</button>
            <button onClick={() => setMerk({})} style={{ cursor: "pointer", fontFamily: "inherit", fontSize: 11.5,
              color: T.dim, background: "none", border: `1px solid ${T.line}`, borderRadius: 8, padding: "6px 12px" }}>
              zurücksetzen</button>
          </div>
        )}
        <input value={suche} onChange={(e) => setSuche(e.target.value)} placeholder="suchen …"
          style={{ width: "100%", maxWidth: 320, fontFamily: "inherit", fontSize: 13.5, color: "#e8e2cf",
            background: "rgba(8,6,16,.6)", border: "1px solid rgba(167,139,250,.3)", borderRadius: 10,
            padding: "9px 12px", marginBottom: 14 }} />

        <div style={{ display: "grid", gap: 10,
          gridTemplateColumns: "repeat(auto-fill, minmax(132px, 1fr))" }}>
          {sichtbar.map((e) => (
            <div key={e.datei + e.gruppe} style={{ background: "linear-gradient(165deg,rgba(30,22,52,.55),rgba(14,10,24,.6))",
              border: "1px solid rgba(167,139,250,.26)", borderRadius: 12, padding: 9 }}>
              <button onClick={() => setGross(e)} title="gross zeigen"
                style={{ display: "block", width: "100%", height: 116, cursor: "zoom-in", padding: 0,
                  background: "repeating-conic-gradient(rgba(255,255,255,.045) 0% 25%, transparent 0% 50%) 0 0/16px 16px",
                  border: "none", borderRadius: 8 }}>
                {/* v0.96: die KACHEL zeigt die Vorschau (200 px, ein Zwoelftel
                    der Last), das Original kommt erst beim Antippen. Faellt
                    die Vorschau aus, springt das Original ein. */}
                <img src={e.vorschau} alt="" loading="lazy" decoding="async"
                  onError={(ev) => { if (ev.target.src !== e.quelle) ev.target.src = e.quelle; }}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </button>
              <div style={{ fontSize: 11.5, fontWeight: 700, marginTop: 7, wordBreak: "break-word" }}>{e.titel}</div>
              <div className="gg-serif" style={{ fontSize: 10.5, color: T.faint, fontStyle: "italic",
                wordBreak: "break-all", marginTop: 1 }}>{e.datei}</div>
              <button onClick={() => laden(e)}
                style={{ marginTop: 7, width: "100%", cursor: "pointer", fontFamily: "inherit", fontSize: 11.5,
                  fontWeight: 700, color: "#241a08", background: "linear-gradient(180deg,#f0d68f,#d3ae5c)",
                  border: "none", borderRadius: 8, padding: "6px 8px" }}>Original laden</button>
              <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
                {[["archivieren", "Archiv", "#6f8fbf"], ["loeschen", "Löschen", "#c2606a"]].map(([art, wort, farbe]) => (
                  <button key={art} onClick={() => markiere(e.datei, art)}
                    style={{ flex: 1, cursor: "pointer", fontFamily: "inherit", fontSize: 10.5, fontWeight: 700,
                      color: merk[e.datei] === art ? "#150f22" : farbe,
                      background: merk[e.datei] === art ? farbe : "transparent",
                      border: `1px solid ${farbe}`, borderRadius: 7, padding: "4px 6px" }}>{wort}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {!sichtbar.length && <div className="gg-serif" style={{ color: T.dim, fontStyle: "italic", padding: "20px 2px" }}>
          Nichts gefunden.</div>}

        <a href="/" style={{ display: "inline-block", marginTop: 24, fontSize: 12.5, color: T.dim }}>‹ Zurück ins Spiel</a>
      </div>

      {gross && (
        <div onClick={() => setGross(null)} style={{ position: "fixed", inset: 0, zIndex: 60, cursor: "zoom-out",
          background: "rgba(4,6,10,.92)", display: "grid", placeItems: "center", padding: 18 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "min(94vw, 720px)", textAlign: "center" }}>
            <img src={gross.quelle} alt="" style={{ maxWidth: "100%", maxHeight: "74dvh", objectFit: "contain",
              background: "repeating-conic-gradient(rgba(255,255,255,.05) 0% 25%, transparent 0% 50%) 0 0/18px 18px",
              borderRadius: 10 }} />
            <div style={{ fontSize: 13.5, fontWeight: 800, marginTop: 10 }}>{gross.titel}</div>
            <div className="gg-serif" style={{ fontSize: 11.5, color: T.dim, fontStyle: "italic" }}>
              {gross.gruppe} · {gross.datei}</div>
            <button onClick={() => laden(gross)}
              style={{ marginTop: 12, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                color: "#241a08", background: "linear-gradient(180deg,#f0d68f,#d3ae5c)", border: "none",
                borderRadius: 9, padding: "9px 18px" }}>Original laden</button>
          </div>
        </div>
      )}
    </div>
  );
}
