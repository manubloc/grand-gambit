// ── Place names, per league, tied to the Chronicle of the Rift ───────────────
// League I keeps the authored names from campaign.js (the court's homeland).
// Leagues II–X each get their OWN set of hand-written names, drawn from that
// biome's lore (the Judge's wheat, the amber oaths, Osric's sea …). Keyed by
// node id so every station has a real name — never HEAD+tail filler, never a
// name repeated anywhere across the whole journey.
//
// Kept deliberately in one table so uniqueness is auditable at a glance (a test
// asserts no duplicates across all ten leagues).

export const PLACE_NAMES = {
  // ── II · Sommer — the golden fields, the Judge's supervised harvest ──────────
  2: {
    n01: "Saatwacht", o2: "Brachfeld", n02: "Kornmühle", w1: "Schnitterlager", w3: "Stiller Halm",
    s1: "Grannenwacht", n03: "Ährenschrein", g8: "Gebeugter Schrein", a1: "Sichelwacht", b1: "Sonnenkapelle",
    c1: "Dreschfeste", g5: "Verdorrtes Tor", r1: "Spreuschlucht", a2: "Mahdklippe", b2: "Mittsommerwarte",
    c2: "Lindenmahd", u2: "Verlorene Garbe", a3: "Halmpfad", b3: "Schwelmoor", c3: "Erntekrone",
    g1: "Flammenfurt", u1: "Dörrmulde", z1: "Windfähre", a4: "Glutnest", b4: "Nebelbrache",
    c4: "Richtbollwerk", z2: "Zehntbrücke", u3: "Distelnest", o1: "Röstquelle", a5: "Ährenschlund",
    b5: "Stoppelfeld", c5: "Freihofwall", g4: "Waagstation", n16: "Urteilskanzel", g7: "Verscharrter Pass",
    n17: "Gerichtshalle", d1: "Schmelzgrund", e1: "Öde Scheune", g2: "Halmkluft", s2: "Käferturm",
    d2: "Fronhöhe", e2: "Gewitterfeste", o3: "Kafffeld", g6: "Wiegenrast", n20: "Königsstoppel",
    e3: "Sonnwendwarte", g9: "Mahdbucht", w2: "Welker Garten", n21: "Verkohlter Pass", g3: "Dörrgrotte",
    n22: "Richtfeste",
  },
  // ── III · Herbst — the amber woods where the first oaths turned ──────────────
  3: {
    n01: "Ahornwacht", o2: "Falllaubacker", n02: "Rostmühle", w1: "Köhlerlager", w3: "Schweigender Hain",
    s1: "Reisigwacht", n03: "Bernsteinschrein", g8: "Verhüllter Schrein", a1: "Kastanienwacht", b1: "Erntekapelle",
    c1: "Laubfeste", g5: "Morsches Tor", r1: "Nebelschlucht", a2: "Ockerklippe", b2: "Drosselwarte",
    c2: "Buchenhain", u2: "Verwehte Garbe", a3: "Wurzelpfad", b3: "Schwarzmoor", c3: "Herbstkrone",
    g1: "Kohlenfurt", u1: "Laubmulde", z1: "Blätterfähre", a4: "Zunderhort", b4: "Modernebel",
    c4: "Eidbollwerk", z2: "Ahornbrücke", u3: "Dornennest", o1: "Harzquelle", a5: "Rostschlucht",
    b5: "Stoppelacker", c5: "Grenzlaubwall", g4: "Ranstation", n16: "Waldkapitel", g7: "Verwehter Pass",
    n17: "Schwurhalle", d1: "Röstgrund", e1: "Vermoderte Ruine", g2: "Laubkluft", s2: "Ameisenturm",
    d2: "Wipfelhöhe", e2: "Herbststurmfeste", o3: "Aschlaubfeld", g6: "Rascherast", n20: "Königslaub",
    e3: "Zwielichtwarte", g9: "Treibholzbucht", w2: "Welkgarten", n21: "Fallwindpass", g3: "Laubgrotte",
    n22: "Doppelrittfeste",
  },
  // ── IV · Winter — the cold that keeps what the rift changes still ────────────
  4: {
    n01: "Frostwacht", o2: "Eisacker", n02: "Klammmühle", w1: "Jägerlager", w3: "Verschneiter Hain",
    s1: "Raureifwacht", n03: "Eisschrein", g8: "Vereister Schrein", a1: "Eiswacht", b1: "Schneekapelle",
    c1: "Eisfeste", g5: "Erfrorenes Tor", r1: "Kluftschlucht", a2: "Firnklippe", b2: "Polarwarte",
    c2: "Frostkrone", u2: "Verwehte Kuhle", a3: "Schneepfad", b3: "Klammmoor", c3: "Winterkrone",
    g1: "Glutfurt", u1: "Firnmulde", z1: "Eisfähre", a4: "Aschhort", b4: "Frostnebel",
    c4: "Frostbollwerk", z2: "Eisbrücke", u3: "Klammnest", o1: "Tauquelle", a5: "Eisschlund",
    b5: "Schneefeld", c5: "Grenzeiswall", g4: "Bergstation", n16: "Firnkapelle", g7: "Verschütteter Pass",
    n17: "Eishalle", d1: "Eisschmelzgrund", e1: "Eisige Ruine", g2: "Frostkluft", s2: "Frostturm",
    d2: "Gipfelhöhe", e2: "Schneesturmfeste", o3: "Schlackeneisfeld", g6: "Schlittenrast", n20: "Königsfirn",
    e3: "Nordlichtwarte", g9: "Eisbucht", w2: "Eisgarten", n21: "Schattenpass", g3: "Eisgrotte",
    n22: "Schattenfürstfeste",
  },
  // ── V · Hochgebirge — the high passes the court fled over, doors bolted ──────
  5: {
    n01: "Gratwacht", o2: "Geröllacker", n02: "Schluchtmühle", w1: "Steinbrecherlager", w3: "Stiller Steinhain",
    s1: "Firnwacht", n03: "Gipfelschrein", g8: "Steinschrein", a1: "Adlerwacht", b1: "Felskapelle",
    c1: "Steinfeste", g5: "Verriegeltes Tor", r1: "Steinschlund", a2: "Gratklippe", b2: "Sternwarte",
    c2: "Steinbockkrone", u2: "Verschüttete Mulde", a3: "Steinbockpfad", b3: "Nebelkar", c3: "Gipfelkrone",
    g1: "Lavafurt", u1: "Karmulde", z1: "Seilfähre", a4: "Aschgrat", b4: "Wolkennebel",
    c4: "Felsbollwerk", z2: "Hängebrücke", u3: "Steinnest", o1: "Bergquelle", a5: "Lawinenschlucht",
    b5: "Firnfeld", c5: "Grenzgratwall", g4: "Gipfelstation", n16: "Adlerkapelle", g7: "Verschütteter Steig",
    n17: "Schlüsselhalle", d1: "Erzgrund", e1: "Bröckelnde Ruine", g2: "Felskluft", s2: "Steinturm",
    d2: "Firnhöhe", e2: "Bergsturmfeste", o3: "Schlackengrat", g6: "Kammrast", n20: "Königsgrat",
    e3: "Sternenwarte", g9: "Gletscherbucht", w2: "Steingarten", n21: "Hüterpass", g3: "Felsgrotte",
    n22: "Hüterfeste",
  },
  // ── VI · Ödland — the first price the rift drank, the Bloodmaid's chalice ────
  6: {
    n01: "Aschwacht", o2: "Gebeinacker", n02: "Staubmühle", w1: "Plünderlager", w3: "Toter Hain",
    s1: "Dornwacht", n03: "Wundschrein", g8: "Knochenschrein", a1: "Rabenwacht", b1: "Blutkapelle",
    c1: "Dornfeste", g5: "Rostiges Tor", r1: "Ödschlund", a2: "Galgenklippe", b2: "Verfallwarte",
    c2: "Aschekrone", u2: "Ausgedörrte Mulde", a3: "Aschpfad", b3: "Sumpfmoor", c3: "Dornkrone",
    g1: "Kohlfurt", u1: "Rissmulde", z1: "Aschfähre", a4: "Glutkrater", b4: "Pestnebel",
    c4: "Dornbollwerk", z2: "Knochenbrücke", u3: "Skorpionhort II", o1: "Ödquelle", a5: "Aschschlucht",
    b5: "Dürrfeld", c5: "Grenzödwall", g4: "Ruinstation", n16: "Kelchkapelle", g7: "Verschütteter Ödpass",
    n17: "Aschhalle", d1: "Schlackengrund", e1: "Zerfallene Ruine", g2: "Ödkluft", s2: "Aschturm",
    d2: "Galgenhöhe", e2: "Aschsturmfeste", o3: "Schlackenöd", g6: "Geierrast", n20: "Königsöd",
    e3: "Aschwarte", g9: "Salzbucht", w2: "Aschgarten", n21: "Blutmagdpass", g3: "Aschgrotte",
    n22: "Kelchfeste",
  },
  // ── VII · Steppe — the wide plains where the Lancemaster still tilts ─────────
  7: {
    n01: "Graswacht", o2: "Weideacker", n02: "Windmühle", w1: "Nomadenlager", w3: "Stiller Grashain",
    s1: "Halmwacht", n03: "Hufschrein", g8: "Windschrein", a1: "Falkenwacht", b1: "Steppenkapelle",
    c1: "Turnierfeste", g5: "Fernes Tor", r1: "Grasschlund", a2: "Windklippe", b2: "Fernwarte",
    c2: "Grashain", u2: "Steppengrab", a3: "Hufpfad", b3: "Riedmoor", c3: "Steppenkrone",
    g1: "Lohfurt", u1: "Windmulde", z1: "Grasfähre", a4: "Aschsteppe", b4: "Grasnebel",
    c4: "Speerbollwerk", z2: "Grasbrücke", u3: "Otternnest", o1: "Steppenquelle", a5: "Lanzenschlund",
    b5: "Windfeld", c5: "Grenzgraswall", g4: "Reiterstation", n16: "Turnierkapelle", g7: "Verwehter Steppenpass",
    n17: "Lanzenhalle", d1: "Hufgrund", e1: "Verlassene Steppenruine", g2: "Graskluft", s2: "Nomadenturm",
    d2: "Steppenbanner", e2: "Steppensturmfeste", o3: "Aschgrasfeld", g6: "Nomadenrast", n20: "Königssteppe",
    e3: "Fernwarte II", g9: "Schilfbucht", w2: "Steppengarten", n21: "Turnierpass", g3: "Grasgrotte",
    n22: "Lanzenfeste",
  },
  // ── VIII · Roter Canyon — the wound itself, the steps every Gambit walks ─────
  8: {
    n01: "Rotwacht", o2: "Staubacker", n02: "Klammmühle II", w1: "Räuberlager", w3: "Stiller Felshain",
    s1: "Kupferwacht", n03: "Schluchtschrein", g8: "Felsschrein", a1: "Geierwacht", b1: "Rotkapelle",
    c1: "Kupferfeste", g5: "Berstendes Tor", r1: "Echoschlund", a2: "Glutklippe", b2: "Canyonwarte",
    c2: "Felshain", u2: "Ausgedörrte Kluft", a3: "Kupferpfad", b3: "Staubmoor", c3: "Rotkrone",
    g1: "Gluthfurt", u1: "Staubmulde", z1: "Felsfähre", a4: "Aschcanyon", b4: "Staubnebel",
    c4: "Faustbollwerk", z2: "Felsbrücke", u3: "Skorpionhort", o1: "Glutquelle", a5: "Rotschlucht",
    b5: "Kupferfeld", c5: "Grenzfelswall", g4: "Klippenstation", n16: "Wundkapelle", g7: "Berstpass",
    n17: "Fausthalle", d1: "Glutgrund", e1: "Verfallene Felsruine", g2: "Felskluft II", s2: "Felsturm",
    d2: "Kupferhöhe", e2: "Glutsturmfeste", o3: "Schlackenfelsfeld", g6: "Geierrast II", n20: "Königsklamm",
    e3: "Abgrundwarte", g9: "Felsbucht", w2: "Kupfergarten", n21: "Eisenfaustpass", g3: "Felsgrotte II",
    n22: "Eisenfaustfeste",
  },
  // ── IX · Wüste — the sands that swallow names; only the oasis remembers ──────
  9: {
    n01: "Sandwacht", o2: "Salzacker", n02: "Sandmühle", w1: "Karawanenlager", w3: "Stiller Palmhain",
    s1: "Dünenwacht", n03: "Oasenschrein", g8: "Sandschrein", a1: "Falkendüne", b1: "Wüstenkapelle",
    c1: "Sichelfeste", g5: "Sandtor", r1: "Dürreschlund", a2: "Dünenklippe", b2: "Sternwarte II",
    c2: "Palmhain", u2: "Sandgrab", a3: "Fährtenpfad", b3: "Salzmoor", c3: "Wüstenkrone",
    g1: "Glutdüne", u1: "Flüsterdüne", z1: "Sandfähre", a4: "Aschdüne", b4: "Sandnebel",
    c4: "Sichelbollwerk", z2: "Sandbrücke", u3: "Skorpionnest II", o1: "Sickerquelle", a5: "Dürreschlucht",
    b5: "Salzfeld", c5: "Grenzsandwall", g4: "Oasenstation", n16: "Oasenkapelle", g7: "Verwehter Wüstenpass",
    n17: "Kanonenhalle", d1: "Glutsandgrund", e1: "Versandete Ruine", g2: "Sandkluft", s2: "Sandturm",
    d2: "Dünenhöhe", e2: "Sandsturmfeste", o3: "Salzschlackenfeld", g6: "Oasenrast", n20: "Königsdüne",
    e3: "Fata-Morgana-Warte", g9: "Palmenbucht", w2: "Oasengarten", n21: "Kanonierpass", g3: "Sandgrotte",
    n22: "Kanonenfeste",
  },
  // ── X · Endloses Meer — where the rift bleeds out; Osric waits as Master ─────
  10: {
    n01: "Gischtwacht", o2: "Salzacker II", n02: "Tidemühle", w1: "Strandgutlager", w3: "Stille Bucht",
    s1: "Möwenwacht", n03: "Tiefenschrein", g8: "Wrackschrein", a1: "Klippenwacht", b1: "Leuchtturmkapelle",
    c1: "Tidefeste", g5: "Salztor", r1: "Brandungsschlund", a2: "Brandungsklippe", b2: "Leuchtwarte",
    c2: "Korallenhain", u2: "Versunkenes Grab", a3: "Ebbepfad", b3: "Salzmoor II", c3: "Perlenkrone",
    g1: "Glutriff", u1: "Sandbankdüne", z1: "Salzfähre II", a4: "Aschriff", b4: "Meernebel",
    c4: "Wellenbollwerk", z2: "Salzbrücke", u3: "Krakennest", o1: "Salzquelle", a5: "Tiefenschlucht",
    b5: "Tangfeld", c5: "Grenztidewall", g4: "Hafenstation", n16: "Tiefenkapelle", g7: "Versunkener Pass",
    n17: "Kapitänshalle", d1: "Salzgrund", e1: "Gesunkene Ruine", g2: "Riffkluft", s2: "Leuchtturm",
    d2: "Klippenhöhe", e2: "Orkanfeste", o3: "Wrackfeld", g6: "Anlanderast", n20: "Königsriff",
    e3: "Sturmwarte", g9: "Reederbucht", w2: "Tiefengarten", n21: "Osrics Riff", g3: "Meeresgrotte",
    n22: "Ligameisterfeste",
  },
};
