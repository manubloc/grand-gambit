# WELTKARTE v12 — Querformat 16:9, ein einziger Weg

**Was sich gegenüber der alten Karte ändert:** Die bisherige Weltkarte ist
hochkant (836×1881) und liest sich von unten nach oben. Die neue liegt quer im
Verhältnis **16:9** und liest sich **von links unten nach rechts oben** — vom
Kronland in der linken unteren Ecke bis zum Endlosen Meer rechts oben. Der
Rissglanz (Violett) ist die neue Leitfarbe und ersetzt die alte kühle Palette.

**Zielmaß:** 3840 × 2160 (16:9). Falls das Werkzeug das nicht anbietet:
2560 × 1440 oder 1920 × 1080 — Hauptsache exakt 16:9.

**Der wichtigste Punkt:** Es gibt **GENAU EINEN Weg**. Keine Abzweigungen,
keine Nebenpfade, keine zweite Route, keine gestrichelten Alternativen. Ein
durchgehender Pfad, der alle zwölf Länder in dieser Reihenfolge berührt.
Und **keine Stationspunkte, keine Marker, keine Beschriftung, keine Zahlen** —
die setzt das Spiel später selbst.

---

## Der Prompt (englisch, zum Kopieren)

```
A single wide 16:9 fantasy world map painting, hand-painted in the style of an
old illuminated atlas on aged parchment, seen from a high three-quarter bird's
eye view. ONE continuous journey road crosses the entire map from the LOWER
LEFT corner to the UPPER RIGHT corner, passing through twelve distinct lands in
this exact order. The road is a single unbroken pale track — NO branches, NO
side paths, NO forks, NO alternative routes, NO dotted lines, and absolutely NO
markers, dots, pins, labels, numbers or text anywhere on the map.

The twelve lands, in order along the road from lower left to upper right:

1. CROWNLAND — lower left corner: soft spring meadows in fresh green, blossoming
   orchards, a small walled royal town with pale towers, a gentle river.
2. GRAINMARCH — golden summer cornfields in warm ochre and wheat yellow, hedgerows,
   a few standing stones and a ruined barn among the crops.
3. OAKWOOD — deep autumn forest in amber, burnt orange and rust brown, ancient oaks,
   a leaf-strewn clearing, mist drifting between trunks.
4. CROOKWOOD — the treeline: wind-bent alpine scrub in olive and sage, scattered
   grey boulders, low twisted pines, thinning forest.
5. GREYWATCH — winter country: snowfields in cold blue-white, black pines under snow,
   a frozen river, a lonely grey watchtower.
6. CLOUDYOKE — high mountains: sheer grey stone ridges, snow caps, glaciers, deep
   cloud filling the valleys, no settlements.
7. SADDLEWIDE — dry open steppe in dusty gold and pale brown, tall grass, scattered
   rocks, wide empty horizon, a few round tents.
8. ASHGROUND — burnt volcanic land in rust red and scorched orange, black lava rock,
   dead trees, thin smoke, iron ruins.
9. THE WOUND — a vast cracked grey wasteland, bone-dry earth split by deep fissures
   that GLOW WITH VIOLET RIFT LIGHT from below, dead stone, no life.
10. SUNMAW — golden desert: rolling dunes in warm amber, cliff dwellings carved into
    a rock face, adobe towers, heat haze.
11. THE COAST — green-blue coastline: sea cliffs, surf, a lighthouse on a rocky point,
    fishing boats, salt grass.
12. ENDLESS SEA — upper right corner: open deep blue-teal ocean, rolling waves, a few
    small scattered islands, and far out where the road ends, a dark fortress island
    wreathed in VIOLET RIFT LIGHT — the journey's end.

Threading through the whole map, following the road, run fine VIOLET RIFT CRACKS
in the earth, glowing purple, faint at the lower left and growing wider and
brighter towards the upper right until they dominate The Wound and the final
fortress. Violet is the accent colour of the entire painting.

Style: painterly hand-drawn cartography, visible brushwork, warm aged parchment
tone, soft ink outlines, muted natural colours with glowing violet accents,
subtle parchment grain and gentle vignette at the edges. Cohesive lighting
across the whole map. Dark fantasy atlas, atmospheric, detailed.

NEGATIVE / avoid: text, letters, words, labels, place names, numbers, legends,
compass rose, grid lines, borders, station dots, map pins, icons, markers,
multiple paths, branching roads, forks, crossroads, people, close-up characters,
modern elements, frames.
```

---

## Warum die Reihenfolge so liegt

Die alte Karte hat ihre zwölf Anker auf einer Senkrechten (x schwankt nur
zwischen 45 und 55 Prozent, y läuft von 93 auf 2). Im Querformat wird daraus
eine Diagonale: x läuft von etwa 10 auf 95 Prozent, y von etwa 60 auf 12. Der
Weg soll also **nicht** schnurgerade sein, sondern in weichen Schlaufen steigen
— aber immer als **eine** Linie.

Ungefähre Zielpositionen der zwölf Länder auf der neuen Karte (Prozent der
Bildbreite/-höhe, links oben ist 0/0). Sie sind **Orientierung für die
Bildkomposition**, nicht einzuzeichnen:

| # | Land | x | y |
|---|------|---|---|
| 1 | Kronland | 8 % | 82 % |
| 2 | Kornmark | 17 % | 76 % |
| 3 | Eichwald | 26 % | 71 % |
| 4 | Krummholz | 34 % | 64 % |
| 5 | Grauwacht | 42 % | 60 % |
| 6 | Wolkenjoch | 50 % | 52 % |
| 7 | Sattelweite | 58 % | 47 % |
| 8 | Aschgrund | 66 % | 41 % |
| 9 | Die Wunde | 74 % | 35 % |
| 10 | Sonnenschlund | 82 % | 28 % |
| 11 | Die Küste | 90 % | 20 % |
| 12 | Endloses Meer | 96 % | 12 % |

## Nach der Erzeugung

1. Bild als `src/app/ui/assets/weltkarte.webp` ablegen.
2. In `src/app/ui/worldMap.js` `WORLD_MAP.w/h` auf die neuen Maße setzen.
3. Die zwölf `anchors` auf die Werte der Tabelle oben ändern (als `[x, y]` in
   Prozent) — danach am Gerät nachjustieren, bis jeder Anker auf seinem Land
   sitzt.
4. `node messe_karten.mjs` muss `== KARTEN SAUBER ==` melden.
