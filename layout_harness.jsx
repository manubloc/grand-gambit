// Layout harness — renders ArmyScreen standalone at phone width so a headless
// browser can hunt down whatever forces horizontal scrolling.
import React from "react";
import { createRoot } from "react-dom/client";
import { ArmyScreen } from "./src/app/ui/screens/ArmyScreen.jsx";
import { GLOBAL_CSS, T } from "./src/app/ui/theme.js";
import { defaultProfile } from "./src/meta/index.js";
import { makeT } from "./src/app/i18n/strings.js";
import { CHARACTERS } from "./src/content/index.js";

const t = makeT("de");

const profile = defaultProfile();
// unlock everything so the fullest (widest) UI renders
profile.campaign = { ...(profile.campaign || {}), league: 3, cleared: ["n01", "n02", "n03"],
  unlocked: Object.keys(CHARACTERS) };
profile.gold = 500;
profile.xpEarned = 900;
profile.items = { potion: 2, hourglass: 1, machete: 1 };

const style = document.createElement("style");
style.textContent = GLOBAL_CSS;
document.head.appendChild(style);
document.body.style.background = T.bg;
document.body.style.margin = "0";
const rootEl = document.getElementById("root");
rootEl.style.padding = "14px";

createRoot(rootEl).render(
  <ArmyScreen profile={profile} dispatch={() => {}} t={t} />
);
