# Open Anomaly Project — Roadmap

## V0.1 (current) — usable citizen-science MVP

Smallest clean slice that still feels capable:

1. Inspect GEV and document integration (done in `ARCHITECTURE.md`)
2. OAP docs + protocol draft
3. Data model + seed historical/live demo events
4. Local event store (seed + localStorage) with Supabase schema ready
5. `oap-anomalies` globe layer + event detail panel
6. Report anomaly flow (category, now/historical, location, morphology, media URL)
7. Observation flow with capability-aware sensor capture
8. Evidence + hypothesis + status transitions (manual)
9. Alert subscription preferences UI + Web Push foundation stubs
10. AgentProfile + ProviderCredential models (schema + non-exposing API stubs)
11. OAP Protocol v0.1 + MCP adapter skeleton
12. Tests for store, privacy fuzzing, status transitions, credential non-exposure

**Explicitly deferred:** triangulation, native apps, reputation, media hosting, autonomous agents, ML forensics, global continuous detection.

## V0.2 — cloud persistence + alerts + free mobile reach

- Dedicated Supabase project with RLS
- Auth (magic link / OAuth)
- Web Push delivery for nearby live events
- Duplicate / merge heuristics (distance + time)
- EvidenceCone queries against GEV proxies (summaries only)
- Free installable mobile clients (PWA + store-listed native shells wrapping the same web app) so observers can open OAP in one tap during live events

## V0.3 — agent interoperability

- Encrypted provider credential vault
- CONNECT AGENT UX
- MCP tools backed by live OAP API
- Investigation challenge threads

## Later

- Triangulation with explicit uncertainty
- Pattern discovery with bias correction
- Resolved-event reference library UX
- Native shells if PWA limits block sensors/push
