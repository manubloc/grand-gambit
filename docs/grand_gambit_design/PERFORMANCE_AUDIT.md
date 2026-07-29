# Performance-Notizen
- Precache: 30 → 33 Einträge; **2770 → 2533 KiB** (−237 KiB netto: +91 KiB Schriften/OFL, −~330 KiB IM-Fell-Fontsource raus + Bundle-Feinheiten). Offline-Budget verbessert.
- Bewegung: gleichzeitige Glanzläufe im Hub 3→1; Schatzkammer-Dauerglühen 14→0 (weniger permanente Compositing-Layer in Listen); alle Sheens linear (kein wahrgenommenes Stocken); prefers-reduced-motion stoppt Läufe vollständig.
- Keine neuen Abhängigkeiten, keine neuen BackdropFilter, keine Großflächen-Blurs. Brett-Renderpfad unangetastet (nur Blockmaß).
