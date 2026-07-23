// Board harness — mounts the live match screen alone, so a headless browser can
// measure where the board actually LANDS on a phone. (Its sibling
// layout_harness.jsx does the same for the court screen's width.)
import { createRoot } from "react-dom/client";
import { GameScreen } from "./src/app/ui/screens/GameScreen.jsx";
import { GLOBAL_CSS, T } from "./src/app/ui/theme.js";
import { defaultProfile, withProgressPct } from "./src/meta/index.js";
import { makeT } from "./src/app/i18n/strings.js";

const style = document.createElement("style");
style.textContent = GLOBAL_CSS;
document.head.appendChild(style);
document.body.style.background = T.bg;

const profile = { ...withProgressPct(defaultProfile(), 60, 3), pieceStyle: "painted" };
createRoot(document.getElementById("root")).render(
  <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column" }}>
    <GameScreen profile={profile} dispatch={() => {}} t={makeT("de")} />
  </div>
);
