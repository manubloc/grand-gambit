// Online duel lobby — connect to a Grand Gambit server, manage your friend
// list and privacy, then find an evenly-matched foe: random matchmaking pairs
// players by retinue score, or challenge an online friend directly.
import { useEffect, useMemo, useRef, useState } from "react";
import { T } from "../theme.js";
import crest3 from "../assets/crest-3.webp";
import { LaurelIc, PigeonIc, CloudIc, BladesIc, DiceIc, TrophyIc } from "../icons.jsx";
import { Button, Chip, Panel, Segmented, PanelTitle } from "../primitives.jsx";
import { retinueScore, mapUnlocked, buildArmy, buildArmyFromFormation, listSaves, fmtPlaytime } from "../../../meta/index.js";
import { MAPS, mapById } from "../../../content/index.js";
import { SERVER_URL } from "../../config.js";
import { hasItem } from "../../../content/index.js";
import { serializeSave, parseSave, getAdminToken } from "../../../meta/index.js";
import { useMedia } from "../../App.jsx";


// ── the herald's book: roll a name worthy of the halls ────────────────────────
// Two patterns, one promise: the same name never falls twice in a session.
// (1) "Vorname Beiname" — Maera Salzherz   (2) "EhernerFalke IX" — fused seal.
const TAG_FIRST = ["Alric","Brenna","Cedrik","Dara","Edran","Falka","Gorm","Hedda","Iwain","Jorga",
  "Kellan","Lioba","Merek","Nyra","Odwin","Perra","Quinlan","Runa","Sarik","Talvi",
  "Ulfa","Varek","Wenna","Ylva","Zoran","Oswina","Marrek","Isbeth","Rodrik","Fenja",
  "Torvin","Ysmay","Aldra","Bertram","Corva","Dagny"];
const TAG_EPI = { de: ["Salzherz","Rabenruf","Nachtklinge","Grimmzahn","Eisenlied","Aschewandler","Frostauge",
    "Dornenkuss","Schattenschritt","Goldzunge","Wolfsmond","Bleichfeuer","Splitterkrone","Nebelgänger",
    "Siebenklingen","Sternenleser","Salzkrähe","Glutfinger","Rissgänger","Kelchdieb","Zwielichter",
    "Sturmfaust","Kaltglut","Ebenholz","Bernsteinblick","Leisetritt","Dreizung","Winterkuss",
    "Halbmond","Fährtenfluch","Turmschläfer","Damenopfer"],
  en: ["Saltheart","Ravencall","Nightblade","Grimfang","Ironsong","Ashwalker","Frosteye",
    "Thornkiss","Shadowstep","Goldtongue","Wolfmoon","Palefire","Splintercrown","Mistwalker",
    "Sevenblades","Starreader","Saltcrow","Emberfinger","Riftwalker","Cupthief","Twilighter",
    "Stormfist","Coldglow","Ebonwood","Amberglance","Softstep","Threetongue","Winterkiss",
    "Halfmoon","Trailcurse","Towersleeper","Queensgambit"] };
const TAG_A = { de: ["Eherner","Goldener","Stiller","Kühner","Dunkler","Grauer","Rastloser","Letzter",
    "Wandernder","Eiserner","Junger","Listiger","Bleicher","Zorniger","Sanfter","Namenloser",
    "Gezeichneter","Schlafloser","Ungekrönter","Verlorener"],
  en: ["Iron","Gilded","Silent","Bold","Dark","Grey","Restless","Last",
    "Wandering","Brazen","Young","Cunning","Pale","Wrathful","Gentle","Nameless",
    "Marked","Sleepless","Uncrowned","Lost"] };
const TAG_N = { de: ["Turm","Läufer","Springer","Gambit","Wächter","Falke","Drache","Paladin",
    "Schatten","Kanzler","Bauer","Stratege","Rabe","Kelch","Riss","Herold",
    "Tyrann","Kapitän","Schwur","Leuchtturm"],
  en: ["Rook","Bishop","Knight","Gambit","Warden","Hawk","Drake","Paladin",
    "Shadow","Chancellor","Pawn","Strategist","Raven","Chalice","Rift","Herald",
    "Tyrant","Captain","Vow","Beacon"] };
const ROMAN = ["", "", " II", " III", " IV", " VII", " IX", " XI", " XIII"];
const rolledTags = new Set(); // the herald never calls the same name twice tonight
const rollTag = (en) => {
  const L = en ? "en" : "de", r = (a) => a[Math.floor(Math.random() * a.length)];
  for (let i = 0; i < 24; i++) {
    const tag = Math.random() < 0.55
      ? r(TAG_FIRST) + " " + r(TAG_EPI[L])
      : r(TAG_A[L]) + (en ? " " : "") + r(TAG_N[L]) + r(ROMAN);
    if (tag.length <= 24 && !rolledTags.has(tag)) { rolledTags.add(tag); return tag; }
  }
  const tag = (r(TAG_FIRST) + " " + r(TAG_EPI[L])).slice(0, 20) + " " + (11 + Math.floor(Math.random() * 88));
  rolledTags.add(tag); return tag;
};
// The figures a player sees on their own profile, mirrored to the Hall so the
// admin can survey everyone. Same numbers, nothing private.
function buildStats(profile, playtimeSec) {
  const st = profile.stats || {};
  return {
    games: st.games || 0, wins: st.wins || 0, losses: st.losses || 0, draws: st.draws || 0,
    league: profile.campaign?.league || 1,
    stagesCleared: st.stagesCleared || 0, bossKills: st.bossKills || 0,
    xp: profile.xpEarned || 0, playtimeSec: playtimeSec || 0,
  };
}
export function OnlineScreen({ profile, dispatch, t, net, account }) {
  const en = profile.lang === "en";
  const o = profile.online || {};
  const score = useMemo(() => retinueScore(profile), [profile]);
  const myMaps = useMemo(() => MAPS.filter((m) => mapUnlocked(profile, m.id)).map((m) => m.id), [profile]);
  const armyFor = (mapId) => buildArmy(profile, mapById(mapId));
  // classic online: pure standard chess — the plain level-1 side, mate rules
  const [duelMode, setDuelMode] = useState("duel"); // duel | classic
  const [duelMapChoice, setDuelMapChoice] = useState("random"); // "random" | a map id from myMaps
  const classicSide = () => buildArmyFromFormation(() => 1, mapById("classic").defaultFormation);
  const queueMaps = () => {
    if (duelMode === "classic") return ["classic"];
    if (duelMapChoice !== "random" && myMaps.includes(duelMapChoice)) return [duelMapChoice];
    return myMaps;
  };
  // One saved formation per candidate map, keyed by map id — so whichever map
  // the matchmaker (or a friend's client) actually settles on, the army sent
  // to battle is the one you arranged FOR that exact board, never a mismatch.
  const armiesFor = (maps) => duelMode === "classic"
    ? { classic: classicSide() }
    : Object.fromEntries(maps.map((m) => [m, armyFor(m)]));
  const queueArmies = () => armiesFor(queueMaps());
  const queueArmy = () => { const maps = queueMaps(); return queueArmies()[maps[0]]; }; // legacy single-army fallback

  const [server, setServer] = useState(SERVER_URL || o.server || "");
  const name = profile.name || "Spieler " + (o.id || "").slice(0, 4);
  const [tagDraft, setTagDraft] = useState(profile.name || rollTag(en));
  const [conn, setConn] = useState(net.open ? "on" : "off"); // off | busy | on | fail
  const [waitSec, setWaitSec] = useState(0);
  const [onlineN, setOnlineN] = useState(0);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searching, setSearching] = useState(false);
  const [code, setCode] = useState("");
  const [note, setNote] = useState("");
  const [challenge, setChallenge] = useState(null); // incoming {challengeId, from}
  const [lb, setLb] = useState(null);
  const noteT = useRef(null);
  const flash = (msg) => { setNote(msg); clearTimeout(noteT.current); noteT.current = setTimeout(() => setNote(""), 3200); };

  useEffect(() => {
    const subs = [
      net.on("welcome", (m) => { setConn("on"); setOnlineN(m.online || 0); }),
      net.on("friends", (m) => { setFriends(m.friends || []); setRequests(m.requests || []); }),
      net.on("challenge", (m) => setChallenge(m)),
      net.on("challengeDeclined", () => flash(t("online.decline"))),
      net.on("info", (m) => flash(m.info === "requestSent" ? t("online.requestSent") : t("online.challengeSent"))),
      net.on("error", (m) => flash(t("online.err", { e: m.error }))),
      net.on("match", () => { setSearching(false); setChallenge(null); }),
      net.on("leaderboard", (m) => setLb(m)),
      net.on("vault", (m) => setVault(m.list || [])),
      net.on("admin", (m) => { if (m.cmd === "dump") setUsers(Array.isArray(m.players) ? m.players : Object.values(m.players || {})); }),
      net.on("vaultSave", (m) => {
        try {
          const prof = parseSave(m.save);
          if (confirm(t("online.vaultConfirm"))) dispatch({ type: "REPLACE", profile: prof });
        } catch { flash(t("profile.saveBad")); }
      }),
      net.on("giftSent", () => { dispatch({ type: "SET_ONLINE", online: { ...(profile.online || {}), giftLeague: profile.campaign?.league || 1 } }); flash(t("online.giftSent")); }),
      net.on("gift", (m) => flash(t("online.giftGot", { name: m.from }))),
      net.on("welcome", () => net.send({ t: "leaderboard" })),
      net.on("welcome", () => net.send({ t: "vaultList" })),
      net.on("close", () => { setConn("off"); setSearching(false); }),
    ];
    return () => subs.forEach((u) => u());
  }, [net]); // eslint-disable-line

  // elapsed timer for the matchmaking queue
  useEffect(() => {
    if (!searching) { setWaitSec(0); return; }
    const id = setInterval(() => setWaitSec((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [searching]);

  // it should just work: connect automatically the moment this screen opens
  useEffect(() => { if (conn === "off" && server && o.tagSet) connect(); }, []); // eslint-disable-line

  // keep the server informed when score/privacy change while connected
  useEffect(() => { if (net.open) net.send({ t: "set", score }); }, [score]); // eslint-disable-line

  const [askConsent, setAskConsent] = useState(false);
  const [vault, setVault] = useState(null);
  const [myPlaytime, setMyPlaytime] = useState(0);
  const [users, setUsers] = useState(null);          // admin: the whole roster
  // total playtime across this account's save slots (mirrored for the admin)
  useEffect(() => { let ok = true; (async () => {
    try { const list = await listSaves(account.id); const tot = (list || []).reduce((a, s) => a + (s.playtimeSec || 0), 0); if (ok) setMyPlaytime(tot); } catch {}
  })(); return () => { ok = false; }; }, [account.id]);
  // keep the Hall's mirror of my stats fresh while connected
  useEffect(() => {
    if (conn !== "on" || !net.open) return;
    try { net.send({ t: "set", stats: buildStats(profile, myPlaytime) }); } catch {}
  }, [conn, profile, myPlaytime]);
  async function connect(force = false) {
    if (!server) return;
    if (!force && !profile.notices?.online) { setAskConsent(true); return; }
    setConn("busy");
    dispatch({ type: "SET_ONLINE", online: { ...o, server } });
    try {
      await net.connect(server, { id: o.id, secret: o.secret, name, score, privacy: o.privacy || "public", stats: buildStats(profile, myPlaytime) });
    } catch { setConn("fail"); }
  }
  function setPrivacy(privacy) {
    dispatch({ type: "SET_ONLINE", online: { ...o, privacy } });
    if (net.open) net.send({ t: "set", privacy });
  }
  function findRandom() {
    if (searching) { net.send({ t: "dequeue" }); setSearching(false); return; }
    net.send({ t: "queue", maps: queueMaps(), army: queueArmy(), armies: queueArmies(), mode: duelMode });
    setSearching(true);
  }
  const challengeFriend = (f) => { const maps = queueMaps(); net.send({ t: "challenge", targetId: f.id, maps, army: duelMode === "classic" ? classicSide() : armyFor(maps[0]), armies: armiesFor(maps), mode: duelMode }); };

  const Line = ({ children }) => <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>{children}</div>;
  const input = { flex: 1, minWidth: 120, background: T.bg2, border: `1px solid ${T.line}`, color: T.text,
    borderRadius: T.radiusSm, padding: "10px 12px", fontSize: 16, fontFamily: "inherit" };

  const wideOn = useMedia("(min-width: 980px)");
  return (
    <div style={{ display: "grid", gap: 12, gridTemplateColumns: wideOn ? "1.1fr 1fr" : "1fr", alignItems: "start" }}>
      <Panel>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="gg-serif" style={{ fontSize: 18, color: T.gold, letterSpacing: ".05em", marginBottom: 4 }}>{t("online.title")}</div>
            <div style={{ fontSize: 12.5, color: T.dim, marginBottom: 10 }}>{t("online.sub")}</div>
          </div>
          {/* the crest of the keep watches over every online bout */}
          <img src={crest3} alt="" aria-hidden style={{ width: 52, height: 62, objectFit: "contain", flex: "0 0 auto",
            marginTop: -2, filter: "drop-shadow(0 3px 7px rgba(0,0,0,.5))" }} />
        </div>
        {!o.tagSet ? (
          <div style={{ padding: "12px 13px", background: T.panel2, border: `1.5px solid ${T.gold}88`, borderRadius: T.radiusSm }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: T.gold, marginBottom: 4 }}>{t("online.tagTitle")}</div>
            <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.5, marginBottom: 10 }}>{t("online.tagBody")}</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input value={tagDraft} maxLength={24} onChange={(e) => setTagDraft(e.target.value)}
                style={{ flex: 1, minWidth: 0, background: T.bg2, color: T.text, border: `1px solid ${T.line}`,
                  borderRadius: 10, padding: "9px 11px", fontFamily: "inherit", fontSize: 14 }} />
              <Button variant="subtle" title={t("online.tagRoll")} onClick={() => setTagDraft(rollTag(en))}
                style={{ padding: "7px 13px", display: "inline-grid", placeItems: "center" }}><DiceIc size={18} /></Button>
            </div>
            <Button variant="primary" disabled={!tagDraft.trim()} onClick={() => {
              dispatch({ type: "SET_NAME", name: tagDraft.trim() });
              dispatch({ type: "SET_ONLINE", online: { tagSet: true } });
            }}>{t("online.tagOk")}</Button>
          </div>
        ) : conn !== "on" ? (
          <div style={{ display: "grid", gap: 10 }}>
            {askConsent && (
              <div style={{ padding: "11px 12px", background: T.panel2, border: `1.5px solid ${T.gold}88`, borderRadius: T.radiusSm }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: T.gold, marginBottom: 5 }}><PigeonIc size={13} /> {t("online.consentTitle")}</div>
                <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.55, marginBottom: 10 }}>{t("online.consentBody")}{" "}
                  <a href="./privacy.html" target="_blank" rel="noreferrer" style={{ color: T.gold }}>{t("privacy.link")}</a></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <Button variant="primary" onClick={() => { setAskConsent(false); dispatch({ type: "SET_NOTICE", key: "online" }); connect(true); }}>{t("online.consentOk")}</Button>
                  <Button variant="subtle" onClick={() => setAskConsent(false)}>{t("online.cancel")}</Button>
                </div>
              </div>
            )}
            {conn === "busy" && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 6px" }}>
                <span style={{ width: 22, height: 22, border: `2.5px solid ${T.line}`, borderTopColor: T.gold,
                  borderRadius: "50%", animation: "spin .9s linear infinite" }} />
                <span style={{ fontSize: 14, color: T.dim }}>{t("online.connecting")}</span>
              </div>
            )}
            {conn !== "busy" && !server && (
              <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.55 }}>{t("online.noServer")}</div>
            )}
            {conn === "fail" && server && (
              <>
                <div style={{ fontSize: 13.5, color: T.danger }}>{t("online.unreachable")}</div>
                <Button variant="primary" onClick={connect}>{t("online.retry")}</Button>
              </>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            <Line>
              <Chip color={T.limeInk} bg={T.lime}>{t("online.connected")}</Chip>
              <Chip color={T.text} bg={T.panel2}>{t("online.players", { n: onlineN })}</Chip>
              <Chip color={T.gold} bg={T.panel2}>{t("online.score")}: {score}</Chip>
              <span style={{ flex: 1 }} />
              <Button variant="subtle" onClick={() => net.close()} style={{ padding: "7px 12px", fontSize: 12.5 }}>{t("online.disconnect")}</Button>
            </Line>
            <Line>
              <span style={{ fontSize: 12.5, color: T.dim }}>{t("online.privacy")}:</span>
              <Segmented value={o.privacy || "public"} onChange={setPrivacy}
                options={[{ id: "public", label: t("online.public") }, { id: "friends", label: t("online.friendsOnly") }]} />
            </Line>
            {!searching ? (<>
              <Segmented value={duelMode} onChange={(m) => { if (searching) { net.send({ t: "dequeue" }); setSearching(false); } setDuelMode(m); }}
                options={[{ value: "duel", label: t("online.duel") }, { value: "classic", label: t("mode.classic") }]} />
              {duelMode === "duel" && myMaps.length > 1 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 11.5, color: T.faint, marginBottom: 5 }}>{t("online.mapChoice")}</div>
                  <Segmented value={duelMapChoice} onChange={setDuelMapChoice}
                    options={[{ value: "random", label: t("online.mapRandom") },
                      ...myMaps.map((m) => ({ value: m, label: en ? mapById(m).nameEn : mapById(m).nameDe }))]} />
                </div>
              )}
              <div style={{ fontSize: 11.5, color: T.dim, margin: "8px 2px 0", lineHeight: 1.5 }}>
                {duelMode === "classic" ? t("online.infoClassic") :
                  duelMapChoice === "random" ? t("online.infoRandomMap") :
                  t("online.infoFixedMap", { map: en ? mapById(duelMapChoice).nameEn : mapById(duelMapChoice).nameDe })}
              </div>
              <div style={{ height: 8 }} />
              <Button variant="primary" onClick={findRandom} style={{ padding: "14px", fontSize: 15.5 }}>
                <BladesIc color={T.limeInk} size={13} /> {t("online.random")}
              </Button>
            </>) : (
              <div style={{ display: "grid", placeItems: "center", gap: 10, padding: "18px 10px 14px",
                background: T.panel2, borderRadius: T.radius, border: `1px solid ${T.gold}44` }}>
                <div style={{ position: "relative", width: 74, height: 74, display: "grid", placeItems: "center" }}>
                  <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2.5px solid ${T.gold}`,
                    animation: "queuePulse 1.6s ease-in-out infinite" }} />
                  <span style={{ position: "absolute", inset: 10, borderRadius: "50%", border: `2px solid ${T.gold}88`,
                    animation: "queuePulse 1.6s ease-in-out .35s infinite" }} />
                  <span className="gg-serif" style={{ fontSize: 20, color: T.gold, fontWeight: 700 }}>
                    {Math.floor(waitSec / 60)}:{String(waitSec % 60).padStart(2, "0")}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: T.gold, textAlign: "center" }}>{t("online.searching")}</div>
                <div style={{ fontSize: 11.5, color: T.faint }}>{t("online.band", { n: 150 + Math.floor(waitSec / 5) * 60 })}</div>
                {onlineN <= 1 && <div style={{ fontSize: 11.5, color: T.faint, textAlign: "center", maxWidth: 240 }}>{t("online.noOneHint")}</div>}
                <Button variant="subtle" onClick={findRandom} style={{ padding: "8px 18px" }}>{t("online.cancel")}</Button>
              </div>
            )}
          </div>
        )}
        {note && <div style={{ marginTop: 8, fontSize: 12.5, color: T.gold }}>{note}</div>}
      </Panel>

      {conn === "on" && (
        <Panel>
          <div className="gg-serif" style={{ fontSize: 15.5, color: T.text, letterSpacing: ".05em", marginBottom: 8 }}>{t("online.friends")}</div>
          <div style={{ fontSize: 12.5, color: T.dim, marginBottom: 8 }}>
            {t("online.myCode")}: <b style={{ color: T.gold, letterSpacing: ".08em" }}>{o.id}</b>
          </div>
          <Line>
            <input style={input} value={code} onChange={(e) => setCode(e.target.value.trim())} placeholder={t("online.codePh")} maxLength={12} />
            <Button variant="subtle" onClick={() => { if (code) { net.send({ t: "friendRequest", code }); setCode(""); } }}
              style={{ padding: "9px 14px" }}>{t("online.send")}</Button>
          </Line>
          {requests.length > 0 && <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 12, color: T.dim, marginBottom: 6 }}>{t("online.requests")}</div>
            {requests.map((r) => (
              <Line key={r.id}>
                <span style={{ fontSize: 13.5, flex: 1 }}>{r.name} <span style={{ color: T.faint }}>({r.id})</span></span>
                <Button variant="primary" style={{ padding: "6px 11px", fontSize: 12.5 }}
                  onClick={() => net.send({ t: "friendRespond", id: r.id, accept: true })}>{t("online.accept")}</Button>
                <Button variant="subtle" style={{ padding: "6px 11px", fontSize: 12.5 }}
                  onClick={() => net.send({ t: "friendRespond", id: r.id, accept: false })}>{t("online.decline")}</Button>
              </Line>
            ))}
          </div>}
          <div style={{ marginTop: 10, display: "grid", gap: 7 }}>
            {friends.length === 0 && <div style={{ fontSize: 12.5, color: T.faint }}>—</div>}
            {friends.map((f) => (
              <Line key={f.id}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: f.online ? T.green : T.faint }} />
                <span style={{ fontSize: 13.5, flex: 1 }}>{f.name} <span style={{ color: T.faint, fontSize: 11.5 }}>{f.online ? f.score : t("online.offline")}</span></span>
                {f.online && hasItem(profile, "brieftaube") && (
                  (profile.online?.giftLeague || 0) === (profile.campaign?.league || 1)
                    ? <span style={{ fontSize: 11, color: T.faint }}><PigeonIc color={T.faint} size={12} /> ✓</span>
                    : <Button variant="subtle" style={{ padding: "6px 9px", fontSize: 12.5 }} title={t("online.gift")}
                        onClick={() => { net.send({ t: "gift", to: f.id }); }}><PigeonIc color={T.limeInk} size={14} /></Button>
                )}
                {f.online && <Button variant="subtle" style={{ padding: "6px 11px", fontSize: 12.5 }}
                  onClick={() => challengeFriend(f)}><BladesIc color={T.limeInk} size={12} /> {t("online.challenge")}</Button>}
              </Line>
            ))}
          </div>
        </Panel>
      )}

      {conn === "on" && account?.isAdmin && (<>
        <Panel>
          <PanelTitle><CloudIc size={13} /> {t("online.vaultTitle")}</PanelTitle>
          <div style={{ fontSize: 12, color: T.dim, margin: "2px 0 10px" }}>{t("online.vaultHint")}</div>
          <Button variant="subtle" style={{ width: "100%", marginBottom: 8 }} onClick={() => {
            net.send({ t: "vaultPush", save: serializeSave(profile),
              meta: { league: profile.campaign?.league || 1, gold: profile.gold || 0 } });
            flash(t("online.vaultSaved"));
          }}>⬆ {t("online.vaultNow")}</Button>
          {(vault || []).length > 0 && <div style={{ display: "grid", gap: 6 }}>
            {vault.map((e) => (
              <div key={e.ts} style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 10px",
                background: T.panel2, borderRadius: T.radiusSm, border: `1px solid ${T.line}` }}>
                <span style={{ fontSize: 12.5, flex: 1 }}>
                  <b>{new Date(e.ts).toLocaleString(undefined, { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</b>
                  <span style={{ color: T.faint, fontSize: 11.5 }}> · {t("profile.rpMeta", { league: e.league, gold: e.gold })}</span>
                </span>
                <Button variant="subtle" style={{ padding: "5px 10px", fontSize: 12 }}
                  onClick={() => net.send({ t: "vaultPull", ts: e.ts })}>↩</Button>
              </div>
            ))}
          </div>}
        </Panel>

        <Panel>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            <div className="gg-serif" style={{ fontSize: 15.5, color: T.text, letterSpacing: ".05em", flex: 1, display: "flex", alignItems: "center", gap: 7 }}><TrophyIc size={16} color={"#d9b264"} /> {t("online.leaderboard")}</div>
            <Button variant="subtle" style={{ padding: "6px 11px", fontSize: 12 }} onClick={() => net.send({ t: "leaderboard" })}>{t("online.refresh")}</Button>
          </div>
          {!lb ? <div style={{ fontSize: 12.5, color: T.faint }}>—</div> : <>
            <div style={{ display: "grid", gap: 5 }}>
              {lb.top.map((r, i) => {
                const isMe = r.id === o.id;
                return (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 9px",
                    borderRadius: T.radiusSm, background: isMe ? T.lime + "1e" : "transparent",
                    border: isMe ? `1px solid ${T.lime}66` : "1px solid transparent" }}>
                    <span style={{ width: 24, textAlign: "center", fontSize: 13 }}>{i < 3 ? <LaurelIc rank={i + 1} size={16} /> : <span style={{ color: T.faint, fontWeight: 800 }}>{i + 1}</span>}</span>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: r.online ? T.green : T.faint, flex: "none" }} />
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: isMe ? 800 : 500, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                    <span style={{ fontSize: 11.5, color: T.dim }}>{r.wins}/{r.losses}</span>
                    <span style={{ fontWeight: 900, color: T.gold, fontSize: 13.5, width: 44, textAlign: "right" }}>{r.rating}</span>
                  </div>
                );
              })}
            </div>
            {lb.me && lb.me.rank > 20 && (
              <div style={{ marginTop: 7, fontSize: 12.5, color: T.dim }}>
                #{lb.me.rank} · {lb.me.name} · <b style={{ color: T.gold }}>{lb.me.rating}</b>
              </div>
            )}
          </>}
        </Panel>

        <Panel>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            <div className="gg-serif" style={{ fontSize: 15.5, color: T.text, letterSpacing: ".05em", flex: 1 }}>
              {en ? "Users" : "Nutzer"}{users ? ` · ${users.length}` : ""}</div>
            <Button variant="subtle" style={{ padding: "6px 11px", fontSize: 12 }}
              onClick={() => { const tok = getAdminToken(); if (!tok) { flash(en ? "No admin token set (Profile → Reports)" : "Kein Admin-Token gesetzt (Profil → Fehlerberichte)"); return; } net.send({ t: "admin", cmd: "dump", token: tok }); }}>
              {users ? t("online.refresh") : (en ? "Load" : "Laden")}</Button>
          </div>
          <div style={{ fontSize: 11.5, color: T.faint, margin: "-2px 0 9px", lineHeight: 1.45 }}>
            {en ? "Everyone who has gone online. Offline-only players stay on their own device."
                : "Alle, die online waren. Reine Offline-Spieler bleiben auf ihrem Gerät."}</div>
          {!users ? <div style={{ fontSize: 12.5, color: T.faint }}>—</div>
            : users.length === 0 ? <div style={{ fontSize: 12.5, color: T.faint }}>{en ? "No users yet." : "Noch keine Nutzer."}</div>
            : <div style={{ display: "grid", gap: 6 }}>
              {[...users].sort((a, b) => (b.seen || 0) - (a.seen || 0)).map((u) => {
                const st = u.stats || {};
                return (
                  <div key={u.id} style={{ padding: "8px 10px", background: T.panel2, borderRadius: T.radiusSm, border: `1px solid ${T.line}` }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 800, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</span>
                      {u.rating != null && <span style={{ fontWeight: 900, color: T.gold, fontSize: 13 }}>ELO {u.rating}</span>}
                    </div>
                    <div style={{ fontSize: 11.5, color: T.dim, marginTop: 3, display: "flex", flexWrap: "wrap", gap: "2px 9px" }}>
                      <span>{en ? "League" : "Liga"} {st.league || 1}</span>
                      <span>· {fmtPlaytime(st.playtimeSec || 0)}</span>
                      <span>· {st.games || 0} {en ? "games" : "Spiele"}</span>
                      <span>· {u.wins}/{u.losses}/{u.draws} {en ? "duels" : "Duelle"}</span>
                      {st.stagesCleared ? <span>· {st.stagesCleared} {en ? "stages" : "Etappen"}</span> : null}
                      {u.seen ? <span style={{ color: T.faint }}>· {new Date(u.seen).toLocaleDateString(en ? "en" : "de", { day: "2-digit", month: "2-digit", year: "2-digit" })}</span> : null}
                    </div>
                  </div>
                );
              })}
            </div>}
        </Panel>
      </>)}

      {challenge && (
        <div style={{ position: "fixed", inset: 0, zIndex: 40, display: "grid", placeItems: "center", background: "rgba(8,10,14,.7)", padding: 16 }}>
          <Panel style={{ maxWidth: 340, width: "100%" }}>
            <div className="gg-serif" style={{ fontSize: 17, color: T.gold, marginBottom: 6 }}>
              <BladesIc size={13} /> {t("online.challengeFrom", { name: challenge.from.name })}
            </div>
            <div style={{ fontSize: 12.5, color: T.dim, marginBottom: 12 }}>{t("online.score")}: {challenge.from.score}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Button variant="primary" onClick={() => {
                net.send({ t: "challengeRespond", challengeId: challenge.challengeId, accept: true, maps: myMaps, army: challenge.mode === "classic" ? classicSide() : armyFor(myMaps[0]), armies: challenge.mode === "classic" ? { classic: classicSide() } : armiesFor(myMaps) });
                setChallenge(null);
              }}>{t("online.accept")}</Button>
              <Button variant="subtle" onClick={() => {
                net.send({ t: "challengeRespond", challengeId: challenge.challengeId, accept: false });
                setChallenge(null);
              }}>{t("online.decline")}</Button>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
