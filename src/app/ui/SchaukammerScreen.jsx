// ── DIE SCHAUKAMMER ─────────────────────────────────────────────────────────
// v0.88, auf Wunsch des Besitzers an die Stelle der alten Figurenwerkstatt
// getreten. Die Werkstatt wollte Figuren VERAENDERN und hat das nie gut
// gekonnt - Auswahlfelder, umstaendliche Wege, halbe Ergebnisse. Diese
// Kammer will etwas anderes und Einfacheres: ALLES ZEIGEN, nichts verstecken.
//
//   - jedes Bild des Hauses, nach Gruppen sortiert, zum Durchscrollen
//   - kein Auswahlfeld: die Gruppen stehen als Reiter nebeneinander
//   - JEDE KACHEL SAGT, OB IHR ORIGINAL DA IST (v1.0.3)
//   - Mehrfachauswahl zum zuegigen Aussortieren (v1.0.3)
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
const ZUORDNUNG = "/bildarchiv/zuordnung.json";

/* v1.0.3, NACHGEMESSEN: die Reiter waren TOT. Die Muster suchten
   "/assets/carved/", aber der Bau legt die Bilder unter /schau/ ab, und das
   Verzeichnis nennt sie "/schau/carved/…". Kein Muster traf je - alle 382
   Bilder fielen in den Sammelreiter "Weiteres", seit die Kammer ihre Liste
   zur Laufzeit holt (v0.90). Der Reiter stand da, er zaehlte nur nie etwas.
   Jetzt wird der ORDNER geprueft, nicht der ganze Pfad; die vier bisher
   namenlosen (kap, riss, stat, karten) heissen jetzt, was sie sind. */
const GRUPPEN = [
  ["Geschnitzte Figuren", "carved"],
  ["Gemalte Figuren", "painted"],
  ["Turnierfiguren", "klassik"],
  ["Ausrüstung", "items"],
  ["Bodentexturen", "felder"],
  ["Auszeichnungen", "ach"],
  ["Kapitelböden", "kap"],
  ["Risse", "riss"],
  ["Anzeigen", "stat"],
  ["Menükarten", "karten"],
  ["Kulisse und Wappen", ""],   // die Wurzel: alles ohne Unterordner
];

/* DREI ZUSTAENDE, NICHT ZWEI. tools/ordne-originale.py vergleicht jede
   Spielfassung mit jedem Original (Silhouette, Helligkeit, Kanten). Ab 0,90
   ist die Sache klar - alle 22 stimmen im Sichtvergleich. Zwischen 0,70 und
   0,90 liegen die geschnitzten Figuren derselben Familie, die sich um
   weniger als 0,07 unterscheiden: da RAET das Verfahren, und dann soll es
   das auch sagen statt sich sicher zu geben. */
const ZUSTAND = {
  sicher: { farbe: "#58c98b", grund: "rgba(88,201,139,.16)", wort: "hochauflösendes Original vorhanden" },
  moeglich: { farbe: "#d3ae5c", grund: "rgba(211,174,92,.16)", wort: "Kandidat — das Verfahren rät, bitte prüfen" },
  ohne: { farbe: "#c2606a", grund: "rgba(194,96,106,.16)", wort: "kein Original — mit der Spielfassung ist das Bild fort" },
};

/* Der Besitzer will auf einen Blick sehen, WAS er hat, nicht nur DASS er
   etwas hat. Also steht die laengste Kante des Originals im Schild, und die
   Stufe davor sagt, was diese Kante wert ist. */
function stufe(kante) {
  return kante >= 3000 ? "4K" : "HQ";
}

function gruppeVon(rel) {
  const teile = rel.split("/");
  const ordner = teile.length > 1 ? teile[0] : "";
  for (const [name, o] of GRUPPEN) if (o === ordner) return name;
  return "Weiteres";
}
function titelVon(pfad) {
  const n = pfad.split("/").pop().replace(/\.(webp|jpg|png|svg)$/, "");
  return n.replace(/^carved-/, "").replace(/-light$/, " · hell").replace(/-dark$/, " · dunkel")
          .replace(/-hell$/, " · hell").replace(/-dunkel$/, " · dunkel");
}

export function SchaukammerScreen() {
  const [roh, setRoh] = useState([]);
  const [zu, setZu] = useState(null);
  const [bestand, setBestand] = useState(null);
  useEffect(() => {
    let lebt = true;
    fetch(VERZEICHNIS).then((r) => r.json()).then((l) => lebt && setRoh(l)).catch(() => {});
    fetch(ZUORDNUNG).then((r) => r.json()).then((z) => lebt && setZu(z)).catch(() => {});
    fetch(BESTAND).then((r) => r.json()).then((b) => lebt && setBestand(b)).catch(() => {});
    return () => { lebt = false; };
  }, []);

  const ALLE = useMemo(() => roh.map((p) => {
    const rel = p.replace(/^\/schau\//, "");
    const t = zu && zu.treffer && zu.treffer[rel];
    const stand = !zu ? null : t ? (t.sicher ? "sicher" : "moeglich") : "ohne";
    return {
      pfad: p, rel, datei: p.split("/").pop(), titel: titelVon(p), gruppe: gruppeVon(rel),
      quelle: p,
      // Die Vorschau heisst wie das Bild, nur mit .webp dahinter (ausser es
      // heisst schon so). Das Abschneiden der Endung liess logo.jpg und
      // logo.webp auf dieselbe Datei zeigen.
      vorschau: "/schau-klein/" + (/\.webp$/i.test(rel) ? rel : rel + ".webp"),
      stand,
      wert: t ? t.wert : 0,
      vonHand: !!(t && t.quelle === "hand"),
      kante: t ? t.kante : 0,
      mass: t ? t.mass : null,
      massSpiel: t ? t.massSpiel : null,
      original: t ? "/bildarchiv/" + t.original : null,
      originalVorschau: t
        ? "/bildarchiv-klein/" + (/\.webp$/i.test(t.original) ? t.original : t.original + ".webp")
        : null,
    };
  }), [roh, zu]);

  const gruppen = useMemo(() => {
    const g = [];
    for (const e of ALLE) if (!g.includes(e.gruppe)) g.push(e.gruppe);
    return g;
  }, [ALLE]);
  const [gruppe, setGruppe] = useState(null);
  const zeigeGruppe = gruppe || gruppen[0];
  const [suche, setSuche] = useState("");
  const [filter, setFilter] = useState("alle");
  const [spalten, setSpalten] = useState(4);
  const [gross, setGross] = useState(null);

  /* v1.0.39 (Besitzerwunsch): WAS AUSSORTIERT IST, IST WEG. Bisher blieb ein
     als "archivieren" oder "loeschen" markiertes Bild in der Uebersicht
     stehen und zaehlte oben weiter mit - man raeumte auf und sah davon
     nichts. Jetzt verschwindet es aus der Liste UND aus jeder Zaehlung; die
     Leiste oben zeigt stattdessen, wie viele beiseitegelegt wurden. Die
     Merkliste selbst bleibt unangetastet, der Griff ist also umkehrbar. */
  const [merk, setMerk] = useState({});
  const aussortiert = (rel) => !!merk[rel];
  const GEPFLEGT = useMemo(() => ALLE.filter((e) => !merk[e.rel]), [ALLE, merk]);
  const beiseite = ALLE.length - GEPFLEGT.length;

  /* Die Bestandstafel rechnete frueher aus bestand.json - einer Datei mit von
     Hand gepflegten Zahlen, die der Messung widersprachen (sie sagte 122
     Originale, gemessen sind es 22 sichere und 14 mögliche). Zwei Quellen für
     dieselbe Zahl sind eine Quelle zuviel: die Tafel zählt jetzt selbst. */
  const tafel = useMemo(() => gruppen.map((g) => {
    const e = GEPFLEGT.filter((x) => x.gruppe === g);   /* v1.0.39: ohne die Aussortierten */
    return {
      gruppe: g, gesamt: e.length,
      sicher: e.filter((x) => x.stand === "sicher").length,
      moeglich: e.filter((x) => x.stand === "moeglich").length,
      ohne: e.filter((x) => x.stand === "ohne").length,
    };
  }), [GEPFLEGT, gruppen]);

  const sichtbar = useMemo(() => {
    const s = suche.trim().toLowerCase();
    return GEPFLEGT.filter((e) => e.gruppe === zeigeGruppe &&
      (filter === "alle" || e.stand === filter) &&
      (!s || e.titel.toLowerCase().includes(s) || e.datei.toLowerCase().includes(s)));
  }, [GEPFLEGT, zeigeGruppe, suche, filter]);

  /* v0.96 (Besitzerwunsch): AUSSORTIEREN. Die Kammer laeuft im Browser und
     darf nicht selbst im Bestand loeschen - das waere ein Schreibrecht, das
     eine Anzeigeseite nicht haben sollte. Stattdessen fuehrt sie eine
     MERKLISTE: was hier als "archivieren" oder "loeschen" markiert wird,
     sammelt sich und laesst sich als Liste ausgeben. Der naechste Bau (oder
     ich) fuehrt sie aus. So bleibt jede Loeschung nachvollziehbar und
     umkehrbar, bis sie wirklich geschieht.
     v1.0.3: die Liste hing am DATEINAMEN - zwei Bilder gleichen Namens in
     verschiedenen Ordnern (etwa carved/ und painted/) haetten einander
     mitgerissen. Jetzt haengt sie am vollen Pfad. */
  /* v1.0.3 (Besitzerwunsch "damit ich schneller aufräumen kann"): MEHRFACH-
     AUSWAHL. Ein Griff je Bild war bei 382 Bildern der Flaschenhals. */
  const [wahl, setWahl] = useState([]);
  const [wahlModus, setWahlModus] = useState(false);
  const gewaehlt = (rel) => wahl.includes(rel);
  const kippe = (rel) => setWahl((w) => w.includes(rel) ? w.filter((x) => x !== rel) : [...w, rel]);
  const markiereWahl = (art) => {
    setMerk((m) => {
      const n = { ...m };
      const alleSchon = wahl.every((r) => n[r] === art);
      for (const r of wahl) { if (alleSchon) delete n[r]; else n[r] = art; }
      return n;
    });
    setWahl([]);
  };
  const merkListe = () => {
    const z = Object.entries(merk).filter(([, a]) => a);
    if (!z.length) return;
    const karte = Object.fromEntries(ALLE.map((e) => [e.rel, e]));
    const zeilen = z.map(([r, a]) => {
      const e = karte[r];
      return `${a}\t${r}\t${e && e.original ? e.original.replace("/bildarchiv/", "") : "KEIN ORIGINAL"}`;
    });
    const blob = new Blob(["art\tdatei\toriginal\n" + zeilen.join("\n") + "\n"], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "aussortiert.txt";
    document.body.appendChild(a); a.click(); a.remove();
  };
  const laden = (url, name) => {
    const a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
  };

  const knopf = (an) => ({
    cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700,
    color: an ? "#241a08" : "#d8d2ea",
    background: an ? "linear-gradient(180deg,#f0d68f,#d3ae5c)" : "rgba(30,22,52,.6)",
    border: `1px solid ${an ? T.gold : "rgba(167,139,250,.3)"}`,
    borderRadius: 999, padding: "6px 11px",
  });

  return (
    <div style={{ minHeight: "100dvh", background: "radial-gradient(120% 80% at 50% -10%, #1a1430, #0a0812 70%)",
      color: "#e8e2cf", padding: "18px 14px 96px", fontFamily: "inherit" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="gg-serif" style={{ fontSize: 22, letterSpacing: ".08em", color: T.goldBright, marginBottom: 4 }}>
          DIE SCHAUKAMMER
        </div>
        <div className="gg-serif" style={{ fontSize: 12.5, color: T.dim, fontStyle: "italic", marginBottom: 14 }}>
          {ALLE.length} Bilder des Hauses. Jede Kachel sagt, ob ihr Original noch da ist.
        </div>

        {zu && (
          <div style={{ background: "linear-gradient(165deg,rgba(30,22,52,.55),rgba(14,10,24,.6))",
            border: "1px solid rgba(167,139,250,.26)", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
            <div className="gg-serif" style={{ fontSize: 12.5, letterSpacing: ".12em", textTransform: "uppercase",
              color: T.goldBright, marginBottom: 2 }}>Bestand · wo liegt ein HQ-Original?</div>
            <div style={{ fontSize: 12.5, marginBottom: 9 }}>
              <b style={{ color: ZUSTAND.sicher.farbe }}>{GEPFLEGT.filter((e) => e.stand === "sicher").length}</b>
              {" von "}{GEPFLEGT.length}{" Bildern haben eines. "}
              <span style={{ color: ZUSTAND.moeglich.farbe }}>
                {GEPFLEGT.filter((e) => e.stand === "moeglich").length} unsicher</span>
              {", "}
              <span style={{ color: ZUSTAND.ohne.farbe }}>
                {GEPFLEGT.filter((e) => e.stand === "ohne").length} ohne</span>.
              {beiseite > 0 && <span style={{ color: "#6f8fbf" }}>{" "}
                {beiseite} beiseitegelegt (nicht gezählt).</span>}
            </div>
            <div style={{ display: "grid", gap: 5 }}>
              {tafel.map((g) => (
                <div key={g.gruppe} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5 }}>
                  <span style={{ flex: "1 1 auto", minWidth: 0 }}>{g.gruppe}</span>
                  <span style={{ flex: "0 0 92px", height: 7, borderRadius: 99, display: "flex",
                    background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
                    <span style={{ width: (g.sicher / g.gesamt) * 100 + "%", background: ZUSTAND.sicher.farbe }} />
                    <span style={{ width: (g.moeglich / g.gesamt) * 100 + "%", background: ZUSTAND.moeglich.farbe }} />
                  </span>
                  <span style={{ flex: "0 0 78px", textAlign: "right", color: g.ohne ? "#e0a0a8" : "#a7e08f" }}>
                    {g.sicher}{g.moeglich ? `+${g.moeglich}` : ""}/{g.gesamt}
                  </span>
                </div>
              ))}
            </div>
            <div className="gg-serif" style={{ fontSize: 11.5, color: T.dim, fontStyle: "italic", marginTop: 9, lineHeight: 1.6 }}>
              Das Schild auf der Kachel nennt die längste Kante des Originals:{" "}
              <b style={{ color: ZUSTAND.sicher.farbe, fontStyle: "normal" }}>HQ 1536</b> heisst, es liegt
              ein verlustfreies PNG dieser Grösse im Archiv;{" "}
              <b style={{ color: ZUSTAND.moeglich.farbe, fontStyle: "normal" }}>HQ?</b> heisst, das Verfahren
              hat geraten (die Grossansicht zeigt beide nebeneinander);{" "}
              <b style={{ color: ZUSTAND.ohne.farbe, fontStyle: "normal" }}>kein HQ</b> heisst: löschst du die
              Spielfassung, ist das Bild fort.
              {" "}Gemessen mit tools/ordne-originale.py, {zu.vonHand} Zuordnungen von Hand gesetzt.
              {bestand && bestand.offen ? " Offen: " + bestand.offen.map((o) => `${o.was} (${o.anzahl})`).join(" · ") : ""}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
          {gruppen.map((g) => {
            const n = ALLE.filter((e) => e.gruppe === g).length;
            return (
              <button key={g} onClick={() => { setGruppe(g); setSuche(""); setWahl([]); }}
                style={knopf(g === zeigeGruppe)}>
                {g} <span style={{ opacity: .65 }}>{n}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
          {[["alle", "alle"], ["ohne", "nur ohne HQ"], ["moeglich", "nur unsichere"], ["sicher", "nur mit HQ"]]
            .map(([k, wort]) => (
              <button key={k} onClick={() => setFilter(k)} style={{ ...knopf(filter === k), fontSize: 11.5 }}>
                {wort}
              </button>
            ))}
          <span style={{ flex: "1 1 auto" }} />
          <button onClick={() => { setWahlModus((v) => !v); setWahl([]); }}
            style={{ ...knopf(wahlModus), fontSize: 11.5 }}>
            {wahlModus ? "Auswählen: an" : "Auswählen"}
          </button>
          {[3, 4, 6].map((n) => (
            <button key={n} onClick={() => setSpalten(n)} style={{ ...knopf(spalten === n), fontSize: 11.5, padding: "6px 9px" }}>
              {n}er
            </button>
          ))}
        </div>

        <input value={suche} onChange={(e) => setSuche(e.target.value)} placeholder="suchen …"
          style={{ width: "100%", maxWidth: 320, fontFamily: "inherit", fontSize: 13.5, color: "#e8e2cf",
            background: "rgba(8,6,16,.6)", border: "1px solid rgba(167,139,250,.3)", borderRadius: 10,
            padding: "9px 12px", marginBottom: 12 }} />

        <div style={{ display: "grid", gap: 8,
          gridTemplateColumns: `repeat(${spalten}, minmax(0,1fr))` }}>
          {sichtbar.map((e) => {
            const z = e.stand ? ZUSTAND[e.stand] : null;
            const w = gewaehlt(e.rel);
            const m = merk[e.rel];
            return (
              <div key={e.rel} style={{ position: "relative",
                background: "linear-gradient(165deg,rgba(30,22,52,.55),rgba(14,10,24,.6))",
                border: `1px solid ${w ? T.gold : m === "loeschen" ? "#c2606a" : m === "archivieren" ? "#6f8fbf" : "rgba(167,139,250,.26)"}`,
                boxShadow: w ? `0 0 0 2px ${T.gold}55` : "none",
                borderRadius: 11, padding: 6 }}>
                <button onClick={() => (wahlModus ? kippe(e.rel) : setGross(e))} title={z ? z.wort : ""}
                  style={{ display: "block", width: "100%", aspectRatio: "1 / 1", cursor: wahlModus ? "pointer" : "zoom-in",
                    padding: 0,
                    background: "repeating-conic-gradient(rgba(255,255,255,.045) 0% 25%, transparent 0% 50%) 0 0/14px 14px",
                    border: "none", borderRadius: 7 }}>
                  {/* v0.96: die KACHEL zeigt die Vorschau (200 px, ein Zwoelftel
                      der Last), das Original kommt erst beim Antippen. Faellt
                      die Vorschau aus, springt das Original ein. */}
                  <img src={e.vorschau} alt="" loading="lazy" decoding="async"
                    onError={(ev) => { if (ev.target.src !== e.quelle) ev.target.src = e.quelle; }}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </button>
                {/* Das Kaestchen waehlt IMMER - auch ausserhalb des Auswahlmodus.
                    Sonst muesste man erst umschalten, um ein einzelnes Bild
                    dazuzunehmen. */}
                <button onClick={() => kippe(e.rel)} aria-label="auswählen"
                  style={{ position: "absolute", top: 4, left: 4, width: 20, height: 20, lineHeight: "18px",
                    textAlign: "center", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 900,
                    color: w ? "#241a08" : "#cfc6e6", background: w ? T.gold : "rgba(8,6,16,.72)",
                    border: `1px solid ${w ? T.gold : "rgba(167,139,250,.45)"}`, borderRadius: 5, padding: 0 }}>
                  {w ? "✓" : ""}
                </button>
                {/* DAS SCHILD. Der Besitzer wollte "einfach HQ darueber
                    schreiben" - also steht es dort, mit der Kante daneben,
                    damit man ohne Antippen sieht, WAS im Archiv liegt. */}
                {z && (
                  <span title={z.wort} style={{ position: "absolute", top: 3, right: 4,
                    fontSize: 8.5, fontWeight: 900, letterSpacing: ".04em", lineHeight: 1,
                    padding: "3px 4px", borderRadius: 4, whiteSpace: "nowrap",
                    color: z.farbe, background: "rgba(6,4,12,.82)", border: `1px solid ${z.farbe}88` }}>
                    {e.stand === "ohne" ? "kein HQ"
                      : e.stand === "moeglich" ? `${stufe(e.kante)}?`
                      : `${stufe(e.kante)} ${e.kante}`}
                  </span>
                )}
                {m && (
                  <span style={{ position: "absolute", bottom: 4, right: 5, fontSize: 9.5, fontWeight: 800,
                    letterSpacing: ".06em", color: m === "loeschen" ? "#e0a0a8" : "#a7bde0" }}>
                    {m === "loeschen" ? "LÖSCH" : "ARCHIV"}
                  </span>
                )}
                <div style={{ fontSize: 9.5, fontWeight: 700, marginTop: 5, lineHeight: 1.25,
                  overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                  wordBreak: "break-word" }}>{e.titel}</div>
              </div>
            );
          })}
        </div>
        {!sichtbar.length && <div className="gg-serif" style={{ color: T.dim, fontStyle: "italic", padding: "20px 2px" }}>
          Nichts gefunden.</div>}

        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 12 }}>
          <button onClick={() => setWahl(sichtbar.map((e) => e.rel))} style={{ ...knopf(false), fontSize: 11.5 }}>
            alle {sichtbar.length} sichtbaren wählen</button>
          {Object.values(merk).filter(Boolean).length > 0 && (
            <>
              <button onClick={merkListe} style={{ ...knopf(true), fontSize: 11.5 }}>
                Merkliste laden ({Object.values(merk).filter(Boolean).length})</button>
              <button onClick={() => setMerk({})} style={{ ...knopf(false), fontSize: 11.5 }}>
                Merkliste zurücksetzen</button>
            </>
          )}
        </div>

        <a href="/" style={{ display: "inline-block", marginTop: 24, fontSize: 12.5, color: T.dim }}>‹ Zurück ins Spiel</a>
      </div>

      {/* Die Auswahlleiste steht unten fest, damit sie beim Scrollen durch
          382 Kacheln nicht davonlaeuft. */}
      {wahl.length > 0 && (
        <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50,
          display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
          background: "rgba(12,9,22,.96)", borderTop: `1px solid ${T.gold}66`, padding: "10px 14px" }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, flex: "1 1 auto" }}>
            {wahl.length} gewählt
            <span style={{ color: T.dim, fontWeight: 400 }}>
              {" · "}{wahl.filter((r) => { const e = ALLE.find((x) => x.rel === r); return e && e.stand === "ohne"; }).length} davon ohne HQ
            </span>
          </span>
          <button onClick={() => markiereWahl("archivieren")}
            style={{ cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700, color: "#a7bde0",
              background: "transparent", border: "1px solid #6f8fbf", borderRadius: 8, padding: "7px 12px" }}>
            Archiv</button>
          <button onClick={() => markiereWahl("loeschen")}
            style={{ cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700, color: "#e0a0a8",
              background: "transparent", border: "1px solid #c2606a", borderRadius: 8, padding: "7px 12px" }}>
            Löschen</button>
          <button onClick={() => setWahl([])}
            style={{ cursor: "pointer", fontFamily: "inherit", fontSize: 12, color: T.dim,
              background: "none", border: `1px solid ${T.line}`, borderRadius: 8, padding: "7px 12px" }}>
            aufheben</button>
        </div>
      )}

      {gross && (
        <div onClick={() => setGross(null)} style={{ position: "fixed", inset: 0, zIndex: 60, cursor: "zoom-out",
          background: "rgba(4,6,10,.92)", display: "grid", placeItems: "center", padding: 18, overflowY: "auto" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "min(94vw, 860px)", textAlign: "center" }}>
            {/* Bei einem KANDIDATEN stehen beide nebeneinander. Das Verfahren
                raet in diesem Band - also soll der Besitzer sehen, worauf es
                geraten hat, statt einem Haken zu glauben. */}
            <div style={{ display: "grid", gap: 10,
              gridTemplateColumns: gross.original ? "repeat(auto-fit, minmax(220px, 1fr))" : "1fr" }}>
              <div>
                <img src={gross.quelle} alt="" style={{ maxWidth: "100%", maxHeight: "58dvh", objectFit: "contain",
                  background: "repeating-conic-gradient(rgba(255,255,255,.05) 0% 25%, transparent 0% 50%) 0 0/18px 18px",
                  borderRadius: 10 }} />
                <div className="gg-serif" style={{ fontSize: 11.5, color: T.dim, fontStyle: "italic", marginTop: 4 }}>
                  Spielfassung{gross.massSpiel ? " · " + gross.massSpiel.join(" × ") + " px" : ""}</div>
              </div>
              {gross.original && (
                <div>
                  <img src={gross.originalVorschau} alt=""
                    onError={(ev) => { if (ev.target.src !== gross.original) ev.target.src = gross.original; }}
                    style={{ maxWidth: "100%", maxHeight: "58dvh", objectFit: "contain",
                      background: "repeating-conic-gradient(rgba(255,255,255,.05) 0% 25%, transparent 0% 50%) 0 0/18px 18px",
                      borderRadius: 10 }} />
                  <div className="gg-serif" style={{ fontSize: 11.5, fontStyle: "italic", marginTop: 4,
                    color: ZUSTAND[gross.stand].farbe }}>
                    Original · {gross.mass ? gross.mass.join(" × ") + " px" : ""}
                    {gross.vonHand ? " · von Hand zugeordnet"
                      : gross.stand === "moeglich" ? ` · geraten (${gross.wert})` : ` · ${gross.wert}`}</div>
                </div>
              )}
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 800, marginTop: 10 }}>{gross.titel}</div>
            <div className="gg-serif" style={{ fontSize: 11.5, color: T.dim, fontStyle: "italic" }}>
              {gross.gruppe} · {gross.rel}
              {gross.original ? " ← " + gross.original.replace("/bildarchiv/", "") : ""}</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 12 }}>
              <button onClick={() => laden(gross.quelle, gross.datei)} style={{ ...knopf(false), fontSize: 12.5 }}>
                Spielfassung laden</button>
              {gross.original && (
                <button onClick={() => laden(gross.original, gross.original.split("/").pop())}
                  style={{ ...knopf(true), fontSize: 12.5 }}>Original laden</button>
              )}
              <button onClick={() => { kippe(gross.rel); setGross(null); }} style={{ ...knopf(false), fontSize: 12.5 }}>
                {gewaehlt(gross.rel) ? "abwählen" : "auswählen"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
