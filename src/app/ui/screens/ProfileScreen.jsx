import { useState } from "react";
import { hashPin } from "../../../platform/index.js";
import { serializeSave, parseSave, listRestorePoints, readSnapshot, withProgressPct, listReports, clearLocalReports, getAdminToken, setAdminToken } from "../../../meta/index.js";
import { CHARACTERS } from "../../../content/index.js";
import { useEffect } from "react";
import { T } from "../theme.js";
import { Panel, Button, Segmented, Stat, PanelTitle } from "../primitives.jsx";
import { GildedFrame, goldText, GoldRule } from "../Gilded.jsx";
import { getDeferredInstall, onInstallReady, promptInstall } from "../InstallBanner.jsx";

const inApp = () =>
  (typeof matchMedia !== "undefined" && matchMedia("(display-mode: standalone)").matches) ||
  (typeof navigator !== "undefined" && navigator.standalone === true);

export function ProfileScreen({ profile, dispatch, t, account, onSwitchSave, onLogout }) {
  const [devPct, setDevPct] = useState(0); // workbench: journey progress slider
  const [devLg, setDevLg] = useState(profile.campaign?.league || 1); // workbench: league pick — applied together with the dial via SETZEN
  const [pin, setPin] = useState("");
  // manual install entry — the banner is missable, this one always waits here
  const [canPrompt, setCanPrompt] = useState(() => !!getDeferredInstall());
  const [showIosHint, setShowIosHint] = useState(false);
  useEffect(() => onInstallReady(() => setCanPrompt(true)), []);
  const s = profile.stats;

  async function setPinProtect() {
    if (pin.length < 4) return;
    const record = await hashPin(pin);
    dispatch({ type: "SET_PIN", pin: record });
    setPin("");
  }

  return <div style={{ display: "grid", gap: 12 }}>
    <GildedFrame center pad="15px 16px 13px">
      <div className="gg-serif" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: ".3em",
        ...goldText, filter: "drop-shadow(0 1px 1px rgba(0,0,0,.5))" }}>{t("profile.title")}</div>
      <GoldRule margin="8px 18%" />
      <div className="gg-serif" style={{ fontSize: 22, letterSpacing: ".04em", color: T.goldBright }}>
        {profile.name || account?.name || "—"}</div>
      {account?.name && <div style={{ fontSize: 12, color: T.dim, marginTop: 3 }}>
        {account.name}{account.isAdmin && String(account.name).trim().toLowerCase() !== "admin" ? " · Admin" : ""}</div>}
    </GildedFrame>
    <Panel>
      <div style={{ fontSize: 12, color: T.faint, marginBottom: 6 }}>{t("profile.name")}</div>
      <input value={profile.name} placeholder={t("profile.namePh")} onChange={(e) => dispatch({ type: "SET_NAME", name: e.target.value })}
        style={{ width: "100%", background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 10, color: T.text, padding: "11px 12px", fontSize: 16, outline: "none" }} />
      <div style={{ fontSize: 12, color: T.faint, margin: "14px 0 6px" }}>{t("profile.pieceStyle")}</div>
      <Segmented value={profile.pieceStyle === "svg" ? "svg" : "painted"}
        onChange={(v) => dispatch({ type: "REPLACE", profile: { ...profile, pieceStyle: v } })}
        options={[{ value: "painted", label: t("profile.stylePainted") }, { value: "svg", label: t("profile.styleSvg") }]} />
      <div style={{ fontSize: 11.5, color: T.faint, margin: "5px 2px 0", lineHeight: 1.45 }}>{t("profile.pieceStyleHint")}</div>
      <div style={{ fontSize: 12, color: T.faint, margin: "14px 0 6px" }}>{t("profile.lang")}</div>
      <Segmented value={profile.lang} onChange={(v) => dispatch({ type: "SET_LANG", lang: v })}
        options={[{ value: "de", label: "Deutsch" }, { value: "en", label: "English" }]} />
      <div style={{ fontSize: 12, color: T.faint, margin: "14px 0 6px" }}>{t("profile.campDiff")}</div>
      <Segmented value={profile.campDifficulty || "normal"} onChange={(v) => dispatch({ type: "SET_CAMP_DIFFICULTY", difficulty: v })}
        options={[{ value: "gentle", label: t("profile.diffGentle") }, { value: "normal", label: t("profile.diffNormal") }, { value: "brutal", label: t("profile.diffBrutal") }]} />
      <div style={{ fontSize: 11.5, color: T.gold, margin: "6px 2px 0", letterSpacing: 0.2 }}>
        {t("profile.campDiffElo_" + (profile.campDifficulty || "normal"))}</div>
      <div style={{ fontSize: 11.5, color: T.faint, margin: "3px 2px 0", lineHeight: 1.45 }}>{t("profile.campDiffHint")}</div>
      <div style={{ fontSize: 12, color: T.faint, margin: "16px 0 6px" }}>{t("profile.session")}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {onSwitchSave && <Button kind="ghost" onClick={onSwitchSave}>{t("profile.switchSave")}</Button>}
        {onLogout && <Button kind="ghost" onClick={onLogout}>{t("profile.signout")}</Button>}
      </div>
      <div style={{ fontSize: 11.5, color: T.faint, marginTop: 5, lineHeight: 1.45 }}>{t("profile.artHint")}</div>
      {!inApp() && (() => {
        // Safari on iPhone/iPad has NO install prompt at all — the ONLY road is
        // Share → "Add to Home Screen". So on iOS we show the walking
        // directions right away instead of a button that cannot do anything.
        const isIos = typeof navigator !== "undefined" && (/iPad|iPhone|iPod/.test(navigator.userAgent)
          || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
        return <>
        <div style={{ fontSize: 12, color: T.faint, margin: "14px 0 6px" }}>{t("profile.install")}</div>
        {isIos && !canPrompt ? (
          <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.6, padding: "10px 12px",
            background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 10 }}>{t("profile.installIos")}</div>
        ) : <>
          <Button style={{ width: "100%" }} onClick={async () => {
            if (canPrompt) { await promptInstall(); setCanPrompt(false); }
            else setShowIosHint(true);
          }}>{t("profile.installBtn")}</Button>
          {showIosHint && !canPrompt && (
            <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.55, marginTop: 8 }}>{t("profile.installHint")}</div>
          )}
        </>}
      </>; })()}
    </Panel>

    <Panel>
      <div className="gg-serif" style={{ fontSize: 15, letterSpacing: ".1em", textTransform: "uppercase", color: T.dim }}>{t("profile.record")}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
        <Stat label={t("profile.wins")} value={s.wins || 0} />
        <Stat label={t("profile.losses")} value={s.losses || 0} />
        <Stat label={t("profile.draws")} value={s.draws || 0} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
        <Stat label={t("profile.games")} value={s.games || 0} />
        <Stat label={t("profile.winrate")} value={`${Math.round(100 * (s.wins || 0) / Math.max(1, (s.wins || 0) + (s.losses || 0)))}%`} />
        <Stat label={t("profile.bestStreak")} value={s.bestStreak || 0} />
      </div>
    </Panel>

    <Panel>
      <div className="gg-serif" style={{ fontSize: 15, letterSpacing: ".1em", textTransform: "uppercase", color: T.dim }}>{t("profile.journey")}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
        <Stat label={t("profile.stages")} value={s.stagesCleared || 0} />
        <Stat label={t("profile.bosses")} value={s.bossKills || 0} />
        <Stat label={t("profile.recruits")} value={s.recruits || 0} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
        <Stat label={t("profile.upgrades")} value={s.upgrades || 0} />
        <Stat label={t("profile.captures")} value={s.captures || 0} />
        <Stat label={t("profile.xpTotal")} value={profile.xpEarned || 0} />
      </div>
      {profile.online?.rating != null && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12,
          padding: "10px 12px", background: T.panel2, borderRadius: T.radiusSm, border: `1px solid ${T.gold}44` }}>
          <span className="gg-serif" style={{ fontSize: 13, letterSpacing: ".08em", color: T.dim }}>ELO · {t("online.title")}</span>
          <span style={{ fontWeight: 900, fontSize: 18, color: T.gold }}>{profile.online.rating}</span>
        </div>
      )}
    </Panel>

    {account?.isAdmin && <Panel>
      <PanelTitle tag="Admin">{t("profile.saveTitle")}</PanelTitle>
      <div style={{ fontSize: 12, color: T.dim, margin: "2px 0 12px" }}>{t("profile.saveHint")}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Button variant="subtle" onClick={() => {
          const blob = new Blob([serializeSave(profile)], { type: "application/json" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `grand-gambit-save-${new Date().toISOString().slice(0, 10)}.json`;
          a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        }}>⬇ {t("profile.saveExport")}</Button>
        <Button variant="subtle" onClick={() => {
          const inp = document.createElement("input");
          inp.type = "file"; inp.accept = ".json,application/json";
          inp.onchange = async () => {
            const f = inp.files?.[0]; if (!f) return;
            try {
              const next = parseSave(await f.text());
              if (confirm(t("profile.saveConfirm"))) dispatch({ type: "REPLACE", profile: next });
            } catch { alert(t("profile.saveBad")); }
          };
          inp.click();
        }}>⬆ {t("profile.saveImport")}</Button>
      </div>
    </Panel>}

    {account?.isAdmin && <Panel>
      <PanelTitle tag="Admin">{t("profile.devTitle")}</PanelTitle>
      <div style={{ fontSize: 12, color: T.dim, margin: "2px 0 10px" }}>{t("profile.devHint")}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span className="gg-serif" style={{ fontSize: 12.5, color: T.dim }}>{t("profile.devLeague")}</span>
        {[1,2,3,4,5,6,7,8,9,10].map((lg) => (
          <button key={lg} onClick={() => setDevLg(lg)}
            title={t("profile.devApplyHint")}
            style={{ minWidth: 26, padding: "5px 4px", borderRadius: 7, cursor: "pointer", fontFamily: "inherit",
              fontWeight: 800, fontSize: 11.5,
              background: devLg === lg ? T.gold : T.panel2,
              color: devLg === lg ? "#241a08" : T.text,
              border: `1px solid ${devLg === lg ? T.gold : T.line}` }}>{lg}</button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
        <span className="gg-serif" style={{ fontSize: 12.5, color: T.dim, whiteSpace: "nowrap" }}>{t("profile.devProgress")}</span>
        <input type="range" min="0" max="100" step="5" value={devPct} onChange={(e) => setDevPct(+e.target.value)}
          style={{ flex: 1, accentColor: T.gold }} />
        <span style={{ color: T.text, fontWeight: 800, width: 42, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{devPct}%</span>
        <Button variant="subtle" style={{ padding: "7px 12px", fontSize: 12.5 }} onClick={() => dispatch({ type: "REPLACE",
          profile: withProgressPct(profile, devPct, devLg) })}>{t("profile.devApply")}</Button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Button variant="subtle" onClick={() => dispatch({ type: "REPLACE",
          profile: { ...profile, campaign: { ...profile.campaign, unlocked: Object.keys(CHARACTERS) } } })}>
          ⚜ {t("profile.devUnlockAll")}</Button>
        <Button variant="subtle" onClick={() => dispatch({ type: "REPLACE",
          profile: { ...profile, gold: (profile.gold || 0) + 1000, sp: (profile.sp || 0) + 50 } })}>
          ✦ {t("profile.devFunds")}</Button>
      </div>
    </Panel>}

    {account?.isAdmin && <Panel>
      <PanelTitle tag="Admin">{t("profile.rpTitle")}</PanelTitle>
      <div style={{ fontSize: 12, color: T.dim, margin: "2px 0 10px" }}>{t("profile.rpHint")}</div>
      <RestorePoints t={t} dispatch={dispatch} />
    </Panel>}

    {account?.isAdmin && <Panel>
      <PanelTitle tag="Admin">{t("profile.reportsTitle")}</PanelTitle>
      <div style={{ fontSize: 12, color: T.dim, margin: "2px 0 10px" }}>{t("profile.reportsHint")}</div>
      <ErrorReports t={t} />
    </Panel>}

    <Panel>
      <PanelTitle>{t("profile.pinTitle")}</PanelTitle>
      <div style={{ fontSize: 12, color: T.dim, margin: "2px 0 12px" }}>{t("profile.pinHint")}</div>
      {profile.pin
        ? <Button variant="ghost" onClick={() => dispatch({ type: "SET_PIN", pin: null })} style={{ width: "100%" }}>{t("profile.clearPin")}</Button>
        : <div style={{ display: "flex", gap: 8 }}>
            <input value={pin} onChange={(e) => setPin(e.target.value.slice(0, 64))} placeholder={t("profile.pinPh")} type="password" autoComplete="new-password"
              style={{ flex: 1, background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 10, color: T.text, padding: "11px 12px", fontSize: 16, outline: "none" }} />
            <Button onClick={setPinProtect} disabled={pin.length < 4}>{t("profile.setPin")}</Button>
          </div>}
    </Panel>

    <div style={{ textAlign: "center", fontSize: 11.5, color: T.faint, padding: "4px 0 10px" }}>
      Grand Gambit v{typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "dev"} ·{" "}
      <a href="./privacy.html" target="_blank" rel="noreferrer" style={{ color: T.dim }}>{t("profile.privacy")}</a>
    </div>

  </div>;
}


// one report, formatted as plain text ready to paste straight into a chat
// with Claude (or anywhere else) — every field a debugger would want, in a
// readable order, no JSON braces to wade through.
function reportText(r, t) {
  const fmt = (iso) => { try { return new Date(iso).toLocaleString(); } catch { return iso; } };
  const L = [
    `[Grand Gambit — ${t("profile.reportsTitle")}]`,
    `${fmt(r.created_at)} · v${r.version || "?"} · ${r.kind || "?"}`,
  ];
  if (r.account) L.push(`Konto/Account: ${r.account}`);
  if (r.url) L.push(`URL: ${r.url}`);
  if (r.ua) L.push(`Geraet/UA: ${r.ua}`);
  L.push("", r.message || "(kein Text)");
  if (r.note) L.push("", `Notiz/Note: ${r.note}`);
  if (r.stack) L.push("", "Stack:", r.stack);
  if (Array.isArray(r.log) && r.log.length) {
    L.push("", "Letzte Ereignisse/Recent log:");
    for (const l of r.log.slice(-15)) L.push(`[${l.kind}] ${l.msg}`);
  }
  return L.join("\n");
}

// copies text to the clipboard, flashing a brief "copied" confirmation —
// falls back to the old execCommand trick if the async Clipboard API isn't
// available (some embedded/older webviews).
function CopyBtn({ text, label, t, style }) {
  const [copied, setCopied] = useState(false);
  const doCopy = async (e) => {
    e.stopPropagation();
    try { await navigator.clipboard.writeText(text); }
    catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta);
      } catch { return; }
    }
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };
  return <Button kind="ghost" onClick={doCopy} style={{ fontSize: 11.5, whiteSpace: "nowrap", ...style }}>
    {copied ? t("profile.reportsCopied") : "⧉ " + label}
  </Button>;
}

function ErrorReports({ t }) {
  const [state, setState] = useState({ loading: true, source: "", rows: [], error: "" });
  const [open, setOpen] = useState(null);
  const [tok, setTok] = useState(() => getAdminToken());
  const [savedTok, setSavedTok] = useState(() => getAdminToken());
  const load = () => {
    setState((s) => ({ ...s, loading: true }));
    listReports({ limit: 120 }).then((r) => setState({ loading: false, source: r.source, rows: r.rows || [], error: r.error || "" }))
      .catch(() => setState({ loading: false, source: "local", rows: [], error: "offline" }));
  };
  useEffect(() => { load(); }, []);
  const saveToken = () => { setAdminToken(tok.trim()); setSavedTok(tok.trim()); load(); };
  const fmt = (iso) => { try { return new Date(iso).toLocaleString(); } catch { return iso; } };
  return <div>
    {/* the read token: paste the Worker's ADMIN_TOKEN once to see ALL devices */}
    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
      <input value={tok} onChange={(e) => setTok(e.target.value)} placeholder={t("profile.reportsToken")} type="password" autoComplete="off"
        style={{ flex: 1, background: T.bg2, border: `1px solid ${savedTok ? T.line : "#a9853f"}`, borderRadius: 10, color: T.text, padding: "10px 12px", fontSize: 14, outline: "none" }} />
      <Button onClick={saveToken} disabled={tok.trim() === savedTok}>{t("profile.reportsTokenSave")}</Button>
    </div>
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
      <Button kind="ghost" onClick={load}>{t("profile.reportsRefresh")}</Button>
      <span style={{ fontSize: 11.5, color: state.error === "unauthorized" ? "#e0574f" : T.faint }}>
        {state.loading ? t("profile.reportsLoading")
          : state.error === "unauthorized" ? t("profile.reportsBadToken")
          : state.source === "hall" ? t("profile.reportsCloud") + " · " + state.rows.length
          : state.error === "no-token" ? t("profile.reportsNeedToken")
          : t("profile.reportsLocal") + " · " + state.rows.length}</span>
      <div style={{ flex: 1 }} />
      {state.rows.length > 0 &&
        <CopyBtn t={t} label={t("profile.reportsCopyAll")}
          text={state.rows.map((r) => reportText(r, t)).join("\n\n" + "—".repeat(24) + "\n\n")} />}
      {state.source === "local" && state.rows.length > 0 &&
        <Button kind="ghost" onClick={() => { clearLocalReports(); load(); }}>{t("profile.reportsClear")}</Button>}
    </div>
    {state.rows.length > 0 && <div style={{ fontSize: 11, color: T.faint, marginTop: -4, marginBottom: 10 }}>{t("profile.reportsCopyAllHint")}</div>}
    {state.loading ? null : state.rows.length === 0
      ? <div style={{ fontSize: 12.5, color: T.dim, padding: "6px 0" }}>{t("profile.reportsEmpty")}</div>
      : <div style={{ display: "grid", gap: 6, maxHeight: 340, overflowY: "auto" }}>
          {state.rows.map((r, i) => {
            const isOpen = open === i;
            const isCrash = r.kind === "crash";
            return <div key={i} style={{ border: `1px solid ${T.line}`, borderRadius: 9, overflow: "hidden" }}>
              <button onClick={() => setOpen(isOpen ? null : i)} style={{ width: "100%", textAlign: "left",
                background: T.bg2, border: "none", color: T.text, padding: "9px 11px", cursor: "pointer", display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", flex: "0 0 auto", alignSelf: "center",
                  background: isCrash ? "#e0574f" : "#c9a45c" }} />
                <span style={{ fontSize: 12.5, fontWeight: 700, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.message || "(kein Text)"}</span>
                <span style={{ fontSize: 10.5, color: T.faint, whiteSpace: "nowrap" }}>v{r.version || "?"}</span>
              </button>
              {isOpen && <div style={{ padding: "9px 11px", fontSize: 11.5, color: T.dim, lineHeight: 1.5, background: T.bg }}>
                <div>{fmt(r.created_at)}{r.account ? " · " + r.account : ""}</div>
                <div style={{ color: T.faint, marginTop: 3, wordBreak: "break-word" }}>{r.ua}</div>
                {r.note && <div style={{ marginTop: 6, color: T.text }}>{r.note}</div>}
                {r.stack && <pre style={{ marginTop: 6, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 10.5, color: T.faint, fontFamily: "monospace" }}>{r.stack}</pre>}
                {Array.isArray(r.log) && r.log.length > 0 && <div style={{ marginTop: 6, color: T.faint }}>
                  {r.log.slice(-6).map((l, j) => <div key={j} style={{ fontFamily: "monospace", fontSize: 10 }}>[{l.kind}] {l.msg}</div>)}
                </div>}
                <div style={{ marginTop: 8 }}>
                  <CopyBtn t={t} label={t("profile.reportsCopyOne")} text={reportText(r, t)} />
                </div>
              </div>}
            </div>;
          })}
        </div>}
  </div>;
}

function RestorePoints({ t, dispatch }) {
  const [points, setPoints] = useState(null);
  useEffect(() => { let on = true; listRestorePoints().then((l) => on && setPoints(l)); return () => { on = false; }; }, []);
  if (!points) return <div style={{ fontSize: 12, color: T.faint }}>…</div>;
  if (!points.length) return <div style={{ fontSize: 12.5, color: T.faint }}>{t("profile.rpNone")}</div>;
  const fmt = (ts) => new Date(ts).toLocaleString(undefined, { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  return (
    <div style={{ display: "grid", gap: 6, maxHeight: 210, overflowY: "auto" }}>
      {points.map((e) => (
        <div key={e.ts} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 10px",
          background: T.panel2, borderRadius: T.radiusSm, border: `1px solid ${T.line}` }}>
          <span style={{ fontSize: 12.5, flex: 1 }}>
            <b>{fmt(e.ts)}</b>
            <span style={{ color: T.faint, fontSize: 11.5 }}> · {t("profile.rpMeta", { league: e.league, gold: e.gold })}</span>
          </span>
          <Button variant="subtle" style={{ padding: "6px 11px", fontSize: 12 }} onClick={() => {
            try {
              const prof = readSnapshot(e);
              if (confirm(t("profile.rpConfirm", { when: fmt(e.ts) }))) dispatch({ type: "REPLACE", profile: prof });
            } catch { alert(t("profile.saveBad")); }
          }}>↩ {t("profile.rpRestore")}</Button>
        </div>
      ))}
    </div>
  );
}
