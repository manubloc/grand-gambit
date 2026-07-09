// Achievements — a lean, modern trophy wall. Every entry gets a monochrome
// in-house icon in a medallion: earned tiers glow gold, untouched ones sit
// grayed and quiet. Progress is a single number and a thin bar — no clutter.
import { evaluate, claimedTiers, claimReward, claimableCount } from "../../../meta/index.js";
import { T } from "../theme.js";
import { Panel, Bar, Chip } from "../primitives.jsx";
import { AchIcon, SkillStar, GoldCoin } from "../icons.jsx";
import { useMedia } from "../../App.jsx";

// Gold that reads as gold: gradient-filled serif numerals.
const goldText = {
  backgroundImage: "linear-gradient(168deg, #f8e6ab 8%, #d9b565 45%, #a17f3e 78%, #e9cf8a 100%)",
  WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
};
const cornerDiamond = (pos) => (
  <span style={{ position: "absolute", width: 7, height: 7, transform: "rotate(45deg)",
    background: "linear-gradient(135deg, #f0d68a, #8a6d35)", boxShadow: "0 0 6px #d9b56588", ...pos }} />
);

export function AchievementsScreen({ profile, dispatch, t }) {
  const en = profile.lang === "en";
  const { items } = evaluate(profile.stats);
  const tiersDone = items.reduce((a, i) => a + i.done, 0);
  const tiersTotal = items.reduce((a, i) => a + i.total, 0);
  const claimable = claimableCount(profile);
  const wide = useMedia("(min-width: 900px)");

  return <div style={{ display: "grid", gap: 10, gridTemplateColumns: wide ? "1fr 1fr" : "1fr", alignItems: "start" }}>
    {/* ── the vault: a gilded frame, a passing gleam, real coinage ── */}
    <div style={{ gridColumn: "1 / -1", position: "relative", borderRadius: T.radius, padding: 1.5,
      background: "linear-gradient(135deg, #6f5526, #f0d68a 28%, #8a6d35 52%, #e9cf8a 76%, #6f5526)",
      boxShadow: `${T.shadow}, 0 0 26px #d9b56522` }}>
      <style>{`@keyframes ggShine { 0% { transform: translateX(-160%) skewX(-18deg); } 55%, 100% { transform: translateX(320%) skewX(-18deg); } }`}</style>
      <div style={{ position: "relative", overflow: "hidden", borderRadius: T.radius - 2, textAlign: "center",
        padding: "18px 16px 15px",
        background: `radial-gradient(130% 100% at 50% 0%, #2b2410 0%, ${T.panel2} 46%, ${T.panel} 100%)` }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "42%", pointerEvents: "none",
          background: "linear-gradient(90deg, transparent, rgba(255,240,190,.09), transparent)",
          animation: "ggShine 4.6s ease-in-out infinite" }} />
        {cornerDiamond({ top: 7, left: 7 })}{cornerDiamond({ top: 7, right: 7 })}
        {cornerDiamond({ bottom: 7, left: 7 })}{cornerDiamond({ bottom: 7, right: 7 })}
        <div className="gg-serif" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: ".3em",
          ...goldText, filter: "drop-shadow(0 1px 1px rgba(0,0,0,.5))" }}>{t("ach.wallet")}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "9px 12%" }}>
          <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #8a6d35)" }} />
          <span style={{ width: 5, height: 5, background: "#d9b565", transform: "rotate(45deg)" }} />
          <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #8a6d35, transparent)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 26, alignItems: "center", margin: "2px 0 10px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
            <SkillStar size={30} />
            <span className="gg-serif" style={{ fontSize: 42, fontWeight: 700, lineHeight: 1, ...goldText }}>{profile.sp || 0}</span>
          </span>
          <span style={{ width: 1, height: 34, background: "#8a6d3566" }} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
            <GoldCoin size={28} />
            <span className="gg-serif" style={{ fontSize: 34, fontWeight: 700, lineHeight: 1, ...goldText }}>{profile.gold || 0}</span>
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <Chip color={T.dim} bg={T.panel2}>{tiersDone} / {tiersTotal} {t("ach.tiers")}</Chip>
          {claimable > 0 && <Chip color={"#17110a"} bg={T.gold}>{t("ach.claimable", { n: claimable })}</Chip>}
        </div>
        <div style={{ fontSize: 11.5, color: T.faint, marginTop: 9 }}><SkillStar size={11} /> {t("ach.spHint")}</div>
      </div>
    </div>

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
                    border: "none", background: "linear-gradient(160deg, #f0d68a, #d9b565 55%, #b08c44)", color: "#17110a", cursor: "pointer",
                    boxShadow: `0 0 12px ${T.gold}66, inset 0 1px 0 #fff6d8aa`, whiteSpace: "nowrap",
                    display: "inline-flex", alignItems: "center", gap: 5 }}>
                  {t("ach.claim")} · <SkillStar size={12} />{r.sp} <GoldCoin size={12} />{r.gold}
                </button>;
              })()}
            </div>
          </div>
        </Panel>
      );
    })}
  </div>;
}
