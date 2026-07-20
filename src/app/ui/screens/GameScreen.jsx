import { useEffect, useMemo, useRef, useState } from "react";
import { WHITE, BLACK, createGame, reduce, moveCommand, potionCommand, shiftCommand, status, undo, encodeState, decodeState } from "../../../core/index.js";
import { difficultyById, mapById, MAPS, campaignTag, chapterForRow, CHARACTERS as CHARACTERS_BY_ID, voiceFor, ITEMS } from "../../../content/index.js";
import { buildArmy, buildAiArmyForMap, buildArmyFromFormation, hasForesight, applyResult, summarizeMatch, mapUnlocked, hpUnlocked, winGold, characterLevel, gambitTier, itemRevealed, clearedCount, SP_VAULT_MIN_CLEARED } from "../../../meta/index.js";
import { chooseMove } from "../../../ai/index.js";
import { ABILITY_COST } from "../../../core/index.js";
import { T } from "../theme.js";
import { GoldShineButton } from "../Gilded.jsx";
import { stateHash } from "../../../platform/net.web.js";
import { Button, Panel, Segmented, Chip, FieldLabel, MapChip } from "../primitives.jsx";
import { BoardView } from "../board/BoardView.jsx";
import { CHARACTERS, ABILITIES } from "../../../content/index.js";
import { paintedById, paintedForPiece, ENEMY_FILTER } from "../board/paintedArt.js";
import { SkillStar, GoldCoin, SkullIc, BladesIc, LockIc, FlagIc, HourglassIc, ZoomIc, OrbIc } from "../icons.jsx";
import { ItemIcon } from "../ItemIcon.jsx";
import texWear1 from "../assets/tex-wear-1.webp";
import texWear2 from "../assets/tex-wear-2.webp";
import texWear3 from "../assets/tex-wear-3.webp";
import texWear4 from "../assets/tex-wear-4.webp";
import ground01 from "../assets/ground-01.webp";
import ground02 from "../assets/ground-02.webp";
import ground03 from "../assets/ground-03.webp";
import ground04 from "../assets/ground-04.webp";
import ground05 from "../assets/ground-05.webp";
import ground06 from "../assets/ground-06.webp";
import ground07 from "../assets/ground-07.webp";
import ground08 from "../assets/ground-08.webp";
import ground09 from "../assets/ground-09.webp";
import ground10 from "../assets/ground-10.webp";

// ── THE LAND BLEEDS INTO THE BOARD ──────────────────────────────────────────
// Square tints sampled from each league's world painting: light = the open
// ground, dark = the same landscape's saturated shadow (spring goes mossy
// green, the sea deep blue) — every battle is fought INSIDE its world.
const LEAGUE_BOARD = {
  1: { sqLight: "#d6c79d", sqDark: "#716844" },
  2: { sqLight: "#ac9250", sqDark: "#433d1e" },
  3: { sqLight: "#ca954f", sqDark: "#5d3915" },
  4: { sqLight: "#d2dae7", sqDark: "#687485" },
  5: { sqLight: "#bfbeb9", sqDark: "#696864" },
  6: { sqLight: "#ac8b64", sqDark: "#54412c" },
  7: { sqLight: "#e1bc7b", sqDark: "#896429" },
  8: { sqLight: "#e59558", sqDark: "#7d3f22" },
  9: { sqLight: "#f8ca79", sqDark: "#a97c40" },
  10: { sqLight: "#98a6a8", sqDark: "#315360" },
};
const boardPalette = (profile) => {
  const lg = profile?.campaign?.league || 1;
  return LEAGUE_BOARD[((lg - 1) % 10) + 1] || LEAGUE_BOARD[1];
};

// The board's material ages with the journey: leagues I–IV play on cared-for
// wood, V–VII on well-used boards, VIII–X on veterans full of scars. Quick
// play, hotseat and pvp keep the pristine one.
const WEAR_TEX = [texWear1, texWear2, texWear3, texWear4];
const texHash = (s) => { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
// Every board has lived its own life: each station deals its finish
// deterministically from a pool that grows rougher with the league — even
// Liga I mixes fresh wood with the odd scarred veteran table.
// classic chess: the chosen Elo sets the bot's search depth
const eloDepth = (elo) => (elo || 1000) < 1000 ? 1 : (elo || 1000) < 1600 ? 2 : 3;

// the painted GROUND under a campaign board, per league world (01 = spring
// meadow). Classic boards keep their bare wood; more worlds follow as their
// paintings arrive.
const GROUNDS = { 1: ground01, 2: ground02, 3: ground03, 4: ground04, 5: ground05,
  6: ground06, 7: ground07, 8: ground08, 9: ground09, 10: ground10 }; // every world carries its own land under the board
const boardGround = (match, profile) => {
  if (!match) return null; // quick play & duels keep their bare tables
  const lg = (((profile?.campaign?.league || 1) - 1) % 10) + 1;
  return GROUNDS[lg] || null;
};
const boardTexture = (match, profile) => {
  if (!match) return WEAR_TEX[0];
  if (match.friendly) return WEAR_TEX[0];   // friendlies play on the freshest table in the house
  const lg = profile?.campaign?.league || 1;
  const pool = lg >= 8 ? [1, 2, 3, 3] : lg >= 5 ? [0, 1, 2, 3] : [0, 0, 1, 2, 3];
  return WEAR_TEX[pool[texHash((match.nodeId || "x") + ":" + lg) % pool.length]];
};
import { PieceGlyph } from "../board/PieceGlyph.jsx";
import { EnergyIc } from "../icons.jsx";

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

export function GameScreen({ profile, dispatch, t, match = null, onExit = null, pvp = null, quick = null, onArmy = null }) {
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
  // CLASSIC: pure standard chess — plain level-1 armies, classic art, Elo bot
  const classic = mode === "classic" || (pvp && pvp.rules === "chess");
  const map = pvp ? mapById(pvp.mapId) : campaign ? mapById(match.map) : mapById(classic ? "classic" : mapId);
  const rules = pvp ? (pvp.rules || "hp") : campaign ? match.rules : classic ? "chess" : mode;
  const depth = campaign ? match.depth : classic ? eloDepth(quick?.elo) : difficultyById(difficulty).depth;
  const playerArmy = useMemo(() => buildArmy(profile, map, campaign ? match.excludeId : null, rules), [profile, map]); // eslint-disable-line
  const freshSeed = () => (Date.now() ^ ((Math.random() * 0x7fffffff) | 0)) >>> 0;

  // ── pause & resume (v0.19): a campaign match interrupted mid-fight waits in
  // the profile (compact snapshot via the codec, history dropped) and picks up
  // exactly where it stood — board, potions, clock and burned time-turners.
  const resume = campaign && !pvp && profile.pausedMatch?.v === 1
    && profile.pausedMatch.nodeId === match.nodeId ? profile.pausedMatch : null;
  const [state, setState] = useState(() => {
    if (resume) { try { return decodeState(resume.enc); } catch { /* corrupt → fresh */ } }
    if (pvp) {
      const mine = classic ? buildArmyFromFormation(() => 1, mapById("classic").defaultFormation) : playerArmy;
      const white = myColor === WHITE ? mine : pvp.oppArmy;
      const black = myColor === WHITE ? pvp.oppArmy : mine;
      return createGame(white, black, { map, rules, seed: pvp.seed >>> 0 });
    }
    const seed = freshSeed();
    if (hotseat || classic) {
      const side = () => buildArmyFromFormation(() => 1, map.defaultFormation);
      if (hotseat) return createGame(side(), side(), { map, rules, seed });
      const ai = buildArmyFromFormation(() => 1, map.defaultFormation);
      return createGame(side(), ai, { map, rules, seed });
    }
    let ai = campaign ? match.aiArmy : buildAiArmyForMap(difficulty, map, seed);
    // THE LEAGUE MASTER REDEPLOYS: every attempt at the Keep meets a freshly
    // shuffled back rank — losing means facing a NEW array, and only the
    // Seeress's gaze reveals it before the first horn.
    if (campaign && match.nodeId === "n22" && ai?.back?.length) {
      const arr = [...ai.back]; let sh = seed >>> 0;
      for (let i = arr.length - 1; i > 0; i--) {
        sh = (Math.imul(sh, 1664525) + 1013904223) >>> 0;
        const j = sh % (i + 1); [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      ai = { ...ai, back: arr };
    }
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
  // THE SEERESS'S GAZE: with a seer actively fielded, the enemy array lies
  // open BEFORE the first horn — study it, or step back to rearrange.
  // ONLINE the gaze does more: the seer may SWAP own pieces on the spot,
  // while the foe waits behind a notice; the swaps travel with scoutDone so
  // both boards stay identical.
  const armyHasSeer = (a) => !!a?.back?.some((sp) => sp.kind === "SE" || sp.kind === "H"); // seeress (Crown), hawk (Shadow)
  const mySeerOnline = !!pvp && !classic && armyHasSeer(playerArmy);
  const oppSeerOnline = !!pvp && !classic && armyHasSeer(pvp?.oppArmy);
  const foresight = (!!campaign && !resume && !pvp && hasForesight(profile, map, rules)) || mySeerOnline;
  const [scout, setScout] = useState(() => foresight && (!!pvp || !(match && match.node && (match.node.storyDe || match.node.storyEn))));
  const [scoutWaitOpp, setScoutWaitOpp] = useState(() => oppSeerOnline); // the foe reads — we wait
  const scoutSwapsRef = useRef([]);      // [fromIdx, toIdx] pairs the seer performed
  const [scoutSel, setScoutSel] = useState(null);
  function scoutTap(i) {                 // swap two OWN pieces during the online scout
    const pc = state.board[i];
    if (pc && (pc.kind === "D+" || (pc.big && pc.kind === "D"))) { setScoutSel(null); return; } // the block stays put
    if (scoutSel == null) { if (pc && pc.color === myColor) setScoutSel(i); return; }
    if (i === scoutSel) { setScoutSel(null); return; }
    if (!pc || pc.color !== myColor) { setScoutSel(null); return; }
    const a = scoutSel; setScoutSel(null);
    scoutSwapsRef.current.push([a, i]);
    setState((s) => { const b = [...s.board]; [b[a], b[i]] = [b[i], b[a]]; return { ...s, board: b }; });
  }
  function endScout() {
    setScout(false);
    if (pvp) pvp.net.send({ t: "scoutDone", matchId: pvp.matchId, swaps: scoutSwapsRef.current });
  }
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
    if (!timer || clock == null || banner || intro || scout || scoutWaitOpp || state.turn !== myColor) return;
    const id = setInterval(() => setClock((c) => (c == null ? c : c - 1)), 1000);
    return () => clearInterval(id);
  }, [timer, state.turn, myColor, banner, intro, scout, scoutWaitOpp]); // eslint-disable-line
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
    setState(createGame(buildArmy(profile, m, campaign ? match.excludeId : null, rl), ai, { map: m, rules: rl, seed }));
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
    // every rung climbed this battle becomes a tale: which piece learned what
    const lessons = [];
    for (const cid of Object.keys(summary.charXpGains || {})) {
      const ch = CHARACTERS[cid]; if (!ch) continue;
      const before = characterLevel(profile, cid), after = characterLevel(next, cid);
      if (after <= before) continue;
      const nm = en ? ch.nameEn : ch.nameDe;
      for (const rung of ch.ladder || []) {
        if (rung.level > before && rung.level <= after) {
          if (rung.ability && ABILITIES[rung.ability]) lessons.push({ nm, ab: ABILITIES[rung.ability] });
          else if (rung.shield) lessons.push({ nm, shield: rung.shield });
        }
      }
      if (cid === "gambit" && gambitTier(after) > gambitTier(before))
        lessons.push({ nm, tier: ["I","II","III","IV","V","VI"][gambitTier(after) - 1] || gambitTier(after) });
    }
    if (lessons.length) setNewSkills(lessons);
    if (campaign && next.pausedMatch?.nodeId === match.nodeId) next.pausedMatch = null;
    // EVERY piece of gear is a battle prize: the first win reveals the draught,
    // the third opens the star vault, the road unveils the rest — each with its
    // own line on the victory banner, consumables landing one-for-free.
    if (campaign && result === "win" && match.firstClear) {
      const after = { ...next, campaign: { ...next.campaign, cleared: [...(next.campaign?.cleared || []), match.nodeId] } };
      const fresh = Object.values(ITEMS).filter((it) => !itemRevealed(profile, it) && itemRevealed(after, it));
      const newItems = fresh.map((it) => ({ id: it.id, free: it.kind === "consumable" }));
      if (clearedCount(profile) < SP_VAULT_MIN_CLEARED && clearedCount(after) >= SP_VAULT_MIN_CLEARED)
        newItems.push({ id: "spvault" });
      for (const it of fresh) if (it.kind === "consumable")
        next.items = { ...(next.items || {}), [it.id]: Math.min(it.max || 9, (next.items?.[it.id] || 0) + 1) };
      if (newItems.length) gained.newItems = newItems;
    }
    dispatch({ type: "REPLACE", profile: next });
    if (campaign && result === "win") {
      dispatch({ type: "RECORD_STAGE", id: match.nodeId, moves: summary.moveCount || 0 });
      dispatch({ type: "CAMPAIGN_CLEAR", id: match.nodeId });
      // A champion beaten but not won over FLEES the map — leave the map a note
      // so it can stage the escape on return (recruits join the court instead).
      if (match.boss && !match.boss.unlocks && match.firstClear) {
        try { sessionStorage.setItem("gg:fled", match.nodeId); } catch {}
      }
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

  // PvP: the foe's seer finished — mirror their swaps, then play begins.
  useEffect(() => {
    if (!pvp) return;
    return pvp.net.on("scoutDone", (m) => {
      const swaps = Array.isArray(m.swaps) ? m.swaps : [];
      setState((s) => { const b = [...s.board];
        for (const [a, c] of swaps) if (b[a] !== undefined && b[c] !== undefined) [b[a], b[c]] = [b[c], b[a]];
        return { ...s, board: b }; });
      setScoutWaitOpp(false);
    });
  }, [pvp]); // eslint-disable-line

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
  const [armResign, setArmResign] = useState(false);
  const [zoomMode, setZoomMode] = useState(false); // the field glass: FREE pinch-zoom up to 200%, the fixed board stays the default
  const [zv, setZv] = useState({ z: 1, x: 0, y: 0 });          // zoom view: scale + pan
  const zoomBox = useRef(null);                                 // the clipping window
  const zPtrs = useRef(new Map());                              // active pointers (pinch/pan)
  const zStart = useRef(null);                                  // gesture baseline
  const zDragged = useRef(false);                               // suppress the tap after a pan
  const clampView = (v) => {
    const el = zoomBox.current; const w = el?.clientWidth || 0, h = el?.clientHeight || 0;
    const z = Math.max(1, Math.min(2, v.z));
    const mx = ((z - 1) * w) / 2, my = ((z - 1) * h) / 2;
    return { z, x: Math.max(-mx, Math.min(mx, v.x)), y: Math.max(-my, Math.min(my, v.y)) };
  };
  const zoomDown = (e) => {
    if (!zoomMode) return;
    zPtrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...zPtrs.current.values()];
    zStart.current = { view: zv, pts: pts.map((p) => ({ ...p })) };
    zDragged.current = false;
  };
  const zoomMove = (e) => {
    if (!zoomMode || !zPtrs.current.has(e.pointerId) || !zStart.current) return;
    zPtrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const now = [...zPtrs.current.values()], st = zStart.current;
    if (now.length >= 2 && st.pts.length >= 2) {                 // PINCH: scale around the fingers
      const d0 = Math.hypot(st.pts[0].x - st.pts[1].x, st.pts[0].y - st.pts[1].y) || 1;
      const d1 = Math.hypot(now[0].x - now[1].x, now[0].y - now[1].y);
      const cx0 = (st.pts[0].x + st.pts[1].x) / 2, cy0 = (st.pts[0].y + st.pts[1].y) / 2;
      const cx1 = (now[0].x + now[1].x) / 2, cy1 = (now[0].y + now[1].y) / 2;
      zDragged.current = true;
      setZv(clampView({ z: st.view.z * (d1 / d0), x: st.view.x + (cx1 - cx0), y: st.view.y + (cy1 - cy0) }));
    } else if (now.length === 1 && st.view.z > 1.01) {           // PAN with one finger, once zoomed
      const dx = now[0].x - st.pts[0].x, dy = now[0].y - st.pts[0].y;
      if (Math.abs(dx) + Math.abs(dy) > 7) zDragged.current = true;
      if (zDragged.current) setZv(clampView({ z: st.view.z, x: st.view.x + dx, y: st.view.y + dy }));
    }
  };
  const zoomUp = (e) => {
    zPtrs.current.delete(e.pointerId);
    const pts = [...zPtrs.current.values()];
    zStart.current = pts.length ? { view: zv, pts: pts.map((p) => ({ ...p })) } : null;
  };
  const zoomWheel = (e) => {                                     // desktop: the wheel is the pinch
    if (!zoomMode) return;
    setZv((v) => clampView({ ...v, z: v.z * (e.deltaY < 0 ? 1.12 : 0.9) }));
  };
  const toggleZoom = () => setZoomMode((on) => { const next = !on; if (!next) setZv({ z: 1, x: 0, y: 0 }); return next; });
  const [flyDone, setFlyDone] = useState(() => !!quick); // the opening flight belongs to the JOURNEY: quick play (incl. classic & hotseat) starts on the spot
  const [flyGo, setFlyGo] = useState(false);       // ... and only AFTER the story sheet is acknowledged
  const [newSkills, setNewSkills] = useState([]);  // "X learns Y" — the banner tells every lesson of this battle
  const [inspect, setInspect] = useState(null);    // the tapped piece's dossier: { i, mode: "own" | "spy" }
  // ── THE CODEX: which exotic foes has the player met before? First
  // encounters keep their secrets (no move-reading) and introduce themselves
  // with a tale instead; from the NEXT battle on they are an open book. ──
  const STD_KINDS = useMemo(() => new Set(["P", "N", "B", "R", "Q", "K", "D+"]), []);
  const codexKey = (pc) => (pc.bossId ? "X:" + pc.bossId : pc.kind);
  const [knownAtStart] = useState(() => new Set(profile.codex?.met || []));
  const [metTold, setMetTold] = useState(() => new Set()); // tales told this battle
  const [firstMeet, setFirstMeet] = useState(null);        // the introduction sheet
  useEffect(() => {
    if (!dispatch || !state?.board) return;
    const met = new Set(profile.codex?.met || []);
    let grew = false;
    for (const pc of state.board) if (pc && pc.color === oppColor && !STD_KINDS.has(pc.kind)) {
      const k = codexKey(pc); if (!met.has(k)) { met.add(k); grew = true; }
    }
    if (grew) dispatch({ type: "REPLACE", profile: { ...profile, codex: { ...(profile.codex || {}), met: [...met] } } });
  }, []);
  const introSpots = useMemo(() => {
    if (flyDone || !flyGo || !state?.board) return null;
    const set = new Set();
    state.board.forEach((pc, i) => { if (pc && pc.color === oppColor && !STD_KINDS.has(pc.kind) && !knownAtStart.has(codexKey(pc))) set.add(i); });
    return set.size ? set : null;
  }, [flyDone, flyGo, state]);
  const seerVision = state?.rules === "hp" && state.board.some((pc) => pc && pc.color === myColor && (pc.kind === "SE" || pc.kind === "H") && (pc.level || 1) >= 2);
  const onEnemyTap = (i, allowed) => {
    const pc = state.board[i]; if (!pc || STD_KINDS.has(pc.kind)) return;
    const k = codexKey(pc);
    if (!knownAtStart.has(k) && !metTold.has(k)) {           // a stranger — the hall tells its tale once
      setMetTold((m) => new Set(m).add(k));
      setFirstMeet({ piece: pc, seen: allowed });
    }
  };
  useEffect(() => { if (!intro && !flyGo) setFlyGo(true); }, [intro]); // the curtain rises once the tale is told
  useEffect(() => { if (!flyGo) return; const id = setTimeout(() => setFlyDone(true), 2000); return () => clearTimeout(id); }, [flyGo]); // one tap arms, the second concedes
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
  const myTurn = (hotseat ? true : state.turn === myColor) && !banner && !scout && !scoutWaitOpp;
  const st = status(state);
  const hpMode = state.rules === "hp";
  const F = hpMode ? forces(state.board) : null;
  const statusText = banner ? "" : st.check ? t("game.check") : hotseat ? t(state.turn === WHITE ? "hs.turnWhite" : "hs.turnBlack") : myTurn ? t("game.turnYou") : pvp ? t("online.turnOpp") : t("game.turnAi");
  const clockLbl = clock != null ? `${Math.floor(Math.max(0, clock) / 60)}:${String(Math.max(0, clock) % 60).padStart(2, "0")}` : null;
  const clockHot = clock != null && (timer?.type === "move" ? clock <= 5 : clock <= 30);

  const [wideMatch, setWideMatch] = useState(typeof window !== "undefined" && window.innerWidth >= 940);
  useEffect(() => {
    const on = () => setWideMatch(window.innerWidth >= 940);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  // Desktop: the board claims every pixel it can get — pills, trays and
  // status move into a slim column beside it. Phones keep the stacked layout.
  const headerBar = (<>
      {/* top bar: ‹ back · context · clock · ⚑ resign — everything floats, nothing scrolls */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, padding: "10px 10px 6px", flex: "0 0 auto" }}>
        {onExit && (
          <button onClick={leave} style={pill({ border: `1.5px solid ${T.gold}88`, color: T.gold })}>
            <span style={{ fontSize: 15, lineHeight: 1 }}>‹</span> {t("common.back")}
          </button>
        )}
        <div style={{ flex: "1 1 130px", minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, overflow: "hidden" }}>
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
          <button onClick={() => setArmResign(true)} disabled={!!banner || !!intro || scout}
            style={pill({ border: `1.5px solid ${T.gold}66`, color: T.dim, opacity: banner || intro || scout ? 0.5 : 1,
              cursor: banner || intro || scout ? "default" : "pointer" })}>
            <FlagIc size={13} /> {t("game.resign")}
          </button>
        )}
      </div>

</>);
  const enemyStrip = (<>
      {/* enemy strip */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", minHeight: 24, flex: "0 0 auto" }}>
        {hpMode && <ForceBadge hp={F.b.hp} atk={F.b.atk} neon={T.magenta} t={t} />}
        <div style={{ flex: 1 }} />
        <span data-gg-tray="w"><Tray kinds={state.captured.b} color="w" /></span>
      </div>

</>);
  const boardBlock = (<>
      {/* THE BOARD — fixed viewport, fills all remaining space, never scrolls */}
      <div ref={zoomBox} onPointerDown={zoomDown} onPointerMove={zoomMove} onPointerUp={zoomUp} onPointerCancel={zoomUp}
        onWheel={zoomWheel} onClickCapture={(e) => { if (zDragged.current) { e.stopPropagation(); e.preventDefault(); zDragged.current = false; } }}
        style={{ flex: "1 1 auto", minHeight: 0, position: "relative", margin: "2px 4px",
        overflow: "hidden", touchAction: zoomMode ? "none" : "auto", cursor: zoomMode && zv.z > 1.01 ? "grab" : undefined }}>
        <div style={{ width: "100%", height: "100%",
          transform: zoomMode ? `translate(${zv.x}px, ${zv.y}px) scale(${zv.z})` : "none",
          transformOrigin: "50% 50%", transition: zPtrs.current.size ? "none" : "transform .18s ease",
          animation: flyGo && !flyDone && !zoomMode ? "ggBoardZoomIn 1.9s cubic-bezier(.2,.85,.25,1) both" : "none", // the STATION rushes up: a clean zoom from map-height to the board, no more flyover
          opacity: flyGo ? 1 : 0.985 }}>
        <BoardView state={state} onMove={play} interactive={myTurn} lastMove={state.lastMove} animateFor={null} hotseat={hotseat}
          flip={viewColor === BLACK} theme={{ ...(map.theme || {}), ...boardPalette(profile) }} fitBox pick={scout && pvp ? myColor : potionArm ? WHITE : null}
          onPick={scout && pvp ? scoutTap : usePotion} pov={viewColor}
          knownKinds={knownAtStart} seerVision={seerVision} onEnemyTap={onEnemyTap} introSpot={introSpots} onInspect={setInspect}
          texture={boardTexture(match, profile)} ground={boardGround(match, profile)} artStyle={profile.pieceStyle === "svg" ? "svg" : classic ? "classic" : "painted"} friendly={!!match?.friendly}
          pulse={classic ? 0.2 : match?.boss
            ? (match.boss.bossId && !match.boss.bossId.startsWith("pb_") ? 0.9 : 0.7)
            : ({ easy: 0.25, normal: 0.4, hard: 0.6 }[(campaign && match?.node?.difficulty) || difficulty] ?? 0.4)} />
        </div>
        {inspect && state.board[inspect.i] && !banner && (() => {
          const pc = state.board[inspect.i];
          const own = inspect.mode === "own";
          const ch = Object.values(CHARACTERS).find((c) => c.kind === pc.kind);
          const nm = pc.name ? (en ? pc.name.en : pc.name.de) : ch ? (en ? ch.nameEn : ch.nameDe) : pc.kind;
          const abIds = pc.abilities || [];
          return (
            <div style={{ position: "absolute", zIndex: 7, pointerEvents: "none", display: "flex",
              // the LAYOUT LAW: your own piece reports BELOW (the action zone),
              // the enemy's secrets pop up ABOVE the field
              ...(own ? { left: 8, right: 58, bottom: 8, justifyContent: "flex-start" }
                      : { left: 8, right: 8, top: 8, justifyContent: "center" }) }}>
              <div style={{ pointerEvents: "auto", maxWidth: 380, borderRadius: 12, padding: "8px 11px 8px",
                background: "rgba(9, 12, 20, .88)", border: `1px solid ${own ? "rgba(233,210,150,.5)" : "rgba(167,139,250,.55)"}`,
                boxShadow: "0 6px 20px rgba(0,0,0,.5)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                animation: "rise .18s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap", minWidth: 0 }}>
                    <span className="gg-serif" style={{ fontSize: 13.5, color: own ? T.goldBright : "#cbbcf5", letterSpacing: ".04em" }}>{nm}</span>
                    {(pc.level || 1) > 1 && <span style={{ fontSize: 12, fontWeight: 800, color: "#f0d68a" }}>Lv {pc.level}</span>}
                    {pc.maxHp > 0 && <span style={{ fontSize: 12, fontWeight: 800, color: "#8fd6a0" }}>♥ {pc.hp}/{pc.maxHp}</span>}
                    {pc.maxEn > 0 && <span style={{ fontSize: 12, fontWeight: 800, color: "#8ec7f2", display: "inline-flex", alignItems: "center", gap: 3 }}><EnergyIc size={11} style={{ verticalAlign: 0 }} /> {pc.en}/{pc.maxEn}{pc.enRegen > 0 && <span style={{ color: "#6f96bd", fontWeight: 600 }}> (+{pc.enRegen})</span>}</span>}
                    {pc.atk != null && <span style={{ fontSize: 12, fontWeight: 800, color: "#e5975f" }}>⚔ {pc.atk}</span>}
                    {pc.shield > 0 && <span style={{ fontSize: 12, fontWeight: 800, color: "#9fc1e8" }}>⛨ {pc.shield}</span>}
                  </div>
                </div>
                {abIds.length > 0 && (
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 }}>
                    {abIds.map((id) => {
                      const ab = ABILITIES[id];
                      // the fog of war: a foe's talent stays "???" until the piece has
                      // USED it before your eyes — unless a seer reads it for you
                      const seen = own || seerVision || !!(pc.used || {})[id];
                      const cost = ABILITY_COST[id] ?? 0;
                      const dry = pc.en != null && cost > 0 && pc.en < cost; // too spent to cast
                      return (
                        <span key={id} title={dry ? t("ins.noEnergy") : undefined}
                          style={{ fontSize: 10.5, padding: "3px 8px", borderRadius: 999,
                          border: `1px solid ${seen ? (dry ? "#5a5142" : "#a5813c") : "#39415c"}`,
                          background: seen ? (dry ? "rgba(24,26,32,.6)" : "rgba(58,47,18,.55)") : "rgba(16,20,34,.6)",
                          color: seen ? (dry ? T.faint : "#e9d296") : T.faint,
                          opacity: seen && dry ? 0.75 : 1 }}>
                          {seen && ab ? <>{ab.icon} {en ? ab.nameEn : ab.nameDe}{cost > 0 && <span style={{ color: dry ? "#5a6a80" : "#8ec7f2", fontWeight: 800 }}> · <EnergyIc size={10} />{cost}</span>}</>
                            : t("ins.unknown")}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
        <button onClick={toggleZoom} title={t("game.zoom")}
          style={{ position: "absolute", right: 8, bottom: 8, zIndex: 6, cursor: "pointer",
            width: 42, height: 42, borderRadius: "50%", display: "grid", placeItems: "center",
            background: zoomMode ? "rgba(240,206,122,.2)" : "rgba(8, 11, 20, .55)",
            border: `1px solid rgba(233, 210, 150, ${zoomMode ? ".8" : ".42"})`,
            boxShadow: "0 2px 10px rgba(0,0,0,.4), inset 0 0.5px 0 rgba(255,243,196,.25)",
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
          <ZoomIc size={19} />
        </button>
        {firstMeet && (() => {
          const pc = firstMeet.piece;
          const ch = Object.values(CHARACTERS).find((c) => c.kind === pc.kind);
          const nm = pc.name ? (en ? pc.name.en : pc.name.de) : ch ? (en ? ch.nameEn : ch.nameDe) : pc.kind;
          const tale = ch ? (en ? ch.flavorEn : ch.flavorDe) : t("meet.unknownTale");
          const src = paintedForPiece({ kind: pc.kind, color: "w", hero: false });
          return (
            <div onClick={() => setFirstMeet(null)} style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(4,6,10,.72)",
              display: "grid", placeItems: "center", padding: 18, animation: "fade .2s ease" }}>
              <div onClick={(e) => e.stopPropagation()} style={{ width: "min(92vw, 360px)", borderRadius: 16, padding: "16px 16px 14px",
                background: "linear-gradient(178deg, #141a28, #0d1119)", border: "1px solid rgba(233,210,150,.45)",
                boxShadow: "0 18px 50px rgba(0,0,0,.6)", textAlign: "center", animation: "rise .25s ease" }}>
                <div className="gg-serif" style={{ fontSize: 11.5, letterSpacing: ".16em", color: T.gold }}>{t("meet.title")}</div>
                {src && <img src={src} alt="" style={{ height: 110, margin: "10px auto 6px", display: "block", objectFit: "contain",
                  filter: ENEMY_FILTER + " brightness(1.25) drop-shadow(0 4px 8px rgba(0,0,0,.6))" }} />}
                <div className="gg-serif" style={{ fontSize: 19, color: T.goldBright, letterSpacing: ".05em" }}>{nm}</div>
                <div className="gg-serif" style={{ fontSize: 12.5, fontStyle: "italic", color: T.dim, lineHeight: 1.55, margin: "7px 0 4px" }}>{tale}</div>
                <div style={{ fontSize: 11.5, color: firstMeet.seen ? "#b9a8ef" : T.faint, marginTop: 6 }}>
                  {firstMeet.seen ? t("meet.seerNote") : t("meet.secretNote")}</div>
                <button onClick={() => setFirstMeet(null)} style={{ marginTop: 12, width: "100%", padding: "10px 14px", borderRadius: 10,
                  background: "linear-gradient(165deg, #e0b76c, #b78d43)", border: "1px solid rgba(255,240,200,.5)",
                  color: "#17110a", fontWeight: 800, fontSize: 13.5, fontFamily: "inherit", cursor: "pointer" }}>{t("meet.ok")}</button>
              </div>
            </div>
          );
        })()}
        {potionArm && <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", zIndex: 4,
          background: "#0d1017ee", border: `1px solid ${T.gold}`, color: T.gold, fontSize: 12.5, fontWeight: 800,
          borderRadius: 999, padding: "6px 14px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6 }}><ItemIcon id="potion" size={14} /> {t("game.potionPick")} · <span onClick={() => setPotionArm(false)} style={{ cursor: "pointer", textDecoration: "underline" }}>{t("online.cancel")}</span></div>}
        {intro && !banner && <StoryIntro node={match.node} boss={match.boss} t={t} en={profile.lang === "en"} onBegin={() => { setIntro(false); if (foresight) setScout(true); }} timer={timer} />}
        {scout && !intro && !banner && (
          <div style={{ position: "absolute", left: 10, right: 10, bottom: 12, zIndex: 5,
            background: "rgba(10,13,20,.82)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(233,210,150,.45)", borderRadius: 14, padding: "12px 14px",
            boxShadow: "0 10px 30px rgba(0,0,0,.5)" }}>
            <div className="gg-serif" style={{ color: "#e9d296", fontSize: 14, letterSpacing: ".08em", marginBottom: 3 }}>
              <span style={{ display: "inline-block", verticalAlign: "-3px", marginRight: 6 }}><OrbIc size={15} /></span>{t("scout.title")}</div>
            <div style={{ color: "rgba(240,233,216,.8)", fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>
              {pvp ? t("scout.swapHint") : t("scout.hint")}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <GoldShineButton style={{ flex: 1, padding: "10px 12px", fontSize: 13.5, borderRadius: 10 }}
                onClick={endScout}>
                <BladesIc color="#17110a" size={13} /> {t("story.begin")}
              </GoldShineButton>
              {!pvp && onArmy && <Button variant="subtle" onClick={onArmy} style={{ padding: "10px 12px", fontSize: 12.5 }}>{t("scout.army")}</Button>}
            </div>
          </div>
        )}
        {!scout && scoutWaitOpp && !banner && (
          <div style={{ position: "absolute", left: 10, right: 10, bottom: 12, zIndex: 5,
            background: "rgba(10,13,20,.82)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(233,210,150,.35)", borderRadius: 14, padding: "12px 14px", textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,.5)" }}>
            <div className="gg-serif" style={{ color: "#e9d296", fontSize: 13.5, letterSpacing: ".08em", marginBottom: 3 }}>
              <span style={{ display: "inline-block", verticalAlign: "-3px", marginRight: 6 }}><OrbIc size={15} /></span>{t("scout.oppTitle")}</div>
            <div style={{ color: "rgba(240,233,216,.8)", fontSize: 12, lineHeight: 1.5 }}>{t("scout.oppHint")}</div>
          </div>
        )}
      </div>

</>);
  const yourStrip = (<>
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
        {!pvp && !hotseat && hpMode && !banner && ((state.shifts?.w || 0) > 0 || state.shiftArmed === WHITE) && (
          <button onClick={() => { if (state.shiftArmed || !myTurn) return; setState((s) => reduce(s, shiftCommand(WHITE)).state); }}
            disabled={!myTurn || state.shiftArmed === WHITE} title={t("game.riftHint")}
            style={{ background: state.shiftArmed === WHITE ? "#8a7ab8" : T.panel,
              color: state.shiftArmed === WHITE ? "#171125" : "#b3a4e0",
              border: "1.5px solid #8a7ab8", borderRadius: 999, padding: "4px 11px", fontFamily: "inherit",
              fontWeight: 900, fontSize: 12.5, cursor: myTurn && state.shiftArmed !== WHITE ? "pointer" : "default",
              opacity: myTurn || state.shiftArmed === WHITE ? 1 : 0.5,
              display: "inline-flex", alignItems: "center", gap: 5 }}>
            ⧗ {state.shiftArmed === WHITE ? t("game.riftArmed") : (state.shifts?.w || 0)}
          </button>
        )}
        {hpMode && <ForceBadge hp={F.w.hp} atk={F.w.atk} neon={T.lime} t={t} />}
        <div style={{ flex: 1, textAlign: "center", fontWeight: 800, fontSize: 13, minWidth: 0, overflow: "hidden",
          textOverflow: "ellipsis", whiteSpace: "nowrap", color: st.check ? T.goldBright : T.dim }}>{statusText}</div>
        <span data-gg-tray="b"><Tray kinds={state.captured.w} color="b" /></span>
        {!pvp && !hotseat && (profile.items?.hourglass || 0) > 0 && (
          <button onClick={doUndo} disabled={!state.history.length || !!banner || hourglassLeft <= 0} title={t("game.undo")}
            style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 34, borderRadius: 10,
              border: `1px solid ${hourglassLeft > 0 ? T.gold + "88" : T.line}`, background: T.panel,
              color: T.gold, fontSize: 12.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", flex: "0 0 auto",
              padding: "0 9px", opacity: !state.history.length || banner || hourglassLeft <= 0 ? 0.45 : 1 }}>
            <HourglassIc size={15} /> {hourglassLeft}</button>
        )}
      </div>
</>);

  // the victory/defeat banner lives at the TOP of the screen tree (not inside
  // the zoomable board), so it always floats OVER every piece and overlay
  const bannerEl = banner ? <ResultBanner banner={banner} t={t} onNew={pvp ? onExit : newGame} campaign={campaign} onExit={onExit} boss={match?.boss || null}
    onSettings={!campaign && !pvp ? onExit : null}
    pvpInfo={pvp ? { rated, rematch, onRematch: () => { pvp.net.send({ t: "rematch", matchId: pvp.matchId }); setRematch("wait"); } } : null}
    unlockName={match?.boss?.unlocks ? (profile.lang === "en" ? CHARACTERS_BY_ID[match.boss.unlocks]?.nameEn : CHARACTERS_BY_ID[match.boss.unlocks]?.nameDe) : null}
    fledName={match?.boss && !match?.boss?.unlocks ? (match.boss.name?.[profile.lang === "en" ? "en" : "de"] || null) : null}
    unlockId={match?.boss?.unlocks || null} en={profile.lang === "en"} onArmy={onArmy} newSkills={newSkills} /> : null;

  if (wideMatch) return (
    <div style={{ position: "relative", overflow: "hidden", flex: "1 1 auto", minHeight: 0, height: "100%", display: "flex" }}>
      <div style={{ flex: "1 1 auto", minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column", padding: "10px 2px 14px 10px" }}>
        {boardBlock}
      </div>
      <aside style={{ width: 272, flex: "0 0 auto", minHeight: 0, display: "flex", flexDirection: "column",
        overflowY: "auto", padding: "2px 6px 6px 0" }}>
        {headerBar}
        {enemyStrip}
        <div style={{ flex: 1, minHeight: 14 }} />
        {yourStrip}
      </aside>
      {bannerEl}
    </div>
  );

  return (
    <div style={{ position: "relative", overflow: "hidden", flex: "1 1 auto", minHeight: 0, height: "100%",
      display: "flex", flexDirection: "column" }}>
      {headerBar}
      {enemyStrip}
      {boardBlock}
      {yourStrip}
      {bannerEl}
    </div>
  );
}

// ── Pre-game setup (v0.4): map, mode and difficulty are chosen HERE, before
// the match — inside the match only the board remains. ────────────────────────
export function QuickSetup({ profile, dispatch, t, onStart, initial = null }) {
  const en = profile.lang === "en";
  const hpOpen = hpUnlocked(profile);
  const [mapId, setMapId] = useState(initial?.mapId && mapUnlocked(profile, initial.mapId) ? initial.mapId : "classic");
  const [mode, setMode] = useState(initial?.mode === "hp" && hpOpen ? "hp" : initial?.mode === "classic" ? "classic" : "chess");
  const [elo, setElo] = useState(initial?.elo || profile.classicElo || 1000);
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
      <FieldLabel>{t("game.mode")}</FieldLabel>
      <Segmented value={mode} onChange={(m) => (m !== "hp" || hpOpen) && setMode(m)}
        options={[
          { value: "classic", label: t("mode.classic") },
          { value: "chess", label: t("mode.chess") },
          { value: "hp", label: hpOpen ? t("mode.hp") : <><LockIc size={11} /> {t("mode.hp")}</>, disabled: !hpOpen },
        ]} />
      {mode === "classic" && <div style={{ fontSize: 11.5, color: T.faint, marginTop: 5, lineHeight: 1.45 }}>{t("quick.classicHint")}</div>}
      <div style={{ height: 12 }} />

      {mode !== "classic" && <><FieldLabel>{t("game.map")}</FieldLabel></>}
      {mode !== "classic" && <div style={{ display: "flex", flexWrap: "nowrap", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 10,
        WebkitOverflowScrolling: "touch", paddingBottom: 4, scrollbarWidth: "thin", minWidth: 0, maxWidth: "100%" }}>
        {MAPS.map((m) => {
          const open = mapUnlocked(profile, m.id);
          return <MapChip key={m.id} on={m.id === mapId} locked={!open} theme={m.theme}
            title={open ? undefined : t("game.unlockHint")}
            onClick={() => open ? setMapId(m.id) : setLockHint(true)}
            label={<>{open ? null : <LockIc size={11} />}{(en ? m.nameEn : m.nameDe)} · {m.w}×{m.h}</>} />;
        })}
      </div>}
      {lockHint && <div style={{ fontSize: 11.5, color: T.gold, margin: "-8px 0 12px" }}><LockIc color={T.gold} size={11} /> {t("game.unlockHint")}</div>}

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
      {foe === "ai" && mode !== "classic" && <>
        <div style={{ height: 12 }} />
        <FieldLabel>{t("game.difficulty")}</FieldLabel>
        <Segmented value={difficulty} onChange={setDifficulty}
          options={[{ value: "easy", label: t("diff.easy") }, { value: "normal", label: t("diff.normal") }, { value: "hard", label: t("diff.hard") }]} />
      </>}
      {foe === "ai" && mode === "classic" && <>
        <div style={{ height: 12 }} />
        <FieldLabel>{t("quick.elo")}</FieldLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input type="range" min={600} max={2200} step={50} value={elo} onChange={(e) => setElo(+e.target.value)}
            style={{ flex: 1, accentColor: T.gold }} aria-label={t("quick.elo")} />
          <input type="number" min={600} max={2200} step={50} value={elo}
            onChange={(e) => setElo(Math.max(600, Math.min(2200, +e.target.value || 1000)))}
            style={{ width: 84, background: T.bg2, border: `1px solid rgba(233,210,150,.5)`, borderRadius: 8,
              color: "#f0d68a", fontWeight: 800, textAlign: "center", padding: "9px 6px", fontFamily: "inherit", fontSize: 15.5,
              WebkitAppearance: "none", MozAppearance: "textfield", appearance: "textfield", outline: "none" }} />
        </div>
        <div style={{ fontSize: 11.5, color: T.faint, marginTop: 5 }}>{t("quick.eloHint")}</div>
      </>}
      <GoldShineButton style={{ width: "100%", padding: "12px 16px", fontSize: 14.5, borderRadius: 12, marginTop: 16 }}
        onClick={() => { dispatch({ type: "SET_DIFFICULTY", difficulty }); if (mode === "classic") dispatch({ type: "SET_CLASSIC_ELO", elo });
          onStart({ mapId: mode === "classic" ? "classic" : mapId, mode, difficulty, elo, hotseat: foe === "hotseat", hotseatFlip: hsTurn === "turn" }); }}>
        <BladesIc color="#17110a" size={15} /> {t("quick.start")}
      </GoldShineButton>
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
        {boss && voiceFor(boss) && <div className="gg-serif" style={{ marginTop: 7, fontSize: 12.5, fontStyle: "italic",
          lineHeight: 1.55, color: "#5c5140" }}>
          {voiceFor(boss)[en ? "heraldEn" : "heraldDe"]}
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

function ResultBanner({ banner, t, onNew, campaign = false, onExit = null, onSettings = null, unlockName = null, unlockId = null, fledName = null, en = false, onArmy = null, pvpInfo = null, boss = null, newSkills = [] }) {
  const win = banner.result === "win";
  const color = banner.hotseat ? T.gold : win ? T.lime : banner.result === "draw" ? T.gold : "#b4636c";
  const title = banner.hotseat
    ? (banner.result === "draw" ? t("game.draw") : t(win ? "hs.winWhite" : "hs.winBlack"))
    : win ? t("game.win") : banner.result === "draw" ? t("game.draw") : t("game.lose");
  const sub = campaign && win && unlockName ? t("game.unlocked", { name: unlockName })
    : campaign && win && fledName ? t("camp.fled", { name: fledName })
    : campaign && win ? t("game.stageCleared")
    : banner.reason === "checkmate" ? t("game.checkmate")
    : banner.reason === "regicide" ? t("game.regicide")
    : banner.reason === "time" ? t("game.timeout")
    : (banner.reason === "stalemate" || banner.reason === "draw") ? t("game.stalemate")
    : t("game.resigned");
  const g = banner.gained;
  const leveled = g.levelAfter > g.levelBefore;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "grid", placeItems: "center", background: "rgba(8,10,14,.72)", backdropFilter: "blur(2px)", padding: 14 }}>
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
        {g.newItems?.length > 0 && <div style={{ display: "grid", gap: 5, margin: "2px 0 12px" }}>
          {g.newItems.map((ni) => {
            const it = ITEMS[ni.id];
            return <div key={ni.id} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              padding: "7px 10px", borderRadius: 10, fontSize: 12.5, fontWeight: 800,
              background: "linear-gradient(168deg, #2c4f9e 0%, #1b3068 55%, #142450 100%)",
              border: "1px solid #e3c07a", color: "#f6e9a4",
              boxShadow: "0 0 10px rgba(64,110,220,.3), inset 0 1px 0 rgba(190,215,255,.28)" }}>
              {ni.id === "spvault" ? <SkillStar size={15} /> : <ItemIcon id={ni.id} size={17} />}
              <span>{ni.id === "spvault" ? t("banner.vault")
                : t(ni.free ? "banner.newItemFree" : "banner.newItem", { name: it ? (en ? it.nameEn : it.nameDe) : ni.id })}</span>
            </div>; })}
        </div>}
        {campaign && win && boss && voiceFor(boss) && (
          <div className="gg-serif" style={{ margin: "2px 0 10px", padding: "10px 12px", borderRadius: 12,
            border: "1px solid rgba(233,210,150,.3)", background: "rgba(10,13,20,.55)",
            fontStyle: "italic", fontSize: 12.5, lineHeight: 1.55, color: "rgba(240,233,216,.9)" }}>
            „{voiceFor(boss)[en ? "afterEn" : "afterDe"]}"
            <div style={{ fontStyle: "normal", fontSize: 10.5, letterSpacing: ".14em", color: "#c9a45c", marginTop: 5 }}>
              — {boss.name[en ? "en" : "de"].toUpperCase()}</div>
          </div>
        )}
        {campaign && win && unlockId && (() => {
          const ch = CHARACTERS_BY_ID[unlockId];
          if (!ch) return null;
          const abilities = (ch.ladder || []).filter((r) => r.ability).length;
          const shields = (ch.ladder || []).reduce((a, r) => a + (r.shield || 0), 0);
          const maxLv = (ch.ladder || []).reduce((a, r) => Math.max(a, r.level), 1);
          const pt = paintedById(unlockId);
          return <div style={{ margin: "2px 0 12px", padding: "12px 12px 11px", borderRadius: 12,
            border: "1px solid #8a6d3577", background: "linear-gradient(170deg, rgba(46,37,16,.5), rgba(22,20,14,.4))",
            animation: "rise .35s ease" }}>
            {/* redeemed: the portrait sheds the enemy blue and turns gold */}
            {pt && <img src={pt} alt="" draggable={false} style={{ width: 84, height: 84, objectFit: "contain",
              filter: "drop-shadow(0 3px 6px rgba(0,0,0,.5))", animation: "ggRedeem 1.5s ease .35s both", userSelect: "none" }} />}
            <div className="gg-serif" style={{ fontSize: 19, letterSpacing: ".05em", color: T.gold, marginTop: 2 }}>
              {en ? ch.nameEn : ch.nameDe}</div>
            {(ch.flavorDe || ch.flavorEn) && <div style={{ fontSize: 12, color: T.dim, fontStyle: "italic", marginTop: 3, lineHeight: 1.45 }}>
              {en ? ch.flavorEn : ch.flavorDe}</div>}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 9, flexWrap: "wrap" }}>
              <Chip color={T.gold} bg={T.panel2}>✦ {t("banner.abilities", { n: abilities })}</Chip>
              {shields > 0 && <Chip color={T.gold} bg={T.panel2}>⛨ {t("banner.shields", { n: shields })}</Chip>}
              <Chip color={T.gold} bg={T.panel2}>{t("banner.maxLevel", { n: maxLv })}</Chip>
            </div>
          </div>;
        })()}
        {newSkills.length > 0 && (
          <div style={{ margin: "2px 0 12px", padding: "11px 13px 10px", borderRadius: 12, textAlign: "left",
            border: "1px solid #8a6d3577", background: "linear-gradient(170deg, rgba(46,37,16,.5), rgba(22,20,14,.4))",
            animation: "rise .35s ease" }}>
            <div className="gg-serif" style={{ fontSize: 11.5, letterSpacing: ".16em", color: T.gold, textAlign: "center", marginBottom: 7 }}>
              {t("banner.learned")}</div>
            {newSkills.map((l, i) => (
              <div key={i} style={{ padding: "5px 0", borderTop: i ? "1px dashed rgba(233,210,150,.18)" : "none" }}>
                <div className="gg-serif" style={{ fontSize: 13, color: T.goldBright }}>
                  {l.ab ? t("banner.learnsAbility", { ch: l.nm, ab: en ? l.ab.nameEn : l.ab.nameDe })
                    : l.shield ? t("banner.gainsShield", { ch: l.nm, n: l.shield })
                    : t("banner.gambitTier", { r: l.tier })}
                </div>
                {l.ab && <div style={{ fontSize: 11.5, color: T.dim, lineHeight: 1.45, marginTop: 2 }}>
                  {en ? l.ab.descEn : l.ab.descDe}</div>}
              </div>
            ))}
          </div>
        )}
        {campaign ? (
          win
            ? (unlockId && onArmy
              ? <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <Button variant="primary" onClick={onArmy}>{t("banner.toArmy")} ›</Button>
                  <Button variant="subtle" onClick={onExit}>{t("camp.back")}</Button>
                </div>
              : <Button variant="primary" style={{ width: "100%" }} onClick={onExit}>{t("camp.back")}</Button>)
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
