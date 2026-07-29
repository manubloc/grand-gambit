# Typografie — drei Stimmen

Selbst gebündelt (OFL, `public/fonts/`, 91 KB gesamt, im PWA-Precache → offline verfügbar, `font-display: swap`):

| Rolle | Klasse/Token | Schrift | Verwendung | Nie für |
|---|---|---|---|---|
| Display | `.gg-display` / `T.display` | **Cinzel 600** | Wortmarke, Screen-/Kartentitel ≥18px | kleine Etiketten, Zahlen, Buttons |
| Serif | `.gg-serif` / `T.serif` | Georgia-Stapel | mittlere Titel, Eyebrows, Zierzeilen | Fließtext-Massen |
| Erzählstimme | `.gg-quill` / `T.quill` | **Cormorant Garamond 500 Italic** (600 upright verfügbar) | Figurennamen, Chronik, Zitate | funktionale Infos |
| Funktional | body-Default | System-Sans | Buttons, Zahlen, Labels, Listen | — |

Bewusste Abweichung vom Auftrag: die Inter-Rolle füllt der System-Sans-Stapel (visuell nahezu identisch, 0 KB, keine FOUT-Fläche); Cinzel und Cormorant sind die tatsächlich markenprägenden Stimmen und wurden echt geladen — `.gg-quill` war bisher eine Attrappe (IM Fell English ist auf keinem Gerät installiert, es rendered Georgia kursiv).
