# -*- coding: utf-8 -*-
"""Liest die Stationsmarker aus einer gemalten Weltkarte aus.

Die Karten werden mit 51 tiefschwarzen Scheiben erzeugt (Prompt-Block "STATION
MARKERS"). In einer matten Steinwelt mit weichem Licht kommt echtes Schwarz
sonst nirgends vor - Schatten sind grau. Damit lassen sich die Marker sicher
finden, ohne dass jemand 51 Punkte von Hand nachmisst.

Verfahren: Schwellenwert auf sehr dunkel und sehr unbunt -> zusammenhaengende
Flaechen (Zwei-Durchgang-Markierung) -> Flaechen nach Groesse und Rundheit
filtern -> Schwerpunkt je Marker. Zum Schluss wird gegen die erwartete Anzahl
geprueft, damit ein Fehlschlag auffaellt statt still durchzurutschen.

Aufruf:  python3 tools/detect-stations.py karte-01.png [--erwartet 51] [--debug]
Ausgabe: JSON mit Pixelkoordinaten, sortiert wie die Stations-Ids im Spiel.
"""
import sys, json, math
from collections import deque
from PIL import Image, ImageDraw

MAX_LUM   = 62      # Marker sind tiefschwarz
MAX_CHROMA= 30      # und unbunt
MIN_AREA  = 60      # kleiner ist Bildrauschen
MIN_ROUND = 0.62    # Flaeche / (pi * r^2) der umschliessenden Kreisscheibe


def find_blobs(img):
    im = img.convert('RGB')
    w, h = im.size
    px = im.load()
    dark = bytearray(w * h)
    for y in range(h):
        row = y * w
        for x in range(w):
            r, g, b = px[x, y]
            if max(r, g, b) - min(r, g, b) <= MAX_CHROMA and \
               0.2126 * r + 0.7152 * g + 0.0722 * b <= MAX_LUM:
                dark[row + x] = 1
    seen = bytearray(w * h)
    blobs = []
    for start in range(w * h):
        if not dark[start] or seen[start]:
            continue
        q = deque([start]); seen[start] = 1
        cells = []
        while q:
            i = q.popleft(); cells.append(i)
            y, x = divmod(i, w)
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w:
                    j = ny * w + nx
                    if dark[j] and not seen[j]:
                        seen[j] = 1; q.append(j)
        if len(cells) < MIN_AREA:
            continue
        ys = [c // w for c in cells]; xs = [c % w for c in cells]
        cx, cy = sum(xs) / len(xs), sum(ys) / len(ys)
        rad = max(math.dist((x, y), (cx, cy)) for x, y in zip(xs, ys))
        roundness = len(cells) / max(math.pi * rad * rad, 1)
        blobs.append({'x': round(cx), 'y': round(cy), 'area': len(cells),
                      'r': round(rad, 1), 'round': round(roundness, 3)})
    return [b for b in blobs if b['round'] >= MIN_ROUND]


def order_like_journey(blobs):
    """Sortiert von unten links nach oben rechts - die Reiserichtung der Karte."""
    return sorted(blobs, key=lambda b: (-b['y'] + b['x'] * 0.35))


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    path = sys.argv[1]
    erwartet = 51
    if '--erwartet' in sys.argv:
        erwartet = int(sys.argv[sys.argv.index('--erwartet') + 1])
    img = Image.open(path)
    blobs = order_like_journey(find_blobs(img))
    print('Bild      %s  %dx%d' % (path.split('/')[-1], *img.size))
    print('Gefunden  %d Marker (erwartet %d)' % (len(blobs), erwartet))
    if blobs:
        rr = [b['r'] for b in blobs]
        print('Radius    %.1f bis %.1f px, Mittel %.1f' % (min(rr), max(rr), sum(rr) / len(rr)))
        print('Rundheit  %.2f bis %.2f' % (min(b['round'] for b in blobs),
                                           max(b['round'] for b in blobs)))
    if len(blobs) != erwartet:
        print('ACHTUNG: Anzahl stimmt nicht. Karte neu erzeugen oder Schwellen pruefen.')
    out = path.rsplit('.', 1)[0] + '-stationen.json'
    json.dump([{'x': b['x'], 'y': b['y']} for b in blobs], open(out, 'w'), indent=1)
    print('Geschrieben', out)
    if '--debug' in sys.argv:
        d = img.convert('RGB'); dr = ImageDraw.Draw(d)
        for i, b in enumerate(blobs):
            dr.ellipse([b['x'] - b['r'] - 6, b['y'] - b['r'] - 6,
                        b['x'] + b['r'] + 6, b['y'] + b['r'] + 6], outline=(255, 0, 0), width=4)
            dr.text((b['x'] + b['r'] + 8, b['y'] - 10), str(i + 1), fill=(255, 0, 0))
        dbg = path.rsplit('.', 1)[0] + '-debug.png'
        d.save(dbg); print('Debugbild', dbg)
