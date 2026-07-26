"""Der Hintergrund hinter der App: ein Schachbrett, das nach oben im Dunkel verschwindet.

Wunsch des Besitzers: "ganz unten mit dem Schwarz im Hintergrund so ganz leicht
angedeutet Schachbrett ... darf gerne diese geschnitzte Optik haben."

Deshalb gerechnet statt generiert - ein Raster hat keine Geschmacksfragen, nur
Zahlen, und die kann ich pruefen:

  PERSPEKTIVE  Die Reihenhoehe nimmt nach oben ab, damit das Brett in die Tiefe
               laeuft statt flach zu tapezieren. Unten die groessten Felder.
  AUSBLENDEN   Nach oben loest sich alles in den Grund auf. Ganz oben MUSS der
               reine Grundton stehen, sonst sieht man eine Kante gegen die App.
  MEISSEL      Feine Facetten je Feld, aus einem Rauschfeld mit harten Kanten -
               dieselbe Materialsprache wie die Figuren, nur viel leiser.
  LEISE        Der Hell/Dunkel-Unterschied der Felder bleibt unter 1,25:1. Das
               ist ein Hauch. Der Grund darf nichts sein, was mit dem Inhalt
               um Aufmerksamkeit streitet - die Vorgabe aus KARTEN-V5.md gilt
               hier genauso: "nothing may compete".
"""
import numpy as np
from PIL import Image

B, H = 1080, 1920
GRUND = (0x15, 0x1d, 0x2c)      # T.bg der geschnitzten Livree
SPALTEN = 8
STAERKE = 0.26                 # Amplitude des Hell/Dunkel-Wechsels
HORIZONT = 0.30                 # ab hier nach oben ist nur noch Grund


def reihen():
    """Reihenkanten von unten nach oben, jede Reihe flacher als die davor."""
    kanten = [1.0]
    y, h = 1.0, 0.115
    while y > HORIZONT and len(kanten) < 40:
        y -= h
        kanten.append(max(HORIZONT, y))
        h *= 0.80
    return kanten


def bauen():
    yy, xx = np.mgrid[0:H, 0:B]
    ry = yy / H
    kant = reihen()

    reihe_idx = np.zeros((H, B), dtype=np.int32)
    for i in range(len(kant) - 1):
        oben, unten = kant[i + 1], kant[i]
        reihe_idx[(ry <= unten) & (ry > oben)] = i

    # Spalten laufen zur Fluchtmitte zusammen, sonst wirkt es wie Tapete
    tiefe = np.clip((ry - HORIZONT) / (1 - HORIZONT), 0.02, 1.0)
    sx = (xx / B - 0.5) / tiefe + 0.5
    spalte = np.floor(sx * SPALTEN).astype(np.int32)

    brett = ((reihe_idx + spalte) % 2).astype(np.float32) * 2 - 1   # -1 / +1

    # Meisselfacetten: grobes Rauschen, hart geschnitten
    rng = np.random.default_rng(20260726)
    klein = rng.normal(0, 1, (H // 12 + 2, B // 12 + 2))
    fac = np.asarray(Image.fromarray(
        ((klein - klein.min()) / np.ptp(klein) * 255).astype(np.uint8)
    ).resize((B, H), Image.BILINEAR), dtype=np.float32) / 255 - 0.5
    fac = np.sign(fac) * np.abs(fac) ** 0.6          # Kanten haerten

    muster = brett * (1 + 0.45 * fac) + 0.30 * fac

    # Ausblenden nach oben, plus ein leiser Abfall zu den Seiten
    ausy = np.clip((ry - HORIZONT) / (1 - HORIZONT), 0, 1) ** 1.5
    ausx = 1 - 0.35 * np.clip(np.abs(xx / B - 0.5) * 2, 0, 1) ** 2
    muster *= ausy * ausx

    grund = np.array(GRUND, dtype=np.float32)
    bild = grund[None, None, :] * (1 + STAERKE * muster[..., None])
    return np.clip(bild, 0, 255).astype(np.uint8)


def pruefe(arr):
    def lin(c):
        c = c / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    def lum(px):
        return 0.2126 * lin(px[0]) + 0.7152 * lin(px[1]) + 0.0722 * lin(px[2])

    unten = arr[int(H * 0.94):, :, :].reshape(-1, 3).astype(float)
    l = np.array([lum(p) for p in unten[::311]])
    hell, dunkel = np.percentile(l, 90), np.percentile(l, 10)
    k = (hell + 0.05) / (dunkel + 0.05)
    oben = arr[:int(H * 0.06), :, :].reshape(-1, 3)
    ab = np.abs(oben.astype(int) - np.array(GRUND)).max()
    print("Feldkontrast unten:      %.3f:1   (Ziel 1,10-1,25 - nur ein Hauch)" % k)
    print("Abweichung ganz oben:    %d/255  (Ziel 0 - sonst Kante gegen die App)" % ab)
    print("Urteil: %s" % ("ok" if 1.06 <= k <= 1.30 and ab <= 2 else "NACHBESSERN"))


if __name__ == "__main__":
    arr = bauen()
    pruefe(arr)
    im = Image.fromarray(arr)
    im.save("src/app/ui/assets/bg-hall.carved.webp", "WEBP", quality=88, method=6)
    im.save("/tmp/brettgrund.png")
    import os
    print("geschrieben: %d KB" % (os.path.getsize("src/app/ui/assets/bg-hall.carved.webp") / 1024))
