// The academy — a skippable, step-through tutorial in the world's own voice:
// parchment cards, drawn glyphs, one idea per step. Reachable from the hub,
// never forced; "skip" is always one tap away.
import { useState } from "react";
import { T } from "../theme.js";
import { Button } from "../primitives.jsx";
import { PieceArt } from "../board/PieceArt.jsx";
import { ItemIcon } from "../ItemIcon.jsx";
import { SkullIc, BladesIc, HourglassIc, SkillStar, GoldCoin } from "../icons.jsx";

const STEPS = [
  {
    de: { title: "Das Spiel", text: "Grand Gambit ist Schach mit Herz: Jede Figur hat Lebenspunkte ♥ und Angriff ⚔. Wer eine Figur angreift, richtet Schaden an — erst wenn die Herzen fallen, verlässt sie das Brett. Der Grand Gambit selbst, der goldene Bauer, ist der Held der Geschichte." },
    en: { title: "The game", text: "Grand Gambit is chess with a heartbeat: every piece carries hearts ♥ and attack ⚔. Attacking deals damage — a piece only leaves the board once its hearts run out. The Grand Gambit himself, the golden pawn, is the hero of the tale." },
    art: <div style={{ width: 64, height: 64 }}><PieceArt kind="P" fill="#c9a45c" rim="#f0dfae" detail="#59421a" size="100%" level={1} hero /></div>,
  },
  {
    de: { title: "Ziehen & Kämpfen", text: "Figuren ziehen wie im Schach. Ein Zug auf ein gegnerisches Feld ist ein Angriff: Dein ⚔ trifft seine ♥. Überlebt der Gegner, bleibst du stehen — überlege also, wen du wohin schickst. Der König muss immer geschützt bleiben." },
    en: { title: "Move & fight", text: "Pieces move as in chess. Stepping onto an enemy square is an attack: your ⚔ strikes their ♥. If the defender survives, you hold your ground — so choose your targets well. The king must always be kept safe." },
    art: <div style={{ display: "flex", gap: 6 }}><span style={{ fontSize: 26, color: "#58c98b", fontWeight: 800 }}>♥</span><span style={{ fontSize: 26, color: "#e3c07a", fontWeight: 800 }}>⚔</span></div>,
  },
  {
    de: { title: "Tränke & Zeitenwender", text: "In der Vorratstruhe warten Helfer: Der Lebenstrank heilt im Kampf eine Figur um 2 ♥ (kostet den Zug). Der Zeitenwender nimmt deinen letzten Zug zurück — jede Umkehr verbrennt eine Sanduhr. Beides wird mit Gold gekauft und ist begrenzt." },
    en: { title: "Draughts & time-turners", text: "The supply chest holds helpers: the healing draught restores 2 ♥ to a piece mid-battle (spends the turn). The time-turner takes back your last move — each reversal burns one hourglass. Both are bought with gold, both are scarce." },
    art: <div style={{ display: "flex", gap: 10, alignItems: "center" }}><ItemIcon id="potion" size={30} /><HourglassIc size={28} /></div>,
  },
  {
    de: { title: "Die Kampagne", text: "Die Karte führt durch vier Kapitel zur Ligafeste. An den Stationen warten Herausforderer — besiege sie und sie treten deinem Hofstaat bei. Nur die großen Bosse mit dem Totenkopf sind reine Ungeheuer. Manche Pfade sind verschlossen und wollen Gold oder Ausrüstung." },
    en: { title: "The campaign", text: "The map winds through four chapters to the League Keep. Challengers await at the stations — beat them and they join your court. Only the great skull-marked bosses are pure monsters. Some paths are barred and demand gold or gear." },
    art: <div style={{ display: "flex", gap: 12, alignItems: "center" }}><BladesIc size={26} /><SkullIc size={26} /></div>,
  },
  {
    de: { title: "Der Hofstaat", text: "Rekrutierte Figuren leveln mit Skillpunkten ⭐ und lernen Fähigkeiten. Stelle im Hofstaat deine Formation zusammen und wähle die Position des Grand Gambit. Besiegst du einen Herausforderer erneut, wendet er sich als Abtrünniger gegen dich — der Doppelsieg schenkt einen Stern ★." },
    en: { title: "The court", text: "Recruited pieces level up with skill points ⭐ and learn abilities. Arrange your formation in the court and choose the Grand Gambit's file. Beat a challenger a second time and they face you as a turncoat — the double victory grants a star ★." },
    art: <div style={{ display: "flex", gap: 10, alignItems: "center" }}><SkillStar size={26} /><span className="gg-serif" style={{ fontSize: 24, color: "#e3c07a" }}>★</span></div>,
  },
  {
    de: { title: "Gold & Truhe", text: "Jeder Sieg füllt die Schatzkammer. Gold öffnet Zollbrücken, kauft Ausrüstung und Tränke. Die Truhe enthüllt ihre Gegenstände erst nach und nach — was die Reise noch nicht erreicht hat, bleibt versiegelt." },
    en: { title: "Gold & chest", text: "Every victory fills the treasury. Gold opens toll bridges, buys gear and draughts. The chest reveals its wares one by one — whatever the journey has not reached stays under seal." },
    art: <GoldCoin size={30} />,
  },
  {
    de: { title: "Schnell & zu zweit", text: "Im Schnellen Spiel wartet die KI in drei Stufen — oder ihr spielt zu zweit an einem Gerät: Das Brett dreht sich nach jedem Zug zum Ziehenden. Online-Duelle mit Freunden gibt es obendrein. Und nun: Ein Reich wartet auf seinen Strategen." },
    en: { title: "Quick & together", text: "Quick play offers the AI in three tiers — or two players share one device: the board turns to face whoever moves. Online duels with friends await as well. And now: a realm awaits its strategist." },
    art: <div style={{ width: 56, height: 56 }}><PieceArt kind="K" fill="#c9a45c" rim="#f0dfae" detail="#59421a" size="100%" level={1} /></div>,
  },
];

export function TutorialScreen({ t, en, onDone }) {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const L = en ? step.en : step.de;
  const last = i === STEPS.length - 1;
  return (
    <div style={{ maxWidth: 460, margin: "0 auto" }}>
      <div style={{ background: "#efe9da", color: "#2e2a20", border: "1px solid #c9bfa4", borderRadius: 16,
        boxShadow: "0 14px 40px rgba(0,0,0,.45)", padding: "20px 18px 16px", textAlign: "center",
        animation: "rise .22s ease" }} key={i}>
        <div className="gg-serif" style={{ fontSize: 10.5, letterSpacing: ".22em", color: "#8a6f4d" }}>
          {(en ? "LESSON " : "LEKTION ")}{["I", "II", "III", "IV", "V", "VI", "VII"][i]} / VII
        </div>
        <div className="gg-serif" style={{ fontSize: 22, letterSpacing: ".04em", marginTop: 5 }}>{L.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "9px 0 12px" }}>
          <span style={{ flex: 1, height: 1, background: "#c9bfa4" }} />
          <span style={{ width: 6, height: 6, background: "#8a6f4d", transform: "rotate(45deg)" }} />
          <span style={{ flex: 1, height: 1, background: "#c9bfa4" }} />
        </div>
        <div style={{ display: "grid", placeItems: "center", minHeight: 66, marginBottom: 10 }}>{step.art}</div>
        <div className="gg-serif" style={{ fontSize: 13.5, lineHeight: 1.6, color: "#4a4433", textAlign: "left" }}>{L.text}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 5, margin: "14px 0 12px" }}>
          {STEPS.map((_, k) => (
            <span key={k} style={{ width: 6, height: 6, borderRadius: "50%", transform: "rotate(45deg)",
              background: k === i ? "#8a6f4d" : "#cfc5a8" }} />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: i > 0 ? "1fr 2fr" : "1fr", gap: 8 }}>
          {i > 0 && <button onClick={() => setI(i - 1)} style={{ padding: "11px 12px", borderRadius: 10, background: "none",
            border: "1px solid #c9bfa4", color: "#6f6752", fontWeight: 700, fontSize: 13.5, fontFamily: "inherit", cursor: "pointer" }}>
            ‹ {t("common.back")}</button>}
          <button onClick={() => (last ? onDone() : setI(i + 1))} style={{ padding: "11px 14px", borderRadius: 10,
            background: "#1d2436", color: "#e9e2cf", fontWeight: 800, fontSize: 14, border: "none", fontFamily: "inherit",
            cursor: "pointer", letterSpacing: ".04em" }}>{last ? t("tut.done") : t("tut.next")} ›</button>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <button onClick={onDone} style={{ background: "none", border: "none", color: T.dim, fontFamily: "inherit",
          fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>{t("tut.skip")}</button>
      </div>
    </div>
  );
}
