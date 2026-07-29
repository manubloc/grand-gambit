# Rollback
- Ursprünglicher Branch/Commit: `main` @ `1aaa021` (v0.41.2) — **unangetastet, weiterhin = Produktion.**
- Backup: Branch `backup/pre-design-system-v1-20260729-0724` (= 1aaa021).
- Feature-Branch: `feature/design-system-v1`. Checkpoints: 981356c (Sicherung+Audit) · eef2371 (Foundation) · 761f487 (Komponenten+Galerie) · +Screens/Abschluss (siehe git log).
- **Vollständig zurückrollen:** nichts tun — main wurde nie berührt, nichts wurde deployt. Branch verwerfen: `git branch -D feature/design-system-v1` (lokal) bzw. Branch im Remote löschen.
- **Einzelne Phase zurückrollen:** `git revert <checkpoint>` auf dem Feature-Branch; die Checkpoints sind atomar und bauen einzeln.
- **Übernehmen:** `git checkout main && git merge --no-ff feature/design-system-v1 && npm version 0.42.0` → Prüfkette (Soll neu: 791/19) → push main (erst DANN deployt Cloudflare).
- Neue Dateien: public/fonts/* (3 woff2 + 2 OFL), GalerieScreen.jsx, test_kontrast.mjs, tools/{foto-tour,messe-lage,mach-messprofil}.mjs, docs/grand_gambit_design/*. Ersetzt/entfernt: IM-Fell-Importe in main.jsx (Paket bleibt installiert, Lockfile unberührt). Kein Asset überschrieben.
