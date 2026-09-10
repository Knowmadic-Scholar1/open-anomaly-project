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
- `oap_v01_rls_hardening` — public-read policies for the investigation graph; revoke attempts on PostGIS catalog helpers

## Deferred: PostGIS system-table advisory

Supabase security advisors may still flag `public.spatial_ref_sys` (RLS disabled) and related `st_estimatedextent` SECURITY DEFINER functions. These are **PostGIS internals**, not OAP domain tables.

**Decision (2026-09-10):** leave them alone for V0.1.

- Pros of leaving alone: no risk of breaking geospatial queries; OAP public/authenticated API for events stays unchanged.
- Cons: linter noise; catalog/RPC endpoints remain technically exposed even if unused.
- Optional later: `ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;` (no policies = block PostgREST access to that catalog only). Do **not** apply lock-everything hardening to OAP tables.

## Auth

Enable **Email** (magic link) in Authentication → Providers so the in-app Account panel can publish events to the cloud. Anonymous users can still browse public events.
