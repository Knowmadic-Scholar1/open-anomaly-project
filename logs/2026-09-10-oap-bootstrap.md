# OAP bootstrap log — 2026-09-10

## Actions
- Cloned `bilawalsidhu/gods-eye-view` into `C:\Users\earno\Projects\open-anomaly-project`
- Moved agent workspace root to this project
- Created branch `feature/oap-v0.1`
- Inspected GEV architecture (vanilla JS + Cesium + Vite middleware proxies; no auth DB)
- Confirmed connected Supabase MCP project already hosts UGN marketplace tables — will NOT apply OAP migrations there without owner approval
- Wrote OAP docs under `docs/oap/`
- Implemented V0.1 local store, anomaly layer, mobile UI flows, seed events, MCP skeleton, Supabase migration draft, PWA manifest
- Added `src/oap/oap.store.test.mjs` (10 passing)
- Re-pinned voice tool schema digests after adding `oap-anomalies` to layer enums

## Decisions pending owner input
- Dedicated Supabase project for OAP (recommended) vs reuse of existing project
- Credential encryption vault choice for provider secrets (Supabase Vault / pgsodium / external KMS)
- Whether to publish a separate GitHub remote (currently still points at upstream gods-eye-view origin)
