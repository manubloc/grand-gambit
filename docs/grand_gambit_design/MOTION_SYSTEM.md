# Motion-System

Tokens: `T.mo` — press 120ms · fast 160ms · norm 220ms · slow 280ms · fill 450ms · pop 180ms · sheen 11s (Zyklus; sichtbarer Lauf ≈ 1,2s, Rest Pause — erfüllt „900–1300ms Lauf, 6–10s Abstand") · ambient 5,5s · ease/easeOut-Kurven.

Regeln (erzwungen bzw. verdrahtet):
1. Glanzlauf (`ggShine`) nur auf aktiven Gold-CTAs; gestaffelte Slots via `useShineDelay` verhindern Chorlauf. Disabled = kein Sheen (GoldShineButton).
2. `prefers-reduced-motion: reduce` → alle Animationen/Übergänge ≈ 0ms (GLOBAL_CSS). Zustands-Feedback bleibt, Bewegung ruht.
3. Auswahlwechsel/Fokus: violett, ≤ norm. Fortschritt: fill mit ease. Kein Dauerpuls auf Listen.
4. Bestand erhalten: ggPlateSheen (einmalig bei Tipp), ggFunkenlauf (neue Ware), Board-Zoom — unangetastet.
