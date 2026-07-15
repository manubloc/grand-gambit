// Composite one light + one dark square exactly like BoardView does,
// old palette vs new palette side by side — a honest look without a browser.
import sharp from "sharp";

const S = 160;
const lift = (hex, l) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.round(v + (255 - v) * l);
  return { r: c((n >> 16) & 255), g: c((n >> 8) & 255), b: c(n & 255) };
};

async function square(slabPath, hex, veilA, veilLift) {
  const flat = await sharp({ create: { width: S, height: S, channels: 4, background: { ...lift(hex, 0), alpha: 1 } } }).png().toBuffer();
  const slab = await sharp(slabPath).resize(S, S).png().toBuffer();
  const veil = await sharp({ create: { width: S, height: S, channels: 4, background: { ...lift(hex, veilLift), alpha: veilA } } }).png().toBuffer();
  // marble layer = slab under veil (veil sits on top inside the overlay)
  return sharp(flat).composite([{ input: slab }, { input: veil }]).png().toBuffer();
}

const A = "src/app/ui/assets/";
const OLD = { L: "#6f6a5f", D: "#26282d", lift: 0.05 };
const NEW = { L: "#8a8371", D: "#3a3e49", lift: 0.12 };

const tiles = [];
for (const [p, y] of [[OLD, 0], [NEW, S]]) {
  tiles.push({ input: await square(A + "marble-l0.webp", p.L, 0.78, p.lift), left: 0, top: y });
  tiles.push({ input: await square(A + "marble-d1.webp", p.D, 0.80, p.lift), left: S, top: y });
  tiles.push({ input: await square(A + "marble-l2.webp", p.L, 0.78, p.lift), left: 2 * S, top: y });
  tiles.push({ input: await square(A + "marble-d3.webp", p.D, 0.80, p.lift), left: 3 * S, top: y });
}
await sharp({ create: { width: 4 * S, height: 2 * S, channels: 4, background: { r: 5, g: 7, b: 12, alpha: 1 } } })
  .composite(tiles).png().toFile("/home/claude/board-mock.png");
console.log("oben ALT, unten NEU -> /home/claude/board-mock.png");
