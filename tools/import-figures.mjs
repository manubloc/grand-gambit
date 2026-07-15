// Convert the delivered PNGs into painted-*.webp:
//  - files WITH alpha: resize → webp
//  - flattened files (checkerboard/white bg): flood-fill from the border,
//    removing only near-white pixels CONNECTED to the edge — interior ivory
//    (the bard's feather!) survives. Then a 1px alpha feather against halos.
import sharp from "sharp";
import { readdirSync } from "fs";

const SRC = "/tmp/nf", OUT = "src/app/ui/assets/painted";
const MAP = {
  "pawn": "pawn", "knight": "knight", "bishop": "bishop", "Rook": "rook", "Queen": "queen", "King": "king",
  "Mage": "mage", "Guardian": "guardian", "Barde": "bard", "Paladin": "paladin", "Inquisitor": "inquisitor",
  "archbishop": "archbishop", "chancellor": "chancellor", "engineer": "engineer", "standard bearer": "standard",
  "hawk": "hawk", "assasin": "assassin", "pathfinder": "pathfinder", "dragon": "dragon", "sorceress": "sorceress",
  "alchemist": "alchemist", "warlock": "warlock", "amazon": "amazon", "st": "strategist", "captain": "captain",
  "hellsinger": "seeress",
  "gambit_stufe1": "gambit", "gambit_stufe2": "gambit-t2", "gambit_stufe3": "gambit-t3",
  "gambit_stufe4": "gambit-t4", "gambit_stufe5": "gambit-t5", "gambit_stufe6": "gambit-t6",
};

// loosened: the flattened exports carry a SOFT white haze around the figures
// (gradient down to ~216). Spread<20 still protects ivory (#f0e9d8, spread 24).
const nearWhite = (r, g, b) => r > 216 && g > 216 && b > 216 && Math.max(r, g, b) - Math.min(r, g, b) < 20;

async function keyOut(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const mask = new Uint8Array(w * h);          // 1 = background
  const q = [];
  const push = (x, y) => { const i = y * w + x; if (mask[i]) return;
    const p = i * 4; if (!nearWhite(data[p], data[p + 1], data[p + 2])) return; mask[i] = 1; q.push(i); };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (q.length) {
    const i = q.pop(), x = i % w, y = (i / w) | 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) push(nx, ny);
    }
  }
  // enclosed pockets: flat near-white islands (low variance, decent size) are
  // background too — the feather is textured and small enough to survive
  {
    const seen = new Uint8Array(w * h);
    for (let s0 = 0; s0 < w * h; s0++) {
      if (mask[s0] || seen[s0]) continue;
      const p0 = s0 * 4;
      if (!nearWhite(data[p0], data[p0 + 1], data[p0 + 2])) { seen[s0] = 1; continue; }
      const region = [s0]; seen[s0] = 1;
      let mn = 255, mx = 0;
      for (let qi = 0; qi < region.length; qi++) {
        const i = region[qi], x = i % w, y = (i / w) | 0, pp = i * 4;
        const lum = (data[pp] + data[pp + 1] + data[pp + 2]) / 3;
        if (lum < mn) mn = lum; if (lum > mx) mx = lum;
        for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
          const ni = ny * w + nx;
          if (seen[ni] || mask[ni]) continue;
          const np = ni * 4;
          if (nearWhite(data[np], data[np + 1], data[np + 2])) { seen[ni] = 1; region.push(ni); }
        }
      }
      if (region.length > 260 && mx - mn < 14) for (const i of region) mask[i] = 1;
    }
  }
  // clear background + soft matte: two feather rings, brightness-weighted so
  // the leftover haze fades instead of cutting off
  for (let i = 0; i < w * h; i++) if (mask[i]) data[i * 4 + 3] = 0;
  const ring1 = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x;
    if (!mask[i] && (mask[i - 1] || mask[i + 1] || mask[i - w] || mask[i + w])) ring1[i] = 1;
  }
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x;
    if (mask[i]) continue;
    const p2 = i * 4;
    const lum = (data[p2] + data[p2 + 1] + data[p2 + 2]) / 3;
    const whiteish = Math.max(0, Math.min(1, (lum - 205) / 50));
    if (ring1[i]) data[p2 + 3] = Math.min(data[p2 + 3], Math.round(170 - 110 * whiteish));
    else if (ring1[i - 1] || ring1[i + 1] || ring1[i - w] || ring1[i + w]) data[p2 + 3] = Math.min(data[p2 + 3], Math.round(230 - 90 * whiteish));
  }
  return sharp(Buffer.from(data.buffer), { raw: { width: w, height: h, channels: 4 } });
}

for (const f of readdirSync(SRC).filter((f) => f.endsWith(".png") && !f.startsWith("_"))) {
  const base = f.replace(/\.png$/, "");
  const id = MAP[base];
  if (!id) { console.log("??  unbekannt:", f); continue; }
  const meta = await sharp(SRC + "/" + f).metadata();
  const opaque = !meta.hasAlpha;
  let img = opaque ? await keyOut(SRC + "/" + f) : sharp(SRC + "/" + f).ensureAlpha();
  await img.resize(1024, 1024, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 88, alphaQuality: 90 }).toFile(`${OUT}/painted-${id}.webp`);
  console.log((opaque ? "keyed " : "alpha ") + f.padEnd(24) + "-> painted-" + id + ".webp");
}
console.log("fertig");
