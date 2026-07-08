// Achievements — a lean, modern trophy wall. Every entry gets a monochrome
// in-house icon in a medallion: earned tiers glow gold, untouched ones sit
// grayed and quiet. Progress is a single number and a thin bar — no clutter.
import { evaluate, claimedTiers, claimReward, claimableCount } from "../../../meta/index.js";
import { T } from "../theme.js";
import { Panel, Bar, Chip } from "../primitives.jsx";
import { AchIcon } from "../icons.jsx";
import { useMedia } from "../../App.jsx";

export function AchievementsScreen({ profile, dispatch, t }) {
  const en = profile.lang === "en";
  const { items } = evaluate(profile.stats);
  const tiersDone = items.reduce((a, i) => a + i.done, 0);
  const tiersTotal = items.reduce((a, i) => a + i.total, 0);
  const claimable = claimableCount(profile);
  const wide = useMedia("(min-width: 900px)");

  return <div style={{ display: "grid", gap: 10, gridTemplateColumns: wide ? "1fr 1fr" : "1fr", alignItems: "start" }}>
    <Panel style={{ gridColumn: "1 / -1", textAlign: "center", background: `linear-gradient(160deg, ${T.panel2}, ${T.panel})` }}>
      <div className="gg-serif" style={{ fontSize: 12, color: T.dim, textTransform: "uppercase", letterSpacing: ".22em" }}>{t("ach.wallet")}</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 22, alignItems: "baseline", margin: "4px 0 8px" }}>
        <span className="gg-serif" style={{ fontSize: 40, fontWeight: 700, color: T.gold, textShadow: `0 0 22px ${T.gold}44` }}>⭐ {profile.sp || 0}</span>
        <span className="gg-serif" style={{ fontSize: 26, fontWeight: 700, color: "#e8c96a" }}>🪙 {profile.gold || 0}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        <Chip color={T.dim} bg={T.panel2}>{tiersDone} / {tiersTotal} {t("ach.tiers")}</Chip>
        {claimable > 0 && <Chip color={"#17110a"} bg={T.gold}>{t("ach.claimable", { n: claimable })}</Chip>}
      </div>
      <div style={{ fontSize: 11.5, color: T.faint, marginTop: 8 }}>{t("ach.spHint")}</div>
    </Panel>

    {items.map((it) => {
      const done = it.nextN === null;
      const started = it.done > 0;
      const pct = done ? 1 : Math.min(1, it.val / it.nextN);
      return (
        <Panel key={it.id} style={{ display: "flex", gap: 13, alignItems: "center",
          opacity: started || pct > 0 ? 1 : 0.55,
          boxShadow: started ? `inset 3px 0 0 ${T.gold}bb, ${T.shadow}` : T.shadow }}>
          <div style={{ width: 46, height: 46, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center",
            background: started ? `radial-gradient(circle at 35% 30%, ${T.gold}33, ${T.panel2})` : T.panel2,
            border: `1.5px solid ${started ? T.gold : T.line}`,
            boxShadow: started ? `0 0 12px ${T.gold}44` : "none",
            filter: started ? "none" : "grayscale(1)" }}>
            <AchIcon id={it.id} color={started ? T.gold : T.faint} size={24} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
              <span className="gg-serif" style={{ fontSize: 15, letterSpacing: ".03em", color: started ? T.text : T.dim }}>
                {en ? it.nameEn : it.nameDe}
              </span>
              <span style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: it.total }).map((_, i) => {
                  const cl = claimedTiers(profile, it.id);
                  const state = i < cl ? "claimed" : i < it.done ? "ready" : "locked";
                  return <span key={i} style={{ width: 6, height: 6, transform: "rotate(45deg)", borderRadius: 1,
                    background: state === "claimed" ? T.gold : state === "ready" ? T.lime : T.panel2,
                    border: state === "locked" ? `1px solid ${T.line}` : "none",
                    boxShadow: state === "claimed" ? `0 0 5px ${T.gold}88` : state === "ready" ? `0 0 6px ${T.lime}aa` : "none",
                    animation: state === "ready" ? "herePulse 1.6s ease-in-out infinite" : "none" }} />;
                })}
              </span>
            </div>
            <div style={{ margin: "8px 0 5px" }}><Bar pct={pct} height={5} color={done ? T.green : T.gold} /></div>
            <div style={{ fontSize: 11.5, color: T.faint, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span>{done ? <span style={{ color: T.green }}>✓ {t("ach.done")}</span> : `${it.val} / ${it.nextN}`}</span>
              {(() => {
                const cl = claimedTiers(profile, it.id);
                if (cl >= it.done) return null;
                const r = claimReward(it, cl);
                return <button onClick={() => dispatch({ type: "CLAIM_ACH", id: it.id })}
                  style={{ fontFamily: "inherit", fontWeight: 900, fontSize: 12, borderRadius: 999, padding: "7px 13px",
                    border: "none", background: T.gold, color: "#17110a", cursor: "pointer",
                    boxShadow: `0 0 12px ${T.gold}66`, whiteSpace: "nowrap" }}>
                  {t("ach.claim")} · ⭐{r.sp} 🪙{r.gold}
                </button>;
              })()}
            </div>
          </div>
        </Panel>
      );
    })}
  </div>;
}
