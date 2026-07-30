// ── DIE FIGURENWERKSTATT ────────────────────────────────────────────────────
// Idee des Besitzers (v0.54): "Ein Tool, bei dem ich selber Farbsaettigung,
// Farbe-ersetzen und die Dinge, die du rumprobiert hast, pro Figur einstelle,
// abspeichere - und am Ende ein sauberes Zip exportiere, wie die Gegenseite
// aussehen muss." Erreichbar nur ueber ?werkstatt, wie die Galerie.
//
// Bauart: links (bzw. oben am Handy) die Vorschau - helle Schwester als
// Referenz daneben; darunter die Regler des v5-Rezepts plus Farbersatz.
// Einstellungen wohnen je Figur in localStorage (gg_werkstatt_v1). Das Zip
// (eigener Mini-Schreiber, unkomprimiert gespeicherte Eintraege mit CRC32)
// enthaelt ALLE dunklen Figuren, jede mit ihren gespeicherten Reglern -
// unangefasste Figuren gehen unveraendert hinein.
import { useEffect, useMemo, useRef, useState } from "react";
import { CARVED_LIGHT, CARVED_DARK, CARVED_BOSS_LIGHT, CARVED_BOSS_DARK } from "./board/carvedArt.js";
import { T } from "./theme.js";

const STANDARD = {
  spreizen: 0,        // 0..1: Tonwertspreizung p2->p98
  sattGrau: 1.0,      // Chroma der nicht-violetten Zonen (0..1.2)
  sattLila: 1.0,      // Chroma des violetten Koerpers (0..1.2)
  glimmSchwelle: 72,  // Perzentil, ab dem Violett als Kontur zaehlt (50..95)
  glimmStaerke: 1.0,  // Leuchtkraft der Kontur (1..2.2)
  glimmChroma: 1.0,   // Farbsattheit der Kontur (0.8..1.6)
  ersatzAn: false,    // Farbe ersetzen ein/aus
  ersatzVon: 200,     // Quell-Farbwinkel 0..360
  ersatzToleranz: 40, // +- Grad
  ersatzNach: 275,    // Ziel-Farbwinkel
};
const V5 = { ...STANDARD, spreizen: 1, sattGrau: 0.28, sattLila: 0.75, glimmSchwelle: 72, glimmStaerke: 1.62, glimmChroma: 1.18 };

const SCHLUESSEL = "gg_werkstatt_v1";
const leseAlle = () => { try { return JSON.parse(localStorage.getItem(SCHLUESSEL) || "{}"); } catch { return {}; } };
const schreibeAlle = (d) => { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(d)); } catch {} };

// ── Bildrechnung auf ImageData, 1:1 das v5-Vokabular ───────────────────────
function rechne(id, w, h, p) {
  const d = id.data, n = w * h;
  const L = new Float32Array(n);
  for (let i = 0; i < n; i++) L[i] = d[i*4]*.299 + d[i*4+1]*.587 + d[i*4+2]*.114;
  // Perzentile der Figur (Alpha>32)
  const werte = [];
  for (let i = 0; i < n; i++) if (d[i*4+3] > 32) werte.push(L[i]);
  werte.sort((a,b)=>a-b);
  const perz = (q) => werte.length ? werte[Math.min(werte.length-1, Math.floor(q/100*werte.length))] : 0;
  const p2 = perz(2), p98 = perz(98);
  // Pass 1: Spreizung + Farbersatz, danach Violett-Statistik sammeln
  const violett = new Uint8Array(n); const lWerte = [];
  for (let i = 0; i < n; i++) {
    if (d[i*4+3] <= 32) continue;
    let r=d[i*4], g=d[i*4+1], b=d[i*4+2];
    if (p.spreizen > 0 && p98 > p2) {
      const alt = L[i];
      const neu = Math.max(0, Math.min(255, (alt - p2)/(p98-p2)*238 + 5));
      const f = alt > 0.01 ? (1 + p.spreizen*(neu/alt - 1)) : 1;
      r=Math.min(255,r*f); g=Math.min(255,g*f); b=Math.min(255,b*f);
    }
    if (p.ersatzAn) {
      const mx=Math.max(r,g,b), mn=Math.min(r,g,b);
      if (mx-mn > 8) {
        let hUE;
        if (mx===r) hUE=((g-b)/(mx-mn))%6; else if (mx===g) hUE=(b-r)/(mx-mn)+2; else hUE=(r-g)/(mx-mn)+4;
        hUE = (hUE*60+360)%360;
        let diff = Math.abs(hUE - p.ersatzVon); if (diff>180) diff=360-diff;
        if (diff <= p.ersatzToleranz) {
          const l2=(mx+mn)/2, s=(mx-mn)/(255-Math.abs(2*l2-255)||1);
          const c=(1-Math.abs(2*l2/255-1))*s*255, hz=p.ersatzNach/60, x=c*(1-Math.abs(hz%2-1));
          let rr=0,gg=0,bb=0;
          if(hz<1){rr=c;gg=x;}else if(hz<2){rr=x;gg=c;}else if(hz<3){gg=c;bb=x;}
          else if(hz<4){gg=x;bb=c;}else if(hz<5){rr=x;bb=c;}else{rr=c;bb=x;}
          const m0=l2-c/2; r=Math.max(0,Math.min(255,rr+m0)); g=Math.max(0,Math.min(255,gg+m0)); b=Math.max(0,Math.min(255,bb+m0));
        }
      }
    }
    d[i*4]=r; d[i*4+1]=g; d[i*4+2]=b;
    const l2 = r*.299+g*.587+b*.114;
    const mx=Math.max(r,g,b), mn=Math.min(r,g,b), sat = mx>0.01 ? (mx-mn)/mx : 0;
    if (b > g+12 && r > g+4 && sat > 0.20) { violett[i]=1; lWerte.push(l2); }
  }
  lWerte.sort((a,b)=>a-b);
  const gSchwelle = lWerte.length>50 ? lWerte[Math.min(lWerte.length-1, Math.floor(p.glimmSchwelle/100*lWerte.length))] : 1e9;
  // Pass 2: Entfaerben + Glimmen
  for (let i = 0; i < n; i++) {
    if (d[i*4+3] <= 32) continue;
    let r=d[i*4], g=d[i*4+1], b=d[i*4+2];
    const l2 = r*.299+g*.587+b*.114;
    const glimmt = violett[i] && l2 >= gSchwelle;
    const chroma = glimmt ? 1 : (violett[i] ? p.sattLila : p.sattGrau);
    r = l2 + (r-l2)*chroma; g = l2 + (g-l2)*chroma; b = l2 + (b-l2)*chroma;
    if (glimmt) {
      r=Math.min(255,r*p.glimmStaerke); g=Math.min(255,g*p.glimmStaerke); b=Math.min(255,b*p.glimmStaerke);
      const l3=r*.299+g*.587+b*.114;
      r=Math.max(0,Math.min(255,l3+(r-l3)*p.glimmChroma));
      g=Math.max(0,Math.min(255,l3+(g-l3)*p.glimmChroma));
      b=Math.max(0,Math.min(255,l3+(b-l3)*p.glimmChroma));
    }
    d[i*4]=r; d[i*4+1]=g; d[i*4+2]=b;
  }
  return id;
}

// ── Mini-Zip (gespeicherte Eintraege, CRC32) ───────────────────────────────
const CRC_TAB = (() => { const t=new Uint32Array(256);
  for(let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[i]=c;} return t; })();
const crc32 = (u8) => { let c=0xFFFFFFFF; for(let i=0;i<u8.length;i++) c=CRC_TAB[(c^u8[i])&0xFF]^(c>>>8); return (c^0xFFFFFFFF)>>>0; };
function baueZip(eintraege) { // [{name, daten:Uint8Array}]
  const teile=[]; const zentral=[]; let versatz=0;
  const kl=(v,n)=>{const a=new Uint8Array(n);for(let i=0;i<n;i++)a[i]=(v>>>(8*i))&0xFF;return a;};
  for (const {name, daten} of eintraege) {
    const nb=new TextEncoder().encode(name); const crc=crc32(daten);
    const kopf=[kl(0x04034b50,4),kl(20,2),kl(0,2),kl(0,2),kl(0,2),kl(0,2),kl(crc,4),kl(daten.length,4),kl(daten.length,4),kl(nb.length,2),kl(0,2),nb];
    for(const t of kopf)teile.push(t); teile.push(daten);
    zentral.push({nb,crc,len:daten.length,versatz});
    versatz += kopf.reduce((s,t)=>s+t.length,0)+daten.length;
  }
  const zStart=versatz;
  for(const z of zentral){
    for(const t of [kl(0x02014b50,4),kl(20,2),kl(20,2),kl(0,2),kl(0,2),kl(0,2),kl(0,2),kl(z.crc,4),kl(z.len,4),kl(z.len,4),kl(z.nb.length,2),kl(0,2),kl(0,2),kl(0,2),kl(0,2),kl(0,4),kl(z.versatz,4),z.nb]) teile.push(t);
    versatz += 46 + z.nb.length;
  }
  teile.push(kl(0x06054b50,4),kl(0,2),kl(0,2),kl(zentral.length,2),kl(zentral.length,2),kl(versatz-zStart,4),kl(zStart,4),kl(0,2));
  const ges=teile.reduce((s,t)=>s+t.length,0); const aus=new Uint8Array(ges); let o=0;
  for(const t of teile){aus.set(t,o);o+=t.length;}
  return aus;
}

const REGLER = [
  ["spreizen","Tonwertspreizung",0,1,0.05],
  ["sattGrau","Farbe Grau-Zone",0,1.2,0.02],
  ["sattLila","Farbe Lila-Körper",0,1.2,0.02],
  ["glimmSchwelle","Glimmen-Schwelle (Perzentil)",50,95,1],
  ["glimmStaerke","Glimmen-Leuchtkraft",1,2.2,0.02],
  ["glimmChroma","Glimmen-Sattheit",0.8,1.6,0.02],
];

export function WerkstattScreen() {
  const KATALOG = useMemo(() => {
    const k = [];
    for (const [id, url] of Object.entries(CARVED_DARK)) k.push({ id, dunkel: url, hell: CARVED_LIGHT[id] });
    for (const [id, url] of Object.entries(CARVED_BOSS_DARK)) k.push({ id, dunkel: url, hell: CARVED_BOSS_LIGHT[id] });
    return k.sort((a, b) => a.id.localeCompare(b.id));
  }, []);
  const [idx, setIdx] = useState(0);
  const [alle, setAlle] = useState(leseAlle);
  const fig = KATALOG[idx];
  const [p, setP] = useState(() => ({ ...STANDARD, ...(leseAlle()[KATALOG[0]?.id] || {}) }));
  const [status, setStatus] = useState("");
  const cvRef = useRef(null); const bildRef = useRef(null);

  useEffect(() => { setP({ ...STANDARD, ...(alle[fig?.id] || {}) }); }, [idx]);

  // Vorschau rechnen (entprellt)
  useEffect(() => {
    if (!fig) return;
    const t = setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        bildRef.current = img;
        const cv = cvRef.current; if (!cv) return;
        cv.width = img.naturalWidth; cv.height = img.naturalHeight;
        const cx = cv.getContext("2d", { willReadFrequently: true });
        cx.clearRect(0, 0, cv.width, cv.height);
        cx.drawImage(img, 0, 0);
        const id = cx.getImageData(0, 0, cv.width, cv.height);
        rechne(id, cv.width, cv.height, p);
        cx.putImageData(id, 0, 0);
      };
      img.src = fig.dunkel;
    }, 120);
    return () => clearTimeout(t);
  }, [fig, p]);

  const speichern = () => { const n = { ...alle, [fig.id]: p }; setAlle(n); schreibeAlle(n); setStatus(`Gespeichert: ${fig.id}`); };
  const aufAlle = () => { const n = {}; for (const f of KATALOG) n[f.id] = p; setAlle(n); schreibeAlle(n); setStatus("Auf alle Figuren angewandt"); };
  const zuruecksetzen = () => { const n = { ...alle }; delete n[fig.id]; setAlle(n); schreibeAlle(n); setP({ ...STANDARD }); setStatus(`Zurückgesetzt: ${fig.id}`); };

  // ── DIREKT ZU GITHUB (Besitzer, v0.55): "dass ich's direkt lade, ohne
  // dich". Bauart-Entscheid: das Token wird NIE eingebaut - es lebt nur im
  // Geraet (localStorage) und IST das Admin-Tor: ohne Token kein Laden.
  // Ein einziger Commit ueber die Git-Data-API (Blobs -> Baum -> Commit ->
  // Ref), Pfade strikt aus dem Katalog gebaut - das Tool kann nur
  // Figurendateien anfassen, nichts sonst. Cloudflare deployt danach von
  // selbst (~3 Minuten).
  const [token, setToken] = useState(() => { try { return localStorage.getItem("gg_werkstatt_token") || ""; } catch { return ""; } });
  const [merken, setMerken] = useState(true);
  const gh = async (pfad, methode = "GET", koerper = null) => {
    const r = await fetch(`https://api.github.com/repos/manubloc/grand-gambit${pfad}`, {
      method: methode,
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json",
        ...(koerper ? { "Content-Type": "application/json" } : {}) },
      body: koerper ? JSON.stringify(koerper) : undefined,
    });
    if (!r.ok) throw new Error(`${methode} ${pfad}: ${r.status} ${(await r.text()).slice(0, 120)}`);
    return r.json();
  };
  const ladeZuGithub = async () => {
    const geaenderte = KATALOG.filter((f) => alle[f.id]);
    if (!token) { setStatus("Ohne Token kein Laden — Token oben einfügen."); return; }
    if (!geaenderte.length) { setStatus("Keine Figur hat gespeicherte Regler — nichts zu laden."); return; }
    try {
      if (merken) { try { localStorage.setItem("gg_werkstatt_token", token); } catch {} }
      setStatus("Hole Stand von main …");
      const ref = await gh("/git/ref/heads/main");
      const basis = ref.object.sha;
      const basisCommit = await gh(`/git/commits/${basis}`);
      const baum = [];
      for (let i = 0; i < geaenderte.length; i++) {
        const f = geaenderte[i];
        setStatus(`Rechne und lade ${i + 1}/${geaenderte.length}: ${f.id}`);
        const img = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = f.dunkel; });
        const cv = document.createElement("canvas");
        cv.width = img.naturalWidth; cv.height = img.naturalHeight;
        const cx = cv.getContext("2d", { willReadFrequently: true });
        cx.drawImage(img, 0, 0);
        const id2 = cx.getImageData(0, 0, cv.width, cv.height);
        rechne(id2, cv.width, cv.height, { ...STANDARD, ...alle[f.id] });
        cx.putImageData(id2, 0, 0);
        const blob = await new Promise((res) => cv.toBlob(res, "image/webp", 0.92));
        const puffer = new Uint8Array(await blob.arrayBuffer());
        let bin = ""; for (let j = 0; j < puffer.length; j += 8192) bin += String.fromCharCode(...puffer.subarray(j, j + 8192));
        const b = await gh("/git/blobs", "POST", { content: btoa(bin), encoding: "base64" });
        const datei = (f.id.startsWith("b") && f.id.length === 3 ? `carved-boss-${f.id}-dark` : `carved-${f.id}-dark`) + ".webp";
        baum.push({ path: `src/app/ui/assets/carved/${datei}`, mode: "100644", type: "blob", sha: b.sha });
      }
      setStatus("Baue Commit …");
      const neuerBaum = await gh("/git/trees", "POST", { base_tree: basisCommit.tree.sha, tree: baum });
      const commit = await gh("/git/commits", "POST", {
        message: `Figurenwerkstatt: ${geaenderte.length} Gegenseiten vom Besitzer geladen (${geaenderte.map((f) => f.id).join(", ")})`,
        tree: neuerBaum.sha, parents: [basis] });
      await gh("/git/refs/heads/main", "PATCH", { sha: commit.sha });
      setStatus(`Geladen: Commit ${commit.sha.slice(0, 7)} mit ${geaenderte.length} Figuren — Cloudflare deployt in ~3 Minuten.`);
    } catch (e) { setStatus("Fehlgeschlagen: " + String(e.message || e).slice(0, 160)); }
  };

  const exportiere = async () => {
    setStatus("Exportiere …");
    const eintraege = [];
    for (let i = 0; i < KATALOG.length; i++) {
      const f = KATALOG[i];
      setStatus(`Rechne ${i + 1}/${KATALOG.length}: ${f.id}`);
      const img = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = f.dunkel; });
      const cv = document.createElement("canvas");
      cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      const cx = cv.getContext("2d", { willReadFrequently: true });
      cx.drawImage(img, 0, 0);
      const einst = alle[f.id];
      if (einst) { const id = cx.getImageData(0, 0, cv.width, cv.height); rechne(id, cv.width, cv.height, { ...STANDARD, ...einst }); cx.putImageData(id, 0, 0); }
      const blob = await new Promise((res) => cv.toBlob(res, "image/webp", 0.92));
      const daten = new Uint8Array(await blob.arrayBuffer());
      const name = (f.id.startsWith("b") && f.id.length === 3 ? `carved-boss-${f.id}-dark` : `carved-${f.id}-dark`) + ".webp";
      eintraege.push({ name, daten });
      await new Promise((r) => setTimeout(r, 0));
    }
    eintraege.push({ name: "einstellungen.json", daten: new TextEncoder().encode(JSON.stringify(alle, null, 2)) });
    const zip = baueZip(eintraege);
    const url = URL.createObjectURL(new Blob([zip], { type: "application/zip" }));
    const a = document.createElement("a"); a.href = url; a.download = "gegenseite.zip"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    setStatus(`Zip mit ${eintraege.length - 1} Figuren + Einstellungen exportiert`);
  };

  if (!fig) return null;
  const geaendert = !!alle[fig.id];
  const knopf = { padding: "9px 12px", borderRadius: 10, border: `1px solid ${T.line}`, background: T.panel,
    color: T.text, fontFamily: "inherit", fontWeight: 800, fontSize: 12.5, cursor: "pointer" };
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, padding: "14px 12px 40px", maxWidth: 560, margin: "0 auto" }}>
      <div className="gg-serif" style={{ fontSize: 20, color: T.goldBright, letterSpacing: ".05em", marginBottom: 2 }}>Die Figurenwerkstatt</div>
      <div style={{ fontSize: 11.5, color: T.dim, marginBottom: 10 }}>Regler je Figur speichern · am Ende „Zip exportieren" — das Paket ist die Gegenseite, wie sie sein soll.</div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <button style={knopf} onClick={() => setIdx((idx - 1 + KATALOG.length) % KATALOG.length)}>‹</button>
        <select value={idx} onChange={(e) => setIdx(+e.target.value)}
          style={{ flex: 1, padding: "9px 10px", borderRadius: 10, border: `1px solid ${T.line}`, background: T.panel, color: T.text, fontFamily: "inherit", fontSize: 13 }}>
          {KATALOG.map((f, i) => <option key={f.id} value={i}>{f.id}{alle[f.id] ? " ●" : ""}</option>)}
        </select>
        <button style={knopf} onClick={() => setIdx((idx + 1) % KATALOG.length)}>›</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, borderRadius: 12, border: `1px solid ${T.line}`, background: "#100d1a", padding: 6, display: "grid", placeItems: "center" }}>
          <canvas ref={cvRef} style={{ maxWidth: "100%", maxHeight: 300 }} />
          <div style={{ fontSize: 10.5, color: T.faint }}>Gegenseite (live){geaendert ? " · eigene Regler" : ""}</div>
        </div>
        <div style={{ width: 120, borderRadius: 12, border: `1px solid ${T.line}`, background: "#100d1a", padding: 6, display: "grid", placeItems: "center" }}>
          <img src={fig.hell} alt="" style={{ maxWidth: "100%", maxHeight: 300 }} />
          <div style={{ fontSize: 10.5, color: T.faint }}>helle Schwester</div>
        </div>
      </div>

      {REGLER.map(([k, name, min, max, schritt]) => (
        <div key={k} style={{ marginBottom: 7 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
            <span>{name}</span><span style={{ color: T.goldBright, fontWeight: 800 }}>{(+p[k]).toFixed(2)}</span>
          </div>
          <input type="range" min={min} max={max} step={schritt} value={p[k]}
            onChange={(e) => setP({ ...p, [k]: +e.target.value })} style={{ width: "100%" }} />
        </div>
      ))}

      <div style={{ borderTop: `1px solid ${T.line}`, margin: "10px 0", paddingTop: 8 }}>
        <label style={{ fontSize: 12, display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
          <input type="checkbox" checked={p.ersatzAn} onChange={(e) => setP({ ...p, ersatzAn: e.target.checked })} />
          Farbe ersetzen (Farbwinkel)
        </label>
        {p.ersatzAn && ["ersatzVon", "ersatzToleranz", "ersatzNach"].map((k) => (
          <div key={k} style={{ marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
              <span>{k === "ersatzVon" ? "Von Farbton" : k === "ersatzToleranz" ? "± Toleranz" : "Nach Farbton"}</span>
              <span style={{ color: T.goldBright, fontWeight: 800 }}>{p[k]}°</span>
            </div>
            <input type="range" min={k === "ersatzToleranz" ? 5 : 0} max={k === "ersatzToleranz" ? 120 : 360} step={1}
              value={p[k]} onChange={(e) => setP({ ...p, [k]: +e.target.value })} style={{ width: "100%" }} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
        <button style={{ ...knopf, borderColor: `${T.gold}66`, color: T.goldBright }} onClick={speichern}>Für Figur speichern</button>
        <button style={knopf} onClick={() => setP({ ...V5 })}>v5-Startwerte</button>
        <button style={knopf} onClick={aufAlle}>Auf alle anwenden</button>
        <button style={knopf} onClick={zuruecksetzen}>Zurücksetzen</button>
        <button style={{ ...knopf, background: `linear-gradient(160deg,#f0d68a,#d9b565 55%,#b08c44)`, color: "#17110a", border: "none" }}
          onClick={exportiere}>Zip exportieren</button>
      </div>
      <div style={{ borderTop: `1px solid ${T.line}`, marginTop: 14, paddingTop: 10 }}>
        <div className="gg-serif" style={{ fontSize: 14, color: T.goldBright, marginBottom: 4 }}>Nur Admin: direkt zu GitHub laden</div>
        <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.5, marginBottom: 8 }}>
          Dein Token bleibt AUSSCHLIESSLICH auf diesem Gerät (es steckt nie im Spiel) und ist zugleich das Tor:
          ohne Token lädt hier niemand etwas. Geladen werden nur Figuren mit gespeicherten Reglern, als EIN Commit
          auf main — danach deployt Cloudflare von selbst (~3 Min). Empfohlen: feinkörniges Token, nur dieses Repo,
          nur „Contents: Read and write".</div>
        <input type="password" placeholder="GitHub-Token (fine-grained, Contents: write)" value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ width: "100%", padding: "9px 10px", borderRadius: 10, border: `1px solid ${T.line}`,
            background: T.panel, color: T.text, fontFamily: "inherit", fontSize: 12.5, marginBottom: 6 }} />
        <label style={{ fontSize: 11.5, color: T.dim, display: "flex", gap: 7, alignItems: "center", marginBottom: 8 }}>
          <input type="checkbox" checked={merken} onChange={(e) => setMerken(e.target.checked)} />
          Token auf diesem Gerät merken</label>
        <button onClick={ladeZuGithub} disabled={!token}
          style={{ ...knopf, width: "100%", opacity: token ? 1 : 0.5,
            background: token ? `linear-gradient(160deg,#f0d68a,#d9b565 55%,#b08c44)` : T.panel,
            color: token ? "#17110a" : T.dim, border: token ? "none" : `1px solid ${T.line}` }}>
          Geänderte Figuren zu GitHub laden ({Object.keys(alle).length})</button>
      </div>
      <div style={{ fontSize: 11.5, color: T.dim, marginTop: 8, minHeight: 16 }}>{status}</div>
    </div>
  );
}
