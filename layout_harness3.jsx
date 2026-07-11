// Harness: SavesScreen mit Wappen bei 390px
import React from "react";
import { createRoot } from "react-dom/client";
import { SavesScreen } from "./src/app/ui/screens/SavesScreen.jsx";
import { GLOBAL_CSS, T } from "./src/app/ui/theme.js";

const style = document.createElement("style");
style.textContent = GLOBAL_CSS;
document.head.appendChild(style);
document.body.style.background = T.bg;
document.body.style.margin = "0";

// listSaves etc. laufen gegen Supabase — für den Screenshot mocken wir fetch weg
window.fetch = () => new Promise(() => {});
const saves = [
  { id: "a", name: "Feldzug des Nordens", pct: 62, league: 3, clearedCount: 21, total: 35, playtimeSec: 43000, updatedAt: Date.now() },
  { id: "b", name: "Zweiter Anlauf", pct: 14, league: 1, clearedCount: 5, total: 35, playtimeSec: 6100, updatedAt: Date.now() - 86400000 },
];
createRoot(document.getElementById("root")).render(
  <SavesScreen account={{ id: "x", name: "Gast", isAdmin: false }} lang="de" setLang={() => {}}
    onOpen={() => {}} onLogout={() => {}} __testSaves={saves} initialLang="de" />
);
