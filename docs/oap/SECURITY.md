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

- Local store has no multi-user auth yet (browser-local demo mode)
- Schema + stubs define the secure credential contract
- Production auth requires a dedicated OAP Supabase project
