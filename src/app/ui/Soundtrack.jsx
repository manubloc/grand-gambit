// ── DER SOUNDTRACK ───────────────────────────────────────────────────────────
// Eine Melodie, endlos im Kreis. Drei Dinge waren dabei zu beachten:
//
//  1. KEIN BROWSER SPIELT UNGEFRAGT. Autoplay ist überall gesperrt, bis der
//     Mensch die Seite einmal berührt hat. Deshalb wartet die Schleife auf die
//     erste Berührung (Tippen, Klick, Taste) und beginnt dann leise.
//  2. DIE ENTSCHEIDUNG GEHÖRT DEM SPIELER. Der Klang lässt sich abschalten,
//     die Wahl bleibt im Profil und gilt beim nächsten Start weiter.
//  3. SANFT EIN, SANFT AUS. Ein harter Einsatz erschreckt; die Lautstärke
//     wandert über zwei Sekunden hinein und über eine halbe wieder hinaus.
//     Wandert der Spieler aus dem Fenster, verstummt sie ganz.
import { useEffect, useRef } from "react";
import spur from "./assets/audio/soundtrack.mp3";

const LAUT = 0.34;          // Zielpegel: soll unter dem Spiel liegen, nicht darüber
const EIN_MS = 2000;
const AUS_MS = 500;

export function Soundtrack({ an = true }) {
  const ref = useRef(null);
  const blende = useRef(null);

  // Das Element lebt genau einmal, sonst überlagern sich zwei Schleifen.
  useEffect(() => {
    const a = new Audio(spur);
    a.loop = true;
    a.preload = "auto";
    a.volume = 0;
    ref.current = a;
    return () => { a.pause(); a.src = ""; ref.current = null; };
  }, []);

  // sanftes Auf- und Abblenden
  const fahre = (ziel, dauer) => {
    const a = ref.current;
    if (!a) return;
    if (blende.current) clearInterval(blende.current);
    const von = a.volume, schritte = Math.max(1, Math.round(dauer / 50));
    let i = 0;
    blende.current = setInterval(() => {
      i++;
      const v = von + (ziel - von) * (i / schritte);
      a.volume = Math.max(0, Math.min(1, v));
      if (i >= schritte) {
        clearInterval(blende.current); blende.current = null;
        if (ziel === 0) a.pause();
      }
    }, 50);
  };

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    if (!an) { fahre(0, AUS_MS); return; }

    let losgelassen = false;
    const starte = () => {
      if (losgelassen || !ref.current) return;
      losgelassen = true;
      ref.current.play().then(() => fahre(LAUT, EIN_MS)).catch(() => { losgelassen = false; });
    };
    // erster Versuch sofort - klappt, wenn schon irgendwo getippt wurde
    starte();
    // sonst auf die erste Berührung warten
    const ereignisse = ["pointerdown", "keydown", "touchstart"];
    ereignisse.forEach((e) => window.addEventListener(e, starte, { once: false, passive: true }));

    // im Hintergrund schweigt die Musik
    const sicht = () => {
      if (!ref.current) return;
      if (document.hidden) fahre(0, 300);
      else if (an) ref.current.play().then(() => fahre(LAUT, 900)).catch(() => {});
    };
    document.addEventListener("visibilitychange", sicht);

    return () => {
      ereignisse.forEach((e) => window.removeEventListener(e, starte));
      document.removeEventListener("visibilitychange", sicht);
    };
  }, [an]);

  return null;   // der Klang braucht keine Gestalt
}
