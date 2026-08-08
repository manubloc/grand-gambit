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
  GAMBIT_ERWACHT_AUF_STUFE, characterLevel, resolveCharacter,
  FREIGABEN, darfHeldSetzen, darfReiheStellen, erklaertWas, naechsteErklaerung,
  merkeErklaert, merkschluessel, ersteFigurDa, freigegeben } from "./src/meta/index.js";
import { CHARACTERS } from "./src/content/index.js";

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

/* v1.0.49: DIE SCHWELLE STEHT AUF 0 - der Held ist von der ersten Partie an
   da, weil er die Figur ist, die auf der Karte ohnehin die ganze Zeit zu
   sehen ist. Geprueft wird darum nicht mehr sein Fehlen davor, sondern dass
   er SOFORT dasteht und seine Stufe traegt. */
ok("der Held ist von Anfang an da", gambitWach(frisch));
ok("und bleibt es", gambitWach(erwacht));
ok("er steht sofort auf Stufe " + GAMBIT_ERWACHT_AUF_STUFE,
  gambitStufe(frisch) === GAMBIT_ERWACHT_AUF_STUFE
  && gambitStufe(erwacht) === GAMBIT_ERWACHT_AUF_STUFE);

// DER SPRUNG IST EINE UNTERGRENZE, KEINE FESTSETZUNG: wer sich schon
// hochgearbeitet hat, faellt nicht auf 2 zurueck.
const weit = defaultProfile();
weit.campaign = { ...(weit.campaign || {}), cleared: erwacht.campaign.cleared };
weit.pieces = { ...(weit.pieces || {}), levels: { ...(weit.pieces?.levels || {}), gambit: 7 } };
ok("ein weiter gestiegener Held faellt NICHT auf die Startstufe zurueck",
  gambitStufe(weit) === 7 && characterLevel(weit, "gambit") === 7);

console.log("\n── DIE ERSTE FAEHIGKEIT ──");
// Der Besitzer will, dass man den Bruch SIEHT, nicht nur am Bild: der
// Erwachte schlaegt geradeaus, was kein Bauer darf. Also muss die Sprosse,
// auf die das Erwachen hebt, eine FAEHIGKEIT tragen - kein Schild.
const sprosse2 = CHARACTERS.gambit.ladder.find((r) => r.level === GAMBIT_ERWACHT_AUF_STUFE);
ok("die Sprosse des Erwachens traegt eine Faehigkeit, kein Schild",
  !!sprosse2 && !!sprosse2.ability);
ok("und zwar den Vorwaertsschlag - das eine, was ein Bauer nie darf",
  sprosse2.ability === "pawn_forward_capture");
const beimErwachen = resolveCharacter(CHARACTERS.gambit, GAMBIT_ERWACHT_AUF_STUFE, null);
ok("der Erwachte traegt sie auch wirklich im Heer",
  (beimErwachen.abilities || []).includes("pawn_forward_capture"));

console.log("\n── DIE FREISCHALT-ORDNUNG ──");
const zu = defaultProfile();
zu.campaign = { ...(zu.campaign || {}), cleared: [] };
/* Die Heldenspalte geht mit dem Helden auf - also sofort. Die HINTERE REIHE
   bleibt unberuehrt: sie haengt weiter an der ersten fremden Figur. */
ok("die Heldenspalte steht von Anfang an offen", darfHeldSetzen(zu));
ok("in Kapitel I ist die hintere Reihe zu", !darfReiheStellen(zu));
ok("und noch ist keine Figur beigetreten", !ersteFigurDa(zu));

ok("mit dem Erwachen geht die Heldenspalte auf", darfHeldSetzen(erwacht));
ok("die hintere Reihe bleibt trotzdem zu", !darfReiheStellen(erwacht));

// DIE REIHE HAENGT AN DER ERSTEN FREMDEN FIGUR, nicht am Erwachen. Die
// sieben Grundfiguren zaehlen nicht - sie stehen von Anfang an da.
const mitFigur = { ...erwacht,
  campaign: { ...erwacht.campaign, unlocked: ["archbishop"] } };
ok("die erste gewonnene Figur oeffnet die hintere Reihe",
  ersteFigurDa(mitFigur) ? darfReiheStellen(mitFigur) : false);

// JEDE FREIGABE ERKLAERT SICH EINMAL - und dann nie wieder.
const offen = erklaertWas(erwacht);
ok("beim Erwachen wartet genau eine Erklaerung", offen.length === 1 && offen[0].id === "held");
ok("jede Freigabe bringt Titel und Text in beiden Sprachen mit",
  FREIGABEN.every((f) => f.titelDe && f.titelEn && f.textDe && f.textEn));
const gemerkt = merkeErklaert(erwacht, "held");
ok("nach dem Erklaeren schweigt sie", !erklaertWas(gemerkt).some((f) => f.id === "held"));
ok("das Merken laesst den alten Spielstand unberuehrt",
  !(erwacht.notices && erwacht.notices[merkschluessel("held")]));

// DERSELBE TOPF WIE DIE LEHRSTUNDEN. Ein zweiter Merker daneben waere eine
// zweite Wahrheit - und faellt erst auf, wenn ein alter Spielstand auftaucht.
ok("der Merker liegt in profile.notices, wo auch die Lehrstunden liegen",
  !!gemerkt.notices && !!gemerkt.notices[merkschluessel("held")]);
ok("und traegt sein eigenes Praefix, damit nichts kollidiert",
  merkschluessel("held").startsWith("frei:"));

// GEHEN ZWEI ZUGLEICH AUF, KOMMT DIE FRUEHERE ZUERST - sonst stuenden zwei
// Fenster uebereinander oder eines ginge stumm verloren.
const zweiZugleich = { ...mitFigur };
const reihenfolge = erklaertWas(zweiZugleich).map((f) => f.id);
ok("mehrere offene Freigaben kommen in der Ordnung der Liste",
  reihenfolge.length >= 2 && reihenfolge[0] === "held");
ok("naechsteErklaerung liefert genau die erste davon",
  naechsteErklaerung(zweiZugleich).id === reihenfolge[0]);
// Bei "zu" ist die Held-Freigabe jetzt offen und ungelesen - also NICHT null.
ok("ist nichts mehr offen, meldet sie null",
  naechsteErklaerung(merkeErklaert(merkeErklaert(zu, "held"), "hinterereihe")) === null);

// ── GOLD OEFFNET MAEULER ERST NACH DEM ERSTEN SIEG (v1.0.50) ───────────────
// Bestechen stand von Anfang an im Monsterbaum - ein Raetsel fuer jeden, der
// noch nie ein Monster gesehen hat. Jetzt ist es eine Freigabe: sie oeffnet
// mit dem ersten BESIEGTEN echten Monster (codex.beaten, geschrieben im
// GameScreen beim Sieg; pb_-Meister zaehlen nicht).
{
  const leer = defaultProfile();
  ok("bestechen ist anfangs zu", !freigegeben(leer, "bestechen"));
  const danach = { ...leer, codex: { beaten: ["b02"] } };
  ok("der erste Monstersieg oeffnet es", freigegeben(danach, "bestechen"));
  const f = FREIGABEN.find((x) => x.id === "bestechen");
  ok("und es traegt Titel und Erklaerung in beiden Sprachen",
    !!f && !!f.titelDe && !!f.titelEn && f.textDe.length > 60 && f.textEn.length > 60);
  ok("die Ordnung selbst: held, hinterereihe, bestechen, leben",
    FREIGABEN.map((x) => x.id).join(",") === "held,hinterereihe,bestechen,leben");
}

console.log("\nRESULT: " + pass + " passed, " + fail + " failed");
if (fail) process.exit(1);
