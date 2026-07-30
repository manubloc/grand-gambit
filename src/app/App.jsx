import { useEffect, useReducer, useRef, useState } from "react";
import { loadProfile, saveProfile, defaultProfile, buildStageMatch, advanceCampaign, upgradePiece, buySpShard, clearedCount, campaignLength, currentNodeId , unlockAbility, respecPiece, claimAchievement, payToll, takeRestorePoint, serializeSave, isUnlocked } from "../meta/index.js";
import { nodeById, chapterForRow, buyItem, CHARACTER_LIST, clockFor } from "../content/index.js";
import { verifyPin } from "../platform/index.js";
import { makeT } from "./i18n/strings.js";
import { SERVER_URL } from "./config.js";
import { claimableCount, retinueScore, upgradeBoss } from "../meta/index.js";
import { setLivery, fetchHouseDesign, crestArt, emblemArt, logoMenuArt } from "./ui/livery.js";
import { Soundtrack } from "./ui/Soundtrack.jsx";
import { AchievementsScreen } from "./ui/screens/AchievementsScreen.jsx";
import { APP_DESIGN } from "./config.js";
import { CoinIc, SkillIc, CrestIc, GoldHeartIc, MapPinIc, LockIc } from "./ui/icons.jsx";
import { JewelIc } from "./ui/board/PieceGlyph.jsx";
import { T, GOLD_CTA } from "./ui/theme.js";
import { useShineDelay, GoldShineButton } from "./ui/Gilded.jsx";
import { Wordmark } from "./ui/Brand.jsx";
import { LoginScreen } from "./ui/screens/LoginScreen.jsx";
import { SavesScreen } from "./ui/screens/SavesScreen.jsx";
import { GalerieScreen } from "./ui/screens/GalerieScreen.jsx";
import { currentAccount, clearSession, signOutCloud, resumeCloudSession, writeSave, recordStage } from "../meta/index.js";
import { OnlineScreen, buildStats } from "./ui/screens/OnlineScreen.jsx";
import { createNet } from "../platform/net.web.js";
import { NavIcon, HeartIc, SkillStar, MapIc } from "./ui/icons.jsx";
import { Bar, Panel, Button, Chip } from "./ui/primitives.jsx";
import { GameScreen, QuickSetup } from "./ui/screens/GameScreen.jsx";
import { ArmyScreen } from "./ui/screens/ArmyScreen.jsx";
import { CampaignScreen } from "./ui/screens/CampaignScreen.jsx";
import { MysticBackground } from "./ui/MysticBackground.jsx";
import { RissBoden } from "./ui/RissBoden.jsx";
import { MENUE_LEHREN } from "../content/lehren.js";
import { WerkstattScreen } from "./ui/WerkstattScreen.jsx";
import karteKampagne from "./ui/assets/karten/karte-kampagne.webp";
import karteSchnell from "./ui/assets/karten/karte-schnell.webp";
import karteOnline from "./ui/assets/karten/karte-online.webp";
import { AkademieScreen } from "./ui/screens/AkademieScreen.jsx";
import { InstallBanner } from "./ui/InstallBanner.jsx";

// DIE GEMALTEN WAPPEN DER DREI WEGE. Kein Vektor-Siegel - der Besitzer will
// die gemalten Bilder, und zwar in der Fassung der jeweiligen Livree: crestArt
// folgt der Livree, liefert also im geschnitzten Haus die geschnitzten Wappen.
const CrestArt = ({ src }) => (
  <img src={src} alt="" aria-hidden decoding="async" style={{ width: 72, height: 84, objectFit: "contain",
    filter: "drop-shadow(0 4px 9px rgba(0,0,0,.55))" }} />
);


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
    case "SET_SOUND": return { ...state, sound: a.on };
    case "SET_PIN": return { ...state, pin: a.pin };
    case "SET_DIFFICULTY": return { ...state, difficulty: a.difficulty };
    case "SET_PIECE_STYLE": return { ...state, pieceStyle: a.style };
    case "SET_CAMP_DIFFICULTY": return { ...state, campDifficulty: a.difficulty };
    case "SET_CLASSIC_ELO": return { ...state, classicElo: a.elo };
    case "SET_HERO_COL": return { ...state, loadout: { ...state.loadout, heroCols: { ...(state.loadout.heroCols || {}), [a.mapId]: a.col } } };
    case "SET_FORMATION": return { ...state, loadout: { ...state.loadout, formations: { ...(state.loadout.formations || {}), [a.mapId]: a.formation } } };
    case "CAMPAIGN_CLEAR": return advanceCampaign(state, a.id);
    case "RECORD_STAGE": return recordStage(state, a);
    case "UPGRADE_PIECE": return upgradePiece(state, a.id);
    case "UPGRADE_BOSS": return upgradeBoss(state, a.id);
    case "BUY_SP_SHARD": return buySpShard(state);
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
    case "SET_PIECE_ART": return { ...state, pieceArt: a.style };
    case "REPLACE": if (state) takeRestorePoint(state, { force: true });
      // eslint-disable-next-line no-fallthrough
 return a.profile;
    case "RESET": return { ...defaultProfile(), name: state.name, lang: state.lang };
    default: return state;
  }
}


// Asked when the menu is used mid-fight. It names the price honestly: a
// campaign fight survives the switch, a quick or online game does not.
export function LeaveMatchAsk({ t, resumable, onLeave, onStay }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40, display: "grid", placeItems: "center",
      background: "rgba(8,10,14,.78)", backdropFilter: "blur(3px)", padding: 16 }}>
      <div style={{ background: `radial-gradient(125% 135% at 50% -10%, ${T.panel2} 0%, ${T.panel} 52%, ${T.bg2} 100%)`, border: `1px solid ${T.line}`,
        borderRadius: 18, boxShadow: T.shadow, padding: "18px 18px 15px", maxWidth: 340, width: "100%" }}>
        <div className="gg-serif" style={{ fontSize: 18, color: T.goldBright, textAlign: "center" }}>{t("leave.title")}</div>
        <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.55, margin: "10px 2px 14px", textAlign: "center" }}>
          {resumable ? t("leave.pause") : t("leave.quit")}
        </div>
        <button onClick={onLeave} style={{ width: "100%", fontFamily: "inherit", fontWeight: 900, fontSize: 14,
          borderRadius: 999, padding: "12px 16px", border: "1px solid rgba(255,240,200,.5)", cursor: "pointer", color: "#17110a",
          background: resumable ? "linear-gradient(160deg, #f0d68a, #d9b565 55%, #b08c44)" : `linear-gradient(160deg, ${T.danger}, #a3313f)`,
          boxShadow: "0 0 14px rgba(217,181,101,.4)" }}>
          {resumable ? t("leave.pauseGo") : t("leave.quitGo")}
        </button>
        <button onClick={onStay} style={{ width: "100%", marginTop: 8, fontFamily: "inherit", fontWeight: 700,
          fontSize: 12.5, borderRadius: 999, padding: "9px 14px", border: `1px solid ${T.line}`,
          background: "transparent", color: T.dim, cursor: "pointer" }}>{t("leave.stay")}</button>
      </div>
    </div>
  );
}

const TABS = [
  { id: "play", key: "nav.play" },
  { id: "army", key: "nav.army" },
  { id: "ach", key: "nav.ach" },
  { id: "profile", key: "nav.profile" },
];

export default function App() {
  const galerie = typeof location !== "undefined" && new URLSearchParams(location.search).has("galerie");
  const werkstatt = typeof location !== "undefined" && new URLSearchParams(location.search).has("werkstatt");
  const [profile, dispatch] = useReducer(reducer, null);
  // which livery the house wears — asked from the Hall once per boot
  const [houseDesign, setHouseDesign] = useState(null);
  useEffect(() => { fetchHouseDesign().then((d) => { if (d) setHouseDesign(d); }); }, []);
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [tab, setTab] = useState("play");
  const [view, setView] = useState("hub"); // play tab: hub | quick | camp | online
  const [match, setMatch] = useState(null);
  const [pvp, setPvp] = useState(null);
  const [quick, setQuick] = useState(null);   // running quick match (config decided in QuickSetup)
  const startQuickNow = () => {
    const cfg = lastQuick.current || { mapId: "classic", mode: "chess", difficulty: profile?.difficulty || "easy",
      elo: profile?.classicElo || 1000, hotseat: false, hotseatFlip: true };
    setTab("play"); setView("quick"); setQuick({ ...cfg, n: Date.now() });
  };
  // THE MENU DURING A FIGHT: on desktop the rail stays on screen while a match
  // runs, and tapping it did nothing at all — the match simply kept rendering
  // over the tab you chose. It asks now, and it says what leaving costs: a
  // campaign fight is saved and resumable, a quick or online game is not.
  const [leaveTo, setLeaveTo] = useState(null);
  // eine ueber die Abkuerzung im Hauptmenue gewaehlte Fernpartie
  const oeffneDaily = useRef(null);
  // A CORRESPONDENCE GAME OPENED FROM THE SHELF. The server hands back seed,
  // both armies and every command played so far; the board replays them and
  // hands the single next move back. Nothing here lives in a socket.
  const [dailyGame, setDailyGame] = useState(null);
  // Das letzte Schnellspiel-Setup ueberlebt jetzt die Sitzung (localStorage):
  // der "Sofort spielen"-Griff im Hub startet damit ohne einen Umweg ueber
  // die Konfiguration - wie es ein Handyspiel schuldig ist.
  const lastQuick = useRef((() => { try { return JSON.parse(localStorage.getItem("gambit:lastQuick") || "null"); } catch { return null; } })());
  const wide = useMedia("(min-width: 900px)");
  const netRef = useRef(null);
  if (!netRef.current) netRef.current = createNet();
  const profileRef = useRef(null);
  useEffect(() => { profileRef.current = profile; }, [profile]);
  const [armyTab, setArmyTab] = useState({ tab: null, n: 0 }); // deep-link into the court (e.g. the skill tree)
  const [account, setAccount] = useState(null);     // signed-in account (null → login screen)
  const [slot, setSlot] = useState(null);           // active save slot (null → save select)
  const [authReady, setAuthReady] = useState(false);
  const playtimeRef = useRef(0);                    // unflushed seconds of visible play
  useEffect(() => netRef.current.on("welcome", () => {
    // one cloud restore point per session, automatically on connect
    const p = profileRef.current;
    if (p) netRef.current.send({ t: "vaultPush", save: serializeSave(p),
      meta: { league: p.campaign?.league || 1, gold: p.gold || 0 } });
  }), []);
  useEffect(() => netRef.current.on("gift", (m) => dispatch({ type: "GIFT_GOLD", n: m.gold || 10 })), []);

  // ── DIE HALLE STEHT OFFEN ──────────────────────────────────────────────────
  // Wer der Verbindung EINMAL zugestimmt hat, muss sich nicht jedesmal neu
  // verbinden: die App klinkt sich beim Start still ein. Zwei Bedingungen sind
  // dabei unverhandelbar - eine vorliegende Einwilligung (notices.online, so
  // steht es auch in der Datenschutzerklaerung) und ein Schalter, mit dem man
  // die Automatik abstellen kann (online.autoConnect !== false). Schlaegt es
  // fehl, passiert nichts weiter: das Spiel laeuft ohne Halle genauso.
  const [hallenSteht, setHallenSteht] = useState(false);
  useEffect(() => {
    const ab = netRef.current.on("welcome", () => setHallenSteht(true));
    const zu = netRef.current.on("close", () => setHallenSteht(false));
    return () => { ab && ab(); zu && zu(); };
  }, []);
  const stillVerbunden = useRef(false);
  useEffect(() => {
    if (stillVerbunden.current || !profile) return;
    const o = profile.online || {};
    if (!profile.notices?.online || o.autoConnect === false || !o.server || !o.id) return;
    stillVerbunden.current = true;
    const t0 = setTimeout(() => {
      netRef.current.connect(o.server, {
        id: o.id, secret: o.secret, name: o.name || profile.name || "?",
        score: retinueScore(profile), privacy: o.privacy || "public",
        stats: buildStats(profile, 0), lang: profile.lang === "en" ? "en" : "de",
      }).catch(() => { /* keine Halle, kein Drama - offline spielt es sich weiter */ });
    }, 1200);   // erst das Spiel zeigen, dann leise verbinden
    return () => clearTimeout(t0);
  }, [profile?.notices?.online, profile?.online?.server]);
  useEffect(() => netRef.current.on("daily:game", (m) => {
    if (!m.game) return;
    setMatch(null); setPvp(null); setQuick(null);
    setDailyGame({ ...m.game, net: netRef.current });
  }), []);
  useEffect(() => netRef.current.on("match", (m) => {
    setMatch(null);
    setPvp({ matchId: m.matchId, seed: m.seed, mapId: m.map, color: m.youAre, rules: m.rules,
      // the clock both sides agreed on in the lobby, handed to the board
      tc: m.tc || "rush", clock: clockFor(m.tc || "rush"),
      oppName: m.opp?.name || "?", oppScore: m.opp?.score || 0, oppArmy: m.oppArmy, net: netRef.current });
  }), []);

  // THE HARD GOODBYE: sign-out must WORK on every browser, every time. We show
  // the login instantly, clear the local session, give the cloud sign-out a
  // short window (so a resume after reload cannot revive the account), then
  // restart the app cold — no React state, cache or listener can undo that.
  const hardLogout = async () => {
    setSlot(null); setAccount(null);
    try { await clearSession(); } catch {}
    try { await Promise.race([signOutCloud(), new Promise((r) => setTimeout(r, 1500))]); } catch {}
    try { location.replace(location.pathname + location.search); } catch {}
  };

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

  // ANDROID/PWA BACK: inside a match the back gesture must fall back to the
  // hall, never kill the app. This hook lives ABOVE the login early-returns —
  // hooks must run in the same order on every render (React #310).
  const inMatchNow = !!match || !!pvp || !!quick || !!dailyGame;
  useEffect(() => {
    if (!inMatchNow) return;
    try { window.history.pushState({ gg: "match" }, ""); } catch {}
    const onPop = () => {
      if (pvp) setPvp(null); else if (match) setMatch(null); else if (quick) setQuick(null); else if (dailyGame) setDailyGame(null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [inMatchNow]);

  // DIE MUSTERKAMMER: interne Designsystem-Galerie, nur ueber ?galerie in der
  // Adresse erreichbar - kein Menuepunkt, kein Spielerweg. Sitzt NACH allen
  // Hooks (Hook-Reihenfolge bleibt stabil) und VOR Anmeldung/Spielstand,
  // damit sie auch ohne Konto aufgeht. (DS1 §17)
  if (galerie) return <GalerieScreen />;
  // DIE FIGURENWERKSTATT (Besitzer, v0.54): nur ueber ?werkstatt erreichbar.
  if (werkstatt) return <WerkstattScreen />;
  if (!authReady) return null;
  if (!account) return <LoginScreen onSignedIn={(acc) => setAccount(acc)} />;
  if (!slot) return <SavesScreen account={account} initialLang={profile?.lang || "de"}
    onLogout={hardLogout}
    onOpen={(sl, prof) => { dispatch({ type: "HYDRATE", profile: prof }); setLocked(!!prof.pin); setSlot(sl); setReady(true); }} />;
  if (!ready || !profile) return null;
  // The chosen piece style is announced to the gallery ONCE, here. Every screen
  // that looks a figure up by id — the court, the chronicle, the unlock pop-ups
  // — then answers in that style without knowing anything about it.
  // The livery is the HOUSE's choice, not the player's. Priority: the admin's
  // local preview override, then the Hall's live answer (cached), then the
  // shipped APP_DESIGN. houseDesign state re-renders us when the Hall differs.
  setLivery((account?.isAdmin && profile.design) || houseDesign || APP_DESIGN);
  const showPrivacy = !profile.notices?.privacy;
  const showIntro = !showPrivacy && !profile.notices?.intro; // what the game IS — once, at the very start
  // onboarding lessons appear between battles, never over a running match
  const teach = (!showPrivacy && !showIntro && !inMatchNow) ? pendingTeach(profile) : null;
  const t = makeT(profile.lang);
  if (locked) return <Lock t={t} profile={profile} onUnlock={() => setLocked(false)}
    onBack={() => { setLocked(false); setSlot(null); setReady(false); }} />;

  const sub = (title, node) => <div><SubHeader title={title} onBack={() => setView("hub")} t={t} />{node}</div>;
  const screen = pvp
    ? <GameScreen key={"pvp" + pvp.matchId} profile={profile} dispatch={dispatch} t={t} pvp={pvp} onExit={() => setPvp(null)} />
    : match
    ? <GameScreen key={"camp" + match.nodeId} profile={profile} dispatch={dispatch} t={t} match={match} onExit={() => setMatch(null)}
        onArmy={() => { setMatch(null); setTab("army"); }} />
    : quick
    ? <GameScreen key={"q" + quick.n} profile={profile} dispatch={dispatch} t={t} quick={quick} onExit={() => setQuick(null)} />
    : dailyGame
    ? <GameScreen key={"daily" + dailyGame.gameId} profile={profile} dispatch={dispatch} t={t}
        daily={dailyGame} onExit={() => setDailyGame(null)} />
    : tab === "play" ? (
        view === "quick" ? sub(t("hub.quick"), <QuickSetup profile={profile} dispatch={dispatch} t={t} initial={lastQuick.current}
          onStart={(cfg) => { lastQuick.current = cfg; try { localStorage.setItem("gambit:lastQuick", JSON.stringify(cfg)); } catch { /* voll/aus */ } setQuick({ ...cfg, n: Date.now() }); }} />)
        : view === "camp" ? <CampaignScreen profile={profile} dispatch={dispatch} t={t} onBack={() => setView("hub")} onStart={(id, lookLeague = null) => {
          if (lookLeague != null) { setMatch(buildStageMatch(id, profile, lookLeague)); return; } // the look back: a friendly replay, no bookkeeping
          // the first fight at a station lifts its veil: FACED is recorded at
          // battle start (win or lose), per league — empty posts until then
          const faced = profile.campaign?.faced || [];
          if (!faced.includes(id)) dispatch({ type: "REPLACE", profile: { ...profile, campaign: { ...profile.campaign, faced: [...faced, id] } } });
          setMatch(buildStageMatch(id, profile));
        }} onOpenTree={() => { setArmyTab({ tab: "tree", n: Date.now() }); setTab("army"); }} />
        : view === "online" ? sub(t("online.title"), account?.provider === "guest"
          ? <Panel><div className="gg-quill" style={{ fontSize: 18, color: T.goldBright, marginBottom: 6 }}>
              {profile.lang === "en" ? "The Hall needs an account" : "Die Halle braucht ein Konto"}</div>
            <div className="gg-serif" style={{ fontSize: 13, lineHeight: 1.6, color: T.dim }}>
              {profile.lang === "en"
                ? "Online duels, correspondence games and the cloud vault are tied to an account — a guest leaves no trace the Hall could find again. Create an account and everything you have played stays with you."
                : "Online-Duelle, Fernpartien und die Wolken-Sicherung hängen an einem Konto — ein Gast hinterlässt keine Spur, die die Halle wiederfinden könnte. Lege ein Konto an, dann bleibt dir alles erhalten, was du gespielt hast."}</div>
          </Panel>
          : <OnlineScreen profile={profile} dispatch={dispatch} t={t} net={netRef.current} account={account}
            oeffneDaily={oeffneDaily}
            onDaily={(gameId) => netRef.current.send({ t: "daily:open", gameId })} />)
        : view === "tutorial" ? sub(t("tut.title"), <AkademieScreen profile={profile} t={t} en={profile.lang === "en"} account={account} onDone={() => setView("hub")} />)
        : <PlayHub profile={profile} t={t} onQuick={() => setView("quick")} onQuickStart={startQuickNow} onCamp={() => setView("camp")} onOnline={(gid) => { oeffneDaily.current = gid || null; setView("online"); }} onTutorial={() => setView("tutorial")} hallenStand={hallenSteht} />
      )
      : tab === "army" ? <ArmyScreen key={armyTab.n} profile={profile} dispatch={dispatch} t={t} initialTab={armyTab.tab} account={account} />
        : tab === "ach" ? <AchievementsScreen profile={profile} dispatch={dispatch} t={t} />
          : <ProfileScreen profile={profile} dispatch={dispatch} t={t} account={account}
              onSwitchSave={() => setSlot(null)}
              onLogout={hardLogout} />;

  const inMatch = !!match || !!pvp || !!quick || !!dailyGame;
  // map & match immersion (v0.3/v0.4): the campaign map and every running
  // match fill the screen — the shell locks to 100dvh, UI floats above
  const immersive = inMatch || (tab === "play" && view === "camp");
  // the campaign map stays fullscreen, but the MAIN MENU stays with it — the
  // court is always one tap away, and leaving the map needs no back button
  const mapView = tab === "play" && view === "camp" && !inMatch;
  const claimable = claimableCount(profile);
  const railItems = TABS.map((tb) => {
    const on = tab === tb.id;
    const badge = tb.id === "ach" && claimable > 0;
    return (
      <button key={tb.id} onClick={() => {
        if (inMatch && tb.id !== tab) { setLeaveTo(tb.id); return; }
        setTab(tb.id); setView("hub");
      }} style={{ position: "relative",
        display: "flex", alignItems: "center", gap: wide ? 12 : 0, flexDirection: wide ? "row" : "column",
        justifyContent: wide ? "flex-start" : "center", width: wide ? "auto" : "100%",
        background: on ? "linear-gradient(135deg, rgba(139,92,246,.30), rgba(124,58,237,.14))" : "none",
        border: on ? "1px solid rgba(196,181,253,.55)" : "1px solid transparent",
        borderRadius: 14, cursor: "pointer", fontFamily: "inherit",
        padding: wide ? "11px 14px" : "9px 4px 8px", color: on ? "#ffffff" : "#cfc8e6",
        transition: "background .18s, color .18s" }}>
        <NavIcon id={tb.id} color={on ? T.goldBright : "#b9b0d8"} size={wide ? 25 : 26} />
        <span className="gg-serif" style={{ fontSize: wide ? 13 : 10, fontWeight: 800, marginTop: wide ? 0 : 3,
          letterSpacing: ".09em", textTransform: "uppercase",
          textShadow: on ? "0 0 8px rgba(196,181,253,.6), 0 1px 2px rgba(0,0,0,.6)" : "0 1px 2px rgba(0,0,0,.55)" }}>{t(tb.key)}</span>
        {badge && <span style={{ position: "absolute", top: wide ? 7 : 4, right: wide ? 8 : "calc(50% - 17px)",
          minWidth: 15, height: 15, padding: "0 3px", borderRadius: 9, background: T.gold, color: "#241a08",
          fontSize: 9.5, fontWeight: 900, display: "grid", placeItems: "center",
          boxShadow: "0 0 8px rgba(240,200,110,.7)" }}>{claimable}</span>}
      </button>
    );
  });

  // OHNE PILLE: Zeichen und Zahl stehen frei in der Leiste - der Rahmen um
  // jede Zahl war ein Kasten zu viel. Die Skillpunkte sind vom Hofstaat
  // hierher gezogen, damit sie ueberall in Sicht bleiben.
  const coinChip = (icon, val, title, farbe = T.goldBright) => (
    <span title={title} className="gg-serif" style={{ display: "inline-flex", alignItems: "center", gap: 6,
      color: farbe, fontSize: 15, fontWeight: 700, letterSpacing: ".04em", whiteSpace: "nowrap",
      textShadow: "0 1px 3px rgba(0,0,0,.7)", fontVariantNumeric: "tabular-nums" }}>{icon} {val}</span>
  );
  const currencyRow = (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 14, flex: "0 0 auto", alignItems: "center", justifyContent: "flex-end" }}>
      {coinChip(<SkillIc size={19} />, profile.sp || 0, t("banner.sp").replace("+{n} ", ""), T.riftBright)}
      {coinChip(<CoinIc size={19} />, profile.gold || 0, t("army.balance"))}
      {coinChip(<CrestIc size={19} />, retinueScore(profile), t("online.score"))}
    </div>
  );
  const headerBar = (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
      <img src={emblemArt()} alt="Grand Gambit" style={{ height: 34, display: "block", flex: "0 0 auto",
        filter: "drop-shadow(0 0 5px rgba(139,92,246,.4)) drop-shadow(0 0 11px rgba(124,58,237,.22))" }} />
      <div style={{ flex: 1 }} />
      {currencyRow}
    </div>
  );

  if (wide) return (
    <div style={{ height: "calc(100dvh / var(--vhz, 1))", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
      padding: immersive ? "10px 10px 10px" : "16px 18px 0", rowGap: immersive ? 10 : 22 }}>
      {!immersive && <MysticBackground league={profile?.campaign?.league || 1} />}
      {/* DER RISSBODEN liegt unten fixiert hinter jedem Menue und waechst mit
          Hofwert und Kampagne (RissBoden.jsx). Im Kampf und in der Kartenwelt
          bleibt er fort - dort gehoert der Blick dem Brett bzw. der Karte. */}
      {!immersive && !inMatch && !(tab === "play" && view === "camp") && <RissBoden profile={profile} />}
      {(() => {
        // ── ERSTBESUCH-HERALD (v0.51): beim ersten Betreten eines Menues
        // stellt sich der Raum EINMAL vor - danach schweigt er fuer immer
        // (profile.gesehen). "Alle ueberspringen" bringt alle zum Schweigen.
        const ml = MENUE_LEHREN[profile?.lang === "en" ? "en" : "de"];
        const eintrag = ml && ml[tab];
        const zeigen = eintrag && ready && !showIntro && !showPrivacy && !inMatch && !(profile?.gesehen || {})[tab];
        if (!zeigen) return null;
        const merken = (alle) => dispatch({ type: "REPLACE", profile: { ...profile,
          gesehen: alle ? Object.fromEntries(Object.keys(ml).map((k) => [k, true]))
                        : { ...(profile.gesehen || {}), [tab]: true } } });
        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "grid", placeItems: "center",
            background: "rgba(8,10,14,.78)", backdropFilter: "blur(3px)", padding: 16 }}>
            <div style={{ background: `radial-gradient(125% 135% at 50% -10%, ${T.panel2} 0%, ${T.panel} 52%, ${T.bg2} 100%)`,
              border: `1.5px solid ${T.gold}66`, borderRadius: 16, padding: "18px 18px 14px", maxWidth: 420, width: "100%",
              boxShadow: "0 14px 44px rgba(0,0,0,.6)" }}>
              <div className="gg-serif" style={{ fontSize: 19, color: T.goldBright, letterSpacing: ".04em", marginBottom: 4 }}>{eintrag.titel}</div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "#cbbcf5", marginBottom: 8 }}>{eintrag.kurz}</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.62, color: T.text, marginBottom: 14 }}>{eintrag.text}</div>
              <button onClick={() => merken(false)} style={{ width: "100%", padding: "11px 14px", borderRadius: 12,
                border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 900, fontSize: 14.5, color: "#17110a",
                background: "linear-gradient(160deg, #f0d68a, #d9b565 55%, #b08c44)" }}>
                {profile?.lang === "en" ? "Got it" : "Verstanden"}</button>
              <button onClick={() => merken(true)} style={{ width: "100%", marginTop: 8, padding: "9px 14px", borderRadius: 12,
                border: `1px solid ${T.line}`, cursor: "pointer", fontFamily: "inherit", fontWeight: 800, fontSize: 12.5,
                color: T.dim, background: "transparent" }}>
                {profile?.lang === "en" ? "Skip all introductions" : "Alle Vorstellungen überspringen"}</button>
            </div>
          </div>
        );
      })()}
      {showPrivacy && <PrivacyNotice t={t} dispatch={dispatch} />}
      {showIntro && <GameIntro t={t} dispatch={dispatch} onStart={() => { setTab("play"); setView("hub"); }} />}
      {teach && <TeachPopup which={teach} t={t} dispatch={dispatch} />}
      {leaveTo && <LeaveMatchAsk t={t} resumable={!!match && !pvp}
        onStay={() => setLeaveTo(null)}
        onLeave={() => { setPvp(null); setMatch(null); setQuick(null); setDailyGame(null); setTab(leaveTo); setView("hub"); setLeaveTo(null); }} />}
      {(
        <aside style={{ width: "100%", maxWidth: 1020, position: "sticky", top: 12, zIndex: 7,
          background: "linear-gradient(180deg, rgba(60,38,110,.62) 0%, rgba(30,18,58,.66) 100%)",
          backdropFilter: `blur(${T.glassBlur})`, WebkitBackdropFilter: `blur(${T.glassBlur})`,
          border: "1px solid rgba(167,139,250,.5)", borderRadius: 20, padding: "10px 16px",
          boxShadow: `${T.shadow}, 0 0 16px rgba(124,58,237,.34), 0 0 34px rgba(124,58,237,.16)`,
          display: "flex", alignItems: "center", gap: 10 }}>
          <img src={emblemArt()} alt="Grand Gambit" style={{ height: 40, display: "block", flex: "0 0 auto", paddingRight: 6,
            filter: "drop-shadow(0 0 5px rgba(139,92,246,.4)) drop-shadow(0 0 11px rgba(124,58,237,.22))" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, flex: "1 1 auto", minWidth: 0 }}>{railItems}</div>
          {currencyRow}
        </aside>
      )}
      <main style={{ width: "100%", minWidth: 0, flex: "1 1 auto", minHeight: 0,
        overflowY: immersive ? "hidden" : "auto", overscrollBehavior: "none",
        // the fixed dock (~76px) + Safari's home-bar safe-area float OVER the
        // scroll area: without this reserve the last buttons (e.g. sign-out on
        // the profile) end up UNDER the dock, which then swallows the tap
        paddingBottom: immersive ? 0 : "calc(94px + env(safe-area-inset-bottom))",
        maxWidth: immersive ? "none" : 1020, // menus run as wide as the header bar
        ...(immersive ? { display: "flex", flexDirection: "column", flex: "1 1 auto", minHeight: 0 } : {}),
        ...(tab === "play" && view === "hub" && !inMatch && !immersive
          // DS1 Phase 6: nicht mehr vertikal zentriert - die Zentrierung
          // schob die Haelfte des Leerraums ZWISCHEN Kopfleiste und Karten
          // (gemessen: 67 px Luecke). Inhalt beginnt oben, der Rest der Buehne
          // gehoert dem MysticBackground.
          ? { display: "flex", flexDirection: "column", justifyContent: "flex-start", minHeight: "calc(100dvh / var(--vhz, 1) - 72px)" } : {}) }}>{screen}</main>
    </div>
  );

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", height: "calc(100dvh / var(--vhz, 1))", overflow: "hidden", display: "flex", flexDirection: "column",
      ...(immersive ? { maxWidth: "none" } : {}) }}>
      {(!immersive || mapView) && !inMatch && <MysticBackground league={profile?.campaign?.league || 1} />}
      {!immersive && !inMatch && <RissBoden profile={profile} />}
      {(() => {
        // ── ERSTBESUCH-HERALD (v0.51): beim ersten Betreten eines Menues
        // stellt sich der Raum EINMAL vor - danach schweigt er fuer immer
        // (profile.gesehen). "Alle ueberspringen" bringt alle zum Schweigen.
        const ml = MENUE_LEHREN[profile?.lang === "en" ? "en" : "de"];
        const eintrag = ml && ml[tab];
        const zeigen = eintrag && ready && !showIntro && !showPrivacy && !inMatch && !(profile?.gesehen || {})[tab];
        if (!zeigen) return null;
        const merken = (alle) => dispatch({ type: "REPLACE", profile: { ...profile,
          gesehen: alle ? Object.fromEntries(Object.keys(ml).map((k) => [k, true]))
                        : { ...(profile.gesehen || {}), [tab]: true } } });
        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "grid", placeItems: "center",
            background: "rgba(8,10,14,.78)", backdropFilter: "blur(3px)", padding: 16 }}>
            <div style={{ background: `radial-gradient(125% 135% at 50% -10%, ${T.panel2} 0%, ${T.panel} 52%, ${T.bg2} 100%)`,
              border: `1.5px solid ${T.gold}66`, borderRadius: 16, padding: "18px 18px 14px", maxWidth: 420, width: "100%",
              boxShadow: "0 14px 44px rgba(0,0,0,.6)" }}>
              <div className="gg-serif" style={{ fontSize: 19, color: T.goldBright, letterSpacing: ".04em", marginBottom: 4 }}>{eintrag.titel}</div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "#cbbcf5", marginBottom: 8 }}>{eintrag.kurz}</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.62, color: T.text, marginBottom: 14 }}>{eintrag.text}</div>
              <button onClick={() => merken(false)} style={{ width: "100%", padding: "11px 14px", borderRadius: 12,
                border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 900, fontSize: 14.5, color: "#17110a",
                background: "linear-gradient(160deg, #f0d68a, #d9b565 55%, #b08c44)" }}>
                {profile?.lang === "en" ? "Got it" : "Verstanden"}</button>
              <button onClick={() => merken(true)} style={{ width: "100%", marginTop: 8, padding: "9px 14px", borderRadius: 12,
                border: `1px solid ${T.line}`, cursor: "pointer", fontFamily: "inherit", fontWeight: 800, fontSize: 12.5,
                color: T.dim, background: "transparent" }}>
                {profile?.lang === "en" ? "Skip all introductions" : "Alle Vorstellungen überspringen"}</button>
            </div>
          </div>
        );
      })()}
      {showPrivacy && <PrivacyNotice t={t} dispatch={dispatch} />}
      {showIntro && <GameIntro t={t} dispatch={dispatch} onStart={() => { setTab("play"); setView("hub"); }} />}
      {teach && <TeachPopup which={teach} t={t} dispatch={dispatch} />}
      {leaveTo && <LeaveMatchAsk t={t} resumable={!!match && !pvp}
        onStay={() => setLeaveTo(null)}
        onLeave={() => { setPvp(null); setMatch(null); setQuick(null); setDailyGame(null); setTab(leaveTo); setView("hub"); setLeaveTo(null); }} />}
      {!immersive && (
        <header style={{ position: "sticky", top: 0, zIndex: 7, padding: "10px 10px 0" }}>
          {/* Die Ressourcen-PILLE der Vorlage: voll gerundet, violetter Glas-
              verlauf, duenne violette Kante. Fluchtlinie bleibt bei 10 px. */}
          <div style={{ background: "linear-gradient(90deg, rgba(58,36,110,.72) 0%, rgba(26,17,50,.78) 100%)",
            backdropFilter: `blur(${T.glassBlur})`, WebkitBackdropFilter: `blur(${T.glassBlur})`,
            border: "1px solid rgba(176,124,255,.4)", borderRadius: 999, padding: "10px 16px",
            boxShadow: `${T.shadow}, 0 0 16px rgba(122,60,255,.28)` }}>{headerBar}</div>
        </header>
      )}
      {/* ONE flush edge: header card, screen panels and dock all sit 10px from
          the viewport — before this, header ran at 10, dock at 12, content at
          14, three different alignments (the profile looked narrower than the
          menu). */}
      <main style={{ flex: 1, minHeight: 0, overflowY: immersive ? "hidden" : "auto", overflowX: "hidden", overscrollBehavior: "none", padding: immersive ? (mapView ? "0 6px calc(72px + env(safe-area-inset-bottom))" : "0 3px") : inMatch ? "8px 6px 12px" : "22px 10px 108px",
        ...(tab === "play" && view === "hub" && !inMatch && !immersive
          ? { display: "flex", flexDirection: "column", justifyContent: "flex-start" } : {}),
        ...(immersive ? { display: "flex", flexDirection: "column" } : {}) }}>{screen}</main>
      {/* die Melodie des Hauses - abschaltbar unter Profil */}
      <Soundtrack an={profile.sound !== false} />
      {!immersive && <InstallBanner en={profile.lang === "en"} />}
      {(!immersive || mapView) && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9,
          padding: "0 10px calc(10px + env(safe-area-inset-bottom))", pointerEvents: "none" }}>
          <div style={{ maxWidth: 540, margin: "0 auto", pointerEvents: "auto",
            background: "linear-gradient(180deg, rgba(60,38,110,.62) 0%, rgba(30,18,58,.66) 100%)",
            backdropFilter: `blur(${T.glassBlur})`, WebkitBackdropFilter: `blur(${T.glassBlur})`,
            border: "1px solid rgba(167,139,250,.42)", borderRadius: 22,
            boxShadow: "0 12px 32px rgba(0,0,0,.55), 0 0 18px rgba(124,58,237,.22)",
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


export function PlayHub({ profile, t, onQuick, onCamp, onOnline, onTutorial = null, hallenStand = false, onQuickStart = null }) {
  const en = profile.lang === "en";
  const hubWide = useMedia("(min-width: 900px)");
  const cur = nodeById(currentNodeId(profile));
  const done = clearedCount(profile), total = campaignLength(profile);
  const ch = chapterForRow(cur?.row || 0);
  const roman = ["I", "II", "III", "IV"][ch.n - 1];
  // WER NOCH NIE GESPIELT HAT, KANN NICHTS "FORTSETZEN". Der Knopf log den
  // Neuling an: keine geraeumte Station, kein ruhender Kampf, erstes Kapitel.
  const nieGespielt = done === 0 && !profile.pausedMatch && (profile.campaign?.league || 1) === 1;

  // laufende Fernpartien aus dem letzten Hallenbesuch - braucht keine Verbindung
  let fernpartien = [];
  try { fernpartien = JSON.parse(localStorage.getItem("gambit:u::daily:v1") || "[]"); } catch { fernpartien = []; }
  const amZug = fernpartien.filter((g) => g.yourTurn);

  // DIE KARTE ALS HUELLE: frueher war die ganze Karte EIN Knopf, deshalb
  // konnte nichts Anklickbares in ihr sitzen (Knoepfe in Knoepfen sind
  // ungueltig). Jetzt traegt eine Huelle das Aussehen, der Kopfbereich ist der
  // Knopf - und darunter ist Platz fuer eigene Griffe (die Fernpartien).
  // `ruhig`: der Gold-CTA ohne Glanzlauf. Im Hub laeuft der Glanz nur noch
  // auf der Kampagne (dem Hauptweg) - vorher glaenzten drei Knoepfe im Chor
  // (gemessen), und "dominant" verliert seinen Sinn, wenn es alle sind.
  // `bild`: die grosse Kachel traegt ein echtes Bild (Designleitsatz des
  // Besitzers, v0.48: "wenn wir mehr Flaeche haben, gehen wir in eine
  // ordentliche Bildsprache und erzaehlen die Geschichte"). Die Motive sitzen
  // rechts, die linke Textzone der Bilder ist nachgemessen fast schwarz
  // (L 0,9-1,6 von 255) - ein leiser Schleier von links sichert die Schrift
  // zusaetzlich, die Wappen-Grafik entfaellt auf diesen Karten.
  const Card = ({ title, sub, extra, body, cta, onGo, art, style, children, artTop = false, ruhig = false, bild = null }) => {
    const shineDelay = useShineDelay();
    return (
    <div style={{ background: bild
        // HALB SO GROSS, RECHTS UNTEN (Besitzer, v0.52): das Motiv sitzt als
        // kleines Bild in der Ecke (Hoehe ~52 % der Kachel), der Rest ist der
        // eigene schwarze Grund - die Assets sind dafuer eng aufs Motiv
        // beschnitten. Der Schleier von links sichert weiter die Schrift.
        ? `linear-gradient(90deg, rgba(10,9,16,.88) 0%, rgba(10,9,16,.45) 46%, rgba(10,9,16,0) 72%), url(${bild}) right bottom / auto 52% no-repeat, #0a0910`
        : `radial-gradient(125% 135% at 50% -10%, ${T.panel2} 0%, ${T.panel} 52%, ${T.bg2} 100%)`,
      border: `1px solid ${T.line}`, borderRadius: T.radius, boxShadow: T.shadow,
      position: "relative", overflow: "hidden", ...style }}>
      {/* GEMESSEN (v0.46): auf der Karte "Schnelles Spiel" ragte das Wappen
          oben 6 px und unten 2 px aus dem Kopf heraus - seit der CTA-Pille
          dort zwei eigene Griffe abgeloest haben, ist der Kopf kuerzer als
          das 84 px hohe Bild. Der Kopf haelt jetzt Mindesthoehe fuer sein
          Zeichen (84 + Polster). */}
      <button onClick={onGo} style={{ textAlign: "left", fontFamily: "inherit", cursor: "pointer", width: "100%",
        background: "none", border: "none", padding: "16px 16px 14px", display: "block", position: "relative",
        minHeight: art ? 114 : undefined }}>
        {/* Das Zeichen sitzt bei Karten MIT Fliesstext oben statt mittig - so
            laeuft der Fortschrittsbalken nicht mehr unter ihm hindurch. */}
        <div style={{ position: "absolute", right: 12, ...(artTop ? { top: 12 } : { top: "50%", transform: "translateY(-50%)" }),
          opacity: 0.95, filter: "drop-shadow(0 3px 6px rgba(0,0,0,.35))" }}>{art}</div>
        <div className="gg-display" style={{ fontSize: artTop ? 21 : 19, letterSpacing: ".04em", color: T.gold, paddingRight: 92 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: T.dim, marginTop: 4, paddingRight: 92 }}>{sub}</div>
        {/* Fliesstext: nimmt die volle Breite, KEINE absolute Ecke mehr -
            darum ueberlappt hier nichts mehr, egal wie lang der Ortsname ist. */}
        {body && <div style={{ marginTop: 12, fontSize: 12.5, color: T.text, paddingRight: 92 }}>{body}</div>}
        {/* Der Verbindungsstand sass in der rechten unteren Ecke - genau dort,
            wo das Wappen haengt (nachgemessen: 176 px2 Ueberschneidung). Er
            laeuft jetzt im Fliesstext mit, links unter dem Untertitel. */}
        {extra && <div style={{ marginTop: 7, fontSize: 12.5, color: T.text, paddingRight: 92 }}>{extra}</div>}
        {cta && <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, padding: "9px 16px",
          borderRadius: 999, position: "relative", overflow: "hidden", border: "1px solid rgba(255,240,200,.5)",
          background: GOLD_CTA,
          boxShadow: `0 0 12px ${T.gold}55`,
          color: "#17110a", fontWeight: 800, fontSize: 13.5 }}>
          {!ruhig && <span aria-hidden style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "46%", pointerEvents: "none",
            background: "linear-gradient(90deg, transparent, rgba(255,252,235,.4), transparent)",
            animation: `ggShine ${T.mo.sheen} linear ${shineDelay} infinite` }} />}
          <span style={{ position: "relative" }}>{cta} ›</span>
        </div>}
      </button>
      {children}
    </div>
  ); };
  return (
    <div style={{ display: "grid", gap: 12, gridTemplateColumns: hubWide ? "1fr 1fr" : "1fr" }}>
      {/* DER FELDZUG BEKOMMT DEN GROSSEN PLATZ: eigene Zeile ueber die volle
          Breite, groesserer Titel, der Balken laeuft unter dem Text durch
          statt unter dem Zeichen. */}
      <Card title={t("camp.title")} sub={t("hub.campSub")} onGo={onCamp} artTop
        cta={nieGespielt ? t("hub.newCampaign") : t("hub.continue")}
        body={nieGespielt
          ? <span style={{ color: T.dim }}>{t("hub.campFresh")}</span>
          : <>
          <span className="gg-serif" style={{ color: T.gold, letterSpacing: ".06em" }}>{t("camp.leagueNo", { r: ["I","II","III","IV","V"][(profile.campaign?.league || 1) - 1] || profile.campaign?.league })}</span> <span style={{ color: T.faint }}>·</span> <span className="gg-serif" style={{ color: T.dim, letterSpacing: ".06em" }}>{t("story.chapter", { r: roman })} · {en ? ch.titleEn : ch.titleDe}</span><br />
          <span className="gg-serif" style={{ color: T.gold, letterSpacing: ".04em" }}>{t("hub.station", { a: done, b: total })}</span> · {t("hub.nextStop")}: <b>{cur?.place}</b>
          <div style={{ marginTop: 8 }}><Bar pct={Math.max(done / Math.max(1, total), 0.02)} height={5} color={T.gold} /></div></>}
        bild={karteKampagne} art={null} style={{ gridColumn: "1 / -1" }} />
      <Card ruhig title={t("hub.quick")} sub={t("hub.quickSub")} onGo={onQuick} cta={null}
        bild={karteSchnell} art={null}>
        {/* SOFORT LOSLEGEN: ein Griff, keine Konfiguration - gestartet wird
            mit den letzten Einstellungen (oder den Hausvorgaben). "Anpassen"
            fuehrt auf den bisherigen Weg. Zwei ECHTE Knoepfe unterhalb des
            Kopfes, weil Knoepfe in Knoepfen ungueltig sind. */}
        {/* GLEICHE HOEHE wie die CTA-Pillen der Nachbarkacheln (9px/16px,
            13,5) - und "Anpassen" traegt das LILA AUSWAHL-GEWAND aus dem
            Profil: violetter Verlauf, leuchtende lila Kontur (T.sel-Familie
            der Segmented-Auswahl). */}
        <div style={{ display: "flex", gap: 8, padding: "0 16px 14px", marginTop: -2 }}>
          <GoldShineButton onClick={onQuickStart || onQuick} style={{ flex: "1 1 auto", padding: "9px 16px", fontSize: 13.5, borderRadius: 999 }}>
            {t("hub.playNow")} ›</GoldShineButton>
          <button onClick={onQuick} style={{ flex: "0 0 auto", padding: "9px 16px", fontSize: 13, borderRadius: 999,
            fontFamily: "inherit", fontWeight: 800, cursor: "pointer",
            border: `1px solid ${T.selLine}`, color: T.selInk,
            background: `linear-gradient(165deg, ${T.sel}, #1a1030)`,
            boxShadow: `0 0 10px ${T.selGlow}` }}>
            {t("hub.adjust")}</button>
        </div>
      </Card>
      <Card ruhig title={t("online.title")} sub={t("online.sub")} onGo={onOnline}
        cta={hallenStand ? (profile.lang === "en" ? "Play" : "Spielen") : t("online.connect")}
        extra={!SERVER_URL ? <Chip color={"#17110a"} bg={T.gold}>{t("hub.soon")}</Chip>
          : <span title={hallenStand ? (profile.lang === "en" ? "Connected" : "Verbunden")
              : (profile.lang === "en" ? "Not connected" : "Nicht verbunden")}
              style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700,
                letterSpacing: ".05em", color: hallenStand ? "#9fe8b4" : T.faint }}>
              <span aria-hidden style={{ width: 8, height: 8, borderRadius: "50%",
                background: hallenStand ? "#5ad48a" : "rgba(150,150,170,.5)",
                boxShadow: hallenStand ? "0 0 8px #5ad48a" : "none" }} />
              {hallenStand ? (profile.lang === "en" ? "online" : "verbunden")
                : (profile.lang === "en" ? "offline" : "offline")}
            </span>}
        bild={karteOnline} art={null}>
        {/* DIE FERNPARTIEN STEHEN JETZT IN DER KARTE SELBST. Vorher lagen sie
            als eigener Block zwischen den Karten - der Besitzer wollte sie
            dort sehen, wo das Fernduell wohnt. Ein Griff je Partie. */}
        {fernpartien.length > 0 && (
          <div style={{ borderTop: `1px solid ${T.line}`, padding: "10px 12px 12px", display: "grid", gap: 7 }}>
            <div className="gg-serif" style={{ fontSize: 11.5, letterSpacing: ".13em", color: T.gold, textTransform: "uppercase" }}>
              {t("daily.title")}{amZug.length > 0 ? ` \u00b7 ${amZug.length}\u00d7 ${en ? "your move" : "du bist dran"}` : ""}
            </div>
            <div style={{ display: "grid", gap: 6, gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
              {[...amZug, ...fernpartien.filter((g) => !g.yourTurn)].slice(0, 4).map((g) => {
                const tage = g.deadline ? Math.max(0, Math.ceil((g.deadline - Date.now()) / 86400000)) : null;
                return <button key={g.gameId} onClick={() => onOnline && onOnline(g.gameId)}
                  style={{ display: "flex", alignItems: "center", gap: 9, textAlign: "left", cursor: "pointer",
                    fontFamily: "inherit", padding: "10px 12px", borderRadius: 12,
                    background: g.yourTurn ? "linear-gradient(150deg, rgba(139,92,246,.3), rgba(12,10,22,.9) 62%)"
                      : "linear-gradient(150deg, rgba(30,26,44,.55), rgba(10,9,16,.8))",
                    border: `1px solid ${g.yourTurn ? T.riftLine : "rgba(120,110,150,.3)"}`,
                    boxShadow: g.yourTurn ? "0 0 12px rgba(124,58,237,.3)" : "none" }}>
                  <span aria-hidden style={{ width: 9, height: 9, borderRadius: "50%", flex: "0 0 auto",
                    background: g.yourTurn ? T.riftBright : "rgba(150,145,180,.45)",
                    boxShadow: g.yourTurn ? `0 0 9px ${T.riftBright}` : "none" }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="gg-quill" style={{ display: "block", fontSize: 14, color: T.text,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.opp}</span>
                    <span style={{ display: "block", fontSize: 11, color: g.yourTurn ? T.riftBright : T.faint }}>
                      {g.yourTurn ? (en ? "your move" : "du bist dran") : (en ? "waiting" : "wartet auf ihn")}
                      {tage != null ? ` \u00b7 ${tage}\u202fd` : ""}
                    </span>
                  </span>
                </button>;
              })}
            </div>
          </div>
        )}
      </Card>
      {onTutorial && (
        <button onClick={onTutorial} style={{ gridColumn: "1 / -1", textAlign: "center", fontFamily: "inherit",
                    cursor: "pointer", background: "linear-gradient(170deg, #594684, #3a2c59)",
          // Die Akademie war nicht mehr zu sehen (Besitzer, v0.47): ihre Kante
          // stand bei 27 % Deckkraft (#8a6d3544) auf einer ohnehin fast
          // schwarzen Flaeche - gemessen lag die Karte bei Helligkeit 27 auf
          // einem Grund von 24. Sie bleibt SEKUNDAER (kein Gold-CTA, kein
          // Glanz), bekommt aber eine sichtbare Kante und eine eigene Flaeche.
          // NACHGERECHNET (v0.47): die Kur von v0.46.1 reichte nicht - Flaeche
          // gegen Grund 1,57:1, Goldkante gegen Flaeche 2,39:1 (unter dem
          // 3:1-Minimum fuer Nicht-Text). Violett 20 % heller im gleichen Ton
          // und Kante auf 60 % ergibt 1,93:1 bzw. 3,14:1; Text bleibt 8,08:1.
          border: `1px solid ${T.gold}99`, borderRadius: T.radius,
          boxShadow: T.shadow,
          padding: "13px 14px 14px", color: T.text, fontSize: 13 }}>
          {/* line one: the title, a touch smaller, flanked by the twin diamonds */}
          <span style={{ display: "block" }}>
            <span aria-hidden style={{ display: "inline-block", width: 5, height: 5, background: "#d9b565",
              transform: "rotate(45deg)", verticalAlign: "2px", marginRight: 10 }} />
            <span className="gg-serif" style={{ color: T.gold, letterSpacing: ".08em", fontSize: 13.5 }}>{t("tut.title")}</span>
            <span aria-hidden style={{ display: "inline-block", width: 5, height: 5, background: "#d9b565",
              transform: "rotate(45deg)", verticalAlign: "2px", marginLeft: 10 }} />
          </span>
          {/* line two: what awaits, quiet underneath */}
          <span style={{ display: "block", marginTop: 4, fontSize: 12.5 }}>{t("tut.sub")}</span>
        </button>
      )}
    </div>
  );
}

function Lock({ t, profile, onUnlock, onBack }) {
  const [pin, setPin] = useState("");
  const [wrong, setWrong] = useState(false);
  async function tryUnlock() {
    if (await verifyPin(pin, profile.pin)) onUnlock();
    else { setWrong(true); setPin(""); }
  }
  return <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 20 }}>
    <Panel style={{ width: "100%", maxWidth: 320, textAlign: "center" }}>
      <div style={{ display: "grid", placeItems: "center", marginBottom: 8 }}><LockIc size={34} color={"#d9b264"} /></div>
      <div style={{ fontWeight: 800, marginBottom: 14 }}>{t("lock.title")}</div>
      <input autoFocus value={pin} type="password" placeholder={t("lock.enter")}
        onChange={(e) => { setWrong(false); setPin(e.target.value.slice(0, 64)); }}
        onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
        style={{ width: "100%", textAlign: "center", letterSpacing: 2, background: T.bg2, border: `1px solid ${wrong ? T.danger : T.line}`, borderRadius: 10, color: T.text, padding: "12px", fontSize: 18, outline: "none", marginBottom: 10 }} />
      {wrong && <div style={{ color: T.danger, fontSize: 13, marginBottom: 10 }}>{t("lock.wrong")}</div>}
      <Button style={{ width: "100%" }} onClick={tryUnlock} disabled={pin.length < 4}>{t("lock.unlock")}</Button>
      {onBack && <button onClick={onBack} className="gg-serif" style={{ background: "none", border: "none",
        color: T.dim, textDecoration: "underline", fontFamily: "inherit", fontSize: 13, cursor: "pointer",
        marginTop: 12, padding: 4 }}>{t("lock.back")}</button>}
    </Panel>
  </div>;
}


// ── first-run game intro (once): what Grand Gambit IS and what makes it
// special — a parchment card in the world's own voice. ───────────────────────
export function GameIntro({ t, dispatch, onStart }) {
  const [style, setStyle] = useState("svg");        // crisp shapes read best for a newcomer
  const [diff, setDiff] = useState("easy");
  const pick = (on) => ({ flex: 1, padding: "9px 6px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
    fontWeight: 800, fontSize: 12.5, letterSpacing: ".02em",
    background: on ? "linear-gradient(165deg, #e0b76c, #b78d43)" : "transparent",
    border: `1px solid ${on ? "rgba(255,240,200,.55)" : T.line}`, color: on ? "#17110a" : T.dim });
  // Dark and quiet like the privacy notice before it — night blue, gold serif,
  // drawn glyphs. The parchment look stays on the campaign map where it lives.
  const Row = ({ icon, children }) => (
    <div style={{ display: "flex", gap: 11, alignItems: "flex-start", textAlign: "left" }}>
      <span style={{ width: 24, display: "grid", placeItems: "center", flex: "0 0 auto", paddingTop: 1 }}>{icon}</span>
      <span style={{ fontSize: 13, lineHeight: 1.55, color: T.dim }}>{children}</span>
    </div>
  );
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "grid", placeItems: "center",
      background: "rgba(8,10,14,.8)", backdropFilter: "blur(3px)", padding: 18 }}>
      <div style={{ width: "100%", maxWidth: 420, background: `radial-gradient(125% 135% at 50% -10%, ${T.panel2} 0%, ${T.panel} 52%, ${T.bg2} 100%)`,
        border: `1px solid ${T.gold}66`, borderRadius: 16, boxShadow: "0 18px 50px rgba(0,0,0,.6)",
        padding: "22px 20px 18px", textAlign: "center",
        maxHeight: "calc(100dvh - 36px)", overflowY: "auto" }}>
        <div className="gg-serif" style={{ fontSize: 21, letterSpacing: ".05em", color: T.goldBright }}>{t("intro.title")}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0" }}>
          <span style={{ flex: 1, height: 1, background: `${T.gold}44` }} />
          <span style={{ width: 6, height: 6, background: T.gold, transform: "rotate(45deg)" }} />
          <span style={{ flex: 1, height: 1, background: `${T.gold}44` }} />
        </div>
        <div className="gg-serif" style={{ fontSize: 13.5, fontStyle: "italic", lineHeight: 1.55, color: T.dim }}>{t("intro.lead")}</div>
        <div style={{ display: "grid", gap: 11, margin: "15px 0 4px" }}>
          <Row icon={<JewelIc kind="life" size={17} />}>{t("intro.p1")}</Row>
          <Row icon={<SkillIc size={17} />}>{t("intro.p2")}</Row>
          <Row icon={<MapPinIc size={17} />}>{t("intro.p3")}</Row>
        </div>
        {/* THE TWO CHOICES, ASKED ONCE AND UP FRONT: which figures you want to
            look at, and how hard the opponent should think. Both were buried in
            the profile screen, where a new player never looks. Both stay
            changeable there — the note says so, so nobody feels locked in. */}
        <div style={{ marginTop: 16, textAlign: "left" }}>
          <div className="gg-serif" style={{ fontSize: 12, letterSpacing: ".12em", color: T.gold }}>{t("setup.style").toUpperCase()}</div>
          <div style={{ display: "flex", gap: 8, margin: "7px 0 4px" }}>
            {[["svg", t("profile.styleSvg")], ["painted", t("profile.stylePainted")]].map(([v, label]) => (
              <button key={v} onClick={() => setStyle(v)} style={pick(style === v)}>{label}</button>
            ))}
          </div>
          <div style={{ fontSize: 11.5, color: T.faint, lineHeight: 1.45 }}>{t("setup.styleHint")}</div>

          <div className="gg-serif" style={{ fontSize: 12, letterSpacing: ".12em", color: T.gold, marginTop: 14 }}>{t("setup.diff").toUpperCase()}</div>
          <div style={{ display: "flex", gap: 8, margin: "7px 0 4px" }}>
            {[["easy", t("diff.easy")], ["normal", t("diff.normal")], ["hard", t("diff.hard")]].map(([v, label]) => (
              <button key={v} onClick={() => setDiff(v)} style={pick(diff === v)}>{label}</button>
            ))}
          </div>
          <div style={{ fontSize: 11.5, color: T.faint, lineHeight: 1.45 }}>{t("setup.diffHint")}</div>
          <div style={{ fontSize: 11.5, color: T.dim, lineHeight: 1.45, marginTop: 12 }}>{t("setup.lead")}</div>
        </div>
        <button onClick={() => {
            dispatch({ type: "SET_PIECE_STYLE", style });
            dispatch({ type: "SET_DIFFICULTY", difficulty: diff });
            dispatch({ type: "SET_NOTICE", key: "intro" }); onStart && onStart();
          }}
          style={{ marginTop: 15, width: "100%", padding: "12px 14px", borderRadius: 10,
            background: "linear-gradient(165deg, #e0b76c, #b78d43)", border: "1px solid rgba(255,240,200,.5)",
            color: "#17110a", fontWeight: 800, fontSize: 14.5, fontFamily: "inherit",
            cursor: "pointer", letterSpacing: ".04em" }}>{t("setup.go")} ›</button>
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

// ── ONBOARDING: three one-time lessons that ride the natural progression ──
function pendingTeach(profile) {
  if (!profile) return null;
  const n = profile.notices || {};
  const cleared = clearedCount(profile);
  const hasExtra = CHARACTER_LIST.some((c) => c.kind !== "P" && c.unlock?.type !== "start" && isUnlocked(c, profile));
  if (hasExtra && !n.teachFormation) return "teachFormation";
  if (cleared >= 2 && !n.teachGambitXp) return "teachGambitXp";
  if (cleared >= 3 && !n.teachGambitPos) return "teachGambitPos";
  return null;
}
function TeachPopup({ which, t, dispatch }) {
  const map = { teachFormation: ["teach.formationTitle", "teach.formationBody"],
    teachGambitXp: ["teach.gambitXpTitle", "teach.gambitXpBody"],
    teachGambitPos: ["teach.gambitPosTitle", "teach.gambitPosBody"] };
  const [tk, bk] = map[which];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 62, display: "grid", placeItems: "center",
      background: "rgba(8,10,14,.8)", backdropFilter: "blur(3px)", padding: 18 }}>
      <div style={{ width: "100%", maxWidth: 400, background: T.panel, border: `1px solid ${T.gold}77`,
        borderRadius: T.radius, boxShadow: "0 18px 50px rgba(0,0,0,.6)", padding: "20px 18px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, background: T.gold, transform: "rotate(45deg)", flex: "0 0 auto" }} />
          <div className="gg-serif" style={{ fontSize: 18.5, color: T.gold, letterSpacing: ".04em" }}>{t(tk)}</div>
        </div>
        <div style={{ fontSize: 13.5, color: T.dim, lineHeight: 1.6, margin: "8px 0 14px" }}>{t(bk)}</div>
        <button onClick={() => dispatch({ type: "SET_NOTICE", key: which })}
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10,
            background: "linear-gradient(165deg, #e0b76c, #b78d43)", border: "1px solid rgba(255,240,200,.5)",
            color: "#17110a", fontWeight: 800, fontSize: 14.5, fontFamily: "inherit", cursor: "pointer", letterSpacing: ".04em" }}>
          {t("teach.ok")} ›</button>
      </div>
    </div>
  );
}
