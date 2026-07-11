import { useEffect, useReducer, useRef, useState } from "react";
import { loadProfile, saveProfile, defaultProfile, buildStageMatch, advanceCampaign, upgradePiece, clearedCount, campaignLength, currentNodeId , unlockAbility, respecPiece, claimAchievement, payToll, takeRestorePoint, serializeSave } from "../meta/index.js";
import { nodeById, chapterForRow, buyItem } from "../content/index.js";
import { verifyPin } from "../platform/index.js";
import { makeT } from "./i18n/strings.js";
import { SERVER_URL } from "./config.js";
import { playerXpProgress } from "../meta/index.js";
import { T } from "./ui/theme.js";
import { Wordmark } from "./ui/Brand.jsx";
import { LoginScreen } from "./ui/screens/LoginScreen.jsx";
import { SavesScreen } from "./ui/screens/SavesScreen.jsx";
import { currentAccount, clearSession, signOutCloud, resumeCloudSession, writeSave, recordStage } from "../meta/index.js";
import { OnlineScreen } from "./ui/screens/OnlineScreen.jsx";
import { createNet } from "../platform/net.web.js";
import { NavIcon } from "./ui/icons.jsx";
import { Bar, Panel, Button, Chip } from "./ui/primitives.jsx";
import { GameScreen, QuickSetup } from "./ui/screens/GameScreen.jsx";
import { ArmyScreen } from "./ui/screens/ArmyScreen.jsx";
import { CampaignScreen } from "./ui/screens/CampaignScreen.jsx";
import { TutorialScreen } from "./ui/screens/TutorialScreen.jsx";
import { InstallBanner } from "./ui/InstallBanner.jsx";
import crest1 from "./ui/assets/crest-1.webp";
import crest2 from "./ui/assets/crest-2.webp";
import crest3 from "./ui/assets/crest-3.webp";

// the painted crests of the three roads: the wanderer's star for the campaign,
// crossed blades for a quick bout, the keep for duels across the realm
const CrestArt = ({ src }) => (
  <img src={src} alt="" aria-hidden style={{ width: 72, height: 84, objectFit: "contain",
    filter: "drop-shadow(0 4px 9px rgba(0,0,0,.55))" }} />
);
import { AchievementsScreen } from "./ui/screens/AchievementsScreen.jsx";
import { LeaderboardSection } from "./ui/screens/LeaderboardScreen.jsx";
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
    case "RECORD_STAGE": return recordStage(state, a);
    case "UPGRADE_PIECE": return upgradePiece(state, a.id);
    case "UNLOCK_ABILITY": return unlockAbility(state, a.id, a.ability);
    case "RESPEC": return respecPiece(state, a.id);
    case "CLAIM_ACH": return claimAchievement(state, a.id);
    case "PAY_TOLL": return payToll(state, a.id);
    case "BUY_ITEM": return buyItem(state, a.id);
    case "BUY_POTION": return buyItem(state, "potion");
    case "GIFT_GOLD": return { ...state, gold: (state.gold || 0) + (a.n || 0) };
    case "SET_NOTICE": return { ...state, notices: { ...(state.notices || {}), [a.key]: true } };
    case "SET_ONLINE": return { ...state, online: { ...state.online, ...a.online } };
    case "PAUSE_MATCH": return { ...state, pausedMatch: a.data || null };
    case "REPLACE": if (state) takeRestorePoint(state, { force: true });
      // eslint-disable-next-line no-fallthrough
 return a.profile;
    case "RESET": return { ...defaultProfile(), name: state.name, lang: state.lang };
    default: return state;
  }
}

const TABS = [
  { id: "play", icon: "♟", key: "nav.play" },
  { id: "army", icon: "⚜️", key: "nav.army" },
  { id: "ach", icon: "👑", key: "nav.ach" },
  { id: "profile", icon: "👤", key: "nav.profile" },
];

export default function App() {
  const [profile, dispatch] = useReducer(reducer, null);
  const [ready, setReady] = useState(false);
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
  const [account, setAccount] = useState(null);     // signed-in account (null → login screen)
  const [slot, setSlot] = useState(null);           // active save slot (null → save select)
  const [authReady, setAuthReady] = useState(false);
  const [trophyTab, setTrophyTab] = useState("ach");
  const playtimeRef = useRef(0);                    // unflushed seconds of visible play
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

  // boot: resume a cloud session (OAuth redirect) or the local one; the game
  // itself only hydrates once an account picked a save slot.
  useEffect(() => { (async () => {
    let acc = null;
    try { acc = await resumeCloudSession(); } catch {}
    if (!acc) acc = await currentAccount();
    setAccount(acc); setAuthReady(true);
  })(); }, []);

  // playtime: count visible seconds, flush into the slot with every persist
  useEffect(() => {
    const iv = setInterval(() => {
      if (typeof document === "undefined" || document.visibilityState === "visible") playtimeRef.current += 5;
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => { if (ready && profile && account && slot) {
    saveProfile(profile); takeRestorePoint(profile);
    const add = playtimeRef.current; playtimeRef.current = 0;
    writeSave(account.id, slot.id, profile, add).then((e) => e && setSlot((sl) => (sl && sl.id === e.id ? e : sl)));
  } }, [profile, ready]);
  // idle playtime flush (menus, reading): every 30 s without a profile change
  useEffect(() => {
    if (!(account && slot)) return;
    const iv = setInterval(() => {
      const add = playtimeRef.current;
      if (add > 0 && profileRef.current) { playtimeRef.current = 0;
        writeSave(account.id, slot.id, profileRef.current, add).then((e) => e && setSlot((sl) => (sl && sl.id === e.id ? e : sl))); }
    }, 30000);
    return () => clearInterval(iv);
  }, [account, slot]);

  if (!authReady) return null;
  if (!account) return <LoginScreen onSignedIn={(acc) => setAccount(acc)} />;
  if (!slot) return <SavesScreen account={account} initialLang={profile?.lang || "de"}
    onLogout={async () => { await clearSession(); await signOutCloud(); setAccount(null); }}
    onOpen={(sl, prof) => { dispatch({ type: "HYDRATE", profile: prof }); setLocked(!!prof.pin); setSlot(sl); setReady(true); }} />;
  if (!ready || !profile) return null;
  const showPrivacy = !profile.notices?.privacy;
  const showIntro = !showPrivacy && !profile.notices?.intro; // what the game IS — once, at the very start
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
        : view === "tutorial" ? sub(t("tut.title"), <TutorialScreen t={t} en={profile.lang === "en"} onDone={() => setView("hub")} />)
        : <PlayHub profile={profile} t={t} onQuick={() => setView("quick")} onCamp={() => setView("camp")} onOnline={() => setView("online")} onTutorial={() => setView("tutorial")} />
      )
      : tab === "army" ? <ArmyScreen profile={profile} dispatch={dispatch} t={t} />
        : tab === "ach" ? <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {[["ach", t("ranks.tabAch")], ["lb", t("ranks.tabLb")]].map(([id, lbl]) => (
              <button key={id} onClick={() => setTrophyTab(id)} style={{ flex: 1, background: trophyTab === id ? "rgba(201,164,92,.22)" : "none",
                border: `1px solid ${trophyTab === id ? T.gold + "88" : T.line}`, color: trophyTab === id ? T.gold : T.dim,
                borderRadius: 999, padding: "8px 6px", fontFamily: "inherit", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>{lbl}</button>
            ))}
          </div>
          {trophyTab === "lb"
            ? <LeaderboardSection profile={profile} playtimeSec={slot?.playtimeSec || 0} />
            : <AchievementsScreen profile={profile} dispatch={dispatch} t={t} />}
        </div>
          : <ProfileScreen profile={profile} dispatch={dispatch} t={t} account={account} />;

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
        <span className="gg-serif" style={{ fontSize: wide ? 13 : 9.5, fontWeight: 700, marginTop: wide ? 0 : 3,
          letterSpacing: ".09em", textTransform: "uppercase" }}>{t(tb.key)}</span>
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
        <Bar pct={Math.max(prog.pct, 0.035)} height={6} color={T.gold} />
      </div>
    </div>
  );

  if (wide) return (
    <div style={{ minHeight: "100%", display: "flex", justifyContent: "center", gap: 18, padding: "18px 18px 24px",
      ...(immersive ? { height: "100dvh", overflow: "hidden", paddingBottom: 18 } : {}) }}>
      {showPrivacy && <PrivacyNotice t={t} dispatch={dispatch} />}
      {showIntro && <GameIntro t={t} dispatch={dispatch} onStart={() => { setTab("play"); setView("camp"); }} />}
      {!immersive && (
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
            <Bar pct={Math.max(prog.pct, 0.035)} height={6} color={T.gold} />
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
      {showIntro && <GameIntro t={t} dispatch={dispatch} onStart={() => { setTab("play"); setView("camp"); }} />}
      {!immersive && (
        <header style={{ position: "sticky", top: 0, zIndex: 7, padding: "10px 10px 0" }}>
          <div style={{ background: `${T.panel}e8`, backdropFilter: "blur(10px)", border: `1px solid ${T.line}`,
            borderRadius: 18, boxShadow: T.shadow, padding: "12px 14px" }}>{headerBar}</div>
        </header>
      )}
      <main style={{ flex: 1, minHeight: 0, padding: immersive ? 0 : inMatch ? "14px 14px 24px" : "14px 14px 108px",
        ...(immersive ? { display: "flex", flexDirection: "column" } : {}) }}>{screen}</main>
      {!immersive && <InstallBanner en={profile.lang === "en"} />}
      {!immersive && (
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

// ── hub emblems: heraldic shields, fully inside the card, bold shapes ───────
export const HubArt = ({ children }) => (
  <svg width="72" height="80" viewBox="0 0 64 72">
    <defs>
      <radialGradient id="hubg" cx="38%" cy="26%" r="85%">
        <stop offset="0%" stopColor="#2c3554" /><stop offset="100%" stopColor="#121828" />
      </radialGradient>
      <linearGradient id="hubrim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ecd08c" /><stop offset=".5" stopColor="#c9a45c" /><stop offset="1" stopColor="#8a6d35" />
      </linearGradient>
    </defs>
    <path d="M32 2.5 L58.5 9.5 V33 C58.5 51.5 46.5 62.5 32 69.5 C17.5 62.5 5.5 51.5 5.5 33 V9.5 Z"
      fill="url(#hubg)" stroke="url(#hubrim)" strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M32 7 L54.5 13 V33 C54.5 49 44 58.8 32 64.9 C20 58.8 9.5 49 9.5 33 V13 Z"
      fill="none" stroke="#c9a45c55" strokeWidth="1" />
    {children}
  </svg>
);
const G = "#c9a45c", GH = "#e8c97e", NV = "#0e1424";


export function PlayHub({ profile, t, onQuick, onCamp, onOnline, onTutorial = null }) {
  const en = profile.lang === "en";
  const hubWide = useMedia("(min-width: 900px)");
  const cur = nodeById(currentNodeId(profile));
  const done = clearedCount(profile), total = campaignLength(profile);
  const ch = chapterForRow(cur?.row || 0);
  const roman = ["I", "II", "III", "IV"][ch.n - 1];
  const Card = ({ title, sub, extra, cta, onGo, art, style, shineDelay = 0 }) => (
    <button onClick={onGo} style={{ textAlign: "left", fontFamily: "inherit", cursor: "pointer", width: "100%",
      background: `linear-gradient(160deg, ${T.panel2}, ${T.panel})`, border: `1px solid ${T.line}`,
      borderRadius: T.radius, padding: "16px 16px 14px", boxShadow: T.shadow, position: "relative", overflow: "hidden", ...style }}>
      {/* a faint passing gleam — the treasury's shimmer, dialed way down */}
      <div aria-hidden style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "38%", pointerEvents: "none",
        background: "linear-gradient(90deg, transparent, rgba(255,238,190,.05), transparent)",
        animation: `ggShine 7s ease-in-out ${shineDelay}s infinite` }} />
      <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.95, filter: "drop-shadow(0 3px 6px rgba(0,0,0,.35))" }}>{art}</div>
      <div className="gg-serif" style={{ fontSize: 20, letterSpacing: ".06em", color: T.gold, paddingRight: 92 }}>{title}</div>
      <div style={{ fontSize: 12.5, color: T.dim, marginTop: 4, paddingRight: 92 }}>{sub}</div>
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
          <span className="gg-serif" style={{ color: T.gold, letterSpacing: ".04em" }}>{t("hub.station", { a: done, b: total })}</span> · {t("hub.nextStop")}: <b>{cur?.place}</b>
          <div style={{ marginTop: 7, maxWidth: 340 }}><Bar pct={Math.max(done / Math.max(1, total), 0.02)} height={4} color={T.gold} /></div></>}
        art={<CrestArt src={crest1} />} style={hubWide ? { gridColumn: "1 / -1" } : null} />
      <Card title={t("hub.quick")} sub={t("hub.quickSub")} onGo={onQuick} cta={t("camp.play")}
        art={<CrestArt src={crest2} />} shineDelay={1.4} />
      <Card title={t("online.title")} sub={t("online.sub")} onGo={onOnline} cta={t("online.connect")}
        extra={!SERVER_URL ? <Chip color={"#17110a"} bg={T.gold}>{t("hub.soon")}</Chip> : null}
        art={<CrestArt src={crest3} />} shineDelay={2.8} />
      {onTutorial && (
        <button onClick={onTutorial} style={{ gridColumn: "1 / -1", textAlign: "center", fontFamily: "inherit",
          cursor: "pointer", background: "none", border: `1px dashed ${T.line}`, borderRadius: T.radius,
          padding: "11px 14px", color: T.dim, fontSize: 13 }}>
          <span className="gg-serif" style={{ color: T.gold, letterSpacing: ".06em" }}>{t("tut.title")}</span>
          {" · "}{t("tut.sub")}
        </button>
      )}
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
      <input autoFocus value={pin} type="password" placeholder={t("lock.enter")}
        onChange={(e) => { setWrong(false); setPin(e.target.value.slice(0, 64)); }}
        onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
        style={{ width: "100%", textAlign: "center", letterSpacing: 2, background: T.bg2, border: `1px solid ${wrong ? T.danger : T.line}`, borderRadius: 10, color: T.text, padding: "12px", fontSize: 18, outline: "none", marginBottom: 10 }} />
      {wrong && <div style={{ color: T.danger, fontSize: 13, marginBottom: 10 }}>{t("lock.wrong")}</div>}
      <Button style={{ width: "100%" }} onClick={tryUnlock} disabled={pin.length < 4}>{t("lock.unlock")}</Button>
    </Panel>
  </div>;
}


// ── first-run game intro (once): what Grand Gambit IS and what makes it
// special — a parchment card in the world's own voice. ───────────────────────
function GameIntro({ t, dispatch, onStart }) {
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
        <button onClick={() => { dispatch({ type: "SET_NOTICE", key: "intro" }); onStart && onStart(); }}
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
