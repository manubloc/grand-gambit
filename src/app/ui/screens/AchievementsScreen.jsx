// Achievements — a lean, modern trophy wall. Every entry gets a monochrome
// in-house icon in a medallion: earned tiers glow gold, untouched ones sit
// grayed and quiet. Progress is a single number and a thin bar — no clutter.
import { useState } from "react";
import { evaluate, claimedTiers, claimReward, claimableCount } from "../../../meta/index.js";
import { T } from "../theme.js";
import { Panel, Bar, Chip } from "../primitives.jsx";
import { AchIcon, SkillStar, GoldCoin } from "../icons.jsx";
import { ACH_ART } from "../assets/ach/index.js";
import { useMedia } from "../../App.jsx";

// MEASURED, then lifted: on the gilded plates T.faint came in at 2.9:1 against
// the card — under the 3.0 floor even for large text — and unstarted cards ran
// at 62% opacity on top of that, sinking it near 2:1. Nothing was readable.
// These two warm tones sit at 6.8:1 and 9.0:1 on the same plates, and cards
// now go quiet through COLOUR, not through fading their own text away.
const VELLUM = "#eadfc0";        // labels, tier rows, hints
const VELLUM_DIM = "#cec2a0";    // the faintest tier still legible

// Gold that reads as gold: gradient-filled serif numerals.
const goldText = {
  backgroundImage: "linear-gradient(168deg, #f8e6ab 8%, #d9b565 45%, #a17f3e 78%, #e9cf8a 100%)",
  WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
};
const cornerDiamond = (pos) => (
  <span style={{ position: "absolute", width: 7, height: 7, transform: "rotate(45deg)",
    background: "linear-gradient(135deg, #f0d68a, #8a6d35)", boxShadow: "0 0 6px #d9b56588", ...pos }} />
);

export function AchievementsScreen({ profile, dispatch, t, initialOpenId = null }) {
  const [openId, setOpenId] = useState(initialOpenId);
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
      <div style={{ position: "relative", overflow: "hidden", borderRadius: T.radius - 2, textAlign: "center",
        padding: "18px 16px 15px",
        background: `radial-gradient(130% 100% at 50% 0%, #2b2410 0%, ${T.panel2} 46%, ${T.panel} 100%)` }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "42%", pointerEvents: "none",
          background: "linear-gradient(90deg, transparent, rgba(255,240,190,.09), transparent)",
          animation: "ggShine 11s ease-in-out 1.1s infinite" }} />
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
            <span className="gg-serif" style={{ fontSize: 44, fontWeight: 450, letterSpacing: ".02em", lineHeight: 1, ...goldText }}>{profile.sp || 0}</span>
          </span>
          <span style={{ width: 1, height: 34, background: "#8a6d3566" }} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
            <GoldCoin size={28} />
            <span className="gg-serif" style={{ fontSize: 36, fontWeight: 450, letterSpacing: ".02em", lineHeight: 1, ...goldText }}>{profile.gold || 0}</span>
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <Chip color={T.dim} bg={T.panel2}>{tiersDone} / {tiersTotal} {t("ach.tiers")}</Chip>
          {claimable > 0 && <Chip color={"#17110a"} bg={T.gold}>{t("ach.claimable", { n: claimable })}</Chip>}
        </div>
        <div style={{ fontSize: 11.5, color: VELLUM, marginTop: 9 }}><SkillStar size={11} /> {t("ach.spHint")}</div>
      </div>
    </div>

    {items.map((it) => {
      const done = it.nextN === null;
      const pct = done ? 1 : Math.min(1, it.val / it.nextN);
      const isOpen = openId === it.id;
      // is there a purse waiting on this one? that plate gets the full treatment
      const ready = claimedTiers(profile, it.id) < it.done;
      return (
        <Panel key={it.id} onClick={() => setOpenId(isOpen ? null : it.id)}
          style={{ display: "flex", gap: 13, alignItems: "center", cursor: "pointer", position: "relative",
          // EVERY PLATE IS LIT. Dimming the untouched ones made half the
          // treasury look switched off; the medallion and the bar already say
          // what is earned. And the rim is EVEN now: the old look carried a
          // 3px gold bar down the left edge only, which read as a lopsided
          // frame rather than a rim of gold.
          padding: ready ? 19 : 16,
          background: "linear-gradient(160deg, rgba(96,74,34,.62), rgba(28,21,11,.95) 62%)",
          border: `2px solid ${ready ? "#f8ecc0" : "rgba(246,228,162,.78)"}`,
          boxShadow: ready
            ? "inset 0 1px 0 rgba(255,248,214,.4), inset 0 0 0 1px rgba(255,240,190,.3), 0 0 30px rgba(240,214,138,.4), " + T.shadow
            : "inset 0 1px 0 rgba(255,248,214,.28), inset 0 0 0 1px rgba(255,240,190,.16), 0 0 20px rgba(240,214,138,.22), " + T.shadow }}>
          {/* a still gleam sweeping the plate — treasure catches the light */}
          <span aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
            background: "linear-gradient(115deg, transparent 24%, rgba(255,244,200,.20) 44%, rgba(255,244,200,.05) 52%, transparent 64%)" }} />
          {/* THE STRUCK MEDALLION: each achievement now wears its own painted
              emblem, already cast as a round plate in the treasury's warm dark
              — so it seats itself in the gold rim with no seam and no cut-out
              work at runtime. The drawn icon still stands in for anything that
              has no painting yet. */}
          <div style={{ width: 56, height: 56, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center",
            overflow: "hidden", position: "relative",
            // THE EMBLEM IS SHOWN AS PAINTED. It used to be greyed and darkened
            // until the achievement was under way, which read as "the picture
            // is half transparent" — you could not make out what it showed. The
            // painting now stands at full strength on every plate; what is
            // earned is told by the bar, the diamonds and the tally.
            background: "radial-gradient(circle at 32% 28%, rgba(240,214,138,.5), rgba(36,28,14,.96) 70%)",
            border: "2.5px solid #f6e4a2",
            boxShadow: "0 0 16px rgba(240,214,138,.55), 0 1px 3px rgba(0,0,0,.55), inset 0 1px 2px rgba(255,250,228,.55)" }}>
            {ACH_ART[it.id]
              ? <img src={ACH_ART[it.id]} alt="" draggable={false} decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              : <AchIcon id={it.id} color="#f6e4a2" size={28} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
              <span className="gg-serif" style={{ fontSize: 15.5, letterSpacing: ".03em",
                color: "#fdf6e2", textShadow: "0 1px 2px rgba(0,0,0,.6)" }}>
                {en ? it.nameEn : it.nameDe}
              </span>
              <span style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: it.total }).map((_, i) => {
                  const cl = claimedTiers(profile, it.id);
                  const state = i < cl ? "claimed" : i < it.done ? "ready" : "locked";
                  return <span key={i} style={{ width: 7, height: 7, transform: "rotate(45deg)", borderRadius: 1.5,
                    background: state === "claimed" ? "linear-gradient(160deg, #f6e4a2, #d9b565 70%)" : state === "ready" ? T.lime : "rgba(30,24,13,.9)",
                    border: state === "locked" ? "1px solid rgba(180,150,90,.3)" : "none",
                    boxShadow: state === "claimed" ? "0 0 6px rgba(240,214,138,.75), inset 0 1px 0 rgba(255,246,214,.6)" : state === "ready" ? `0 0 6px ${T.lime}aa` : "inset 0 1px 1px rgba(0,0,0,.5)",
                    animation: state === "ready" ? "herePulse 1.6s ease-in-out infinite" : "none" }} />;
                })}
              </span>
            </div>
            {isOpen && <div style={{ fontSize: 12, color: VELLUM, lineHeight: 1.55, margin: "4px 0 3px" }}>
              {(en ? it.descEn : it.descDe) || null}
              {/* the LEDGER of the goal: every tier, its target and its purse —
                  the character-card accordion, brought to the treasury */}
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
                <div className="gg-serif" style={{ letterSpacing: ".22em", fontSize: 10.5, ...goldText, filter: "drop-shadow(0 1px 1px rgba(0,0,0,.5))" }}>{en ? "HOW TO EARN IT" : "SO ERREICHST DU ES"}</div>
                {(it.tiers || []).map((tr, i) => {
                  const cl = claimedTiers(profile, it.id);
                  const st = i < cl ? "✓" : i < it.done ? "◆" : "·";
                  const r = claimReward(it, i);
                  return <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 8,
                    color: i < it.done ? "#f6ecd2" : VELLUM }}>
                    <span>{st} {en ? "Tier" : "Stufe"} {i + 1}: {tr.n} ×</span>
                    <span style={{ whiteSpace: "nowrap" }}><SkillStar size={10} /> {r.sp} · <GoldCoin size={10} /> {r.gold}</span>
                  </div>;
                })}
              </div>
            </div>}
            <div style={{ margin: "8px 0 5px", height: 7, borderRadius: 999, position: "relative",
              background: "rgba(12,9,5,.85)", boxShadow: "inset 0 1px 2px rgba(0,0,0,.7), inset 0 -1px 0 rgba(255,240,190,.06)" }}>
              <div style={{ position: "absolute", inset: 0, width: `${pct * 100}%`, borderRadius: 999,
                background: done
                  ? "linear-gradient(90deg, #b8944e, #f6e4a2 55%, #e0bd72)"
                  : "linear-gradient(90deg, #8a6d35, #f0d68a 60%, #d9b565)",
                boxShadow: "0 0 9px rgba(217,181,101,.55), inset 0 1px 0 rgba(255,246,214,.5)" }} />
            </div>
            {/* WHEN A PURSE IS WAITING the row breaks apart: the tally keeps its
                line and the claim drops beneath it, full width and a size up,
                with real air above so it never crowds the text. */}
            <div style={{ fontSize: 11.5, color: VELLUM, display: "flex", gap: 8,
              flexDirection: ready ? "column" : "row", alignItems: ready ? "stretch" : "center",
              justifyContent: ready ? "flex-start" : "space-between" }}>
              <span style={{ color: "#f4e3ab", fontWeight: 800 }}>{done ? <span style={{ color: "#f6e4a2", textShadow: "0 0 6px rgba(240,214,138,.5)" }}>✓ {t("ach.done")}</span> : `${it.val} / ${it.nextN}`}</span>
              {(() => {
                const cl = claimedTiers(profile, it.id);
                if (cl >= it.done) return null;
                const r = claimReward(it, cl);
                return <button onClick={(e) => { e.stopPropagation(); dispatch({ type: "CLAIM_ACH", id: it.id }); }}
                  style={{ fontFamily: "inherit", fontWeight: 900, fontSize: 14, borderRadius: 999, padding: "13px 18px 12px",
                    marginTop: 9, width: "100%",
                    border: "none", background: "linear-gradient(160deg, #f0d68a, #d9b565 55%, #b08c44)", color: "#17110a", cursor: "pointer",
                    boxShadow: `0 0 16px ${T.gold}88, inset 0 1px 0 #fff6d8cc`, whiteSpace: "nowrap",
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {t("ach.claim")} · <SkillStar size={13} />{r.sp} <GoldCoin size={13} />{r.gold}
                </button>;
              })()}
            </div>
          </div>
        </Panel>
      );
    })}
  </div>;
}
