"""Goldglanz auf die Kronen von Koenig und Dame.

Glanz hat keinen objektiven Zielwert - ob das edel wirkt, sieht nur ein Mensch.
Messbar ist dagegen der Fehlschlag: wenn zu viele Pixel auf 255 laufen, ist das
Gold ausgefressen und die Schnitzkanten sind weg. Genau das wird hier gezaehlt.

Das Verfahren ist bewusst zurueckhaltend: kein aufgemalter Lichtfleck, sondern
eine Anhebung der vorhandenen Lichter im Gold (Mitteltoene ueber eine Gamma-
Kurve, Glanzlichter zusaetzlich schmal verstaerkt). Die Schnitzfacetten bleiben
dadurch erhalten, sie treten nur deutlicher hervor.
"""
import colorsys, sys
from PIL import Image, ImageFilter

def box(im): return im.split()[3].point(lambda v: 255 if v>12 else 0).getbbox()

def glanz(name, bis_hoehe, gamma=0.74, glanz_staerke=0.42, probe=True):
    p = "src/app/ui/assets/carved/carved-%s-light.webp" % name
    im = Image.open(p).convert("RGBA"); bb = box(im)
    x0,y0,x1,y1 = bb; Hf = y1-y0
    px = im.load(); aus = im.copy(); ap = aus.load()
    grenze = y0 + bis_hoehe*Hf
    n = clip_vor = clip_nach = gold = 0
    for y in range(y0, int(grenze)):
        fy = 1.0 if y < grenze - 0.03*Hf else max(0.0,(grenze-y)/(0.03*Hf))
        for x in range(x0,x1):
            r,g,b,a = px[x,y]
            if a < 40: continue
            h,s,v = colorsys.rgb_to_hsv(r/255,g/255,b/255)
            hd = h*360
            if not (26 <= hd <= 50) or s < 0.30: continue
            gold += 1
            if max(r,g,b) >= 254: clip_vor += 1
            nv = v ** gamma                       # Mitteltoene anheben
            if v > 0.62:                          # Glanzlichter schmal verstaerken
                nv += glanz_staerke * ((v-0.62)/0.38)**2 * (1-nv)
            nv = v + (min(1.0,nv)-v)*fy
            ns = min(1.0, s*(1 - 0.18*fy*(nv-v)*3))   # Lichter leicht entsaettigen
            nr,ng,nb = colorsys.hsv_to_rgb(h, ns, nv)
            ap[x,y] = (round(nr*255),round(ng*255),round(nb*255),a)
            if max(ap[x,y][:3]) >= 254: clip_nach += 1
            n += 1
    print("%s: %d Goldpixel in der Krone bearbeitet" % (name.upper(), n))
    print("   ausgefressen (>=254): vorher %d = %.2f%%   nachher %d = %.2f%%"
          % (clip_vor, 100*clip_vor/max(1,gold), clip_nach, 100*clip_nach/max(1,gold)))
    warn = "  <== ZU VIEL, Schnitzkanten gehen verloren" if clip_nach/max(1,gold) > 0.02 else "  ok"
    print("   Urteil:%s" % warn)
    aus.save("/tmp/palette/%s-glanz.png" % name)
    if not probe: aus.save(p, "WEBP", quality=92, method=6)
    return aus

import os; os.makedirs("/tmp/palette", exist_ok=True)
probe = "--anwenden" not in sys.argv
glanz("queen", 0.135, probe=probe)
print()
glanz("king", 0.150, probe=probe)
