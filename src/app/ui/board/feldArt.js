// ── DIE FELDER DES BESITZERS ────────────────────────────────────────────────
// v0.66: fuer jedes Kapitel ein eigenes Felderpaar als EIN Streifenbild -
// linke Haelfte das helle Feld, rechte Haelfte das dunkle. Die Zellen
// schneiden sich ihr Fenster zur Laufzeit per Hash aus der richtigen
// Haelfte (dasselbe Prinzip wie die Marmorplatten, nur ohne 190 Dateien).
// Dazu: drei klassische Streifen im Wechsel und die Finale-Kachel mit
// Blitzen fuer den Endboss des letzten Kapitels (nur die dunklen Felder).
import k01 from "../assets/felder/feld-k01.webp";
import k02 from "../assets/felder/feld-k02.webp";
import k03 from "../assets/felder/feld-k03.webp";
import k04 from "../assets/felder/feld-k04.webp";
import k05 from "../assets/felder/feld-k05.webp";
import k06 from "../assets/felder/feld-k06.webp";
import k07 from "../assets/felder/feld-k07.webp";
import k08 from "../assets/felder/feld-k08.webp";
import k09 from "../assets/felder/feld-k09.webp";
import k10 from "../assets/felder/feld-k10.webp";
import k11 from "../assets/felder/feld-k11.webp";
import k12 from "../assets/felder/feld-k12.webp";
import c1 from "../assets/felder/feld-classic1.webp";
import c2 from "../assets/felder/feld-classic2.webp";
import c3 from "../assets/felder/feld-classic3.webp";
import finale from "../assets/felder/feld-finale.webp";

export const FELD_KAPITEL = [k01, k02, k03, k04, k05, k06, k07, k08, k09, k10, k11, k12];
export const FELD_CLASSIC = [c1, c2, c3];
export const FELD_FINALE = finale;
