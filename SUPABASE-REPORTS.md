# Fehlerberichte im Admin-Bereich (Supabase)

Die App sammelt Absturz- und Fehlerberichte automatisch. Ohne Cloud landen sie
nur lokal auf dem jeweiligen Geraet (im Admin-Profil unter "Fehlerberichte"
sichtbar). Mit Supabase siehst du die Berichte ALLER Geraete zentral.

## Tabelle anlegen (SQL-Editor in Supabase)

```sql
create table error_reports (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  version text, ua text, url text, kind text,
  message text, stack text, account text, note text, log jsonb
);
alter table error_reports enable row level security;

-- jeder darf einen Bericht einreichen (auch Gaeste, anonym)
create policy "anyone can file" on error_reports
  for insert with check (true);

-- nur Admins duerfen lesen (deine Admin-Mails eintragen)
create policy "admins can read" on error_reports
  for select using (
    auth.jwt() ->> 'email' in ('deine-admin@mail.tld')
  );
```

Passe die Admin-Mail(s) in der SELECT-Policy an deine `ADMIN_EMAILS` an.
