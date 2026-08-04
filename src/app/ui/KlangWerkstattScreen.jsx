// ── DIE KLANGWERKSTATT ──────────────────────────────────────────────────────
// Besitzer-Tool (?klangwerkstatt, verlinkt in der Verwaltung): JEDER Klang des
// Spiels zum Anhoeren - und zwar exakt so, wie er spaeter klingt, denn die
// Knoepfe rufen dieselbe klang()-Schicht mit denselben Pegeln und derselben
// Tonhoehenstreuung (+-4 %) wie das Spiel. Mehrfach tippen lohnt sich darum:
// Varianten und Streuung wechseln von selbst.
//
// Der Regler oben spiegelt den Effekt-Regler des Profils NICHT - er ist eine
// reine Abhoerhilfe und fasst das Profil nicht an.
import { useEffect, useRef, useState } from "react";
import { klang, klangEinstellen, klangVorwaermen } from "./klang.js";
import { T } from "./theme.js";
/* v0.85 (Besitzerfrage: "hast Du die Musikstuecke auch in der Werkstatt?"):
   Nein - bis jetzt nicht. Die Werkstatt kannte nur Effekte, und wer die
   Bereichsmusik hoeren wollte, musste durchs Spiel wandern. Hier liegen
   jetzt alle fuenf Stuecke mit eigenem Spieler. */
import spurMenue from "./assets/audio/musik-menue.mp3";
import spurKarte from "./assets/audio/musik-karte.mp3";
import spurKampf from "./assets/audio/musik-kampf-ruhig.mp3";
import spurSpannung from "./assets/audio/musik-kampf-spannung.mp3";
import spurMeister from "./assets/audio/musik-meister.mp3";

const STUECKE = [
  ["menue", "Menü · Die Halle", spurMenue, "tiefe gezupfte Saiten, ruhend"],
  ["karte", "Weltkarte · Der Weg", spurKarte, "dasselbe Thema, nun wandernd"],
  ["kampf", "Gefecht · ruhig", spurKampf, "konzentriert, Raum zum Denken"],
  ["kampfSpannung", "Gefecht · Spannung", spurSpannung, "wenn die Kräfte auseinanderlaufen"],
  ["meister", "Der Meister", spurMeister, "Kapitelfinale: Glocke, Chor, Wucht"],
];

// Reihenfolge und Woerter der Werkbank: erst das Brett (das man tausendmal
// hoert), dann Sonderzuege, Talente, Auftritte, Feier, zuletzt Menue+Karte.
const GRUPPEN = [
  ["Das Brett", [
    ["wahl", "Figur anwählen", "kurzer Holzgriff beim Aufnehmen"],
    ["zug", "Ziehen (3 Varianten)", "die Figur schleift über die Holzplatte"],
    ["treffer", "Treffer (2 Varianten)", "Holz auf Holz, dumpf — Ziel überlebt"],
    ["fall", "Sturz (2 Varianten)", "die Figur kippt und bleibt liegen"],
    ["nein", "Gesperrt", "gedämpfter Stopp — dieser Zug geht nicht"],
    ["schach", "Schach!", "tiefe Saite, ferne Glocke"],
  ]],
  ["Sonderzüge", [
    ["rochade", "Rochade", "zwei Figuren setzen nacheinander auf"],
    ["kroenung", "Bauernumwandlung", "wachsender Schimmer, würdevoll"],
    ["pfeil", "Fernangriff (2 Varianten)", "Sehne, Flug, hölzerner Einschlag"],
    ["drachenflug", "Drachenflug", "schwere Schwingen, wuchtige Landung"],
  ]],
  ["Talente & Vorräte", [
    ["talentGold", "Talent des Hofes", "goldener Schimmer über Holz"],
    ["sturmschritt", "Sturmschritt", "rasches Schleifen nach vorn"],
    ["trank", "Lebenstrank", "Korken, Schluck, warmes Glimmen"],
    ["zeitenwender", "Zeitenwender", "Sand rieselt rückwärts"],
    ["zeitriss", "Zeitriss spannen", "Ladung baut sich auf und schnappt"],
    ["rissBlitz", "Riss-Blitz", "violette Entladung, kristallener Schweif"],
  ]],
  ["Auftritte & Feier", [
    ["bestie", "Bestie erscheint", "Stein öffnet sich, kalter Atem"],
    ["meister", "Meister betritt das Feld", "tiefe Glocke, dunkler Chor"],
    ["sieg", "Sieg", "warmer Akkord mit Gong, edel"],
    ["niederlage", "Niederlage", "fallende Saiten, still endend"],
    ["stufe", "Stufenaufstieg", "drei steigende Schläge auf Gold"],
    ["frei", "Fähigkeit freigeschaltet", "Steinschloss dreht sich, Schimmer"],
    ["werbung", "Held rekrutiert", "Figur setzt auf, ferner Hornruf"],
    ["kapitelEnde", "Kapitel abgeschlossen", "Kirchenglocke, Blatt wendet sich"],
    ["gold", "Gold / Kauf", "Münzen fallen in den Lederbeutel"],
  ]],
  ["Menü & Karte (bewusst leise)", [
    ["menue", "Menü-Tipp", "der leiseste Klang im Haus"],
    ["blattAuf", "Blatt öffnen", "Pergament wird aufgeschlagen"],
    ["blattZu", "Blatt schließen", "Pergament wird abgelegt"],
    ["karteStation", "Station antippen", "hölzerne Marke drückt in die Karte"],
    ["karteFrei", "Station freigeschaltet", "Schimmer läuft übers Pergament"],
    ["kapitel", "Neues Kapitel", "die Karte rollt sich auf, ferner Hornruf"],
    ["karteSchritt", "Gambit rückt vor", "Holz rutscht über Stein"],
  ]],
];

export function KlangWerkstattScreen() {
  const [staerke, setStaerke] = useState(0.6);
  const [zuletzt, setZuletzt] = useState(null);
  /* Die Musikabteilung: EIN Spieler, damit nie zwei Stuecke uebereinander
     laufen. Erneutes Tippen auf dasselbe Stueck haelt an. */
  const spieler = useRef(null);
  const [laeuft, setLaeuft] = useState(null);
  useEffect(() => {
    const a = new Audio(); a.loop = true; a.volume = 0.5;
    spieler.current = a;
    return () => { a.pause(); a.src = ""; spieler.current = null; };
  }, []);
  useEffect(() => { if (spieler.current) spieler.current.volume = staerke * 0.85; }, [staerke]);
  const musik = (id, url) => {
    const a = spieler.current; if (!a) return;
    if (laeuft === id) { a.pause(); setLaeuft(null); return; }
    a.src = url; a.volume = staerke * 0.85;
    a.play().then(() => setLaeuft(id)).catch(() => setLaeuft(null));
  };
  const spiele = (art) => {
    klangEinstellen({ ein: true, lautstaerke: staerke });
    klang(art);
    setZuletzt(art);
  };
  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(120% 90% at 50% -10%, ${T.bg2} 0%, #0a0812 70%)`,
      color: "#e8e2cf", fontFamily: "system-ui, sans-serif", padding: "18px 14px 60px" }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <div className="gg-serif" style={{ fontSize: 22, color: T.goldBright, letterSpacing: ".05em" }}>Die Klangwerkstatt</div>
        <div style={{ fontSize: 12.5, color: T.dim, marginTop: 4, lineHeight: 1.5 }}>
          Jeder Knopf ruft dieselbe Klangschicht wie das Spiel — gleiche Pegel, gleiche
          Tonhöhenstreuung. Mehrfach tippen wechselt die Varianten. Der Regler hier ist
          nur fürs Abhören und ändert das Profil nicht.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0 4px" }}>
          <span className="gg-serif" style={{ fontSize: 12, letterSpacing: ".1em", color: T.dim }}>ABHÖRPEGEL</span>
          <input type="range" min="0" max="1" step="0.05" value={staerke}
            onChange={(e) => { const v = Number(e.target.value); setStaerke(v); klangEinstellen({ ein: true, lautstaerke: v }); }}
            style={{ flex: 1, accentColor: T.gold }} />
          <span style={{ fontSize: 12, width: 34, textAlign: "right", color: T.goldBright }}>{Math.round(staerke * 100)}%</span>
          <button onClick={() => klangVorwaermen()} style={{ fontFamily: "inherit", fontSize: 11.5, cursor: "pointer",
            background: "none", border: `1px solid ${T.line}`, borderRadius: 8, color: T.dim, padding: "5px 9px" }}>
            Vorwärmen</button>
        </div>
        {GRUPPEN.map(([titel, reihe]) => (
          <div key={titel} style={{ marginTop: 18 }}>
            <div className="gg-serif" style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase",
              color: T.goldBright, marginBottom: 8 }}>{titel}</div>
            <div style={{ display: "grid", gap: 7 }}>
              {reihe.map(([art, name, was]) => (
                <button key={art} onClick={() => spiele(art)}
                  style={{ display: "flex", alignItems: "center", gap: 11, textAlign: "left", cursor: "pointer",
                    fontFamily: "inherit", color: "inherit", width: "100%",
                    background: zuletzt === art
                      ? "linear-gradient(165deg, rgba(240,206,122,.14), rgba(20,14,34,.6))"
                      : "linear-gradient(165deg, rgba(30,22,52,.55), rgba(14,10,24,.6))",
                    border: `1px solid ${zuletzt === art ? T.gold + "aa" : "rgba(167,139,250,.28)"}`,
                    borderRadius: 12, padding: "10px 12px" }}>
                  <span aria-hidden style={{ flex: "0 0 auto", width: 30, height: 30, display: "grid", placeItems: "center",
                    borderRadius: 999, border: `1.5px solid ${T.gold}88`, color: T.goldBright, fontSize: 13 }}>▶</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 13.5, fontWeight: 800, color: "#efe7c8" }}>{name}</span>
                    <span className="gg-serif" style={{ display: "block", fontSize: 11.5, color: T.dim, fontStyle: "italic", marginTop: 2 }}>{was}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
        <div style={{ marginTop: 24 }}>
          <div className="gg-serif" style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase",
            color: T.goldBright, marginBottom: 8 }}>Die Bereichsmusik</div>
          <div className="gg-serif" style={{ fontSize: 11.5, color: T.dim, fontStyle: "italic", marginBottom: 9 }}>
            Ein Stück nach dem anderen — erneut tippen hält an. Im Spiel blenden sie in neun Sekunden ineinander.
          </div>
          <div style={{ display: "grid", gap: 7 }}>
            {STUECKE.map(([id, name, url, was]) => (
              <button key={id} onClick={() => musik(id, url)}
                style={{ display: "flex", alignItems: "center", gap: 11, textAlign: "left", cursor: "pointer",
                  fontFamily: "inherit", color: "inherit", width: "100%",
                  background: laeuft === id
                    ? "linear-gradient(165deg, rgba(240,206,122,.16), rgba(20,14,34,.6))"
                    : "linear-gradient(165deg, rgba(30,22,52,.55), rgba(14,10,24,.6))",
                  border: `1px solid ${laeuft === id ? T.gold + "aa" : "rgba(167,139,250,.28)"}`,
                  borderRadius: 12, padding: "10px 12px" }}>
                <span aria-hidden style={{ flex: "0 0 auto", width: 30, height: 30, display: "grid", placeItems: "center",
                  borderRadius: 999, border: `1.5px solid ${T.gold}88`, color: T.goldBright, fontSize: 13 }}>
                  {laeuft === id ? "❚❚" : "▶"}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13.5, fontWeight: 800, color: "#efe7c8" }}>{name}</span>
                  <span className="gg-serif" style={{ display: "block", fontSize: 11.5, color: T.dim, fontStyle: "italic", marginTop: 2 }}>{was}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <a href="/" style={{ display: "inline-block", marginTop: 22, fontSize: 12.5, color: T.dim }}>‹ Zurück ins Spiel</a>
      </div>
    </div>
  );
}
