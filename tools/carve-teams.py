#!/usr/bin/env python3
"""Die Werkbank: rechnet aus EINEM geschnitzten Satz beide Mannschaften.

Generiert wird nur ein Figurensatz - Koerper aus mittelgrauem Schieferstein, mit
gelbem Antikgold eingelegt, Hautton an Gesicht und Haenden, Smaragde als
Rangsteine. Daraus entstehen hier die zwei Seiten:

  *-light.webp   heller Elfenbeinstein, Gold bleibt Gold      -> die gute Seite
  *-dark.webp    kalter dunkler Basalt, Gold wird Silber,
                 die Haut fahl und ausgekuehlt                -> die Gegenseite

Das ist gerechneter Stein, kein CSS-Filter: ein Filter toent immer das ganze
Bild und zoege Einlage, Haut und Steine gleich mit um.

WARUM DER QUELLSATZ MITTELGRAU IST. Wer von einem fast schwarzen Original
ausgeht, hat nach oben kaum Tonwerte uebrig - die helle Mannschaft wird flach.
Aus der Mitte heraus laesst sich in beide Richtungen spreizen, hell wie dunkel.

WIE DIE VIER MATERIALIEN GETRENNT WERDEN. Ueber den Farbton, und der Quellsatz
ist bewusst so angelegt, dass die vier weit auseinanderliegen: Haut rosbraun bei
etwa 10 Grad, Gold gelb bei 44, Smaragd bei 175, Stein blaugrau bei 220 und
dabei kaum gesaettigt. Frueher lagen Haut und Gold nur 20 Grad auseinander und
liefen ineinander; jetzt sind es ueber 30 mit sauberer Kante im Bild selbst.

    python3 tools/carve-teams.py [--masken]
"""
import glob, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = "src/app/ui/assets/carved"
ABGELEITET = ("-light.webp", "-dark.webp", "-maske.png")

# Der Stein der guten Seite: warmes Elfenbein, Schatten gebrochen statt grau.
E_TIEF = np.array([0.42, 0.39, 0.34])
E_HOCH = np.array([0.99, 0.97, 0.92])
# Der Stein der Gegenseite: kalter Basalt, deutlich dunkler und blaeulich.
B_TIEF = np.array([0.055, 0.065, 0.085])
B_HOCH = np.array([0.44, 0.47, 0.53])
# Silber fuer die Einlage der Gegenseite: kuehl, hell, mit Biss in den Lichtern.
S_TIEF = np.array([0.30, 0.32, 0.37])
S_HOCH = np.array([0.96, 0.97, 1.00])

# Der Schiefer des Quellsatzes liegt etwa zwischen diesen Helligkeiten. Genau
# dieses Band wird gespreizt - sonst bliebe die Figur ein flacher Fleck ohne
# Werkzeugspur.
STEIN_VON, STEIN_BIS = 0.14, 0.78

# Farbtonfenster in Umdrehungen (0..1) statt Grad.
GOLD_VON, GOLD_BIS = 0.075, 0.190      #  27 - 68 Grad, gelb
HAUT_BIS           = 0.075             #   0 - 27 Grad, rosbraun
HAUT_UM            = 0.955             # und alles ab 344 Grad herum
SMA_VON, SMA_BIS   = 0.390, 0.600      # 140 - 216 Grad, gruen bis blaugruen


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


def _schliessen(maske, radius):
    """Eine reine Pixelmaske ist loechrig: die tiefsten Schatten und hellsten
    Glanzlichter einer Wange fallen aus dem Farbtonfenster heraus. Blieben diese
    Loecher stehen, sprenkelte die Steinrampe mitten durchs Gesicht. Also erst
    schliessen, dann Loecher fuellen - danach ist eine Wange eine Flaeche."""
    if not maske.any():
        return maske
    y, x = np.ogrid[-radius:radius + 1, -radius:radius + 1]
    kern = x * x + y * y <= radius * radius
    return ndimage.binary_fill_holes(ndimage.binary_closing(maske, structure=kern))


def masken(h, s, v):
    """Gold, Haut und Rangstein voneinander und vom Stein trennen."""
    gold = (h >= GOLD_VON) & (h < GOLD_BIS) & (s > 0.22) & (v > 0.30)
    haut = ((h < HAUT_BIS) | (h > HAUT_UM)) & (s > 0.15) & (s < 0.80) & (v > 0.22)
    stein_ = (h >= SMA_VON) & (h < SMA_BIS) & (s > 0.28) & (v > 0.12)   # Smaragd
    haut = _schliessen(haut, 6)
    gold = _schliessen(gold, 4) & ~haut          # an der Grenze gewinnt die Haut
    return gold, haut, _schliessen(stein_, 3)


def _rampe(v, tief, hoch, gamma=0.85):
    t = np.clip((v - STEIN_VON) / (STEIN_BIS - STEIN_VON), 0, 1) ** gamma
    return tief + (hoch - tief) * t[..., None]


def hell(pfad, ziel):
    """Die gute Seite: Stein zu Elfenbein, alles andere bleibt stehen."""
    im = Image.open(pfad).convert("RGBA")
    rgb, h, s, v = zerlegen(im)
    gold, haut, stein_ = masken(h, s, v)
    behalten = gold | haut | stein_
    _sichern(np.where(behalten[..., None], rgb, _rampe(v, E_TIEF, E_HOCH)), im, ziel)


def dunkel(pfad, ziel):
    """Die Gegenseite: kalter Basalt, Silber statt Gold, fahle Haut."""
    im = Image.open(pfad).convert("RGBA")
    rgb, h, s, v = zerlegen(im)
    gold, haut, stein_ = masken(h, s, v)

    t = np.clip((v - 0.10) / 0.72, 0, 1) ** 0.78
    einlage = S_TIEF + (S_HOCH - S_TIEF) * t[..., None]
    # Haut auskuehlen: Saettigung stark zurueck, Blaugruen leicht dazu. Aus
    # einem lebendigen Gesicht wird ein steinernes - dasselbe Volk, andere Seite.
    grau = rgb.mean(-1, keepdims=True)
    fahl = np.clip(grau * 0.88 + (rgb - grau) * 0.30 + np.array([-0.03, 0.0, 0.02]), 0, 1)

    out = _rampe(v, B_TIEF, B_HOCH)
    out = np.where(stein_[..., None], rgb, out)
    out = np.where(gold[..., None], einlage, out)
    out = np.where(haut[..., None], fahl, out)
    _sichern(out, im, ziel)


def maskenbild(pfad, ziel):
    """Kontrollbild: Gold gelb, Haut magenta, Rangstein gruen, Stein schwarz."""
    im = Image.open(pfad).convert("RGBA")
    _, h, s, v = zerlegen(im)
    gold, haut, stein_ = masken(h, s, v)
    out = np.zeros(h.shape + (3,), dtype=np.float32)
    out[gold] = [1, 0.85, 0.1]
    out[haut] = [1, 0.2, 0.8]
    out[stein_] = [0.2, 1, 0.3]
    _sichern(out, im, ziel, fmt="PNG")


def _sichern(out, im, ziel, fmt="WEBP"):
    alpha = np.asarray(im)[..., 3]
    bild = Image.fromarray(np.dstack([np.clip(out * 255, 0, 255).astype(np.uint8), alpha]), "RGBA")
    bild.save(ziel, "WEBP", quality=92, method=6) if fmt == "WEBP" else bild.save(ziel)


if __name__ == "__main__":
    kontrolle = "--masken" in sys.argv
    n = 0
    for f in sorted(glob.glob(os.path.join(SRC, "carved-*.webp"))):
        if f.endswith(ABGELEITET):
            continue
        hell(f, f.replace(".webp", "-light.webp"))
        dunkel(f, f.replace(".webp", "-dark.webp"))
        if kontrolle:
            maskenbild(f, f.replace(".webp", "-maske.png"))
        n += 1
        print("abgeleitet:", os.path.basename(f))
    print(f"carve-teams: {n} Figuren, je hell und dunkel")
