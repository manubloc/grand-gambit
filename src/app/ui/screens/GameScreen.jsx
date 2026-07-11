import { useEffect, useMemo, useRef, useState } from "react";
import { WHITE, BLACK, createGame, reduce, moveCommand, potionCommand, status, undo, encodeState, decodeState } from "../../../core/index.js";
import { difficultyById, mapById, MAPS, campaignTag, chapterForRow, CHARACTERS as CHARACTERS_BY_ID } from "../../../content/index.js";
import { buildArmy, buildAiArmyForMap, buildArmyFromFormation, applyResult, summarizeMatch, mapUnlocked, hpUnlocked, winGold } from "../../../meta/index.js";
import { chooseMove } from "../../../ai/index.js";
import { T } from "../theme.js";
import { stateHash } from "../../../platform/net.web.js";
import { Button, Panel, Segmented, Chip, FieldLabel, MapChip } from "../primitives.jsx";
import { BoardView } from "../board/BoardView.jsx";
import { SkillStar, GoldCoin, SkullIc, BladesIc, LockIc, FlagIc, HourglassIc } from "../icons.jsx";
import { ItemIcon } from "../ItemIcon.jsx";
import texWear1 from "../assets/tex-wear-1.webp";
import texWear2 from "../assets/tex-wear-2.webp";
import texWear3 from "../assets/tex-wear-3.webp";

// The board's material ages with the journey: leagues I–IV play on cared-for
// wood, V–VII on well-used boards, VIII–X on veterans full of scars. Quick
// play, hotseat and pvp keep the pristine one.
const WEAR_TEX = [texWear1, texWear2, texWear3];
const boardTexture = (campaign, profile) => {
  if (!campaign) return WEAR_TEX[0];
  const lg = profile?.campaign?.league || 1;
  return WEAR_TEX[lg >= 8 ? 2 : lg >= 5 ? 1 : 0];
};
import { PieceGlyph } from "../board/PieceGlyph.jsx";

function Tray({ kinds, color }) {
  if (!kinds.length) return <span style={{ color: T.faint, fontSize: 13 }}>—</span>;
  return <span style={{ display: "inline-flex", flexWrap: "wrap", fontSize: 18, lineHeight: 1 }}>
    {kinds.map((k, i) => <span key={i} style={{ width: "1em", height: "1em", display: "inline-grid" }}><PieceGlyph piece={{ kind: k, color, level: 1, abilities: [], used: {}, shield: 0 }} /></span>)}
  </span>;
}

// Total HP and total attack power per side — the at-a-glance force balance.
function forces(board) {
  const f = { w: { hp: 0, atk: 0 }, b: { hp: 0, atk: 0 } };
  for (const p of board) if (p) { const s = f[p.color]; s.hp += p.hp || 0; s.atk += p.atk || 0; }
  return f;
}
function ForceBadge({ hp, atk, neon, t }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "3px 9px", borderRadius: 999,
      background: "rgba(8,6,15,.55)", border: `1px solid ${neon}66`, boxShadow: `0 0 10px ${neon}30`, fontSize: 12, fontWeight: 900, whiteSpace: "nowrap" }}>
      <span style={{ color: neon }}>♥ {hp}</span>
      <span style={{ width: 1, height: 11, background: `${neon}55` }} />
      <span style={{ color: neon }} title={t("game.power")}>⚔ {atk}</span>
    </span>
  );
}

// The floating pill style shared by ‹ Back and ⚑ Resign (same shape, the
// resign just wears a slightly different tone — exactly as requested).
const pill = (extra) => ({ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer",
  background: "#0d1017d9", borderRadius: 999, padding: "8px 13px", fontFamily: "inherit", fontWeight: 800,
  fontSize: 13, boxShadow: "0 3px 10px rgba(0,0,0,.4)", whiteSpace: "nowrap", flex: "0 0 auto",
  backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", ...extra });

export function GameScreen({ profile, dispatch, t, match = null, onExit = null, pvp = null, quick = null }) {
  const campaign = !!match;
  const en = profile.lang === "en";
  const hotseat = !pvp && !match && !!quick?.hotseat;   // two players, one device
  const myColor = pvp && pvp.color === "b" ? BLACK : WHITE;
  const oppColor = myColor === WHITE ? BLACK : WHITE;
  // Match settings are decided BEFORE the match (QuickSetup / campaign node /
  // pvp lobby) — in here they are fixed; the screen is the board, nothing else.
  const difficulty = quick?.difficulty || profile.difficulty || "easy";
  const mapId = quick?.mapId || "classic";
  const mode = quick?.mode || "chess";
  const map = pvp ? mapById(pvp.mapId) : campaign ? mapById(match.map) : mapById(mapId);
  const rules = pvp ? "hp" : campaign ? match.rules : mode;
  const depth = campaign ? match.depth : difficultyById(difficulty).depth;
  const playerArmy = useMemo(() => buildArmy(profile, map, campaign ? match.excludeId : null), [profile, map]); // eslint-disable-line
  const freshSeed = () => (Date.now() ^ ((Math.random() * 0x7fffffff) | 0)) >>> 0;

  // ── pause & resume (v0.19): a campaign match interrupted mid-fight waits in
  // the profile (compact snapshot via the codec, history dropped) and picks up
  // exactly where it stood — board, potions, clock and burned time-turners.
  const resume = campaign && !pvp && profile.pausedMatch?.v === 1
    && profile.pausedMatch.nodeId === match.nodeId ? profile.pausedMatch : null;
  const [state, setState] = useState(() => {
    if (resume) { try { return decodeState(resume.enc); } catch { /* corrupt → fresh */ } }
    if (pvp) {
      const white = myColor === WHITE ? playerArmy : pvp.oppArmy;
      const black = myColor === WHITE ? pvp.oppArmy : playerArmy;
      return createGame(white, black, { map, rules, seed: pvp.seed >>> 0 });
    }
    const seed = freshSeed();
    if (hotseat) {
      const side = () => buildArmyFromFormation(() => 1, map.defaultFormation);
      return createGame(side(), side(), { map, rules, seed });
    }
    const ai = campaign ? match.aiArmy : buildAiArmyForMap(difficulty, map, seed);
    return createGame(playerArmy, ai, { map, rules, seed, potions: rules === "hp" ? { w: profile.items?.potion || 0, b: 0 } : undefined });
  });
  const [desync, setDesync] = useState(false);
  const [potionArm, setPotionArm] = useState(false);
  const potionsUsedRef = useRef(resume?.potionsUsed || 0);
  const hourglassUsedRef = useRef(resume?.hourglassUsed || 0);   // time-turners burned this match
  function usePotion(i) {
    setPotionArm(false);
    setState((s) => {
      const r = reduce(s, potionCommand(WHITE, i));
      if (r.state !== s) potionsUsedRef.current++;
      return r.state;
    });
  }
  const [rated, setRated] = useState(null);          // { rating, delta } after a pvp match
  const [rematch, setRematch] = useState("");        // "" | "wait" | "offer"
  const [banner, setBanner] = useState(null);
  const [intro, setIntro] = useState(() => !resume && !!(match && match.node && (match.node.storyDe || match.node.storyEn)));
  const [thinking, setThinking] = useState(false);
  const finished = useRef(false);

  // ── the stage clock (v0.4): some campaign stages from league 5 carry time
  // pressure — a total budget (bosses) or a per-move limit (hard stages).
  // The clock only runs on YOUR move and pauses for story intro and banner;
  // hitting zero flags the game, chess-style.
  const timer = campaign ? match.timer : null;
  const [clock, setClock] = useState(resume?.clock ?? (timer ? timer.seconds : null));
  useEffect(() => {
    if (timer?.type === "move" && state.turn === myColor) setClock(timer.seconds);
  }, [state, timer, myColor]);
  useEffect(() => {
    if (!timer || clock == null || banner || intro || state.turn !== myColor) return;
    const id = setInterval(() => setClock((c) => (c == null ? c : c - 1)), 1000);
    return () => clearInterval(id);
  }, [timer, state.turn, myColor, banner, intro]); // eslint-disable-line
  useEffect(() => {
    if (timer && clock != null && clock <= 0 && !finished.current) finish("loss", "time");
  }, [clock]); // eslint-disable-line

  function reset(diff, m = map, rl = rules) {
    finished.current = false;
    setBanner(null);
    setThinking(false);
    setClock(timer ? timer.seconds : null);
    const seed = freshSeed();
    if (hotseat) {
      const side = () => buildArmyFromFormation(() => 1, m.defaultFormation);
      setState(createGame(side(), side(), { map: m, rules: rl, seed }));
      return;
    }
    const ai = campaign ? match.aiArmy : buildAiArmyForMap(diff, m, seed);
    setState(createGame(buildArmy(profile, m, campaign ? match.excludeId : null), ai, { map: m, rules: rl, seed }));
  }
  function newGame() { reset(difficulty); }

  // End of game → derive the result purely from the command log (event-sourced).
  function finish(result, reason) {
    if (finished.current) return;
    finished.current = true;
    if (hotseat) {
      setBanner({ result, reason, hotseat: true,
        gained: { gold: 0, sp: 0, xp: 0, levelBefore: 0, levelAfter: 0, newAchievements: [] } });
      return;
    }
    const foe = pvp ? pvp.oppArmy : campaign ? match.aiArmy : buildAiArmyForMap(difficulty, map, state.seed);
    const summary = summarizeMatch(playerArmy, foe, state.seed, state.log, result, myColor, { map, rules });
    summary.hpRules = rules === "hp";
    summary.potionsUsed = potionsUsedRef.current;
    summary.hourglassUsed = hourglassUsedRef.current;
    summary.resigned = reason === "resign" && result === "loss";
    // The purse (v0.5): every win pays gold — stages carry their own reward
    // (bosses more, replays half), free play scales with difficulty.
    summary.gold = result !== "win" ? 0
      : campaign ? (match.firstClear ? (match.gold || 0) : Math.round((match.gold || 0) / 2))
      : pvp ? 6
      : winGold(difficulty);
    const { profile: next, gained } = applyResult(profile, summary);
    if (campaign && next.pausedMatch?.nodeId === match.nodeId) next.pausedMatch = null;
    dispatch({ type: "REPLACE", profile: next });
    if (campaign && result === "win") {
      dispatch({ type: "RECORD_STAGE", id: match.nodeId, moves: summary.moveCount || 0 });
      dispatch({ type: "CAMPAIGN_CLEAR", id: match.nodeId });
    }
    if (pvp && reason !== "resign" && reason !== "left") {
      const winner = result === "draw" ? "draw" : result === "win" ? pvp.color : (pvp.color === "w" ? "b" : "w");
      pvp.net.send({ t: "result", matchId: pvp.matchId, winner });
    }
    setBanner({ result, gained, reason });
  }

  // Advance the simulation with a single command (player or AI move).
  function play(move) {
    setState((s) => {
      const cmd = moveCommand(move);
      const next = reduce(s, cmd).state;
      if (pvp) pvp.net.send({ t: "cmd", matchId: pvp.matchId, cmd, n: next.log.length, hash: stateHash(encodeState(next)) });
      return next;
    });
  }

  // Drive the AI and detect terminal positions after every committed state.
  useEffect(() => {
    if (finished.current) return;
    const st = status(state);
    if (st.over) {
      if (st.winner === myColor) finish("win", st.result);
      else if (st.winner === oppColor) finish("loss", st.result);
      else finish("draw", st.result);
      return;
    }
    if (!pvp && !hotseat && state.turn === BLACK) {
      setThinking(true);
      const id = setTimeout(() => {
        const mv = chooseMove(state, depth);
        setThinking(false);
        if (mv) play(mv);
      }, 260);
      return () => clearTimeout(id);
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  // PvP: apply the opponent's relayed commands; verify determinism via hashes.
  useEffect(() => {
    if (!pvp) return;
    const u1 = pvp.net.on("cmd", (m) => {
      setState((s) => {
        const next = reduce(s, m.cmd).state;
        if (m.hash && stateHash(encodeState(next)) !== m.hash) setDesync(true);
        return next;
      });
    });
    const u2 = pvp.net.on("oppResign", () => finish("win", "resign"));
    const u3 = pvp.net.on("oppLeft", () => finish("win", "left"));
    const u4 = pvp.net.on("rated", (m) => { setRated(m); dispatch({ type: "SET_ONLINE", online: { rating: m.rating } }); });
    const u5 = pvp.net.on("rematchOffer", () => setRematch((r) => (r === "wait" ? r : "offer")));
    return () => { u1(); u2(); u3(); u4(); u5(); };
  }, [pvp, state.seed]); // eslint-disable-line

  // Undo is no free lunch anymore (v0.19): each take-back burns a
  // Time-turner from the supply chest — bought with gold, capped at 2.
  const hourglassLeft = Math.max(0, (profile.items?.hourglass || 0) - hourglassUsedRef.current);
  function doUndo() {
    if (finished.current || pvp || hourglassLeft <= 0) return;
    setState((s) => {
      let n = undo(s);
      if (n === s) return s;
      if (n.turn === BLACK) { const m = undo(n); if (m !== n) n = m; }
      hourglassUsedRef.current++;
      return n;
    });
  }
  const [armResign, setArmResign] = useState(false); // one tap arms, the second concedes
  useEffect(() => {
    if (!armResign) return;
    const id = setTimeout(() => setArmResign(false), 3500);
    return () => clearTimeout(id);
  }, [armResign]);
  function resign() {
    if (pvp) pvp.net.send({ t: "resign" });
    if (hotseat) { finish(state.turn === WHITE ? "loss" : "win", "resign"); return; }
    finish("loss", "resign");
  }

  // Leaving mid-fight pauses instead of forfeiting: snapshot into the profile.
  const pauseRef = useRef(null);
  pauseRef.current = { state, clock };
  function pauseNow() {
    if (!campaign || pvp || finished.current) return;
    const cur = pauseRef.current;
    dispatch({ type: "PAUSE_MATCH", data: { v: 1, nodeId: match.nodeId, enc: encodeState(cur.state),
      potionsUsed: potionsUsedRef.current, hourglassUsed: hourglassUsedRef.current, clock: cur.clock } });
  }
  function leave() { pauseNow(); onExit && onExit(); }
  useEffect(() => {
    if (!campaign || pvp) return;
    const fn = () => { if (document.visibilityState === "hidden") pauseNow(); };
    document.addEventListener("visibilitychange", fn);
    return () => document.removeEventListener("visibilitychange", fn);
  }, []); // eslint-disable-line

  const hsFlip = quick?.hotseatFlip !== false;        // optional: keep the board fixed (phone stays in hand)
  const viewColor = hotseat ? (hsFlip ? state.turn : WHITE) : myColor; // the board faces whoever moves
  const myTurn = (hotseat ? true : state.turn === myColor) && !banner;
  const st = status(state);
  const hpMode = state.rules === "hp";
  const F = hpMode ? forces(state.board) : null;
  const statusText = banner ? "" : st.check ? t("game.check") : hotseat ? t(state.turn === WHITE ? "hs.turnWhite" : "hs.turnBlack") : myTurn ? t("game.turnYou") : pvp ? t("online.turnOpp") : t("game.turnAi");
  const clockLbl = clock != null ? `${Math.floor(Math.max(0, clock) / 60)}:${String(Math.max(0, clock) % 60).padStart(2, "0")}` : null;
  const clockHot = clock != null && (timer?.type === "move" ? clock <= 5 : clock <= 30);

  return (
    <div style={{ position: "relative", overflow: "hidden", flex: "1 1 auto", minHeight: 0, height: "100%",
      display: "flex", flexDirection: "column" }}>
      {/* top bar: ‹ back · context · clock · ⚑ resign — everything floats, nothing scrolls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 10px 6px", flex: "0 0 auto" }}>
        {onExit && (
          <button onClick={leave} style={pill({ border: `1.5px solid ${T.gold}88`, color: T.gold })}>
            <span style={{ fontSize: 15, lineHeight: 1 }}>‹</span> {t("common.back")}
          </button>
        )}
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, overflow: "hidden" }}>
          {pvp ? <>
              <Chip color={T.gold} bg={T.panel}><BladesIc color={T.gold} size={12} /> {pvp.oppName}</Chip>
              <Chip color={T.dim} bg={T.panel}>{pvp.oppScore}</Chip>
              {desync && <Chip color={"#b4636c"} bg={T.panel}>{t("online.desync")}</Chip>}
            </>
            : campaign ? <>
              <Chip color={T.gold} bg={T.panel} style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", display: "inline-block", lineHeight: "17px" }}>{campaignTag(match.node, en)}</Chip>
              {match.boss && <Chip color={match.boss.bossId?.startsWith("pb_") ? T.gold : "#b4636c"} bg={T.panel}>{match.boss.bossId?.startsWith("pb_") ? <BladesIc color={T.gold} size={12} /> : <SkullIc color="#b4636c" size={12} />} {en ? match.boss.nameEn : match.boss.nameDe}</Chip>}
            </>
            : hotseat ? <Chip color={T.text} bg={T.panel}>{t("quick.hotseat")}</Chip>
            : <Chip color={T.text} bg={T.panel}>{t("game.ai")} · {t("diff." + difficulty)}</Chip>}
        </div>
        {clockLbl && (
          <span className="gg-serif" style={pill({ cursor: "default",
            border: `1.5px solid ${T.gold}${clockHot ? "cc" : "55"}`, color: clockHot ? T.goldBright : T.gold,
            letterSpacing: ".06em", fontSize: 14, gap: 5 })}><HourglassIc size={14} color={clockHot ? T.goldBright : T.gold} /> {clockLbl}</span>
        )}
        {armResign ? (
          <span style={pill({ cursor: "default", border: `1.5px solid ${T.gold}`, color: T.goldBright, gap: 9,
            animation: "ggGlow 1.6s ease-in-out infinite" })}>
            {t("game.confirmResign")}
            <span onClick={resign} style={{ cursor: "pointer", fontWeight: 900, padding: "0 2px" }}>✓</span>
            <span onClick={() => setArmResign(false)} style={{ cursor: "pointer", opacity: 0.75, padding: "0 2px" }}>✕</span>
          </span>
        ) : (
          <button onClick={() => setArmResign(true)} disabled={!!banner || !!intro}
            style={pill({ border: `1.5px solid ${T.gold}66`, color: T.dim, opacity: banner || intro ? 0.5 : 1,
              cursor: banner || intro ? "default" : "pointer" })}>
            <FlagIc size={13} /> {t("game.resign")}
          </button>
        )}
      </div>

      {/* enemy strip */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", minHeight: 24, flex: "0 0 auto" }}>
        {hpMode && <ForceBadge hp={F.b.hp} atk={F.b.atk} neon={T.magenta} t={t} />}
        <div style={{ flex: 1 }} />
        <Tray kinds={state.captured.b} color="w" />
      </div>

      {/* THE BOARD — fixed viewport, fills all remaining space, never scrolls */}
      <div style={{ flex: "1 1 auto", minHeight: 0, position: "relative", margin: "4px 10px" }}>
        <BoardView state={state} onMove={play} interactive={myTurn} lastMove={state.lastMove} animateFor={hotseat ? null : oppColor}
          flip={viewColor === BLACK} theme={map.theme} fitBox pick={potionArm ? WHITE : null} onPick={usePotion} pov={viewColor}
          texture={boardTexture(campaign, profile)} />
        {potionArm && <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", zIndex: 4,
          background: "#0d1017ee", border: `1px solid ${T.gold}`, color: T.gold, fontSize: 12.5, fontWeight: 800,
          borderRadius: 999, padding: "6px 14px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6 }}><ItemIcon id="potion" size={14} /> {t("game.potionPick")} · <span onClick={() => setPotionArm(false)} style={{ cursor: "pointer", textDecoration: "underline" }}>{t("online.cancel")}</span></div>}
        {intro && !banner && <StoryIntro node={match.node} boss={match.boss} t={t} en={profile.lang === "en"} onBegin={() => setIntro(false)} timer={timer} />}
        {banner && <ResultBanner banner={banner} t={t} onNew={pvp ? onExit : newGame} campaign={campaign} onExit={onExit}
          onSettings={!campaign && !pvp ? onExit : null}
          pvpInfo={pvp ? { rated, rematch, onRematch: () => { pvp.net.send({ t: "rematch", matchId: pvp.matchId }); setRematch("wait"); } } : null}
          unlockName={match?.boss?.unlocks ? (profile.lang === "en" ? CHARACTERS_BY_ID[match.boss.unlocks]?.nameEn : CHARACTERS_BY_ID[match.boss.unlocks]?.nameDe) : null} />}
      </div>

      {/* your strip: badges · status · captured · undo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "0 0 auto",
        padding: "2px 14px calc(10px + env(safe-area-inset-bottom))" }}>
        <Chip color={hotseat && state.turn === BLACK ? T.magentaInk : T.limeInk} bg={hotseat && state.turn === BLACK ? T.magenta : T.lime}>{hotseat ? t(state.turn === WHITE ? "hs.white" : "hs.black") : t("game.you")}</Chip>
        {!pvp && !hotseat && hpMode && (state.potions?.w || 0) > 0 && !banner && (
          <button onClick={() => setPotionArm((a) => !a)} disabled={!myTurn}
            style={{ background: potionArm ? T.gold : T.panel, color: potionArm ? "#17110a" : T.gold,
              border: `1.5px solid ${T.gold}`, borderRadius: 999, padding: "4px 11px", fontFamily: "inherit",
              fontWeight: 900, fontSize: 12.5, cursor: myTurn ? "pointer" : "default", opacity: myTurn ? 1 : 0.5,
              display: "inline-flex", alignItems: "center", gap: 5 }}>
            <ItemIcon id="potion" size={14} /> {state.potions.w}
          </button>
        )}
        {hpMode && <ForceBadge hp={F.w.hp} atk={F.w.atk} neon={T.lime} t={t} />}
        <div style={{ flex: 1, textAlign: "center", fontWeight: 800, fontSize: 13, minWidth: 0, overflow: "hidden",
          textOverflow: "ellipsis", whiteSpace: "nowrap", color: st.check ? T.goldBright : T.dim }}>{statusText}</div>
        <Tray kinds={state.captured.w} color="b" />
        {!pvp && !hotseat && (profile.items?.hourglass || 0) > 0 && (
          <button onClick={doUndo} disabled={!state.history.length || !!banner || hourglassLeft <= 0} title={t("game.undo")}
            style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 34, borderRadius: 10,
              border: `1px solid ${hourglassLeft > 0 ? T.gold + "88" : T.line}`, background: T.panel,
              color: T.gold, fontSize: 12.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", flex: "0 0 auto",
              padding: "0 9px", opacity: !state.history.length || banner || hourglassLeft <= 0 ? 0.45 : 1 }}>
            <HourglassIc size={15} /> {hourglassLeft}</button>
        )}
      </div>
    </div>
  );
}

// ── Pre-game setup (v0.4): map, mode and difficulty are chosen HERE, before
// the match — inside the match only the board remains. ────────────────────────
export function QuickSetup({ profile, dispatch, t, onStart, initial = null }) {
  const en = profile.lang === "en";
  const hpOpen = hpUnlocked(profile);
  const [mapId, setMapId] = useState(initial?.mapId && mapUnlocked(profile, initial.mapId) ? initial.mapId : "classic");
  const [mode, setMode] = useState(initial?.mode === "hp" && hpOpen ? "hp" : "chess");
  const [difficulty, setDifficulty] = useState(initial?.difficulty || profile.difficulty || "easy");
  const [foe, setFoe] = useState(initial?.hotseat ? "hotseat" : "ai");
  const [hsTurn, setHsTurn] = useState(initial?.hotseatFlip === false ? "fixed" : "turn");
  const [lockHint, setLockHint] = useState(false); // tap on a locked map explains the lock (no hover on touch)
  useEffect(() => {
    if (!lockHint) return;
    const id = setTimeout(() => setLockHint(false), 3200);
    return () => clearTimeout(id);
  }, [lockHint]);
  return (
    <Panel>
      <div style={{ fontSize: 12.5, color: T.dim, marginBottom: 14, lineHeight: 1.5 }}>{t("quick.hint")}</div>
      <FieldLabel>{t("game.map")}</FieldLabel>
      <div style={{ display: "flex", flexWrap: "nowrap", gap: 6, marginBottom: 14, overflowX: "auto",
        WebkitOverflowScrolling: "touch", paddingBottom: 4, scrollbarWidth: "thin", minWidth: 0, maxWidth: "100%" }}>
        {MAPS.map((m) => {
          const open = mapUnlocked(profile, m.id);
          return <MapChip key={m.id} on={m.id === mapId} locked={!open} theme={m.theme}
            title={open ? undefined : t("game.unlockHint")}
            onClick={() => open ? setMapId(m.id) : setLockHint(true)}
            label={<>{open ? null : <LockIc size={11} />}{(en ? m.nameEn : m.nameDe)} · {m.w}×{m.h}</>} />;
        })}
      </div>
      {lockHint && <div style={{ fontSize: 11.5, color: T.gold, margin: "-8px 0 12px" }}><LockIc color={T.gold} size={11} /> {t("game.unlockHint")}</div>}
      <FieldLabel>{t("game.mode")}</FieldLabel>
      <Segmented value={mode} onChange={(m) => (m !== "hp" || hpOpen) && setMode(m)}
        options={[
          { value: "chess", label: t("mode.chess") },
          { value: "hp", label: hpOpen ? t("mode.hp") : <><LockIc size={11} /> {t("mode.hp")}</>, disabled: !hpOpen },
        ]} />
      {!hpOpen && <div style={{ fontSize: 11.5, color: T.faint, marginTop: 5 }}>{t("game.unlockHint")}</div>}
      <div style={{ height: 12 }} />
      <FieldLabel>{t("quick.opponent")}</FieldLabel>
      <Segmented value={foe} onChange={setFoe}
        options={[{ value: "ai", label: t("quick.vsAi") }, { value: "hotseat", label: t("quick.hotseat") }]} />
      {foe === "hotseat" && <>
        <div style={{ fontSize: 11.5, color: T.faint, marginTop: 5, lineHeight: 1.45 }}>{t("quick.hotseatHint")}</div>
        <div style={{ height: 12 }} />
        <FieldLabel>{t("quick.board")}</FieldLabel>
        <Segmented value={hsTurn} onChange={setHsTurn}
          options={[{ value: "turn", label: t("quick.boardTurns") }, { value: "fixed", label: t("quick.boardFixed") }]} />
      </>}
      {foe === "ai" && <>
        <div style={{ height: 12 }} />
        <FieldLabel>{t("game.difficulty")}</FieldLabel>
        <Segmented value={difficulty} onChange={setDifficulty}
          options={[{ value: "easy", label: t("diff.easy") }, { value: "normal", label: t("diff.normal") }, { value: "hard", label: t("diff.hard") }]} />
      </>}
      <Button variant="primary" style={{ width: "100%", marginTop: 16, padding: "13px 16px", fontSize: 16 }}
        onClick={() => { dispatch({ type: "SET_DIFFICULTY", difficulty }); onStart({ mapId, mode, difficulty, hotseat: foe === "hotseat", hotseatFlip: hsTurn === "turn" }); }}>
        <BladesIc color={T.limeInk} size={15} /> {t("quick.start")}
      </Button>
    </Panel>
  );
}

// Pre-battle story card for campaign stages: chapter, place, a line of lore,
// and the boss you are about to face. The stage clock (if any) is announced
// here — it starts ticking only once you step in.
function StoryIntro({ node, boss, t, en, onBegin, timer = null }) {
  const ch = chapterForRow(node.row || 0);
  const roman = ["I", "II", "III", "IV"][ch.n - 1];
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center",
      background: "rgba(8,10,14,.74)", backdropFilter: "blur(2px)", borderRadius: 12, padding: 14, zIndex: 5 }}>
      <div style={{ background: "#efe9da", color: "#2e2a20", borderRadius: 14, padding: "18px 18px 16px",
        maxWidth: 340, width: "100%", boxShadow: "0 14px 34px rgba(0,0,0,.5)", border: "1px solid #c9bfa4", textAlign: "center" }}>
        <div className="gg-serif" style={{ fontSize: 10.5, letterSpacing: ".22em", color: "#8a6f4d" }}>
          {t("story.chapter", { r: roman }).toUpperCase()} · {(en ? ch.titleEn : ch.titleDe).toUpperCase()}
        </div>
        <div className="gg-serif" style={{ fontSize: 23, letterSpacing: ".04em", marginTop: 6 }}>{node.place}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 10px" }}>
          <span style={{ flex: 1, height: 1, background: "#c9bfa4" }} />
          <span style={{ width: 6, height: 6, background: "#8a6f4d", transform: "rotate(45deg)" }} />
          <span style={{ flex: 1, height: 1, background: "#c9bfa4" }} />
        </div>
        <div className="gg-serif" style={{ fontSize: 13.5, fontStyle: "italic", lineHeight: 1.55 }}>
          {en ? node.storyEn : node.storyDe}
        </div>
        {boss && <div style={{ marginTop: 12, fontSize: 12.5, fontWeight: 800, color: "#8e2f39" }}>
          {boss.bossId?.startsWith("pb_") ? <BladesIc color="#8e2f39" size={12} /> : <SkullIc size={12} />} {boss.name[en ? "en" : "de"]}
        </div>}
        {timer && <div style={{ marginTop: 8, fontSize: 12.5, fontWeight: 800, color: "#8a6f4d" }}>
          <HourglassIc size={13} color="#8a6f4d" /> {timer.type === "total"
            ? `${Math.round(timer.seconds / 60)} min`
            : `${timer.seconds}s ${en ? "per move" : "pro Zug"}`}
        </div>}
        <button onClick={onBegin} style={{ marginTop: 14, width: "100%", padding: "11px 14px", borderRadius: 10,
          background: "#1d2436", color: "#e9e2cf", fontWeight: 800, fontSize: 14.5, border: "none",
          fontFamily: "inherit", cursor: "pointer", letterSpacing: ".04em" }}>{t("story.begin")} ›</button>
      </div>
    </div>
  );
}

function ResultBanner({ banner, t, onNew, campaign = false, onExit = null, onSettings = null, unlockName = null, pvpInfo = null }) {
  const win = banner.result === "win";
  const color = banner.hotseat ? T.gold : win ? T.lime : banner.result === "draw" ? T.gold : "#b4636c";
  const title = banner.hotseat
    ? (banner.result === "draw" ? t("game.draw") : t(win ? "hs.winWhite" : "hs.winBlack"))
    : win ? t("game.win") : banner.result === "draw" ? t("game.draw") : t("game.lose");
  const sub = campaign && win && unlockName ? t("game.unlocked", { name: unlockName })
    : campaign && win ? t("game.stageCleared")
    : banner.reason === "checkmate" ? t("game.checkmate")
    : banner.reason === "regicide" ? t("game.regicide")
    : banner.reason === "time" ? t("game.timeout")
    : (banner.reason === "stalemate" || banner.reason === "draw") ? t("game.stalemate")
    : t("game.resigned");
  const g = banner.gained;
  const leveled = g.levelAfter > g.levelBefore;
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(8,10,14,.72)", backdropFilter: "blur(2px)", borderRadius: 12, padding: 14 }}>
      <Panel style={{ width: "100%", maxWidth: 320, textAlign: "center", animation: "rise .25s ease", borderColor: color + "66" }}>
        <div style={{ fontSize: 13, color: T.dim, textTransform: "uppercase", letterSpacing: 1 }}>{sub}</div>
        <div style={{ fontSize: 30, fontWeight: 900, color, margin: "4px 0 10px" }}>{title}</div>
        {!banner.hotseat && <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: leveled ? 8 : 12 }}>
          <Chip color={T.limeInk} bg={T.lime}>+{g.xp} {t("game.rewards")}</Chip>
          {g.sp > 0 && <Chip color={"#17110a"} bg={T.gold}><SkillStar size={12} /> {t("banner.sp", { n: g.sp })}</Chip>}
          {g.gold > 0 && <Chip color={"#17110a"} bg={"#e8c96a"}><GoldCoin size={12} /> +{g.gold}</Chip>}
          {g.newAchievements.length > 0 && <Chip color={T.gold} bg={T.panel2}>★ {g.newAchievements.length}</Chip>}
        </div>}
        {leveled && <div style={{ color: T.lime, fontWeight: 800, marginBottom: 12 }}>{t("game.levelup", { n: g.levelAfter })}</div>}
        {campaign ? (
          win
            ? <Button variant="primary" style={{ width: "100%" }} onClick={onExit}>{t("camp.back")}</Button>
            : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Button variant="primary" onClick={onNew}>{t("camp.replay")}</Button>
                <Button variant="subtle" onClick={onExit}>{t("common.back")}</Button>
              </div>
        ) : (
          pvpInfo
          ? <div style={{ display: "grid", gap: 8 }}>
              {pvpInfo.rated && <div style={{ fontSize: 13, color: T.gold, textAlign: "center", fontWeight: 800 }}>
                {t("online.rated", { r: pvpInfo.rated.rating, d: (pvpInfo.rated.delta >= 0 ? "+" : "") + pvpInfo.rated.delta })}</div>}
              {pvpInfo.rematch === "offer" && <div style={{ fontSize: 12.5, color: T.green, textAlign: "center" }}>⚔ {t("online.rematchOffer")}</div>}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Button variant="primary" disabled={pvpInfo.rematch === "wait"} onClick={pvpInfo.onRematch}>
                  {pvpInfo.rematch === "wait" ? t("online.rematchWait") : "⚔ " + t("online.rematch")}
                </Button>
                <Button variant="subtle" onClick={onNew}>{t("common.back")}</Button>
              </div>
            </div>
          : onSettings
          ? <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Button variant="primary" onClick={onNew}>{t("game.newgame")}</Button>
              <Button variant="subtle" onClick={onSettings}>⚙ {t("game.settings")}</Button>
            </div>
          : <Button variant="primary" style={{ width: "100%" }} onClick={onNew}>{t("game.newgame")}</Button>
        )}
      </Panel>
    </div>
  );
}
