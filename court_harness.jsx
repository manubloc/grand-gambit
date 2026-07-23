import { useState } from "react";
import { createRoot } from "react-dom/client";
import { ArmyScreen } from "./src/app/ui/screens/ArmyScreen.jsx";
import { GLOBAL_CSS, T } from "./src/app/ui/theme.js";
import { defaultProfile, withProgressPct } from "./src/meta/index.js";
import { makeT } from "./src/app/i18n/strings.js";
const st = document.createElement("style"); st.textContent = GLOBAL_CSS; document.head.appendChild(st);
document.body.style.background = T.bg;
const profile = withProgressPct(defaultProfile(), 100, 5);
function Harness() {
  const [tab, setTab] = useState("chars");
  return <div>
    <div style={{ position: "fixed", top: 0, right: 0, zIndex: 99 }}>
      {["tree", "chars", "formation", "gear"].map((x) =>
        <button key={x} id={"tab-" + x} onClick={() => setTab(x)}>{x}</button>)}
    </div>
    <ArmyScreen key={tab} profile={profile} dispatch={() => {}} t={makeT("de")} initialTab={tab} />
  </div>;
}
createRoot(document.getElementById("root")).render(<Harness />);
