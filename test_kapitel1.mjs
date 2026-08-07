// ── WAS SIEHT DER SPIELER IN KAPITEL I? (v1.0.42) ───────────────────────────
// Zwei Besitzerbefunde in einer Probe:
//
// 1. DREI SICHTBARKEITSSTUFEN. hpOnly war ein Schalter fuer zwei Zustaende,
//    aber es gibt drei. Vor dem Umbau waren 20 von 26 Faehigkeiten in
//    Kapitel I aktiv - darunter Scharfschuss und Dauerfeuer, die im Zug
//    dreifach verriegelt sind. Der Spieler sah also Faehigkeiten auf den
//    Karten, die er nicht benutzen konnte.
//
// 2. DIE STUFE DES ERWACHTEN. Bis v1.0.41 hob das Erwachen nur das BILD -
//    die Stufe blieb bei 1. Der Held soll sich auf dem Feld abheben, ohne
//    dass irgendwo eine Farbe verschoben wird.
//
// Diese Probe ZAEHLT ALLE 26 durch, statt Stichproben zu nehmen: genau so
// ist der alte Fehler entstanden.
import { ABILITIES, faehigkeitZustand, faehigkeitSichtbar, SPERRGRUND } from "./src/content/index.js";
import { defaultProfile, gambitStufe, gambitWach, GAMBIT_ERWACHT_AB,
  GAMBIT_ERWACHT_AUF_STUFE, characterLevel } from "./src/meta/index.js";

let pass = 0, fail = 0;
const ok = (was, bed) => {
  if (bed) { pass++; console.log("  ok  - " + was); }
  else { fail++; console.log("  FAIL- " + was); }
};

const alle = Object.keys(ABILITIES);
const zustand = (wach) => {
  const z = { wirkt: [], riegel: [], verborgen: [] };
  for (const id of alle) z[faehigkeitZustand(id, wach)].push(id);
  return z;
};

console.log("\n── DIE DREI STUFEN ──");
const vor = zustand(false), nach = zustand(true);

ok("jede der " + alle.length + " Faehigkeiten hat genau einen Zustand",
  vor.wirkt.length + vor.riegel.length + vor.verborgen.length === alle.length);

// KEIN LEERER TOPF: waere einer leer, haette der Umbau nichts getrennt und
// die Probe wuerde trotzdem gruen leuchten. Genau diese Sorte blinde Probe
// hat in diesem Haus schon genug Zeit gekostet.
ok("alle drei Toepfe sind besetzt - die Trennung greift wirklich",
  vor.wirkt.length > 0 && vor.riegel.length > 0 && vor.verborgen.length > 0);

// GANGARTEN WIRKEN SOFORT. Sie brauchen keine Lebenspunkte, sie aendern nur,
// wie eine Figur zieht - der Besitzer hat ausdruecklich darauf bestanden.
const gangarten = alle.filter((id) => ABILITIES[id].tag === "move");
ok("alle " + gangarten.length + " Gangarten wirken schon in Kapitel I",
  gangarten.every((id) => faehigkeitZustand(id, false) === "wirkt"));

// REICHWEITEN-KUENSTE SIND VERRIEGELT, ABER SICHTBAR. Im Zug sind sie
// dreifach gesperrt; sie zu VERSTECKEN waere falsch - der Spieler soll
// wissen, dass es sie gibt und warum sie ruhen.
const fern = alle.filter((id) => ABILITIES[id].tag === "ranged");
ok("die " + fern.length + " Reichweiten-Kuenste sind in Kapitel I verriegelt",
  fern.every((id) => faehigkeitZustand(id, false) === "riegel"));
ok("...aber sie bleiben SICHTBAR - der Spieler weiss, dass es sie gibt",
  fern.every((id) => faehigkeitSichtbar(id, false)));

// WAS LEBENSPUNKTE BRAUCHT, EXISTIERT VOR DEM ERWACHEN NICHT.
const hp = alle.filter((id) => ABILITIES[id].hpOnly);
ok("alle " + hp.length + " HP-Talente sind vor dem Erwachen verborgen",
  hp.every((id) => faehigkeitZustand(id, false) === "verborgen"));
ok("...und nichts anderes ist verborgen",
  vor.verborgen.length === hp.length);
ok("verborgen heisst wirklich unsichtbar",
  hp.every((id) => !faehigkeitSichtbar(id, false)));

// NACH DEM ERWACHEN FAELLT JEDE SPERRE.
ok("nach dem Erwachen wirkt jede der " + alle.length + " Faehigkeiten",
  nach.wirkt.length === alle.length);

// JEDE SPERRE MUSS SICH ERKLAEREN KOENNEN.
ok("fuer jede Sperrart steht ein Grund bereit, deutsch und englisch",
  ["riegel", "verborgen"].every((k) => SPERRGRUND[k] && SPERRGRUND[k].de && SPERRGRUND[k].en));

// KEINE VERWAISTEN MARKEN: ein Tippfehler in sperre: waere sonst stumm.
ok("keine Faehigkeit traegt eine unbekannte Sperrart",
  alle.every((id) => !ABILITIES[id].sperre || SPERRGRUND[ABILITIES[id].sperre]));

console.log("     Kapitel I: " + vor.wirkt.length + " wirken, "
  + vor.riegel.length + " verriegelt, " + vor.verborgen.length + " verborgen");

console.log("\n── DIE STUFE DES ERWACHTEN ──");
const frisch = defaultProfile();
frisch.campaign = { ...(frisch.campaign || {}), cleared: [] };
const erwacht = defaultProfile();
erwacht.campaign = { ...(erwacht.campaign || {}), cleared:
  Array.from({ length: GAMBIT_ERWACHT_AB }, (_, i) => "st" + i) };

ok("vor dem Erwachen fuehrt niemand die Armee an", !gambitWach(frisch));
ok("nach " + GAMBIT_ERWACHT_AB + " Stationen erwacht er", gambitWach(erwacht));
ok("vorher steht er auf Stufe 1", gambitStufe(frisch) === 1);
ok("mit dem Erwachen springt er auf Stufe " + GAMBIT_ERWACHT_AUF_STUFE,
  gambitStufe(erwacht) === GAMBIT_ERWACHT_AUF_STUFE);

// DER SPRUNG IST EINE UNTERGRENZE, KEINE FESTSETZUNG: wer sich schon
// hochgearbeitet hat, faellt nicht auf 2 zurueck.
const weit = defaultProfile();
weit.campaign = { ...(weit.campaign || {}), cleared: erwacht.campaign.cleared };
weit.pieces = { ...(weit.pieces || {}), levels: { ...(weit.pieces?.levels || {}), gambit: 7 } };
ok("ein weiter gestiegener Held faellt NICHT auf die Startstufe zurueck",
  gambitStufe(weit) === 7 && characterLevel(weit, "gambit") === 7);

console.log("\nRESULT: " + pass + " passed, " + fail + " failed");
if (fail) process.exit(1);
