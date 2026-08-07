/* ── DAS TORSCHLOSS (v1.0.39, Besitzerwunsch) ──────────────────────────────
 *
 * Schaukammer, Klangwerkstatt und Spielerbuch hingen bisher allein an einem
 * Adressanhaengsel: wer "?werkstatt" kannte, war drin. Der Besitzer will sie
 * mit demselben Wort schuetzen, das auch das Admin-Konto oeffnet.
 *
 * WAS DIESES SCHLOSS LEISTET - und was nicht. Es haelt Neugierige fern, die
 * zufaellig auf einen Werkzeug-Link stossen. Es ist KEIN Schutz gegen
 * jemanden, der es darauf anlegt: Die App laeuft im Browser, ihr gesamter
 * Programmtext ist einsehbar, und ein Wort, mit dem der Browser vergleichen
 * soll, muss ihm bekannt sein. Deshalb liegt hier auch nur ein PRUEFWERT
 * (SHA-256) und nicht das Wort selbst - das kostet den Gelegenheitsleser
 * einen Umweg, aber einen Entschlossenen nur eine Minute.
 *
 * Echter Schutz kaeme nur von einer Tuer, die auf dem SERVER sitzt. Die
 * Werkzeuge zeigen jedoch nichts, was nicht ohnehin ausgeliefert wird -
 * Bilder, Klaenge, Listen -, und sie veraendern keinen fremden Spielstand.
 * Fuer diesen Zweck ist das Schloss angemessen; fuer mehr nicht.
 */

const PRUEFWERT = "eea596458e22f40ad615001323a7191eb6c9d9f03e69dbaad573fbd2df04abd3";
const SCHLUESSEL = "gg:werkzeug:offen";

/** Prueft ein Wort gegen den hinterlegten Wert. */
export async function torOeffnen(wort) {
  const hash = await pruefwert(wort || "");
  if (hash !== PRUEFWERT) return false;
  try { sessionStorage.setItem(SCHLUESSEL, "1"); } catch {}
  return true;
}

/** Steht das Tor in dieser Sitzung schon offen? */
export function torOffen() {
  try { return sessionStorage.getItem(SCHLUESSEL) === "1"; } catch { return false; }
}

/** Schliesst wieder zu - fuer den Fall, dass ein fremdes Geraet genutzt wurde. */
export function torSchliessen() {
  try { sessionStorage.removeItem(SCHLUESSEL); } catch {}
}

async function pruefwert(wort) {
  const daten = new TextEncoder().encode("gg-werkzeug:" + wort);
  const puffer = await crypto.subtle.digest("SHA-256", daten);
  return [...new Uint8Array(puffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const _pruefwert = pruefwert;   // fuer die Proben
