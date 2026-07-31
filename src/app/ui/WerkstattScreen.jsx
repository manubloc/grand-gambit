// ── DIE FIGURENWERKSTATT ────────────────────────────────────────────────────
// Besitzer-Tool (?werkstatt). v0.54: Regler je Figur + Zip + GitHub-Ladung.
// v0.56: ZOOM, PINSEL (mit PIPETTE), RADIERER - beide mit Groesse und
// Haerte - und RUECKGAENGIG. Bauart der Ebenen:
//   Grund (Original-Gegenseite) -> rechne(Regler) -> STRICHE (Pinsel-Ebene)
//   -> RADIERUNG (Alphamaske, destination-out)
// Handstriche ueberleben so jeden Reglerzug und wandern in Vorschau, Zip
// und GitHub-Ladung. Gespeicherte Striche wohnen je Figur als kompakte
// webp-DataURLs im Geraet (localStorage, mit Platz-Warnung).
import { useEffect, useMemo, useRef, useState } from "react";
import { CARVED_LIGHT, CARVED_DARK, CARVED_BOSS_LIGHT, CARVED_BOSS_DARK } from "./board/carvedArt.js";
import { T } from "./theme.js";

const STANDARD = {
  spreizen: 0, sattGrau: 1.0, sattLila: 1.0,
  glimmSchwelle: 72, glimmStaerke: 1.0, glimmChroma: 1.0,
  ersatzAn: false, ersatzVon: 200, ersatzToleranz: 40, ersatzNach: 275,
};
const V5 = { ...STANDARD, spreizen: 1, sattGrau: 0.28, sattLila: 0.75, glimmStaerke: 1.62, glimmChroma: 1.18 };
const SCHLUESSEL = "gg_werkstatt_v1";
// MIGRATIONSLESER (v0.57.1): v0.54/55 speicherte die Regler FLACH als
// alle[id] = {spreizen,...}; v0.56 erwartete alle[id].regler und ignorierte
// dadurch alle alten Speicherstaende - "meine Aenderungen werden nicht
// dargestellt". Dieser Leser versteht beide Formen.
const holeRegler = (e) => e?.regler ?? (e && typeof e === "object" && "spreizen" in e ? e : {});
const holeLage = (e) => ({ dx: 0, dy: 0, skala: 1, ...(e?.lage || {}) });
const leseAlle = () => { try { return JSON.parse(localStorage.getItem(SCHLUESSEL) || "{}"); } catch { return {}; } };
const schreibeAlle = (d) => { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(d)); return true; } catch { return false; } };

function rechne(id, w, h, p) {
  const d = id.data, n = w * h;
  const L = new Float32Array(n);
  for (let i = 0; i < n; i++) L[i] = d[i*4]*.299 + d[i*4+1]*.587 + d[i*4+2]*.114;
  const werte = [];
  for (let i = 0; i < n; i++) if (d[i*4+3] > 32) werte.push(L[i]);
  werte.sort((a,b)=>a-b);
  const perz = (q) => werte.length ? werte[Math.min(werte.length-1, Math.floor(q/100*werte.length))] : 0;
  const p2 = perz(2), p98 = perz(98);
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
        hUE=(hUE*60+360)%360;
        let diff=Math.abs(hUE-p.ersatzVon); if(diff>180)diff=360-diff;
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
    const l2=r*.299+g*.587+b*.114;
    const mx=Math.max(r,g,b), mn=Math.min(r,g,b), sat=mx>0.01?(mx-mn)/mx:0;
    if (b>g+12 && r>g+4 && sat>0.20) { violett[i]=1; lWerte.push(l2); }
  }
  lWerte.sort((a,b)=>a-b);
  const gS = lWerte.length>50 ? lWerte[Math.min(lWerte.length-1, Math.floor(p.glimmSchwelle/100*lWerte.length))] : 1e9;
  for (let i = 0; i < n; i++) {
    if (d[i*4+3] <= 32) continue;
    let r=d[i*4], g=d[i*4+1], b=d[i*4+2];
    const l2=r*.299+g*.587+b*.114;
    const glimmt = violett[i] && l2 >= gS;
    const chroma = glimmt ? 1 : (violett[i] ? p.sattLila : p.sattGrau);
    r=l2+(r-l2)*chroma; g=l2+(g-l2)*chroma; b=l2+(b-l2)*chroma;
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

const CRC_TAB=(()=>{const t=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[i]=c;}return t;})();
const crc32=(u)=>{let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=CRC_TAB[(c^u[i])&0xFF]^(c>>>8);return (c^0xFFFFFFFF)>>>0;};
function baueZip(eintraege){
  const teile=[],zentral=[];let versatz=0;
  const kl=(v,n)=>{const a=new Uint8Array(n);for(let i=0;i<n;i++)a[i]=(v>>>(8*i))&0xFF;return a;};
  for(const {name,daten} of eintraege){
    const nb=new TextEncoder().encode(name),crc=crc32(daten);
    const kopf=[kl(0x04034b50,4),kl(20,2),kl(0,2),kl(0,2),kl(0,2),kl(0,2),kl(crc,4),kl(daten.length,4),kl(daten.length,4),kl(nb.length,2),kl(0,2),nb];
    for(const t of kopf)teile.push(t);teile.push(daten);
    zentral.push({nb,crc,len:daten.length,versatz});
    versatz+=kopf.reduce((s,t)=>s+t.length,0)+daten.length;
  }
  const zS=versatz;
  for(const z of zentral){for(const t of [kl(0x02014b50,4),kl(20,2),kl(20,2),kl(0,2),kl(0,2),kl(0,2),kl(0,2),kl(z.crc,4),kl(z.len,4),kl(z.len,4),kl(z.nb.length,2),kl(0,2),kl(0,2),kl(0,2),kl(0,2),kl(0,4),kl(z.versatz,4),z.nb])teile.push(t);versatz+=46+z.nb.length;}
  teile.push(kl(0x06054b50,4),kl(0,2),kl(0,2),kl(zentral.length,2),kl(zentral.length,2),kl(versatz-zS,4),kl(zS,4),kl(0,2));
  const ges=teile.reduce((s,t)=>s+t.length,0),aus=new Uint8Array(ges);let o=0;
  for(const t of teile){aus.set(t,o);o+=t.length;}
  return aus;
}

const REGLER=[["spreizen","Tonwertspreizung",0,1,0.05],["sattGrau","Farbe Grau-Zone",0,1.2,0.02],
  ["sattLila","Farbe Lila-Körper",0,1.2,0.02],["glimmSchwelle","Glimmen-Schwelle (Perzentil)",50,95,1],
  ["glimmStaerke","Glimmen-Leuchtkraft",1,2.2,0.02],["glimmChroma","Glimmen-Sattheit",0.8,1.6,0.02]];

export function WerkstattScreen() {
  const KATALOG = useMemo(() => {
    const k=[];
    for (const [id,url] of Object.entries(CARVED_DARK)) k.push({id, dunkel:url, hell:CARVED_LIGHT[id]});
    for (const [id,url] of Object.entries(CARVED_BOSS_DARK)) k.push({id, dunkel:url, hell:CARVED_BOSS_LIGHT[id]});
    return k.sort((a,b)=>a.id.localeCompare(b.id));
  }, []);
  const [idx,setIdx]=useState(0);
  const [alle,setAlle]=useState(leseAlle);
  const fig=KATALOG[idx];
  const [p,setP]=useState(()=>({ ...STANDARD, ...holeRegler(leseAlle()[KATALOG[0]?.id]) }));
  const [status,setStatus]=useState("");
  const pRef=useRef(p); pRef.current=p;
  const [werkzeug,setWerkzeug]=useState("bewegen"); // bewegen|pinsel|radierer|pipette
  const [groesse,setGroesse]=useState(18);
  const [haerte,setHaerte]=useState(0.7);
  const [farbe,setFarbe]=useState("#b9a4ff");
  const [zoom,setZoom]=useState(1);
  const [kannZurueck,setKannZurueck]=useState(0);
  const [raster,setRaster]=useState(true);
  const [brett,setBrett]=useState(false);   // Schachbrett-Muster unterlegen
  const quelleRef=useRef(null);             // Stempel-Quelle im Werkraum
  const lageRef=useRef({dx:0,dy:0,skala:1});      // Figur-Verschiebung/-Groesse
  const [lageSchau,setLageSchau]=useState({dx:0,dy:0,skala:1});
  const [mass,setMass]=useState(null);            // gemessener Sockel/Hoehe
  const SOLL_SOCKEL=303;

  const dispRef=useRef(null);
  const procRef=useRef(null);       // gerechnete Ebene (Regler)
  const strichRef=useRef(null);     // Pinsel-Ebene
  const radierRef=useRef(null);     // Radier-Maske
  const bildRef=useRef(null);
  const offRef=useRef({x:0,y:0});
  const zeichnetRef=useRef(null);
  const undoRef=useRef([]);

  const mach=(w,h)=>{const c=document.createElement("canvas");c.width=w;c.height=h;return c;};

  const male=()=>{ // Komposition auf die Anzeige
    const dc=dispRef.current, pc=procRef.current;
    if(!dc||!pc) return;
    const cx=dc.getContext("2d");
    cx.setTransform(1,0,0,1,0,0);
    cx.clearRect(0,0,dc.width,dc.height);
    cx.imageSmoothingEnabled = zoom<2;
    cx.setTransform(zoom,0,0,zoom,offRef.current.x,offRef.current.y);
    // SCHACHBRETT-MUSTER (Besitzer, v0.63): fest im RAHMEN, die Figur
    // bewegt sich RELATIV dazu. Ein Feld ist 320 px breit und liegt
    // mittig unter dem Sockel (Spielmass: Soll-Sockel 303 auf einem Feld).
    if (brett) {
      const w=pc.width,h=pc.height,F=320;
      for(let reihe=0;reihe*F<h+F;reihe++){
        for(let sp=-1;sp*F<w+F;sp++){
          const x=160+ (sp-1)*F, y=h-(reihe+1)*F;
          cx.fillStyle=((sp+reihe)%2===0)?"#b3a78f":"#232532";
          cx.fillRect(x,y,F,F);
        }
      }
      cx.strokeStyle="rgba(233,207,138,.35)"; cx.lineWidth=2/zoom;
      cx.strokeRect(160,h-320,320,320); // DAS Feld der Figur
    }
    // FIGUR-LAGE: um die Bodenmitte verankert - Skalieren waechst aus dem
    // Sockel, Verschieben wandert frei. Wirkt auf ALLE Ebenen gleich.
    const {dx,dy,skala}=lageRef.current;
    cx.save();
    cx.translate(pc.width/2+dx, pc.height+dy);
    cx.scale(skala,skala);
    cx.translate(-pc.width/2, -pc.height);
    cx.drawImage(pc,0,0);
    cx.drawImage(strichRef.current,0,0);
    cx.globalCompositeOperation="destination-out";
    cx.drawImage(radierRef.current,0,0);
    cx.globalCompositeOperation="source-over";
    // STEMPEL-QUELLE sichtbar machen (im Werkraum, wandert mit der Figur)
    if (werkzeug==="stempel" && quelleRef.current) {
      cx.strokeStyle="rgba(140,225,160,.9)"; cx.lineWidth=2;
      cx.beginPath(); cx.arc(quelleRef.current.x,quelleRef.current.y,Math.max(4,groesse/2),0,Math.PI*2); cx.stroke();
      cx.beginPath(); cx.moveTo(quelleRef.current.x-6,quelleRef.current.y); cx.lineTo(quelleRef.current.x+6,quelleRef.current.y);
      cx.moveTo(quelleRef.current.x,quelleRef.current.y-6); cx.lineTo(quelleRef.current.x,quelleRef.current.y+6); cx.stroke();
    }
    cx.restore();
    // RASTER mit SOLL-MASS: 40er-Netz, Mittelachse, Bodenlinie und das
    // Soll-Sockel-Band (303 px) - alles im Rahmenraum, zoomt also mit.
    if (raster) {
      cx.save();
      cx.lineWidth=1/zoom;
      cx.strokeStyle="rgba(233,207,138,.14)";
      cx.beginPath();
      for(let x=0;x<=pc.width;x+=40){cx.moveTo(x,0);cx.lineTo(x,pc.height);}
      for(let y=pc.height;y>=0;y-=40){cx.moveTo(0,y);cx.lineTo(pc.width,y);}
      cx.stroke();
      cx.strokeStyle="rgba(233,207,138,.38)";
      cx.beginPath(); cx.moveTo(pc.width/2,0); cx.lineTo(pc.width/2,pc.height);
      cx.moveTo(0,pc.height-.5); cx.lineTo(pc.width,pc.height-.5); cx.stroke();
      const l=(pc.width-SOLL_SOCKEL)/2, r=(pc.width+SOLL_SOCKEL)/2;
      cx.strokeStyle="rgba(140,225,160,.55)";
      cx.beginPath(); cx.moveTo(l,pc.height); cx.lineTo(l,pc.height-70);
      cx.moveTo(r,pc.height); cx.lineTo(r,pc.height-70); cx.stroke();
      cx.fillStyle="rgba(140,225,160,.8)";
      cx.font=`${14/zoom < 11 ? 11 : 14}px system-ui`;
      cx.fillText(`Soll-Sockel ${SOLL_SOCKEL} px`, l+6, pc.height-52);
      cx.restore();
    }
  };
  // MASSBAND: Sockelbreite (breiteste Zeile der unteren 10 %) und Hoehe der
  // komponierten Figur IN ihrer Lage - der Zahlenbeleg neben dem Raster.
  const vermesse=()=>{
    const pc=procRef.current; if(!pc) return;
    const t=mach(pc.width,pc.height); const tc=t.getContext("2d",{willReadFrequently:true});
    const {dx,dy,skala}=lageRef.current;
    tc.translate(pc.width/2+dx,pc.height+dy); tc.scale(skala,skala); tc.translate(-pc.width/2,-pc.height);
    tc.drawImage(pc,0,0); tc.drawImage(strichRef.current,0,0);
    tc.globalCompositeOperation="destination-out"; tc.drawImage(radierRef.current,0,0);
    const d=tc.getImageData(0,0,t.width,t.height).data;
    let oben=-1,unten=-1;
    for(let y=0;y<t.height&&oben<0;y++)for(let x=0;x<t.width;x++)if(d[(y*t.width+x)*4+3]>32){oben=y;break;}
    for(let y=t.height-1;y>=0&&unten<0;y--)for(let x=0;x<t.width;x++)if(d[(y*t.width+x)*4+3]>32){unten=y;break;}
    if(oben<0){setMass(null);return;}
    const h=unten-oben+1; let sockel=0;
    for(let y=unten;y>unten-Math.max(1,h*0.10);y--){let z=0;
      for(let x=0;x<t.width;x++)if(d[(y*t.width+x)*4+3]>32)z++;
      if(z>sockel)sockel=z;}
    setMass({sockel,hoehe:h});
  };

  const komponiere=(zielCx,w,h,einst)=>{ // fuer Export/GitHub: volle Pipeline
    const id=zielCx.getImageData(0,0,w,h);
    rechne(id,w,h,{ ...STANDARD, ...holeRegler(einst) });
    zielCx.putImageData(id,0,0);
  };

  // Figur laden: Grundbild, Ebenen (aus Speicher), Rechnen, Malen
  useEffect(()=>{
    if(!fig) return;
    setP({ ...STANDARD, ...holeRegler(alle[fig.id]) });
    lageRef.current = holeLage(alle[fig.id]); setLageSchau(lageRef.current);
    setZoom(1); offRef.current={x:0,y:0}; undoRef.current=[]; setKannZurueck(0);
    const img=new Image();
    img.onload=async()=>{
      bildRef.current=img;
      const w=img.naturalWidth,h=img.naturalHeight;
      procRef.current=mach(w,h); strichRef.current=mach(w,h); radierRef.current=mach(w,h);
      const man=alle[fig.id]?.manuell;
      const ladeEbene=(cv,url)=>new Promise((res)=>{ if(!url) return res();
        const e=new Image(); e.onload=()=>{cv.getContext("2d").drawImage(e,0,0);res();}; e.onerror=res; e.src=url; });
      await Promise.all([ladeEbene(strichRef.current,man?.striche), ladeEbene(radierRef.current,man?.radierung)]);
      const dc=dispRef.current; if(dc){dc.width=w;dc.height=h;}
      rechneNeu();
    };
    img.src=fig.dunkel;
  },[idx]);

  const rechneNeu=()=>{
    const img=bildRef.current, pc=procRef.current;
    if(!img||!pc) return;
    const cx=pc.getContext("2d",{willReadFrequently:true});
    cx.clearRect(0,0,pc.width,pc.height);
    cx.drawImage(img,0,0);
    const id=cx.getImageData(0,0,pc.width,pc.height);
    rechne(id,pc.width,pc.height,pRef.current);
    cx.putImageData(id,0,0);
    male(); vermesse();
  };
  useEffect(()=>{const t=setTimeout(rechneNeu,120);return()=>clearTimeout(t);},[p]);
  useEffect(male,[zoom,raster,lageSchau,brett,werkzeug,groesse]);

  // ── Zeichnen: Stempel mit Haerte-Verlauf ─────────────────────────────────
  const stempel=(cv,x,y,farbeCss)=>{
    const cx=cv.getContext("2d");
    const r=Math.max(1,groesse/2);
    const g=cx.createRadialGradient(x,y,0,x,y,r);
    const kern=Math.max(0,Math.min(0.99,haerte));
    g.addColorStop(0,farbeCss); g.addColorStop(kern,farbeCss);
    g.addColorStop(1,farbeCss.replace(/[\d.]+\)$/,"0)"));
    cx.fillStyle=g;
    cx.beginPath(); cx.arc(x,y,r,0,Math.PI*2); cx.fill();
  };
  const rgba=(hex,a)=>{const v=parseInt(hex.slice(1),16);return `rgba(${(v>>16)&255},${(v>>8)&255},${v&255},${a})`;};

  const brettPunkt=(e)=>{
    const dc=dispRef.current, r=dc.getBoundingClientRect();
    const px=(e.clientX-r.left)*(dc.width/r.width), py=(e.clientY-r.top)*(dc.height/r.height);
    const fx=(px-offRef.current.x)/zoom, fy=(py-offRef.current.y)/zoom;      // Rahmenraum
    const {dx,dy,skala}=lageRef.current, w=dc.width,h=dc.height;             // -> Werkraum
    return { x:(fx-(w/2+dx))/skala+w/2, y:(fy-(h+dy))/skala+h, fx, fy, px, py };
  };
  // ── DER STEMPEL (Besitzer, v0.63, wie im Bildprogramm): Alt+Klick oder
  // erster Tipp setzt die QUELLE; danach malt jeder Zug eine Kopie der
  // Komposition von der Quelle hierher - die Quelle wandert klassisch mit
  // dem Strichversatz. Groesse und Haerte gelten wie beim Pinsel. ──
  const fotografiere=()=>{
    const pc=procRef.current;
    const t=mach(pc.width,pc.height); const tc=t.getContext("2d");
    tc.drawImage(pc,0,0); tc.drawImage(strichRef.current,0,0);
    tc.globalCompositeOperation="destination-out"; tc.drawImage(radierRef.current,0,0);
    return t;
  };
  const kopiere=(foto,zx,zy,qx,qy)=>{
    const d=Math.max(2,groesse), r=d/2;
    const st=mach(d,d); const sc=st.getContext("2d");
    sc.drawImage(foto, qx-r,qy-r,d,d, 0,0,d,d);
    const g=sc.createRadialGradient(r,r,0,r,r,r);
    const kern=Math.max(0,Math.min(0.99,haerte));
    g.addColorStop(0,"rgba(0,0,0,1)"); g.addColorStop(kern,"rgba(0,0,0,1)"); g.addColorStop(1,"rgba(0,0,0,0)");
    sc.globalCompositeOperation="destination-in";
    sc.fillStyle=g; sc.fillRect(0,0,d,d);
    strichRef.current.getContext("2d").drawImage(st, zx-r, zy-r);
  };
  const sichere=()=>{ // Undo-Schnappschuss beider Ebenen (Deckel 6)
    const s=mach(strichRef.current.width,strichRef.current.height);
    s.getContext("2d").drawImage(strichRef.current,0,0);
    const rd=mach(radierRef.current.width,radierRef.current.height);
    rd.getContext("2d").drawImage(radierRef.current,0,0);
    undoRef.current.push({s,rd});
    if(undoRef.current.length>6) undoRef.current.shift();
    setKannZurueck(undoRef.current.length);
  };
  const zurueck=()=>{
    const z=undoRef.current.pop(); if(!z) return;
    for(const [cv,quelle] of [[strichRef.current,z.s],[radierRef.current,z.rd]]){
      const cx=cv.getContext("2d"); cx.clearRect(0,0,cv.width,cv.height); cx.drawImage(quelle,0,0);
    }
    setKannZurueck(undoRef.current.length); male();
  };

  const runter=(e)=>{
    e.preventDefault();
    // setPointerCapture kann bei exotischen Zeigern werfen - das darf nie
    // den Malvorgang abwuergen (Sondenlehre v0.56).
    try { e.target.setPointerCapture?.(e.pointerId); } catch {}
    const pt=brettPunkt(e);
    if (werkzeug==="pipette") {
      const pc=procRef.current;
      const t=mach(pc.width,pc.height); const tc=t.getContext("2d",{willReadFrequently:true});
      tc.drawImage(pc,0,0); tc.drawImage(strichRef.current,0,0);
      tc.save(); tc.globalCompositeOperation="destination-out"; tc.drawImage(radierRef.current,0,0); tc.restore();
      const d=tc.getImageData(Math.max(0,Math.min(pc.width-1,pt.x|0)),Math.max(0,Math.min(pc.height-1,pt.y|0)),1,1).data;
      const hex="#"+[d[0],d[1],d[2]].map(v=>v.toString(16).padStart(2,"0")).join("");
      setFarbe(hex); setStatus(`Pipette: ${hex}`); setWerkzeug("pinsel");
      return;
    }
    if (werkzeug==="bewegen") { zeichnetRef.current={art:"schieben", letzt:{px:pt.px,py:pt.py}}; return; }
    if (werkzeug==="figur") { zeichnetRef.current={art:"figur", letzt:{fx:pt.fx,fy:pt.fy}}; return; }
    if (werkzeug==="stempel") {
      if (e.altKey || !quelleRef.current) {
        quelleRef.current={x:pt.x,y:pt.y};
        setStatus("Stempel-Quelle gesetzt — jetzt an der Zielstelle malen (Alt+Klick: Quelle neu).");
        male(); return;
      }
      sichere();
      zeichnetRef.current={art:"stempel", letzt:pt,
        versatz:{x:pt.x-quelleRef.current.x, y:pt.y-quelleRef.current.y}, foto:fotografiere()};
      kopiere(zeichnetRef.current.foto, pt.x, pt.y, pt.x-zeichnetRef.current.versatz.x, pt.y-zeichnetRef.current.versatz.y);
      male(); return;
    }
    sichere();
    zeichnetRef.current={art:werkzeug, letzt:pt};
    if (werkzeug==="pinsel") stempel(strichRef.current,pt.x,pt.y,rgba(farbe,1));
    else stempel(radierRef.current,pt.x,pt.y,"rgba(0,0,0,1)");
    male();
  };
  const zieht=(e)=>{
    const z=zeichnetRef.current; if(!z) return;
    const pt=brettPunkt(e);
    if (z.art==="schieben") {
      offRef.current={x:offRef.current.x+(pt.px-z.letzt.px), y:offRef.current.y+(pt.py-z.letzt.py)};
      z.letzt={px:pt.px,py:pt.py}; male(); return;
    }
    if (z.art==="figur") {
      lageRef.current={ ...lageRef.current,
        dx: lageRef.current.dx+(pt.fx-z.letzt.fx), dy: lageRef.current.dy+(pt.fy-z.letzt.fy) };
      z.letzt={fx:pt.fx,fy:pt.fy}; setLageSchau({...lageRef.current}); male(); return;
    }
    if (z.art==="stempel") {
      const dx=pt.x-z.letzt.x, dy=pt.y-z.letzt.y;
      const strecke=Math.hypot(dx,dy), schritt=Math.max(1,groesse*0.30);
      for(let sw=schritt;sw<=strecke;sw+=schritt){
        const x=z.letzt.x+dx*sw/strecke, y=z.letzt.y+dy*sw/strecke;
        kopiere(z.foto, x, y, x-z.versatz.x, y-z.versatz.y);
      }
      kopiere(z.foto, pt.x, pt.y, pt.x-z.versatz.x, pt.y-z.versatz.y);
      z.letzt=pt; male(); return;
    }
    const cv=z.art==="pinsel"?strichRef.current:radierRef.current;
    const cssF=z.art==="pinsel"?rgba(farbe,1):"rgba(0,0,0,1)";
    const dx=pt.x-z.letzt.x, dy=pt.y-z.letzt.y;
    const strecke=Math.hypot(dx,dy), schritt=Math.max(1,groesse*0.22);
    for(let s=schritt;s<=strecke;s+=schritt) stempel(cv,z.letzt.x+dx*s/strecke,z.letzt.y+dy*s/strecke,cssF);
    stempel(cv,pt.x,pt.y,cssF);
    z.letzt=pt; male();
  };
  const hoch=()=>{ const war=zeichnetRef.current; zeichnetRef.current=null; if(war&&war.art!=="schieben") vermesse(); };

  // ── Speichern / Sammel-Aktionen ──────────────────────────────────────────
  const packeManuell=()=>{
    const leer=(cv)=>{const d=cv.getContext("2d").getImageData(0,0,cv.width,cv.height).data;
      for(let i=3;i<d.length;i+=4) if(d[i]>0) return false; return true;};
    const man={};
    if(!leer(strichRef.current)) man.striche=strichRef.current.toDataURL("image/webp",0.92);
    if(!leer(radierRef.current)) man.radierung=radierRef.current.toDataURL("image/webp",0.92);
    return Object.keys(man).length?man:null;
  };
  const speichern=()=>{
    const man=packeManuell();
    const eintrag={ regler:p, lage:lageRef.current, ...(man?{manuell:man}:{}) };
    const n={ ...alle, [fig.id]: eintrag };
    setAlle(n);
    setStatus(schreibeAlle(n)?`Gespeichert: ${fig.id}${man?" (mit Handstrichen)":""}`:"Speicher voll! Zip exportieren und Figuren zurücksetzen.");
  };
  const aufAlle=()=>{ const n={};
    for(const f of KATALOG) n[f.id]={ ...(alle[f.id]||{}), regler:p };
    // (Lage und Handstriche bleiben je Figur)
    setAlle(n); schreibeAlle(n); setStatus("Regler auf alle Figuren angewandt (Handstriche bleiben je Figur)"); };
  const zuruecksetzen=()=>{ const n={ ...alle }; delete n[fig.id]; setAlle(n); schreibeAlle(n);
    setP({ ...STANDARD });
    for(const cv of [strichRef.current,radierRef.current]) cv?.getContext("2d").clearRect(0,0,cv.width,cv.height);
    undoRef.current=[]; setKannZurueck(0); rechneNeu(); setStatus(`Zurückgesetzt: ${fig.id}`); };

  const rechneFigur=async(f)=>{ // volle Komposition einer Figur fuer Zip/GitHub
    const img=await new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=f.dunkel;});
    const w=img.naturalWidth,h=img.naturalHeight;
    const cv=mach(w,h); const cx=cv.getContext("2d",{willReadFrequently:true});
    cx.drawImage(img,0,0);
    const einst=alle[f.id];
    if(einst) komponiere(cx,w,h,einst);
    const lg=holeLage(einst);
    if(einst?.manuell){
      const lade=(url)=>new Promise((res)=>{if(!url)return res(null);const e=new Image();e.onload=()=>res(e);e.onerror=()=>res(null);e.src=url;});
      const [st,rd]=await Promise.all([lade(einst.manuell.striche),lade(einst.manuell.radierung)]);
      if(st) cx.drawImage(st,0,0);
      if(rd){cx.save();cx.globalCompositeOperation="destination-out";cx.drawImage(rd,0,0);cx.restore();}
    }
    // LAGE anwenden: fertige Ebenen bodenmitte-verankert in einen frischen
    // Rahmen zeichnen - exakt die Sicht der Vorschau.
    let fertig=cv;
    if (lg.dx||lg.dy||lg.skala!==1){
      fertig=mach(w,h); const fx=fertig.getContext("2d");
      fx.translate(w/2+lg.dx,h+lg.dy); fx.scale(lg.skala,lg.skala); fx.translate(-w/2,-h);
      fx.drawImage(cv,0,0);
    }
    const blob=await new Promise((res)=>fertig.toBlob(res,"image/webp",0.92));
    return new Uint8Array(await blob.arrayBuffer());
  };
  const dateiname=(f)=>(f.id.startsWith("b")&&f.id.length===3?`carved-boss-${f.id}-dark`:`carved-${f.id}-dark`)+".webp";

  const exportiere=async()=>{
    setStatus("Exportiere …");
    const eintraege=[];
    for(let i=0;i<KATALOG.length;i++){
      setStatus(`Rechne ${i+1}/${KATALOG.length}: ${KATALOG[i].id}`);
      eintraege.push({name:dateiname(KATALOG[i]),daten:await rechneFigur(KATALOG[i])});
      await new Promise(r=>setTimeout(r,0));
    }
    eintraege.push({name:"einstellungen.json",daten:new TextEncoder().encode(JSON.stringify(alle,null,2))});
    const url=URL.createObjectURL(new Blob([baueZip(eintraege)],{type:"application/zip"}));
    const a=document.createElement("a");a.href=url;a.download="gegenseite.zip";a.click();
    setTimeout(()=>URL.revokeObjectURL(url),4000);
    setStatus(`Zip mit ${eintraege.length-1} Figuren + Einstellungen exportiert`);
  };

  const [token,setToken]=useState(()=>{try{return localStorage.getItem("gg_werkstatt_token")||"";}catch{return "";}});
  const [merken,setMerken]=useState(true);
  const gh=async(pfad,methode="GET",koerper=null)=>{
    const r=await fetch(`https://api.github.com/repos/manubloc/grand-gambit${pfad}`,{method:methode,
      headers:{Authorization:`Bearer ${token}`,Accept:"application/vnd.github+json",...(koerper?{"Content-Type":"application/json"}:{})},
      body:koerper?JSON.stringify(koerper):undefined});
    if(!r.ok) throw new Error(`${methode} ${pfad}: ${r.status} ${(await r.text()).slice(0,120)}`);
    return r.json();
  };
  const ladeZuGithub=async()=>{
    const geaenderte=KATALOG.filter(f=>alle[f.id]);
    if(!token){setStatus("Ohne Token kein Laden — Token unten einfügen.");return;}
    if(!geaenderte.length){setStatus("Keine Figur hat gespeicherte Änderungen — nichts zu laden.");return;}
    try{
      if(merken){try{localStorage.setItem("gg_werkstatt_token",token);}catch{}}
      setStatus("Hole Stand von main …");
      const ref=await gh("/git/ref/heads/main");
      const basis=ref.object.sha;
      const basisCommit=await gh(`/git/commits/${basis}`);
      const baum=[];
      for(let i=0;i<geaenderte.length;i++){
        const f=geaenderte[i];
        setStatus(`Rechne und lade ${i+1}/${geaenderte.length}: ${f.id}`);
        const puffer=await rechneFigur(f);
        let bin="";for(let j=0;j<puffer.length;j+=8192)bin+=String.fromCharCode(...puffer.subarray(j,j+8192));
        const b=await gh("/git/blobs","POST",{content:btoa(bin),encoding:"base64"});
        baum.push({path:`src/app/ui/assets/carved/${dateiname(f)}`,mode:"100644",type:"blob",sha:b.sha});
      }
      setStatus("Baue Commit …");
      const neuerBaum=await gh("/git/trees","POST",{base_tree:basisCommit.tree.sha,tree:baum});
      const commit=await gh("/git/commits","POST",{message:`Figurenwerkstatt: ${geaenderte.length} Gegenseiten vom Besitzer geladen (${geaenderte.map(f=>f.id).join(", ")})`,tree:neuerBaum.sha,parents:[basis]});
      await gh("/git/refs/heads/main","PATCH",{sha:commit.sha});
      setStatus(`Geladen: Commit ${commit.sha.slice(0,7)} mit ${geaenderte.length} Figuren — Cloudflare deployt in ~3 Minuten.`);
    }catch(e){setStatus("Fehlgeschlagen: "+String(e.message||e).slice(0,160));}
  };

  if(!fig) return null;
  const knopf={padding:"9px 12px",borderRadius:10,border:`1px solid ${T.line}`,background:T.panel,
    color:T.text,fontFamily:"inherit",fontWeight:800,fontSize:12.5,cursor:"pointer"};
  const werkzeugKnopf=(id,zeichen,titel)=>(
    <button key={id} title={titel} onClick={()=>setWerkzeug(id)}
      style={{ ...knopf, padding:"8px 0", flex:1, fontSize:15,
        borderColor: werkzeug===id?T.selLine:T.line,
        background: werkzeug===id?`linear-gradient(165deg, ${T.sel}, #1a1030)`:T.panel,
        boxShadow: werkzeug===id?`0 0 8px ${T.selGlow}`:"none" }}>{zeichen}</button>
  );
  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,padding:"14px 12px 40px",maxWidth:560,margin:"0 auto"}}>
      <div className="gg-serif" style={{fontSize:20,color:T.goldBright,letterSpacing:".05em",marginBottom:2}}>Die Figurenwerkstatt</div>
      <div style={{fontSize:11.5,color:T.dim,marginBottom:10}}>Regler + Handarbeit je Figur speichern · „Zip exportieren" oder direkt zu GitHub laden.</div>

      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
        <button style={knopf} onClick={()=>setIdx((idx-1+KATALOG.length)%KATALOG.length)}>‹</button>
        <select value={idx} onChange={(e)=>setIdx(+e.target.value)}
          style={{flex:1,padding:"9px 10px",borderRadius:10,border:`1px solid ${T.line}`,background:T.panel,color:T.text,fontFamily:"inherit",fontSize:13}}>
          {KATALOG.map((f,i)=><option key={f.id} value={i}>{f.id}{alle[f.id]?" ●":""}</option>)}
        </select>
        <button style={knopf} onClick={()=>setIdx((idx+1)%KATALOG.length)}>›</button>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <div style={{flex:1,borderRadius:12,border:`1px solid ${T.line}`,background:"#100d1a",padding:6}}>
          <div style={{overflow:"hidden",borderRadius:8,display:"grid",placeItems:"center"}}>
            <canvas ref={dispRef} onPointerDown={runter} onPointerMove={zieht} onPointerUp={hoch} onPointerCancel={hoch}
              style={{maxWidth:"100%",maxHeight:340,touchAction:"none",cursor: werkzeug==="bewegen"?"grab":"crosshair"}}/>
          </div>
          <div style={{fontSize:10.5,color:T.faint,textAlign:"center"}}>Gegenseite (live) · {Math.round(zoom*100)} %</div>
        </div>
        <div style={{width:110,borderRadius:12,border:`1px solid ${T.line}`,background:"#100d1a",padding:6,display:"grid",placeItems:"center"}}>
          <img src={fig.hell} alt="" style={{maxWidth:"100%",maxHeight:300}}/>
          <div style={{fontSize:10.5,color:T.faint}}>helle Schwester</div>
        </div>
      </div>

      {/* WERKZEUGLEISTE: Bewegen · Pinsel · Radierer · Pipette · Zoom · Zurueck */}
      <div style={{display:"flex",gap:6,marginBottom:6}}>
        {werkzeugKnopf("bewegen","✥","Bewegen/Verschieben")}
        {werkzeugKnopf("pinsel","🖌","Pinsel")}
        {werkzeugKnopf("radierer","◨","Radierer")}
        {werkzeugKnopf("pipette","💧","Pipette (Farbe aufnehmen)")}
        {werkzeugKnopf("stempel","⧉","Stempel: erster Tipp/Alt+Klick setzt die Quelle, dann malen")}
        {werkzeugKnopf("figur","⤢","Figur verschieben")}
        <button style={{...knopf,flex:1}} onClick={()=>setZoom(Math.min(8,+(zoom*1.5).toFixed(2)))}>＋</button>
        <button style={{...knopf,flex:1}} onClick={()=>{const z=Math.max(1,+(zoom/1.5).toFixed(2));setZoom(z);if(z===1)offRef.current={x:0,y:0};}}>－</button>
        <button style={{...knopf,flex:1,opacity:kannZurueck?1:0.45}} onClick={zurueck} disabled={!kannZurueck}>↶</button>
        <button style={{...knopf,flex:1,borderColor:raster?T.selLine:T.line}} onClick={()=>setRaster(!raster)} title="Raster">⊞</button>
        <button style={{...knopf,flex:1,borderColor:brett?T.selLine:T.line,background:brett?`linear-gradient(165deg, ${T.sel}, #1a1030)`:T.panel}} onClick={()=>setBrett(!brett)} title="Schachbrett-Muster: zeigt, wie die Figur auf ihrem Feld sitzt">♟</button>
      </div>
      {werkzeug==="figur" && (
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:4}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
              <span>Figur-Größe</span><span style={{color:T.goldBright,fontWeight:800}}>{Math.round(lageSchau.skala*100)} %</span></div>
            <input type="range" min={0.4} max={1.8} step={0.01} value={lageSchau.skala}
              onChange={(e)=>{lageRef.current={...lageRef.current,skala:+e.target.value};setLageSchau({...lageRef.current});male();vermesse();}}
              style={{width:"100%"}}/>
          </div>
          <button style={knopf} onClick={()=>{lageRef.current={dx:0,dy:0,skala:1};setLageSchau({...lageRef.current});male();vermesse();}}>Lage 0</button>
        </div>
      )}
      {mass && (
        <div style={{fontSize:11.5,color:mass.sockel>=SOLL_SOCKEL-10&&mass.sockel<=SOLL_SOCKEL+10?"#8ce1a0":T.dim,marginBottom:6}}>
          Gemessen: Sockel <b>{mass.sockel} px</b> (Soll {SOLL_SOCKEL}) · Höhe <b>{mass.hoehe} px</b>
        </div>
      )}
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:4}}>
        <input type="color" value={farbe} onChange={(e)=>setFarbe(e.target.value)}
          style={{width:38,height:30,border:"none",background:"none",padding:0}}/>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}><span>Größe</span><span style={{color:T.goldBright,fontWeight:800}}>{groesse}px</span></div>
          <input type="range" min={2} max={90} step={1} value={groesse} onChange={(e)=>setGroesse(+e.target.value)} style={{width:"100%"}}/>
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}><span>Härte</span><span style={{color:T.goldBright,fontWeight:800}}>{Math.round(haerte*100)} %</span></div>
          <input type="range" min={0} max={1} step={0.05} value={haerte} onChange={(e)=>setHaerte(+e.target.value)} style={{width:"100%"}}/>
        </div>
      </div>

      {REGLER.map(([k,name,min,max,schritt])=>(
        <div key={k} style={{marginBottom:7}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11.5}}>
            <span>{name}</span><span style={{color:T.goldBright,fontWeight:800}}>{(+p[k]).toFixed(2)}</span></div>
          <input type="range" min={min} max={max} step={schritt} value={p[k]}
            onChange={(e)=>setP({...p,[k]:+e.target.value})} style={{width:"100%"}}/>
        </div>
      ))}

      <div style={{borderTop:`1px solid ${T.line}`,margin:"10px 0",paddingTop:8}}>
        <label style={{fontSize:12,display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
          <input type="checkbox" checked={p.ersatzAn} onChange={(e)=>setP({...p,ersatzAn:e.target.checked})}/>
          Farbe ersetzen (Farbwinkel)</label>
        {p.ersatzAn && ["ersatzVon","ersatzToleranz","ersatzNach"].map((k)=>(
          <div key={k} style={{marginBottom:6}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11.5}}>
              <span>{k==="ersatzVon"?"Von Farbton":k==="ersatzToleranz"?"± Toleranz":"Nach Farbton"}</span>
              <span style={{color:T.goldBright,fontWeight:800}}>{p[k]}°</span></div>
            <input type="range" min={k==="ersatzToleranz"?5:0} max={k==="ersatzToleranz"?120:360} step={1}
              value={p[k]} onChange={(e)=>setP({...p,[k]:+e.target.value})} style={{width:"100%"}}/>
          </div>
        ))}
      </div>

      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
        <button style={{...knopf,borderColor:`${T.gold}66`,color:T.goldBright}} onClick={speichern}>Für Figur speichern</button>
        <button style={knopf} onClick={()=>setP({...V5})}>v5-Startwerte</button>
        <button style={knopf} onClick={aufAlle}>Regler auf alle</button>
        <button style={knopf} onClick={zuruecksetzen}>Zurücksetzen</button>
        <button style={{...knopf,background:`linear-gradient(160deg,#f0d68a,#d9b565 55%,#b08c44)`,color:"#17110a",border:"none"}}
          onClick={exportiere}>Zip exportieren</button>
      </div>

      <div style={{borderTop:`1px solid ${T.line}`,marginTop:14,paddingTop:10}}>
        <div className="gg-serif" style={{fontSize:14,color:T.goldBright,marginBottom:4}}>Nur Admin: direkt zu GitHub laden</div>
        <div style={{fontSize:11,color:T.dim,lineHeight:1.5,marginBottom:8}}>
          Dein Token bleibt AUSSCHLIESSLICH auf diesem Gerät (es steckt nie im Spiel) und ist zugleich das Tor:
          ohne Token lädt hier niemand etwas. Geladen werden nur Figuren mit gespeicherten Änderungen, als EIN Commit
          auf main — danach deployt Cloudflare von selbst (~3 Min). Empfohlen: feinkörniges Token, nur dieses Repo,
          nur „Contents: Read and write".</div>
        <input type="password" placeholder="GitHub-Token (fine-grained, Contents: write)" value={token}
          onChange={(e)=>setToken(e.target.value)}
          style={{width:"100%",padding:"9px 10px",borderRadius:10,border:`1px solid ${T.line}`,background:T.panel,color:T.text,fontFamily:"inherit",fontSize:12.5,marginBottom:6}}/>
        <label style={{fontSize:11.5,color:T.dim,display:"flex",gap:7,alignItems:"center",marginBottom:8}}>
          <input type="checkbox" checked={merken} onChange={(e)=>setMerken(e.target.checked)}/>
          Token auf diesem Gerät merken</label>
        <button onClick={ladeZuGithub} disabled={!token}
          style={{...knopf,width:"100%",opacity:token?1:0.5,
            background:token?`linear-gradient(160deg,#f0d68a,#d9b565 55%,#b08c44)`:T.panel,
            color:token?"#17110a":T.dim,border:token?"none":`1px solid ${T.line}`}}>
          Geänderte Figuren zu GitHub laden ({Object.keys(alle).length})</button>
      </div>
      <div style={{fontSize:11.5,color:T.dim,marginTop:8,minHeight:16}}>{status}</div>
    </div>
  );
}
