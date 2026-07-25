#!/usr/bin/env python3
"""Die Werkbank: rechnet aus EINEM geschnitzten Satz beide Mannschaften.

Generiert wird nur ein Figurenteam: dunkler Stein, eingelegtes Antikgold, dazu
Hautton an Gesicht und Haenden und kleine Rubine als Rangsteine. Hier entstehen
daraus die zwei Seiten, die im Spiel gegeneinander stehen:

  *-light.webp   heller Alabaster, Gold bleibt Gold     -> der Spieler
  *-silver.webp  derselbe dunkle Stein, Gold wird Silber -> der Gegner

Beides ist gerechneter Stein, kein CSS-Filter: ein Filter toent immer das ganze
Bild und zoege Einlage, Haut und Rubine gleich mit um.

DIE VIER MATERIALIEN WERDEN UEBER DEN FARBTON GETRENNT. Das ist der heikle
Punkt: Haut (rotbraun, ~25 Grad) und Gold (gelb, ~45 Grad) liegen dicht
beieinander. Die Grenze zwischen beiden laeuft deshalb bei 34 Grad, und zusaetzlich
muss Gold heller sitzen als die Haut - sonst wandert ein Gesicht mit ins Silber.

    python3 tools/carve-teams.py
"""
import glob, os
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = "src/app/ui/assets/carved"
ABGELEITET = ("-light.webp", "-silver.webp", "-maske.png")

# Creme-Rampe fuer den hellen Stein: Schatten warm gebrochen, Lichter fast weiss.
SCHATTEN = np.array([0.35, 0.31, 0.26])
LICHT    = np.array([0.97, 0.94, 0.87])

# Silber-Rampe fuer die Einlage der Gegenseite: kuehl, hell, mit Biss in den
# Lichtern, damit es glaenzt statt nur grau zu sein.
S_TIEF = np.array([0.30, 0.32, 0.37])
S_HOCH = np.array([0.96, 0.97, 1.00])

# Farbtongrenzen, in Umdrehungen (0..1) statt Grad.
HAUT_VON, HAUT_BIS = 0.015, 0.094      #   5 - 34 Grad, rotbraun
GOLD_VON, GOLD_BIS = 0.094, 0.175      #  34 - 63 Grad, gelb


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


def _schliessen(maske, radius=5):
    """Eine reine Pixelmaske ist loechrig: die tiefsten Schatten und die
    hellsten Glanzlichter eines Gesichts fallen aus dem Farbtonfenster heraus.
    Blieben diese Loecher stehen, wuerde die Creme-Rampe mitten durchs Gesicht
    sprenkeln. Also erst schliessen, dann Loecher fuellen - danach ist eine
    Wange eine Flaeche und kein Punktraster."""
    if not maske.any():
        return maske
    y, x = np.ogrid[-radius:radius + 1, -radius:radius + 1]
    kern = x * x + y * y <= radius * radius
    zu = ndimage.binary_closing(maske, structure=kern)
    return ndimage.binary_fill_holes(zu)


def masken(h, s, v):
    """Gold, Haut und Rubin voneinander und vom Stein trennen."""
    gold = (h >= GOLD_VON) & (h < GOLD_BIS) & (s > 0.20) & (v > 0.34)
    haut = (h >= HAUT_VON) & (h < HAUT_BIS) & (s > 0.20) & (s < 0.75) & (v > 0.26)
    # Rubin liegt am Farbkreis ganz aussen herum - sowohl knapp ueber 0 als auch
    # knapp unter 1 ist Rot. Er muss deutlich gesaettigter sein als jede Haut.
    rubin = ((h < HAUT_VON) | (h > 0.92)) & (s > 0.35)

    haut = _schliessen(haut, 6)
    gold = _schliessen(gold, 4) & ~haut     # Haut gewinnt an der Grenze
    rubin = _schliessen(rubin, 3)
    return gold, haut, rubin


def hell(pfad, ziel):
    """Alabaster-Team: nur der Stein wird gehoben, alles andere bleibt."""
    im = Image.open(pfad).convert("RGBA")
    rgb, h, s, v = zerlegen(im)
    gold, haut, rubin = masken(h, s, v)
    behalten = gold | haut | rubin
    # Der Navy-Stein sitzt eng zwischen ~0.05 und ~0.40 - genau dieses Band wird
    # gedehnt, sonst bliebe die Figur ein grauer Fleck ohne Werkzeugspur.
    t = np.clip((v - 0.045) / 0.36, 0, 1) ** 0.82
    stein = SCHATTEN + (LICHT - SCHATTEN) * t[..., None]
    _sichern(np.where(behalten[..., None], rgb, stein), im, ziel)


def silber(pfad, ziel):
    """Gegner-Team: Stein bleibt dunkel, die Einlage wird poliertes Silber,
    die Haut eine Spur kuehler und blasser - dieselbe Art, andere Seite."""
    im = Image.open(pfad).convert("RGBA")
    rgb, h, s, v = zerlegen(im)
    gold, haut, rubin = masken(h, s, v)

    t = np.clip((v - 0.10) / 0.72, 0, 1) ** 0.78
    einlage = S_TIEF + (S_HOCH - S_TIEF) * t[..., None]

    # Haut kuehlen: Saettigung zurueck, Blauanteil leicht anheben.
    grau = rgb.mean(-1, keepdims=True)
    kuehl = np.clip(grau + (rgb - grau) * 0.55 + np.array([-0.02, 0.0, 0.045]), 0, 1)

    out = np.where(gold[..., None], einlage, rgb)
    out = np.where(haut[..., None], kuehl, out)
    _sichern(out, im, ziel)


def maskenbild(pfad, ziel):
    """Kontrollbild: Gold gelb, Haut magenta, Rubin gruen, Stein schwarz.
    Nur zum Nachsehen, ob die Trennung wirklich sitzt - wird nicht ausgeliefert."""
    im = Image.open(pfad).convert("RGBA")
    _, h, s, v = zerlegen(im)
    gold, haut, rubin = masken(h, s, v)
    out = np.zeros(h.shape + (3,), dtype=np.float32)
    out[gold] = [1, 0.85, 0.1]
    out[haut] = [1, 0.2, 0.8]
    out[rubin] = [0.2, 1, 0.3]
    _sichern(out, im, ziel, fmt="PNG")


def _sichern(out, im, ziel, fmt="WEBP"):
    alpha = np.asarray(im)[..., 3]
    out = np.clip(out * 255, 0, 255).astype(np.uint8)
    bild = Image.fromarray(np.dstack([out, alpha]), "RGBA")
    if fmt == "WEBP":
        bild.save(ziel, "WEBP", quality=90, method=6)
    else:
        bild.save(ziel)


if __name__ == "__main__":
    import sys
    kontrolle = "--masken" in sys.argv
    n = 0
    for f in sorted(glob.glob(os.path.join(SRC, "carved-*.webp"))):
        if f.endswith(ABGELEITET):
            continue
        hell(f, f.replace(".webp", "-light.webp"))
        silber(f, f.replace(".webp", "-silver.webp"))
        if kontrolle:
            maskenbild(f, f.replace(".webp", "-maske.png"))
        n += 1
        print("abgeleitet:", os.path.basename(f))
    print(f"carve-teams: {n} Figuren, je hell und silber")
