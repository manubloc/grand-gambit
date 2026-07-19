# Fehlerberichte im Admin-Bereich

Absturz- und Fehlerberichte werden NICHT per E-Mail verschickt, sondern in der
bestehenden Online-Halle (dein Cloudflare-Worker `gg-hall`) gesammelt. Der
Admin liest sie direkt in der App unter Profil -> Fehlerberichte.

Kein Supabase noetig, keine neue Infrastruktur - es laeuft ueber den Worker,
den du fuer den Online-Modus ohnehin schon betreibst.

## Einmalig einrichten (2 Schritte)

1. Neuen Worker mit den Report-Endpunkten deployen:
   ```
   cd worker
   npx wrangler deploy
   ```

2. Ein Lese-Token (Admin-Geheimnis) setzen - mindestens 24 Zeichen:
   ```
   npx wrangler secret put ADMIN_TOKEN
   ```
   (Falls du fuer den Online-Modus schon ein ADMIN_TOKEN gesetzt hast, wird
   dasselbe verwendet - dann entfaellt dieser Schritt.)

## Nutzung

- Berichte einreichen passiert automatisch: stuerzt die App ab, wird der
  Fehler an `POST /report` gesendet (offen, jeder Nutzer, anonym).
- Als Admin: in der App unter Profil -> Fehlerberichte einmal das ADMIN_TOKEN
  eintragen und Merken. Danach zeigt die Liste die Berichte ALLER Nutzer
  (aus der Halle). Das Token bleibt nur auf deinem Geraet.

## Endpunkte (im Worker)

- `POST /report`  - Bericht einreichen (JSON), offen mit CORS
- `GET  /reports?token=<ADMIN_TOKEN>&limit=100` - Berichte lesen (nur Admin)

Die Halle behaelt die neuesten 500 Berichte.
