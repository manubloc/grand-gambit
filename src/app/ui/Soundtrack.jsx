// ── DER SOUNDTRACK ───────────────────────────────────────────────────────────
// v0.80: aus EINER Endlosschleife werden FUENF BEREICHSSTUECKE mit weicher
// Ueberblendung (zwei Spieler, 1,8 s Kreuzblende). Die Regeln von damals
// gelten weiter:
//
//  1. KEIN BROWSER SPIELT UNGEFRAGT. Die Musik wartet auf die erste
//     Beruehrung und beginnt dann leise.
//  2. DIE ENTSCHEIDUNG GEHOERT DEM SPIELER. Abschaltbar im Profil; die Wahl
//     bleibt und gilt beim naechsten Start weiter.
//  3. SANFT EIN, SANFT AUS - und im Hintergrund schweigt alles.
//
// Die Stuecke sind ueber die Musikregie (musik.js) angebunden: App meldet
// menue/karte, die Partie meldet kampf/kampfSpannung/meister. Alle fuenf sind
// auf die Lautheit des alten Soundtracks gebracht (-21,3 dBFS RMS) - kein
// Stueck springt lauter heraus als das andere.
import { useEffect, useRef } from "react";
import { musikAbo, musikAktuell } from "./musik.js";
import spurMenue from "./assets/audio/musik-menue.mp3";
import spurKarte from "./assets/audio/musik-karte.mp3";
import spurKampf from "./assets/audio/musik-kampf-ruhig.mp3";
import spurSpannung from "./assets/audio/musik-kampf-spannung.mp3";
import spurMeister from "./assets/audio/musik-meister.mp3";

const SPUREN = { menue: spurMenue, karte: spurKarte, kampf: spurKampf,
  kampfSpannung: spurSpannung, meister: spurMeister };
const LAUT = 0.34;          // Zielpegel: unter dem Spiel, nie darueber
/* v0.81 (Besitzer): "viel sanfter" - die Kreuzblende dauert jetzt SECHS
   Sekunden statt 1,8, und sie laeuft NACHEINANDER statt gleichzeitig: erst
   sinkt das alte Stueck ueber 3,4 s ins Nichts, dann steigt das neue ueber
   4,6 s herauf (mit 2,2 s Ueberlappung). So gibt es keinen Moment, in dem
   zwei Melodien gleich laut gegeneinander stehen - genau das erzeugt sonst
   den harten Eindruck. Die Blende folgt zudem einer weichen Kurve statt
   einer Geraden: leise Passagen brauchen laenger, damit das Ohr den Wechsel
   nicht als Sprung liest. */
/* v0.83: noch laenger und noch sanfter (zweite Bitte des Besitzers). Neun
   Sekunden Gesamtblende - das alte Stueck sinkt fuenf Sekunden lang, das neue
   steigt sieben, und es beginnt erst nach zwei Sekunden. Dazu sind Menue- und
   Kartenthema jetzt GESCHWISTER: dieselbe Besetzung (Cello, Gambe, Laute,
   Blockfloete), dieselbe Tonart (d-Moll), dasselbe Tempo (84) - nur die
   Haltung wechselt von ruhend zu wandernd. Ein harter Schnitt ist damit
   nicht mehr moeglich, weil es nichts Hartes mehr zu schneiden gibt. */
const BLENDE_AUS_MS = 5000; // das alte Stueck sinkt
const BLENDE_EIN_MS = 7000; // das neue steigt
const VERZUG_MS = 2000;     // ... und beginnt erst, wenn das alte schon leiser ist
const SCHRITT_MS = 50;

export function Soundtrack({ an = true }) {
  const spieler = useRef([null, null]);   // zwei <audio>, es blendet immer der eine in den anderen
  const aktiv = useRef(0);                // Index des gerade tragenden Spielers
  const timer = useRef([null, null]);
  const frei = useRef(false);             // hat der Browser Ton erlaubt?
  const anRef = useRef(an);
  anRef.current = an;

  // Die beiden Spieler leben genau einmal.
  useEffect(() => {
    spieler.current = [0, 1].map(() => {
      const a = new Audio();
      a.loop = true; a.preload = "auto"; a.volume = 0;
      return a;
    });
    return () => { spieler.current.forEach((a) => { if (a) { a.pause(); a.src = ""; } }); spieler.current = [null, null]; };
  }, []);

  const fahre = (i, ziel, dauer) => {
    const a = spieler.current[i];
    if (!a) return;
    if (timer.current[i]) clearInterval(timer.current[i]);
    const von = a.volume, schritte = Math.max(1, Math.round(dauer / SCHRITT_MS));
    let k = 0;
    timer.current[i] = setInterval(() => {
      k++;
      const s = spieler.current[i];
      if (!s) { clearInterval(timer.current[i]); return; }
      // weiche Kurve (kosinus) statt Gerade - das Ohr hoert Lautheit nicht linear
      const t = Math.min(1, k / schritte);
      const w = 0.5 - 0.5 * Math.cos(Math.PI * t);
      s.volume = Math.max(0, Math.min(1, von + (ziel - von) * w));
      if (k >= schritte) { clearInterval(timer.current[i]); timer.current[i] = null; if (ziel === 0) s.pause(); }
    }, SCHRITT_MS);
  };

  // Der Kern: auf den gewuenschten Bereich WECHSELN - weich, nie doppelt.
  const wechsle = (name, blende = 0) => {
    const url = SPUREN[name] || SPUREN.menue;
    const alt = spieler.current[aktiv.current];
    if (!alt) return;
    const kennung = url.split("/").pop();
    // laeuft das Stueck schon (oder ist bestellt), gibt es nichts zu tun
    if (alt.src && alt.src.endsWith(kennung)) {
      if (frei.current && anRef.current && alt.paused && !document.hidden)
        alt.play().then(() => fahre(aktiv.current, LAUT, 900)).catch(() => {});
      return;
    }
    const naechster = 1 - aktiv.current;
    const neu = spieler.current[naechster];
    if (!neu) return;
    neu.src = url;
    aktiv.current = naechster;
    if (!frei.current || !anRef.current || document.hidden) return;   // startet spaeter, mit dem Freibrief
    // erst das alte sinken lassen, das neue kommt verzoegert und langsamer nach
    fahre(1 - naechster, 0, blende ? Math.round(blende * 0.57) : BLENDE_AUS_MS);
    neu.volume = 0;
    neu.play().then(() => {
      setTimeout(() => {
        if (aktiv.current === naechster && anRef.current && !document.hidden)
          fahre(naechster, LAUT, blende ? Math.round(blende * 0.77) : BLENDE_EIN_MS);
      }, blende ? Math.round(blende * 0.2) : VERZUG_MS);
    }).catch(() => {});
  };

  useEffect(() => {
    // Erstbestueckung + Abo auf die Regie
    wechsle(musikAktuell(), 1500);
    const ab = musikAbo((b) => wechsle(b));

    const starte = () => {
      if (frei.current) return;
      frei.current = true;
      if (!anRef.current) return;
      const a = spieler.current[aktiv.current];
      if (a && a.src) a.play().then(() => fahre(aktiv.current, LAUT, 2000)).catch(() => { frei.current = false; });
    };
    const ereignisse = ["pointerdown", "keydown", "touchstart"];
    ereignisse.forEach((e) => window.addEventListener(e, starte, { passive: true }));

    const sicht = () => {
      const a = spieler.current[aktiv.current];
      if (!a) return;
      if (document.hidden) { fahre(0, 0, 300); fahre(1, 0, 300); }
      else if (anRef.current && frei.current && a.src) a.play().then(() => fahre(aktiv.current, LAUT, 900)).catch(() => {});
    };
    document.addEventListener("visibilitychange", sicht);
    return () => {
      ab();
      ereignisse.forEach((e) => window.removeEventListener(e, starte));
      document.removeEventListener("visibilitychange", sicht);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Der Schalter im Profil
  useEffect(() => {
    if (!an) { fahre(0, 0, 500); fahre(1, 0, 500); return; }
    const a = spieler.current[aktiv.current];
    if (a && frei.current && a.src) a.play().then(() => fahre(aktiv.current, LAUT, 1200)).catch(() => {});
  }, [an]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;   // der Klang braucht keine Gestalt
}
