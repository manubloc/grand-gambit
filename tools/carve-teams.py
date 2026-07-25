#!/usr/bin/env python3
"""Die Werkbank: rechnet aus EINEM geschnitzten Satz beide Mannschaften.

Der Katalog sagt es seit jeher — generiert wird nur ein Figurenteam, aus
Navy-Stein mit eingelegtem Antikgold. Hier entstehen daraus die zwei Seiten,
die im Spiel gegeneinander stehen:

  *-light.webp   heller Alabaster, Gold bleibt Gold        -> der Spieler
  *-silver.webp  derselbe dunkle Stein, Gold wird Silber   -> der Gegner

Beides ist gerechneter Stein, kein CSS-Filter: ein Filter toent immer das ganze
Bild und zoege die Einlage gleich mit um. Die Werkzeugspur ueberlebt, weil die
Helligkeit gespreizt statt flach eingefaerbt wird.

    python3 tools/carve-teams.py
"""
import glob, os
import numpy as np
from PIL import Image

SRC = "src/app/ui/assets/carved"
ABGELEITET = ("-light.webp", "-silver.webp")

# Creme-Rampe fuer den hellen Stein: Schatten warm gebrochen, Lichter fast weiss.
SCHATTEN = np.array([0.35, 0.31, 0.26])
LICHT    = np.array([0.97, 0.94, 0.87])

# Silber-Rampe fuer die Einlage der Gegenseite: kuehl, hell, mit Biss in den
# Lichtern, damit es glaenzt statt nur grau zu sein.
S_TIEF  = np.array([0.30, 0.32, 0.37])
S_HOCH  = np.array([0.96, 0.97, 1.00])


def zerlegen(im):
    """RGB nach Farbton/Saettigung/Helligkeit, alles vektorisiert."""
    rgb = np.asarray(im, dtype=np.float32)[..., :3] / 255.0
    mx, mn = rgb.max(-1), rgb.min(-1)
    v = mx
    s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    d = np.maximum(mx - mn, 1e-6)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    h = np.select([mx == r, mx == g, mx == b],
                  [((g - b) / d) % 6, (b - r) / d + 2, (r - g) / d + 4], default=0) / 6.0
    return rgb, h, s, v


def gold_maske(h, s, v):
    """Gold = warmer Farbton mit spuerbarer Saettigung. Der Navy-Stein liegt
    bei ~0.6 (blau) und faellt damit sicher heraus."""
    return (h > 0.055) & (h < 0.16) & (s > 0.22) & (v > 0.18)


def hell(pfad, ziel):
    """Alabaster-Team: Stein aufhellen, Gold stehen lassen."""
    im = Image.open(pfad).convert("RGBA")
    rgb, h, s, v = zerlegen(im)
    gold = gold_maske(h, s, v)
    # Der Navy-Stein sitzt eng zwischen ~0.05 und ~0.40 — genau dieses Band
    # wird gedehnt, sonst bliebe die Figur ein grauer Fleck ohne Werkzeugspur.
    t = np.clip((v - 0.045) / 0.36, 0, 1) ** 0.82
    stein = SCHATTEN + (LICHT - SCHATTEN) * t[..., None]
    out = np.where(gold[..., None], rgb, stein)
    _sichern(out, im, ziel)


def silber(pfad, ziel):
    """Gegner-Team: Stein bleibt dunkel, die Einlage wird poliertes Silber."""
    im = Image.open(pfad).convert("RGBA")
    rgb, h, s, v = zerlegen(im)
    gold = gold_maske(h, s, v)
    # Das Gold ist hell und kontrastreich; dieselbe Helligkeit auf eine kuehle
    # Rampe gelegt ergibt Silber, das seine Woelbung behaelt. Leicht angehoben,
    # damit es auf dem dunklen Stein wirklich glaenzt.
    t = np.clip((v - 0.10) / 0.72, 0, 1) ** 0.78
    einlage = S_TIEF + (S_HOCH - S_TIEF) * t[..., None]
    out = np.where(gold[..., None], einlage, rgb)
    _sichern(out, im, ziel)


def _sichern(out, im, ziel):
    alpha = np.asarray(im)[..., 3]
    out = np.clip(out * 255, 0, 255).astype(np.uint8)
    Image.fromarray(np.dstack([out, alpha]), "RGBA").save(ziel, "WEBP", quality=90, method=6)


if __name__ == "__main__":
    n = 0
    for f in sorted(glob.glob(os.path.join(SRC, "carved-*.webp"))):
        if f.endswith(ABGELEITET):
            continue
        hell(f, f.replace(".webp", "-light.webp"))
        silber(f, f.replace(".webp", "-silver.webp"))
        n += 1
        print("abgeleitet:", os.path.basename(f))
    print(f"carve-teams: {n} Figuren, je hell und silber")
