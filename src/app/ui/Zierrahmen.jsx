// ── DER RAHMEN DES HAUSES ────────────────────────────────────────────────────
// Von Hand gezeichnet statt gemalt: als SVG bleibt er in jeder Größe scharf,
// wiegt ein paar hundert Byte statt hunderter Kilobyte, und seine Farben
// folgen dem Riss-Design — Gold als Metall der Krone, ein feiner violetter
// Schimmer als Atem des Risses.
//
// Aufbau nach dem Vorbild der alten Vorlage, aber neu gesetzt:
//   · eine ÄUSSERE kräftige Goldleiste und eine INNERE Haarlinie
//   · dazwischen ein schmaler dunkler Kanal, der beiden Tiefe gibt
//   · an jeder ECKE ein Knoten mit ausschwingenden Ranken
//   · in der MITTE jeder Seite eine Lilie, gespiegelt wie ein Wappenzeichen
//
// Der Rahmen zeichnet sich über ein viewBox-Gitter von 100x100 und wird per
// `preserveAspectRatio="none"` auf jedes Seitenverhältnis gezogen — die
// Ornamente selbst sitzen in eigenen, NICHT verzerrten Gruppen, damit die
// Lilien rund bleiben, auch wenn der Rahmen breit läuft.

const GOLD_HELL = "#f2ddab";
const GOLD = "#c89a4e";
const GOLD_TIEF = "#7d5417";
const RISS = "#a78bfa";

/** Ein Eckknoten: Raute mit zwei ausschwingenden Ranken. Wird viermal
 *  gesetzt und je Ecke gedreht. */
function Eckknoten({ id }) {
  return (
    <g>
      <path d="M0 0 L7.5 0 L0 7.5 Z" fill={`url(#${id}-fl)`} opacity=".92" />
      <path d="M1.6 1.6 L5.4 1.6 L1.6 5.4 Z" fill="none" stroke={GOLD_HELL} strokeWidth=".38" opacity=".85" />
      <path d="M9.4 1.15 q4.2 .3 5.6 2.1 q-2.4 -.35 -3.5 .75 q1.5 .5 1.5 1.5 q-1.9 -.6 -3.6 .35"
        fill="none" stroke={`url(#${id}-fl)`} strokeWidth="1.05" strokeLinecap="round" />
      <path d="M1.15 9.4 q.3 4.2 2.1 5.6 q-.35 -2.4 .75 -3.5 q.5 1.5 1.5 1.5 q-.6 -1.9 .35 -3.6"
        fill="none" stroke={`url(#${id}-fl)`} strokeWidth="1.05" strokeLinecap="round" />
      <circle cx="3.4" cy="3.4" r=".95" fill={GOLD_HELL} />
    </g>
  );
}

/** Die Lilie in der Seitenmitte — ein Wappenzeichen, nach beiden Seiten
 *  gespiegelt, mit einem kleinen Riss-Funken im Herzen. */
function Seitenlilie({ id }) {
  return (
    <g>
      <path d="M0 -3.4 q1.5 1.5 1.5 3.4 q0 1.9 -1.5 3.4 q-1.5 -1.5 -1.5 -3.4 q0 -1.9 1.5 -3.4 Z"
        fill={`url(#${id}-fl)`} />
      <path d="M-1.9 0 q-3.6 -.5 -5.4 -2.3 q2.6 .5 3.8 -.7 q-1.4 1.6 -.5 3 Z" fill={`url(#${id}-fl)`} />
      <path d="M1.9 0 q3.6 -.5 5.4 -2.3 q-2.6 .5 -3.8 -.7 q1.4 1.6 .5 3 Z" fill={`url(#${id}-fl)`} />
      <path d="M-1.9 0 q-3.6 .5 -5.4 2.3 q2.6 -.5 3.8 .7 q-1.4 -1.6 -.5 -3 Z" fill={`url(#${id}-fl)`} />
      <path d="M1.9 0 q3.6 .5 5.4 2.3 q-2.6 -.5 -3.8 .7 q1.4 -1.6 .5 -3 Z" fill={`url(#${id}-fl)`} />
      <circle cx="0" cy="0" r=".85" fill={RISS} opacity=".9" />
      <circle cx="0" cy="0" r="1.9" fill="none" stroke={RISS} strokeWidth=".3" opacity=".45" />
    </g>
  );
}

/**
 * @param {number} r  Randabstand in Prozent der kürzeren Seite (Standard 2.2)
 * @param {boolean} funke  ob der violette Schimmer mitläuft
 */
export function Zierrahmen({ id = "zr", r = 2.2, funke = true, style }) {
  const a = r;              // äußere Leiste
  const b = r + 2.6;        // innere Haarlinie
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`${id}-fl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GOLD_HELL} />
          <stop offset="46%" stopColor={GOLD} />
          <stop offset="100%" stopColor={GOLD_TIEF} />
        </linearGradient>
        <linearGradient id={`${id}-leiste`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={GOLD_HELL} />
          <stop offset="30%" stopColor={GOLD} />
          <stop offset="62%" stopColor={GOLD_HELL} />
          <stop offset="100%" stopColor={GOLD_TIEF} />
        </linearGradient>
      </defs>

      {/* der dunkle Kanal zwischen den Leisten gibt beiden Tiefe */}
      <rect x={a + 0.7} y={a + 0.7} width={100 - 2 * (a + 0.7)} height={100 - 2 * (a + 0.7)}
        fill="none" stroke="rgba(20,12,4,.55)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      {/* äußere Leiste, kräftig */}
      <rect x={a} y={a} width={100 - 2 * a} height={100 - 2 * a}
        fill="none" stroke={`url(#${id}-leiste)`} strokeWidth="2.6" vectorEffect="non-scaling-stroke" />
      {/* innere Haarlinie */}
      <rect x={b} y={b} width={100 - 2 * b} height={100 - 2 * b}
        fill="none" stroke={`url(#${id}-leiste)`} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {/* der Atem des Risses: ein feiner violetter Schimmer innen */}
      {funke && <rect x={b + 0.5} y={b + 0.5} width={100 - 2 * (b + 0.5)} height={100 - 2 * (b + 0.5)}
        fill="none" stroke={RISS} strokeWidth=".7" opacity=".3" vectorEffect="non-scaling-stroke" />}
    </svg>
  );
}

/**
 * Der volle Rahmen MIT Ornamenten. Weil Ecken und Lilien rund bleiben müssen,
 * liegen sie in einer zweiten, nicht verzerrten Ebene über den Leisten und
 * werden in Pixeln statt Prozent gesetzt.
 */
export function ZierrahmenVoll({ id = "zrv", breite = 320, hoehe = 320, rand = 9, funke = true, style }) {
  const W = breite, H = hoehe;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", ...style }}>
      <defs>
        <linearGradient id={`${id}-fl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GOLD_HELL} />
          <stop offset="46%" stopColor={GOLD} />
          <stop offset="100%" stopColor={GOLD_TIEF} />
        </linearGradient>
        <linearGradient id={`${id}-q`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GOLD_HELL} />
          <stop offset="34%" stopColor={GOLD} />
          <stop offset="66%" stopColor={GOLD_HELL} />
          <stop offset="100%" stopColor={GOLD_TIEF} />
        </linearGradient>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={GOLD_HELL} />
          <stop offset="34%" stopColor={GOLD} />
          <stop offset="66%" stopColor={GOLD_HELL} />
          <stop offset="100%" stopColor={GOLD_TIEF} />
        </linearGradient>
      </defs>

      {/* ── die Leisten: waagerecht und senkrecht getrennt, damit der
             Goldverlauf jeweils quer zur Leiste läuft (so glänzt Metall) ── */}
      <g>
        <rect x={rand} y={rand - 1.3} width={W - 2 * rand} height="2.6" fill={`url(#${id}-q)`} />
        <rect x={rand} y={H - rand - 1.3} width={W - 2 * rand} height="2.6" fill={`url(#${id}-q)`} />
        <rect x={rand - 1.3} y={rand} width="2.6" height={H - 2 * rand} fill={`url(#${id}-s)`} />
        <rect x={W - rand - 1.3} y={rand} width="2.6" height={H - 2 * rand} fill={`url(#${id}-s)`} />
      </g>
      {/* innere Haarlinie */}
      <rect x={rand + 5} y={rand + 5} width={W - 2 * (rand + 5)} height={H - 2 * (rand + 5)}
        fill="none" stroke={`url(#${id}-q)`} strokeWidth="1" />
      {funke && <rect x={rand + 6.6} y={rand + 6.6} width={W - 2 * (rand + 6.6)} height={H - 2 * (rand + 6.6)}
        fill="none" stroke={RISS} strokeWidth=".7" opacity=".28" />}

      {/* ── die vier Eckknoten ── */}
      <g transform={`translate(${rand - 1.3} ${rand - 1.3})`}><Eckknoten id={id} /></g>
      <g transform={`translate(${W - rand + 1.3} ${rand - 1.3}) scale(-1 1)`}><Eckknoten id={id} /></g>
      <g transform={`translate(${rand - 1.3} ${H - rand + 1.3}) scale(1 -1)`}><Eckknoten id={id} /></g>
      <g transform={`translate(${W - rand + 1.3} ${H - rand + 1.3}) scale(-1 -1)`}><Eckknoten id={id} /></g>

      {/* ── die vier Seitenlilien ── */}
      <g transform={`translate(${W / 2} ${rand})`}><Seitenlilie id={id} /></g>
      <g transform={`translate(${W / 2} ${H - rand}) scale(1 -1)`}><Seitenlilie id={id} /></g>
      <g transform={`translate(${rand} ${H / 2}) rotate(90)`}><Seitenlilie id={id} /></g>
      <g transform={`translate(${W - rand} ${H / 2}) rotate(-90)`}><Seitenlilie id={id} /></g>
    </svg>
  );
}
