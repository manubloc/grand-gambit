// ── Place names, per league, tied to the Chronicle of the Rift ───────────────
// League I keeps the authored homeland names from campaign.js. Leagues II–X
// each get their OWN full set of 51 hand-written names, drawn from that biome's
// chapter of the saga (the Judge's supervised wheat, the amber oaths that
// turned, the Keeper's bolted doors, Osric's bleeding sea …).
//
// DESIGN RULE (what this rewrite fixes): no mechanical prefix/suffix series.
// The old table gave the SAME station the same root word in every league with
// only a biome prefix swapped in ("Saatwacht / Frostwacht / Sandwacht",
// "Kornmühle / Sandmühle / Tidemühle"). Here every station is its own place —
// a name that could stand on a real map — and none repeats anywhere across the
// whole journey (a test in test_maps.mjs asserts zero duplicates, incl. L1).
//
// Keyed by node id. The id order below is fixed so each league's 51 names line
// up one-to-one with the same stations.

const IDS = [
  "n01","n02","n03","a1","a2","a3","a4","a5","b1","b2","b3","b4","b5",
  "c1","c2","c3","c4","c5","n16","n17","d1","d2","e1","e2","e3","n20","n21","n22",
  "g4","g5","g6","g7","g8","g9","g1","g2","g3","z1","z2","w1","w3","w2",
  "s1","s2","u1","u2","u3","o1","o2","o3","r1",
];

const zip = (names) => {
  const out = {};
  IDS.forEach((id, i) => { out[id] = names[i]; });
  return out;
};

export const PLACE_NAMES = {
  // ── II · Sommer — the golden fields; the Judge holds court in the wheat ──────
  2: zip([
    "Erstschnitt", "Goldkammer", "Kapelle im Korn", "Halmgrund", "Bei den Vogelscheuchen", "Der lange Acker",
    "Wo die Sense ruht", "Spelzengrund", "Sonntag", "Mittsommerblick", "Distelbruch", "Am schwelenden Rain",
    "Verbranntes Feld", "Speicher der Zehnten", "Lindgrund", "Fürstenmahd", "Der Steinerne Pflug", "Grenzrain",
    "Kanzel im Weizen", "Waage und Wort", "Glutgrund", "Auf der Fronhöhe", "Leere Scheune", "Wetterhorst",
    "Wende des Lichts", "Königsstroh", "Aschrain", "Osrics Speicher",
    "Am Fuhrweg", "Das Verdorrte Tor", "Wiege der Ernte", "Der Verscharrte Weg", "Gebeugte Kapelle", "Sichelbucht",
    "Furt der Flammen", "Bruch im Halm", "Dörrgrund", "Fähre im Wind", "Zehntsteg", "Bei den Schnittern",
    "Der Schweigende Halm", "Welkgarten", "Grannental", "Der Käferturm", "Dörrmulde", "Verlorene Garbe",
    "Distelhorst", "Röste", "Brachgrund", "Kaffgrund", "Spreuhall",
  ]),

  // ── III · Herbst — the amber woods where the first oaths turned ─────────────
  3: zip([
    "Erstes Rot", "Rostwerk", "Bernsteinaltar", "Kastanienhang", "Ockerbruch", "Der Rehpfad",
    "Wo der Eid brach", "Klingental", "Erntedank", "Drosselblick", "Schwelbruch", "Nebelrain",
    "Fallendes Laub", "Zwillingsburg", "Lindenschatten", "Herbstkrone", "Der Rostige Riegel", "Laubwall",
    "Wipfelkanzel", "Halle der zwei Schwüre", "Harzgrund", "Auf der Wipfelhöhe", "Morsche Scheune", "Sturmlaub",
    "Zwielichtblick", "Königslaub", "Aschlaub", "Der geteilte Schwur",
    "Am Köhlerweg", "Das Morsche Tor", "Rast der Wandernden", "Der Verwehte Weg", "Verhüllter Altar", "Treibholzbucht",
    "Flammfurt", "Bruch im Laub", "Harzgrotte", "Blätterfähre", "Ahornsteg", "Bei den Köhlern",
    "Der Stumme Hain", "Modergarten", "Reisigtal", "Der Ameisenturm", "Dornenmulde", "Modergrube",
    "Otternhorst", "Harzquell", "Falllaubgrund", "Stoppelhang", "Echo im Rost",
  ]),

  // ── IV · Winter — the cold preserves what the rift changes; the Shadowlord ──
  4: zip([
    "Erster Frost", "Klammwerk", "Vereister Altar", "Jägerhang", "Firnbruch", "Der Wolfsspur-Pfad",
    "Wo der Atem gefror", "Eisklinge", "Kerzenmesse", "Polarblick", "Klammbruch", "Nebelfirn",
    "Schneewehen", "Eisburg", "Schneelinde", "Winterkrone", "Der Zugefrorene Riegel", "Firnwall",
    "Nordlichtkanzel", "Halle der stillen Kälte", "Taugrund", "Auf der Gipfelhöhe", "Verwaiste Scheune", "Firnsturm",
    "Nordlichtblick", "Königsfrost", "Aschschnee", "Der Fürst im Halbschatten",
    "Am Jägerweg", "Das Erfrorene Tor", "Rast der Erschöpften", "Der Verschüttete Weg", "Vereiste Klause", "Eisbucht",
    "Frostfurt", "Bruch im Eis", "Eisgrotte", "Eisfähre", "Firnsteg", "Bei den Jägern",
    "Der Erstarrte Hain", "Reifgarten", "Firntal", "Der Frostturm", "Klammmulde", "Frostgrube",
    "Eishorst", "Tauquell", "Firngrund", "Schneegrund", "Echo im Eis",
  ]),

  // ── V · Hochgebirge — over these passes fled the court; the Keeper's keys ────
  5: zip([
    "Erster Grat", "Steinbruchwerk", "Gipfelaltar", "Steinmetzhang", "Gratbruch", "Der Gamspfad",
    "Wo der letzte Riegel fiel", "Steinklinge", "Adlermesse", "Gipfelblick", "Felsbruch", "Nebelgrat",
    "Firnhang", "Steinburg", "Zwergkiefer", "Gipfelkrone", "Das Verlorene Schloss", "Gratwall",
    "Adlerkanzel", "Halle der leeren Regale", "Bergquell", "Auf der Firnhöhe", "Verfallene Klause", "Firngrat-Sturm",
    "Sternenblick", "Königssteig-Höh", "Aschgrat", "Der Hüter ohne Tür",
    "Am Seilweg", "Das Verriegelte Tor", "Rast am Abgrund", "Der Gesprengte Grat", "Steinerne Klause", "Gletscherbucht",
    "Steinfurt", "Bruch im Fels", "Felsgrotte", "Seilfähre", "Steinsteg", "Bei den Steinmetzen",
    "Der Kahle Hain", "Steingarten", "Klammtal", "Der Steinturm", "Felsmulde", "Felsgrube",
    "Steinhorst", "Bergquell-Ost", "Firngrat", "Gratgrund", "Echo im Stein",
  ]),

  // ── VI · Ödland — the first price the rift drank; the Bloodmaid's chalice ────
  6: zip([
    "Erster Riss", "Staubwerk", "Wundaltar", "Plünderhang", "Rissbruch", "Der Galgenpfad",
    "Wo die Erde trank", "Dornklinge", "Kelchmesse", "Verfallblick", "Ödbruch", "Nebeldunst",
    "Totes Geäst", "Dornenburg", "Graudorn", "Aschekrone", "Das Ausgeblutete Tor", "Ödwall",
    "Kanzel der Wunde", "Halle des vollen Kelchs", "Ödquell", "Auf der Galgenhöhe", "Verlassene Kate", "Staubsturm",
    "Fahler Blick", "Königsstaub", "Aschgrund", "Die Magd am Kelch",
    "Am Plünderweg", "Das Rostige Tor", "Rast der Verlorenen", "Der Verschüttete Ödweg", "Wundklause", "Salzbucht",
    "Blutfurt", "Bruch im Staub", "Aschgrotte", "Aschfähre", "Knochensteg", "Bei den Plünderern",
    "Der Verdorrte Hain", "Aschgarten", "Ödtal", "Der Aschturm", "Ödmulde", "Staubgrube",
    "Ödhorst", "Sickerquell", "Brachöd", "Schlackengrund", "Echo im Staub",
  ]),

  // ── VII · Steppe — tourneys were ridden here; the Lancemaster rides them yet ─
  7: zip([
    "Erstes Gras", "Windwerk", "Reiteraltar", "Nomadenhang", "Grasbruch", "Der Wildpfad",
    "Wo die Lanze fällt", "Grasklinge", "Turniermesse", "Weiteblick", "Riedbruch", "Nebelgras",
    "Windfeld", "Grasburg", "Steppenulme", "Steppenkrone", "Der Ferne Riegel", "Graswall",
    "Falkenkanzel", "Halle des einen Gangs", "Steppenquell", "Auf der Weidehöhe", "Verlassene Jurte", "Böensturm",
    "Weiter Blick", "Königsweide", "Aschgras", "Der Meister der Lanze",
    "Am Nomadenweg", "Das Ferne Tor", "Rast der Reiter", "Der Windgepeitschte Weg", "Grasklause", "Schilfbucht",
    "Grasfurt", "Bruch im Gras", "Grasgrotte", "Grasfähre", "Grassteg", "Bei den Nomaden",
    "Der Wispernde Hain", "Riedgarten", "Grastal", "Der Nomadenturm", "Grasmulde", "Grasgrube",
    "Otterhorst", "Steppenquell-West", "Brachgras", "Riedgrund", "Echo im Gras",
  ]),

  // ── VIII · Roter Canyon — the wound itself; the last stair down; Ironfist ────
  8: zip([
    "Erster Abstieg", "Klammwerk am Fels", "Rotaltar", "Räuberhang", "Rotbruch", "Der Kondorpfad",
    "Wo die Treppe hinabführt", "Rotklinge", "Steinmesse", "Kupferblick", "Klammbruch am Grat", "Nebelrot",
    "Rotfeld", "Rotburg", "Rotdorn", "Kupferkrone", "Das Berstende Tor", "Rotwall",
    "Kondorkanzel", "Halle der geballten Faust", "Glutquell", "Auf der Kupferhöhe", "Verlassener Stollen", "Rotsturm",
    "Klammblick", "Königsschlucht", "Aschrot", "Die Faust am Grund",
    "Am Räuberweg", "Das Rotberstende Tor", "Rast am Schlund", "Der Zerborstene Weg", "Rotklause", "Felsbucht",
    "Rotfurt", "Bruch im Rot", "Rotgrotte", "Felsfähre", "Rotsteg", "Bei den Räubern",
    "Der Verbrannte Hain", "Rotgarten", "Rottal", "Der Felsturm", "Rotmulde", "Rotgrube",
    "Felshorst", "Glutquell-Ost", "Brachrot", "Schlackenrot", "Echo im Rot",
  ]),

  // ── IX · Wüste — swallows names; only the oasis remembers; the Cannoneer ─────
  9: zip([
    "Erster Sand", "Sandwerk", "Sandaltar", "Karawanenhang", "Sandbruch", "Der Fennekpfad",
    "Wo der Name verweht", "Sandklinge", "Oasenmesse", "Dünenblick", "Salzbruch", "Nebeldüne",
    "Sandfeld", "Sandburg", "Dattelhain", "Sandkrone", "Das Versandete Tor", "Sandwall",
    "Geierkanzel", "Halle des letzten Tors", "Sickerquell-Süd", "Auf der Dünenhöhe", "Verlassene Karawanserei", "Sandsturm",
    "Fahler Dünenblick", "Königsdüne", "Aschsand", "Der Kanonier am Wasser",
    "Am Karawanenweg", "Das Sandtor", "Rast der Durstigen", "Der Verwehte Sandweg", "Sandklause", "Palmenbucht",
    "Sandfurt", "Bruch im Sand", "Sandgrotte", "Sandfähre", "Sandsteg", "Bei den Karawanen",
    "Der Singende Hain", "Sandgarten", "Salztal", "Der Sandturm", "Sandmulde", "Sandgrube",
    "Skorpionhorst", "Sickerquell-Nord", "Brachsand", "Salzsand", "Echo im Sand",
  ]),

  // ── X · Endloses Meer — where the rift bleeds out; Osric waits; the Captain ──
  10: zip([
    "Erste Gischt", "Tidenwerk", "Salzaltar", "Strandguthang", "Riffbruch", "Der Möwenpfad",
    "Wo der Riss ausblutet", "Salzklinge", "Leuchtfeuermesse", "Klippenblick", "Salzbruch am Riff", "Nebelsee",
    "Wogenfeld", "Wellenburg", "Tangwald", "Salzkrone", "Das Salzberstende Tor", "Tidenwall",
    "Möwenkanzel", "Halle der herrenlosen Fracht", "Salzquell-Bucht", "Auf der Klippenhöhe", "Verlassener Kai", "Wogensturm",
    "Fahler Klippenblick", "Königsklippe", "Aschsee", "Osrics letztes Tor",
    "Am Strandgutweg", "Das Salztor", "Rast der Gestrandeten", "Der Zerborstene Kai", "Salzklause", "Ankergrund",
    "Salzfurt", "Bruch im Riff", "Meeresgrotte", "Nebelfähre-See", "Salzsteg", "Bei den Strandläufern",
    "Die Stille See", "Tanggarten", "Rifftal", "Der Leuchtturm", "Riffmulde", "Riffgrube",
    "Krakenhorst", "Salzquell-Ost", "Brachsee", "Schlacksee", "Echo im Riff",
  ]),
};
