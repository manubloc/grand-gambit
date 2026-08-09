"""Greenscreen sauber entfernen und auf Spielmass bringen.

Zwei Lehren stecken hier drin:

1. RGB-ABSTAND TAUGT NICHT. Der erste Versuch verglich jedes Pixel mit der
   Hintergrundfarbe. Am weichen Verlauf blieben Reste, und beim Magenta
   verschwanden halbe Gesichter, weil der Hautton farblich nahe lag.
   Gruen hat dagegen einen sehr eigenen FARBTON (hue): alles, was gruenlich
   UND halbwegs gesaettigt ist, ist Hintergrund - unabhaengig von der
   Helligkeit. Damit fallen auch die dunklen Verlaufsecken.

2. NUR WAS VOM RAND ZUSAMMENHAENGT. Sonst reisst der Filter Loecher in
   Figurteile, die zufaellig in den Farbbereich fallen.

Dazu das Entgruenen: an der Silhouette mischt das Modell etwas Gruen ins
Holz. Diese Pixel werden entsaettigt, statt sie wegzuschneiden - sonst
frisst man die Kante der Figur mit.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage


def maske_gruen(a):
    """True, wo das Pixel zum gruenen Hintergrund gehoert."""
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    maxv = a.max(axis=2)
    minv = a.min(axis=2)
    saettigung = (maxv - minv) / np.maximum(maxv, 1)
    # gruen dominiert deutlich ueber beide anderen Kanaele
    return (g > r + 18) & (g > b + 18) & (saettigung > 0.22)


def entgruenen(rgb, wo):
    """Gruenstich aus den Randpixeln nehmen, ohne sie zu entfernen."""
    r, g, b = (rgb[:, :, i].astype(int) for i in range(3))
    ueber = wo & (g > (r + b) / 2)
    if ueber.any():
        gedeckelt = np.minimum(g, ((r + b) / 2).astype(int) + 6)
        rgb[:, :, 1] = np.where(ueber, gedeckelt, g).astype(np.uint8)
    return rgb


def freistellen(pfad_ein, pfad_aus, hoehe=None, leinwand=None, luft=0.035):
    im = Image.open(pfad_ein).convert("RGB")
    a = np.array(im).astype(int)

    kandidat = maske_gruen(a)
    markiert, _ = ndimage.label(kandidat)
    rand = set(markiert[0, :]) | set(markiert[-1, :]) | set(markiert[:, 0]) | set(markiert[:, -1])
    rand.discard(0)
    hintergrund = np.isin(markiert, list(rand))

    alpha = np.where(hintergrund, 0, 255).astype(np.uint8)
    alpha = np.array(Image.fromarray(alpha, "L").filter(ImageFilter.MinFilter(3)))

    # Entgruenen auf der GANZEN Figur, nicht nur am Saum: der Greenscreen
    # faerbt auch den Sockel ein (gemessen: 5-6 % der Figurflaeche blieben
    # gruenstichig). Keine Figur dieses Spiels traegt echtes Gruen - was
    # gruen wirkt, ist immer Reflex des Hintergrunds.
    rgb = entgruenen(a.astype(np.uint8).copy(), alpha > 60)

    frei = Image.fromarray(np.dstack([rgb, alpha]), "RGBA")
    ys, xs = np.where(alpha > 60)
    frei = frei.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))

    if hoehe:                       # auf einheitliche Figurenhoehe bringen
        breite = round(frei.width * hoehe / frei.height)
        frei = frei.resize((breite, hoehe), Image.LANCZOS)
    if leinwand:                    # mittig auf quadratische Leinwand, Fuss unten
        L = leinwand
        blatt = Image.new("RGBA", (L, L), (0, 0, 0, 0))
        unten = L - round(L * luft)
        blatt.paste(frei, ((L - frei.width) // 2, unten - frei.height), frei)
        frei = blatt

    frei.save(pfad_aus)
    return frei.size


if __name__ == "__main__":
    h = int(sys.argv[3]) if len(sys.argv) > 3 else None
    L = int(sys.argv[4]) if len(sys.argv) > 4 else None
    print(sys.argv[2], freistellen(sys.argv[1], sys.argv[2], h, L))
