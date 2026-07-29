// ── /tmp/messprof.json HERSTELLEN ───────────────────────────────────────────
// tools/messe-knoepfe.mjs braucht ein Messprofil unter /tmp/messprof.json.
// Das lag bisher nur im Sandkasten der jeweiligen Sitzung herum und war in
// einem frischen Klon weg - das Werkzeug starb mit ENOENT, bevor es messen
// konnte. Hier wird es deterministisch aus den Spielvorgaben gebaut.
import { defaultProfile } from "../src/meta/profile.js";
import { CAMPAIGN } from "../src/content/index.js";
import { writeFileSync } from "node:fs";

const p = defaultProfile();
p.campaign = p.campaign || {};
p.campaign.league = 3;
p.campaign.cleared = CAMPAIGN.filter((n) => (n.league || 1) < 3).map((n) => n.id).slice(0, 40);
p.gold = 1200; p.sp = 20;
writeFileSync("/tmp/messprof.json", JSON.stringify(p));

// messe_karten.mjs will das JUNGFRAEULICHE Profil (Kapitel 1, nichts geraeumt)
const frisch = defaultProfile();
writeFileSync("/tmp/defprof.json", JSON.stringify(frisch));
console.log("messprof (Kapitel 3, " + p.campaign.cleared.length + " Stationen) und defprof (frisch) geschrieben");
