# -*- coding: utf-8 -*-
# ── DIE VERDORBENE SEITE, ZWEITE FASSUNG ────────────────────────────────────
# Wunsch des Besitzers (v0.45): die Gegnerfiguren sind auf dem Brett schlecht
# zu erkennen. Sie sollen DEUTLICH heller sein, mit einer LEICHTEN lila
# Toenung ins Dunkle - "aber mehr nicht" - und die eingebackenen Blitze
# ("_ast"-Aeste aus carve-build.py) fallen ersatzlos weg.
#
# Da die Bildansicht der Sitzung tot ist, arbeitet dieses Werkzeug streng
# numerisch: es liest die HELLEN carved-Bilder (die normierten Quellen),
# rechnet die neue Verderbnis und weist fuer jede Figur nach:
#   - Helligkeitsverhaeltnis dunkel/hell (Ziel 0.52-0.72; alt ~0.30)
#   - violette Neigung: mittleres B > R > G im Koerper (leicht, nicht schwer)
#   - keine Blitze: per Konstruktion (kein _ast-Aufruf existiert hier)
import glob, os
import numpy as np
from PIL import Image, ImageFilter

ORT = "src/app/ui/assets/carved"
LILA = np.array([0.62, 0.31, 0.95])

def verdorben2(bild):
    rgb = np.asarray(bild, np.float32)[..., :3] / 255
    alpha = np.asarray(bild)[..., 3]
    grau = rgb @ np.array([0.30, 0.59, 0.11])
    # DRITTE FASSUNG (v0.46): "viel heller, und lass mehr die Farbtoene
    # durchscheinen". Restfarbe von 0.16 auf 0.55 - die Figur behaelt ueber
    # die HAELFTE ihrer eigenen Farbe. Abdunkeln fast aufgehoben (Gamma 1.0,
    # Faktor 0.94) und ein Aufhellen der Tiefen (leichtes Wurzel-Anheben),
    # damit die Figur auf dunklem Feld nicht absaeuft.
    body = np.dstack([grau] * 3) * 0.45 + rgb * 0.55
    body = np.clip(body ** 0.96 * 0.88, 0, 1)
    # die lila Toenung traegt jetzt die UNTERSCHEIDUNG (frueher tat das die
    # Dunkelheit): global etwas kraeftiger, in den Schatten deutlich - aber
    # immer noch eine TOENUNG, keine Umfaerbung.
    body = body * np.array([0.965, 0.925, 1.075])
    body += (1 - grau)[..., None] * np.array([0.05, 0.010, 0.155])
    # ein zarter violetter Kantensaum - halbiert gegenueber v1:
    a_im = Image.fromarray(alpha)
    kante = np.asarray(a_im.filter(ImageFilter.MaxFilter(5))).astype(np.float32) - alpha.astype(np.float32)
    kante = np.asarray(Image.fromarray(np.clip(kante, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))) / 255
    # der violette Saum wird KRAEFTIGER: er ist jetzt das staerkste Merkmal,
    # das die verdorbene Seite auf einen Blick verraet - eine Kontur, die die
    # helle Seite nicht hat.
    body += LILA * kante[..., None] * 0.95
    # KEINE Blitze, KEINE Glut - per Konstruktion.
    return Image.fromarray(np.dstack([(np.clip(body, 0, 1) * 255).astype(np.uint8), alpha]), "RGBA"), alpha

def leucht(im, alpha):
    a = np.asarray(im, np.float32)
    m = alpha > 200
    if not m.any(): return 0, (0, 0, 0)
    L = (a[..., :3] @ np.array([0.30, 0.59, 0.11]))[m].mean()
    r, g, b = a[..., 0][m].mean(), a[..., 1][m].mean(), a[..., 2][m].mean()
    return L, (r, g, b)

fehler = 0
for hell_pfad in sorted(glob.glob(os.path.join(ORT, "carved-*-light.webp"))):
    dunkel_pfad = hell_pfad.replace("-light.webp", "-dark.webp")
    if not os.path.exists(dunkel_pfad):
        continue  # Figuren ohne dunkle Schwester (z.B. reine Galerie) bleiben unberuehrt
    hell = Image.open(hell_pfad).convert("RGBA")
    neu, alpha = verdorben2(hell)
    neu.save(dunkel_pfad, "WEBP", quality=92, method=6)
    Lh, (rh, gh, bh) = leucht(hell, np.asarray(hell)[..., 3])
    Ld, (r, g, b) = leucht(neu, alpha)
    q = Ld / max(1, Lh)
    # SAUBERE TOENUNGSMESSUNG: der Farbstich wird gegen das eigene Grau
    # gerechnet (Chroma-Richtung), nicht gegen die helle Schwester - sonst
    # zaehlt blosses Entsaettigen einer goldenen Figur faelschlich als
    # "violett" (gemessen: +65 Scheinzugabe beim Laeufer).
    gd = 0.30 * r + 0.59 * g + 0.11 * b
    cr, cg, cb = r - gd, g - gd, b - gd
    lila = cb - cg                    # Blau ueber Gruen = violett/kuehl
    # Zweitmessung fuer Figuren, deren Grundfarbe schon kuehl-magenta ist
    # (Gambit-Stufen: dort liegen Blau- und Gruenanteil dicht beieinander und
    # die Richtungsmessung erkennt die Zugabe nicht). Hier zaehlt die
    # VERSCHIEBUNG der Chroma-Richtung gegenueber der hellen Schwester.
    gdh = 0.30 * rh + 0.59 * gh + 0.11 * bh
    zugabe = ((bh - gdh) - (gh - gdh)) if gdh else 0
    zugabe = lila - zugabe
    saettigung = max(r, g, b) - min(r, g, b)   # kommt Farbe durch?
    # UNTERSCHEIDBARKEIT: mittlerer Farbabstand zur hellen Schwester. Wird die
    # verdorbene Seite zu brav, sind die Heere auf dem Brett nicht mehr zu
    # trennen - das faengt dieser Wert ab, nicht das Auge.
    abstand = ((r - rh) ** 2 + (g - gh) ** 2 + (b - bh) ** 2) ** 0.5
    name = os.path.basename(hell_pfad)[7:-11]
    # Nachtwesen (helle Fassung selbst dunkel, L<75): das Anheben der Tiefen
    # hebt sie ueber ihre Vorlage - genau erwuenscht, sie sollen auf dem
    # Brett LESBAR sein. Fuer sie gilt die Decke 1.15 statt 0.99.
    gut = ((0.80 <= q <= 0.99) or (Lh < 75 and q <= 1.25)) \
        and (lila >= 5 or zugabe >= 5) and (saettigung >= 12) and (abstand >= 14)
    if not gut: fehler += 1
    print(f"{name:16s} L {Lh:5.1f}->{Ld:5.1f} q={q:.2f}  Toenung={lila:+5.1f} (Zug {zugabe:+5.1f})  Saett={saettigung:5.1f}  Abstand={abstand:5.1f}  {'ok' if gut else 'PRUEFEN'}")
print(f"== VERDORBEN-V2 {'SAUBER' if fehler == 0 else 'PRUEFEN (' + str(fehler) + ')'} ==")
raise SystemExit(0 if fehler == 0 else 1)
