"""Farbleitsystem der geschnitzten Figuren + Glanz auf die Kronen.

ZWECK. Der Besitzer will, dass Koenig und Dame an der Farbe sofort erkennbar
sind und dass diese Farbe KEINE andere Figur traegt. Die Messung des
Ist-Zustands hat gezeigt, dass genau das heute verletzt ist:

    Bauer   195-210 Grad blau   (49% seiner Flaeche)
    Koenig  210-225 Grad blau   (42%)

Blau ist also ausgerechnet die Farbe, die Koenig und Bauer TEILEN. Der Koenig
muss deshalb gar nicht umgefaerbt werden — der Bauer muss weg vom Blau.

ZIELPALETTE (Farbwinkel, gemessener Mindestabstand 75 Grad zu Blau):

    Koenig, Dame     215 Grad blau     <- exklusiv
    Bauer, Gambit    140 Grad gruen
    Springer           5 Grad rot
    Turm              22 Grad kupfer
    Laeufer           38 Grad gold

Der Koenig ist bereits blau und wird nur im Glanz angefasst. Zu tun bleibt:
Gewand der Dame rot -> blau, Koerper des Bauern blau -> gruen.

GLANZ. "Die Krone darf etwas golden glaenzen." Umgesetzt als Anhebung der
hellsten Facetten, nicht als aufgemalter Lichtfleck: die obersten 12% der
Helligkeitsverteilung im Kronenbereich werden angehoben und leicht gesaettigt,
alles darunter bleibt. Dadurch waechst der Abstand zwischen Glanzlicht und
Grundton — das ist es, was als Glanz gelesen wird — ohne dass die Form
zugekleistert wird. Bewusst zurueckhaltend ("etwas").

    python3 tools/livree-farben.py            # Probe nach /tmp
    python3 tools/livree-farben.py --anwenden  # ins Repo
"""
import argparse
import colorsys
import math
import os
from PIL import Image, ImageFilter

Q = "src/app/ui/assets/carved/carved-%s-light.webp"

# name -> (Farbband von, bis in Grad, Zielwinkel, Hoehenband von, bis)
UMFAERBEN = {
    "queen": (335.0, 12.0, 215.0, 0.34, 1.00),
    "pawn":  (185.0, 220.0, 140.0, 0.30, 0.90),
}
# Kronen: Hoehenband, in dem Gold zu Glanz gebracht wird
KRONEN = {"king": (0.00, 0.15), "queen": (0.00, 0.15)}
GLANZ_ANTEIL = 0.12      # oberste 12% der Helligkeit gelten als Facette
GLANZ_HUB = 0.30         # wie stark sie angehoben werden
GLANZ_SAT = 1.12


def box(im):
    return im.split()[3].point(lambda v: 255 if v > 12 else 0).getbbox()


def im_band(h, von, bis):
    """Liegt Farbwinkel h im Band? Faengt den Umlauf ueber 0 Grad ab."""
    return (von <= h or h <= bis) if von > bis else (von <= h <= bis)


def umfaerben(im, von, bis, ziel, y_von, y_bis):
    x0, y0, x1, y1 = box(im)
    Hf = y1 - y0
    aus = im.copy()
    px, ap = im.load(), aus.load()
    n = 0
    for y in range(int(y0 + y_von * Hf), int(y0 + y_bis * Hf)):
        for x in range(x0, x1):
            r, g, b, a = px[x, y]
            if a < 40:
                continue
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            hd = h * 360
            if s < 0.20 or v < 0.10 or not im_band(hd, von, bis):
                continue
            nr, ng, nb = colorsys.hsv_to_rgb(ziel / 360, s, v)
            ap[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)
            n += 1
    return aus, n


def glanz(im, y_von, y_bis):
    """Die hellsten Facetten im Kronenband anheben."""
    x0, y0, x1, y1 = box(im)
    Hf = y1 - y0
    ya, yb = int(y0 + y_von * Hf), int(y0 + y_bis * Hf)
    px = im.load()
    werte = []
    for y in range(ya, yb):
        for x in range(x0, x1):
            r, g, b, a = px[x, y]
            if a < 200:
                continue
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if 20 <= h * 360 <= 55 and s > 0.25:
                werte.append(v)
    if not werte:
        return im, 0, 0
    werte.sort()
    schwelle = werte[int(len(werte) * (1 - GLANZ_ANTEIL))]
    aus = im.copy()
    ap = aus.load()
    n = 0
    for y in range(ya, yb):
        for x in range(x0, x1):
            r, g, b, a = px[x, y]
            if a < 200:
                continue
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if not (20 <= h * 360 <= 55 and s > 0.25) or v < schwelle:
                continue
            t = (v - schwelle) / max(1e-6, 1 - schwelle)
            nv = min(1.0, v + GLANZ_HUB * (0.35 + 0.65 * t))
            ns = min(1.0, s * GLANZ_SAT)
            nr, ng, nb = colorsys.hsv_to_rgb(h, ns, nv)
            ap[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)
            n += 1
    return aus, n, schwelle


def messe(im, y_von, y_bis, nur_gold=False, nur_band=None):
    """Kreismittel des Farbwinkels + Helligkeit eines Bands.

    WICHTIG: Farbwinkel sind zyklisch. Ein arithmetisches Mittel aus Rot (350)
    und Gold (35) ergibt 192 Grad — also Blau, obwohl keine einzige Bildstelle
    blau ist. Deshalb wird ueber Einheitsvektoren gemittelt (atan2). Diese
    Falle hat in der ersten Fassung dieses Werkzeugs einen kompletten
    Fehlnachweis erzeugt.
    """
    x0, y0, x1, y1 = box(im)
    Hf = y1 - y0
    px = im.load()
    sx = sy = 0.0
    ls = []
    n = 0
    for y in range(int(y0 + y_von * Hf), int(y0 + y_bis * Hf)):
        for x in range(x0, x1):
            r, g, b, a = px[x, y]
            if a < 200:
                continue
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            hd = h * 360
            if s < 0.20 or v < 0.10:
                continue
            if nur_gold and not (20 <= hd <= 55):
                continue
            if nur_band and not im_band(hd, nur_band[0], nur_band[1]):
                continue
            sx += math.cos(math.radians(hd))
            sy += math.sin(math.radians(hd))
            ls.append(0.2126 * r + 0.7152 * g + 0.0722 * b)
            n += 1
    if not n:
        return float("nan"), float("nan"), float("nan"), 0
    ls.sort()
    return (math.degrees(math.atan2(sy, sx)) % 360,
            sum(ls) / len(ls), ls[int(len(ls) * 0.97)], n)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--anwenden", action="store_true")
    a = p.parse_args()
    os.makedirs("/tmp/livree", exist_ok=True)

    for name in ("queen", "pawn", "king"):
        im = Image.open(Q % name).convert("RGBA")
        vorher = im.copy()
        zeilen = []

        if name in UMFAERBEN:
            von, bis, ziel, ya, yb = UMFAERBEN[name]
            im, n = umfaerben(im, von, bis, ziel, ya, yb)
            ges = sum(1 for q in vorher.getdata() if q[3] > 200)
            hq, lq, _, nq = messe(vorher, ya, yb, nur_band=(von, bis))
            hz, lz, _, nz = messe(im, ya, yb, nur_band=(ziel - 12, ziel + 12))
            _, _, _, rest = messe(im, ya, yb, nur_band=(von, bis))
            zeilen.append("  Quellton  %3.0f Grad, %d Px  ->  Zielton %3.0f Grad, %d Px"
                          % (hq, nq, hz, nz))
            zeilen.append("  Helligkeit erhalten: L %3.0f -> %3.0f" % (lq, lz))
            zeilen.append("  Rest im alten Farbband: %d Px (%.2f%% der Figur)"
                          % (rest, 100 * rest / ges))

        if name in KRONEN:
            ya, yb = KRONEN[name]
            vor_k = im.copy()
            im, n, schw = glanz(im, ya, yb)
            h1, l1, s1, _ = messe(vor_k, ya, yb, nur_gold=True)
            h2, l2, s2, _ = messe(im, ya, yb, nur_gold=True)
            zeilen.append("  Krone  %3.0f -> %3.0f Grad   L %3.0f -> %3.0f   Glanzspitze %3.0f -> %3.0f  (%d Facetten)"
                          % (h1, h2, l1, l2, s1, s2, n))

        # Gegenprobe: hat sich ausserhalb der Zielbaender etwas bewegt?
        rest = []
        for lo, hi, lab in [(0.15, 0.32, "Gesicht/Kragen"), (0.90, 1.00, "Sockel")]:
            if name in KRONEN and hi <= 0.15:
                continue
            hv, lv, _, _ = messe(vorher, lo, hi)
            hn, ln, _, _ = messe(im, lo, hi)
            d = abs((hv - hn + 180) % 360 - 180)
            if d > 2 or abs(lv - ln) > 6:
                rest.append("%s BEWEGT (%.0f->%.0f Grad, L %.0f->%.0f)" % (lab, hv, hn, lv, ln))
        print("=== %s ===" % name)
        for z in zeilen:
            print(z)
        print("  unberuehrt: %s" % (", ".join(rest) if rest else "Gesicht/Kragen und Sockel stehen"))

        ziel_p = (Q % name) if a.anwenden else "/tmp/livree/%s.webp" % name
        im.save(ziel_p, "WEBP", quality=92, method=6)
        im.save("/tmp/livree/%s.png" % name)
    print()
    print("geschrieben nach %s" % ("dem Repo" if a.anwenden else "/tmp/livree"))


if __name__ == "__main__":
    main()
