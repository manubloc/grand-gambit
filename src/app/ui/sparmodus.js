/* ── DER SPARMODUS (v1.0.37, Besitzer: "es ruckelt beim Anklicken") ─────────
 *
 * WARUM ES DIESE DATEI GIBT. Der Besitzer meldet Ruckeln auf seinem Telefon.
 * Ich habe es gemessen - mit vierfach gedrosselter Rechenleistung, mit
 * Profil, mit A/B-Versuchen - und dabei zwei begruendete Verdaechtige
 * WIDERLEGT: weder die Randmasken der Felder noch die Schlagschatten der
 * Figuren machten einen Unterschied. Das Profil zeigte ausserdem, dass nur
 * 30 ms auf ausgefuehrtes Programm entfallen; die Zeit geht ins ZEICHNEN.
 *
 * Das Entscheidende aber: Mein Messplatz ist ein Browser OHNE Grafikkern,
 * der in Software zeichnet. Er ist kein Telefon, und seine Zahlen taugen
 * nicht als Mass fuer eines. Weiterzuraten waere billig gewesen.
 *
 * Also misst ab jetzt das Geraet, auf dem es klemmt. Vier Posten lassen sich
 * EINZELN abschalten - wer sie im Profil umlegt, sieht in Sekunden, welcher
 * es wirklich ist:
 *
 *   gemaelde  Das Kapitelbild hinter dem Brett. Ein bildschirmfuellendes
 *             Bild auf eigener Zeichenschicht - der teuerste EINZELPOSTEN,
 *             wenn eine Schicht neu zusammengesetzt werden muss.
 *   schatten  Die Schlagschatten unter den Figuren. Ein Filter zwingt den
 *             Browser, die Figur eigens zu rastern, und das 32-mal.
 *   randweich Die Masken der Randfelder. Masken sind auf Telefon-Grafikkernen
 *             teuer; hier sind es 28 Stueck.
 *   uebergang Die weichen Uebergaenge beim Auswaehlen. Sie laufen ueber 64
 *             Zellen und sind genau das, was beim ANKLICKEN arbeitet -
 *             deshalb der erste Verdaechtige fuer das Klick-Ruckeln.
 *
 * Voreinstellung ist ALLES AN: niemand soll ein aermeres Spiel bekommen,
 * weil er die Einstellungen nie geoeffnet hat.
 */

const AUS = { gemaelde: false, schatten: false, randweich: false, uebergang: false };

let SPAR = { ...AUS };

/** Setzt den Sparmodus. Unbekannte Schluessel werden ignoriert, damit ein
 *  alter Spielstand mit anderen Namen nichts kaputtmacht. */
export function setSparmodus(werte) {
  const neu = { ...AUS };
  for (const k of Object.keys(AUS)) if (werte && werte[k]) neu[k] = true;
  SPAR = neu;
}

/** Ist dieser Posten abgeschaltet? */
export const gespart = (posten) => !!SPAR[posten];

/** Der ganze Zustand - fuer die Oberflaeche, die die Schalter zeichnet. */
export const sparmodus = () => ({ ...SPAR });

/** Laeuft ueberhaupt etwas im Sparmodus? Fuer den Hinweis im Profil. */
export const sparsam = () => Object.values(SPAR).some(Boolean);

/** Die Posten in der Reihenfolge, in der sie im Profil stehen sollen -
 *  die teuersten zuerst, damit der erste Versuch der beste ist. */
export const SPAR_POSTEN = ["gemaelde", "uebergang", "schatten", "randweich"];
