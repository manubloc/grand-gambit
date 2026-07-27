// GENERIERT von tools/build-campaign12.mjs - nicht von Hand pflegen.
// Quelle ist tools/stationen.json, der im Stationspruefer gepflegte Stand
// (2026-07-27T07:35:03.714Z). Zwoelf Liga-Graphen, 529 Stationen.
// Zum Neubau: node tools/build-campaign12.mjs
export const CAMPAIGN12 = [
 {
  "id": "L01s00",
  "league": 1,
  "place": "Alte Wacht",
  "col": 0,
  "row": 1,
  "map": "classic",
  "rules": "chess",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L01s01"
  ],
  "reward": {
   "xp": 36
  },
  "storyDe": "Der Weg beginnt bei Alte Wacht.",
  "storyEn": "The road begins at Alte Wacht."
 },
 {
  "id": "L01s01",
  "league": 1,
  "place": "Silbermühle",
  "col": 1,
  "row": 2,
  "map": "skirmish",
  "rules": "chess",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L01s03"
  ],
  "reward": {
   "xp": 39
  },
  "storyDe": "Der Weg beginnt bei Silbermühle.",
  "storyEn": "The road begins at Silbermühle."
 },
 {
  "id": "L01s02",
  "league": 1,
  "place": "Vergessener Schrein",
  "col": 3,
  "row": 2,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 60,
   "gold": 48
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Vergessener Schrein.",
  "storyEn": "A side path branches toward Vergessener Schrein."
 },
 {
  "id": "L01s03",
  "league": 1,
  "place": "Nordwacht",
  "col": 1,
  "row": 2,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L01s04",
   "L01s07"
  ],
  "reward": {
   "xp": 42
  },
  "storyDe": "Nordwacht: die alte Magie erwacht - Figuren bluten, Figuren halten stand.",
  "storyEn": "Nordwacht: the old magic wakes - pieces bleed, pieces endure.",
  "boss": {
   "pure": "b01",
   "rotation": [
    "b01",
    "b03",
    "b02"
   ]
  },
  "tier": 1
 },
 {
  "id": "L01s04",
  "league": 1,
  "place": "Schattenklippe",
  "col": 1,
  "row": 2,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L01s06"
  ],
  "reward": {
   "xp": 45
  },
  "storyDe": "Der Weg beginnt bei Schattenklippe.",
  "storyEn": "The road begins at Schattenklippe."
 },
 {
  "id": "L01s05",
  "league": 1,
  "place": "Wolfspass",
  "col": 3,
  "row": 2,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s02"
  ],
  "reward": {
   "xp": 60
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Wolfspass.",
  "storyEn": "A side path branches toward Wolfspass."
 },
 {
  "id": "L01s06",
  "league": 1,
  "place": "Drachenhort",
  "col": 1,
  "row": 3,
  "map": "arena",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L01s09"
  ],
  "reward": {
   "xp": 48
  },
  "storyDe": "Der Weg beginnt bei Drachenhort.",
  "storyEn": "The road begins at Drachenhort."
 },
 {
  "id": "L01s07",
  "league": 1,
  "place": "Klingenschlucht",
  "col": 1,
  "row": 3,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s12"
  ],
  "reward": {
   "xp": 52
  },
  "storyDe": "Ein stiller Umweg führt zu Klingenschlucht.",
  "storyEn": "A quiet detour leads to Klingenschlucht."
 },
 {
  "id": "L01s08",
  "league": 1,
  "place": "Sonnenheiligtum",
  "col": 3,
  "row": 3,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s05"
  ],
  "reward": {
   "xp": 60
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Sonnenheiligtum.",
  "storyEn": "A side path branches toward Sonnenheiligtum."
 },
 {
  "id": "L01s09",
  "league": 1,
  "place": "Alte Sternwarte",
  "col": 2,
  "row": 3,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L01s10"
  ],
  "reward": {
   "xp": 51
  },
  "storyDe": "Der Weg beginnt bei Alte Sternwarte.",
  "storyEn": "The road begins at Alte Sternwarte."
 },
 {
  "id": "L01s10",
  "league": 1,
  "place": "Hexenmoor",
  "col": 2,
  "row": 3,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L01s13"
  ],
  "reward": {
   "xp": 54
  },
  "storyDe": "Der Pfad führt weiter über Hexenmoor.",
  "storyEn": "The path leads on across Hexenmoor."
 },
 {
  "id": "L01s11",
  "league": 1,
  "place": "Nebelmoor",
  "col": 3,
  "row": 3,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s08"
  ],
  "reward": {
   "xp": 52
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Nebelmoor.",
  "storyEn": "A side path branches toward Nebelmoor."
 },
 {
  "id": "L01s12",
  "league": 1,
  "place": "Geisterfeld",
  "col": 1,
  "row": 4,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s16"
  ],
  "reward": {
   "xp": 60
  },
  "storyDe": "Abseits des Weges liegt Geisterfeld.",
  "storyEn": "Off the road lies Geisterfeld."
 },
 {
  "id": "L01s13",
  "league": 1,
  "place": "Waldfeste",
  "col": 2,
  "row": 4,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L01s14"
  ],
  "reward": {
   "xp": 57
  },
  "storyDe": "Der Pfad führt weiter über Waldfeste.",
  "storyEn": "The path leads on across Waldfeste."
 },
 {
  "id": "L01s14",
  "league": 1,
  "place": "Lindenhain",
  "col": 3,
  "row": 4,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L01s11",
   "L01s17"
  ],
  "reward": {
   "xp": 60
  },
  "storyDe": "Der Pfad führt weiter über Lindenhain.",
  "storyEn": "The path leads on across Lindenhain.",
  "boss": {
   "piece": "mage",
   "wins": 1
  },
  "tier": 2
 },
 {
  "id": "L01s15",
  "league": 1,
  "place": "Kronenstadt",
  "col": 5,
  "row": 4,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 60,
   "gold": 48
  },
  "storyDe": "Abseits des Weges liegt Kronenstadt.",
  "storyEn": "Off the road lies Kronenstadt."
 },
 {
  "id": "L01s16",
  "league": 1,
  "place": "Eisenbollwerk",
  "col": 1,
  "row": 4,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s18",
   "L01s23"
  ],
  "reward": {
   "xp": 60
  },
  "storyDe": "Ein stiller Umweg führt zu Eisenbollwerk.",
  "storyEn": "A quiet detour leads to Eisenbollwerk."
 },
 {
  "id": "L01s17",
  "league": 1,
  "place": "Grenzwall",
  "col": 3,
  "row": 5,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L01s20"
  ],
  "reward": {
   "xp": 63
  },
  "storyDe": "Der Pfad führt weiter über Grenzwall.",
  "storyEn": "The path leads on across Grenzwall."
 },
 {
  "id": "L01s18",
  "league": 1,
  "place": "Hohes Heiligtum",
  "col": 1,
  "row": 5,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 60,
   "gold": 48
  },
  "storyDe": "Abseits des Weges liegt Hohes Heiligtum.",
  "storyEn": "Off the road lies Hohes Heiligtum."
 },
 {
  "id": "L01s19",
  "league": 1,
  "place": "Ratshalle",
  "col": 5,
  "row": 5,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s15"
  ],
  "reward": {
   "xp": 60
  },
  "storyDe": "Ein stiller Umweg führt zu Ratshalle.",
  "storyEn": "A quiet detour leads to Ratshalle."
 },
 {
  "id": "L01s20",
  "league": 1,
  "place": "Schmiedegrund",
  "col": 3,
  "row": 5,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L01s22"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Der Pfad führt weiter über Schmiedegrund.",
  "storyEn": "The path leads on across Schmiedegrund."
 },
 {
  "id": "L01s21",
  "league": 1,
  "place": "Bannerhöhe",
  "col": 4,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s19"
  ],
  "reward": {
   "xp": 60
  },
  "storyDe": "Abseits des Weges liegt Bannerhöhe.",
  "storyEn": "Off the road lies Bannerhöhe."
 },
 {
  "id": "L01s22",
  "league": 1,
  "place": "Verlassene Ruinen",
  "col": 3,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L01s25",
   "L01s28"
  ],
  "reward": {
   "xp": 69
  },
  "storyDe": "Die Prüfung wartet bei Verlassene Ruinen.",
  "storyEn": "The trial waits at Verlassene Ruinen."
 },
 {
  "id": "L01s23",
  "league": 1,
  "place": "Sturmfeste",
  "col": 1,
  "row": 5,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s27"
  ],
  "reward": {
   "xp": 60
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Sturmfeste.",
  "storyEn": "A side path branches toward Sturmfeste."
 },
 {
  "id": "L01s24",
  "league": 1,
  "place": "Mondwarte",
  "col": 4,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s21",
   "L01s30"
  ],
  "reward": {
   "xp": 52
  },
  "storyDe": "Abseits des Weges liegt Mondwarte.",
  "storyEn": "Off the road lies Mondwarte."
 },
 {
  "id": "L01s25",
  "league": 1,
  "place": "Krähenfels",
  "col": 3,
  "row": 6,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L01s26"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Die Prüfung wartet bei Krähenfels.",
  "storyEn": "The trial waits at Krähenfels."
 },
 {
  "id": "L01s26",
  "league": 1,
  "place": "Furt am Grauen Bach",
  "col": 4,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L01s24",
   "L01s30"
  ],
  "reward": {
   "xp": 75
  },
  "storyDe": "Die Prüfung wartet bei Furt am Grauen Bach.",
  "storyEn": "The trial waits at Furt am Grauen Bach."
 },
 {
  "id": "L01s27",
  "league": 1,
  "place": "Zehntscheune",
  "col": 1,
  "row": 6,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s32"
  ],
  "reward": {
   "xp": 60
  },
  "storyDe": "Abseits des Weges liegt Zehntscheune.",
  "storyEn": "Off the road lies Zehntscheune."
 },
 {
  "id": "L01s28",
  "league": 1,
  "place": "Mühlensteg",
  "col": 3,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s29",
   "L01s36"
  ],
  "reward": {
   "xp": 52
  },
  "storyDe": "Ein stiller Umweg führt zu Mühlensteg.",
  "storyEn": "A quiet detour leads to Mühlensteg."
 },
 {
  "id": "L01s29",
  "league": 1,
  "place": "Alter Markt",
  "col": 3,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 60,
   "gold": 48
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Alter Markt.",
  "storyEn": "A side path branches toward Alter Markt."
 },
 {
  "id": "L01s30",
  "league": 1,
  "place": "Wachtbaum",
  "col": 4,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L01s35"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Die Prüfung wartet bei Wachtbaum.",
  "storyEn": "The trial waits at Wachtbaum."
 },
 {
  "id": "L01s31",
  "league": 1,
  "place": "Kalkhöhle",
  "col": 5,
  "row": 6,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 60,
   "gold": 27
  },
  "storyDe": "Ein stiller Umweg führt zu Kalkhöhle.",
  "storyEn": "A quiet detour leads to Kalkhöhle."
 },
 {
  "id": "L01s32",
  "league": 1,
  "place": "Grenzstein",
  "col": 1,
  "row": 6,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 60,
   "gold": 48
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Grenzstein.",
  "storyEn": "A side path branches toward Grenzstein."
 },
 {
  "id": "L01s33",
  "league": 1,
  "place": "Jagdrast",
  "col": 5,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L01s31"
  ],
  "reward": {
   "xp": 60
  },
  "storyDe": "Abseits des Weges liegt Jagdrast.",
  "storyEn": "Off the road lies Jagdrast."
 },
 {
  "id": "L01s34",
  "league": 1,
  "place": "Sonnenhang",
  "col": 5,
  "row": 7,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L01s33"
  ],
  "reward": {
   "xp": 52
  },
  "storyDe": "Ein stiller Umweg führt zu Sonnenhang.",
  "storyEn": "A quiet detour leads to Sonnenhang."
 },
 {
  "id": "L01s35",
  "league": 1,
  "place": "Talsperre",
  "col": 4,
  "row": 7,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L01s34",
   "L01s37"
  ],
  "reward": {
   "xp": 81
  },
  "storyDe": "Die Prüfung wartet bei Talsperre.",
  "storyEn": "The trial waits at Talsperre.",
  "boss": {
   "piece": "paladin",
   "wins": 1
  },
  "tier": 2
 },
 {
  "id": "L01s36",
  "league": 1,
  "place": "Brackwasserbrücke",
  "col": 3,
  "row": 7,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s38"
  ],
  "reward": {
   "xp": 60
  },
  "storyDe": "Abseits des Weges liegt Brackwasserbrücke.",
  "storyEn": "Off the road lies Brackwasserbrücke."
 },
 {
  "id": "L01s37",
  "league": 1,
  "place": "Steinkreis",
  "col": 4,
  "row": 7,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s39"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Der letzte Anstieg:  Steinkreis.",
  "storyEn": "The final ascent:  Steinkreis."
 },
 {
  "id": "L01s38",
  "league": 1,
  "place": "Hirtenruh",
  "col": 3,
  "row": 7,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s41"
  ],
  "reward": {
   "xp": 60
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Hirtenruh.",
  "storyEn": "A side path branches toward Hirtenruh."
 },
 {
  "id": "L01s39",
  "league": 1,
  "place": "Königsallee",
  "col": 4,
  "row": 7,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s40"
  ],
  "reward": {
   "xp": 87
  },
  "storyDe": "Der letzte Anstieg:  Königsallee.",
  "storyEn": "The final ascent:  Königsallee."
 },
 {
  "id": "L01s40",
  "league": 1,
  "place": "Pilgerpfad",
  "col": 4,
  "row": 8,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s42"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Der letzte Anstieg:  Pilgerpfad.",
  "storyEn": "The final ascent:  Pilgerpfad."
 },
 {
  "id": "L01s41",
  "league": 1,
  "place": "Rabenstieg",
  "col": 3,
  "row": 8,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 60,
   "gold": 48
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Rabenstieg.",
  "storyEn": "A side path branches toward Rabenstieg."
 },
 {
  "id": "L01s42",
  "league": 1,
  "place": "Feldkapelle",
  "col": 5,
  "row": 8,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s43"
  ],
  "reward": {
   "xp": 93
  },
  "storyDe": "Der letzte Anstieg:  Feldkapelle.",
  "storyEn": "The final ascent:  Feldkapelle."
 },
 {
  "id": "L01s43",
  "league": 1,
  "place": "Heckenrondell",
  "col": 5,
  "row": 9,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L01s44"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Der letzte Anstieg:  Heckenrondell.",
  "storyEn": "The final ascent:  Heckenrondell."
 },
 {
  "id": "L01s44",
  "league": 1,
  "place": "Torfstich",
  "col": 5,
  "row": 9,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 99,
   "gold": 24
  },
  "storyDe": "Torfstich: Hier wartet der Meister von Kapitel I.",
  "storyEn": "Torfstich: here waits the master of chapter I.",
  "boss": {
   "pure": "b25"
  },
  "tier": 4
 },
 {
  "id": "L02s00",
  "league": 2,
  "place": "Sichelmark",
  "col": 1,
  "row": 1,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L02s02"
  ],
  "reward": {
   "xp": 42
  },
  "storyDe": "Der Weg beginnt bei Sichelmark.",
  "storyEn": "The road begins at Sichelmark."
 },
 {
  "id": "L02s01",
  "league": 2,
  "place": "Zehntwacht",
  "col": 3,
  "row": 2,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 66,
   "gold": 32
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Zehntwacht.",
  "storyEn": "A side path branches toward Zehntwacht."
 },
 {
  "id": "L02s02",
  "league": 2,
  "place": "Kapelle im Korn",
  "col": 1,
  "row": 2,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L02s03",
   "L02s04"
  ],
  "reward": {
   "xp": 45
  },
  "storyDe": "Der Weg beginnt bei Kapelle im Korn.",
  "storyEn": "The road begins at Kapelle im Korn."
 },
 {
  "id": "L02s03",
  "league": 2,
  "place": "Garbenwall",
  "col": 1,
  "row": 2,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L02s04",
   "L02s06"
  ],
  "reward": {
   "xp": 48
  },
  "storyDe": "Der Weg beginnt bei Garbenwall.",
  "storyEn": "The road begins at Garbenwall."
 },
 {
  "id": "L02s04",
  "league": 2,
  "place": "Krähenschreck",
  "col": 1,
  "row": 3,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L02s09"
  ],
  "reward": {
   "xp": 58
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Krähenschreck.",
  "storyEn": "A side path branches toward Krähenschreck."
 },
 {
  "id": "L02s05",
  "league": 2,
  "place": "Der lange Acker",
  "col": 3,
  "row": 3,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L02s01"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Abseits des Weges liegt Der lange Acker.",
  "storyEn": "Off the road lies Der lange Acker."
 },
 {
  "id": "L02s06",
  "league": 2,
  "place": "Wo die Sense ruht",
  "col": 1,
  "row": 3,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L02s07"
  ],
  "reward": {
   "xp": 51
  },
  "storyDe": "Der Weg beginnt bei Wo die Sense ruht.",
  "storyEn": "The road begins at Wo die Sense ruht."
 },
 {
  "id": "L02s07",
  "league": 2,
  "place": "Spreugericht",
  "col": 2,
  "row": 3,
  "map": "arena",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L02s10"
  ],
  "reward": {
   "xp": 54
  },
  "storyDe": "Der Weg beginnt bei Spreugericht.",
  "storyEn": "The road begins at Spreugericht."
 },
 {
  "id": "L02s08",
  "league": 2,
  "place": "Mittsommerbank",
  "col": 3,
  "row": 3,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L02s05"
  ],
  "reward": {
   "xp": 58
  },
  "storyDe": "Abseits des Weges liegt Mittsommerbank.",
  "storyEn": "Off the road lies Mittsommerbank."
 },
 {
  "id": "L02s09",
  "league": 2,
  "place": "Lerchenhorst",
  "col": 1,
  "row": 3,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L02s13"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Ein stiller Umweg führt zu Lerchenhorst.",
  "storyEn": "A quiet detour leads to Lerchenhorst."
 },
 {
  "id": "L02s10",
  "league": 2,
  "place": "Dreschhof",
  "col": 2,
  "row": 4,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L02s12"
  ],
  "reward": {
   "xp": 57
  },
  "storyDe": "Der Pfad führt weiter über Dreschhof.",
  "storyEn": "The path leads on across Dreschhof.",
  "boss": {
   "pure": "b02",
   "rotation": [
    "b02",
    "b11"
   ]
  },
  "tier": 2
 },
 {
  "id": "L02s11",
  "league": 2,
  "place": "Schwelrain",
  "col": 5,
  "row": 4,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 66,
   "gold": 32
  },
  "storyDe": "Abseits des Weges liegt Schwelrain.",
  "storyEn": "Off the road lies Schwelrain."
 },
 {
  "id": "L02s12",
  "league": 2,
  "place": "Brandblatt",
  "col": 2,
  "row": 4,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L02s08",
   "L02s15"
  ],
  "reward": {
   "xp": 60
  },
  "storyDe": "Der Pfad führt weiter über Brandblatt.",
  "storyEn": "The path leads on across Brandblatt."
 },
 {
  "id": "L02s13",
  "league": 2,
  "place": "Volle Scheuer",
  "col": 1,
  "row": 4,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L02s14",
   "L02s18"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Volle Scheuer.",
  "storyEn": "A side path branches toward Volle Scheuer."
 },
 {
  "id": "L02s14",
  "league": 2,
  "place": "Lindensitz",
  "col": 1,
  "row": 4,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 66,
   "gold": 56
  },
  "storyDe": "Abseits des Weges liegt Lindensitz.",
  "storyEn": "Off the road lies Lindensitz."
 },
 {
  "id": "L02s15",
  "league": 2,
  "place": "Fürstenmahd",
  "col": 3,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L02s17"
  ],
  "reward": {
   "xp": 63
  },
  "storyDe": "Der Pfad führt weiter über Fürstenmahd.",
  "storyEn": "The path leads on across Fürstenmahd."
 },
 {
  "id": "L02s16",
  "league": 2,
  "place": "Der Steinerne Pflug",
  "col": 4,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L02s11"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Der Steinerne Pflug.",
  "storyEn": "A side path branches toward Der Steinerne Pflug."
 },
 {
  "id": "L02s17",
  "league": 2,
  "place": "Grenzmark",
  "col": 3,
  "row": 5,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L02s21"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Der Pfad führt weiter über Grenzmark.",
  "storyEn": "The path leads on across Grenzmark."
 },
 {
  "id": "L02s18",
  "league": 2,
  "place": "Kanzel im Weizen",
  "col": 1,
  "row": 5,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L02s23"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Ein stiller Umweg führt zu Kanzel im Weizen.",
  "storyEn": "A quiet detour leads to Kanzel im Weizen."
 },
 {
  "id": "L02s19",
  "league": 2,
  "place": "Waage und Wort",
  "col": 4,
  "row": 5,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L02s16"
  ],
  "reward": {
   "xp": 58
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Waage und Wort.",
  "storyEn": "A side path branches toward Waage und Wort."
 },
 {
  "id": "L02s20",
  "league": 2,
  "place": "Glutstoppel",
  "col": 3,
  "row": 5,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L02s22"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Die Prüfung wartet bei Glutstoppel.",
  "storyEn": "The trial waits at Glutstoppel.",
  "boss": {
   "piece": "hawk",
   "wins": 1
  },
  "tier": 2
 },
 {
  "id": "L02s21",
  "league": 2,
  "place": "Fronburg",
  "col": 3,
  "row": 5,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L02s20",
   "L02s25"
  ],
  "reward": {
   "xp": 69
  },
  "storyDe": "Die Prüfung wartet bei Fronburg.",
  "storyEn": "The trial waits at Fronburg."
 },
 {
  "id": "L02s22",
  "league": 2,
  "place": "Leere Scheune",
  "col": 4,
  "row": 6,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L02s19",
   "L02s24"
  ],
  "reward": {
   "xp": 75
  },
  "storyDe": "Die Prüfung wartet bei Leere Scheune.",
  "storyEn": "The trial waits at Leere Scheune."
 },
 {
  "id": "L02s23",
  "league": 2,
  "place": "Wetterhahnturm",
  "col": 1,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L02s28"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Abseits des Weges liegt Wetterhahnturm.",
  "storyEn": "Off the road lies Wetterhahnturm."
 },
 {
  "id": "L02s24",
  "league": 2,
  "place": "Wende des Lichts",
  "col": 4,
  "row": 6,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L02s30"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Die Prüfung wartet bei Wende des Lichts.",
  "storyEn": "The trial waits at Wende des Lichts."
 },
 {
  "id": "L02s25",
  "league": 2,
  "place": "Königsstroh",
  "col": 3,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L02s27",
   "L02s31"
  ],
  "reward": {
   "xp": 58
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Königsstroh.",
  "storyEn": "A side path branches toward Königsstroh."
 },
 {
  "id": "L02s26",
  "league": 2,
  "place": "Aschengarbe",
  "col": 5,
  "row": 6,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 66,
   "gold": 32
  },
  "storyDe": "Abseits des Weges liegt Aschengarbe.",
  "storyEn": "Off the road lies Aschengarbe."
 },
 {
  "id": "L02s27",
  "league": 2,
  "place": "Osrics Speicher",
  "col": 3,
  "row": 6,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L02s32"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Ein stiller Umweg führt zu Osrics Speicher.",
  "storyEn": "A quiet detour leads to Osrics Speicher."
 },
 {
  "id": "L02s28",
  "league": 2,
  "place": "Fuhrmannsrast",
  "col": 1,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 66
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Fuhrmannsrast.",
  "storyEn": "A side path branches toward Fuhrmannsrast.",
  "boss": {
   "piece": "bard",
   "wins": 1
  },
  "tier": 1
 },
 {
  "id": "L02s29",
  "league": 2,
  "place": "Dürretor",
  "col": 5,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L02s26"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Abseits des Weges liegt Dürretor.",
  "storyEn": "Off the road lies Dürretor."
 },
 {
  "id": "L02s30",
  "league": 2,
  "place": "Erntewiege",
  "col": 4,
  "row": 7,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L02s34"
  ],
  "reward": {
   "xp": 81
  },
  "storyDe": "Die Prüfung wartet bei Erntewiege.",
  "storyEn": "The trial waits at Erntewiege."
 },
 {
  "id": "L02s31",
  "league": 2,
  "place": "Mohnwerder",
  "col": 3,
  "row": 7,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L02s35"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Mohnwerder.",
  "storyEn": "A side path branches toward Mohnwerder."
 },
 {
  "id": "L02s32",
  "league": 2,
  "place": "Gebeugte Kapelle",
  "col": 2,
  "row": 7,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 66,
   "gold": 56
  },
  "storyDe": "Abseits des Weges liegt Gebeugte Kapelle.",
  "storyEn": "Off the road lies Gebeugte Kapelle."
 },
 {
  "id": "L02s33",
  "league": 2,
  "place": "Sichelbucht",
  "col": 5,
  "row": 7,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L02s29"
  ],
  "reward": {
   "xp": 58
  },
  "storyDe": "Ein stiller Umweg führt zu Sichelbucht.",
  "storyEn": "A quiet detour leads to Sichelbucht."
 },
 {
  "id": "L02s34",
  "league": 2,
  "place": "Flammenfurt",
  "col": 4,
  "row": 7,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L02s33",
   "L02s36"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Der letzte Anstieg:  Flammenfurt.",
  "storyEn": "The final ascent:  Flammenfurt."
 },
 {
  "id": "L02s35",
  "league": 2,
  "place": "Halmbruch",
  "col": 3,
  "row": 7,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L02s37"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Abseits des Weges liegt Halmbruch.",
  "storyEn": "Off the road lies Halmbruch."
 },
 {
  "id": "L02s36",
  "league": 2,
  "place": "Dörrkammer",
  "col": 4,
  "row": 8,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L02s38"
  ],
  "reward": {
   "xp": 87
  },
  "storyDe": "Der letzte Anstieg:  Dörrkammer.",
  "storyEn": "The final ascent:  Dörrkammer."
 },
 {
  "id": "L02s37",
  "league": 2,
  "place": "Windfähre",
  "col": 3,
  "row": 8,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L02s39"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Windfähre.",
  "storyEn": "A side path branches toward Windfähre."
 },
 {
  "id": "L02s38",
  "league": 2,
  "place": "Mautbalken",
  "col": 4,
  "row": 8,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L02s40"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Der letzte Anstieg:  Mautbalken.",
  "storyEn": "The final ascent:  Mautbalken."
 },
 {
  "id": "L02s39",
  "league": 2,
  "place": "Bei den Schnittern",
  "col": 2,
  "row": 8,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 66,
   "gold": 56
  },
  "storyDe": "Ein stiller Umweg führt zu Bei den Schnittern.",
  "storyEn": "A quiet detour leads to Bei den Schnittern."
 },
 {
  "id": "L02s40",
  "league": 2,
  "place": "Der Schweigende Halm",
  "col": 5,
  "row": 9,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L02s41"
  ],
  "reward": {
   "xp": 93
  },
  "storyDe": "Der letzte Anstieg:  Der Schweigende Halm.",
  "storyEn": "The final ascent:  Der Schweigende Halm."
 },
 {
  "id": "L02s41",
  "league": 2,
  "place": "Welkgart",
  "col": 5,
  "row": 9,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 96,
   "gold": 28
  },
  "storyDe": "Welkgart: Hier wartet der Meister von Kapitel II.",
  "storyEn": "Welkgart: here waits the master of chapter II.",
  "boss": {
   "pure": "b12"
  },
  "tier": 4
 },
 {
  "id": "L03s00",
  "league": 3,
  "place": "Erstes Rot",
  "col": 0,
  "row": 1,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L03s04"
  ],
  "reward": {
   "xp": 48
  },
  "storyDe": "Der Weg beginnt bei Erstes Rot.",
  "storyEn": "The road begins at Erstes Rot."
 },
 {
  "id": "L03s01",
  "league": 3,
  "place": "Rostlaube",
  "col": 2,
  "row": 1,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 72,
   "gold": 37
  },
  "storyDe": "Abseits des Weges liegt Rostlaube.",
  "storyEn": "Off the road lies Rostlaube."
 },
 {
  "id": "L03s02",
  "league": 3,
  "place": "Bernsteinaltar",
  "col": 1,
  "row": 2,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L03s06"
  ],
  "reward": {
   "xp": 51
  },
  "storyDe": "Der Weg beginnt bei Bernsteinaltar.",
  "storyEn": "The road begins at Bernsteinaltar."
 },
 {
  "id": "L03s03",
  "league": 3,
  "place": "Kastanienhall",
  "col": 5,
  "row": 2,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 72,
   "gold": 64
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Kastanienhall.",
  "storyEn": "A side path branches toward Kastanienhall."
 },
 {
  "id": "L03s04",
  "league": 3,
  "place": "Ockergrund",
  "col": 1,
  "row": 2,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s02",
   "L03s09"
  ],
  "reward": {
   "xp": 64
  },
  "storyDe": "Abseits des Weges liegt Ockergrund.",
  "storyEn": "Off the road lies Ockergrund."
 },
 {
  "id": "L03s05",
  "league": 3,
  "place": "Der Rehpfad",
  "col": 2,
  "row": 2,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L03s01"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Ein stiller Umweg führt zu Der Rehpfad.",
  "storyEn": "A quiet detour leads to Der Rehpfad."
 },
 {
  "id": "L03s06",
  "league": 3,
  "place": "Wo der Eid brach",
  "col": 1,
  "row": 3,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L03s07"
  ],
  "reward": {
   "xp": 54
  },
  "storyDe": "Der Weg beginnt bei Wo der Eid brach.",
  "storyEn": "The road begins at Wo der Eid brach."
 },
 {
  "id": "L03s07",
  "league": 3,
  "place": "Klingenwald",
  "col": 2,
  "row": 3,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L03s11"
  ],
  "reward": {
   "xp": 57
  },
  "storyDe": "Der Weg beginnt bei Klingenwald.",
  "storyEn": "The road begins at Klingenwald."
 },
 {
  "id": "L03s08",
  "league": 3,
  "place": "Erntedank",
  "col": 2,
  "row": 3,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L03s05"
  ],
  "reward": {
   "xp": 64
  },
  "storyDe": "Ein stiller Umweg führt zu Erntedank.",
  "storyEn": "A quiet detour leads to Erntedank."
 },
 {
  "id": "L03s09",
  "league": 3,
  "place": "Drosselsang",
  "col": 1,
  "row": 3,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s12"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Drosselsang.",
  "storyEn": "A side path branches toward Drosselsang."
 },
 {
  "id": "L03s10",
  "league": 3,
  "place": "Schwelnest",
  "col": 5,
  "row": 4,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s03"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Abseits des Weges liegt Schwelnest.",
  "storyEn": "Off the road lies Schwelnest."
 },
 {
  "id": "L03s11",
  "league": 3,
  "place": "Falbes Licht",
  "col": 2,
  "row": 4,
  "map": "arena",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L03s08",
   "L03s13"
  ],
  "reward": {
   "xp": 60
  },
  "storyDe": "Der Pfad führt weiter über Falbes Licht.",
  "storyEn": "The path leads on across Falbes Licht."
 },
 {
  "id": "L03s12",
  "league": 3,
  "place": "Fallendes Laub",
  "col": 1,
  "row": 4,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s16"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Fallendes Laub.",
  "storyEn": "A side path branches toward Fallendes Laub."
 },
 {
  "id": "L03s13",
  "league": 3,
  "place": "Zwillingsfeste",
  "col": 2,
  "row": 4,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L03s15"
  ],
  "reward": {
   "xp": 63
  },
  "storyDe": "Der Pfad führt weiter über Zwillingsfeste.",
  "storyEn": "The path leads on across Zwillingsfeste.",
  "boss": {
   "pure": "b24",
   "rotation": [
    "b24",
    "b05"
   ]
  },
  "tier": 3
 },
 {
  "id": "L03s14",
  "league": 3,
  "place": "Lindenschatten",
  "col": 5,
  "row": 4,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s10"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Ein stiller Umweg führt zu Lindenschatten.",
  "storyEn": "A quiet detour leads to Lindenschatten."
 },
 {
  "id": "L03s15",
  "league": 3,
  "place": "Amselthron",
  "col": 2,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L03s17"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Der Pfad führt weiter über Amselthron.",
  "storyEn": "The path leads on across Amselthron."
 },
 {
  "id": "L03s16",
  "league": 3,
  "place": "Der Rostige Riegel",
  "col": 1,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s21"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Abseits des Weges liegt Der Rostige Riegel.",
  "storyEn": "Off the road lies Der Rostige Riegel."
 },
 {
  "id": "L03s17",
  "league": 3,
  "place": "Laubpresse",
  "col": 3,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L03s19",
   "L03s20"
  ],
  "reward": {
   "xp": 69
  },
  "storyDe": "Der Pfad führt weiter über Laubpresse.",
  "storyEn": "The path leads on across Laubpresse."
 },
 {
  "id": "L03s18",
  "league": 3,
  "place": "Wipfelkanzel",
  "col": 5,
  "row": 5,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s14"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Wipfelkanzel.",
  "storyEn": "A side path branches toward Wipfelkanzel."
 },
 {
  "id": "L03s19",
  "league": 3,
  "place": "Halle der zwei Schwüre",
  "col": 2,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s24"
  ],
  "reward": {
   "xp": 64
  },
  "storyDe": "Abseits des Weges liegt Halle der zwei Schwüre.",
  "storyEn": "Off the road lies Halle der zwei Schwüre."
 },
 {
  "id": "L03s20",
  "league": 3,
  "place": "Harzträne",
  "col": 3,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L03s23"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Die Prüfung wartet bei Harzträne.",
  "storyEn": "The trial waits at Harzträne."
 },
 {
  "id": "L03s21",
  "league": 3,
  "place": "Pilzring",
  "col": 1,
  "row": 6,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 72,
   "gold": 64
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Pilzring.",
  "storyEn": "A side path branches toward Pilzring."
 },
 {
  "id": "L03s22",
  "league": 3,
  "place": "Morschenburg",
  "col": 5,
  "row": 6,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s18",
   "L03s25"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Abseits des Weges liegt Morschenburg.",
  "storyEn": "Off the road lies Morschenburg."
 },
 {
  "id": "L03s23",
  "league": 3,
  "place": "Sturmlaub",
  "col": 3,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L03s27",
   "L03s28"
  ],
  "reward": {
   "xp": 75
  },
  "storyDe": "Die Prüfung wartet bei Sturmlaub.",
  "storyEn": "The trial waits at Sturmlaub.",
  "boss": {
   "piece": "alchemist",
   "wins": 1
  },
  "tier": 3
 },
 {
  "id": "L03s24",
  "league": 3,
  "place": "Dämmerlaube",
  "col": 2,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s29"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Dämmerlaube.",
  "storyEn": "A side path branches toward Dämmerlaube."
 },
 {
  "id": "L03s25",
  "league": 3,
  "place": "Königslaub",
  "col": 5,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s30"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Abseits des Weges liegt Königslaub.",
  "storyEn": "Off the road lies Königslaub."
 },
 {
  "id": "L03s26",
  "league": 3,
  "place": "Gilbfeuer",
  "col": 4,
  "row": 6,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s22"
  ],
  "reward": {
   "xp": 64
  },
  "storyDe": "Ein stiller Umweg führt zu Gilbfeuer.",
  "storyEn": "A quiet detour leads to Gilbfeuer."
 },
 {
  "id": "L03s27",
  "league": 3,
  "place": "Der geteilte Schwur",
  "col": 4,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L03s31"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Die Prüfung wartet bei Der geteilte Schwur.",
  "storyEn": "The trial waits at Der geteilte Schwur."
 },
 {
  "id": "L03s28",
  "league": 3,
  "place": "Köhlersitz",
  "col": 3,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s33"
  ],
  "reward": {
   "xp": 64
  },
  "storyDe": "Abseits des Weges liegt Köhlersitz.",
  "storyEn": "Off the road lies Köhlersitz."
 },
 {
  "id": "L03s29",
  "league": 3,
  "place": "Moderpforte",
  "col": 2,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s32"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Ein stiller Umweg führt zu Moderpforte.",
  "storyEn": "A quiet detour leads to Moderpforte."
 },
 {
  "id": "L03s30",
  "league": 3,
  "place": "Wandererrast",
  "col": 5,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 72,
   "gold": 64
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Wandererrast.",
  "storyEn": "A side path branches toward Wandererrast."
 },
 {
  "id": "L03s31",
  "league": 3,
  "place": "Eichelschatz",
  "col": 4,
  "row": 7,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L03s26",
   "L03s34"
  ],
  "reward": {
   "xp": 81
  },
  "storyDe": "Die Prüfung wartet bei Eichelschatz.",
  "storyEn": "The trial waits at Eichelschatz."
 },
 {
  "id": "L03s32",
  "league": 3,
  "place": "Verhüllter Altar",
  "col": 2,
  "row": 7,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s36"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Ein stiller Umweg führt zu Verhüllter Altar.",
  "storyEn": "A quiet detour leads to Verhüllter Altar."
 },
 {
  "id": "L03s33",
  "league": 3,
  "place": "Treibholzufer",
  "col": 3,
  "row": 7,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s35"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Treibholzufer.",
  "storyEn": "A side path branches toward Treibholzufer."
 },
 {
  "id": "L03s34",
  "league": 3,
  "place": "Fuchsfurt",
  "col": 4,
  "row": 7,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s37"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Der letzte Anstieg:  Fuchsfurt.",
  "storyEn": "The final ascent:  Fuchsfurt."
 },
 {
  "id": "L03s35",
  "league": 3,
  "place": "Wurzelgewölbe",
  "col": 3,
  "row": 7,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s38"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Ein stiller Umweg führt zu Wurzelgewölbe.",
  "storyEn": "A quiet detour leads to Wurzelgewölbe."
 },
 {
  "id": "L03s36",
  "league": 3,
  "place": "Eulenwarte",
  "col": 2,
  "row": 7,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 72,
   "gold": 64
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Eulenwarte.",
  "storyEn": "A side path branches toward Eulenwarte."
 },
 {
  "id": "L03s37",
  "league": 3,
  "place": "Blätterkahn",
  "col": 4,
  "row": 8,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s39"
  ],
  "reward": {
   "xp": 87
  },
  "storyDe": "Der letzte Anstieg:  Blätterkahn.",
  "storyEn": "The final ascent:  Blätterkahn."
 },
 {
  "id": "L03s38",
  "league": 3,
  "place": "Ahornbrück",
  "col": 4,
  "row": 8,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s40"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Ein stiller Umweg führt zu Ahornbrück.",
  "storyEn": "A quiet detour leads to Ahornbrück."
 },
 {
  "id": "L03s39",
  "league": 3,
  "place": "Marderschlupf",
  "col": 4,
  "row": 8,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s41"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Der letzte Anstieg:  Marderschlupf.",
  "storyEn": "The final ascent:  Marderschlupf."
 },
 {
  "id": "L03s40",
  "league": 3,
  "place": "Der Stumme Hain",
  "col": 3,
  "row": 8,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 72,
   "gold": 64
  },
  "storyDe": "Abseits des Weges liegt Der Stumme Hain.",
  "storyEn": "Off the road lies Der Stumme Hain."
 },
 {
  "id": "L03s41",
  "league": 3,
  "place": "Modergraben",
  "col": 4,
  "row": 9,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L03s42"
  ],
  "reward": {
   "xp": 93
  },
  "storyDe": "Der letzte Anstieg:  Modergraben.",
  "storyEn": "The final ascent:  Modergraben."
 },
 {
  "id": "L03s42",
  "league": 3,
  "place": "Reisigschneise",
  "col": 4,
  "row": 9,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 96,
   "gold": 32
  },
  "storyDe": "Reisigschneise: Hier wartet der Meister von Kapitel III.",
  "storyEn": "Reisigschneise: here waits the master of chapter III.",
  "boss": {
   "pure": "b10"
  },
  "tier": 4
 },
 {
  "id": "L04s00",
  "league": 4,
  "place": "Über die Baumgrenze",
  "col": 0,
  "row": 1,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L04s01"
  ],
  "reward": {
   "xp": 54
  },
  "storyDe": "Der Weg beginnt bei Über die Baumgrenze.",
  "storyEn": "The road begins at Über die Baumgrenze."
 },
 {
  "id": "L04s01",
  "league": 4,
  "place": "Latschenfeld",
  "col": 1,
  "row": 1,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L04s02"
  ],
  "reward": {
   "xp": 57
  },
  "storyDe": "Der Weg beginnt bei Latschenfeld.",
  "storyEn": "The road begins at Latschenfeld."
 },
 {
  "id": "L04s02",
  "league": 4,
  "place": "Die Windflüchter",
  "col": 1,
  "row": 2,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L04s04"
  ],
  "reward": {
   "xp": 60
  },
  "storyDe": "Der Weg beginnt bei Die Windflüchter.",
  "storyEn": "The road begins at Die Windflüchter."
 },
 {
  "id": "L04s03",
  "league": 4,
  "place": "Almrast",
  "col": 4,
  "row": 2,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s37"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Abseits des Weges liegt Almrast.",
  "storyEn": "Off the road lies Almrast."
 },
 {
  "id": "L04s04",
  "league": 4,
  "place": "Steinmandl",
  "col": 1,
  "row": 3,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L04s06"
  ],
  "reward": {
   "xp": 63
  },
  "storyDe": "Der Weg beginnt bei Steinmandl.",
  "storyEn": "The road begins at Steinmandl."
 },
 {
  "id": "L04s05",
  "league": 4,
  "place": "Der Krumme Hain",
  "col": 4,
  "row": 3,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s03"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Der Krumme Hain.",
  "storyEn": "A side path branches toward Der Krumme Hain."
 },
 {
  "id": "L04s06",
  "league": 4,
  "place": "Hirtenkanzel",
  "col": 2,
  "row": 3,
  "map": "arena",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L04s08"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Der Weg beginnt bei Hirtenkanzel.",
  "storyEn": "The road begins at Hirtenkanzel."
 },
 {
  "id": "L04s07",
  "league": 4,
  "place": "Wetterbaum",
  "col": 3,
  "row": 4,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s05"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Ein stiller Umweg führt zu Wetterbaum.",
  "storyEn": "A quiet detour leads to Wetterbaum."
 },
 {
  "id": "L04s08",
  "league": 4,
  "place": "Zwieselgrund",
  "col": 2,
  "row": 4,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L04s10"
  ],
  "reward": {
   "xp": 69
  },
  "storyDe": "Der Pfad führt weiter über Zwieselgrund.",
  "storyEn": "The path leads on across Zwieselgrund."
 },
 {
  "id": "L04s09",
  "league": 4,
  "place": "Die letzte Alm",
  "col": 3,
  "row": 4,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s07"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Abseits des Weges liegt Die letzte Alm.",
  "storyEn": "Off the road lies Die letzte Alm."
 },
 {
  "id": "L04s10",
  "league": 4,
  "place": "Käserast",
  "col": 2,
  "row": 4,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L04s11",
   "L04s39"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Der Pfad führt weiter über Käserast.",
  "storyEn": "The path leads on across Käserast.",
  "boss": {
   "pure": "b09",
   "rotation": [
    "b09",
    "b13"
   ]
  },
  "tier": 2
 },
 {
  "id": "L04s11",
  "league": 4,
  "place": "Hochleger",
  "col": 2,
  "row": 4,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L04s13"
  ],
  "reward": {
   "xp": 75
  },
  "storyDe": "Der Pfad führt weiter über Hochleger.",
  "storyEn": "The path leads on across Hochleger."
 },
 {
  "id": "L04s12",
  "league": 4,
  "place": "Marchstein",
  "col": 3,
  "row": 4,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L04s15",
   "L04s42"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Die Prüfung wartet bei Marchstein.",
  "storyEn": "The trial waits at Marchstein."
 },
 {
  "id": "L04s13",
  "league": 4,
  "place": "Gamswechsel",
  "col": 2,
  "row": 4,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L04s14",
   "L04s41"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Der Pfad führt weiter über Gamswechsel.",
  "storyEn": "The path leads on across Gamswechsel."
 },
 {
  "id": "L04s14",
  "league": 4,
  "place": "Die Schindelhütte",
  "col": 3,
  "row": 4,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L04s12"
  ],
  "reward": {
   "xp": 81
  },
  "storyDe": "Der Pfad führt weiter über Die Schindelhütte.",
  "storyEn": "The path leads on across Die Schindelhütte."
 },
 {
  "id": "L04s15",
  "league": 4,
  "place": "Windkamm",
  "col": 3,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L04s16"
  ],
  "reward": {
   "xp": 87
  },
  "storyDe": "Die Prüfung wartet bei Windkamm.",
  "storyEn": "The trial waits at Windkamm.",
  "boss": {
   "piece": "sorceress",
   "wins": 1
  },
  "tier": 3
 },
 {
  "id": "L04s16",
  "league": 4,
  "place": "Lärchentor",
  "col": 3,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L04s21"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Die Prüfung wartet bei Lärchentor.",
  "storyEn": "The trial waits at Lärchentor."
 },
 {
  "id": "L04s17",
  "league": 4,
  "place": "Wurzelstieg",
  "col": 5,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 78,
   "gold": 72
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Wurzelstieg.",
  "storyEn": "A side path branches toward Wurzelstieg."
 },
 {
  "id": "L04s18",
  "league": 4,
  "place": "Der Zerzauste Wald",
  "col": 1,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s23"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Abseits des Weges liegt Der Zerzauste Wald.",
  "storyEn": "Off the road lies Der Zerzauste Wald."
 },
 {
  "id": "L04s19",
  "league": 4,
  "place": "Almglocken",
  "col": 5,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s17"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Ein stiller Umweg führt zu Almglocken.",
  "storyEn": "A quiet detour leads to Almglocken."
 },
 {
  "id": "L04s20",
  "league": 4,
  "place": "Bergahornhof",
  "col": 2,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 78,
   "gold": 42
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Bergahornhof.",
  "storyEn": "A side path branches toward Bergahornhof."
 },
 {
  "id": "L04s21",
  "league": 4,
  "place": "Die Kahle Kuppe",
  "col": 4,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L04s24",
   "L04s36"
  ],
  "reward": {
   "xp": 93
  },
  "storyDe": "Die Prüfung wartet bei Die Kahle Kuppe.",
  "storyEn": "The trial waits at Die Kahle Kuppe."
 },
 {
  "id": "L04s22",
  "league": 4,
  "place": "Hüttenrauch",
  "col": 5,
  "row": 6,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s19",
   "L04s31"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Ein stiller Umweg führt zu Hüttenrauch.",
  "storyEn": "A quiet detour leads to Hüttenrauch."
 },
 {
  "id": "L04s23",
  "league": 4,
  "place": "Sennenwacht",
  "col": 1,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s25"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Sennenwacht.",
  "storyEn": "A side path branches toward Sennenwacht."
 },
 {
  "id": "L04s24",
  "league": 4,
  "place": "Der Steile Anger",
  "col": 4,
  "row": 7,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L04s26",
   "L04s32"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Die Prüfung wartet bei Der Steile Anger.",
  "storyEn": "The trial waits at Der Steile Anger."
 },
 {
  "id": "L04s25",
  "league": 4,
  "place": "Wildheuplatz",
  "col": 1,
  "row": 7,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 78,
   "gold": 72
  },
  "storyDe": "Ein stiller Umweg führt zu Wildheuplatz.",
  "storyEn": "A quiet detour leads to Wildheuplatz."
 },
 {
  "id": "L04s26",
  "league": 4,
  "place": "Felsenfenster",
  "col": 4,
  "row": 7,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L04s27"
  ],
  "reward": {
   "xp": 70
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Felsenfenster.",
  "storyEn": "A side path branches toward Felsenfenster."
 },
 {
  "id": "L04s27",
  "league": 4,
  "place": "Zundermoos",
  "col": 4,
  "row": 8,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L04s28"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Abseits des Weges liegt Zundermoos.",
  "storyEn": "Off the road lies Zundermoos."
 },
 {
  "id": "L04s28",
  "league": 4,
  "place": "Die Wolkenweide",
  "col": 3,
  "row": 8,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 78,
   "gold": 42
  },
  "storyDe": "Ein stiller Umweg führt zu Die Wolkenweide.",
  "storyEn": "A quiet detour leads to Die Wolkenweide."
 },
 {
  "id": "L04s29",
  "league": 4,
  "place": "Salzleck",
  "col": 5,
  "row": 9,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s30"
  ],
  "reward": {
   "xp": 111
  },
  "storyDe": "Der letzte Anstieg:  Salzleck.",
  "storyEn": "The final ascent:  Salzleck."
 },
 {
  "id": "L04s30",
  "league": 4,
  "place": "Der Geduckte Forst",
  "col": 5,
  "row": 9,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 114,
   "gold": 36
  },
  "storyDe": "Der Geduckte Forst: Hier wartet der Meister von Kapitel IV.",
  "storyEn": "Der Geduckte Forst: here waits the master of chapter IV.",
  "boss": {
   "pure": "b02"
  },
  "tier": 4
 },
 {
  "id": "L04s31",
  "league": 4,
  "place": "Gratrast",
  "col": 5,
  "row": 7,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 78,
   "gold": 72
  },
  "storyDe": "Ein stiller Umweg führt zu Gratrast.",
  "storyEn": "A quiet detour leads to Gratrast."
 },
 {
  "id": "L04s32",
  "league": 4,
  "place": "Murmelfeld",
  "col": 4,
  "row": 7,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s33"
  ],
  "reward": {
   "xp": 99
  },
  "storyDe": "Der letzte Anstieg:  Murmelfeld.",
  "storyEn": "The final ascent:  Murmelfeld."
 },
 {
  "id": "L04s33",
  "league": 4,
  "place": "Die Zwei Wetterfichten",
  "col": 4,
  "row": 7,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s34"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Der letzte Anstieg:  Die Zwei Wetterfichten.",
  "storyEn": "The final ascent:  Die Zwei Wetterfichten."
 },
 {
  "id": "L04s34",
  "league": 4,
  "place": "Hangdorf",
  "col": 5,
  "row": 8,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s35"
  ],
  "reward": {
   "xp": 105
  },
  "storyDe": "Der letzte Anstieg:  Hangdorf.",
  "storyEn": "The final ascent:  Hangdorf."
 },
 {
  "id": "L04s35",
  "league": 4,
  "place": "Steinrose",
  "col": 5,
  "row": 9,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s29"
  ],
  "reward": {
   "xp": 108
  },
  "storyDe": "Der letzte Anstieg:  Steinrose.",
  "storyEn": "The final ascent:  Steinrose."
 },
 {
  "id": "L04s36",
  "league": 4,
  "place": "Der Letzte Schatten",
  "col": 4,
  "row": 6,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s22"
  ],
  "reward": {
   "xp": 70
  },
  "storyDe": "Abseits des Weges liegt Der Letzte Schatten.",
  "storyEn": "Off the road lies Der Letzte Schatten."
 },
 {
  "id": "L04s37",
  "league": 4,
  "place": "Adlerstein",
  "col": 4,
  "row": 2,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s38"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Ein stiller Umweg führt zu Adlerstein.",
  "storyEn": "A quiet detour leads to Adlerstein."
 },
 {
  "id": "L04s38",
  "league": 4,
  "place": "Kammweg",
  "col": 4,
  "row": 1,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 78
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Kammweg.",
  "storyEn": "A side path branches toward Kammweg.",
  "boss": {
   "piece": "pathfinder",
   "wins": 1
  },
  "tier": 2
 },
 {
  "id": "L04s39",
  "league": 4,
  "place": "Die Stumme Glocke",
  "col": 1,
  "row": 5,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s40"
  ],
  "reward": {
   "xp": 70
  },
  "storyDe": "Abseits des Weges liegt Die Stumme Glocke.",
  "storyEn": "Off the road lies Die Stumme Glocke."
 },
 {
  "id": "L04s40",
  "league": 4,
  "place": "Almabtrieb",
  "col": 1,
  "row": 5,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s18"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Ein stiller Umweg führt zu Almabtrieb.",
  "storyEn": "A quiet detour leads to Almabtrieb."
 },
 {
  "id": "L04s41",
  "league": 4,
  "place": "Der Schiefe Zaun",
  "col": 2,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L04s20"
  ],
  "reward": {
   "xp": 70
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Der Schiefe Zaun.",
  "storyEn": "A side path branches toward Der Schiefe Zaun."
 },
 {
  "id": "L04s42",
  "league": 4,
  "place": "Nebelweide",
  "col": 3,
  "row": 4,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L04s09"
  ],
  "reward": {
   "xp": 70
  },
  "storyDe": "Abseits des Weges liegt Nebelweide.",
  "storyEn": "Off the road lies Nebelweide."
 },
 {
  "id": "L05s00",
  "league": 5,
  "place": "Der erste Anstieg",
  "col": 1,
  "row": 1,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L05s02"
  ],
  "reward": {
   "xp": 60
  },
  "storyDe": "Der Weg beginnt bei Der erste Anstieg.",
  "storyEn": "The road begins at Der erste Anstieg."
 },
 {
  "id": "L05s01",
  "league": 5,
  "place": "Klammglocke",
  "col": 2,
  "row": 2,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 84,
   "gold": 47
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Klammglocke.",
  "storyEn": "A side path branches toward Klammglocke."
 },
 {
  "id": "L05s02",
  "league": 5,
  "place": "Vereister Altar",
  "col": 1,
  "row": 2,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L05s03"
  ],
  "reward": {
   "xp": 63
  },
  "storyDe": "Der Weg beginnt bei Vereister Altar.",
  "storyEn": "The road begins at Vereister Altar."
 },
 {
  "id": "L05s03",
  "league": 5,
  "place": "Jägersitz",
  "col": 1,
  "row": 3,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L05s08"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Der Weg beginnt bei Jägersitz.",
  "storyEn": "The road begins at Jägersitz."
 },
 {
  "id": "L05s04",
  "league": 5,
  "place": "Firnriss",
  "col": 5,
  "row": 3,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 84,
   "gold": 80
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Firnriss.",
  "storyEn": "A side path branches toward Firnriss."
 },
 {
  "id": "L05s05",
  "league": 5,
  "place": "Die Wolfsspur",
  "col": 2,
  "row": 3,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L05s01"
  ],
  "reward": {
   "xp": 76
  },
  "storyDe": "Abseits des Weges liegt Die Wolfsspur.",
  "storyEn": "Off the road lies Die Wolfsspur."
 },
 {
  "id": "L05s06",
  "league": 5,
  "place": "Wo der Atem gefror",
  "col": 2,
  "row": 3,
  "map": "arena",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L05s09",
   "L05s05"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Der Weg beginnt bei Wo der Atem gefror.",
  "storyEn": "The road begins at Wo der Atem gefror."
 },
 {
  "id": "L05s07",
  "league": 5,
  "place": "Eisnadel",
  "col": 4,
  "row": 3,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s04"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Eisnadel.",
  "storyEn": "A side path branches toward Eisnadel."
 },
 {
  "id": "L05s08",
  "league": 5,
  "place": "Kluftmesse",
  "col": 2,
  "row": 4,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L05s06",
   "L05s14"
  ],
  "reward": {
   "xp": 69
  },
  "storyDe": "Der Weg beginnt bei Kluftmesse.",
  "storyEn": "The road begins at Kluftmesse."
 },
 {
  "id": "L05s09",
  "league": 5,
  "place": "Nachtwand",
  "col": 2,
  "row": 4,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L05s10"
  ],
  "reward": {
   "xp": 75
  },
  "storyDe": "Der Weg beginnt bei Nachtwand.",
  "storyEn": "The road begins at Nachtwand."
 },
 {
  "id": "L05s10",
  "league": 5,
  "place": "Raureifgitter",
  "col": 2,
  "row": 4,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L05s16"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Der Pfad führt weiter über Raureifgitter.",
  "storyEn": "The path leads on across Raureifgitter."
 },
 {
  "id": "L05s11",
  "league": 5,
  "place": "Blaue Wand",
  "col": 4,
  "row": 4,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s13"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Abseits des Weges liegt Blaue Wand.",
  "storyEn": "Off the road lies Blaue Wand."
 },
 {
  "id": "L05s12",
  "league": 5,
  "place": "Wächtenwall",
  "col": 3,
  "row": 4,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s11"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Ein stiller Umweg führt zu Wächtenwall.",
  "storyEn": "A quiet detour leads to Wächtenwall."
 },
 {
  "id": "L05s13",
  "league": 5,
  "place": "Eisburg",
  "col": 4,
  "row": 4,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s07",
   "L05s17"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Eisburg.",
  "storyEn": "A side path branches toward Eisburg."
 },
 {
  "id": "L05s14",
  "league": 5,
  "place": "Schneelinde",
  "col": 2,
  "row": 4,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s20"
  ],
  "reward": {
   "xp": 76
  },
  "storyDe": "Abseits des Weges liegt Schneelinde.",
  "storyEn": "Off the road lies Schneelinde."
 },
 {
  "id": "L05s15",
  "league": 5,
  "place": "Frostthron",
  "col": 3,
  "row": 5,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s12"
  ],
  "reward": {
   "xp": 76
  },
  "storyDe": "Ein stiller Umweg führt zu Frostthron.",
  "storyEn": "A quiet detour leads to Frostthron."
 },
 {
  "id": "L05s16",
  "league": 5,
  "place": "Der Zugefrorene Riegel",
  "col": 3,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L05s18"
  ],
  "reward": {
   "xp": 81
  },
  "storyDe": "Der Pfad führt weiter über Der Zugefrorene Riegel.",
  "storyEn": "The path leads on across Der Zugefrorene Riegel.",
  "boss": {
   "pure": "b22",
   "rotation": [
    "b22",
    "b04"
   ]
  },
  "tier": 3
 },
 {
  "id": "L05s17",
  "league": 5,
  "place": "Fährtenfeld",
  "col": 4,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s19"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Abseits des Weges liegt Fährtenfeld.",
  "storyEn": "Off the road lies Fährtenfeld."
 },
 {
  "id": "L05s18",
  "league": 5,
  "place": "Nordlichtkanzel",
  "col": 3,
  "row": 5,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L05s15",
   "L05s24"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Der Pfad führt weiter über Nordlichtkanzel.",
  "storyEn": "The path leads on across Nordlichtkanzel."
 },
 {
  "id": "L05s19",
  "league": 5,
  "place": "Halle der stillen Kälte",
  "col": 5,
  "row": 5,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 84,
   "gold": 80
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Halle der stillen Kälte.",
  "storyEn": "A side path branches toward Halle der stillen Kälte."
 },
 {
  "id": "L05s20",
  "league": 5,
  "place": "Taustelle",
  "col": 2,
  "row": 5,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s21",
   "L05s25"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Abseits des Weges liegt Taustelle.",
  "storyEn": "Off the road lies Taustelle."
 },
 {
  "id": "L05s21",
  "league": 5,
  "place": "Gipfelruh",
  "col": 2,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 84,
   "gold": 80
  },
  "storyDe": "Ein stiller Umweg führt zu Gipfelruh.",
  "storyEn": "A quiet detour leads to Gipfelruh."
 },
 {
  "id": "L05s22",
  "league": 5,
  "place": "Verwaiste Hütte",
  "col": 4,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L05s26"
  ],
  "reward": {
   "xp": 93
  },
  "storyDe": "Der Pfad führt weiter über Verwaiste Hütte.",
  "storyEn": "The path leads on across Verwaiste Hütte."
 },
 {
  "id": "L05s23",
  "league": 5,
  "place": "Lawinenhang",
  "col": 3,
  "row": 5,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L05s22"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Der Pfad führt weiter über Lawinenhang.",
  "storyEn": "The path leads on across Lawinenhang."
 },
 {
  "id": "L05s24",
  "league": 5,
  "place": "Barfußspur",
  "col": 3,
  "row": 5,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L05s23"
  ],
  "reward": {
   "xp": 87
  },
  "storyDe": "Der Pfad führt weiter über Barfußspur.",
  "storyEn": "The path leads on across Barfußspur."
 },
 {
  "id": "L05s25",
  "league": 5,
  "place": "Königsgrat",
  "col": 2,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s28"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Königsgrat.",
  "storyEn": "A side path branches toward Königsgrat."
 },
 {
  "id": "L05s26",
  "league": 5,
  "place": "Grabesgeröll",
  "col": 4,
  "row": 6,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L05s27"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Die Prüfung wartet bei Grabesgeröll.",
  "storyEn": "The trial waits at Grabesgeröll."
 },
 {
  "id": "L05s27",
  "league": 5,
  "place": "Der Fürst im Halbschatten",
  "col": 4,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L05s29"
  ],
  "reward": {
   "xp": 99
  },
  "storyDe": "Die Prüfung wartet bei Der Fürst im Halbschatten.",
  "storyEn": "The trial waits at Der Fürst im Halbschatten.",
  "boss": {
   "piece": "guardian",
   "wins": 1
  },
  "tier": 3
 },
 {
  "id": "L05s28",
  "league": 5,
  "place": "Jägersteig",
  "col": 2,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s30"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Jägersteig.",
  "storyEn": "A side path branches toward Jägersteig."
 },
 {
  "id": "L05s29",
  "league": 5,
  "place": "Das Erfrorene Tor",
  "col": 4,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L05s31"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Die Prüfung wartet bei Das Erfrorene Tor.",
  "storyEn": "The trial waits at Das Erfrorene Tor."
 },
 {
  "id": "L05s30",
  "league": 5,
  "place": "Rast der Erschöpften",
  "col": 1,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 84,
   "gold": 80
  },
  "storyDe": "Ein stiller Umweg führt zu Rast der Erschöpften.",
  "storyEn": "A quiet detour leads to Rast der Erschöpften."
 },
 {
  "id": "L05s31",
  "league": 5,
  "place": "Schneegrenze",
  "col": 3,
  "row": 7,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L05s33",
   "L05s36"
  ],
  "reward": {
   "xp": 105
  },
  "storyDe": "Die Prüfung wartet bei Schneegrenze.",
  "storyEn": "The trial waits at Schneegrenze."
 },
 {
  "id": "L05s32",
  "league": 5,
  "place": "Vereiste Klause",
  "col": 4,
  "row": 7,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s35"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Der letzte Anstieg:  Vereiste Klause.",
  "storyEn": "The final ascent:  Vereiste Klause."
 },
 {
  "id": "L05s33",
  "league": 5,
  "place": "Eisbucht",
  "col": 4,
  "row": 7,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L05s34"
  ],
  "reward": {
   "xp": 108
  },
  "storyDe": "Die Prüfung wartet bei Eisbucht.",
  "storyEn": "The trial waits at Eisbucht."
 },
 {
  "id": "L05s34",
  "league": 5,
  "place": "Splitterbrück",
  "col": 4,
  "row": 7,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s32"
  ],
  "reward": {
   "xp": 111
  },
  "storyDe": "Die Prüfung wartet bei Splitterbrück.",
  "storyEn": "The trial waits at Splitterbrück."
 },
 {
  "id": "L05s35",
  "league": 5,
  "place": "Frostbeulen",
  "col": 5,
  "row": 7,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s38"
  ],
  "reward": {
   "xp": 117
  },
  "storyDe": "Der letzte Anstieg:  Frostbeulen.",
  "storyEn": "The final ascent:  Frostbeulen."
 },
 {
  "id": "L05s36",
  "league": 5,
  "place": "Gefrorene Träne",
  "col": 3,
  "row": 7,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L05s37"
  ],
  "reward": {
   "xp": 76
  },
  "storyDe": "Ein stiller Umweg führt zu Gefrorene Träne.",
  "storyEn": "A quiet detour leads to Gefrorene Träne."
 },
 {
  "id": "L05s37",
  "league": 5,
  "place": "Eiskahn",
  "col": 3,
  "row": 8,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L05s39"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Eiskahn.",
  "storyEn": "A side path branches toward Eiskahn."
 },
 {
  "id": "L05s38",
  "league": 5,
  "place": "Knirschsteg",
  "col": 5,
  "row": 8,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s40",
   "L05s41"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Der letzte Anstieg:  Knirschsteg.",
  "storyEn": "The final ascent:  Knirschsteg."
 },
 {
  "id": "L05s39",
  "league": 5,
  "place": "Fallenstellerlager",
  "col": 2,
  "row": 8,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 84,
   "gold": 47
  },
  "storyDe": "Ein stiller Umweg führt zu Fallenstellerlager.",
  "storyEn": "A quiet detour leads to Fallenstellerlager."
 },
 {
  "id": "L05s40",
  "league": 5,
  "place": "Der Erstarrte Hain",
  "col": 4,
  "row": 8,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s42"
  ],
  "reward": {
   "xp": 76
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Der Erstarrte Hain.",
  "storyEn": "A side path branches toward Der Erstarrte Hain."
 },
 {
  "id": "L05s41",
  "league": 5,
  "place": "Steinrosen",
  "col": 5,
  "row": 8,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s44"
  ],
  "reward": {
   "xp": 123
  },
  "storyDe": "Der letzte Anstieg:  Steinrosen.",
  "storyEn": "The final ascent:  Steinrosen."
 },
 {
  "id": "L05s42",
  "league": 5,
  "place": "Firnscharte",
  "col": 4,
  "row": 8,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s43"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Ein stiller Umweg führt zu Firnscharte.",
  "storyEn": "A quiet detour leads to Firnscharte."
 },
 {
  "id": "L05s43",
  "league": 5,
  "place": "Frostglockenturm",
  "col": 4,
  "row": 9,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s46"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Frostglockenturm.",
  "storyEn": "A side path branches toward Frostglockenturm."
 },
 {
  "id": "L05s44",
  "league": 5,
  "place": "Wächtenkamm",
  "col": 5,
  "row": 9,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s48"
  ],
  "reward": {
   "xp": 126
  },
  "storyDe": "Der letzte Anstieg:  Wächtenkamm.",
  "storyEn": "The final ascent:  Wächtenkamm."
 },
 {
  "id": "L05s45",
  "league": 5,
  "place": "Wolfsgrube",
  "col": 3,
  "row": 9,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 84,
   "gold": 80
  },
  "storyDe": "Ein stiller Umweg führt zu Wolfsgrube.",
  "storyEn": "A quiet detour leads to Wolfsgrube."
 },
 {
  "id": "L05s46",
  "league": 5,
  "place": "Rabenkanzel",
  "col": 4,
  "row": 9,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s47"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Rabenkanzel.",
  "storyEn": "A side path branches toward Rabenkanzel."
 },
 {
  "id": "L05s47",
  "league": 5,
  "place": "Quellen unterm Eis",
  "col": 3,
  "row": 9,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L05s45"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Abseits des Weges liegt Quellen unterm Eis.",
  "storyEn": "Off the road lies Quellen unterm Eis."
 },
 {
  "id": "L05s48",
  "league": 5,
  "place": "Steinerner Schlaf",
  "col": 5,
  "row": 9,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 129,
   "gold": 40
  },
  "storyDe": "Steinerner Schlaf: Hier wartet der Meister von Kapitel V.",
  "storyEn": "Steinerner Schlaf: here waits the master of chapter V.",
  "boss": {
   "pure": "b19"
  },
  "tier": 4
 },
 {
  "id": "L06s00",
  "league": 6,
  "place": "Erster Grat",
  "col": 0,
  "row": 1,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L06s01"
  ],
  "reward": {
   "xp": 66
  },
  "storyDe": "Der Weg beginnt bei Erster Grat.",
  "storyEn": "The road begins at Erster Grat."
 },
 {
  "id": "L06s01",
  "league": 6,
  "place": "Meißelschlag",
  "col": 1,
  "row": 1,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L06s02",
   "L06s04"
  ],
  "reward": {
   "xp": 69
  },
  "storyDe": "Der Weg beginnt bei Meißelschlag.",
  "storyEn": "The road begins at Meißelschlag."
 },
 {
  "id": "L06s02",
  "league": 6,
  "place": "Gipfelaltar",
  "col": 1,
  "row": 2,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L06s05"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Der Weg beginnt bei Gipfelaltar.",
  "storyEn": "The road begins at Gipfelaltar."
 },
 {
  "id": "L06s03",
  "league": 6,
  "place": "Steinmetzsitz",
  "col": 5,
  "row": 2,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 82,
   "gold": 28
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Steinmetzsitz.",
  "storyEn": "A side path branches toward Steinmetzsitz."
 },
 {
  "id": "L06s04",
  "league": 6,
  "place": "Geröllzunge",
  "col": 1,
  "row": 2,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s08"
  ],
  "reward": {
   "xp": 82
  },
  "storyDe": "Abseits des Weges liegt Geröllzunge.",
  "storyEn": "Off the road lies Geröllzunge."
 },
 {
  "id": "L06s05",
  "league": 6,
  "place": "Der Gamssteig",
  "col": 1,
  "row": 2,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L06s07"
  ],
  "reward": {
   "xp": 75
  },
  "storyDe": "Der Weg beginnt bei Der Gamssteig.",
  "storyEn": "The road begins at Der Gamssteig."
 },
 {
  "id": "L06s06",
  "league": 6,
  "place": "Wo der letzte Riegel fiel",
  "col": 5,
  "row": 3,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L06s09"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Der Pfad führt weiter über Wo der letzte Riegel fiel.",
  "storyEn": "The path leads on across Wo der letzte Riegel fiel."
 },
 {
  "id": "L06s07",
  "league": 6,
  "place": "Kluftfeste",
  "col": 1,
  "row": 3,
  "map": "arena",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L06s10"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Der Weg beginnt bei Kluftfeste.",
  "storyEn": "The road begins at Kluftfeste."
 },
 {
  "id": "L06s08",
  "league": 6,
  "place": "Adlermesse",
  "col": 1,
  "row": 3,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s11"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Ein stiller Umweg führt zu Adlermesse.",
  "storyEn": "A quiet detour leads to Adlermesse."
 },
 {
  "id": "L06s09",
  "league": 6,
  "place": "Wolkenstube",
  "col": 5,
  "row": 3,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L06s03",
   "L06s12"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Der Pfad führt weiter über Wolkenstube.",
  "storyEn": "The path leads on across Wolkenstube."
 },
 {
  "id": "L06s10",
  "league": 6,
  "place": "Splitterkar",
  "col": 2,
  "row": 4,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L06s14"
  ],
  "reward": {
   "xp": 81
  },
  "storyDe": "Der Weg beginnt bei Splitterkar.",
  "storyEn": "The road begins at Splitterkar."
 },
 {
  "id": "L06s11",
  "league": 6,
  "place": "Dohlenflug",
  "col": 1,
  "row": 4,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s17"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Ein stiller Umweg führt zu Dohlenflug.",
  "storyEn": "A quiet detour leads to Dohlenflug."
 },
 {
  "id": "L06s12",
  "league": 6,
  "place": "Firnhang",
  "col": 5,
  "row": 4,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L06s18"
  ],
  "reward": {
   "xp": 108
  },
  "storyDe": "Die Prüfung wartet bei Firnhang.",
  "storyEn": "The trial waits at Firnhang.",
  "boss": {
   "piece": "assassin",
   "wins": 1
  },
  "tier": 2
 },
 {
  "id": "L06s13",
  "league": 6,
  "place": "Hochwacht",
  "col": 3,
  "row": 4,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L06s15",
   "L06s06"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Der Pfad führt weiter über Hochwacht.",
  "storyEn": "The path leads on across Hochwacht.",
  "boss": {
   "pure": "b21",
   "rotation": [
    "b21",
    "b07"
   ]
  },
  "tier": 2
 },
 {
  "id": "L06s14",
  "league": 6,
  "place": "Zwergkiefer",
  "col": 2,
  "row": 4,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L06s16"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Der Weg beginnt bei Zwergkiefer.",
  "storyEn": "The road begins at Zwergkiefer."
 },
 {
  "id": "L06s15",
  "league": 6,
  "place": "Gipfelkron",
  "col": 3,
  "row": 4,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L06s19"
  ],
  "reward": {
   "xp": 93
  },
  "storyDe": "Der Pfad führt weiter über Gipfelkron.",
  "storyEn": "The path leads on across Gipfelkron."
 },
 {
  "id": "L06s16",
  "league": 6,
  "place": "Das Verlorene Schloss",
  "col": 2,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L06s13",
   "L06s22"
  ],
  "reward": {
   "xp": 87
  },
  "storyDe": "Der Pfad führt weiter über Das Verlorene Schloss.",
  "storyEn": "The path leads on across Das Verlorene Schloss."
 },
 {
  "id": "L06s17",
  "league": 6,
  "place": "Schutthalde",
  "col": 1,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s20"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Ein stiller Umweg führt zu Schutthalde.",
  "storyEn": "A quiet detour leads to Schutthalde."
 },
 {
  "id": "L06s18",
  "league": 6,
  "place": "Adlerkanzel",
  "col": 5,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L06s21"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Die Prüfung wartet bei Adlerkanzel.",
  "storyEn": "The trial waits at Adlerkanzel."
 },
 {
  "id": "L06s19",
  "league": 6,
  "place": "Halle der leeren Regale",
  "col": 3,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L06s23"
  ],
  "reward": {
   "xp": 99
  },
  "storyDe": "Der Pfad führt weiter über Halle der leeren Regale.",
  "storyEn": "The path leads on across Halle der leeren Regale."
 },
 {
  "id": "L06s20",
  "league": 6,
  "place": "Schlüsselbund",
  "col": 1,
  "row": 5,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 90,
   "gold": 88
  },
  "storyDe": "Ein stiller Umweg führt zu Schlüsselbund.",
  "storyEn": "A quiet detour leads to Schlüsselbund."
 },
 {
  "id": "L06s21",
  "league": 6,
  "place": "Sieben Riegel",
  "col": 5,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L06s26"
  ],
  "reward": {
   "xp": 117
  },
  "storyDe": "Die Prüfung wartet bei Sieben Riegel.",
  "storyEn": "The trial waits at Sieben Riegel."
 },
 {
  "id": "L06s22",
  "league": 6,
  "place": "Verfallene Klause",
  "col": 2,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s24"
  ],
  "reward": {
   "xp": 82
  },
  "storyDe": "Abseits des Weges liegt Verfallene Klause.",
  "storyEn": "Off the road lies Verfallene Klause."
 },
 {
  "id": "L06s23",
  "league": 6,
  "place": "Donnerkar",
  "col": 3,
  "row": 5,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L06s25"
  ],
  "reward": {
   "xp": 105
  },
  "storyDe": "Die Prüfung wartet bei Donnerkar.",
  "storyEn": "The trial waits at Donnerkar."
 },
 {
  "id": "L06s24",
  "league": 6,
  "place": "Sternenlager",
  "col": 2,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s30"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Sternenlager.",
  "storyEn": "A side path branches toward Sternenlager."
 },
 {
  "id": "L06s25",
  "league": 6,
  "place": "Königsjoch",
  "col": 3,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L06s29",
   "L06s21"
  ],
  "reward": {
   "xp": 111
  },
  "storyDe": "Die Prüfung wartet bei Königsjoch.",
  "storyEn": "The trial waits at Königsjoch."
 },
 {
  "id": "L06s26",
  "league": 6,
  "place": "Grauer Atem",
  "col": 5,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L06s28"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Die Prüfung wartet bei Grauer Atem.",
  "storyEn": "The trial waits at Grauer Atem."
 },
 {
  "id": "L06s27",
  "league": 6,
  "place": "Der Hüter ohne Tür",
  "col": 5,
  "row": 6,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 82,
   "gold": 28
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Der Hüter ohne Tür.",
  "storyEn": "A side path branches toward Der Hüter ohne Tür."
 },
 {
  "id": "L06s28",
  "league": 6,
  "place": "Seilpfad",
  "col": 5,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s31"
  ],
  "reward": {
   "xp": 123
  },
  "storyDe": "Die Prüfung wartet bei Seilpfad.",
  "storyEn": "The trial waits at Seilpfad."
 },
 {
  "id": "L06s29",
  "league": 6,
  "place": "Das Verriegelte Tor",
  "col": 3,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L06s32"
  ],
  "reward": {
   "xp": 82
  },
  "storyDe": "Ein stiller Umweg führt zu Das Verriegelte Tor.",
  "storyEn": "A quiet detour leads to Das Verriegelte Tor."
 },
 {
  "id": "L06s30",
  "league": 6,
  "place": "Rast am Abgrund",
  "col": 2,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s33"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Rast am Abgrund.",
  "storyEn": "A side path branches toward Rast am Abgrund."
 },
 {
  "id": "L06s31",
  "league": 6,
  "place": "Grathelm",
  "col": 5,
  "row": 7,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s27",
   "L06s34"
  ],
  "reward": {
   "xp": 126
  },
  "storyDe": "Der letzte Anstieg:  Grathelm.",
  "storyEn": "The final ascent:  Grathelm."
 },
 {
  "id": "L06s32",
  "league": 6,
  "place": "Steinerne Stube",
  "col": 3,
  "row": 7,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L06s35"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Ein stiller Umweg führt zu Steinerne Stube.",
  "storyEn": "A quiet detour leads to Steinerne Stube."
 },
 {
  "id": "L06s33",
  "league": 6,
  "place": "Gletschermilch",
  "col": 2,
  "row": 7,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s36"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Gletschermilch.",
  "storyEn": "A side path branches toward Gletschermilch."
 },
 {
  "id": "L06s34",
  "league": 6,
  "place": "Hängender Weiler",
  "col": 5,
  "row": 7,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s37",
   "L06s38"
  ],
  "reward": {
   "xp": 129
  },
  "storyDe": "Der letzte Anstieg:  Hängender Weiler.",
  "storyEn": "The final ascent:  Hängender Weiler."
 },
 {
  "id": "L06s35",
  "league": 6,
  "place": "Murmelloch",
  "col": 3,
  "row": 7,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 90,
   "gold": 52
  },
  "storyDe": "Ein stiller Umweg führt zu Murmelloch.",
  "storyEn": "A quiet detour leads to Murmelloch."
 },
 {
  "id": "L06s36",
  "league": 6,
  "place": "Kristallader",
  "col": 2,
  "row": 7,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s39"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Kristallader.",
  "storyEn": "A side path branches toward Kristallader."
 },
 {
  "id": "L06s37",
  "league": 6,
  "place": "Seilwinde",
  "col": 5,
  "row": 8,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s40"
  ],
  "reward": {
   "xp": 82
  },
  "storyDe": "Abseits des Weges liegt Seilwinde.",
  "storyEn": "Off the road lies Seilwinde."
 },
 {
  "id": "L06s38",
  "league": 6,
  "place": "Schwindelsteg",
  "col": 5,
  "row": 8,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s43"
  ],
  "reward": {
   "xp": 132
  },
  "storyDe": "Der letzte Anstieg:  Schwindelsteg.",
  "storyEn": "The final ascent:  Schwindelsteg."
 },
 {
  "id": "L06s39",
  "league": 6,
  "place": "Bei den Steinmetzen",
  "col": 2,
  "row": 8,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s45"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Bei den Steinmetzen.",
  "storyEn": "A side path branches toward Bei den Steinmetzen."
 },
 {
  "id": "L06s40",
  "league": 6,
  "place": "Der Kahle Rücken",
  "col": 4,
  "row": 8,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s41"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Abseits des Weges liegt Der Kahle Rücken.",
  "storyEn": "Off the road lies Der Kahle Rücken."
 },
 {
  "id": "L06s41",
  "league": 6,
  "place": "Flechtenteppich",
  "col": 4,
  "row": 8,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s42"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Ein stiller Umweg führt zu Flechtenteppich.",
  "storyEn": "A quiet detour leads to Flechtenteppich."
 },
 {
  "id": "L06s42",
  "league": 6,
  "place": "Klufttreppe",
  "col": 4,
  "row": 8,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s44"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Klufttreppe.",
  "storyEn": "A side path branches toward Klufttreppe."
 },
 {
  "id": "L06s43",
  "league": 6,
  "place": "Schlüsselzinne",
  "col": 5,
  "row": 8,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s46"
  ],
  "reward": {
   "xp": 135
  },
  "storyDe": "Der letzte Anstieg:  Schlüsselzinne.",
  "storyEn": "The final ascent:  Schlüsselzinne."
 },
 {
  "id": "L06s44",
  "league": 6,
  "place": "Nebelmeerblick",
  "col": 3,
  "row": 9,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s47"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Ein stiller Umweg führt zu Nebelmeerblick.",
  "storyEn": "A quiet detour leads to Nebelmeerblick."
 },
 {
  "id": "L06s45",
  "league": 6,
  "place": "Schieferwiege",
  "col": 1,
  "row": 9,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s48"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Schieferwiege.",
  "storyEn": "A side path branches toward Schieferwiege."
 },
 {
  "id": "L06s46",
  "league": 6,
  "place": "Steinbockstand",
  "col": 5,
  "row": 9,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s50"
  ],
  "reward": {
   "xp": 138
  },
  "storyDe": "Der letzte Anstieg:  Steinbockstand.",
  "storyEn": "The final ascent:  Steinbockstand."
 },
 {
  "id": "L06s47",
  "league": 6,
  "place": "Tropfstein",
  "col": 3,
  "row": 9,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 90,
   "gold": 88
  },
  "storyDe": "Ein stiller Umweg führt zu Tropfstein.",
  "storyEn": "A quiet detour leads to Tropfstein."
 },
 {
  "id": "L06s48",
  "league": 6,
  "place": "Ödgrat",
  "col": 1,
  "row": 9,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 90
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Ödgrat.",
  "storyEn": "A side path branches toward Ödgrat.",
  "boss": {
   "piece": "captain",
   "wins": 1
  },
  "tier": 2
 },
 {
  "id": "L06s49",
  "league": 6,
  "place": "Echostille",
  "col": 5,
  "row": 10,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 144,
   "gold": 44
  },
  "storyDe": "Echostille: Hier wartet der Meister von Kapitel VI.",
  "storyEn": "Echostille: here waits the master of chapter VI.",
  "boss": {
   "pure": "b20"
  },
  "tier": 3
 },
 {
  "id": "L06s50",
  "league": 6,
  "place": "Zwölf Türen",
  "col": 5,
  "row": 9,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L06s49",
   "L06s51"
  ],
  "reward": {
   "xp": 141
  },
  "storyDe": "Der letzte Anstieg:  Zwölf Türen.",
  "storyEn": "The final ascent:  Zwölf Türen."
 },
 {
  "id": "L06s51",
  "league": 6,
  "place": "Erster Grat II",
  "col": 5,
  "row": 9,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 82,
   "gold": 28
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Erster Grat II.",
  "storyEn": "A side path branches toward Erster Grat II."
 },
 {
  "id": "L07s00",
  "league": 7,
  "place": "Erster Riss",
  "col": 0,
  "row": 1,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L07s02"
  ],
  "reward": {
   "xp": 72
  },
  "storyDe": "Der Weg beginnt bei Erster Riss.",
  "storyEn": "The road begins at Erster Riss."
 },
 {
  "id": "L07s01",
  "league": 7,
  "place": "Staubglocke",
  "col": 3,
  "row": 1,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 96,
   "gold": 96
  },
  "storyDe": "Ein stiller Umweg führt zu Staubglocke.",
  "storyEn": "A quiet detour leads to Staubglocke."
 },
 {
  "id": "L07s02",
  "league": 7,
  "place": "Wundaltar",
  "col": 1,
  "row": 1,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L07s05",
   "L07s09"
  ],
  "reward": {
   "xp": 75
  },
  "storyDe": "Der Weg beginnt bei Wundaltar.",
  "storyEn": "The road begins at Wundaltar."
 },
 {
  "id": "L07s03",
  "league": 7,
  "place": "Plünderersitz",
  "col": 5,
  "row": 2,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 96,
   "gold": 96
  },
  "storyDe": "Abseits des Weges liegt Plünderersitz.",
  "storyEn": "Off the road lies Plünderersitz."
 },
 {
  "id": "L07s04",
  "league": 7,
  "place": "Splitterknochen",
  "col": 3,
  "row": 2,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s01"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Ein stiller Umweg führt zu Splitterknochen.",
  "storyEn": "A quiet detour leads to Splitterknochen."
 },
 {
  "id": "L07s05",
  "league": 7,
  "place": "Der Galgenpfad",
  "col": 1,
  "row": 2,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L07s07"
  ],
  "reward": {
   "xp": 81
  },
  "storyDe": "Der Weg beginnt bei Der Galgenpfad.",
  "storyEn": "The road begins at Der Galgenpfad."
 },
 {
  "id": "L07s06",
  "league": 7,
  "place": "Wo die Erde trank",
  "col": 3,
  "row": 2,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s04"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Abseits des Weges liegt Wo die Erde trank.",
  "storyEn": "Off the road lies Wo die Erde trank."
 },
 {
  "id": "L07s07",
  "league": 7,
  "place": "Dornenkelch",
  "col": 2,
  "row": 3,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L07s12"
  ],
  "reward": {
   "xp": 87
  },
  "storyDe": "Der Weg beginnt bei Dornenkelch.",
  "storyEn": "The road begins at Dornenkelch."
 },
 {
  "id": "L07s08",
  "league": 7,
  "place": "Kelchmesse",
  "col": 5,
  "row": 3,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s03"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Kelchmesse.",
  "storyEn": "A side path branches toward Kelchmesse."
 },
 {
  "id": "L07s09",
  "league": 7,
  "place": "Fahles Land",
  "col": 1,
  "row": 3,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L07s14"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Der Weg beginnt bei Fahles Land.",
  "storyEn": "The road begins at Fahles Land."
 },
 {
  "id": "L07s10",
  "league": 7,
  "place": "Sprödes Bett",
  "col": 5,
  "row": 3,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s08"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Ein stiller Umweg führt zu Sprödes Bett.",
  "storyEn": "A quiet detour leads to Sprödes Bett."
 },
 {
  "id": "L07s11",
  "league": 7,
  "place": "Grauschleier",
  "col": 4,
  "row": 3,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s06"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Grauschleier.",
  "storyEn": "A side path branches toward Grauschleier."
 },
 {
  "id": "L07s12",
  "league": 7,
  "place": "Totes Geäst",
  "col": 2,
  "row": 4,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L07s16"
  ],
  "reward": {
   "xp": 93
  },
  "storyDe": "Der Weg beginnt bei Totes Geäst.",
  "storyEn": "The road begins at Totes Geäst."
 },
 {
  "id": "L07s13",
  "league": 7,
  "place": "Dornenfeste",
  "col": 4,
  "row": 4,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s10"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Ein stiller Umweg führt zu Dornenfeste.",
  "storyEn": "A quiet detour leads to Dornenfeste."
 },
 {
  "id": "L07s14",
  "league": 7,
  "place": "Graudorn",
  "col": 1,
  "row": 4,
  "map": "arena",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L07s17"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Der Weg beginnt bei Graudorn.",
  "storyEn": "The road begins at Graudorn."
 },
 {
  "id": "L07s15",
  "league": 7,
  "place": "Dornendiadem",
  "col": 4,
  "row": 4,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s11",
   "L07s13"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Abseits des Weges liegt Dornendiadem.",
  "storyEn": "Off the road lies Dornendiadem."
 },
 {
  "id": "L07s16",
  "league": 7,
  "place": "Das Ausgeblutete Tor",
  "col": 3,
  "row": 4,
  "map": "arena",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L07s19"
  ],
  "reward": {
   "xp": 99
  },
  "storyDe": "Der Pfad führt weiter über Das Ausgeblutete Tor.",
  "storyEn": "The path leads on across Das Ausgeblutete Tor."
 },
 {
  "id": "L07s17",
  "league": 7,
  "place": "Rabenacker",
  "col": 1,
  "row": 4,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L07s20",
   "L07s21"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Der Weg beginnt bei Rabenacker.",
  "storyEn": "The road begins at Rabenacker."
 },
 {
  "id": "L07s18",
  "league": 7,
  "place": "Kanzel der Wunde",
  "col": 4,
  "row": 5,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s15"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Abseits des Weges liegt Kanzel der Wunde.",
  "storyEn": "Off the road lies Kanzel der Wunde."
 },
 {
  "id": "L07s19",
  "league": 7,
  "place": "Halle des vollen Kelchs",
  "col": 3,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L07s26"
  ],
  "reward": {
   "xp": 105
  },
  "storyDe": "Der Pfad führt weiter über Halle des vollen Kelchs.",
  "storyEn": "The path leads on across Halle des vollen Kelchs.",
  "boss": {
   "pure": "b15",
   "rotation": [
    "b15",
    "b06"
   ]
  },
  "tier": 2
 },
 {
  "id": "L07s20",
  "league": 7,
  "place": "Bittersalz",
  "col": 2,
  "row": 5,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L07s23"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Der Weg beginnt bei Bittersalz.",
  "storyEn": "The road begins at Bittersalz."
 },
 {
  "id": "L07s21",
  "league": 7,
  "place": "Galgenhöhe",
  "col": 1,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s24"
  ],
  "reward": {
   "xp": 88
  },
  "storyDe": "Abseits des Weges liegt Galgenhöhe.",
  "storyEn": "Off the road lies Galgenhöhe."
 },
 {
  "id": "L07s22",
  "league": 7,
  "place": "Verlassene Kate",
  "col": 4,
  "row": 6,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s18"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Ein stiller Umweg führt zu Verlassene Kate.",
  "storyEn": "A quiet detour leads to Verlassene Kate."
 },
 {
  "id": "L07s23",
  "league": 7,
  "place": "Staubwalze",
  "col": 2,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 1,
  "next": [
   "L07s28"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Der Pfad führt weiter über Staubwalze.",
  "storyEn": "The path leads on across Staubwalze."
 },
 {
  "id": "L07s24",
  "league": 7,
  "place": "Letzter Schluck",
  "col": 1,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s27"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Abseits des Weges liegt Letzter Schluck.",
  "storyEn": "Off the road lies Letzter Schluck."
 },
 {
  "id": "L07s25",
  "league": 7,
  "place": "Königsdurst",
  "col": 4,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s22"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Ein stiller Umweg führt zu Königsdurst.",
  "storyEn": "A quiet detour leads to Königsdurst."
 },
 {
  "id": "L07s26",
  "league": 7,
  "place": "Zehrfeuer",
  "col": 3,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L07s32"
  ],
  "reward": {
   "xp": 111
  },
  "storyDe": "Der Pfad führt weiter über Zehrfeuer.",
  "storyEn": "The path leads on across Zehrfeuer."
 },
 {
  "id": "L07s27",
  "league": 7,
  "place": "Die Magd am Kelch",
  "col": 1,
  "row": 7,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s30"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Abseits des Weges liegt Die Magd am Kelch.",
  "storyEn": "Off the road lies Die Magd am Kelch."
 },
 {
  "id": "L07s28",
  "league": 7,
  "place": "Marterpfad",
  "col": 2,
  "row": 7,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L07s31"
  ],
  "reward": {
   "xp": 108
  },
  "storyDe": "Der Pfad führt weiter über Marterpfad.",
  "storyEn": "The path leads on across Marterpfad."
 },
 {
  "id": "L07s29",
  "league": 7,
  "place": "Das Rostige Tor",
  "col": 4,
  "row": 7,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s25"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Das Rostige Tor.",
  "storyEn": "A side path branches toward Das Rostige Tor."
 },
 {
  "id": "L07s30",
  "league": 7,
  "place": "Rast der Verlorenen",
  "col": 1,
  "row": 7,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s34"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Abseits des Weges liegt Rast der Verlorenen.",
  "storyEn": "Off the road lies Rast der Verlorenen."
 },
 {
  "id": "L07s31",
  "league": 7,
  "place": "Aschepfand",
  "col": 3,
  "row": 7,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L07s38"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Der Pfad führt weiter über Aschepfand.",
  "storyEn": "The path leads on across Aschepfand."
 },
 {
  "id": "L07s32",
  "league": 7,
  "place": "Wundklause",
  "col": 3,
  "row": 7,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L07s35"
  ],
  "reward": {
   "xp": 117
  },
  "storyDe": "Der Pfad führt weiter über Wundklause.",
  "storyEn": "The path leads on across Wundklause."
 },
 {
  "id": "L07s33",
  "league": 7,
  "place": "Lakensenke",
  "col": 5,
  "row": 7,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s29"
  ],
  "reward": {
   "xp": 88
  },
  "storyDe": "Abseits des Weges liegt Lakensenke.",
  "storyEn": "Off the road lies Lakensenke."
 },
 {
  "id": "L07s34",
  "league": 7,
  "place": "Blutzoll",
  "col": 1,
  "row": 8,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s39"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Ein stiller Umweg führt zu Blutzoll.",
  "storyEn": "A quiet detour leads to Blutzoll."
 },
 {
  "id": "L07s35",
  "league": 7,
  "place": "Hohlzahn",
  "col": 4,
  "row": 8,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L07s40"
  ],
  "reward": {
   "xp": 123
  },
  "storyDe": "Der Pfad führt weiter über Hohlzahn.",
  "storyEn": "The path leads on across Hohlzahn."
 },
 {
  "id": "L07s36",
  "league": 7,
  "place": "Geierwarte",
  "col": 5,
  "row": 8,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L07s33",
   "L07s42"
  ],
  "reward": {
   "xp": 138
  },
  "storyDe": "Die Prüfung wartet bei Geierwarte.",
  "storyEn": "The trial waits at Geierwarte."
 },
 {
  "id": "L07s37",
  "league": 7,
  "place": "Knochenfloß",
  "col": 4,
  "row": 8,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L07s36"
  ],
  "reward": {
   "xp": 132
  },
  "storyDe": "Die Prüfung wartet bei Knochenfloß.",
  "storyEn": "The trial waits at Knochenfloß."
 },
 {
  "id": "L07s38",
  "league": 7,
  "place": "Wackelsteg",
  "col": 3,
  "row": 8,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 120
  },
  "storyDe": "Der Pfad führt weiter über Wackelsteg.",
  "storyEn": "The path leads on across Wackelsteg."
 },
 {
  "id": "L07s39",
  "league": 7,
  "place": "Krähenbankett",
  "col": 1,
  "row": 8,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s46"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Abseits des Weges liegt Krähenbankett.",
  "storyEn": "Off the road lies Krähenbankett."
 },
 {
  "id": "L07s40",
  "league": 7,
  "place": "Der Verdorrte Hain",
  "col": 4,
  "row": 8,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L07s41"
  ],
  "reward": {
   "xp": 126
  },
  "storyDe": "Die Prüfung wartet bei Der Verdorrte Hain.",
  "storyEn": "The trial waits at Der Verdorrte Hain."
 },
 {
  "id": "L07s41",
  "league": 7,
  "place": "Distelacker",
  "col": 4,
  "row": 8,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L07s37"
  ],
  "reward": {
   "xp": 129
  },
  "storyDe": "Die Prüfung wartet bei Distelacker.",
  "storyEn": "The trial waits at Distelacker.",
  "boss": {
   "piece": "dragon",
   "wins": 2
  },
  "tier": 2
 },
 {
  "id": "L07s42",
  "league": 7,
  "place": "Rinnsal",
  "col": 5,
  "row": 8,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L07s43",
   "L07s45"
  ],
  "reward": {
   "xp": 144
  },
  "storyDe": "Die Prüfung wartet bei Rinnsal.",
  "storyEn": "The trial waits at Rinnsal."
 },
 {
  "id": "L07s43",
  "league": 7,
  "place": "Der Schiefe Galgen",
  "col": 5,
  "row": 9,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L07s47"
  ],
  "reward": {
   "xp": 147
  },
  "storyDe": "Die Prüfung wartet bei Der Schiefe Galgen.",
  "storyEn": "The trial waits at Der Schiefe Galgen."
 },
 {
  "id": "L07s44",
  "league": 7,
  "place": "Dürrejahr",
  "col": 3,
  "row": 9,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 168
  },
  "storyDe": "Der letzte Anstieg:  Dürrejahr.",
  "storyEn": "The final ascent:  Dürrejahr."
 },
 {
  "id": "L07s45",
  "league": 7,
  "place": "Grubenlicht",
  "col": 5,
  "row": 9,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s54",
   "L07s56",
   "L07s57"
  ],
  "reward": {
   "xp": 150
  },
  "storyDe": "Die Prüfung wartet bei Grubenlicht.",
  "storyEn": "The trial waits at Grubenlicht."
 },
 {
  "id": "L07s46",
  "league": 7,
  "place": "Geiergericht",
  "col": 1,
  "row": 9,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s52"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Ein stiller Umweg führt zu Geiergericht.",
  "storyEn": "A quiet detour leads to Geiergericht."
 },
 {
  "id": "L07s47",
  "league": 7,
  "place": "Tropfenzähler",
  "col": 4,
  "row": 9,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s48"
  ],
  "reward": {
   "xp": 153
  },
  "storyDe": "Der letzte Anstieg:  Tropfenzähler.",
  "storyEn": "The final ascent:  Tropfenzähler."
 },
 {
  "id": "L07s48",
  "league": 7,
  "place": "Ödnisrand",
  "col": 4,
  "row": 9,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s51"
  ],
  "reward": {
   "xp": 156
  },
  "storyDe": "Der letzte Anstieg:  Ödnisrand.",
  "storyEn": "The final ascent:  Ödnisrand."
 },
 {
  "id": "L07s49",
  "league": 7,
  "place": "Schlackenzunge",
  "col": 3,
  "row": 9,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s44"
  ],
  "reward": {
   "xp": 165
  },
  "storyDe": "Der letzte Anstieg:  Schlackenzunge.",
  "storyEn": "The final ascent:  Schlackenzunge."
 },
 {
  "id": "L07s50",
  "league": 7,
  "place": "Stimmen im Staub",
  "col": 3,
  "row": 9,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s49"
  ],
  "reward": {
   "xp": 162
  },
  "storyDe": "Der letzte Anstieg:  Stimmen im Staub.",
  "storyEn": "The final ascent:  Stimmen im Staub."
 },
 {
  "id": "L07s51",
  "league": 7,
  "place": "Erster Riss II",
  "col": 4,
  "row": 9,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s50"
  ],
  "reward": {
   "xp": 159
  },
  "storyDe": "Der letzte Anstieg:  Erster Riss II.",
  "storyEn": "The final ascent:  Erster Riss II."
 },
 {
  "id": "L07s52",
  "league": 7,
  "place": "Staubglocke II",
  "col": 1,
  "row": 9,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [
   "L07s53"
  ],
  "reward": {
   "xp": 96,
   "gold": 96
  },
  "storyDe": "Ein stiller Umweg führt zu Staubglocke II.",
  "storyEn": "A quiet detour leads to Staubglocke II."
 },
 {
  "id": "L07s53",
  "league": 7,
  "place": "Wundaltar II",
  "col": 1,
  "row": 10,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [
   "L07s55"
  ],
  "reward": {
   "xp": 135
  },
  "storyDe": "Die Prüfung wartet bei Wundaltar II.",
  "storyEn": "The trial waits at Wundaltar II."
 },
 {
  "id": "L07s54",
  "league": 7,
  "place": "Plünderersitz II",
  "col": 5,
  "row": 10,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 177,
   "gold": 48
  },
  "storyDe": "Plünderersitz II: Hier wartet der Meister von Kapitel VII.",
  "storyEn": "Plünderersitz II: here waits the master of chapter VII.",
  "boss": {
   "pure": "b16"
  },
  "tier": 3
 },
 {
  "id": "L07s55",
  "league": 7,
  "place": "Splitterknochen II",
  "col": 1,
  "row": 10,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 141
  },
  "storyDe": "Die Prüfung wartet bei Splitterknochen II.",
  "storyEn": "The trial waits at Splitterknochen II."
 },
 {
  "id": "L07s56",
  "league": 7,
  "place": "Der Galgenpfad II",
  "col": 5,
  "row": 9,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 171
  },
  "storyDe": "Der letzte Anstieg:  Der Galgenpfad II.",
  "storyEn": "The final ascent:  Der Galgenpfad II."
 },
 {
  "id": "L07s57",
  "league": 7,
  "place": "Wo die Erde trank II",
  "col": 5,
  "row": 9,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 1,
  "next": [],
  "reward": {
   "xp": 174
  },
  "storyDe": "Der letzte Anstieg:  Wo die Erde trank II.",
  "storyEn": "The final ascent:  Wo die Erde trank II."
 },
 {
  "id": "L08s00",
  "league": 8,
  "place": "Weites Rund",
  "col": 1,
  "row": 1,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L08s01"
  ],
  "reward": {
   "xp": 78
  },
  "storyDe": "Der Weg beginnt bei Weites Rund.",
  "storyEn": "The road begins at Weites Rund."
 },
 {
  "id": "L08s01",
  "league": 8,
  "place": "Hufdonner",
  "col": 1,
  "row": 1,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L08s02"
  ],
  "reward": {
   "xp": 81
  },
  "storyDe": "Der Weg beginnt bei Hufdonner.",
  "storyEn": "The road begins at Hufdonner."
 },
 {
  "id": "L08s02",
  "league": 8,
  "place": "Reiteraltar",
  "col": 1,
  "row": 2,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L08s03"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Der Weg beginnt bei Reiteraltar.",
  "storyEn": "The road begins at Reiteraltar."
 },
 {
  "id": "L08s03",
  "league": 8,
  "place": "Jurtenring",
  "col": 1,
  "row": 2,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L08s06"
  ],
  "reward": {
   "xp": 87
  },
  "storyDe": "Der Weg beginnt bei Jurtenring.",
  "storyEn": "The road begins at Jurtenring."
 },
 {
  "id": "L08s04",
  "league": 8,
  "place": "Zunderflur",
  "col": 6,
  "row": 3,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 102
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Zunderflur.",
  "storyEn": "A side path branches toward Zunderflur.",
  "boss": {
   "piece": "amazon",
   "wins": 1
  },
  "tier": 3
 },
 {
  "id": "L08s05",
  "league": 8,
  "place": "Der Wildwechsel",
  "col": 4,
  "row": 3,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 102,
   "gold": 62
  },
  "storyDe": "Abseits des Weges liegt Der Wildwechsel.",
  "storyEn": "Off the road lies Der Wildwechsel."
 },
 {
  "id": "L08s06",
  "league": 8,
  "place": "Wo die Lanze fällt",
  "col": 1,
  "row": 3,
  "map": "arena",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L08s08",
   "L08s11"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Der Weg beginnt bei Wo die Lanze fällt.",
  "storyEn": "The road begins at Wo die Lanze fällt."
 },
 {
  "id": "L08s07",
  "league": 8,
  "place": "Grasmeer",
  "col": 5,
  "row": 3,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s04"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Grasmeer.",
  "storyEn": "A side path branches toward Grasmeer."
 },
 {
  "id": "L08s08",
  "league": 8,
  "place": "Turniermesse",
  "col": 2,
  "row": 3,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L08s10"
  ],
  "reward": {
   "xp": 93
  },
  "storyDe": "Der Weg beginnt bei Turniermesse.",
  "storyEn": "The road begins at Turniermesse."
 },
 {
  "id": "L08s09",
  "league": 8,
  "place": "Freier Himmel",
  "col": 3,
  "row": 3,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L08s05"
  ],
  "reward": {
   "xp": 94
  },
  "storyDe": "Ein stiller Umweg führt zu Freier Himmel.",
  "storyEn": "A quiet detour leads to Freier Himmel."
 },
 {
  "id": "L08s10",
  "league": 8,
  "place": "Stutenmilch",
  "col": 2,
  "row": 3,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L08s12"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Der Pfad führt weiter über Stutenmilch.",
  "storyEn": "The path leads on across Stutenmilch."
 },
 {
  "id": "L08s11",
  "league": 8,
  "place": "Flirrende Luft",
  "col": 1,
  "row": 4,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s16"
  ],
  "reward": {
   "xp": 94
  },
  "storyDe": "Abseits des Weges liegt Flirrende Luft.",
  "storyEn": "Off the road lies Flirrende Luft."
 },
 {
  "id": "L08s12",
  "league": 8,
  "place": "Fahnenwind",
  "col": 2,
  "row": 4,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L08s15"
  ],
  "reward": {
   "xp": 99
  },
  "storyDe": "Der Pfad führt weiter über Fahnenwind.",
  "storyEn": "The path leads on across Fahnenwind.",
  "boss": {
   "pure": "b01",
   "rotation": [
    "b01",
    "b09"
   ]
  },
  "tier": 3
 },
 {
  "id": "L08s13",
  "league": 8,
  "place": "Sattelfeste",
  "col": 5,
  "row": 4,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s07"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Sattelfeste.",
  "storyEn": "A side path branches toward Sattelfeste."
 },
 {
  "id": "L08s14",
  "league": 8,
  "place": "Steppenulme",
  "col": 3,
  "row": 4,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L08s09",
   "L08s17"
  ],
  "reward": {
   "xp": 108
  },
  "storyDe": "Der Pfad führt weiter über Steppenulme.",
  "storyEn": "The path leads on across Steppenulme."
 },
 {
  "id": "L08s15",
  "league": 8,
  "place": "Steppenkron",
  "col": 2,
  "row": 4,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L08s21"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Der Pfad führt weiter über Steppenkron.",
  "storyEn": "The path leads on across Steppenkron."
 },
 {
  "id": "L08s16",
  "league": 8,
  "place": "Der Ferne Riegel",
  "col": 1,
  "row": 4,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s19"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Der Ferne Riegel.",
  "storyEn": "A side path branches toward Der Ferne Riegel."
 },
 {
  "id": "L08s17",
  "league": 8,
  "place": "Bannergrund",
  "col": 4,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L08s18"
  ],
  "reward": {
   "xp": 111
  },
  "storyDe": "Die Prüfung wartet bei Bannergrund.",
  "storyEn": "The trial waits at Bannergrund."
 },
 {
  "id": "L08s18",
  "league": 8,
  "place": "Falkenkanzel",
  "col": 4,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L08s22"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Die Prüfung wartet bei Falkenkanzel.",
  "storyEn": "The trial waits at Falkenkanzel.",
  "boss": {
   "piece": "warlock",
   "wins": 2
  },
  "tier": 4
 },
 {
  "id": "L08s19",
  "league": 8,
  "place": "Halle des einen Gangs",
  "col": 1,
  "row": 5,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s26"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Halle des einen Gangs.",
  "storyEn": "A side path branches toward Halle des einen Gangs."
 },
 {
  "id": "L08s20",
  "league": 8,
  "place": "Asras Brunnen",
  "col": 5,
  "row": 5,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s13"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Abseits des Weges liegt Asras Brunnen.",
  "storyEn": "Off the road lies Asras Brunnen."
 },
 {
  "id": "L08s21",
  "league": 8,
  "place": "Hoher Ausguck",
  "col": 2,
  "row": 5,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L08s14",
   "L08s24"
  ],
  "reward": {
   "xp": 105
  },
  "storyDe": "Der Pfad führt weiter über Hoher Ausguck.",
  "storyEn": "The path leads on across Hoher Ausguck."
 },
 {
  "id": "L08s22",
  "league": 8,
  "place": "Verlassene Jurte",
  "col": 4,
  "row": 5,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L08s25"
  ],
  "reward": {
   "xp": 117
  },
  "storyDe": "Die Prüfung wartet bei Verlassene Jurte.",
  "storyEn": "The trial waits at Verlassene Jurte."
 },
 {
  "id": "L08s23",
  "league": 8,
  "place": "Böenritt",
  "col": 5,
  "row": 5,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s20"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Abseits des Weges liegt Böenritt.",
  "storyEn": "Off the road lies Böenritt."
 },
 {
  "id": "L08s24",
  "league": 8,
  "place": "Letzte Schranke",
  "col": 2,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s30"
  ],
  "reward": {
   "xp": 94
  },
  "storyDe": "Ein stiller Umweg führt zu Letzte Schranke.",
  "storyEn": "A quiet detour leads to Letzte Schranke."
 },
 {
  "id": "L08s25",
  "league": 8,
  "place": "Königsweide",
  "col": 4,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L08s27",
   "L08s28"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Die Prüfung wartet bei Königsweide.",
  "storyEn": "The trial waits at Königsweide."
 },
 {
  "id": "L08s26",
  "league": 8,
  "place": "Zerrissene Standarte",
  "col": 1,
  "row": 6,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s29"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Abseits des Weges liegt Zerrissene Standarte.",
  "storyEn": "Off the road lies Zerrissene Standarte."
 },
 {
  "id": "L08s27",
  "league": 8,
  "place": "Der Meister der Lanze",
  "col": 4,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L08s32"
  ],
  "reward": {
   "xp": 123
  },
  "storyDe": "Die Prüfung wartet bei Der Meister der Lanze.",
  "storyEn": "The trial waits at Der Meister der Lanze."
 },
 {
  "id": "L08s28",
  "league": 8,
  "place": "Viehtrift",
  "col": 4,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s31",
   "L08s23"
  ],
  "reward": {
   "xp": 94
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Viehtrift.",
  "storyEn": "A side path branches toward Viehtrift."
 },
 {
  "id": "L08s29",
  "league": 8,
  "place": "Das Ferne Tor",
  "col": 1,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 102,
   "gold": 104
  },
  "storyDe": "Abseits des Weges liegt Das Ferne Tor.",
  "storyEn": "Off the road lies Das Ferne Tor."
 },
 {
  "id": "L08s30",
  "league": 8,
  "place": "Rast der Reiter",
  "col": 2,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s33"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Ein stiller Umweg führt zu Rast der Reiter.",
  "storyEn": "A quiet detour leads to Rast der Reiter."
 },
 {
  "id": "L08s31",
  "league": 8,
  "place": "Hufschlagring",
  "col": 5,
  "row": 7,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s35"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Hufschlagring.",
  "storyEn": "A side path branches toward Hufschlagring."
 },
 {
  "id": "L08s32",
  "league": 8,
  "place": "Grasklause",
  "col": 4,
  "row": 7,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L08s36"
  ],
  "reward": {
   "xp": 126
  },
  "storyDe": "Die Prüfung wartet bei Grasklause.",
  "storyEn": "The trial waits at Grasklause."
 },
 {
  "id": "L08s33",
  "league": 8,
  "place": "Schilfmeer",
  "col": 2,
  "row": 7,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s37"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Ein stiller Umweg führt zu Schilfmeer.",
  "storyEn": "A quiet detour leads to Schilfmeer."
 },
 {
  "id": "L08s34",
  "league": 8,
  "place": "Stromschnellenfurt",
  "col": 6,
  "row": 7,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 102,
   "gold": 104
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Stromschnellenfurt.",
  "storyEn": "A side path branches toward Stromschnellenfurt."
 },
 {
  "id": "L08s35",
  "league": 8,
  "place": "Hufeisenglück",
  "col": 5,
  "row": 7,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s34"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Abseits des Weges liegt Hufeisenglück.",
  "storyEn": "Off the road lies Hufeisenglück."
 },
 {
  "id": "L08s36",
  "league": 8,
  "place": "Murmeltierstadt",
  "col": 4,
  "row": 7,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s38",
   "L08s39"
  ],
  "reward": {
   "xp": 129
  },
  "storyDe": "Der letzte Anstieg:  Murmeltierstadt.",
  "storyEn": "The final ascent:  Murmeltierstadt."
 },
 {
  "id": "L08s37",
  "league": 8,
  "place": "Grasklinge",
  "col": 2,
  "row": 8,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s41"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Grasklinge.",
  "storyEn": "A side path branches toward Grasklinge."
 },
 {
  "id": "L08s38",
  "league": 8,
  "place": "Bohlenweg",
  "col": 4,
  "row": 8,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 94,
   "gold": 34
  },
  "storyDe": "Abseits des Weges liegt Bohlenweg.",
  "storyEn": "Off the road lies Bohlenweg."
 },
 {
  "id": "L08s39",
  "league": 8,
  "place": "Bei den Pferdehirten",
  "col": 4,
  "row": 8,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s40"
  ],
  "reward": {
   "xp": 132
  },
  "storyDe": "Der letzte Anstieg:  Bei den Pferdehirten.",
  "storyEn": "The final ascent:  Bei den Pferdehirten."
 },
 {
  "id": "L08s40",
  "league": 8,
  "place": "Der Wispernde Halm",
  "col": 5,
  "row": 9,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s43",
   "L08s46"
  ],
  "reward": {
   "xp": 135
  },
  "storyDe": "Der letzte Anstieg:  Der Wispernde Halm.",
  "storyEn": "The final ascent:  Der Wispernde Halm."
 },
 {
  "id": "L08s41",
  "league": 8,
  "place": "Zeltasche",
  "col": 2,
  "row": 9,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s42"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Abseits des Weges liegt Zeltasche.",
  "storyEn": "Off the road lies Zeltasche."
 },
 {
  "id": "L08s42",
  "league": 8,
  "place": "Weidewende",
  "col": 2,
  "row": 9,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s44"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Ein stiller Umweg führt zu Weidewende.",
  "storyEn": "A quiet detour leads to Weidewende."
 },
 {
  "id": "L08s43",
  "league": 8,
  "place": "Späherzinne",
  "col": 4,
  "row": 9,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L08s47"
  ],
  "reward": {
   "xp": 94
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Späherzinne.",
  "storyEn": "A side path branches toward Späherzinne."
 },
 {
  "id": "L08s44",
  "league": 8,
  "place": "Trockene Tränke",
  "col": 1,
  "row": 9,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s45"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Abseits des Weges liegt Trockene Tränke.",
  "storyEn": "Off the road lies Trockene Tränke."
 },
 {
  "id": "L08s45",
  "league": 8,
  "place": "Wolfsfalle",
  "col": 1,
  "row": 9,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 102,
   "gold": 104
  },
  "storyDe": "Ein stiller Umweg führt zu Wolfsfalle.",
  "storyEn": "A quiet detour leads to Wolfsfalle."
 },
 {
  "id": "L08s46",
  "league": 8,
  "place": "Geierschatten",
  "col": 5,
  "row": 9,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s48"
  ],
  "reward": {
   "xp": 138
  },
  "storyDe": "Der letzte Anstieg:  Geierschatten.",
  "storyEn": "The final ascent:  Geierschatten."
 },
 {
  "id": "L08s47",
  "league": 8,
  "place": "Siegerquell",
  "col": 4,
  "row": 9,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 102,
   "gold": 62
  },
  "storyDe": "Abseits des Weges liegt Siegerquell.",
  "storyEn": "Off the road lies Siegerquell."
 },
 {
  "id": "L08s48",
  "league": 8,
  "place": "Brandschneise",
  "col": 5,
  "row": 10,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L08s49"
  ],
  "reward": {
   "xp": 141
  },
  "storyDe": "Der letzte Anstieg:  Brandschneise.",
  "storyEn": "The final ascent:  Brandschneise."
 },
 {
  "id": "L08s49",
  "league": 8,
  "place": "Distelwind",
  "col": 5,
  "row": 10,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 144,
   "gold": 52
  },
  "storyDe": "Distelwind: Hier wartet der Meister von Kapitel VIII.",
  "storyEn": "Distelwind: here waits the master of chapter VIII.",
  "boss": {
   "pure": "b17"
  },
  "tier": 4
 },
 {
  "id": "L09s00",
  "league": 9,
  "place": "Oberkante",
  "col": 1,
  "row": 1,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L09s01"
  ],
  "reward": {
   "xp": 84
  },
  "storyDe": "Der Weg beginnt bei Oberkante.",
  "storyEn": "The road begins at Oberkante."
 },
 {
  "id": "L09s01",
  "league": 9,
  "place": "Hammerschlag",
  "col": 1,
  "row": 2,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L09s02",
   "L09s07"
  ],
  "reward": {
   "xp": 87
  },
  "storyDe": "Der Weg beginnt bei Hammerschlag.",
  "storyEn": "The road begins at Hammerschlag."
 },
 {
  "id": "L09s02",
  "league": 9,
  "place": "Zinnoberaltar",
  "col": 2,
  "row": 2,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L09s04"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Der Weg beginnt bei Zinnoberaltar.",
  "storyEn": "The road begins at Zinnoberaltar."
 },
 {
  "id": "L09s03",
  "league": 9,
  "place": "Räubersitz",
  "col": 5,
  "row": 3,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 108,
   "gold": 112
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Räubersitz.",
  "storyEn": "A side path branches toward Räubersitz."
 },
 {
  "id": "L09s04",
  "league": 9,
  "place": "Geröllrutsche",
  "col": 2,
  "row": 3,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L09s06"
  ],
  "reward": {
   "xp": 93
  },
  "storyDe": "Der Weg beginnt bei Geröllrutsche.",
  "storyEn": "The road begins at Geröllrutsche."
 },
 {
  "id": "L09s05",
  "league": 9,
  "place": "Der Kondorpfad",
  "col": 4,
  "row": 3,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L09s03"
  ],
  "reward": {
   "xp": 108
  },
  "storyDe": "Ein stiller Umweg führt zu Der Kondorpfad.",
  "storyEn": "A quiet detour leads to Der Kondorpfad."
 },
 {
  "id": "L09s06",
  "league": 9,
  "place": "Wo die Treppe hinabführt",
  "col": 2,
  "row": 3,
  "map": "arena",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L09s08"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Der Pfad führt weiter über Wo die Treppe hinabführt.",
  "storyEn": "The path leads on across Wo die Treppe hinabführt."
 },
 {
  "id": "L09s07",
  "league": 9,
  "place": "Messerschlucht",
  "col": 1,
  "row": 4,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L09s10"
  ],
  "reward": {
   "xp": 100
  },
  "storyDe": "Abseits des Weges liegt Messerschlucht.",
  "storyEn": "Off the road lies Messerschlucht."
 },
 {
  "id": "L09s08",
  "league": 9,
  "place": "Steinmesse",
  "col": 3,
  "row": 4,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L09s11"
  ],
  "reward": {
   "xp": 99
  },
  "storyDe": "Der Pfad führt weiter über Steinmesse.",
  "storyEn": "The path leads on across Steinmesse.",
  "boss": {
   "pure": "b13",
   "rotation": [
    "b13",
    "b22"
   ]
  },
  "tier": 4
 },
 {
  "id": "L09s09",
  "league": 9,
  "place": "Kupferader",
  "col": 4,
  "row": 4,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L09s05",
   "L09s12"
  ],
  "reward": {
   "xp": 100
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Kupferader.",
  "storyEn": "A side path branches toward Kupferader."
 },
 {
  "id": "L09s10",
  "league": 9,
  "place": "Abbruchkante",
  "col": 1,
  "row": 4,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L09s15"
  ],
  "reward": {
   "xp": 108
  },
  "storyDe": "Abseits des Weges liegt Abbruchkante.",
  "storyEn": "Off the road lies Abbruchkante."
 },
 {
  "id": "L09s11",
  "league": 9,
  "place": "Flimmerhitze",
  "col": 3,
  "row": 4,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L09s09",
   "L09s14",
   "L09s16"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Der Pfad führt weiter über Flimmerhitze.",
  "storyEn": "The path leads on across Flimmerhitze."
 },
 {
  "id": "L09s12",
  "league": 9,
  "place": "Glutofen",
  "col": 4,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L09s13"
  ],
  "reward": {
   "xp": 108
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Glutofen.",
  "storyEn": "A side path branches toward Glutofen."
 },
 {
  "id": "L09s13",
  "league": 9,
  "place": "Felsenhorst",
  "col": 5,
  "row": 5,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L09s17"
  ],
  "reward": {
   "xp": 108
  },
  "storyDe": "Abseits des Weges liegt Felsenhorst.",
  "storyEn": "Off the road lies Felsenhorst."
 },
 {
  "id": "L09s14",
  "league": 9,
  "place": "Zinnendorn",
  "col": 3,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L09s18"
  ],
  "reward": {
   "xp": 105
  },
  "storyDe": "Der Pfad führt weiter über Zinnendorn.",
  "storyEn": "The path leads on across Zinnendorn."
 },
 {
  "id": "L09s15",
  "league": 9,
  "place": "Glutkamm",
  "col": 1,
  "row": 5,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 108,
   "gold": 67
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Glutkamm.",
  "storyEn": "A side path branches toward Glutkamm."
 },
 {
  "id": "L09s16",
  "league": 9,
  "place": "Das Berstende Tor",
  "col": 2,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L09s19",
   "L09s20"
  ],
  "reward": {
   "xp": 100
  },
  "storyDe": "Abseits des Weges liegt Das Berstende Tor.",
  "storyEn": "Off the road lies Das Berstende Tor."
 },
 {
  "id": "L09s17",
  "league": 9,
  "place": "Schwalbennische",
  "col": 5,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 108,
   "gold": 112
  },
  "storyDe": "Ein stiller Umweg führt zu Schwalbennische.",
  "storyEn": "A quiet detour leads to Schwalbennische."
 },
 {
  "id": "L09s18",
  "league": 9,
  "place": "Kondorkanzel",
  "col": 4,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L09s21"
  ],
  "reward": {
   "xp": 108
  },
  "storyDe": "Die Prüfung wartet bei Kondorkanzel.",
  "storyEn": "The trial waits at Kondorkanzel."
 },
 {
  "id": "L09s19",
  "league": 9,
  "place": "Halle der geballten Faust",
  "col": 2,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L09s24"
  ],
  "reward": {
   "xp": 108
  },
  "storyDe": "Abseits des Weges liegt Halle der geballten Faust.",
  "storyEn": "Off the road lies Halle der geballten Faust."
 },
 {
  "id": "L09s20",
  "league": 9,
  "place": "Blasebalg",
  "col": 3,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 108,
   "gold": 112
  },
  "storyDe": "Ein stiller Umweg führt zu Blasebalg.",
  "storyEn": "A quiet detour leads to Blasebalg."
 },
 {
  "id": "L09s21",
  "league": 9,
  "place": "Aussichtsnadel",
  "col": 4,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L09s22"
  ],
  "reward": {
   "xp": 111
  },
  "storyDe": "Die Prüfung wartet bei Aussichtsnadel.",
  "storyEn": "The trial waits at Aussichtsnadel.",
  "boss": {
   "piece": "inquisitor",
   "wins": 2
  },
  "tier": 4
 },
 {
  "id": "L09s22",
  "league": 9,
  "place": "Verlassener Stollen",
  "col": 4,
  "row": 7,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L09s23"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Die Prüfung wartet bei Verlassener Stollen.",
  "storyEn": "The trial waits at Verlassener Stollen."
 },
 {
  "id": "L09s23",
  "league": 9,
  "place": "Steinschlag",
  "col": 4,
  "row": 7,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L09s25"
  ],
  "reward": {
   "xp": 117
  },
  "storyDe": "Die Prüfung wartet bei Steinschlag.",
  "storyEn": "The trial waits at Steinschlag."
 },
 {
  "id": "L09s24",
  "league": 9,
  "place": "Tiefenblick",
  "col": 1,
  "row": 8,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 108,
   "gold": 112
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Tiefenblick.",
  "storyEn": "A side path branches toward Tiefenblick."
 },
 {
  "id": "L09s25",
  "league": 9,
  "place": "Königsschlucht",
  "col": 4,
  "row": 8,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L09s26",
   "L09s27"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Der letzte Anstieg:  Königsschlucht.",
  "storyEn": "The final ascent:  Königsschlucht."
 },
 {
  "id": "L09s26",
  "league": 9,
  "place": "Rostregen",
  "col": 4,
  "row": 8,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L09s28"
  ],
  "reward": {
   "xp": 100
  },
  "storyDe": "Ein stiller Umweg führt zu Rostregen.",
  "storyEn": "A quiet detour leads to Rostregen."
 },
 {
  "id": "L09s27",
  "league": 9,
  "place": "Die Faust am Grund",
  "col": 5,
  "row": 8,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L09s29",
   "L09s31"
  ],
  "reward": {
   "xp": 123
  },
  "storyDe": "Der letzte Anstieg:  Die Faust am Grund.",
  "storyEn": "The final ascent:  Die Faust am Grund."
 },
 {
  "id": "L09s28",
  "league": 9,
  "place": "Maultiersteige",
  "col": 4,
  "row": 8,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L09s30"
  ],
  "reward": {
   "xp": 108
  },
  "storyDe": "Abseits des Weges liegt Maultiersteige.",
  "storyEn": "Off the road lies Maultiersteige."
 },
 {
  "id": "L09s29",
  "league": 9,
  "place": "Das Glühende Tor",
  "col": 5,
  "row": 8,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L09s32"
  ],
  "reward": {
   "xp": 126
  },
  "storyDe": "Der letzte Anstieg:  Das Glühende Tor.",
  "storyEn": "The final ascent:  Das Glühende Tor."
 },
 {
  "id": "L09s30",
  "league": 9,
  "place": "Rast am Schlund",
  "col": 4,
  "row": 8,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L09s33"
  ],
  "reward": {
   "xp": 108
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Rast am Schlund.",
  "storyEn": "A side path branches toward Rast am Schlund."
 },
 {
  "id": "L09s31",
  "league": 9,
  "place": "Zerborstene Stufen",
  "col": 4,
  "row": 9,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 100,
   "gold": 37
  },
  "storyDe": "Abseits des Weges liegt Zerborstene Stufen.",
  "storyEn": "Off the road lies Zerborstene Stufen."
 },
 {
  "id": "L09s32",
  "league": 9,
  "place": "Einsiedlerloch",
  "col": 5,
  "row": 9,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L09s34"
  ],
  "reward": {
   "xp": 129
  },
  "storyDe": "Der letzte Anstieg:  Einsiedlerloch.",
  "storyEn": "The final ascent:  Einsiedlerloch."
 },
 {
  "id": "L09s33",
  "league": 9,
  "place": "Windgeschliffen",
  "col": 3,
  "row": 9,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 108,
   "gold": 112
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Windgeschliffen.",
  "storyEn": "A side path branches toward Windgeschliffen."
 },
 {
  "id": "L09s34",
  "league": 9,
  "place": "Furtlose Enge",
  "col": 5,
  "row": 9,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 132,
   "gold": 56
  },
  "storyDe": "Furtlose Enge: Hier wartet der Meister von Kapitel IX.",
  "storyEn": "Furtlose Enge: here waits the master of chapter IX.",
  "boss": {
   "pure": "b18"
  },
  "tier": 4
 },
 {
  "id": "L10s00",
  "league": 10,
  "place": "Trockentor",
  "col": 0,
  "row": 1,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L10s02"
  ],
  "reward": {
   "xp": 90
  },
  "storyDe": "Der Weg beginnt bei Trockentor.",
  "storyEn": "The road begins at Trockentor."
 },
 {
  "id": "L10s01",
  "league": 10,
  "place": "Karawanenglocke",
  "col": 3,
  "row": 2,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 114,
   "gold": 120
  },
  "storyDe": "Ein stiller Umweg führt zu Karawanenglocke.",
  "storyEn": "A quiet detour leads to Karawanenglocke."
 },
 {
  "id": "L10s02",
  "league": 10,
  "place": "Dünenaltar",
  "col": 1,
  "row": 2,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L10s04"
  ],
  "reward": {
   "xp": 93
  },
  "storyDe": "Der Weg beginnt bei Dünenaltar.",
  "storyEn": "The road begins at Dünenaltar."
 },
 {
  "id": "L10s03",
  "league": 10,
  "place": "Lastenrast",
  "col": 3,
  "row": 2,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s01"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Abseits des Weges liegt Lastenrast.",
  "storyEn": "Off the road lies Lastenrast."
 },
 {
  "id": "L10s04",
  "league": 10,
  "place": "Dornengürtel",
  "col": 1,
  "row": 2,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L10s05"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Der Weg beginnt bei Dornengürtel.",
  "storyEn": "The road begins at Dornengürtel."
 },
 {
  "id": "L10s05",
  "league": 10,
  "place": "Der Fennekpfad",
  "col": 1,
  "row": 3,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L10s08"
  ],
  "reward": {
   "xp": 99
  },
  "storyDe": "Der Weg beginnt bei Der Fennekpfad.",
  "storyEn": "The road begins at Der Fennekpfad."
 },
 {
  "id": "L10s06",
  "league": 10,
  "place": "Wo der Name verweht",
  "col": 2,
  "row": 3,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s03",
   "L10s07"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Abseits des Weges liegt Wo der Name verweht.",
  "storyEn": "Off the road lies Wo der Name verweht."
 },
 {
  "id": "L10s07",
  "league": 10,
  "place": "Spiegelung",
  "col": 2,
  "row": 3,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s10"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Ein stiller Umweg führt zu Spiegelung.",
  "storyEn": "A quiet detour leads to Spiegelung."
 },
 {
  "id": "L10s08",
  "league": 10,
  "place": "Oasenmesse",
  "col": 1,
  "row": 4,
  "map": "arena",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L10s15"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Der Weg beginnt bei Oasenmesse.",
  "storyEn": "The road begins at Oasenmesse."
 },
 {
  "id": "L10s09",
  "league": 10,
  "place": "Sieben Palmen",
  "col": 3,
  "row": 4,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s06"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Abseits des Weges liegt Sieben Palmen.",
  "storyEn": "Off the road lies Sieben Palmen."
 },
 {
  "id": "L10s10",
  "league": 10,
  "place": "Glasfeld",
  "col": 2,
  "row": 4,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s14"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Ein stiller Umweg führt zu Glasfeld.",
  "storyEn": "A quiet detour leads to Glasfeld."
 },
 {
  "id": "L10s11",
  "league": 10,
  "place": "Fata Morgana",
  "col": 5,
  "row": 4,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s16"
  ],
  "reward": {
   "xp": 162
  },
  "storyDe": "Die Prüfung wartet bei Fata Morgana.",
  "storyEn": "The trial waits at Fata Morgana."
 },
 {
  "id": "L10s12",
  "league": 10,
  "place": "Wanderdüne",
  "col": 3,
  "row": 4,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s09"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Abseits des Weges liegt Wanderdüne.",
  "storyEn": "Off the road lies Wanderdüne."
 },
 {
  "id": "L10s13",
  "league": 10,
  "place": "Karawanserei",
  "col": 5,
  "row": 5,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L10s11"
  ],
  "reward": {
   "xp": 159
  },
  "storyDe": "Die Prüfung wartet bei Karawanserei.",
  "storyEn": "The trial waits at Karawanserei."
 },
 {
  "id": "L10s14",
  "league": 10,
  "place": "Dattelhain",
  "col": 1,
  "row": 5,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 114
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Dattelhain.",
  "storyEn": "A side path branches toward Dattelhain.",
  "boss": {
   "piece": "strategist",
   "wins": 1
  },
  "tier": 3
 },
 {
  "id": "L10s15",
  "league": 10,
  "place": "Sonnenspeer",
  "col": 1,
  "row": 5,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L10s20"
  ],
  "reward": {
   "xp": 105
  },
  "storyDe": "Der Weg beginnt bei Sonnenspeer.",
  "storyEn": "The road begins at Sonnenspeer."
 },
 {
  "id": "L10s16",
  "league": 10,
  "place": "Das Versandete Tor",
  "col": 5,
  "row": 5,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s19"
  ],
  "reward": {
   "xp": 165
  },
  "storyDe": "Der letzte Anstieg:  Das Versandete Tor.",
  "storyEn": "The final ascent:  Das Versandete Tor.",
  "boss": {
   "piece": "engineer",
   "wins": 2
  },
  "tier": 3
 },
 {
  "id": "L10s17",
  "league": 10,
  "place": "Salzkruste",
  "col": 3,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s12"
  ],
  "reward": {
   "xp": 106
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Salzkruste.",
  "storyEn": "A side path branches toward Salzkruste."
 },
 {
  "id": "L10s18",
  "league": 10,
  "place": "Geierkanzel",
  "col": 4,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L10s13"
  ],
  "reward": {
   "xp": 156
  },
  "storyDe": "Die Prüfung wartet bei Geierkanzel.",
  "storyEn": "The trial waits at Geierkanzel."
 },
 {
  "id": "L10s19",
  "league": 10,
  "place": "Halle des letzten Tors",
  "col": 5,
  "row": 6,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s26"
  ],
  "reward": {
   "xp": 168
  },
  "storyDe": "Der letzte Anstieg:  Halle des letzten Tors.",
  "storyEn": "The final ascent:  Halle des letzten Tors."
 },
 {
  "id": "L10s20",
  "league": 10,
  "place": "Vesnas Schatten",
  "col": 1,
  "row": 6,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L10s27"
  ],
  "reward": {
   "xp": 108
  },
  "storyDe": "Der Weg beginnt bei Vesnas Schatten.",
  "storyEn": "The road begins at Vesnas Schatten."
 },
 {
  "id": "L10s21",
  "league": 10,
  "place": "Hoher Kamm",
  "col": 4,
  "row": 6,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L10s18",
   "L10s22"
  ],
  "reward": {
   "xp": 153
  },
  "storyDe": "Die Prüfung wartet bei Hoher Kamm.",
  "storyEn": "The trial waits at Hoher Kamm."
 },
 {
  "id": "L10s22",
  "league": 10,
  "place": "Vergessene Zisterne",
  "col": 4,
  "row": 6,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L10s25"
  ],
  "reward": {
   "xp": 106
  },
  "storyDe": "Ein stiller Umweg führt zu Vergessene Zisterne.",
  "storyEn": "A quiet detour leads to Vergessene Zisterne."
 },
 {
  "id": "L10s23",
  "league": 10,
  "place": "Sandhose",
  "col": 3,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L10s17",
   "L10s24"
  ],
  "reward": {
   "xp": 147
  },
  "storyDe": "Die Prüfung wartet bei Sandhose.",
  "storyEn": "The trial waits at Sandhose."
 },
 {
  "id": "L10s24",
  "league": 10,
  "place": "Gebleichte Rippen",
  "col": 4,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L10s21"
  ],
  "reward": {
   "xp": 150
  },
  "storyDe": "Die Prüfung wartet bei Gebleichte Rippen.",
  "storyEn": "The trial waits at Gebleichte Rippen."
 },
 {
  "id": "L10s25",
  "league": 10,
  "place": "Königsdüne",
  "col": 5,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 114,
   "gold": 72
  },
  "storyDe": "Ein stiller Umweg führt zu Königsdüne.",
  "storyEn": "A quiet detour leads to Königsdüne."
 },
 {
  "id": "L10s26",
  "league": 10,
  "place": "Glutspiegel",
  "col": 5,
  "row": 6,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s29"
  ],
  "reward": {
   "xp": 171
  },
  "storyDe": "Der letzte Anstieg:  Glutspiegel.",
  "storyEn": "The final ascent:  Glutspiegel."
 },
 {
  "id": "L10s27",
  "league": 10,
  "place": "Der Kanonier am Wasser",
  "col": 1,
  "row": 6,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L10s30"
  ],
  "reward": {
   "xp": 111
  },
  "storyDe": "Der Weg beginnt bei Der Kanonier am Wasser.",
  "storyEn": "The road begins at Der Kanonier am Wasser."
 },
 {
  "id": "L10s28",
  "league": 10,
  "place": "Kamelspur",
  "col": 3,
  "row": 7,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L10s23"
  ],
  "reward": {
   "xp": 144
  },
  "storyDe": "Die Prüfung wartet bei Kamelspur.",
  "storyEn": "The trial waits at Kamelspur."
 },
 {
  "id": "L10s29",
  "league": 10,
  "place": "Das Flüsternde Tor",
  "col": 5,
  "row": 7,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s31"
  ],
  "reward": {
   "xp": 174
  },
  "storyDe": "Der letzte Anstieg:  Das Flüsternde Tor.",
  "storyEn": "The final ascent:  Das Flüsternde Tor."
 },
 {
  "id": "L10s30",
  "league": 10,
  "place": "Rast der Durstigen",
  "col": 1,
  "row": 7,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L10s33"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Der Weg beginnt bei Rast der Durstigen.",
  "storyEn": "The road begins at Rast der Durstigen."
 },
 {
  "id": "L10s31",
  "league": 10,
  "place": "Dünenwerder",
  "col": 5,
  "row": 7,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s37"
  ],
  "reward": {
   "xp": 177
  },
  "storyDe": "Der letzte Anstieg:  Dünenwerder.",
  "storyEn": "The final ascent:  Dünenwerder."
 },
 {
  "id": "L10s32",
  "league": 10,
  "place": "Sandklause",
  "col": 3,
  "row": 7,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L10s28"
  ],
  "reward": {
   "xp": 141
  },
  "storyDe": "Die Prüfung wartet bei Sandklause.",
  "storyEn": "The trial waits at Sandklause."
 },
 {
  "id": "L10s33",
  "league": 10,
  "place": "Palmschatten",
  "col": 1,
  "row": 8,
  "map": "arena",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L10s39"
  ],
  "reward": {
   "xp": 117
  },
  "storyDe": "Der Pfad führt weiter über Palmschatten.",
  "storyEn": "The path leads on across Palmschatten."
 },
 {
  "id": "L10s34",
  "league": 10,
  "place": "Wasserprobe",
  "col": 3,
  "row": 8,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L10s32"
  ],
  "reward": {
   "xp": 138
  },
  "storyDe": "Der Pfad führt weiter über Wasserprobe.",
  "storyEn": "The path leads on across Wasserprobe."
 },
 {
  "id": "L10s35",
  "league": 10,
  "place": "Skarabäenfeld",
  "col": 5,
  "row": 8,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s36"
  ],
  "reward": {
   "xp": 106
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Skarabäenfeld.",
  "storyEn": "A side path branches toward Skarabäenfeld."
 },
 {
  "id": "L10s36",
  "league": 10,
  "place": "Blaue Grotte",
  "col": 4,
  "row": 8,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s38"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Abseits des Weges liegt Blaue Grotte.",
  "storyEn": "Off the road lies Blaue Grotte."
 },
 {
  "id": "L10s37",
  "league": 10,
  "place": "Treibsandfalle",
  "col": 5,
  "row": 8,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s35",
   "L10s41"
  ],
  "reward": {
   "xp": 180
  },
  "storyDe": "Der letzte Anstieg:  Treibsandfalle.",
  "storyEn": "The final ascent:  Treibsandfalle."
 },
 {
  "id": "L10s38",
  "league": 10,
  "place": "Seilbrück",
  "col": 4,
  "row": 8,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s43"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Seilbrück.",
  "storyEn": "A side path branches toward Seilbrück."
 },
 {
  "id": "L10s39",
  "league": 10,
  "place": "Bei den Wasserträgern",
  "col": 1,
  "row": 8,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 2,
  "next": [
   "L10s42"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Der Pfad führt weiter über Bei den Wasserträgern.",
  "storyEn": "The path leads on across Bei den Wasserträgern.",
  "boss": {
   "pure": "b05",
   "rotation": [
    "b05",
    "b24"
   ]
  },
  "tier": 3
 },
 {
  "id": "L10s40",
  "league": 10,
  "place": "Der Singende Fels",
  "col": 2,
  "row": 8,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L10s34"
  ],
  "reward": {
   "xp": 135
  },
  "storyDe": "Der Pfad führt weiter über Der Singende Fels.",
  "storyEn": "The path leads on across Der Singende Fels."
 },
 {
  "id": "L10s41",
  "league": 10,
  "place": "Bleichgart",
  "col": 5,
  "row": 9,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s47"
  ],
  "reward": {
   "xp": 183
  },
  "storyDe": "Der letzte Anstieg:  Bleichgart.",
  "storyEn": "The final ascent:  Bleichgart."
 },
 {
  "id": "L10s42",
  "league": 10,
  "place": "Sichelgrab",
  "col": 1,
  "row": 9,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L10s45"
  ],
  "reward": {
   "xp": 123
  },
  "storyDe": "Der Pfad führt weiter über Sichelgrab.",
  "storyEn": "The path leads on across Sichelgrab."
 },
 {
  "id": "L10s43",
  "league": 10,
  "place": "Spiegelzinne",
  "col": 4,
  "row": 9,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s46"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Ein stiller Umweg führt zu Spiegelzinne.",
  "storyEn": "A quiet detour leads to Spiegelzinne."
 },
 {
  "id": "L10s44",
  "league": 10,
  "place": "Ausgetrocknet",
  "col": 2,
  "row": 9,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L10s40"
  ],
  "reward": {
   "xp": 132
  },
  "storyDe": "Der Pfad führt weiter über Ausgetrocknet.",
  "storyEn": "The path leads on across Ausgetrocknet.",
  "boss": {
   "piece": "archbishop",
   "wins": 2
  },
  "tier": 3
 },
 {
  "id": "L10s45",
  "league": 10,
  "place": "Schlangenloch",
  "col": 1,
  "row": 9,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L10s48"
  ],
  "reward": {
   "xp": 126
  },
  "storyDe": "Der Pfad führt weiter über Schlangenloch.",
  "storyEn": "The path leads on across Schlangenloch."
 },
 {
  "id": "L10s46",
  "league": 10,
  "place": "Stachelnest",
  "col": 3,
  "row": 9,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 114,
   "gold": 120
  },
  "storyDe": "Ein stiller Umweg führt zu Stachelnest.",
  "storyEn": "A quiet detour leads to Stachelnest."
 },
 {
  "id": "L10s47",
  "league": 10,
  "place": "Tiefbrunnen",
  "col": 5,
  "row": 9,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [
   "L10s49"
  ],
  "reward": {
   "xp": 186
  },
  "storyDe": "Der letzte Anstieg:  Tiefbrunnen.",
  "storyEn": "The final ascent:  Tiefbrunnen."
 },
 {
  "id": "L10s48",
  "league": 10,
  "place": "Namenlose Weite",
  "col": 2,
  "row": 9,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 2,
  "next": [
   "L10s44"
  ],
  "reward": {
   "xp": 129
  },
  "storyDe": "Der Pfad führt weiter über Namenlose Weite.",
  "storyEn": "The path leads on across Namenlose Weite."
 },
 {
  "id": "L10s49",
  "league": 10,
  "place": "Sternenpfad",
  "col": 5,
  "row": 10,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 2,
  "next": [],
  "reward": {
   "xp": 189,
   "gold": 60
  },
  "storyDe": "Sternenpfad: Hier wartet der Meister von Kapitel X.",
  "storyEn": "Sternenpfad: here waits the master of chapter X.",
  "boss": {
   "pure": "b08"
  },
  "tier": 3
 },
 {
  "id": "L11s00",
  "league": 11,
  "place": "Erste Gischt",
  "col": 3,
  "row": 1,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 171,
   "gold": 64
  },
  "storyDe": "Erste Gischt: Hier wartet der Meister von Kapitel XI.",
  "storyEn": "Erste Gischt: here waits the master of chapter XI.",
  "boss": {
   "pure": "b14"
  },
  "tier": 4
 },
 {
  "id": "L11s01",
  "league": 11,
  "place": "Tidenglocke",
  "col": 0,
  "row": 1,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L11s03"
  ],
  "reward": {
   "xp": 96
  },
  "storyDe": "Der Weg beginnt bei Tidenglocke.",
  "storyEn": "The road begins at Tidenglocke."
 },
 {
  "id": "L11s02",
  "league": 11,
  "place": "Wrackaltar",
  "col": 4,
  "row": 1,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s00"
  ],
  "reward": {
   "xp": 168
  },
  "storyDe": "Der letzte Anstieg:  Wrackaltar.",
  "storyEn": "The final ascent:  Wrackaltar."
 },
 {
  "id": "L11s03",
  "league": 11,
  "place": "Strandgutlese",
  "col": 0,
  "row": 1,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L11s05",
   "L11s08"
  ],
  "reward": {
   "xp": 99
  },
  "storyDe": "Der Weg beginnt bei Strandgutlese.",
  "storyEn": "The road begins at Strandgutlese."
 },
 {
  "id": "L11s04",
  "league": 11,
  "place": "Muschelscherben",
  "col": 4,
  "row": 2,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s02"
  ],
  "reward": {
   "xp": 165
  },
  "storyDe": "Der letzte Anstieg:  Muschelscherben.",
  "storyEn": "The final ascent:  Muschelscherben."
 },
 {
  "id": "L11s05",
  "league": 11,
  "place": "Der Möwenstrich",
  "col": 1,
  "row": 2,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L11s07"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Der Weg beginnt bei Der Möwenstrich.",
  "storyEn": "The road begins at Der Möwenstrich."
 },
 {
  "id": "L11s06",
  "league": 11,
  "place": "Wo der Riss ausblutet",
  "col": 4,
  "row": 2,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s04"
  ],
  "reward": {
   "xp": 162
  },
  "storyDe": "Der letzte Anstieg:  Wo der Riss ausblutet.",
  "storyEn": "The final ascent:  Wo der Riss ausblutet."
 },
 {
  "id": "L11s07",
  "league": 11,
  "place": "Gezeitenklinge",
  "col": 1,
  "row": 3,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L11s10"
  ],
  "reward": {
   "xp": 105
  },
  "storyDe": "Der Weg beginnt bei Gezeitenklinge.",
  "storyEn": "The road begins at Gezeitenklinge."
 },
 {
  "id": "L11s08",
  "league": 11,
  "place": "Leuchtfeuermesse",
  "col": 1,
  "row": 3,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s11"
  ],
  "reward": {
   "xp": 112
  },
  "storyDe": "Abseits des Weges liegt Leuchtfeuermesse.",
  "storyEn": "Off the road lies Leuchtfeuermesse."
 },
 {
  "id": "L11s09",
  "league": 11,
  "place": "Kap der Fracht",
  "col": 4,
  "row": 3,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s06"
  ],
  "reward": {
   "xp": 159
  },
  "storyDe": "Der letzte Anstieg:  Kap der Fracht.",
  "storyEn": "The final ascent:  Kap der Fracht."
 },
 {
  "id": "L11s10",
  "league": 11,
  "place": "Kalter Sog",
  "col": 1,
  "row": 3,
  "map": "arena",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L11s12"
  ],
  "reward": {
   "xp": 108
  },
  "storyDe": "Der Weg beginnt bei Kalter Sog.",
  "storyEn": "The road begins at Kalter Sog."
 },
 {
  "id": "L11s11",
  "league": 11,
  "place": "Milchsee",
  "col": 1,
  "row": 3,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s13"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Abseits des Weges liegt Milchsee.",
  "storyEn": "Off the road lies Milchsee."
 },
 {
  "id": "L11s12",
  "league": 11,
  "place": "Wogenmark",
  "col": 2,
  "row": 4,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L11s14"
  ],
  "reward": {
   "xp": 111
  },
  "storyDe": "Der Weg beginnt bei Wogenmark.",
  "storyEn": "The road begins at Wogenmark."
 },
 {
  "id": "L11s13",
  "league": 11,
  "place": "Wellenwacht",
  "col": 1,
  "row": 4,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s16"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Wellenwacht.",
  "storyEn": "A side path branches toward Wellenwacht."
 },
 {
  "id": "L11s14",
  "league": 11,
  "place": "Tangwald",
  "col": 2,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L11s17"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Der Weg beginnt bei Tangwald.",
  "storyEn": "The road begins at Tangwald."
 },
 {
  "id": "L11s15",
  "league": 11,
  "place": "Gischtthron",
  "col": 3,
  "row": 5,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 112,
   "gold": 43
  },
  "storyDe": "Ein stiller Umweg führt zu Gischtthron.",
  "storyEn": "A quiet detour leads to Gischtthron."
 },
 {
  "id": "L11s16",
  "league": 11,
  "place": "Das Berstende Gatter",
  "col": 1,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s19"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Das Berstende Gatter.",
  "storyEn": "A side path branches toward Das Berstende Gatter."
 },
 {
  "id": "L11s17",
  "league": 11,
  "place": "Treibnetz",
  "col": 3,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L11s18"
  ],
  "reward": {
   "xp": 117
  },
  "storyDe": "Der Pfad führt weiter über Treibnetz.",
  "storyEn": "The path leads on across Treibnetz."
 },
 {
  "id": "L11s18",
  "league": 11,
  "place": "Möwenkanzel",
  "col": 3,
  "row": 5,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L11s15",
   "L11s20"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Der Pfad führt weiter über Möwenkanzel.",
  "storyEn": "The path leads on across Möwenkanzel.",
  "boss": {
   "pure": "b07",
   "rotation": [
    "b07",
    "b21"
   ]
  },
  "tier": 4
 },
 {
  "id": "L11s19",
  "league": 11,
  "place": "Halle der herrenlosen Fracht",
  "col": 1,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s25"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Halle der herrenlosen Fracht.",
  "storyEn": "A side path branches toward Halle der herrenlosen Fracht."
 },
 {
  "id": "L11s20",
  "league": 11,
  "place": "Kielwasser",
  "col": 3,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L11s21",
   "L11s26"
  ],
  "reward": {
   "xp": 123
  },
  "storyDe": "Der Pfad führt weiter über Kielwasser.",
  "storyEn": "The path leads on across Kielwasser."
 },
 {
  "id": "L11s21",
  "league": 11,
  "place": "Krähennest",
  "col": 3,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L11s27"
  ],
  "reward": {
   "xp": 126
  },
  "storyDe": "Der Pfad führt weiter über Krähennest.",
  "storyEn": "The path leads on across Krähennest."
 },
 {
  "id": "L11s22",
  "league": 11,
  "place": "Verlassener Kai",
  "col": 5,
  "row": 6,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s24"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Verlassener Kai.",
  "storyEn": "A side path branches toward Verlassener Kai."
 },
 {
  "id": "L11s23",
  "league": 11,
  "place": "Sturmglas",
  "col": 5,
  "row": 6,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s22"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Abseits des Weges liegt Sturmglas.",
  "storyEn": "Off the road lies Sturmglas."
 },
 {
  "id": "L11s24",
  "league": 11,
  "place": "Bleicher Horizont",
  "col": 5,
  "row": 6,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 120,
   "gold": 128
  },
  "storyDe": "Ein stiller Umweg führt zu Bleicher Horizont.",
  "storyEn": "A quiet detour leads to Bleicher Horizont."
 },
 {
  "id": "L11s25",
  "league": 11,
  "place": "Königsklippe",
  "col": 0,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s45"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Königsklippe.",
  "storyEn": "A side path branches toward Königsklippe."
 },
 {
  "id": "L11s26",
  "league": 11,
  "place": "Aschesegel",
  "col": 3,
  "row": 6,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s29"
  ],
  "reward": {
   "xp": 112
  },
  "storyDe": "Abseits des Weges liegt Aschesegel.",
  "storyEn": "Off the road lies Aschesegel."
 },
 {
  "id": "L11s27",
  "league": 11,
  "place": "Osrics letztes Tor",
  "col": 4,
  "row": 6,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L11s30"
  ],
  "reward": {
   "xp": 129
  },
  "storyDe": "Der Pfad führt weiter über Osrics letztes Tor.",
  "storyEn": "The path leads on across Osrics letztes Tor.",
  "boss": {
   "piece": "chancellor",
   "wins": 2
  },
  "tier": 4
 },
 {
  "id": "L11s28",
  "league": 11,
  "place": "Wracklichter",
  "col": 4,
  "row": 7,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s23"
  ],
  "reward": {
   "xp": 112
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Wracklichter.",
  "storyEn": "A side path branches toward Wracklichter."
 },
 {
  "id": "L11s29",
  "league": 11,
  "place": "Das Ertrunkene Tor",
  "col": 3,
  "row": 7,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s31"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Abseits des Weges liegt Das Ertrunkene Tor.",
  "storyEn": "Off the road lies Das Ertrunkene Tor."
 },
 {
  "id": "L11s30",
  "league": 11,
  "place": "Rast der Gestrandeten",
  "col": 4,
  "row": 7,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L11s28",
   "L11s32"
  ],
  "reward": {
   "xp": 132
  },
  "storyDe": "Der Pfad führt weiter über Rast der Gestrandeten.",
  "storyEn": "The path leads on across Rast der Gestrandeten."
 },
 {
  "id": "L11s31",
  "league": 11,
  "place": "Piersplitter",
  "col": 3,
  "row": 7,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s34"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Piersplitter.",
  "storyEn": "A side path branches toward Piersplitter."
 },
 {
  "id": "L11s32",
  "league": 11,
  "place": "Brackwasserklause",
  "col": 4,
  "row": 7,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L11s36"
  ],
  "reward": {
   "xp": 135
  },
  "storyDe": "Die Prüfung wartet bei Brackwasserklause.",
  "storyEn": "The trial waits at Brackwasserklause."
 },
 {
  "id": "L11s33",
  "league": 11,
  "place": "Ankerfriedhof",
  "col": 1,
  "row": 7,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s37"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Ein stiller Umweg führt zu Ankerfriedhof.",
  "storyEn": "A quiet detour leads to Ankerfriedhof."
 },
 {
  "id": "L11s34",
  "league": 11,
  "place": "Salzlippen",
  "col": 2,
  "row": 8,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s35"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Salzlippen.",
  "storyEn": "A side path branches toward Salzlippen."
 },
 {
  "id": "L11s35",
  "league": 11,
  "place": "Flaschenpost",
  "col": 2,
  "row": 8,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 120,
   "gold": 128
  },
  "storyDe": "Abseits des Weges liegt Flaschenpost.",
  "storyEn": "Off the road lies Flaschenpost."
 },
 {
  "id": "L11s36",
  "league": 11,
  "place": "Perlmuttgrotte",
  "col": 4,
  "row": 8,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L11s38"
  ],
  "reward": {
   "xp": 138
  },
  "storyDe": "Die Prüfung wartet bei Perlmuttgrotte.",
  "storyEn": "The trial waits at Perlmuttgrotte."
 },
 {
  "id": "L11s37",
  "league": 11,
  "place": "Fährmannsruf",
  "col": 1,
  "row": 8,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 120,
   "gold": 128
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Fährmannsruf.",
  "storyEn": "A side path branches toward Fährmannsruf."
 },
 {
  "id": "L11s38",
  "league": 11,
  "place": "Planke über Schwarz",
  "col": 4,
  "row": 8,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L11s39"
  ],
  "reward": {
   "xp": 141
  },
  "storyDe": "Die Prüfung wartet bei Planke über Schwarz.",
  "storyEn": "The trial waits at Planke über Schwarz."
 },
 {
  "id": "L11s39",
  "league": 11,
  "place": "Bei den Strandläufern",
  "col": 4,
  "row": 9,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L11s41"
  ],
  "reward": {
   "xp": 144
  },
  "storyDe": "Die Prüfung wartet bei Bei den Strandläufern.",
  "storyEn": "The trial waits at Bei den Strandläufern."
 },
 {
  "id": "L11s40",
  "league": 11,
  "place": "Die Stille See",
  "col": 5,
  "row": 9,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L11s42"
  ],
  "reward": {
   "xp": 150
  },
  "storyDe": "Die Prüfung wartet bei Die Stille See.",
  "storyEn": "The trial waits at Die Stille See."
 },
 {
  "id": "L11s41",
  "league": 11,
  "place": "Seegraswiege",
  "col": 4,
  "row": 9,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L11s40",
   "L11s43"
  ],
  "reward": {
   "xp": 147
  },
  "storyDe": "Die Prüfung wartet bei Seegraswiege.",
  "storyEn": "The trial waits at Seegraswiege."
 },
 {
  "id": "L11s42",
  "league": 11,
  "place": "Ebbe und Niemand",
  "col": 5,
  "row": 9,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s44"
  ],
  "reward": {
   "xp": 153
  },
  "storyDe": "Der letzte Anstieg:  Ebbe und Niemand.",
  "storyEn": "The final ascent:  Ebbe und Niemand.",
  "boss": {
   "piece": "standard",
   "wins": 2
  },
  "tier": 4
 },
 {
  "id": "L11s43",
  "league": 11,
  "place": "Der Leuchtturm",
  "col": 4,
  "row": 9,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 112,
   "gold": 43
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Der Leuchtturm.",
  "storyEn": "A side path branches toward Der Leuchtturm."
 },
 {
  "id": "L11s44",
  "league": 11,
  "place": "Robbenbank",
  "col": 5,
  "row": 10,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s09"
  ],
  "reward": {
   "xp": 156
  },
  "storyDe": "Der letzte Anstieg:  Robbenbank.",
  "storyEn": "The final ascent:  Robbenbank."
 },
 {
  "id": "L11s45",
  "league": 11,
  "place": "Tintengrund",
  "col": 1,
  "row": 7,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L11s33"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Ein stiller Umweg führt zu Tintengrund.",
  "storyEn": "A quiet detour leads to Tintengrund."
 },
 {
  "id": "L12s00",
  "league": 12,
  "place": "Der letzte Steg",
  "col": 0,
  "row": 5,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L12s01"
  ],
  "reward": {
   "xp": 118
  },
  "storyDe": "Ein Seitenpfad zweigt ab nach Der letzte Steg.",
  "storyEn": "A side path branches toward Der letzte Steg."
 },
 {
  "id": "L12s01",
  "league": 12,
  "place": "Wrack der Morgenröte",
  "col": 1,
  "row": 8,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 126,
   "gold": 82
  },
  "storyDe": "Abseits des Weges liegt Wrack der Morgenröte.",
  "storyEn": "Off the road lies Wrack der Morgenröte."
 },
 {
  "id": "L12s02",
  "league": 12,
  "place": "Mastbruch",
  "col": 5,
  "row": 3,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 126,
   "gold": 82
  },
  "storyDe": "Ein stiller Umweg führt zu Mastbruch.",
  "storyEn": "A quiet detour leads to Mastbruch."
 },
 {
  "id": "L12s03",
  "league": 12,
  "place": "Einsame Boje",
  "col": 1,
  "row": 3,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L12s04"
  ],
  "reward": {
   "xp": 105
  },
  "storyDe": "Der Weg beginnt bei Einsame Boje.",
  "storyEn": "The road begins at Einsame Boje."
 },
 {
  "id": "L12s04",
  "league": 12,
  "place": "Riff der Rippen",
  "col": 2,
  "row": 4,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L12s05",
   "L12s00"
  ],
  "reward": {
   "xp": 111
  },
  "storyDe": "Der Pfad führt weiter über Riff der Rippen.",
  "storyEn": "The path leads on across Riff der Rippen.",
  "boss": {
   "pure": "b15",
   "rotation": [
    "b15",
    "b04"
   ]
  },
  "tier": 4
 },
 {
  "id": "L12s05",
  "league": 12,
  "place": "Gekentertes Glück",
  "col": 3,
  "row": 6,
  "map": "classic",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L12s06"
  ],
  "reward": {
   "xp": 117
  },
  "storyDe": "Der Pfad führt weiter über Gekentertes Glück.",
  "storyEn": "The path leads on across Gekentertes Glück."
 },
 {
  "id": "L12s06",
  "league": 12,
  "place": "Treibholzfeld",
  "col": 3,
  "row": 7,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L12s07"
  ],
  "reward": {
   "xp": 123
  },
  "storyDe": "Die Prüfung wartet bei Treibholzfeld.",
  "storyEn": "The trial waits at Treibholzfeld."
 },
 {
  "id": "L12s07",
  "league": 12,
  "place": "Versunkener Wachtturm",
  "col": 3,
  "row": 8,
  "map": "arena",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L12s08"
  ],
  "reward": {
   "xp": 129
  },
  "storyDe": "Der letzte Anstieg:  Versunkener Wachtturm.",
  "storyEn": "The final ascent:  Versunkener Wachtturm."
 },
 {
  "id": "L12s08",
  "league": 12,
  "place": "Blitzfeste des Grossmeisters",
  "col": 4,
  "row": 8,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [],
  "reward": {
   "xp": 135,
   "gold": 68
  },
  "storyDe": "Blitzfeste des Grossmeisters: Hier wartet der Meister von Kapitel XII.",
  "storyEn": "Blitzfeste des Grossmeisters: here waits the master of chapter XII.",
  "boss": {
   "pure": "b23"
  },
  "tier": 4
 },
 {
  "id": "L12s09",
  "league": 12,
  "place": "Krumme Klippe",
  "col": 4,
  "row": 7,
  "map": "arena",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L12s12"
  ],
  "reward": {
   "xp": 114
  },
  "storyDe": "Der Pfad führt weiter über Krumme Klippe.",
  "storyEn": "The path leads on across Krumme Klippe."
 },
 {
  "id": "L12s10",
  "league": 12,
  "place": "Nebelbank",
  "col": 4,
  "row": 5,
  "map": "courtyard",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L12s09",
   "L12s11"
  ],
  "reward": {
   "xp": 108
  },
  "storyDe": "Der Weg beginnt bei Nebelbank.",
  "storyEn": "The road begins at Nebelbank."
 },
 {
  "id": "L12s11",
  "league": 12,
  "place": "Sturmsäule",
  "col": 5,
  "row": 5,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L12s02"
  ],
  "reward": {
   "xp": 118
  },
  "storyDe": "Ein stiller Umweg führt zu Sturmsäule.",
  "storyEn": "A quiet detour leads to Sturmsäule."
 },
 {
  "id": "L12s12",
  "league": 12,
  "place": "Leuchtfeuerrest",
  "col": 5,
  "row": 8,
  "map": "skirmish",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L12s14"
  ],
  "reward": {
   "xp": 120
  },
  "storyDe": "Die Prüfung wartet bei Leuchtfeuerrest.",
  "storyEn": "The trial waits at Leuchtfeuerrest.",
  "boss": {
   "piece": "seeress",
   "wins": 2
  },
  "tier": 4
 },
 {
  "id": "L12s13",
  "league": 12,
  "place": "Kap der Stille",
  "col": 4,
  "row": 9,
  "map": "classic",
  "rules": "hp",
  "difficulty": "hard",
  "bump": 3,
  "next": [
   "L12s08"
  ],
  "reward": {
   "xp": 132
  },
  "storyDe": "Der letzte Anstieg:  Kap der Stille.",
  "storyEn": "The final ascent:  Kap der Stille."
 },
 {
  "id": "L12s14",
  "league": 12,
  "place": "Eiserne Untiefe",
  "col": 5,
  "row": 9,
  "map": "gauntlet",
  "rules": "hp",
  "difficulty": "normal",
  "bump": 3,
  "next": [
   "L12s13"
  ],
  "reward": {
   "xp": 126
  },
  "storyDe": "Die Prüfung wartet bei Eiserne Untiefe.",
  "storyEn": "The trial waits at Eiserne Untiefe."
 },
 {
  "id": "L12s15",
  "league": 12,
  "place": "Blitzfeste des Grossmeisters",
  "col": 1,
  "row": 1,
  "map": "classic",
  "rules": "hp",
  "difficulty": "easy",
  "bump": 3,
  "next": [
   "L12s03",
   "L12s10"
  ],
  "reward": {
   "xp": 102
  },
  "storyDe": "Der Weg beginnt bei Blitzfeste des Grossmeisters.",
  "storyEn": "The road begins at Blitzfeste des Grossmeisters."
 }
];
