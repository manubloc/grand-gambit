"""Die beiden Brettperlen im geschnitzten Stil - Lebenskraft rot, Angriff blau.

Die alten Perlen waren glaenzende Glasjuwelen: harte Spitzlichter, glatte
Kugel. Das passt zum gemalten Satz, nicht zum geschnitzten - dort ist alles
mattes Holz mit Meisselfacetten. Also dieselbe Kugelform, aber:

  MATT      kein Spiegelpunkt, nur ein weiches Licht von oben links
  FACETTEN  die Kugel wird in Flaechen zerlegt, jede mit eigener Neigung -
            das erzeugt Kanten statt Verlauf, wie ein geschnitztes Stueck
  RAND      dunkle Aussenkante, innen ein feiner Lichtsaum, wie bei den Feldern

Groesse und Alpha bleiben wie gehabt (144x144, freigestellt), damit im Brett
nichts nachgezogen werden muss.
"""
import numpy as np
from PIL import Image
import base64, io, re

G = 144
FARBEN = {"ORB_RED": (196, 58, 52), "ORB_BLUE": (62, 104, 190)}
FACETTEN = 9


def kugel(farbe):
    yy, xx = np.mgrid[0:G, 0:G]
    nx = (xx - G / 2 + .5) / (G / 2 - 3)
    ny = (yy - G / 2 + .5) / (G / 2 - 3)
    r2 = nx * nx + ny * ny
    innen = r2 <= 1.0
    nz = np.sqrt(np.clip(1 - r2, 0, 1))

    # Facetten: Normalen auf grobe Richtungen runden -> Flaechen mit Kanten
    az = np.arctan2(ny, nx)
    stufe = np.round(az / (2 * np.pi / FACETTEN)) * (2 * np.pi / FACETTEN)
    rad = np.sqrt(np.clip(r2, 0, 1))
    radst = np.round(rad * 3) / 3
    fx, fy = np.cos(stufe) * radst, np.sin(stufe) * radst
    fz = np.sqrt(np.clip(1 - radst ** 2, 0, 1))

    L = np.array([-0.45, -0.62, 0.64]); L /= np.linalg.norm(L)
    hell = np.clip(fx * L[0] + fy * L[1] + fz * L[2], 0, 1)
    hell = 0.30 + 0.70 * hell ** 0.85

    saum = np.clip((rad - 0.80) / 0.20, 0, 1)
    hell = hell * (1 - 0.55 * saum) + 0.42 * np.clip((rad - 0.62) / 0.16, 0, 1) * (1 - saum) * 0.5

    f = np.array(farbe, dtype=float)
    bild = np.clip(f[None, None, :] * hell[..., None], 0, 255)
    a = (innen * 255).astype(np.uint8)
    # weiche Aussenkante
    kante = np.clip((1.0 - rad) / 0.03, 0, 1)
    a = (kante * 255 * innen).astype(np.uint8)
    return Image.fromarray(np.dstack([bild.astype(np.uint8), a]), "RGBA")


def kennzahlen(im, lab):
    a = np.asarray(im)
    al = a[..., 3]
    m = al > 200
    rgb = a[..., :3][m].astype(float)
    lum = 0.2126 * rgb[:, 0] + 0.7152 * rgb[:, 1] + 0.0722 * rgb[:, 2]
    hell = np.percentile(lum, 95); dunkel = np.percentile(lum, 5)
    ys, xs = np.nonzero(al > 40)
    fuell = 100 * m.sum() / ((xs.max() - xs.min() + 1) * (ys.max() - ys.min() + 1))
    print("%-9s Fuellgrad %2.0f %% (Kreis = 79)  Modellierung hell/dunkel %3.0f/%3.0f  "
          "ausgefressen %.1f %%" % (lab, fuell, hell, dunkel, 100 * (lum >= 252).mean()))


if __name__ == "__main__":
    p = "src/app/ui/assets/stat/statAssets.js"
    s = open(p).read()
    for lab, f in FARBEN.items():
        im = kugel(f)
        kennzahlen(im, lab)
        b = io.BytesIO(); im.save(b, "WEBP", quality=92, method=6)
        d = "data:image/webp;base64," + base64.b64encode(b.getvalue()).decode()
        s = re.sub(r'(export const %s\s*=\s*)"[^"]*"' % lab, lambda m: m.group(1) + '"' + d + '"', s)
        im.save("/tmp/%s.png" % lab.lower())
    open(p, "w").write(s)
    print("statAssets.js neu geschrieben")
