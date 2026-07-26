#!/usr/bin/env python3
"""Beruhigt die GESCHNITZTEN Brettböden — nur `*.carved.webp`.

Warum: der Boden ist Kulisse, nicht Hauptdarsteller. Die generierten Böden
tragen so viel Eigenkontrast (harte Facetten, tiefe Fugen, kräftige Farbe),
dass die Schachfelder darüber verschwinden — das Brett "wirkt wild" und man
erkennt die Felder nicht mehr. Wir nehmen dem Boden Kontrast und Sättigung,
lassen die Struktur aber stehen: der geschnitzte Charakter bleibt als Hauch,
und die Hell/Dunkel-Schleier des Bretts bekommen wieder Luft.

Die KLASSISCHEN Böden werden bewusst NICHT angefasst — die dunkle Variante
bleibt exakt, wie sie ist.

    python3 tools/calm-grounds.py [--probe]

--probe schreibt nach /tmp statt ins Repo, zum Vergleichen vor dem Einbauen.
"""
import sys, glob, os
from PIL import Image, ImageEnhance

# Wie weit heruntergefahren wird. Empirisch: unter 0.55 Kontrast wird der
# Boden matschig, über 0.70 kämpft er weiter gegen die Felder.
KONTRAST  = 0.62   # Anteil des Originalkontrasts
SAETTIGUNG = 0.78  # etwas Farbe raus, damit Kapitelfarbe erhalten bleibt
AUFHELLEN  = 1.04  # minimal heller, sonst wirkt das Beruhigen wie Abdunkeln

def beruhige(pfad, ziel):
    im = Image.open(pfad).convert("RGB")
    im = ImageEnhance.Contrast(im).enhance(KONTRAST)
    im = ImageEnhance.Color(im).enhance(SAETTIGUNG)
    im = ImageEnhance.Brightness(im).enhance(AUFHELLEN)
    im.save(ziel, "WEBP", quality=90, method=6)
    return im

def kontrastmass(im):
    """Standardabweichung der Helligkeit — grobes Mass fuer 'Unruhe'."""
    g = im.convert("L")
    px = list(g.getdata())
    m = sum(px) / len(px)
    return (sum((p - m) ** 2 for p in px) / len(px)) ** 0.5

if __name__ == "__main__":
    probe = "--probe" in sys.argv
    dateien = sorted(glob.glob("src/app/ui/assets/ground-*.carved.webp"))
    if not dateien:
        sys.exit("keine geschnitzten Boeden gefunden — falsches Arbeitsverzeichnis?")
    for f in dateien:
        vorher = kontrastmass(Image.open(f).convert("RGB"))
        ziel = ("/tmp/" + os.path.basename(f)) if probe else f
        nachher = kontrastmass(beruhige(f, ziel))
        print(f"{os.path.basename(f):28s} Unruhe {vorher:5.1f} -> {nachher:5.1f}")
    print("fertig — %d Boeden%s" % (len(dateien), " (Probe in /tmp)" if probe else ""))
