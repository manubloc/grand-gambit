import { useEffect, useReducer, useRef, useState } from "react";
import { loadProfile, saveProfile, defaultProfile, buildStageMatch, advanceCampaign, upgradePiece, clearedCount, campaignLength, currentNodeId , unlockAbility, respecPiece, claimAchievement, takeRestorePoint, serializeSave } from "../meta/index.js";
import { nodeById, chapterForRow, buyItem } from "../content/index.js";
import { verifyPin } from "../platform/index.js";
import { makeT } from "./i18n/strings.js";
import { playerXpProgress } from "../meta/index.js";
import { T } from "./ui/theme.js";
import { Splash, Wordmark } from "./ui/Brand.jsx";
import { OnlineScreen } from "./ui/screens/OnlineScreen.jsx";
import { createNet } from "../platform/net.web.js";
import { NavIcon } from "./ui/icons.jsx";
import { Bar, Panel, Button, Chip } from "./ui/primitives.jsx";
import { GameScreen, QuickSetup } from "./ui/screens/GameScreen.jsx";
import { ArmyScreen } from "./ui/screens/ArmyScreen.jsx";
import { CampaignScreen } from "./ui/screens/CampaignScreen.jsx";
import { AchievementsScreen } from "./ui/screens/AchievementsScreen.jsx";
import { ProfileScreen } from "./ui/screens/ProfileScreen.jsx";

// viewport hook for the responsive shell (mobile dock ↔ desktop rail)
export function useMedia(q) {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const fn = () => setM(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", fn) : mq.addListener(fn);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", fn) : mq.removeListener(fn));
  }, [q]);
  return m;
}

/** Sub-view header: a bold, unmissable back pill + serif title. */
export function SubHeader({ title, onBack, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "2px 0 14px" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer",
        background: T.panel, border: `1.5px solid ${T.gold}88`, color: T.gold, borderRadius: 999,
        padding: "9px 16px 9px 12px", fontFamily: "inherit", fontWeight: 800, fontSize: 14, boxShadow: T.shadow }}>
        <span style={{ fontSize: 17, lineHeight: 1 }}>‹</span> {t("common.back")}
      </button>
      <div className="gg-serif" style={{ fontSize: 21, letterSpacing: ".05em", color: T.text }}>{title}</div>
    </div>
  );
}

function reducer(state, a) {
  switch (a.type) {
    case "HYDRATE": return a.profile;
    case "SET_NAME": return { ...state, name: a.name };
    case "SET_LANG": return { ...state, lang: a.lang };
    case "SET_PIN": return { ...state, pin: a.pin };
    case "SET_DIFFICULTY": return { ...state, difficulty: a.difficulty };
    case "SET_HERO_COL": return { ...state, loadout: { ...state.loadout, heroCols: { ...(state.loadout.heroCols || {}), [a.mapId]: a.col } } };
    case "SET_FORMATION": return { ...state, loadout: { ...state.loadout, formations: { ...(state.loadout.formations || {}), [a.mapId]: a.formation } } };
    case "CAMPAIGN_CLEAR": return advanceCampaign(state, a.id);
    case "UPGRADE_PIECE": return upgradePiece(state, a.id);
    case "UNLOCK_ABILITY": return unlockAbility(state, a.id, a.ability);
    case "RESPEC": return respecPiece(state, a.id);
    case "CLAIM_ACH": return claimAchievement(state, a.id);
    case "BUY_ITEM": return buyItem(state, a.id);
    case "BUY_POTION": return buyItem(state, "potion");
    case "GIFT_GOLD": return { ...state, gold: (state.gold || 0) + (a.n || 0) };
    case "SET_NOTICE": return { ...state, notices: { ...(state.notices || {}), [a.key]: true } };
    case "SET_ONLINE": return { ...state, online: { ...state.online, ...a.online } };
    case "REPLACE": if (state) takeRestorePoint(state, { force: true });
      // eslint-disable-next-line no-fallthrough
 return a.profile;
    case "RESET": return { ...defaultProfile(), name: state.name, lang: state.lang };
    default: return state;
  }
}

const TABS = [
  { id: "play", icon: "♟", key: "nav.play" },
  { id: "army", icon: "🛡️", key: "nav.army" },
  { id: "ach", icon: "🏆", key: "nav.ach" },
  { id: "profile", icon: "👤", key: "nav.profile" },
];

export default function App() {
  const [profile, dispatch] = useReducer(reducer, null);
  const [ready, setReady] = useState(false);
  const [splash, setSplash] = useState(true);
  const [locked, setLocked] = useState(false);
  const [tab, setTab] = useState("play");
  const [view, setView] = useState("hub"); // play tab: hub | quick | camp | online
  const [match, setMatch] = useState(null);
  const [pvp, setPvp] = useState(null);
  const [quick, setQuick] = useState(null);   // running quick match (config decided in QuickSetup)
  const lastQuick = useRef(null);             // remembered setup for the next visit
  const wide = useMedia("(min-width: 900px)");
  const netRef = useRef(null);
  if (!netRef.current) netRef.current = createNet();
  const profileRef = useRef(null);
  useEffect(() => { profileRef.current = profile; }, [profile]);
  useEffect(() => netRef.current.on("welcome", () => {
    // one cloud restore point per session, automatically on connect
    const p = profileRef.current;
    if (p) netRef.current.send({ t: "vaultPush", save: serializeSave(p),
      meta: { league: p.campaign?.league || 1, gold: p.gold || 0 } });
  }), []);
  useEffect(() => netRef.current.on("gift", (m) => dispatch({ type: "GIFT_GOLD", n: m.gold || 10 })), []);
  useEffect(() => netRef.current.on("match", (m) => {
    setMatch(null);
    setPvp({ matchId: m.matchId, seed: m.seed, mapId: m.map, color: m.youAre,
      oppName: m.opp?.name || "?", oppScore: m.opp?.score || 0, oppArmy: m.oppArmy, net: netRef.current });
  }), []);

  useEffect(() => { (async () => { const p = await loadProfile(); dispatch({ type: "HYDRATE", profile: p }); setLocked(!!p.pin); setReady(true); })(); }, []);
  useEffect(() => { if (ready && profile) { saveProfile(profile); takeRestorePoint(profile); } }, [profile, ready]);

  if (!ready || !profile) return splash ? <Splash onDone={() => setSplash(false)} /> : null;
  const showPrivacy = !splash && !profile.notices?.privacy;
  const showIntro = !splash && !showPrivacy && !profile.notices?.intro; // what the game IS — once, at the very start
  if (splash) return <Splash onDone={() => setSplash(false)} />;
  const t = makeT(profile.lang);
  if (locked) return <Lock t={t} profile={profile} onUnlock={() => setLocked(false)} />;

  const prog = playerXpProgress(profile.xpEarned || profile.xp);
  const sub = (title, node) => <div><SubHeader title={title} onBack={() => setView("hub")} t={t} />{node}</div>;
  const screen = pvp
    ? <GameScreen key={"pvp" + pvp.matchId} profile={profile} dispatch={dispatch} t={t} pvp={pvp} onExit={() => setPvp(null)} />
    : match
    ? <GameScreen key={"camp" + match.nodeId} profile={profile} dispatch={dispatch} t={t} match={match} onExit={() => setMatch(null)} />
    : quick
    ? <GameScreen key={"q" + quick.n} profile={profile} dispatch={dispatch} t={t} quick={quick} onExit={() => setQuick(null)} />
    : tab === "play" ? (
        view === "quick" ? sub(t("hub.quick"), <QuickSetup profile={profile} dispatch={dispatch} t={t} initial={lastQuick.current}
          onStart={(cfg) => { lastQuick.current = cfg; setQuick({ ...cfg, n: Date.now() }); }} />)
        : view === "camp" ? <CampaignScreen profile={profile} dispatch={dispatch} t={t} onBack={() => setView("hub")} onStart={(id) => setMatch(buildStageMatch(id, profile))} />
        : view === "online" ? sub(t("online.title"), <OnlineScreen profile={profile} dispatch={dispatch} t={t} net={netRef.current} />)
        : <PlayHub profile={profile} t={t} onQuick={() => setView("quick")} onCamp={() => setView("camp")} onOnline={() => setView("online")} />
      )
      : tab === "army" ? <ArmyScreen profile={profile} dispatch={dispatch} t={t} />
        : tab === "ach" ? <AchievementsScreen profile={profile} dispatch={dispatch} t={t} />
          : <ProfileScreen profile={profile} dispatch={dispatch} t={t} />;

  const inMatch = !!match || !!pvp || !!quick;
  // map & match immersion (v0.3/v0.4): the campaign map and every running
  // match fill the screen — the shell locks to 100dvh, UI floats above
  const immersive = inMatch || (tab === "play" && view === "camp");
  const railItems = TABS.map((tb) => {
    const on = tab === tb.id;
    return (
      <button key={tb.id} onClick={() => { setTab(tb.id); setView("hub"); }} style={{
        display: "flex", alignItems: "center", gap: wide ? 12 : 0, flexDirection: wide ? "row" : "column",
        justifyContent: wide ? "flex-start" : "center", width: "100%",
        background: on ? `linear-gradient(135deg, ${T.lime}26, ${T.lime}10)` : "none",
        border: on ? `1px solid ${T.lime}55` : "1px solid transparent",
        borderRadius: 14, cursor: "pointer", fontFamily: "inherit",
        padding: wide ? "11px 14px" : "9px 4px 8px", color: on ? T.goldBright : T.faint,
        transition: "background .18s, color .18s" }}>
        <NavIcon id={tb.id} color={on ? T.gold : T.faint} size={wide ? 21 : 22} />
        <span style={{ fontSize: wide ? 13.5 : 10.5, fontWeight: 800, marginTop: wide ? 0 : 3, letterSpacing: ".02em" }}>{t(tb.key)}</span>
      </button>
    );
  });

  const headerBar = (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <div style={{ width: 112 }}><Wordmark scale={0.68} /></div>
      <div style={{ flex: 1, maxWidth: 220 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: T.dim, marginBottom: 3 }}>
          <span>{t("home.level")} {prog.level}</span><span>{prog.into} / {prog.span} XP</span>
        </div>
        <Bar pct={prog.pct} height={5} />
      </div>
    </div>
  );

  if (wide) return (
    <div style={{ minHeight: "100%", display: "flex", justifyContent: "center", gap: 18, padding: "18px 18px 24px",
      ...(immersive ? { height: "100dvh", overflow: "hidden", paddingBottom: 18 } : {}) }}>
      {showPrivacy && <PrivacyNotice t={t} dispatch={dispatch} />}
      {showIntro && <GameIntro t={t} dispatch={dispatch} />}
      {!inMatch && (
        <aside style={{ width: 224, flex: "0 0 auto", position: "sticky", top: 18, alignSelf: "flex-start",
          background: `linear-gradient(180deg, ${T.panel2}, ${T.panel})`, border: `1px solid ${T.line}`,
          borderRadius: 22, boxShadow: T.shadow, padding: "20px 12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ padding: "0 8px 14px" }}><Wordmark scale={0.8} /></div>
          {railItems}
          <div style={{ flex: 1 }} />
          <div style={{ padding: "10px 10px 4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.dim, marginBottom: 4 }}>
              <span>{t("home.level")} {prog.level}</span><span>{prog.into} / {prog.span} XP</span>
            </div>
            <Bar pct={prog.pct} height={5} />
          </div>
        </aside>
      )}
      <main style={{ width: "100%", maxWidth: immersive ? "none" : inMatch ? 1020 : 720, minWidth: 0,
        ...(immersive ? { display: "flex", flexDirection: "column" } : {}) }}>{screen}</main>
    </div>
  );

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", minHeight: "100%", display: "flex", flexDirection: "column",
      ...(immersive ? { maxWidth: "none", height: "100dvh", overflow: "hidden" } : {}) }}>
      {showPrivacy && <PrivacyNotice t={t} dispatch={dispatch} />}
      {showIntro && <GameIntro t={t} dispatch={dispatch} />}
      {!inMatch && (
        <header style={{ position: "sticky", top: 0, zIndex: 7, padding: "10px 10px 0" }}>
          <div style={{ background: `${T.panel}e8`, backdropFilter: "blur(10px)", border: `1px solid ${T.line}`,
            borderRadius: 18, boxShadow: T.shadow, padding: "12px 14px" }}>{headerBar}</div>
        </header>
      )}
      <main style={{ flex: 1, minHeight: 0, padding: immersive ? 0 : inMatch ? "14px 14px 24px" : "14px 14px 108px",
        ...(immersive ? { display: "flex", flexDirection: "column" } : {}) }}>{screen}</main>
      {!inMatch && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 7,
          padding: "0 12px calc(10px + env(safe-area-inset-bottom))", pointerEvents: "none" }}>
          <div style={{ maxWidth: 536, margin: "0 auto", pointerEvents: "auto",
            background: `${T.panel}ec`, backdropFilter: "blur(12px)", border: `1px solid ${T.line}`,
            borderRadius: 22, boxShadow: "0 12px 32px rgba(0,0,0,.55)",
            display: "grid", gridTemplateColumns: `repeat(${TABS.length}, 1fr)`, padding: "6px 8px" }}>
            {railItems}
          </div>
        </nav>
      )}
    </div>
  );
}

export const HubArt = ({ children }) => (
  <svg width="86" height="86" viewBox="0 0 64 64">
    <defs>
      <radialGradient id="hubg" cx="38%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#2a3350" /><stop offset="100%" stopColor="#141b2c" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="29" fill="url(#hubg)" stroke="#c9a45c" strokeWidth="1.6" />
    <circle cx="32" cy="32" r="24.5" fill="none" stroke="#c9a45c55" strokeWidth="1" strokeDasharray="1 3.4" />
    {children}
  </svg>
);
const G = "#c9a45c", GH = "#e3c07a", NV = "#0e1424";

const CampArt = () => (
  <HubArt>
    <path d="M14 42 C20 36 24 38 28 31 C32 24 38 27 44 20" stroke={G} strokeWidth="2.2" strokeDasharray="0.4 4.4" strokeLinecap="round" fill="none" />
    <path d="M40 13 L40 24 L48 24 L48 13 L46 13 L46 16 L44.6 16 L44.6 13 L43.4 13 L43.4 16 L42 16 L42 13 Z" fill={GH} />
    <path d="M39 24 L49 24 L50 26.5 L38 26.5 Z" fill={G} />
    <circle cx="15" cy="43.5" r="3.4" fill="none" stroke={GH} strokeWidth="1.8" />
    <circle cx="15" cy="43.5" r="1.2" fill={GH} />
    <path d="M20 50 L26 47 M42 44 L47 40" stroke="#4c6247" strokeWidth="2" strokeLinecap="round" />
    <path d="M22 18 L24.5 12.5 L27 18 Z M17 21 L19 17 L21 21 Z" fill="#4c6247" />
  </HubArt>
);
const QuickArt = () => (
  <HubArt>
    <path d="M19 18 L42 41 M45 18 L22 41 M19 18 L24.5 18 M19 18 L19 23.5 M45 18 L39.5 18 M45 18 L45 23.5" stroke={GH} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    <path d="M24.4 38.6 L20 46 M39.6 38.6 L44 46" stroke={G} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M32 46.5 L33.3 49.8 L36.8 50 L34.1 52.2 L35 55.6 L32 53.6 L29 55.6 L29.9 52.2 L27.2 50 L30.7 49.8 Z" fill={G} />
  </HubArt>
);
const OnlineArt = () => (
  <HubArt>
    <circle cx="32" cy="30" r="13.5" fill="none" stroke={G} strokeWidth="1.8" />
    <ellipse cx="32" cy="30" rx="6.2" ry="13.5" fill="none" stroke={G} strokeWidth="1.3" opacity=".8" />
    <path d="M18.8 26 L45.2 26 M18.8 34 L45.2 34" stroke={G} strokeWidth="1.3" opacity=".8" />
    <path d="M22 47 C24.5 43.5 28 42 32 42 C36 42 39.5 43.5 42 47" stroke={GH} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <circle cx="24" cy="20" r="2.6" fill={GH} /><circle cx="41" cy="38" r="2.6" fill={GH} />
    <path d="M25.8 21.6 L39.2 36.4" stroke={GH} strokeWidth="1.6" strokeDasharray="2.4 2.6" strokeLinecap="round" />
  </HubArt>
);

export function PlayHub({ profile, t, onQuick, onCamp, onOnline }) {
  const en = profile.lang === "en";
  const hubWide = useMedia("(min-width: 900px)");
  const cur = nodeById(currentNodeId(profile));
  const done = clearedCount(profile), total = campaignLength(profile);
  const ch = chapterForRow(cur?.row || 0);
  const roman = ["I", "II", "III", "IV"][ch.n - 1];
  const Card = ({ title, sub, extra, cta, onGo, art, style }) => (
    <button onClick={onGo} style={{ textAlign: "left", fontFamily: "inherit", cursor: "pointer", width: "100%",
      background: `linear-gradient(160deg, ${T.panel2}, ${T.panel})`, border: `1px solid ${T.line}`,
      borderRadius: T.radius, padding: "16px 16px 14px", boxShadow: T.shadow, position: "relative", overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", right: -6, top: -4, opacity: 0.9 }}>{art}</div>
      <div className="gg-serif" style={{ fontSize: 20, letterSpacing: ".06em", color: T.gold }}>{title}</div>
      <div style={{ fontSize: 12.5, color: T.dim, marginTop: 4 }}>{sub}</div>
      {extra && <div style={{ fontSize: 12.5, color: T.text, marginTop: 10 }}>{extra}</div>}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, padding: "8px 14px",
        borderRadius: T.radiusSm, background: T.lime, color: T.limeInk, fontWeight: 800, fontSize: 13.5 }}>{cta} ›</div>
    </button>
  );
  return (
    <div style={{ display: "grid", gap: 12, gridTemplateColumns: hubWide ? "1fr 1fr" : "1fr" }}>
      <Card title={t("camp.title")} sub={t("hub.campSub")} onGo={onCamp} cta={t("hub.continue")}
        extra={<>
          <span className="gg-serif" style={{ color: T.gold, letterSpacing: ".06em" }}>{t("camp.leagueNo", { r: ["I","II","III","IV","V"][(profile.campaign?.league || 1) - 1] || profile.campaign?.league })}</span> <span style={{ color: T.faint }}>·</span> <span className="gg-serif" style={{ color: T.dim, letterSpacing: ".06em" }}>{t("story.chapter", { r: roman })} · {en ? ch.titleEn : ch.titleDe}</span><br />
          <b style={{ color: T.gold }}>{done} / {total}</b> · {t("hub.at")}: <b>{cur?.place}</b></>}
        art={<CampArt />} style={hubWide ? { gridColumn: "1 / -1" } : null} />
      <Card title={t("hub.quick")} sub={t("hub.quickSub")} onGo={onQuick} cta={t("camp.play")}
        art={<QuickArt />} />
      <Card title={t("online.title")} sub={t("online.sub")} onGo={onOnline} cta={t("online.connect")}
        art={<OnlineArt />} />
    </div>
  );
}

function Lock({ t, profile, onUnlock }) {
  const [pin, setPin] = useState("");
  const [wrong, setWrong] = useState(false);
  async function tryUnlock() {
    if (await verifyPin(pin, profile.pin)) onUnlock();
    else { setWrong(true); setPin(""); }
  }
  return <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 20 }}>
    <Panel style={{ width: "100%", maxWidth: 320, textAlign: "center" }}>
      <div style={{ fontSize: 34, marginBottom: 6 }}>🔒</div>
      <div style={{ fontWeight: 800, marginBottom: 14 }}>{t("lock.title")}</div>
      <input autoFocus value={pin} type="password" inputMode="numeric" placeholder={t("lock.enter")}
        onChange={(e) => { setWrong(false); setPin(e.target.value.replace(/\D/g, "").slice(0, 8)); }}
        onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
        style={{ width: "100%", textAlign: "center", letterSpacing: 6, background: T.bg2, border: `1px solid ${wrong ? T.danger : T.line}`, borderRadius: 10, color: T.text, padding: "12px", fontSize: 18, outline: "none", marginBottom: 10 }} />
      {wrong && <div style={{ color: T.danger, fontSize: 13, marginBottom: 10 }}>{t("lock.wrong")}</div>}
      <Button style={{ width: "100%" }} onClick={tryUnlock} disabled={pin.length < 4}>{t("lock.unlock")}</Button>
    </Panel>
  </div>;
}


// ── first-run game intro (once): what Grand Gambit IS and what makes it
// special — a parchment card in the world's own voice. ───────────────────────
function GameIntro({ t, dispatch }) {
  const Row = ({ icon, children }) => (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", textAlign: "left" }}>
      <span style={{ fontSize: 17, width: 24, textAlign: "center", flex: "0 0 auto" }}>{icon}</span>
      <span style={{ fontSize: 13, lineHeight: 1.5 }}>{children}</span>
    </div>
  );
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "grid", placeItems: "center",
      background: "rgba(8,10,14,.8)", backdropFilter: "blur(3px)", padding: 18 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#efe9da", color: "#2e2a20", border: "1px solid #c9bfa4",
        borderRadius: 16, boxShadow: "0 18px 50px rgba(0,0,0,.6)", padding: "22px 20px 18px", textAlign: "center",
        animation: "rise .3s ease", maxHeight: "calc(100dvh - 36px)", overflowY: "auto" }}>
        <div className="gg-serif" style={{ fontSize: 21, letterSpacing: ".05em" }}>{t("intro.title")}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0" }}>
          <span style={{ flex: 1, height: 1, background: "#c9bfa4" }} />
          <span style={{ width: 6, height: 6, background: "#8a6f4d", transform: "rotate(45deg)" }} />
          <span style={{ flex: 1, height: 1, background: "#c9bfa4" }} />
        </div>
        <div className="gg-serif" style={{ fontSize: 13.5, fontStyle: "italic", lineHeight: 1.55, color: "#4a4433" }}>{t("intro.lead")}</div>
        <div style={{ display: "grid", gap: 10, margin: "14px 0 4px" }}>
          <Row icon="♟">{t("intro.p1")}</Row>
          <Row icon="⭐">{t("intro.p2")}</Row>
          <Row icon="🗺">{t("intro.p3")}</Row>
        </div>
        <button onClick={() => dispatch({ type: "SET_NOTICE", key: "intro" })}
          style={{ marginTop: 14, width: "100%", padding: "12px 14px", borderRadius: 10, background: "#1d2436",
            color: "#e9e2cf", fontWeight: 800, fontSize: 14.5, border: "none", fontFamily: "inherit",
            cursor: "pointer", letterSpacing: ".04em" }}>{t("intro.ok")} ›</button>
      </div>
    </div>
  );
}

// ── first-run privacy notice (no cookies, local save, optional online) ──────
function PrivacyNotice({ t, dispatch }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "grid", placeItems: "center",
      background: "rgba(8,10,14,.78)", backdropFilter: "blur(3px)", padding: 18 }}>
      <div style={{ width: "100%", maxWidth: 400, background: T.panel, border: `1px solid ${T.gold}66`,
        borderRadius: T.radius, boxShadow: "0 18px 50px rgba(0,0,0,.6)", padding: "20px 18px 16px" }}>
        <div className="gg-serif" style={{ fontSize: 19, color: T.gold, letterSpacing: ".05em" }}>{t("privacy.title")}</div>
        <div style={{ fontSize: 13.5, color: T.dim, lineHeight: 1.6, margin: "10px 0 6px" }}>{t("privacy.body")}</div>
        <div style={{ fontSize: 12.5, color: T.faint, lineHeight: 1.55, marginBottom: 14 }}>
          {t("privacy.online")}{" "}
          <a href="./privacy.html" target="_blank" rel="noreferrer" style={{ color: T.gold }}>{t("privacy.link")}</a>
        </div>
        <Button variant="primary" style={{ width: "100%" }}
          onClick={() => dispatch({ type: "SET_NOTICE", key: "privacy" })}>{t("privacy.ok")}</Button>
      </div>
    </div>
  );
}
