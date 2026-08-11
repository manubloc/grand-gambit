/* ── DIE ANIMATIONSKAMMER (v1.0.67, Besitzerauftrag) ────────────────────────
 * "die Möglichkeit, die Animationen an- und auszuschalten - in dieser
 *  Animationskammer, die Du mir vielleicht einfach noch on top baust."
 *
 * Ein Werkzeug hinter dem Torschloss (?animkammer), nach dem Muster der
 * Schaukammer: es zeigt das REGISTER aus anim.js - die eine Liste aller
 * Bewegungen des Spiels - und fuehrt jede auf einer kleinen Buehne vor.
 * Antippen spielt sie erneut. Oben der Schalter, der ALLES stellt; er
 * schreibt in den Geraetespeicher, dieselbe Stelle, die das Spiel liest.
 *
 * Die Buehnen bauen jede Animation aus denselben Keyframes nach, die auch
 * das Spiel benutzt (theme.js) - die Kammer zeigt also das Echte, keine
 * Attrappe. Was hier fehlt, faellt in test_anim.mjs durch: Register und
 * Buehnenliste muessen deckungsgleich sein.
 */
import { useState } from "react";
import { T } from "./theme.js";
import { ANIMATIONEN, animAn, setAnimAn } from "./anim.js";
import { GoldCoin } from "./icons.jsx";

const GOLD = "rgba(233,207,138,";

/* Eine kleine Buehne je Registereintrag. nochmal erzwingt per key den
   Neustart der CSS-Animation - derselbe Griff wie beim Stufenglanz. */
function Buehne({ id, takt }) {
  const s = { position: "absolute", pointerEvents: "none" };
  switch (id) {
    case "schweif": return <>
      <span style={{ ...s, left: "12%", top: "68%", width: "64%", height: 4, borderRadius: 9,
        background: `linear-gradient(90deg, ${GOLD}0) 0%, ${GOLD}.72) 100%)`, transform: "rotate(-24deg)", transformOrigin: "0 50%" }} />
      <span style={{ ...s, left: "12%", top: "68%", width: "64%", height: 1.6, borderRadius: 9,
        background: "linear-gradient(90deg, rgba(255,246,220,0) 0%, rgba(255,246,220,.9) 100%)", transform: "rotate(-24deg)", transformOrigin: "0 50%" }} />
      <span style={{ ...s, left: "66%", top: "38%", width: 22, height: 22, borderRadius: "50%",
        border: `1.5px solid ${GOLD}1)`, animation: "ggZielGlut .8s ease-out both" }} />
    </>;
    case "einschlag": return <>
      <span style={{ ...s, inset: "26%", borderRadius: 10, border: "2px solid rgba(255,246,220,.85)",
        "--sx": "0%", "--sy": "-8%", animation: "ggStoss .5s ease-out both" }} />
      <span style={{ ...s, left: "18%", top: "46%", width: "64%", height: 7, borderRadius: 9,
        background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,250,230,.95), rgba(255,255,255,0))",
        animation: "ggKlinge .55s ease-out .35s both" }} />
      <span style={{ ...s, inset: "30%", display: "grid", placeItems: "center" }}>
        <span style={{ width: "100%", height: "100%", borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,240,200,.9) 0%, ${GOLD}.5) 42%, ${GOLD}0) 70%)`,
          animation: "ggFunken .5s ease-out .7s both" }} /></span>
    </>;
    case "feuer": return <span style={{ ...s, left: "8%", top: "50%", width: "78%", height: 16,
      transform: "translateY(-50%)", transformOrigin: "0 50%" }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: 99, filter: "blur(1px)", transformOrigin: "0 50%",
        background: "linear-gradient(90deg, rgba(255,120,40,0) 0%, rgba(255,150,50,.85) 18%, rgba(255,220,120,.95) 55%, rgba(255,240,180,.9) 100%)",
        animation: "ggFeuer .9s ease-out both" }} /></span>;
    case "atmen": return <span style={{ ...s, inset: 0, display: "grid", placeItems: "center",
      fontSize: 34, animation: "ggAtmen 4.6s ease-in-out infinite" }}>♟</span>;
    case "schach": return <span style={{ ...s, inset: "22%", borderRadius: 10,
      border: "2.5px solid rgba(255,92,92,.9)", animation: "ggSchachPuls 1.05s ease-in-out infinite" }} />;
    case "matt": return <span style={{ ...s, inset: 0, display: "grid", placeItems: "center",
      fontSize: 34, transformOrigin: "58% 92%", animation: "ggKoenigFall 1.15s ease-in .2s both" }}>♚</span>;
    case "stufe": return <span style={{ ...s, inset: 0, display: "grid", placeItems: "center",
      fontSize: 26, color: T.gold, textShadow: `0 0 12px ${GOLD}.95)`,
      animation: "ggStufenStern 1.05s ease-out both" }}>✦</span>;
    case "muenzen": return <>
      {[0, 1, 2, 3, 4].map((m) => <span key={m} style={{ ...s, left: `${16 + m * 15}%`, top: "34%",
        animation: `ggMuenzFall ${(0.9 + (m % 3) * 0.22).toFixed(2)}s ease-in ${(m * 0.14).toFixed(2)}s both` }}>
        <GoldCoin size={13} /></span>)}
      <span style={{ ...s, left: 0, right: 0, bottom: "16%", textAlign: "center", fontWeight: 900,
        color: T.gold, fontSize: 15 }}>+{takt % 2 ? 240 : 180}</span>
    </>;
    case "beute": return <>{[0, 1, 2].map((m) => <span key={m} style={{ ...s, left: "16%", right: "16%",
      top: `${22 + m * 22}%`, height: 12, borderRadius: 7, background: "rgba(233,207,138,.25)",
      border: `1px solid ${GOLD}.5)`, animation: `ggAuftritt .5s ease-out ${(m * 0.14).toFixed(2)}s both` }} />)}</>;
    case "glanz": return <span style={{ ...s, inset: "14%", borderRadius: 10, overflow: "hidden",
      border: `1px solid ${GOLD}.4)` }}>
      <span style={{ position: "absolute", top: "-8%", bottom: "-8%", width: "34%",
        background: "linear-gradient(105deg, rgba(255,246,214,0), rgba(255,246,214,.85), rgba(255,246,214,0))",
        animation: "ggGlanzLauf 1.15s ease-out both" }} /></span>;
    default: return null;
  }
}

export function AnimKammerScreen() {
  const [an, setAn] = useState(animAn());
  const [takt, setTakt] = useState(1);   // key: jedes Antippen spielt alles neu
  const gruppen = [...new Set(ANIMATIONEN.map((a) => a.bereich))];
  const NAME = { brett: "Auf dem Brett", belohnung: "Sieg & Belohnung", figuren: "Im Figurenblatt" };
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, padding: "18px 14px 40px",
      maxWidth: 560, margin: "0 auto", fontFamily: "inherit" }}>
      <div className="gg-serif" style={{ fontSize: 21, fontWeight: 800, marginBottom: 2 }}>Animationskammer</div>
      <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.55, marginBottom: 14 }}>
        Jede Bewegung, die das Spiel zeigt, steht hier — aus dem Register in <code>anim.js</code>,
        vorgeführt mit denselben Keyframes, die auch das Spiel benutzt. Antippen spielt eine Bühne neu.
      </div>
      <button onClick={() => { setAnimAn(!an); setAn(!an); }}
        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 14px",
          borderRadius: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 800, fontSize: 14,
          background: an ? "linear-gradient(180deg, rgba(227,192,122,.26), rgba(227,192,122,.12))" : T.bg2,
          border: an ? "1px solid rgba(227,192,122,.6)" : `1px solid ${T.line}`,
          color: an ? T.gold : T.dim, marginBottom: 6 }}>
        <span style={{ width: 34, height: 20, borderRadius: 99, position: "relative", flex: "0 0 auto",
          background: an ? T.gold : "#3a4058", transition: "background .2s" }}>
          <span style={{ position: "absolute", top: 2, left: an ? 16 : 2, width: 16, height: 16,
            borderRadius: "50%", background: "#0d1017", transition: "left .2s" }} /></span>
        Animationen {an ? "an" : "aus"}
      </button>
      <div style={{ fontSize: 11.5, color: T.faint, lineHeight: 1.5, marginBottom: 16 }}>
        Gilt für dieses Gerät und wirkt überall — Brett, Banner, Figurenblatt. Wer im Betriebssystem
        „Bewegung reduzieren" gewählt hat, startet mit aus; diese Wahl hier sticht danach.
      </div>
      {gruppen.map((gr) => <div key={gr} style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, margin: "0 0 8px" }}>{NAME[gr] || gr}</div>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
          {ANIMATIONEN.filter((a) => a.bereich === gr).map((a) => (
            <button key={a.id} data-anim={a.id} onClick={() => setTakt((n) => n + 1)}
              style={{ textAlign: "left", cursor: "pointer", fontFamily: "inherit", padding: 0,
                background: "linear-gradient(170deg, rgba(26,30,46,.7), rgba(12,14,24,.85))",
                border: `1px solid ${T.line}`, borderRadius: 12, color: T.text, overflow: "hidden" }}>
              <span key={takt} style={{ display: "block", position: "relative", height: 84,
                background: "radial-gradient(ellipse at 50% 60%, rgba(30,26,52,.8), rgba(8,7,15,.95))",
                opacity: an ? 1 : 0.35 }}>
                <Buehne id={a.id} takt={takt} />
              </span>
              <span style={{ display: "block", padding: "8px 10px 10px" }}>
                <span style={{ display: "block", fontSize: 12.5, fontWeight: 800 }}>{a.name}</span>
                <span style={{ display: "block", fontSize: 10.5, color: T.dim, lineHeight: 1.45, marginTop: 3 }}>{a.was}</span>
              </span>
            </button>
          ))}
        </div>
      </div>)}
      <div style={{ fontSize: 11, color: T.faint, lineHeight: 1.5 }}>
        Alles hier arbeitet nur mit <code>transform</code> und <code>opacity</code> — die beiden Kanäle,
        die der Grafikkern ohne Neuaufbau bewegt (Ruckel-Lehre aus v1.0.37/41).
      </div>
    </div>
  );
}
