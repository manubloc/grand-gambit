#!/usr/bin/env python3
"""Vorschaubilder fuer die Schaukammer.

Die Kammer zeigt Kacheln von rund 116 px. Bisher lud sie dafuer das volle
Bild - bei 382 Bildern und teils 2,5 MB je Stueck dauerte das lange und kostete
unnoetig Bandbreite. Diese Vorschauen sind 200 px lang und ein Bruchteil so
gross; das Original kommt erst beim Antippen.
"""
import os, sys, glob
from PIL import Image

quelle, ziel = sys.argv[1], sys.argv[2]
n = 0
klein = 0
for f in glob.glob(os.path.join(quelle, "**", "*"), recursive=True):
    if not os.path.isfile(f): continue
    if not f.lower().endswith((".webp", ".png", ".jpg", ".jpeg")): continue
    rel = os.path.relpath(f, quelle)
    # v1.0.3: die Endung wurde frueher ABGESCHNITTEN - logo.jpg und logo.webp
    # ergaben beide "logo.webp", eines ueberschrieb das andere, und eine
    # Kachel zeigte still das falsche Bild. Jetzt bleibt die Endung stehen
    # und .webp kommt dahinter; nur was schon .webp heisst, behaelt seinen
    # Namen.
    aus = os.path.join(ziel, rel if rel.lower().endswith(".webp") else rel + ".webp")
    os.makedirs(os.path.dirname(aus), exist_ok=True)
    try:
        im = Image.open(f)
        im.thumbnail((200, 200), Image.LANCZOS)
        if im.mode not in ("RGBA", "RGB"): im = im.convert("RGBA")
        im.save(aus, "WEBP", quality=78, method=4)
        n += 1
        klein += os.path.getsize(aus)
    except Exception:
        pass
print(f"vorschau: {n} Bilder, zusammen {klein // 1024} KB")
