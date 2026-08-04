#!/usr/bin/env python3
"""DIE FIGUREN AUF EIN MASS BRINGEN (v0.86, Besitzerbefund).

Alle geschnitzten Figuren liegen auf derselben Leinwand (640x800), aber die
Figur DARIN ist unterschiedlich gross: die Sockel massen zwischen 255 und
309 px. Auf dem Brett wird nach der Leinwand skaliert, nicht nach der Figur -
also steht eine gedrungene Figur breiter da als eine schlanke. Am staerksten
beim TURM: 274x462 px, das Verhaeltnis Sockel zu Hoehe ist 0,59 gegen 0,50
beim Gambit, er erscheint also rund 18 % breiter. Genau das hat der Besitzer
gesehen.

Dieses Werkzeug skaliert jede Figur so, dass ihr SOCKEL dieselbe Breite hat,
und setzt sie unten buendig auf die Leinwand zurueck. Die Bosse bleiben
unberuehrt - sie sollen wuchtig sein und stehen ohnehin allein.
"""
import glob, os, sys
import numpy as np
from PIL import Image

ZIEL_SOCKEL = 272      # etwas unter dem alten Mittel (285): alles einen Ticken kleiner
LEINWAND = (640, 800)
FUSS = 12              # px Luft unter dem Sockel

def sockelbreite(a):
    m = a[:, :, 3] > 40
    ys, xs = np.nonzero(m)
    hoehe = ys.max() - ys.min() + 1
    unten = ys.max() - int(hoehe * 0.08)
    sm = m[unten:ys.max() + 1]
    sxs = np.nonzero(sm.any(axis=0))[0]
    return (sxs.max() - sxs.min() + 1) if len(sxs) else 0, (xs.min(), xs.max(), ys.min(), ys.max())

def normiere(pfad, schreiben=True):
    im = Image.open(pfad).convert("RGBA")
    a = np.asarray(im)
    breite, (x0, x1, y0, y1) = sockelbreite(a)
    if not breite: return None
    f = ZIEL_SOCKEL / breite
    figur = im.crop((x0, y0, x1 + 1, y1 + 1))
    neu = figur.resize((max(1, round(figur.width * f)), max(1, round(figur.height * f))), Image.LANCZOS)
    # passt sie noch auf die Leinwand? sonst an der Hoehe deckeln
    if neu.height > LEINWAND[1] - FUSS:
        g = (LEINWAND[1] - FUSS) / neu.height
        neu = neu.resize((max(1, round(neu.width * g)), LEINWAND[1] - FUSS), Image.LANCZOS)
    blatt = Image.new("RGBA", LEINWAND, (0, 0, 0, 0))
    blatt.paste(neu, ((LEINWAND[0] - neu.width) // 2, LEINWAND[1] - FUSS - neu.height), neu)
    if schreiben:
        blatt.save(pfad, "WEBP", quality=92, method=6)
    n2 = np.asarray(blatt)
    return breite, sockelbreite(n2)[0]

if __name__ == "__main__":
    pruefen = "--pruefen" in sys.argv
    abw = []
    for p in sorted(glob.glob("src/app/ui/assets/carved/carved-*.webp")):
        if "boss-" in p: continue          # die Meister bleiben, wie sie sind
        r = normiere(p, schreiben=not pruefen)
        if not r: continue
        vorher, nachher = r
        abw.append(nachher)
        if abs(nachher - ZIEL_SOCKEL) > 6:
            print(f"  ! {os.path.basename(p)}: Sockel {vorher} -> {nachher} (Ziel {ZIEL_SOCKEL})")
    if abw:
        print(f"Sockelbreiten jetzt: {min(abw)}..{max(abw)} px (Spanne {max(abw)-min(abw)}), Ziel {ZIEL_SOCKEL}")
        print("== FIGUREN NORMIERT ==" if max(abw) - min(abw) <= 12 else "== SPANNE ZU GROSS ==")
