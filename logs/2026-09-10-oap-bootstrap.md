# OAP bootstrap log — 2026-09-10

## Actions
- Cloned `bilawalsidhu/gods-eye-view` into `C:\Users\earno\Projects\open-anomaly-project`
- Renamed remote `origin` → `upstream` (GEV); created public GitHub repo under Knowmadic-Scholar1
- Branch `feature/oap-v0.1` is the published default branch
- Adopted user-authored `docs/Open_Anomaly_Project.md` as canonical public vision; short pages point to it
- Dedicated OAP Supabase project connected (`jbincispockpmrxtygpv`); migrations `oap_v01` + `oap_v01_rls_hardening` applied
- Seed events inserted (Starlink, Falcon vent, Austin live demo)
- Browser cloud client: `src/oap/supabaseClient.js` + `src/oap/cloud.js`; hydrate on boot; magic-link Account UI
- `npm run test:oap` — 11/11 pass (Node-safe `import.meta.env` guard)

## Deferred (leave alone for V0.1)
- PostGIS advisor noise on `public.spatial_ref_sys` / `st_estimatedextent` — documented in `docs/oap/SUPABASE.md` and `docs/oap/SECURITY.md`

## Still needed from owner
- Enable **Email** (magic link) in Supabase Auth → Providers for cloud publish
- Confirm local `.env` has `VITE_OAP_SUPABASE_URL` + `VITE_OAP_SUPABASE_ANON_KEY` (gitignored)
- Optional later: Web Push, Capacitor shells, hypothesis/evidence cloud sync, geography columns on observations

## Public URLs
- https://github.com/Knowmadic-Scholar1/open-anomaly-project
- Vision: docs/Open_Anomaly_Project.md on that branch
- Supabase: https://jbincispockpmrxtygpv.supabase.co
