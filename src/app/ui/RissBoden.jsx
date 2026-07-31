// ── DER RISSBODEN ───────────────────────────────────────────────────────────
// Wunsch des Besitzers (v0.46): hinter jedem Menue liegt UNTEN FIXIERT ein
// Schachboden, durch den sich ein violetter Riss zieht - und je weiter der
// Spieler kommt (Hofwert + Kampagne), desto weiter reisst er auf. Zehn
// Stufen: 1 = ungebrochener Boden, 10 = der Riss steht offen und leuchtet.
//
// Bauart: EIN Bild, unten am Bildschirm verankert, hinter allem (zIndex -1),
// oben in reines Schwarz auslaufend, damit Kopfleiste und Karten ruhig
// bleiben. Kein Dauereffekt, keine Animation - der Boden liegt einfach da.
import { useMemo } from "react";
import { clearedCount, campaignLength } from "../../meta/campaign.js";

// KEIN import.meta.glob: die Rauchprobe (npm run smoke) buendelt mit esbuild
// im Node-Ziel, und dort gibt es glob nicht - der Lauf starb mit
// "(intermediate value).glob is not a function", noch bevor eine Suite lief.
// Zehn gewoehnliche Importe kosten nichts und laufen ueberall.
import riss01 from "./assets/riss/riss-01.webp";
import riss02 from "./assets/riss/riss-02.webp";
import riss03 from "./assets/riss/riss-03.webp";
import riss04 from "./assets/riss/riss-04.webp";
import riss05 from "./assets/riss/riss-05.webp";
import riss06 from "./assets/riss/riss-06.webp";
import riss07 from "./assets/riss/riss-07.webp";
import riss08 from "./assets/riss/riss-08.webp";
import riss09 from "./assets/riss/riss-09.webp";
import riss10 from "./assets/riss/riss-10.webp";
const STUFEN = [riss01, riss02, riss03, riss04, riss05, riss06, riss07, riss08, riss09, riss10];

/** Welche Stufe steht dem Spieler zu? Zwei Quellen, je zur Haelfte:
 *  der HOFWERT (wie viele Figuren stehen im Hofstaat) und die KAMPAGNE
 *  (wie viel des Weges ist geraeumt). Beide 0..1, gemittelt, auf 1..10
 *  abgebildet - so waechst der Riss auch, wenn nur eine Seite vorankommt. */
export function rissStufe(profile) {
  if (!profile) return 1;
  const hof = (profile.campaign?.unlocked || []).length;
  const hofAnteil = Math.min(1, hof / 14);          // 14 Gefaehrten = voll
  const weg = campaignLength(profile) || 1;
  const wegAnteil = Math.min(1, clearedCount(profile) / weg);
  const misch = (hofAnteil + wegAnteil) / 2;
  return Math.max(1, Math.min(STUFEN.length, 1 + Math.round(misch * (STUFEN.length - 1))));
}

export function RissBoden({ profile, staerke = 1 }) {
  const stufe = useMemo(() => rissStufe(profile), [profile]);
  const bild = STUFEN[stufe - 1];
  if (typeof document !== "undefined") document.documentElement.dataset.rissDiag = "stufen=" + STUFEN.length + " stufe=" + stufe + " bild=" + (bild ? "ja" : "nein");
  if (!bild) return null;
  return (
    // DESKTOP-DECKEL (Besitzer, v0.64.1): auf breiten Schirmen blies "cover"
    // das Bild auf volle Fensterbreite - viel zu gross. Jetzt: der Boden ist
    // ein ZENTRIERTES BAND von hoechstens 1280 px, und links wie rechts
    // laeuft das Bild in einem weichen Verlauf ins Schwarze aus. Der alte
    // Hoch-Verlauf bleibt; beide Masken schneiden sich (mask-composite).
    <div aria-hidden data-riss={stufe} style={{
      position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none",
      height: "min(30vh, 270px)", // v0.60: kurzer Bodenstreifen statt halber Schirm
      // Der Desktop-Shell-Zoom (theme.js: #root zoom 1.15/1.3 ab 1440/1760 px)
      // multipliziert Layout-Pixel - 1280 wurden sichtbar 1472. Gegenrechnung
      // ueber die --vhz-Variable: das Band ist auf JEDEM Schirm sichtbar
      // hoechstens 1280 px breit.
      maxWidth: "calc(1280px / var(--vhz, 1))", margin: "0 auto",
      backgroundImage: `url(${bild})`,
      backgroundSize: "cover",
      backgroundPosition: "50% 100%",
      backgroundRepeat: "no-repeat",
      opacity: 0.6 * staerke,      // v0.60: schimmert dezenter durch
      WebkitMaskImage:
        "linear-gradient(180deg, transparent 0%, rgba(0,0,0,.55) 30%, #000 58%), " +
        "linear-gradient(90deg, transparent 0%, #000 clamp(48px, 9%, 130px), #000 calc(100% - clamp(48px, 9%, 130px)), transparent 100%)",
      maskImage:
        "linear-gradient(180deg, transparent 0%, rgba(0,0,0,.55) 30%, #000 58%), " +
        "linear-gradient(90deg, transparent 0%, #000 clamp(48px, 9%, 130px), #000 calc(100% - clamp(48px, 9%, 130px)), transparent 100%)",
      WebkitMaskComposite: "source-in",
      maskComposite: "intersect",
    }} />
  );
}
