# OAP Data Model

PostgreSQL + PostGIS target. V0.1 also runs against an in-browser seed/local store with the same shapes.

## Tables (V0.1)

- `users` / auth.users (Supabase)
- `user_profiles`
- `provider_credentials` (encrypted secret reference only)
- `agent_profiles`
- `notification_preferences`
- `alert_subscriptions`
- `events`
- `event_tags`
- `observations`
- `observation_sensor_data`
- `evidence`
- `hypotheses`
- `investigations`
- `investigation_evidence`
- `event_sources`
- `event_status_history`
- `event_relationships`

## Morphology vs mechanism

- `observed_morphology` — what it looked like (ring, spiral, luminous, …)
- `hypotheses.mechanism` — proposed explanation (aircraft, Starlink, lens flare, unresolved, …)

Never collapse these.

## EvidenceCone (logical)

Not necessarily its own table in V0.1 — can be JSON on an investigation:

```json
{
  "center_lat": 0,
  "center_lon": 0,
  "radius_km": 100,
  "start_time": "...",
  "end_time": "...",
  "queried_sources": ["flights", "satellites", "launches"],
  "results_summary": {}
}
```

Defaults are search bounds, not scientific constants.
