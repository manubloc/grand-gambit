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

/** Welche Stufe steht dem Spieler zu?
 *
 *  v1.0.4, ZWEI BESITZERFUNDE:
 *
 *  (a) "wenn ich per Werkbank alles freischalte, zeigst du mir wenn ueberhaupt
 *      die 4. oder 5. Stufe." Zu Recht: seit v0.66 zaehlte AUSSCHLIESSLICH das
 *      Kapitel. Wer den Hof fuellt, Stationen raeumt oder den Weg-Regler der
 *      Werkbank aufdreht, ohne das Kapitel zu wechseln, blieb auf seiner
 *      Stufe stehen. Jetzt zaehlt die STAERKSTE der drei Quellen - Kapitel,
 *      geraeumter Weg, Hofstaat -, also jeder Weg nach vorn.
 *
 *  (b) "bitte passe an, dass der Riss einfach frueher entsteht." Nachgesehen
 *      liegt der erste sichtbare Funke bei Bild 2-4, ein wirklicher Riss erst
 *      ab Bild 5 - linear abgebildet passierte bis zur Haelfte des Spiels
 *      also fast nichts. Eine Wurzelkurve (Exponent 0,55) zieht den Anfang
 *      nach vorn: Kapitel 2 zeigt schon Stufe 4, Kapitel 3 die Stufe 5 mit
 *      dem ersten echten Riss, und die letzten Stufen bleiben trotzdem dem
 *      Ende vorbehalten.
 */
export function rissStufe(profile) {
  if (!profile) return 1;
  const c = profile.campaign || {};
  const lg = Math.max(1, c.league || 1);
  // Der Weg im LAUFENDEN Kapitel (campaign.cleared wird beim Kapitelwechsel
  // geleert, s. advanceLeague) - so entsteht eine durchgehende Zahl statt
  // einer Treppe, die beim Kapitelende auf 1 springt und dort haengt.
  const laenge = campaignLength(profile);
  const imKapitel = laenge > 0 ? Math.min(1, clearedCount(profile) / laenge) : 0;
  const kapitelWeg = (lg - 1 + imKapitel) / 9;      // Kapitel 10 = voll
  const hof = (c.unlocked || []).length / 27;        // der ganze Hofstaat
  const roh = Math.max(0, Math.min(1, Math.max(kapitelWeg, hof)));
  const stufe = 1 + Math.round((STUFEN.length - 1) * Math.pow(roh, 0.55));
  return Math.max(1, Math.min(STUFEN.length, stufe));
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
      /* v1.0.53 (Besitzerbefund): "als wuerde er darueber sein". Genau das
         tat er. Der Kommentar oben verspricht seit jeher "hinter allem
         (zIndex -1)", der Code stand aber auf 0 - und weil der Boden im DOM
         VOR dem Menueinhalt steht, aber auf gleicher Stapelhoehe liegt,
         entschied allein die Reihenfolge. Beim Scrollen schob sich der
         fixierte Streifen sichtbar ueber die Figurenkacheln.
         Jetzt -1: er liegt wirklich dahinter, so wie es immer gemeint war. */
      position: "fixed", left: 0, right: 0, bottom: 0, zIndex: -1, pointerEvents: "none",
      height: "min(24vh, 210px)", // v1.0.53: kuerzer - er soll grundieren, nicht mitreden
      // Der Desktop-Shell-Zoom (theme.js: #root zoom 1.15/1.3 ab 1440/1760 px)
      // multipliziert Layout-Pixel - 1280 wurden sichtbar 1472. Gegenrechnung
      // ueber die --vhz-Variable: das Band ist auf JEDEM Schirm sichtbar
      // hoechstens 1280 px breit.
      maxWidth: "calc(1280px / var(--vhz, 1))", margin: "0 auto",
      backgroundImage: `url(${bild})`,
      backgroundSize: "cover",
      backgroundPosition: "50% 100%",
      backgroundRepeat: "no-repeat",
      opacity: 0.46 * staerke,     // v1.0.53: leiser, er stand zu weit vorn
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
