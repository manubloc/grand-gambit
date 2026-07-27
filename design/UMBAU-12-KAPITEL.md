# UMBAU AUF ZWÖLF KAPITEL — Stand und Restweg

**Was liegt (v0.34.0):** Der vom Besitzer gepflegte Stationsstand ist die neue
Quelle der Wahrheit: `tools/stationen.json`. Daraus erzeugt
`node tools/build-campaign12.mjs` zwei Dateien:

- `src/content/campaign12.gen.js` — **529 Stationen in zwölf Liga-Graphen**,
  im Format der bestehenden CAMPAIGN (id `L07s12`, league, place, story, next,
  boss, tier, reward). Geprüft: je Liga genau ein Startknoten, alles vom Start
  erreichbar, alle 20 Schlüsselfiguren vergeben (15 Hauptast, 5 Nebenast:
  bard II, pathfinder IV, captain VI, amazon VIII, strategist X),
  24 Zwischen-Monster, Liga-Endboss auf der letzten Hauptast-Station,
  XII endet in der „Blitzfeste des Grossmeisters" mit b23.
- `src/app/ui/mapBitmaps12.gen.js` — Stationspositionen aller zwölf Karten auf
  der 1796er Leinwand, Karten liegen unter `src/app/ui/assets/kap/kap-01..12.webp`
  (zusammen 4,6 MB, q82).

**Entwurfsregeln, wie vom Besitzer vorgegeben:** Hauptast trägt Story und
Schlüsselfiguren; Nebenäste sind Belohnungswege (Astlänge 1 = Trank-Niveau,
2–3 = mittleres Gold, ≥4 = großes Gold oder Figur); kürzere Hauptäste sind
schwerer (`schwer = (30−H)/8` auf bump/tier); vorerst keine Minispiele.
Drei lose Sattelweite-Punkte wurden an den nächsten vernetzten Nachbarn
angeschlossen. `leer`-Stationen tragen ein `leer: true`-Flag (kleine Punkte
ohne Partie — Darstellung im Schirm noch offen).

**Noch NICHT verdrahtet — der Restweg in Reihenfolge:**

1. `src/content/campaign.js`: CAMPAIGN durch `CAMPAIGN12` ersetzen (Import aus
   campaign12.gen.js), alte 51 Knoten entfallen. `chapterTitle` auf %12,
   CHAPTER_TITLES auf 12 Zeilen **mit Drehung**: neu VII = alte VIII-Titel
   (Reiter), neu VIII = alte IX-Titel (Schlucht), neu IX = alte VII-Titel
   (Asche), XII = alte XI-Titel (Meer), **XI braucht vier neue Küsten-Titel**.
2. Modulo-Runde %11 → %12: `meta/campaign.js:36`, `meta/saves.js:42`,
   `MysticBackground.jsx:25` (+ 12. Tint), `GameScreen.jsx:40,60`
   (+ LEAGUE_BOARD 12), `CampaignScreen.jsx:81,264` (+ LABEL_TINT 12),
   `mapArt.jsx:436`.
3. `mapArt.jsx` LEAGUE_THEMES: 12 Einträge. VII=Sattelweite (Steppe-Werte),
   VIII=Aschgrund (Canyon-Werte), IX=Die Wunde (Ödland-Werte), XI=„Die Küste"
   (neu, Küstenfarben ~#8a7f66/#2e6a8a-Mix), XII=„Endloses Meer" (alte
   Meer-Werte). `bitmap:` je Liga auf `kap1..kap12` stellen und im
   CampaignScreen MAP_BITMAPS12 statt MAP_BITMAPS laden.
4. `bosses.js`: LEAGUE_BOSSES um "b23" ergänzen, leagueBossId %12.
5. `worldMap.js`: Namen VII↔VIII tauschen, XI „Die Küste" (neue Lore nötig),
   XII „Endloses Meer" (alte XI-Lore passt). Zwölften Anker erfinden
   (oben rechts, Meer) — Besitzer liefert später eine echte Weltkarte.
6. `placeNames.js`: Blöcke 7↔8 tauschen (Reiter-Orte zur Sattelweite),
   Block „12" ist unnötig — Liga XII nutzt NAMEN_XII im Generator.
7. Brettböden: GROUNDS auf %12, Böden 11+12 bauen (Vorschlag: beruhigte
   Ausschnitte aus kap-11/kap-12 über `calm-grounds`-Verfahren).
8. `CampaignScreen.jsx:492`: n22-Sonderfall ist mit CAMPAIGN12 toter Code —
   entfernen. Tests: test_features/test_boss erwarten die alte CAMPAIGN-Länge
   und feste Knoten-IDs (n01…) — auf CAMPAIGN12 umstellen (Startknoten je
   Liga = Knoten ohne Vorgänger).

**Warnungen:** kein Livebetrieb, keine Migration nötig — cleared-IDs ändern
sich komplett. Die Kette (739/17 + Boot + drive3 + Reinraum) muss nach der
Verdrahtung zwingend grün sein; die Testsummen werden sich durch neue
Kampagnenlänge ändern und sind bewusst anzupassen, nicht zu übergehen.

---

## STAND NACH DER VERDRAHTUNGSSITZUNG (Zweig wip/kapitel-12)

Verdrahtet und gebaut (Build gruen, smoke/ui/core/engine/campaign_smoke gruen):
CAMPAIGN = CAMPAIGN12 (529), alle %11->%12, LEAGUE_THEMES 12 (Werte zu ihren
Bildern gedreht!), Farbtabellen LABEL_TINT/LEAGUE_BOARD/LEAGUE_TINTS 12,
CampaignScreen laedt MAP_BITMAPS12, LEAGUE_BOSSES+b23, n22 restlos ersetzt
durch das neue final-Flag am Kapitel-Endboss (finished/advanceLeague/XP/Buehne),
worldMap 12 Anker + Lore gedreht + neue Kuestenlore (11), placeNames 7/8/9
gedreht, Boot auf Kapitel XII umgetextet (Kapitaen sitzt auf Seitenpfad VI),
GROUNDS 12 mit gedrehten Boeden + neue ground-11/12 aus Kartenausschnitten,
Generator schreibt jetzt auch chapter (Phase 1-4), haupt und final.

Tests: mechanische Alt-IDs sind gemappt (n01->L01s00, n02->L01s01, n03->L01s03,
a1->L01s02, n22->L01s44, a2->L06s12 assassin, a4->L07s41 dragon,
Elite-Timer->L03s23 bump2, Rotation->L05s16). VERBLEIBENDE ROTE (inhaltlich an
die neue Welt anzupassen, Behauptung jeweils neu formulieren, nicht loeschen):
- test_features: Fork nach dem Erwachen (neuer Graph verzweigt anders),
  Doppelrekrutierung, Achievement-Zaehler, FRIENDLY-Tisch, Viertel-XP
- test_maps: Namensabdeckung/Nichtwiederholung (Namen zyklisch mit II/III-Suffix
  ist ERLAUBT -> Behauptung lockern), Liga-I-Heimatnamen (NAMEN_I im Generator)
- test_boss: Zaehlungen 41/34 -> neu zaehlen (44 Boss-Stationen: 20 Figuren +
  24 Monster... nachzaehlen!), Hoard-Test auf neue Drachenstation L07s41
- test_balance: Drachenhoehle spielt in Kapitel VII -> Profil mit league 7
- test_story: L01s06 "Drachenhort"/L07s43 "Spaeherzinne" nennen Figuren ohne
  Boss -> ENTWEDER Namenspool bereinigen ODER Behauptung auf Hauptfiguren
  begrenzen; "spine climbs" auf neue Struktur
- test_saves: journey order nutzt die alte Knotenfolge -> auf Hauptast+Aeste
  des jeweiligen Kapitels umstellen (11 Fails, groesster Brocken)
- test_progression: Mist-Ferry-Maut (Gate-Knoten existiert nicht mehr ->
  Maut-Test auf einen echten gold-Gate-Knoten stellen oder Gates im Generator
  ergaenzen: BEWUSSTE ENTSCHEIDUNG NOETIG, der neue Graph hat noch KEINE Gates)
Danach: volle Kette + Reinraum + Merge auf main + Anspielen der Kapitelkarte.
