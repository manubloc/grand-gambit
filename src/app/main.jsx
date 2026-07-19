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

// belt and braces for INSTALLED apps: the moment a new service worker takes
// control, reload exactly once — even if the plugin's own hook were missed
if ("serviceWorker" in navigator) {
  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloaded) return; reloaded = true; window.location.reload();
  });
}
registerSW({
  immediate: true,
  onRegisteredSW(_url, r) {
    if (!r) return;
    const check = () => r.update().catch(() => {});
    check();                                   // once right away
    setInterval(check, 60_000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) check(); });
    // installed PWAs often resume from the back-forward cache — visibility
    // events can be swallowed there, pageshow is the reliable hook
    window.addEventListener("pageshow", (e) => { if (e.persisted) check(); });
    window.addEventListener("focus", check);
  },
});

const style = document.createElement("style");
style.textContent = GLOBAL_CSS + `
  /* every image ARRIVES: pictures that still have to travel fade in with a
     soft rise; cached ones appear instantly (no flicker mid-battle) */
  img[data-gg-loading] { opacity: 0; }
  img[data-gg-loaded] { animation: ggImgIn .45s ease both; }
  @keyframes ggImgIn { from { opacity: 0; transform: scale(.985); } to { opacity: 1; transform: none; } }
`;
document.head.appendChild(style);

// tag every <img> the moment it enters the DOM: still loading → hidden until
// its load/error fires (then the little arrival animation plays)
const ggMarkImg = (img) => {
  if (img.dataset.ggLoaded != null || img.dataset.ggLoading != null) return;
  if (img.complete && img.naturalWidth > 0) return; // cached: show instantly, no dance
  img.dataset.ggLoading = "";
  const done = () => { delete img.dataset.ggLoading; img.dataset.ggLoaded = ""; };
  img.addEventListener("load", done, { once: true });
  img.addEventListener("error", done, { once: true }); // broken images must never stay invisible
};
new MutationObserver((muts) => {
  for (const m of muts) for (const n of m.addedNodes) {
    if (n.nodeType !== 1) continue;
    if (n.tagName === "IMG") ggMarkImg(n);
    else if (n.querySelectorAll) for (const im of n.querySelectorAll("img")) ggMarkImg(im);
  }
}).observe(document.documentElement, { childList: true, subtree: true });

// THE BLACK BOX: every runtime error lands in a small ring buffer so a crash
// report can tell the tale — version, screen, and the last errors seen.
const ERRLOG = "gg_errlog";
const logErr = (kind, msg, stack) => {
  try {
    const list = JSON.parse(localStorage.getItem(ERRLOG) || "[]");
    list.push({ t: new Date().toISOString(), kind, msg: String(msg).slice(0, 300), stack: String(stack || "").slice(0, 500) });
    localStorage.setItem(ERRLOG, JSON.stringify(list.slice(-15)));
  } catch {}
};
window.addEventListener("error", (e) => logErr("error", e.message || e.error, e.error?.stack));
window.addEventListener("unhandledrejection", (e) => logErr("promise", e.reason?.message || e.reason, e.reason?.stack));
const ggReport = (err) => {
  let log = [];
  try { log = JSON.parse(localStorage.getItem(ERRLOG) || "[]"); } catch {}
  return [
    `Grand Gambit Fehlerbericht`,
    `Version: ${typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "?"}`,
    `Zeit: ${new Date().toISOString()}`,
    `Browser: ${navigator.userAgent}`,
    `URL: ${location.href}`,
    err ? `\nAbsturz: ${String(err?.message || err)}\n${String(err?.stack || "").slice(0, 600)}` : "",
    log.length ? `\nLetzte Fehler:\n` + log.map((l) => `[${l.t}] ${l.kind}: ${l.msg}`).join("\n") : "",
  ].filter(Boolean).join("\n");
};
const SUPPORT_MAIL = "support@grandgambit.win";

// Last line of defense: a runtime crash shows a readable card instead of a
// silent white screen (the #gg-boot note only covers the very first load).
class Boundary extends Component {
  constructor(p) { super(p); this.state = { err: null, copied: false }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err) { logErr("crash", err?.message || err, err?.stack); }
  render() {
    if (!this.state.err) return this.props.children;
    const report = ggReport(this.state.err);
    const mail = `mailto:${SUPPORT_MAIL}?subject=${encodeURIComponent("Grand Gambit Fehlerbericht")}&body=${encodeURIComponent(report)}`;
    const ghost = { fontFamily: "inherit", fontWeight: 700, fontSize: 13, padding: "9px 16px", borderRadius: 10,
      border: "1px solid #3a4258", background: "transparent", color: "#aab2c8", cursor: "pointer" };
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0c111e",
        color: "#e8e4d8", fontFamily: "Georgia, serif", padding: 24, textAlign: "center" }}>
        <div style={{ maxWidth: 380 }}>
          <div style={{ fontSize: 20, letterSpacing: 3, color: "#c9a45c" }}>GRAND GAMBIT</div>
          <div style={{ fontSize: 13.5, color: "#8b90a3", margin: "10px 0 16px", lineHeight: 1.5 }}>
            Da ist etwas schiefgelaufen. Dein Spielstand ist sicher — einmal neu laden hilft meistens.
            Mit einem Fehlerbericht an den Support hilfst du, die Ursache zu finden.</div>
          <button onClick={() => location.reload()} style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 14,
            padding: "10px 22px", borderRadius: 10, border: "1px solid #c9a45c", background: "#c9a45c",
            color: "#17110a", cursor: "pointer" }}>Neu laden</button>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
            <a href={mail} style={{ ...ghost, textDecoration: "none", display: "inline-block" }}>Bericht an Support senden</a>
            <button style={ghost} onClick={() => { try { navigator.clipboard.writeText(report); this.setState({ copied: true }); } catch {} }}>
              {this.state.copied ? "Kopiert ✓" : "Bericht kopieren"}</button>
          </div>
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
