// Measure the vertical content of painted pieces: where does the visible
// figure actually sit inside its square image? Then composite a real square
// with the piece at several translateY lifts to pick one by eye.
import sharp from "sharp";

const A = "src/app/ui/assets/painted/";
const names = ["pawn", "knight", "bishop", "rook", "queen", "king", "gambit"];

let centers = [];
for (const n of names) {
  const img = sharp(A + `painted-${n}.webp`).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  let top = h, bot = 0, massY = 0, mass = 0;
  for (let y = 0; y < h; y++) {
    let rowMass = 0;
    for (let x = 0; x < w; x++) { const a = data[(y * w + x) * 4 + 3]; if (a > 200) rowMass += a; }
    if (rowMass > 0) { if (y < top) top = y; if (y > bot) bot = y; massY += rowMass * y; mass += rowMass; }
  }
  const centroid = mass ? massY / mass / h : 0.5;
  const center = (top + bot) / 2 / h;         // 0.5 = perfectly centered
  console.log(`${n.padEnd(8)} solid ${Math.round(top / h * 100)}%..${Math.round(bot / h * 100)}%  boxCenter ${(center * 100).toFixed(1)}%  centroid ${(centroid * 100).toFixed(1)}%`);
  centers.push(centroid); continue;
  centers.push(center);
  console.log(`${n.padEnd(8)} content ${Math.round(top / h * 100)}%..${Math.round(bot / h * 100)}%  center ${(center * 100).toFixed(1)}%`);
}
const avg = centers.reduce((a, b) => a + b) / centers.length;
console.log(`\nAVG center ${(avg * 100).toFixed(1)}% -> visual offset below middle: ${((avg - 0.5) * 100).toFixed(1)}% of glyph`);
console.log(`glyph = 90% of square -> lift to center: ${((avg - 0.5) * 90).toFixed(1)}% of square height`);

// visual: one light square, king at lifts -8 / -11 / -14 %
const S = 200, lift = (hex, l) => { const n = parseInt(hex.slice(1), 16); const c = (v) => Math.round(v + (255 - v) * l);
  return { r: c((n >> 16) & 255), g: c((n >> 8) & 255), b: c(n & 255) }; };
async function squareWith(liftPct) {
  const flat = await sharp({ create: { width: S, height: S, channels: 4, background: { ...lift("#8a8371", 0.12), alpha: 1 } } }).png().toBuffer();
  const slab = await sharp("src/app/ui/assets/marble-l0.webp").resize(S, S).png().toBuffer();
  const veil = await sharp({ create: { width: S, height: S, channels: 4, background: { ...lift("#8a8371", 0.12), alpha: 0.78 } } }).png().toBuffer();
  const glyph = Math.round(S * 0.9);
  const piece = await sharp(A + "painted-king.webp").resize(glyph, glyph, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const off = Math.round((S - glyph) / 2);
  return sharp(flat).composite([{ input: slab }, { input: veil },
    { input: piece, left: off, top: off + Math.round(S * liftPct / 100) }]).png().toBuffer();
}
const tiles = [];
const lifts = [-8, -11, -14];
for (let i = 0; i < lifts.length; i++) tiles.push({ input: await squareWith(lifts[i]), left: i * S, top: 0 });
await sharp({ create: { width: lifts.length * S, height: S, channels: 4, background: { r: 5, g: 7, b: 12, alpha: 1 } } })
  .composite(tiles).png().toFile("/home/claude/piece-lift.png");
console.log("mock: links -8%, mitte -11%, rechts -14% -> /home/claude/piece-lift.png");
