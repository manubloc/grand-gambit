// Wie board_harness.jsx, nur mit UMSCHALTBAREM Figurenstil: ?stil=painted |
// carved | classic. So laesst sich derselbe Bildschirm einmal mit dem
// klassischen und einmal mit dem gemalten Satz messen - ohne Anmeldung,
// ohne Kampagne, ohne Zufall.
import { createRoot } from "react-dom/client";
import { GameScreen } from "./src/app/ui/screens/GameScreen.jsx";
import { GLOBAL_CSS, T } from "./src/app/ui/theme.js";
import { defaultProfile, withProgressPct } from "./src/meta/index.js";
import { makeT } from "./src/app/i18n/strings.js";

const style = document.createElement("style");
style.textContent = GLOBAL_CSS;
document.head.appendChild(style);
document.body.style.background = T.bg;

const stil = new URLSearchParams(location.search).get("stil") || "painted";
const profile = { ...withProgressPct(defaultProfile(), 60, 3), pieceStyle: stil };
createRoot(document.getElementById("root")).render(
  <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column" }}>
    <GameScreen profile={profile} dispatch={() => {}} t={makeT("de")} />
  </div>
);
