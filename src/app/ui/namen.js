// ── DER NAMENSRUF ───────────────────────────────────────────────────────────
// v1.0.5: Der Herold wuerfelt Spielernamen. Bis hierher wohnte er im
// Online-Schirm - jetzt ruft er schon beim allerersten Betreten des Spiels
// (GameIntro) und fuer Bestandsstaende ohne Namen. Eine Quelle, drei Orte.
const TAG_FIRST = ["Alric","Brenna","Cedrik","Dara","Edran","Falka","Gorm","Hedda","Iwain","Jorga",
  "Kellan","Lioba","Merek","Nyra","Odwin","Perra","Quinlan","Runa","Sarik","Talvi",
  "Ulfa","Varek","Wenna","Ylva","Zoran","Oswina","Marrek","Isbeth","Rodrik","Fenja",
  "Torvin","Ysmay","Aldra","Bertram","Corva","Dagny"];
const TAG_EPI = { de: ["Salzherz","Rabenruf","Nachtklinge","Grimmzahn","Eisenlied","Aschewandler","Frostauge",
    "Dornenkuss","Schattenschritt","Goldzunge","Wolfsmond","Bleichfeuer","Splitterkrone","Nebelgänger",
    "Siebenklingen","Sternenleser","Salzkrähe","Glutfinger","Rissgänger","Kelchdieb","Zwielichter",
    "Sturmfaust","Kaltglut","Ebenholz","Bernsteinblick","Leisetritt","Dreizung","Winterkuss",
    "Halbmond","Fährtenfluch","Turmschläfer","Damenopfer"],
  en: ["Saltheart","Ravencall","Nightblade","Grimfang","Ironsong","Ashwalker","Frosteye",
    "Thornkiss","Shadowstep","Goldtongue","Wolfmoon","Palefire","Splintercrown","Mistwalker",
    "Sevenblades","Starreader","Saltcrow","Emberfinger","Riftwalker","Cupthief","Twilighter",
    "Stormfist","Coldglow","Ebonwood","Amberglance","Softstep","Threetongue","Winterkiss",
    "Halfmoon","Trailcurse","Towersleeper","Queensgambit"] };
const TAG_A = { de: ["Eherner","Goldener","Stiller","Kühner","Dunkler","Grauer","Rastloser","Letzter",
    "Wandernder","Eiserner","Junger","Listiger","Bleicher","Zorniger","Sanfter","Namenloser",
    "Gezeichneter","Schlafloser","Ungekrönter","Verlorener"],
  en: ["Iron","Gilded","Silent","Bold","Dark","Grey","Restless","Last",
    "Wandering","Brazen","Young","Cunning","Pale","Wrathful","Gentle","Nameless",
    "Marked","Sleepless","Uncrowned","Lost"] };
const TAG_N = { de: ["Turm","Läufer","Springer","Gambit","Wächter","Falke","Drache","Paladin",
    "Schatten","Kanzler","Bauer","Stratege","Rabe","Kelch","Riss","Herold",
    "Tyrann","Kapitän","Schwur","Leuchtturm"],
  en: ["Rook","Bishop","Knight","Gambit","Warden","Hawk","Drake","Paladin",
    "Shadow","Chancellor","Pawn","Strategist","Raven","Chalice","Rift","Herald",
    "Tyrant","Captain","Vow","Beacon"] };
const ROMAN = ["", "", " II", " III", " IV", " VII", " IX", " XI", " XIII"];
const rolledTags = new Set(); // the herald never calls the same name twice tonight
export const rollTag = (en) => {
  const L = en ? "en" : "de", r = (a) => a[Math.floor(Math.random() * a.length)];
  for (let i = 0; i < 24; i++) {
    const tag = Math.random() < 0.55
      ? r(TAG_FIRST) + " " + r(TAG_EPI[L])
      /* Altfehler beim Umzug entdeckt: das Leerzeichen stand nur im
         Englischen - deutsch hiess es "EisernerRiss". Flektierte Adjektive
         ("Eiserner", "Stille") brauchen es in beiden Sprachen. */
      : r(TAG_A[L]) + " " + r(TAG_N[L]) + r(ROMAN);
    if (tag.length <= 24 && !rolledTags.has(tag)) { rolledTags.add(tag); return tag; }
  }
  const tag = (r(TAG_FIRST) + " " + r(TAG_EPI[L])).slice(0, 20) + " " + (11 + Math.floor(Math.random() * 88));
  rolledTags.add(tag); return tag;
};

/* v1.0.13 (Besitzer, Punkt 6): DER HELDNAME IN DEN KAMPAGNENTEXTEN.
   Jede Erzaehlstelle darf {held} schreiben - beim Zeigen tritt der Name aus
   dem Profil an diese Stelle. Ohne Namen bleibt der alte Ehrentitel. */
export function heldName(profile) {
  const n = (profile?.name || "").trim();
  return n || "Wanderer";
}
export function mitHeld(text, profile) {
  return typeof text === "string" ? text.split("{held}").join(heldName(profile)) : text;
}
