// Career select — every account keeps several save slots, each documenting
// its league, cleared count, percentage and total playtime. Admins get the
// progress dial: any slot can be set to 0…100% in journey order.
import { useEffect, useState } from "react";
import { T } from "../theme.js";
import { TrashIc } from "../icons.jsx";
import logoUrl from "../assets/logo.webp";
import { LeagueShield } from "../LeagueShield.jsx";
import { listSaves, createSave, deleteSave, renameSave, loadSave, writeSave, withProgressPct,
  migrateLegacyInto, fmtPlaytime, adminHasDefaultPass } from "../../../meta/index.js";

const STR = {
  de: { hello: "Willkommen", pick: "Wähle deinen Spielstand", new: "+ Neuer Spielstand", play: "Weiterspielen",
    league: "Liga", time: "Spielzeit", last: "Zuletzt", del: "Löschen", delSure: "Wirklich löschen?", rename: "Umbenennen",
    empty: "Noch kein Spielstand — beginne deine erste Reise.", logout: "Abmelden",
    admin: "Admin · Spielfortschritt", adminHint: "Setzt den gewählten Spielstand auf einen Fortschritt (Reihenfolge der Reise).",
    apply: "Anwenden", zero: "0 %", full: "100 %", namePh: "Name des Spielstands", },
  en: { hello: "Welcome", pick: "Choose your save", new: "+ New save", play: "Continue",
    league: "League", time: "Playtime", last: "Last played", del: "Delete", delSure: "Really delete?", rename: "Rename",
    empty: "No saves yet — begin your first journey.", logout: "Sign out",
    admin: "Admin · game progress", adminHint: "Sets the selected save to a progress level (in journey order).",
    apply: "Apply", zero: "0 %", full: "100 %", namePh: "Save name", },
};
const ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X"];
const fmtDate = (ts, lang) => new Date(ts).toLocaleDateString(lang === "de" ? "de-DE" : "en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" });

export function SavesScreen({ account, onOpen, onLogout, initialLang = "de", __testSaves = null }) {
  const [lang, setLang] = useState(initialLang);
  const [saves, setSaves] = useState(__testSaves);
  const [confirmDel, setConfirmDel] = useState(null);
  const [adminSlot, setAdminSlot] = useState(null);
  const [adminPct, setAdminPct] = useState(100);
  const s = STR[lang];

  const refresh = async () => setSaves(await listSaves(account.id));
  useEffect(() => { (async () => {
    if (__testSaves) return;   // harness: keep injected slots
    await migrateLegacyInto(account.id);
    await refresh();
  })(); }, [account.id]);

  const open = async (slot) => { const p = await loadSave(account.id, slot.id); if (p) onOpen(slot, p); };
  const create = async () => { const e = await createSave(account.id, null); const p = await loadSave(account.id, e.id); onOpen(e, p); };
  const applyAdmin = async (slot, pct) => {
    const prof = await loadSave(account.id, slot.id);
    if (!prof) return;
    await writeSave(account.id, slot.id, withProgressPct(prof, pct));
    setAdminSlot(null); await refresh();
  };

  const card = { background: T.panel, border: `1px solid ${T.line}`, borderRadius: 16, padding: "13px 14px", boxShadow: T.shadow };
  return (
    <div style={{ height: "100dvh", overflowY: "auto", overscrollBehavior: "none", background: "#000", padding: "14px 16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <button onClick={() => setLang(lang === "de" ? "en" : "de")} style={{ position: "absolute", top: 12, right: 14,
        background: "none", border: `1px solid ${T.line}`, color: T.dim, borderRadius: 999, padding: "5px 12px",
        fontFamily: "inherit", fontSize: 12, cursor: "pointer" }}>{lang === "de" ? "EN" : "DE"}</button>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      {/* the emblem greets returning strategists too — same night sky, no glow */}
      <img src={logoUrl} alt="Grand Gambit" style={{ width: "min(94vw, 620px)", maxHeight: "32vh", objectFit: "contain", display: "block", marginTop: 0 }} />
      <div className="gg-serif" style={{ color: T.dim, fontSize: 13.5, letterSpacing: ".05em", margin: "2px 0 2px" }}>
        {s.hello}, <b style={{ color: T.goldBright, fontWeight: 700 }}>{account.name}</b>
        {account.isAdmin && String(account.name).trim().toLowerCase() !== "admin" && <span style={{ color: T.gold }}> · Admin</span>}
        <button onClick={onLogout} className="gg-serif" style={{ background: "none", border: "none", color: T.faint,
          textDecoration: "underline", fontSize: 12.5, letterSpacing: ".05em", cursor: "pointer", marginLeft: 8 }}>{s.logout}</button>
      </div>
      <div className="gg-serif" style={{ color: T.goldBright, fontSize: 14.5, letterSpacing: ".08em", margin: "8px 0 12px",
        display: "flex", alignItems: "center", gap: 8 }}>
        <span aria-hidden style={{ width: 5, height: 5, background: T.gold, transform: "rotate(45deg)" }} />
        {s.pick}
        <span aria-hidden style={{ width: 5, height: 5, background: T.gold, transform: "rotate(45deg)" }} />
      </div>
      

      <div style={{ width: "100%", maxWidth: 430, display: "flex", flexDirection: "column", gap: 10 }}>
        {saves && saves.length === 0 && <div style={{ color: T.dim, fontSize: 14, textAlign: "center", padding: "12px 0" }}>{s.empty}</div>}
        {(saves || []).map((sv, i) => (
          <div key={sv.id} style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <LeagueShield league={sv.league || 1} size={58} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <div className="gg-serif" style={{ fontSize: 16.5, color: T.text, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sv.name}</div>
                  <div style={{ color: T.gold, fontWeight: 800, fontSize: 15 }}>{sv.pct ?? 0}%</div>
                </div>
                <div style={{ color: T.dim, fontSize: 12.5, margin: "3px 0 8px" }}>
                  {s.league} {ROMAN[(sv.league || 1) - 1] || sv.league} · {sv.clearedCount ?? 0}/{sv.total ?? "–"} · {s.time} {fmtPlaytime(sv.playtimeSec)} · {s.last} {fmtDate(sv.updatedAt || sv.createdAt, lang)}
                </div>
              </div>
            </div>
            <div style={{ height: 5, background: "#0d1017", borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ width: `${sv.pct ?? 0}%`, height: "100%", background: `linear-gradient(90deg, ${T.gold}bb, ${T.gold})` }} />
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => open(sv)} style={{ flex: 1, position: "relative", overflow: "hidden",
                background: i === 0 ? "rgba(201,164,92,.78)" : "rgba(201,164,92,.28)",
                border: "1px solid rgba(255,240,200,.45)", color: i === 0 ? "#17110a" : T.text, borderRadius: 11,
                padding: "10px 12px", fontFamily: "inherit", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
                {i === 0 && <span aria-hidden style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "42%",
                  background: "linear-gradient(90deg, transparent, rgba(255,244,210,.3), transparent)",
                  animation: "ggShine 11s ease-in-out 2.7s infinite", pointerEvents: "none" }} />}
                ▶ {s.play}
              </button>
              <button onClick={() => { const n = prompt(s.rename, sv.name); if (n != null) renameSave(account.id, sv.id, n).then(refresh); }}
                style={{ background: "none", border: `1px solid ${T.line}`, color: T.dim, borderRadius: 11, padding: "10px 11px", fontFamily: "inherit", fontSize: 13, cursor: "pointer" }}>✎</button>
              <button onClick={() => (confirmDel === sv.id ? (deleteSave(account.id, sv.id).then(() => { setConfirmDel(null); refresh(); })) : setConfirmDel(sv.id))}
                style={{ background: confirmDel === sv.id ? "#3d222a" : "none", border: `1px solid ${confirmDel === sv.id ? "#b4636c" : T.line}`,
                  color: confirmDel === sv.id ? "#d9a7ae" : T.dim, borderRadius: 11, padding: "10px 11px", fontFamily: "inherit", fontSize: 13, cursor: "pointer" }}>
                {confirmDel === sv.id ? s.delSure : <TrashIc size={15} />}
              </button>
            </div>
            {account.isAdmin && (
              adminSlot === sv.id
                ? <div style={{ marginTop: 10, borderTop: `1px dashed ${T.line}`, paddingTop: 9 }}>
                    <div style={{ color: T.gold, fontSize: 12.5, fontWeight: 800, marginBottom: 2 }}>{s.admin}</div>
                    <div style={{ color: T.dim, fontSize: 11.5, marginBottom: 7 }}>{s.adminHint}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <button onClick={() => setAdminPct(0)} style={{ background: "none", border: `1px solid ${T.line}`, color: T.dim, borderRadius: 9, padding: "6px 10px", fontFamily: "inherit", fontSize: 12, cursor: "pointer" }}>{s.zero}</button>
                      <input type="range" min="0" max="100" step="5" value={adminPct} onChange={(e) => setAdminPct(+e.target.value)} style={{ flex: 1, accentColor: T.gold }} />
                      <button onClick={() => setAdminPct(100)} style={{ background: "none", border: `1px solid ${T.line}`, color: T.dim, borderRadius: 9, padding: "6px 10px", fontFamily: "inherit", fontSize: 12, cursor: "pointer" }}>{s.full}</button>
                      <div style={{ color: T.text, fontWeight: 800, width: 44, textAlign: "right" }}>{adminPct}%</div>
                    </div>
                    <button onClick={() => applyAdmin(sv, adminPct)} style={{ marginTop: 8, width: "100%", background: "rgba(201,164,92,.7)",
                      border: "1px solid rgba(255,240,200,.5)", color: "#17110a", borderRadius: 10, padding: "9px 12px",
                      fontFamily: "inherit", fontWeight: 800, fontSize: 13.5, cursor: "pointer" }}>{s.apply}</button>
                  </div>
                : <button onClick={() => { setAdminSlot(sv.id); setAdminPct(sv.pct ?? 0); }}
                    style={{ marginTop: 9, background: "none", border: "none", color: T.gold, fontFamily: "inherit",
                      fontSize: 12, cursor: "pointer", padding: 0, textDecoration: "underline" }}>⚙ {s.admin}</button>
            )}
          </div>
        ))}
        <button onClick={create} style={{ background: "none", border: `1.5px dashed ${T.gold}66`, color: T.gold,
          borderRadius: 16, padding: "14px", fontFamily: "inherit", fontWeight: 800, fontSize: 14.5, cursor: "pointer" }}>
          <LeagueShield league={1} size={26} dim style={{ verticalAlign: "-7px", marginRight: 8 }} />{s.new}
        </button>
      </div>
      </div>
    </div>
  );
}
