// ── DIE AKADEMIE ────────────────────────────────────────────────────────────
// Auftrag des Besitzers (v0.50): ein Lernhaus mit Reitern wie im Hofstaat -
// REGELN (Schach samt der neuen Sonderzuege), FIGUREN (die klassischen sechs
// und die Hausfiguren), SPIELWEISE (HP, Energie, Ausruestung, Kampagne und
// vor allem der HOFWERT samt seiner Online-Bedeutung), CHRONIK (dieselbe
// Stimme wie im Hofstaat, hier eingebettet) und der SCHNELLKURS (die alte
// Zwei-Minuten-Akademie, unveraendert). Alle Texte kommen aus EINEM
// Datensatz (src/content/lehren.js), den spaeter auch die Erstbesuch-Popups
// der Menues lesen - Kurz- und Langfassung laufen nie auseinander.
import { useState } from "react";
import { T } from "../theme.js";
import { Segmented } from "../primitives.jsx";
import { GoldRule } from "../Gilded.jsx";
import { LEHREN } from "../../../content/lehren.js";
import { ChroniclePanel } from "./ArmyScreen.jsx";
import { TutorialScreen } from "./TutorialScreen.jsx";

function Lehrtafel({ eintrag }) {
  return (
    <div style={{ background: `linear-gradient(170deg, ${T.panel2}, ${T.panel})`,
      border: `1px solid ${T.line}`, borderRadius: T.radius, padding: "12px 14px" }}>
      <div className="gg-serif" style={{ fontSize: 15.5, color: T.gold, letterSpacing: ".04em", marginBottom: 6 }}>
        {eintrag.sym ? <span style={{ marginRight: 8, fontSize: 18 }}>{eintrag.sym}</span> : null}
        {eintrag.titel}
      </div>
      {eintrag.text.split("\n\n").map((abs, i) => (
        <div key={i} style={{ fontSize: 12.5, lineHeight: 1.62, color: T.text, marginTop: i ? 8 : 0 }}>{abs}</div>
      ))}
    </div>
  );
}

export function AkademieScreen({ profile, t, en = false, account = null, onDone }) {
  const [tab, setTab] = useState("regeln");
  const L = LEHREN[en ? "en" : "de"];
  const liste = tab === "regeln" ? L.regeln : tab === "figuren" ? L.figuren : tab === "spielweise" ? L.spielweise : null;
  return (
    <div style={{ display: "grid", gap: 12, paddingTop: 8 }}>
      <Segmented value={tab} onChange={setTab} options={[
        { value: "regeln", label: en ? "Rules" : "Regeln" },
        { value: "figuren", label: en ? "Pieces" : "Figuren" },
        { value: "spielweise", label: en ? "Playstyle" : "Spielweise" },
        { value: "chron", label: en ? "Chronicle" : "Chronik" },
        { value: "kurs", label: en ? "Crash course" : "Schnellkurs" },
      ]} />
      {liste && (
        <div style={{ display: "grid", gap: 10 }}>
          {tab === "spielweise" && (
            <div style={{ fontSize: 11.5, color: T.dim, lineHeight: 1.55, padding: "0 2px" }}>
              {en ? "How this game grows beyond chess — and what your court value means."
                  : "Wie dieses Spiel über das Schach hinauswächst — und was dein Hofwert bedeutet."}
            </div>
          )}
          {liste.map((e) => <Lehrtafel key={e.id} eintrag={e} />)}
        </div>
      )}
      {tab === "chron" && <ChroniclePanel profile={profile} t={t} en={en} account={account} />}
      {tab === "kurs" && (
        <div style={{ display: "grid", gap: 10 }}>
          <GoldRule />
          <TutorialScreen t={t} en={en} onDone={() => setTab("regeln")} />
        </div>
      )}
    </div>
  );
}
