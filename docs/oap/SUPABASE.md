# Dedicated OAP Supabase project

Do **not** put OAP tables in unrelated shared databases (e.g. UGN marketplace).

## Create

1. https://supabase.com/dashboard → New project → name `open-anomaly-project`
2. Region close to your users (e.g. `us-east-1`)
3. Save the database password in a password manager
4. Database → Extensions → enable **postgis** (migration also attempts `create extension`)
5. Apply `supabase/migrations/20260910_oap_v01.sql` (SQL editor or CLI)
6. Copy Project URL + `anon` key into `.env` as:
   - `VITE_OAP_SUPABASE_URL`
   - `VITE_OAP_SUPABASE_ANON_KEY`
7. Never expose the `service_role` key to the browser

## CLI (after `supabase login`)

```bash
supabase link --project-ref <PROJECT_REF>
supabase db push
```

## Auth (V0.2)

Enable Email magic link and optional Google/GitHub providers in Authentication → Providers.
