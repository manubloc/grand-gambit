import { useState } from "react";
import { hashPin } from "../../../platform/index.js";
import { serializeSave, parseSave, listRestorePoints, readSnapshot } from "../../../meta/index.js";
import { useEffect } from "react";
import { T } from "../theme.js";
import { Panel, Button, Segmented, Stat, PanelTitle } from "../primitives.jsx";

export function ProfileScreen({ profile, dispatch, t, account }) {
  const [pin, setPin] = useState("");
  const s = profile.stats;

  async function setPinProtect() {
    if (pin.length < 4) return;
    const record = await hashPin(pin);
    dispatch({ type: "SET_PIN", pin: record });
    setPin("");
  }

  return <div style={{ display: "grid", gap: 12 }}>
    <Panel>
      <div style={{ fontSize: 12, color: T.faint, marginBottom: 6 }}>{t("profile.name")}</div>
      <input value={profile.name} placeholder={t("profile.namePh")} onChange={(e) => dispatch({ type: "SET_NAME", name: e.target.value })}
        style={{ width: "100%", background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 10, color: T.text, padding: "11px 12px", fontSize: 16, outline: "none" }} />
      <div style={{ fontSize: 12, color: T.faint, margin: "14px 0 6px" }}>{t("profile.lang")}</div>
      <Segmented value={profile.lang} onChange={(v) => dispatch({ type: "SET_LANG", lang: v })}
        options={[{ value: "de", label: "Deutsch" }, { value: "en", label: "English" }]} />
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
      <PanelTitle tag="Admin">{t("profile.rpTitle")}</PanelTitle>
      <div style={{ fontSize: 12, color: T.dim, margin: "2px 0 10px" }}>{t("profile.rpHint")}</div>
      <RestorePoints t={t} dispatch={dispatch} />
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
