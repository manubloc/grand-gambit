var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app/ui/theme.js
var CLASSIC, CARVED, T, GLOBAL_CSS;
var init_theme = __esm({
  "src/app/ui/theme.js"() {
    CLASSIC = {
      bg: "#000000",
      bg2: "#0a0710",
      panel: "#140f24",
      panel2: "#1c1533",
      line: "#2f2450",
      text: "#f0e9d8",
      dim: "#a9a48e",
      // faint lag bei 3,51:1 auf der Tafel - unter dem lesbaren Minimum. Derselbe
      // Ton, 18 % angehoben: 4,61:1. (Gleiche Kur wie carved in v0.31.0 bekam.)
      faint: "#837e6f",
      lime: "#d1ad55",
      limeDim: "#b08f3a",
      limeInk: "#17110a",
      // player / primary accent (gold)
      magenta: "#8fa0c0",
      magentaDim: "#66748f",
      magentaInk: "#10141d",
      // enemy accent (steel navy)
      gold: "#eac96b",
      danger: "#d5495a",
      green: "#58c98b",
      blue: "#8fa0c0",
      goldBright: "#f6e9a4",
      // DER RISS: die violette Stimme des Spiels. `rift` traegt Flaechen,
      // `riftInk` die Schrift darauf, `riftGlow` den Schein. Gemessen auf
      // Schwarz: rift 4,96:1, riftLine 7,72:1, riftBright 11,38:1 - deshalb
      // steht auf violetten Flaechen WEISSE Schrift, nie dunkle.
      rift: "#7c3aed",
      riftDeep: "#5b21b6",
      riftLine: "#a78bfa",
      riftBright: "#c4b5fd",
      riftInk: "#f7f3ff",
      riftGlow: "rgba(139,92,246,.55)",
      shadow: "0 10px 28px rgba(0,0,0,.55)",
      // How see-through the floating chrome (header card, dock) is, as a hex
      // alpha appended to `panel`, plus its backdrop blur. Classic stays nearly
      // solid: on the deep navy night a translucent bar just reads as muddy.
      glass: "ec",
      glassBlur: "12px",
      // The login screen used to hardwire these three. That was invisible while
      // classic was the only livery, and wrong the moment carved arrived: the
      // fields stayed night-navy on a daylight app. Classic keeps the exact old
      // values, so switching to classic is still byte-for-byte the old screen.
      // NOTE: the social buttons (Google, Apple, Discord) are deliberately NOT
      // tokenised - their colours are brand requirements, not our palette.
      // The ENTRY STRETCH - login and save picking - stays black in both liveries:
      // the title art sits on it and the whole opening reads as one dark curtain.
      // Only what comes AFTER logging in wears the lightened carved stone. Classic
      // keeps its exact former values here (login was #000, saves inherited T.bg).
      input: "#0b0813",
      loginBg: "#000",
      savesBg: "#000",
      errText: "#e08f8f",
      radius: 14,
      radiusSm: 10,
      radiusLg: 20,
      sqLight: "#2c3a5c",
      sqDark: "#1b2540",
      grid: "#0a0e18",
      serif: `Georgia, 'Palatino Linotype', 'Times New Roman', serif`,
      // ── DESIGNSYSTEM 1.0: semantische Ergaenzungen ────────────────────────────
      // AUSWAHL IST VIOLETT, AKTION IST GOLD. Bis v0.41 faerbten Segmented,
      // MapChip und Schwierigkeitswahl ihre Selektion goldfarben - im Schnellen
      // Spiel standen dadurch vier Goldflaechen gleichzeitig, Aktion und Auswahl
      // waren nicht zu unterscheiden. Diese drei Tokens sind die eine Quelle fuer
      // jeden gewaehlten Zustand: tiefe violette Flaeche, violette Kontur, helle
      // Schrift. Gemessen: selInk auf sel(ueber bg2) 12,9:1, riftBright 9,4:1.
      sel: "#241639",
      selLine: "#a78bfa",
      selInk: "#f5f1fd",
      selGlow: "rgba(124,58,237,.30)",
      // Statusstimmen, die bisher fehlten (danger/green existieren):
      warn: "#d8a441",
      info: "#7fa4d6",
      // EIN disabled fuer alle: gedimmt, ohne Glanz, ohne Schein.
      disOpacity: 0.45,
      // Beruehrziele: nichts Interaktives unter 44 px Hoehe (Auftrag §10.8).
      touch: 44,
      // ── MOTION-TOKENS: eine Uhr fuer das ganze Haus ───────────────────────────
      // Druck ~120ms, Wechsel ~220ms, Fuellen ~450ms, Glanzlauf-Zyklus 11s mit
      // gestaffelten Slots (Gilded.useShineDelay), Umgebungsglut 5-7s.
      mo: {
        press: "120ms",
        fast: "160ms",
        norm: "220ms",
        slow: "280ms",
        fill: "450ms",
        pop: "180ms",
        sheen: "11s",
        ambient: "5.5s",
        ease: "cubic-bezier(.25,.7,.3,1)",
        easeOut: "cubic-bezier(.2,.85,.3,1)"
      },
      // Schriftrollen (TYPOGRAPHY.md): display = Cinzel (Wortmarke, grosse Titel),
      // serif = Georgia-Stapel (mittlere Titel), quill = Cormorant (Erzaehlstimme),
      // Fliesstext = System-Sans (fuellt die Inter-Rolle ohne Ladekosten).
      display: `'Cinzel', Georgia, 'Times New Roman', serif`,
      quill: `'Cormorant Garamond', 'IM Fell English', Georgia, serif`
    };
    CARVED = {
      ...CLASSIC,
      // Zurueck auf das Blau - v0.33.0 hatte daraus Pergament gemacht, das war zu
      // weit. Gemeint war: dasselbe Blau, nur luftiger. Deshalb hier drei gezielte
      // Aenderungen gegen den Stand davor:
      //   1. GRUND dunkler (#202b40 -> #151d2c), damit das Schachbrett im
      //      Hintergrund darin verschwinden kann statt darauf zu liegen.
      //   2. TAFELN eine Stufe heller (#2c3a57 -> #35456a), damit sie sich vom
      //      dunkleren Grund weiter abheben als vorher.
      //   3. TAFELN leicht durchscheinend (Alpha e8 = 91 %), damit das Brett
      //      darunter zu ahnen ist. Die Kontraste sind gegen die GEMISCHTE Farbe
      //      gerechnet, nicht gegen die reine - sonst luegt die Rechnung.
      //   5. SCHWARZ als Grund und DER RISS als zweite Stimme. Das Introbild und
      //      das Wappen geben die Sprache vor: tiefes Schwarz, aus dem violettes
      //      Licht bricht. Die Tafeln bleiben ablesbar, verlieren aber ihr Blau
      //      zugunsten eines sehr dunklen Violett-Anteils.
      //   6. DIE VORLAGEN DES BESITZERS (design/vorlagen/ds1-vorlage-*.png,
      //      29. Juli): Grundton #0B0E14 statt reinem Schwarz, Tafeln #15121E /
      //      #1D1730, Schrift waermer (#F1E7C6 / #A89E8A), Violett heller
      //      (#7A3CFF / Glow #B07CFF), Statusfarben kraeftiger. Der Eintritt
      //      (Login/Spielstaende) bleibt per loginBg/savesBg tiefschwarz.
      bg: "#0b0e14",
      bg2: "#15121e",
      panel: "#1d1730e8",
      panel2: "#261d3ee8",
      line: "#38295e",
      text: "#f1e7c6",
      dim: "#a89e8a",
      faint: "#c0b8a4",
      rift: "#7a3cff",
      riftDeep: "#5a24cc",
      riftLine: "#b07cff",
      riftBright: "#cdb2ff",
      riftGlow: "rgba(122,60,255,.55)",
      warn: "#ffc857",
      green: "#3ccb7a",
      //   4. GOLD eine Stufe heller. Auf der blauen Tafel wirkte das alte Gold
      //      stumpf - Ueberschriften wie "DEINE SCHATZKAMMER" lasen sich fast
      //      dunkel. Gemessen gegen die effektive Tafelfarbe #324164 steigt der
      //      Kontrast von 6,29:1 auf 7,26:1 (gold) und 8,24:1 auf 9,07:1 (hell);
      //      der Akzent lime von 4,73:1 auf 5,85:1.
      gold: "#e6c35c",
      goldBright: "#f6e6ac",
      lime: "#d4af37",
      limeDim: "#b78a21",
      magenta: "#9fb0d0",
      magentaDim: "#76849f",
      shadow: "0 10px 24px rgba(0,0,0,.45)",
      glass: "d9",
      glassBlur: "18px",
      sqLight: "#41527a",
      sqDark: "#2d3d60",
      grid: "#1a2440",
      input: "#0b0813",
      loginBg: "#000",
      savesBg: "#000",
      errText: "#e8a6a6"
    };
    T = { ...CLASSIC };
    GLOBAL_CSS = `
  /* Desktop: bei 100% Browser-Zoom soll die App nicht verloren wirken \u2014
     gro\xDFe Fenster bekommen eine sanfte eingebaute Vergr\xF6\xDFerung. */
  @keyframes ggFade { from { opacity: 0 } to { opacity: 1 } }
  :root { --vhz: 1; }
  @media (min-width: 1440px) { #root { zoom: 1.15; } :root { --vhz: 1.15; } }
  @media (min-width: 1760px) { #root { zoom: 1.3; } :root { --vhz: 1.3; } }
  /* NOTHING in the app is selectable, draggable or downloadable \u2014 no text
     selection, no long-press save sheet, no drag-out of art, no image context
     menu. The ONLY exception is fields the user types into (name, password,
     search, import boxes), so copy/paste still works there. */
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;
      -webkit-user-drag: none; user-drag: none; -webkit-touch-callout: none; }
  input, textarea, [contenteditable="true"], [contenteditable=""] {
      -webkit-user-select: text; -moz-user-select: text; -ms-user-select: text; user-select: text;
      -webkit-touch-callout: default; }
  /* pull-to-refresh is retired \u2014 the app updates itself (v0.21.42); the
     gesture only ever fought the map pan and the board */
  html, body { overscroll-behavior: none; overscroll-behavior-y: none; }
  img, svg, canvas { -webkit-touch-callout: none; -webkit-user-drag: none; user-drag: none; user-select: none; }
  /* number fields render as plain gold boxes \u2014 no native spinners */
  input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  html, body, #root { height: 100%; }
  button, a { -webkit-tap-highlight-color: transparent; }
  /* DIE WURZEL DES PLASTIK-RAHMENS: Ohne eigene Angabe geben Browser jedem
     Knopf und Feld ihren Standardrahmen "2px outset" - eine dicke, dunkle,
     dreidimensional wirkende Kante. Genau die soll nirgends erscheinen.
     Deshalb hier EIN Reset fuer alle Bedienelemente: duenne Kante, flach.
     Eigene Stile im Bauteil ueberschreiben das wie gehabt. */
  button, input, select, textarea {
    border: 1px solid transparent;
    border-radius: ${T.radiusSm}px;
    background-clip: padding-box;
  }
  input, select, textarea { border-color: ${T.line}; background-color: ${T.bg2}; color: ${T.text}; }
  input:focus, select:focus, textarea:focus { border-color: ${T.riftLine}; box-shadow: 0 0 0 3px rgba(124,58,237,.18); outline: none; }
  button:focus:not(:focus-visible), a:focus:not(:focus-visible) { outline: none; }
  /* Tastatur-Fokus ist sichtbar und violett - Fokus ist eine Auswahl. */
  button:focus-visible, a:focus-visible { outline: 2px solid ${T.riftLine}; outline-offset: 2px; }
  body {
    margin: 0; color: ${T.text};
    background: ${T.bg};
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased; overflow-x: hidden;
  }
  button:active { transform: scale(.97); }
  .gg-thinbar { scrollbar-width: thin; scrollbar-color: rgba(233,210,150,.28) transparent; }
  .gg-thinbar::-webkit-scrollbar { width: 5px; }
  .gg-thinbar::-webkit-scrollbar-thumb { background: rgba(233,210,150,.28); border: none; border-radius: 99px; }
  ::-webkit-scrollbar { width: 10px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #2b3550; border: 2.5px solid ${T.bg}; border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: #c9a45c88; }
  ::-webkit-scrollbar-corner { background: transparent; }
  * { scrollbar-width: thin; scrollbar-color: #2b3550 transparent; }
  input { font-family: inherit; }
  /* Die drei Stimmen des Hauses - selbst gebuendelt (OFL, public/fonts),
     91 KB gesamt, im Precache: sie sprechen auch offline. font-display swap
     laesst Georgia sofort stehen, bis die echte Stimme geladen ist. */
  @font-face { font-family: 'Cinzel'; src: url('/fonts/cinzel-600.woff2') format('woff2');
    font-weight: 600; font-style: normal; font-display: swap; }
  @font-face { font-family: 'Cormorant Garamond'; src: url('/fonts/cormorant-600.woff2') format('woff2');
    font-weight: 600; font-style: normal; font-display: swap; }
  @font-face { font-family: 'Cormorant Garamond'; src: url('/fonts/cormorant-500i.woff2') format('woff2');
    font-weight: 500; font-style: italic; font-display: swap; }
  .gg-serif { font-family: ${T.serif}; }
  /* JEDE GLYPHE PASST IN IHRE ZELLE: die Aufstellungs-Zellen sind bei 320 px
     35 px hoch, feste Figuren-Glyphen 39 - vier Pixel Ueberlauf (gemessen,
     pruefe-textfluss). Wer diese Klasse traegt, skaliert sein SVG hinein. */
  .gg-fit-svg { display: grid; place-items: center; min-width: 0; min-height: 0;
    /* BESTIMMTE SPUREN: mit einer auto-Zeile ist max-height:100% des Kindes
       unbestimmt und wird ignoriert (gemessen: 36-px-Bild in 28,8-px-Huelle
       TROTZ Klasse - das Bild folgte nur seinem Seitenverhaeltnis). 100%-
       Spuren machen den Kasten zur Bezugsgroesse. */
    grid-template-rows: 100%; grid-template-columns: 100%; }
  /* !important mit Absicht: TileArt setzt seine Masse INLINE - eine
     Einpass-Klasse ohne Vorfahrt waere wirkungslos (gemessen: 39-px-Bild in
     28,8-px-Huelle trotz Klasse). Die Klasse ist opt-in; wer sie traegt,
     will genau dieses Verhalten. */
  .gg-fit-svg > svg, .gg-fit-svg > img { max-width: 100% !important; max-height: 100% !important;
    width: auto !important; height: auto !important; object-fit: contain; }
  /* NUR fuer Wortmarke und grosse Titel (>=18px) - nie fuer kleine Etiketten. */
  .gg-display { font-family: ${T.display}; font-weight: 600; }
  /* WER WENIG BEWEGUNG WUENSCHT, BEKOMMT RUHE: Glanzlaeufe, Glut und
     Dauerpulse stehen still; Zustandswechsel bleiben (fast) sofort sichtbar. */
  /* DIE LETZTEN SEKUNDEN: Uhrpuls und Brettglimmen im selben Takt. Bei
     reduzierter Bewegung stehen beide still - die Uhr bleibt dann gross
     und rot, das genuegt als Signal. */
  @keyframes ggUhrAlarm { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.16); } }
  /* v0.71.14: DER RISS ZUCKT - ein greller Schlag, dann langes Ausglimmen.
     Traegt die Figur, die zuletzt gezogen hat. */
  @keyframes ggRissBlitz {
    0%   { filter: brightness(0.94) contrast(1.12) drop-shadow(0 0 1px rgba(150,105,255,.62)) drop-shadow(0 0 2.5px rgba(150,105,255,.31)); }
    6%   { filter: brightness(1.55) contrast(1.2) drop-shadow(0 0 3px rgba(232,220,255,1)) drop-shadow(0 0 9px rgba(168,120,255,.95)) drop-shadow(0 0 20px rgba(124,58,237,.8)); }
    14%  { filter: brightness(1.12) contrast(1.14) drop-shadow(0 0 2px rgba(198,168,255,.8)) drop-shadow(0 0 7px rgba(150,105,255,.6)); }
    22%  { filter: brightness(1.42) contrast(1.18) drop-shadow(0 0 3px rgba(240,232,255,.95)) drop-shadow(0 0 12px rgba(150,105,255,.85)); }
    100% { filter: brightness(0.94) contrast(1.12) drop-shadow(0 0 1px rgba(150,105,255,.62)) drop-shadow(0 0 2.5px rgba(150,105,255,.31)); }
  }
  @keyframes ggGoldBlitz {
    0%   { filter: brightness(1.10) contrast(1.10) drop-shadow(0 0 1px rgba(240,214,138,.5)); }
    8%   { filter: brightness(1.4) contrast(1.14) drop-shadow(0 0 3px rgba(255,246,214,.95)) drop-shadow(0 0 10px rgba(240,214,138,.7)); }
    100% { filter: brightness(1.10) contrast(1.10) drop-shadow(0 0 1px rgba(240,214,138,.5)); }
  }
  @keyframes ggBrettAlarm {
    0%, 100% { box-shadow: inset 0 0 0 0 rgba(214,73,90,0); }
    50% { box-shadow: inset 0 0 34px 6px rgba(214,73,90,.42), inset 0 0 90px rgba(122,60,255,.18); }
  }
  /* Waehrend der Daumen die Karte zieht, ruht das Wetter: jede Animation im
     Rahmen haelt an, damit ALLE Frames dem Zug gehoeren (gemessen 48-62 ms
     Frames beim Ziehen mit laufenden Wolken). */
  .gg-karte-zieht * { animation-play-state: paused !important; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important;
      animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  }
  @keyframes pop { from { transform: scale(.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes ggGlow { 0%,100% { box-shadow: 0 0 5px rgba(201,164,92,.22); } 50% { box-shadow: 0 0 14px rgba(201,164,92,.5); } }
  /* THE TREASURY'S MEDALLION, once its plate is opened: the ring of light
     turns around the emblem, and sparks fly off TANGENTIALLY from the brightest
     point \u2014 each spark rides its own orbit, so they leave the rim sideways
     rather than shooting straight out. */
  /* one sweep of light across a treasury plate, run once when it is tapped */
  /* Der Streifen ist 62 % so breit wie die Platte. translateX rechnet in der
     EIGENEN Breite, also brachte das alte Ziel von 120 % seine linke Kante
     nur auf 0.62*120 = 74 % der Platte - und weil die Animation mit both
     stehen bleibt, lag der Rest des Verlaufs danach fuer immer im letzten
     Viertel. Das war die harte Kante. Damit er vollstaendig hinauslaeuft,
     muss die linke Kante ueber 100 % kommen: 100/62 = 161 %. 175 % gibt Luft. */
  @keyframes ggPlateSheen { from { transform: translateX(-120%); } to { transform: translateX(175%); } }
  /* der Funkenschlag: ein Lichtpunkt wandert die Kontur entlang */
  @keyframes ggFunkenlauf { to { background-position: 200% 0; } }
  .gg-funkenkontur { position: relative; }
  .gg-funkenkontur::after { content: ""; position: absolute; inset: -1px; border-radius: inherit; padding: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(196,181,253,.15) 30%, rgba(230,220,255,.95) 46%,
      rgba(196,181,253,.6) 54%, rgba(139,92,246,.2) 70%, transparent 100%);
    background-size: 200% 100%; animation: ggFunkenlauf 2.4s linear infinite;
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
  /* das Siegel am verschlossenen Weg atmet leise */
  /* box-shadow ist eine MAL-Eigenschaft: ihr Puls strich die ganze
     Weltschicht der Karte neu (gemessen). Jetzt fester Schein, Puls per
     Opazitaet - das komponiert, statt zu malen. */
  @keyframes ggGatePuls { 0%, 100% { opacity: .8; } 50% { opacity: 1; } }
  @keyframes ggSaum { 0%, 100% { opacity: .72; } 50% { opacity: 1; } }
  @keyframes ggRiftOpen { from { transform: scale(1.09); opacity: 0; } 40% { opacity: .92; } to { transform: scale(1); opacity: .92; } }
  @keyframes ggRiftPulse { 0%, 100% { box-shadow: 0 0 9px rgba(124,58,237,.35); border-color: rgba(167,139,250,.55); }
    50% { box-shadow: 0 0 20px rgba(139,92,246,.65); border-color: rgba(196,181,253,.95); } }
  @keyframes ggHop { 0% { transform: translateY(0); } 32% { transform: translateY(-13px); } 55% { transform: translateY(0) scale(1.04, .94); } 72% { transform: translateY(-3px); } 100% { transform: translateY(0); } }
  @keyframes ggGlide { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-3px) rotate(-1.6deg); } }
  @keyframes ggBob { 0%, 100% { transform: translateY(0) rotate(-0.8deg); } 50% { transform: translateY(-2.5px) rotate(0.8deg); } }
  @keyframes ggRingSpin { to { transform: rotate(360deg); } }
  @keyframes ggSpark {
    0%   { opacity: 0; transform: rotate(var(--a)) translateX(var(--r)) scale(.5); }
    12%  { opacity: 1; }
    100% { opacity: 0; transform: rotate(calc(var(--a) + 46deg)) translateX(calc(var(--r) + 26px)) scale(.2); }
  }
  @keyframes ggMedalRise { from { transform: translateY(6px) scale(.86); } to { transform: none; } }
  @keyframes ggGlint { 0%, 86%, 100% { opacity: 0; } 90% { opacity: .85; } 95% { opacity: 0; } }
  @keyframes rise { from { opacity: 0; } to { opacity: 1; } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 0 2px ${T.danger}; } 50% { box-shadow: 0 0 0 2px ${T.danger}66; } }
  @keyframes hit { 0% { opacity: .8; } 100% { opacity: 0; } }
  @keyframes ggShake { 0%,100% { transform: translateX(0) rotate(0); }
    15% { transform: translateX(-9%) rotate(-5deg); } 30% { transform: translateX(8%) rotate(4deg); }
    45% { transform: translateX(-6%) rotate(-3deg); } 60% { transform: translateX(5%) rotate(2deg); }
    75% { transform: translateX(-3%) rotate(-1deg); } }
  @keyframes ggFallAway {
    0% { transform: translate(0,0) rotate(0) scale(1); opacity: 1; }
    18% { transform: translate(calc(var(--fdir) * 20%), -34%) rotate(calc(var(--fdir) * 130deg)) scale(1.06); opacity: 1; }
    100% { transform: translate(calc(var(--fdir) * 340%), -120%) rotate(calc(var(--fdir) * 900deg)) scale(.12); opacity: 0; } }
  /* the FALLEN fly to their captor's tray: UP off the top (foe took my piece \u2192
     my tray sits below, so it flies down; I took a foe piece \u2192 its tray sits up
     top, flies up). --fdir still nudges sideways so pieces don't overlap. */
  @keyframes splashRing { from { transform: scale(.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes splashPiece { from { transform: translateY(26px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes splashSide { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: .92; } }
  @keyframes splashText { from { letter-spacing: .55em; opacity: 0; } to { letter-spacing: .18em; opacity: 1; } }
  @keyframes marbleWave { 0% { opacity: 0; } 35% { opacity: .34; } 100% { opacity: 0; } }
  /* three opening flights \u2014 each battle draws one. All of them ride CLOSE
     along the enemy's TWO ranks (screen-filling) and sweep past once before
     settling. A: left\u2192right. B: right\u2192left. C: a glance at your own line,
     then the sweep. */
  @keyframes ggBoardZoomIn { 0% { transform: scale(.22) translateY(2%); filter: blur(2.5px); }
    55% { filter: blur(0); }
    100% { transform: scale(1) translateY(0); filter: blur(0); } }
  @keyframes ggBoardFlyA { 0% { transform: scale(2.7) translateY(16.5%) translateX(16.2%); }
    14% { transform: scale(2.7) translateY(16.5%) translateX(16.2%); }
    62% { transform: scale(2.7) translateY(16.5%) translateX(-16.2%); }
    82% { transform: scale(1.55) translateY(5%) translateX(-3%); }
    100% { transform: scale(1) translateY(0) translateX(0); } }
  @keyframes ggBoardFlyB { 0% { transform: scale(2.7) translateY(16.5%) translateX(-16.2%); }
    14% { transform: scale(2.7) translateY(16.5%) translateX(-16.2%); }
    62% { transform: scale(2.7) translateY(16.5%) translateX(16.2%); }
    82% { transform: scale(1.55) translateY(5%) translateX(3%); }
    100% { transform: scale(1) translateY(0) translateX(0); } }
  @keyframes ggBoardFlyC { 0% { transform: scale(2.2) translateY(-19%) translateX(-8%); }
    16% { transform: scale(2.2) translateY(-19%) translateX(6%); }
    30% { transform: scale(2.7) translateY(16.5%) translateX(16.2%); }
    72% { transform: scale(2.7) translateY(16.5%) translateX(-16.2%); }
    86% { transform: scale(1.5) translateY(4%) translateX(0); }
    100% { transform: scale(1) translateY(0) translateX(0); } }
  @keyframes ggAbilityGlow { 0%, 100% { box-shadow: 0 0 10px rgba(240,206,122,.22); }
    50% { box-shadow: 0 0 22px rgba(240,206,122,.5); } }
  @keyframes ggUpPulse { 0%, 100% { box-shadow: 0 0 10px rgba(124,58,237,.4), 0 0 22px rgba(124,58,237,.18), inset 0 0 10px rgba(124,58,237,.12); }
    50% { box-shadow: 0 0 18px rgba(139,92,246,.65), 0 0 34px rgba(124,58,237,.3), inset 0 0 14px rgba(124,58,237,.2); } }
  @keyframes ggNewPulse { 0%, 100% { box-shadow: inset 0 0 0 2px rgba(240,206,122,.25), 0 0 10px rgba(240,206,122,.15); }
    50% { box-shadow: inset 0 0 0 4.5px rgba(246,233,164,.95), 0 0 30px rgba(240,206,122,.8); } }
  @keyframes ggSmokeUp { 0% { transform: translateX(-50%) translateY(6%) scaleY(.92); opacity: .45 }
    50% { transform: translateX(-47%) translateY(-6%) scaleY(1.04); opacity: .8 }
    100% { transform: translateX(-50%) translateY(-14%) scaleY(1.1); opacity: .35 } }
  @keyframes ggFogR { from { transform: translateX(5%) } to { transform: translateX(-6%) } }
  @keyframes ggFogR2 { from { transform: translateX(7%) translateY(1.5%) } to { transform: translateX(-4%) translateY(-1%) } }
  /* drifting clouds over the map's head: layers crossing at different speeds,
     travelling FAR across the sky so blue/sun/dusk keeps opening up between them */
  @keyframes ggCloudA { 0% { transform: translate(-48%, 3%) scale(1.16); }
    50% { transform: translate(4%, -5%) scale(1.34); }
    100% { transform: translate(46%, 4%) scale(1.18); } }
  @keyframes ggCloudB { 0% { transform: translate(44%, -3%) scale(1.32); }
    50% { transform: translate(-10%, 6%) scale(1.14); }
    100% { transform: translate(-46%, -2%) scale(1.3); } }
  @keyframes ggCloudC { 0% { transform: translate(28%, 2%) scale(1.22); }
    100% { transform: translate(-34%, -4%) scale(1.46); } }
  @keyframes ggCloudD { 0% { transform: translate(-38%, -2%) scale(1.2); }
    50% { transform: translate(14%, 5%) scale(1.3); }
    100% { transform: translate(40%, -3%) scale(1.16); } }
  @keyframes ggCloudBreath { 0%,100% { opacity: .58; } 50% { opacity: 1; } }
  @keyframes ggFogA { from { transform: translate(-3.5%, -1.5%) } to { transform: translate(3.5%, 1.5%) } }
  @keyframes ggFogB { from { transform: translate(3%, 1.8%) } to { transform: translate(-3%, -1.8%) } }
  @keyframes ggSweep { from { transform: translate(var(--sx0), var(--sy0)); } to { transform: translate(var(--sx1), var(--sy1)); } }
  @keyframes ggRedeem { from { filter: hue-rotate(185deg) saturate(.5) brightness(.9) drop-shadow(0 3px 6px rgba(0,0,0,.5)); } to { filter: hue-rotate(0deg) saturate(1) brightness(1) drop-shadow(0 3px 6px rgba(0,0,0,.5)); } }
  @keyframes bossFlee { 0% { transform: translateX(-50%) rotate(0deg); opacity: 1; } 18% { transform: translateX(calc(-50% + 14px)) rotate(9deg); opacity: 1; } 100% { transform: translateX(calc(-50% + 340px)) rotate(6deg); opacity: 0; } }
  @keyframes ctaPop { from { opacity: 0; transform: translate(-50%,4px) scale(.92); } to { opacity: 1; transform: translate(-50%,0) scale(1); } }
  @keyframes queuePulse { 0%,100% { transform: scale(1); opacity: .55; } 50% { transform: scale(1.18); opacity: .18; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes arrowFade { 0% { opacity: 0; } 12% { opacity: 1; } 60% { opacity: 1; } 100% { opacity: 0; } }
  /* a plain stride LEANS into the direction of travel mid-way and settles back
     upright on arrival \u2014 so the ghost's final frame is IDENTICAL to the real
     piece and the handoff is invisible. The shadow breathes in and out with it. */
  @keyframes ggLean {
    0%   { transform: rotate(0deg); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
    45%  { transform: rotate(var(--tilt, 0deg)); filter: drop-shadow(0 3px 6px rgba(0,0,0,.5)); }
    100% { transform: rotate(0deg); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); } }
  /* a LEAP is a real hop: spring high, grow toward the eye at the apex, land \u2014
     upright the whole way (no lean), the shadow deepens beneath at the peak. */
  @keyframes ggLeapArc {
    0%   { transform: translateY(0) scale(1); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
    46%  { transform: translateY(-110%) scale(1.18); filter: drop-shadow(0 16px 12px rgba(0,0,0,.42)); }
    100% { transform: translateY(0) scale(1); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); } }
  /* a blocked strike: the attacker lunges toward the foe (--bx/--by point at the
     target) and springs back to where it stood \u2014 ends neutral. */
  @keyframes ggBounce {
    0%   { transform: translate(0,0); }
    38%  { transform: translate(var(--bx, 0), var(--by, 0)); }
    100% { transform: translate(0,0); } }
  @keyframes herePulse { 0%,100% { box-shadow: 0 0 0 3px #c9a45c66, 0 0 0 7px #c9a45c22; } 50% { box-shadow: 0 0 0 5px #c9a45c88, 0 0 0 11px #c9a45c1c; } }
  .gg-quill { font-family: ${T.quill}; font-style: italic; font-weight: 500; }
  /* Der Glanz lief bisher mit ease-in-out \u2014 und bremste damit AB, W\xC4HREND das
     Band noch im Bild war: es sah aus, als bliebe der Schimmer bei zwei
     Dritteln stehen und l\xF6ste sich dort auf. Der Lauf ist jetzt gleichf\xF6rmig
     (linear auf dem Sweep-Abschnitt, per-Keyframe gesetzt und damit st\xE4rker
     als das ease-in-out am Element), und er reicht mit 360% sicher \xFCber die
     rechte Kante hinaus. Danach ruht das Band bis zum n\xE4chsten Durchgang. */
  @keyframes ggShine { 0% { transform: translateX(-170%) skewX(-18deg); animation-timing-function: linear; } 13% { transform: translateX(360%) skewX(-18deg); } 100% { transform: translateX(360%) skewX(-18deg); } }
  @keyframes ggPulse { 0%,100% { opacity: .35; transform: scale(1); } 50% { opacity: .9; transform: scale(1.12); } }
  @keyframes splashRule { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @keyframes ggEdgeSweep { 0% { background-position: 230% 0; } 60%, 100% { background-position: -130% 0; } }
  @keyframes splashOut { to { opacity: 0; visibility: hidden; } }
`;
  }
});

// src/app/ui/SchaukammerScreen.jsx
var SchaukammerScreen_exports = {};
__export(SchaukammerScreen_exports, {
  SchaukammerScreen: () => SchaukammerScreen
});
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function stufe(kante) {
  return kante >= 3e3 ? "4K" : "HQ";
}
function gruppeVon(rel) {
  const teile = rel.split("/");
  const ordner = teile.length > 1 ? teile[0] : "";
  for (const [name, o] of GRUPPEN) if (o === ordner) return name;
  return "Weiteres";
}
function titelVon(pfad) {
  const n = pfad.split("/").pop().replace(/\.(webp|jpg|png|svg)$/, "");
  return n.replace(/^carved-/, "").replace(/-light$/, " \xB7 hell").replace(/-dark$/, " \xB7 dunkel").replace(/-hell$/, " \xB7 hell").replace(/-dunkel$/, " \xB7 dunkel");
}
function SchaukammerScreen() {
  const [roh, setRoh] = useState([]);
  const [zu, setZu] = useState(null);
  const [bestand, setBestand] = useState(null);
  useEffect(() => {
    let lebt = true;
    fetch(VERZEICHNIS).then((r) => r.json()).then((l) => lebt && setRoh(l)).catch(() => {
    });
    fetch(ZUORDNUNG).then((r) => r.json()).then((z) => lebt && setZu(z)).catch(() => {
    });
    fetch(BESTAND).then((r) => r.json()).then((b) => lebt && setBestand(b)).catch(() => {
    });
    return () => {
      lebt = false;
    };
  }, []);
  const ALLE = useMemo(() => roh.map((p) => {
    const rel = p.replace(/^\/schau\//, "");
    const t = zu && zu.treffer && zu.treffer[rel];
    const stand = !zu ? null : t ? t.sicher ? "sicher" : "moeglich" : "ohne";
    return {
      pfad: p,
      rel,
      datei: p.split("/").pop(),
      titel: titelVon(p),
      gruppe: gruppeVon(rel),
      quelle: p,
      // Die Vorschau heisst wie das Bild, nur mit .webp dahinter (ausser es
      // heisst schon so). Das Abschneiden der Endung liess logo.jpg und
      // logo.webp auf dieselbe Datei zeigen.
      vorschau: "/schau-klein/" + (/\.webp$/i.test(rel) ? rel : rel + ".webp"),
      stand,
      wert: t ? t.wert : 0,
      vonHand: !!(t && t.quelle === "hand"),
      kante: t ? t.kante : 0,
      mass: t ? t.mass : null,
      massSpiel: t ? t.massSpiel : null,
      original: t ? "/bildarchiv/" + t.original : null,
      originalVorschau: t ? "/bildarchiv-klein/" + (/\.webp$/i.test(t.original) ? t.original : t.original + ".webp") : null
    };
  }), [roh, zu]);
  const gruppen = useMemo(() => {
    const g = [];
    for (const e of ALLE) if (!g.includes(e.gruppe)) g.push(e.gruppe);
    return g;
  }, [ALLE]);
  const [gruppe, setGruppe] = useState(null);
  const zeigeGruppe = gruppe || gruppen[0];
  const [suche, setSuche] = useState("");
  const [filter, setFilter] = useState("alle");
  const [spalten, setSpalten] = useState(4);
  const [gross, setGross] = useState(null);
  const tafel = useMemo(() => gruppen.map((g) => {
    const e = ALLE.filter((x) => x.gruppe === g);
    return {
      gruppe: g,
      gesamt: e.length,
      sicher: e.filter((x) => x.stand === "sicher").length,
      moeglich: e.filter((x) => x.stand === "moeglich").length,
      ohne: e.filter((x) => x.stand === "ohne").length
    };
  }), [ALLE, gruppen]);
  const sichtbar = useMemo(() => {
    const s = suche.trim().toLowerCase();
    return ALLE.filter((e) => e.gruppe === zeigeGruppe && (filter === "alle" || e.stand === filter) && (!s || e.titel.toLowerCase().includes(s) || e.datei.toLowerCase().includes(s)));
  }, [ALLE, zeigeGruppe, suche, filter]);
  const [merk, setMerk] = useState({});
  const [wahl, setWahl] = useState([]);
  const [wahlModus, setWahlModus] = useState(false);
  const gewaehlt = (rel) => wahl.includes(rel);
  const kippe = (rel) => setWahl((w) => w.includes(rel) ? w.filter((x) => x !== rel) : [...w, rel]);
  const markiereWahl = (art) => {
    setMerk((m) => {
      const n = { ...m };
      const alleSchon = wahl.every((r) => n[r] === art);
      for (const r of wahl) {
        if (alleSchon) delete n[r];
        else n[r] = art;
      }
      return n;
    });
    setWahl([]);
  };
  const merkListe = () => {
    const z = Object.entries(merk).filter(([, a2]) => a2);
    if (!z.length) return;
    const karte = Object.fromEntries(ALLE.map((e) => [e.rel, e]));
    const zeilen = z.map(([r, a2]) => {
      const e = karte[r];
      return `${a2}	${r}	${e && e.original ? e.original.replace("/bildarchiv/", "") : "KEIN ORIGINAL"}`;
    });
    const blob = new Blob(["art	datei	original\n" + zeilen.join("\n") + "\n"], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "aussortiert.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const laden = (url, name) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const knopf = (an) => ({
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 12,
    fontWeight: 700,
    color: an ? "#241a08" : "#d8d2ea",
    background: an ? "linear-gradient(180deg,#f0d68f,#d3ae5c)" : "rgba(30,22,52,.6)",
    border: `1px solid ${an ? T.gold : "rgba(167,139,250,.3)"}`,
    borderRadius: 999,
    padding: "6px 11px"
  });
  return /* @__PURE__ */ jsxs("div", { style: {
    minHeight: "100dvh",
    background: "radial-gradient(120% 80% at 50% -10%, #1a1430, #0a0812 70%)",
    color: "#e8e2cf",
    padding: "18px 14px 96px",
    fontFamily: "inherit"
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1100, margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("div", { className: "gg-serif", style: { fontSize: 22, letterSpacing: ".08em", color: T.goldBright, marginBottom: 4 }, children: "DIE SCHAUKAMMER" }),
      /* @__PURE__ */ jsxs("div", { className: "gg-serif", style: { fontSize: 12.5, color: T.dim, fontStyle: "italic", marginBottom: 14 }, children: [
        ALLE.length,
        " Bilder des Hauses. Jede Kachel sagt, ob ihr Original noch da ist."
      ] }),
      zu && /* @__PURE__ */ jsxs("div", { style: {
        background: "linear-gradient(165deg,rgba(30,22,52,.55),rgba(14,10,24,.6))",
        border: "1px solid rgba(167,139,250,.26)",
        borderRadius: 12,
        padding: "12px 14px",
        marginBottom: 14
      }, children: [
        /* @__PURE__ */ jsx("div", { className: "gg-serif", style: {
          fontSize: 12.5,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: T.goldBright,
          marginBottom: 2
        }, children: "Bestand \xB7 wo liegt ein HQ-Original?" }),
        /* @__PURE__ */ jsxs("div", { style: { fontSize: 12.5, marginBottom: 9 }, children: [
          /* @__PURE__ */ jsx("b", { style: { color: ZUSTAND.sicher.farbe }, children: ALLE.filter((e) => e.stand === "sicher").length }),
          " von ",
          ALLE.length,
          " Bildern haben eines. ",
          /* @__PURE__ */ jsxs("span", { style: { color: ZUSTAND.moeglich.farbe }, children: [
            ALLE.filter((e) => e.stand === "moeglich").length,
            " unsicher"
          ] }),
          ", ",
          /* @__PURE__ */ jsxs("span", { style: { color: ZUSTAND.ohne.farbe }, children: [
            ALLE.filter((e) => e.stand === "ohne").length,
            " ohne"
          ] }),
          "."
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: 5 }, children: tafel.map((g) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 9, fontSize: 12.5 }, children: [
          /* @__PURE__ */ jsx("span", { style: { flex: "1 1 auto", minWidth: 0 }, children: g.gruppe }),
          /* @__PURE__ */ jsxs("span", { style: {
            flex: "0 0 92px",
            height: 7,
            borderRadius: 99,
            display: "flex",
            background: "rgba(255,255,255,.08)",
            overflow: "hidden"
          }, children: [
            /* @__PURE__ */ jsx("span", { style: { width: g.sicher / g.gesamt * 100 + "%", background: ZUSTAND.sicher.farbe } }),
            /* @__PURE__ */ jsx("span", { style: { width: g.moeglich / g.gesamt * 100 + "%", background: ZUSTAND.moeglich.farbe } })
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { flex: "0 0 78px", textAlign: "right", color: g.ohne ? "#e0a0a8" : "#a7e08f" }, children: [
            g.sicher,
            g.moeglich ? `+${g.moeglich}` : "",
            "/",
            g.gesamt
          ] })
        ] }, g.gruppe)) }),
        /* @__PURE__ */ jsxs("div", { className: "gg-serif", style: { fontSize: 11.5, color: T.dim, fontStyle: "italic", marginTop: 9, lineHeight: 1.6 }, children: [
          "Das Schild auf der Kachel nennt die l\xE4ngste Kante des Originals:",
          " ",
          /* @__PURE__ */ jsx("b", { style: { color: ZUSTAND.sicher.farbe, fontStyle: "normal" }, children: "HQ 1536" }),
          " heisst, es liegt ein verlustfreies PNG dieser Gr\xF6sse im Archiv;",
          " ",
          /* @__PURE__ */ jsx("b", { style: { color: ZUSTAND.moeglich.farbe, fontStyle: "normal" }, children: "HQ?" }),
          " heisst, das Verfahren hat geraten (die Grossansicht zeigt beide nebeneinander);",
          " ",
          /* @__PURE__ */ jsx("b", { style: { color: ZUSTAND.ohne.farbe, fontStyle: "normal" }, children: "kein HQ" }),
          " heisst: l\xF6schst du die Spielfassung, ist das Bild fort.",
          " ",
          "Gemessen mit tools/ordne-originale.py, ",
          zu.vonHand,
          " Zuordnungen von Hand gesetzt.",
          bestand && bestand.offen ? " Offen: " + bestand.offen.map((o) => `${o.was} (${o.anzahl})`).join(" \xB7 ") : ""
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }, children: gruppen.map((g) => {
        const n = ALLE.filter((e) => e.gruppe === g).length;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setGruppe(g);
              setSuche("");
              setWahl([]);
            },
            style: knopf(g === zeigeGruppe),
            children: [
              g,
              " ",
              /* @__PURE__ */ jsx("span", { style: { opacity: 0.65 }, children: n })
            ]
          },
          g
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }, children: [
        [["alle", "alle"], ["ohne", "nur ohne HQ"], ["moeglich", "nur unsichere"], ["sicher", "nur mit HQ"]].map(([k, wort]) => /* @__PURE__ */ jsx("button", { onClick: () => setFilter(k), style: { ...knopf(filter === k), fontSize: 11.5 }, children: wort }, k)),
        /* @__PURE__ */ jsx("span", { style: { flex: "1 1 auto" } }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setWahlModus((v) => !v);
              setWahl([]);
            },
            style: { ...knopf(wahlModus), fontSize: 11.5 },
            children: wahlModus ? "Ausw\xE4hlen: an" : "Ausw\xE4hlen"
          }
        ),
        [3, 4, 6].map((n) => /* @__PURE__ */ jsxs("button", { onClick: () => setSpalten(n), style: { ...knopf(spalten === n), fontSize: 11.5, padding: "6px 9px" }, children: [
          n,
          "er"
        ] }, n))
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          value: suche,
          onChange: (e) => setSuche(e.target.value),
          placeholder: "suchen \u2026",
          style: {
            width: "100%",
            maxWidth: 320,
            fontFamily: "inherit",
            fontSize: 13.5,
            color: "#e8e2cf",
            background: "rgba(8,6,16,.6)",
            border: "1px solid rgba(167,139,250,.3)",
            borderRadius: 10,
            padding: "9px 12px",
            marginBottom: 12
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { style: {
        display: "grid",
        gap: 8,
        gridTemplateColumns: `repeat(${spalten}, minmax(0,1fr))`
      }, children: sichtbar.map((e) => {
        const z = e.stand ? ZUSTAND[e.stand] : null;
        const w = gewaehlt(e.rel);
        const m = merk[e.rel];
        return /* @__PURE__ */ jsxs("div", { style: {
          position: "relative",
          background: "linear-gradient(165deg,rgba(30,22,52,.55),rgba(14,10,24,.6))",
          border: `1px solid ${w ? T.gold : m === "loeschen" ? "#c2606a" : m === "archivieren" ? "#6f8fbf" : "rgba(167,139,250,.26)"}`,
          boxShadow: w ? `0 0 0 2px ${T.gold}55` : "none",
          borderRadius: 11,
          padding: 6
        }, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => wahlModus ? kippe(e.rel) : setGross(e),
              title: z ? z.wort : "",
              style: {
                display: "block",
                width: "100%",
                aspectRatio: "1 / 1",
                cursor: wahlModus ? "pointer" : "zoom-in",
                padding: 0,
                background: "repeating-conic-gradient(rgba(255,255,255,.045) 0% 25%, transparent 0% 50%) 0 0/14px 14px",
                border: "none",
                borderRadius: 7
              },
              children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: e.vorschau,
                  alt: "",
                  loading: "lazy",
                  decoding: "async",
                  onError: (ev) => {
                    if (ev.target.src !== e.quelle) ev.target.src = e.quelle;
                  },
                  style: { width: "100%", height: "100%", objectFit: "contain" }
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => kippe(e.rel),
              "aria-label": "ausw\xE4hlen",
              style: {
                position: "absolute",
                top: 4,
                left: 4,
                width: 20,
                height: 20,
                lineHeight: "18px",
                textAlign: "center",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 12,
                fontWeight: 900,
                color: w ? "#241a08" : "#cfc6e6",
                background: w ? T.gold : "rgba(8,6,16,.72)",
                border: `1px solid ${w ? T.gold : "rgba(167,139,250,.45)"}`,
                borderRadius: 5,
                padding: 0
              },
              children: w ? "\u2713" : ""
            }
          ),
          z && /* @__PURE__ */ jsx("span", { title: z.wort, style: {
            position: "absolute",
            top: 3,
            right: 4,
            fontSize: 8.5,
            fontWeight: 900,
            letterSpacing: ".04em",
            lineHeight: 1,
            padding: "3px 4px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            color: z.farbe,
            background: "rgba(6,4,12,.82)",
            border: `1px solid ${z.farbe}88`
          }, children: e.stand === "ohne" ? "kein HQ" : e.stand === "moeglich" ? `${stufe(e.kante)}?` : `${stufe(e.kante)} ${e.kante}` }),
          m && /* @__PURE__ */ jsx("span", { style: {
            position: "absolute",
            bottom: 4,
            right: 5,
            fontSize: 9.5,
            fontWeight: 800,
            letterSpacing: ".06em",
            color: m === "loeschen" ? "#e0a0a8" : "#a7bde0"
          }, children: m === "loeschen" ? "L\xD6SCH" : "ARCHIV" }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: 9.5,
            fontWeight: 700,
            marginTop: 5,
            lineHeight: 1.25,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            wordBreak: "break-word"
          }, children: e.titel })
        ] }, e.rel);
      }) }),
      !sichtbar.length && /* @__PURE__ */ jsx("div", { className: "gg-serif", style: { color: T.dim, fontStyle: "italic", padding: "20px 2px" }, children: "Nichts gefunden." }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 7, flexWrap: "wrap", marginTop: 12 }, children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => setWahl(sichtbar.map((e) => e.rel)), style: { ...knopf(false), fontSize: 11.5 }, children: [
          "alle ",
          sichtbar.length,
          " sichtbaren w\xE4hlen"
        ] }),
        Object.values(merk).filter(Boolean).length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("button", { onClick: merkListe, style: { ...knopf(true), fontSize: 11.5 }, children: [
            "Merkliste laden (",
            Object.values(merk).filter(Boolean).length,
            ")"
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setMerk({}), style: { ...knopf(false), fontSize: 11.5 }, children: "Merkliste zur\xFCcksetzen" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("a", { href: "/", style: { display: "inline-block", marginTop: 24, fontSize: 12.5, color: T.dim }, children: "\u2039 Zur\xFCck ins Spiel" })
    ] }),
    wahl.length > 0 && /* @__PURE__ */ jsxs("div", { style: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap",
      background: "rgba(12,9,22,.96)",
      borderTop: `1px solid ${T.gold}66`,
      padding: "10px 14px"
    }, children: [
      /* @__PURE__ */ jsxs("span", { style: { fontSize: 12.5, fontWeight: 700, flex: "1 1 auto" }, children: [
        wahl.length,
        " gew\xE4hlt",
        /* @__PURE__ */ jsxs("span", { style: { color: T.dim, fontWeight: 400 }, children: [
          " \xB7 ",
          wahl.filter((r) => {
            const e = ALLE.find((x) => x.rel === r);
            return e && e.stand === "ohne";
          }).length,
          " davon ohne HQ"
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => markiereWahl("archivieren"),
          style: {
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 700,
            color: "#a7bde0",
            background: "transparent",
            border: "1px solid #6f8fbf",
            borderRadius: 8,
            padding: "7px 12px"
          },
          children: "Archiv"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => markiereWahl("loeschen"),
          style: {
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 700,
            color: "#e0a0a8",
            background: "transparent",
            border: "1px solid #c2606a",
            borderRadius: 8,
            padding: "7px 12px"
          },
          children: "L\xF6schen"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setWahl([]),
          style: {
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12,
            color: T.dim,
            background: "none",
            border: `1px solid ${T.line}`,
            borderRadius: 8,
            padding: "7px 12px"
          },
          children: "aufheben"
        }
      )
    ] }),
    gross && /* @__PURE__ */ jsx("div", { onClick: () => setGross(null), style: {
      position: "fixed",
      inset: 0,
      zIndex: 60,
      cursor: "zoom-out",
      background: "rgba(4,6,10,.92)",
      display: "grid",
      placeItems: "center",
      padding: 18,
      overflowY: "auto"
    }, children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), style: { maxWidth: "min(94vw, 860px)", textAlign: "center" }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "grid",
        gap: 10,
        gridTemplateColumns: gross.original ? "repeat(auto-fit, minmax(220px, 1fr))" : "1fr"
      }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("img", { src: gross.quelle, alt: "", style: {
            maxWidth: "100%",
            maxHeight: "58dvh",
            objectFit: "contain",
            background: "repeating-conic-gradient(rgba(255,255,255,.05) 0% 25%, transparent 0% 50%) 0 0/18px 18px",
            borderRadius: 10
          } }),
          /* @__PURE__ */ jsxs("div", { className: "gg-serif", style: { fontSize: 11.5, color: T.dim, fontStyle: "italic", marginTop: 4 }, children: [
            "Spielfassung",
            gross.massSpiel ? " \xB7 " + gross.massSpiel.join(" \xD7 ") + " px" : ""
          ] })
        ] }),
        gross.original && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: gross.originalVorschau,
              alt: "",
              onError: (ev) => {
                if (ev.target.src !== gross.original) ev.target.src = gross.original;
              },
              style: {
                maxWidth: "100%",
                maxHeight: "58dvh",
                objectFit: "contain",
                background: "repeating-conic-gradient(rgba(255,255,255,.05) 0% 25%, transparent 0% 50%) 0 0/18px 18px",
                borderRadius: 10
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "gg-serif", style: {
            fontSize: 11.5,
            fontStyle: "italic",
            marginTop: 4,
            color: ZUSTAND[gross.stand].farbe
          }, children: [
            "Original \xB7 ",
            gross.mass ? gross.mass.join(" \xD7 ") + " px" : "",
            gross.vonHand ? " \xB7 von Hand zugeordnet" : gross.stand === "moeglich" ? ` \xB7 geraten (${gross.wert})` : ` \xB7 ${gross.wert}`
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { fontSize: 13.5, fontWeight: 800, marginTop: 10 }, children: gross.titel }),
      /* @__PURE__ */ jsxs("div", { className: "gg-serif", style: { fontSize: 11.5, color: T.dim, fontStyle: "italic" }, children: [
        gross.gruppe,
        " \xB7 ",
        gross.rel,
        gross.original ? " \u2190 " + gross.original.replace("/bildarchiv/", "") : ""
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 12 }, children: [
        /* @__PURE__ */ jsx("button", { onClick: () => laden(gross.quelle, gross.datei), style: { ...knopf(false), fontSize: 12.5 }, children: "Spielfassung laden" }),
        gross.original && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => laden(gross.original, gross.original.split("/").pop()),
            style: { ...knopf(true), fontSize: 12.5 },
            children: "Original laden"
          }
        ),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          kippe(gross.rel);
          setGross(null);
        }, style: { ...knopf(false), fontSize: 12.5 }, children: gewaehlt(gross.rel) ? "abw\xE4hlen" : "ausw\xE4hlen" })
      ] })
    ] }) })
  ] });
}
var VERZEICHNIS, BESTAND, ZUORDNUNG, GRUPPEN, ZUSTAND;
var init_SchaukammerScreen = __esm({
  "src/app/ui/SchaukammerScreen.jsx"() {
    init_theme();
    VERZEICHNIS = "/schaukammer.json";
    BESTAND = "/bildarchiv/bestand.json";
    ZUORDNUNG = "/bildarchiv/zuordnung.json";
    GRUPPEN = [
      ["Geschnitzte Figuren", "carved"],
      ["Gemalte Figuren", "painted"],
      ["Turnierfiguren", "klassik"],
      ["Ausr\xFCstung", "items"],
      ["Bodentexturen", "felder"],
      ["Auszeichnungen", "ach"],
      ["Kapitelb\xF6den", "kap"],
      ["Risse", "riss"],
      ["Anzeigen", "stat"],
      ["Men\xFCkarten", "karten"],
      ["Kulisse und Wappen", ""]
      // die Wurzel: alles ohne Unterordner
    ];
    ZUSTAND = {
      sicher: { farbe: "#58c98b", grund: "rgba(88,201,139,.16)", wort: "hochaufl\xF6sendes Original vorhanden" },
      moeglich: { farbe: "#d3ae5c", grund: "rgba(211,174,92,.16)", wort: "Kandidat \u2014 das Verfahren r\xE4t, bitte pr\xFCfen" },
      ohne: { farbe: "#c2606a", grund: "rgba(194,96,106,.16)", wort: "kein Original \u2014 mit der Spielfassung ist das Bild fort" }
    };
  }
});

// render_schau.mjs
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
var dom = new JSDOM(
  "<!doctype html><html><body><div id='w'></div></body></html>",
  { url: "https://grandgambit.win/", pretendToBeVisual: true }
);
Object.defineProperty(global, "navigator", { value: dom.window.navigator, configurable: true });
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.requestAnimationFrame = (f) => setTimeout(f, 0);
global.cancelAnimationFrame = clearTimeout;
var daten = {
  "/schaukammer.json": JSON.parse(readFileSync("dist/schaukammer.json", "utf8")),
  "/bildarchiv/zuordnung.json": JSON.parse(readFileSync("archiv/bilder/zuordnung.json", "utf8")),
  "/bildarchiv/bestand.json": JSON.parse(readFileSync("archiv/bilder/bestand.json", "utf8"))
};
global.fetch = async (u) => ({ json: async () => {
  if (!(u in daten)) throw new Error("404 " + u);
  return daten[u];
} });
var React = await import("react");
var { createRoot } = await import("react-dom/client");
var { SchaukammerScreen: SchaukammerScreen2 } = await Promise.resolve().then(() => (init_SchaukammerScreen(), SchaukammerScreen_exports));
global.IS_REACT_ACT_ENVIRONMENT = false;
var root = createRoot(document.getElementById("w"));
root.render(React.createElement(SchaukammerScreen2));
await new Promise((r) => setTimeout(r, 800));
var html = document.getElementById("w").innerHTML;
console.log("LAENGE", html.length);
console.log("KACHELN", (html.match(/loading="lazy"/g) || []).length);
console.log(
  "SCHILDER HQ",
  (html.match(/>HQ /g) || []).length,
  "| HQ?",
  (html.match(/>HQ\?</g) || []).length,
  "| kein HQ",
  (html.match(/kein HQ</g) || []).length
);
console.log("TEXT", document.getElementById("w").textContent.replace(/\s+/g, " ").slice(0, 420));
process.stdout.write("---HTML---\n" + html);
