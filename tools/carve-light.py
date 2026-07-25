#!/usr/bin/env python3
"""Die Werkbank: rechnet aus den geschnitzten Navy-Figuren das helle Team.

Der Katalog sagt es seit jeher — wir generieren nur EIN Figurenteam. Die helle
Seite entsteht hier: der Stein wird von dunklem Navy auf cremefarbenen Alabaster
gehoben, das eingelegte Gold bleibt unangetastet stehen. Die Werkzeugspur
ueberlebt, weil nicht flach eingefaerbt, sondern die Helligkeit jedes Pixels
durch eine Creme-Rampe geschickt wird.

    python3 tools/carve-light.py
"""
import colorsys, glob, os
import numpy as np
from PIL import Image

SRC = "src/app/ui/assets/carved"

# Creme-Rampe: Schatten warm und gebrochen, Lichter fast weiss.
SCHATTEN = np.array([0.35, 0.31, 0.26])
LICHT    = np.array([0.97, 0.94, 0.87])

def ist_gold(h, s, v):
    """Gold = warmer Farbton mit spuerbarer Saettigung. Der Navy-Stein liegt
    bei ~0.6 (blau) und ist damit sicher ausserhalb."""
    return (h > 0.055) & (h < 0.16) & (s > 0.22) & (v > 0.18)

def umrechnen(pfad, ziel):
    im = Image.open(pfad).convert("RGBA")
    rgb = np.asarray(im, dtype=np.float32)[..., :3] / 255.0
    alpha = np.asarray(im)[..., 3]

    mx, mn = rgb.max(-1), rgb.min(-1)
    v = mx
    s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    # Hue
    d = np.maximum(mx - mn, 1e-6)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    h = np.select(
        [mx == r, mx == g, mx == b],
        [((g - b) / d) % 6, (b - r) / d + 2, (r - g) / d + 4], default=0) / 6.0

    gold = ist_gold(h, s, v)

    # Stein: Helligkeit spreizen, dann durch die Creme-Rampe. Der Navy-Stein
    # sitzt eng zwischen ~0.05 und ~0.40 — genau dieses Band wird gedehnt,
    # sonst bliebe die Figur ein grauer Fleck ohne Werkzeugspur.
    t = np.clip((v - 0.045) / 0.36, 0, 1)
    t = t ** 0.82
    stein = SCHATTEN + (LICHT - SCHATTEN) * t[..., None]

    out = np.where(gold[..., None], rgb, stein)
    out = np.clip(out * 255, 0, 255).astype(np.uint8)

    res = np.dstack([out, alpha])
    Image.fromarray(res, "RGBA").save(ziel, "WEBP", quality=90, method=6)
    return ziel

if __name__ == "__main__":
    n = 0
    for f in sorted(glob.glob(os.path.join(SRC, "carved-*.webp"))):
        if f.endswith("-light.webp"):
            continue
        ziel = f.replace(".webp", "-light.webp")
        umrechnen(f, ziel)
        n += 1
        print("hell:", os.path.basename(ziel))
    print(f"carve-light: {n} Figuren")
