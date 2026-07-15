import "@fontsource/im-fell-english/400.css";
import "@fontsource/im-fell-english/400-italic.css";
import { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { GLOBAL_CSS } from "./ui/theme.js";
import { registerSW } from "virtual:pwa-register";

// ── stay fresh without manual cache-clearing: check for a new build when the
// app opens, whenever the tab regains focus, and every 60s. registerType
// "autoUpdate" then swaps the service worker in and reloads the page ONCE —
// a fresh deploy reaches every phone the next time the game is looked at. ──
// no image context menu (right-click / long-press "save image") — the
// gallery stays in the hall. Inputs and text keep their normal menus.
document.addEventListener("contextmenu", (e) => {
  const t = e.target;
  if (t && (t.tagName === "IMG" || t.tagName === "CANVAS" || t.closest?.("svg"))) e.preventDefault();
});

registerSW({
  immediate: true,
  onRegisteredSW(_url, r) {
    if (!r) return;
    const check = () => r.update().catch(() => {});
    setInterval(check, 60_000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) check(); });
  },
});

const style = document.createElement("style");
style.textContent = GLOBAL_CSS;
document.head.appendChild(style);

// Last line of defense: a runtime crash shows a readable card instead of a
// silent white screen (the #gg-boot note only covers the very first load).
class Boundary extends Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0c111e",
        color: "#e8e4d8", fontFamily: "Georgia, serif", padding: 24, textAlign: "center" }}>
        <div style={{ maxWidth: 380 }}>
          <div style={{ fontSize: 20, letterSpacing: 3, color: "#c9a45c" }}>GRAND GAMBIT</div>
          <div style={{ fontSize: 13.5, color: "#8b90a3", margin: "10px 0 16px", lineHeight: 1.5 }}>
            Da ist etwas schiefgelaufen. Dein Spielstand ist sicher — einmal neu laden hilft meistens.</div>
          <button onClick={() => location.reload()} style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 14,
            padding: "10px 22px", borderRadius: 10, border: "1px solid #c9a45c", background: "#c9a45c",
            color: "#17110a", cursor: "pointer" }}>Neu laden</button>
          <div style={{ fontSize: 10.5, color: "#5b617a", marginTop: 14, wordBreak: "break-all" }}>
            {String(this.state.err?.message || this.state.err)}</div>
        </div>
      </div>
    );
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode><Boundary>
    <App />
  </Boundary></StrictMode>
);
