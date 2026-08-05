#!/usr/bin/env python3
# ── WELCHE SPIELFASSUNG HAT IHR ORIGINAL? ───────────────────────────────────
# Bis v1.0.2 stand im Bestand nur eine SCHAETZUNG je Gruppe ("57 gesamt, 12
# original") - nach Augenmass und ohne festgehaltene Zuordnung. Beim naechsten
# Aufraeumen half das nicht: man sah nicht, WELCHES Bild sein Original hat.
#
# Dieses Werkzeug rechnet die Zuordnung Datei fuer Datei aus und schreibt sie
# als Liste fest. Die Schaukammer liest sie und kennzeichnet jede Kachel.
#
# Verfahren (drei Masse, weil eines nicht traegt):
#   Silhouette  Ueberdeckung der Alphamasken (IoU). Die Figuren wurden mit
#               normiere-figuren.py auf gleiche Sockelbreite gebracht - Rand
#               und Groesse stimmen also NICHT mehr. Darum wird vorher auf
#               den Inhalt zugeschnitten und gedehnt.
#   Helligkeit  Korrelation der Graustufen. Betrag, nicht Vorzeichen: der
#               dunkle Satz ist aus dem hellen per Palettenabbildung
#               entstanden, seine Helligkeit laeuft gegenlaeufig.
#   Kanten      Korrelation der Sobel-Betraege. Traegt am weitesten, weil sie
#               Farbe und Helligkeit ganz ignoriert.
#
# Ausgabe: archiv/bilder/zuordnung.json
import json, sys, os
from pathlib import Path
import numpy as np
from PIL import Image

WURZEL = Path(__file__).resolve().parent.parent
SPIEL = WURZEL / "src/app/ui/assets"
ARCHIV = WURZEL / "archiv/bilder"
ZIEL = ARCHIV / "zuordnung.json"
HAND = ARCHIV / "zuordnung-hand.json"
ARTEN = {".webp", ".jpg", ".jpeg", ".png"}
N = 64                      # Kantenlaenge des Vergleichsrasters

# ZWEI SCHWELLEN, DREI ZUSTAENDE. Eine einzelne Schwelle log: bei 0,62 fand
# das Verfahren 63 "Originale", darunter die Turnierfiguren - deren Originale
# der Besitzer aber gar nicht abgelegt hat (im Archiv liegen nur fruehere,
# verworfene Saetze). Nachgemessen an den 36 Treffern ueber 0,75: alle 23 ab
# 0,90 stimmen im Sichtvergleich, die 13 darunter sind geschnitzte Figuren
# derselben Familie, die sich um weniger als 0,07 unterscheiden - da raet das
# Verfahren. Also: sicher / moeglich / keins, und bei "moeglich" zeigt die
# Kammer den Kandidaten daneben, damit das Auge entscheidet.
SICHER = float(os.environ.get("SICHER", "0.90"))
MOEGLICH = float(os.environ.get("MOEGLICH", "0.70"))


def sammle(wurzel, aus=()):
    out = []
    for p in sorted(wurzel.rglob("*")):
        if not p.is_file() or p.suffix.lower() not in ARTEN:
            continue
        if any(t in aus for t in p.relative_to(wurzel).parts):
            continue
        out.append(p)
    return out


def sobel(g):
    gx = np.zeros_like(g); gy = np.zeros_like(g)
    gx[:, 1:-1] = g[:, 2:] - g[:, :-2]
    gy[1:-1, :] = g[2:, :] - g[:-2, :]
    return np.hypot(gx, gy)


def norm(v):
    v = v - v.mean()
    s = v.std()
    return v / s if s > 1e-6 else v


MASSE = {}


def beschreibe(pfad):
    """Liefert (maske, grau, kanten) je N x N, auf den Inhalt zugeschnitten."""
    try:
        im = Image.open(pfad).convert("RGBA")
    except Exception:
        return None
    MASSE[str(pfad)] = list(im.size)
    a = np.asarray(im, dtype=np.float32) / 255.0
    alpha = a[..., 3]
    # Inhalt: bei freigestellten Bildern das Alpha, sonst das ganze Bild.
    if alpha.min() < 0.98:
        maske = alpha > 0.06
    else:
        maske = np.ones(alpha.shape, dtype=bool)
    if not maske.any():
        return None
    ys, xs = np.where(maske)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    zu = im.crop((int(x0), int(y0), int(x1), int(y1))).resize((N, N), Image.LANCZOS)
    b = np.asarray(zu, dtype=np.float32) / 255.0
    al = b[..., 3]
    grau = (0.299 * b[..., 0] + 0.587 * b[..., 1] + 0.114 * b[..., 2]) * al
    return al > 0.5, norm(grau.ravel()), norm(sobel(grau).ravel())


def wert(x, y):
    mx, gx, kx = x
    my, gy, ky = y
    schnitt = np.logical_and(mx, my).sum()
    ver = np.logical_or(mx, my).sum()
    sil = schnitt / ver if ver else 0.0
    hell = abs(float(np.dot(gx, gy)) / len(gx))
    kant = float(np.dot(kx, ky)) / len(kx)
    kant = max(kant, 0.0)
    return 0.30 * sil + 0.25 * hell + 0.45 * kant


def main():
    spiel = sammle(SPIEL, aus={"audio", "klang"})
    orig = sammle(ARCHIV)
    print(f"Spielfassungen: {len(spiel)}   Originale: {len(orig)}", file=sys.stderr)

    bo = []
    for p in orig:
        d = beschreibe(p)
        if d:
            bo.append((p, d))
    MO = np.array([d[0].ravel() for _, d in bo])
    GO = np.array([d[1] for _, d in bo])
    KO = np.array([d[2] for _, d in bo])
    n = GO.shape[1]

    treffer, ohne, unlesbar = {}, [], []
    unsicher = 0
    for p in spiel:
        rel = str(p.relative_to(SPIEL))
        d = beschreibe(p)
        if d is None:
            unlesbar.append(rel); continue
        m, g, k = d
        mv = m.ravel()
        schnitt = (MO & mv).sum(axis=1)
        ver = (MO | mv).sum(axis=1)
        sil = np.where(ver > 0, schnitt / np.maximum(ver, 1), 0.0)
        hell = np.abs(GO @ g) / n
        kant = np.maximum(KO @ k, 0.0) / n
        w = 0.30 * sil + 0.25 * hell + 0.45 * kant
        i = int(np.argmax(w))
        zweit = float(np.partition(w, -2)[-2]) if len(w) > 1 else 0.0
        if w[i] >= MOEGLICH:
            mSpiel = MASSE.get(str(p), [0, 0])
            mOrig = MASSE.get(str(bo[i][0]), [0, 0])
            # HOCHAUFLOESEND ODER NUR VORHANDEN? Nicht jedes Original ist
            # eines: hetzer.png etwa misst 640x800 - genau so gross wie die
            # Spielfassung. Es liegt im Archiv, aber es bringt nichts zurueck.
            # Ein Original zaehlt, wenn es mindestens so gross ist wie die
            # Spielfassung - dann ist es verlustfreies PNG statt WebP und
            # traegt jede kuenftige Groesse.
            treffer[rel] = {
                "original": str(bo[i][0].relative_to(ARCHIV)),
                "wert": round(float(w[i]), 3),
                "abstand": round(float(w[i]) - zweit, 3),
                "sicher": bool(w[i] >= SICHER),
                "mass": mOrig,
                "massSpiel": mSpiel,
                    "hq": bool(max(mOrig) >= 0.98 * max(max(mSpiel), 1)),
                "kante": max(mOrig),
            }
            if w[i] < SICHER:
                unsicher += 1
        else:
            ohne.append({"datei": rel, "bester": round(float(w[i]), 3)})

    # HANDZUORDNUNGEN schlagen die Messung. Sie stehen zuletzt, damit sie
    # auch einen Fehlgriff des Verfahrens ueberschreiben.
    hand = {}
    if HAND.exists():
        hand = json.loads(HAND.read_text(encoding="utf-8")).get("zuordnung", {})
    for rel, ziel in hand.items():
        if not (ARCHIV / ziel).exists():
            print(f"  ! Handzuordnung zeigt ins Leere: {ziel}", file=sys.stderr); continue
        mS = MASSE.get(str(SPIEL / rel), [0, 0])
        mO = MASSE.get(str(ARCHIV / ziel)) or list(Image.open(ARCHIV / ziel).size)
        treffer[rel] = {"original": ziel, "wert": None, "abstand": None, "sicher": True,
                        "mass": mO, "massSpiel": mS,
                        "hq": bool(max(mO) >= 0.98 * max(max(mS), 1)),
                        "kante": max(mO), "quelle": "hand"}
        ohne = [o for o in ohne if o["datei"] != rel]
    unsicher = sum(1 for v in treffer.values() if not v["sicher"])

    ZIEL.write_text(json.dumps({
        "stand": "2026-08-05",
        "verfahren": "Silhouette 30 % · Helligkeit 25 % · Kanten 45 %, auf Inhalt zugeschnitten, 64x64",
        "schwellen": {"sicher": SICHER, "moeglich": MOEGLICH},
        "vonHand": len(hand),
        "gesamt": len(spiel),
        "sicher": len(treffer) - unsicher,
        "moeglich": unsicher,
        "ohneOriginal": len(ohne),
        "treffer": treffer,
        "ohne": ohne,
        "unlesbar": unlesbar,
    }, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"zuordnung: {len(treffer) - unsicher} sicher, {unsicher} moeglich, "
          f"{len(ohne)} ohne Original → {ZIEL.relative_to(WURZEL)}", file=sys.stderr)


if __name__ == "__main__":
    main()
