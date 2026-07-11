// "Install the app" — offered exactly where it makes sense and nowhere else:
// only when running as a plain website. Once installed (standalone display
// mode) or inside any packaged shell, the banner never appears — so a future
// store release needs no code change here. Chrome/Edge/Android get the real
// one-tap prompt (beforeinstallprompt); iOS Safari has no such API, so it gets
// a one-line share-sheet hint instead. Dismissal is remembered on the device.
import { useEffect, useState } from "react";
import { T } from "./theme.js";

const DISMISS_KEY = "gg-install-dismissed";

// Chrome fires beforeinstallprompt very early — often before React has even
// mounted. So the event is captured here at module scope, the moment the
// bundle evaluates, and handed to whoever asks later.
let deferredEvt = null;
const subs = new Set();
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredEvt = e;
    subs.forEach((f) => f(e));
  });
}
export const getDeferredInstall = () => deferredEvt;
export const onInstallReady = (f) => { subs.add(f); return () => subs.delete(f); };
export async function promptInstall() {
  if (!deferredEvt) return false;
  deferredEvt.prompt();
  try { await deferredEvt.userChoice; } catch { /* dismissed */ }
  deferredEvt = null;
  return true;
}

const isStandalone = () =>
  (typeof matchMedia !== "undefined" && matchMedia("(display-mode: standalone)").matches) ||
  (typeof navigator !== "undefined" && navigator.standalone === true);

const isIOS = () => typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);

export function InstallBanner({ en = false }) {
  const [prompt, setPrompt] = useState(() => deferredEvt);   // may already be captured
  const [ios, setIos] = useState(false);
  const [gone, setGone] = useState(() => {
    try { return localStorage.getItem(DISMISS_KEY) === "1"; } catch { return false; }
  });

  useEffect(() => {
    if (gone || isStandalone()) return;
    const off = onInstallReady((e) => setPrompt(e));
    // iOS never fires the event — offer the hint after a moment instead
    let tid = null;
    if (isIOS()) tid = setTimeout(() => setIos(true), 1200);
    const onInstalled = () => dismiss();
    window.addEventListener("appinstalled", onInstalled);
    return () => { off(); window.removeEventListener("appinstalled", onInstalled); if (tid) clearTimeout(tid); };
  }, []); // eslint-disable-line

  function dismiss() {
    setPrompt(null); setIos(false); setGone(true);
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch { /* private mode */ }
  }
  async function install() { await promptInstall(); dismiss(); }

  if (gone || (!prompt && !ios) || isStandalone()) return null;
  return (
    <div style={{ position: "fixed", left: "50%", transform: "translateX(-50%)",
      bottom: "calc(72px + env(safe-area-inset-bottom))", zIndex: 40, width: "min(94vw, 420px)",
      background: "linear-gradient(172deg, #141926, #0e1320)", border: `1px solid ${T.gold}55`,
      borderRadius: 14, padding: "12px 14px", boxShadow: "0 10px 30px rgba(0,0,0,.55)",
      display: "flex", alignItems: "center", gap: 12, animation: "rise .25s ease" }}>
      {/* a tiny drawn "home screen" glyph — no emoji */}
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" style={{ flex: "0 0 auto" }}>
        <rect x="4" y="2.5" width="16" height="19" rx="3.4" fill="none" stroke={T.gold} strokeWidth="1.7" />
        <path d="M12 8 L12 14.6 M12 14.6 L9.6 12.2 M12 14.6 L14.4 12.2" fill="none" stroke={T.gold}
          strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12 11.3)" />
        <path d="M9.5 18.6 L14.5 18.6" stroke={T.gold} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="gg-serif" style={{ color: T.goldBright, fontSize: 14.5, letterSpacing: ".04em" }}>
          {en ? "Install Grand Gambit" : "Grand Gambit installieren"}
        </div>
        <div style={{ color: T.dim, fontSize: 11.5, lineHeight: 1.4, marginTop: 2 }}>
          {prompt
            ? (en ? "As an app on your home screen — fullscreen, offline, no browser bar."
                  : "Als App auf dem Startbildschirm — Vollbild, offline, ohne Browserleiste.")
            : (en ? "In Safari's share menu choose \u201cAdd to Home Screen\u201d — it then runs as an app."
                  : "Im Safari-Teilen-Men\u00fc \u201eZum Home-Bildschirm\u201c w\u00e4hlen \u2014 dann l\u00e4uft es als App.")}
        </div>
      </div>
      {prompt && (
        <button onClick={install} style={{ flex: "0 0 auto", border: "1px solid rgba(255,240,200,.5)",
          background: "linear-gradient(165deg, #e0b76c, #b78d43)", color: "#17110a", fontWeight: 800,
          fontSize: 13, fontFamily: "inherit", borderRadius: 10, padding: "9px 13px", cursor: "pointer" }}>
          {en ? "Install" : "Installieren"}
        </button>
      )}
      <button onClick={dismiss} aria-label="Schließen" style={{ flex: "0 0 auto", width: 28, height: 28,
        borderRadius: 8, border: `1px solid ${T.line}`, background: "none", color: T.faint,
        fontSize: 15, cursor: "pointer", lineHeight: 1, fontFamily: "inherit" }}>×</button>
    </div>
  );
}
