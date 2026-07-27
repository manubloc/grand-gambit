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
