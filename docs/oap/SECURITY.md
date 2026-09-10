# OAP Security

Builds on God's Eye View [`SECURITY.md`](../../SECURITY.md).

## Additional OAP requirements

- Authn/z on write endpoints
- RLS when using Supabase
- Provider credentials: encrypted server-side only; never localStorage; never returned in full after store
- URL allowlisting / validation for media and source links
- Rate limits on report/observe
- Location privacy boundaries enforced in API responses
- No secrets in logs
- MCP / agent tokens scoped and revocable
- XSS hardening on user-supplied descriptions and titles
- CSRF protections for cookie sessions (or bearer-only API)

## V0.1 status

- Dedicated OAP Supabase project is provisioned (`jbincispockpmrxtygpv`)
- Browser uses publishable/anon keys only; service role never ships to the client
- Anonymous users can browse public events; writes require auth (RLS)
- Local seed + localStorage remain the offline fallback
- PostGIS `spatial_ref_sys` linter noise is **deferred** — see `SUPABASE.md` (leave alone for now; do not lock OAP domain tables)
