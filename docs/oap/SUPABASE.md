# Dedicated OAP Supabase project

Project ref: `jbincispockpmrxtygpv`  
API URL: `https://jbincispockpmrxtygpv.supabase.co`

Do **not** put OAP tables in unrelated shared databases.

## Local setup

1. Copy `.env.example` → `.env` (or keep existing `.env`)
2. Set:
   - `VITE_OAP_SUPABASE_URL`
   - `VITE_OAP_SUPABASE_ANON_KEY` (legacy JWT anon key — preferred for `@supabase/supabase-js`)
   - `VITE_OAP_SUPABASE_PUBLISHABLE_KEY` (new publishable key)
3. Never commit `.env` or `service_role` keys

## Applied migrations (remote)

- `oap_v01` — core tables + PostGIS + initial RLS
- `oap_v01_rls_hardening` — public-read policies for the investigation graph; revoke PostgREST access to `spatial_ref_sys` / `st_estimatedextent`

## CLI (optional)

```bash
supabase login
supabase link --project-ref jbincispockpmrxtygpv
supabase db push
```

## Auth (V0.2)

Enable Email magic link and optional Google/GitHub providers in Authentication → Providers.
