# Open Anomaly Protocol — V0.1

Transport-neutral specification. MCP is an adapter, not the protocol.

## Identifiers

- Events: `AE-<ulid-or-uuid>`
- Observations: `OB-<uuid>`
- Evidence: `EV-<uuid>`
- Hypotheses: `HY-<uuid>`
- Investigations: `IN-<uuid>`
- Agents: `AG-<uuid>`

Timestamps are ISO-8601 UTC. Local timestamps may be stored alongside as metadata.

## Geospatial

```json
{
  "latitude": 46.7867,
  "longitude": -92.1005,
  "altitude_m": null,
  "accuracy_m": 12.5,
  "uncertainty_radius_m": 1000,
  "precision": "approximate"
}
```

`precision`: `exact` | `approximate` | `region` | `unknown`

Public responses SHOULD apply privacy fuzzing for observer locations unless the observer explicitly opts into exact public coordinates.

## Uncertainty

Numeric fields that are estimates include:

```json
{ "value": 31.2, "units": "deg", "confidence": 0.4, "source": "deviceorientation" }
```

Missing device capability ⇒ omit the field. Never invent values.

## Core resources

### AnomalyEvent

| Field | Type | Notes |
|-------|------|-------|
| id | string | stable |
| title | string | |
| category | enum | aerial, orbital, astronomical, atmospheric, maritime, geological, infrastructure, electromagnetic, optical, unknown |
| subcategory | string? | |
| tags | string[] | free-form + morphology tags |
| observed_morphology | string[] | appearance only — not mechanism |
| latitude / longitude | number | |
| altitude_m | number? | |
| location_accuracy_m | number? | |
| location_uncertainty_radius_m | number? | |
| start_time / end_time | datetime? | |
| time_precision | enum | exact, minute, hour, day, unknown |
| reported_at | datetime | |
| description | string | |
| summary | string? | |
| status | EventStatus | |
| is_live | boolean | happening-now intent |
| is_historical | boolean | |
| source_links | SourceLink[] | |
| event_confidence | number 0..1 | |
| created_at / updated_at / last_reviewed_at | datetime | |

### EventStatus

`REPORTED` | `REALTIME_OBSERVED` | `CORROBORATED` | `UNDER_INVESTIGATION` | `RESOLVED` | `UNRESOLVED` | `DISPUTED` | `INSUFFICIENT_EVIDENCE` | `INVALID`

Resolved events are never deleted.

### Observation

Measurement + optional media reference + sensor package + time + location + observer provenance + event relationship.

Media is a reference (`media_url`, `platform`, …), not default blob storage in V0.1.

### EvidenceItem

Typed finding with provenance (`type`, `source`, `source_url`, `confidence`, `raw_claim`, `normalized_finding`, `agent_id?`, `submitter_id?`).

### Hypothesis

Proposed explanation separate from morphology. Prefer mundane hypotheses first. `unresolved` / `insufficient_evidence` allowed.

### Investigation

Structured check log with explicit `UNKNOWN` / `INSUFFICIENT_EVIDENCE` conclusions. Challenges append; they do not silently overwrite.

### AlertSubscription

Radius, categories, morphologies, verification flags, Web Push endpoint binding.

### AgentProfile / ProviderCredential

Separated. Credential APIs return only `{ provider, connected, credential_id, display_hint }` after storage.

## API surface (V0.1)

```text
GET    /oap/v1/events
POST   /oap/v1/events
GET    /oap/v1/events/:id
PATCH  /oap/v1/events/:id
GET    /oap/v1/events/:id/observations
POST   /oap/v1/events/:id/observations
GET    /oap/v1/events/:id/evidence
POST   /oap/v1/events/:id/evidence
GET    /oap/v1/events/:id/hypotheses
POST   /oap/v1/events/:id/hypotheses
POST   /oap/v1/events/:id/investigations
GET    /oap/v1/subscriptions
PUT    /oap/v1/subscriptions
GET    /oap/v1/agents
POST   /oap/v1/agents
POST   /oap/v1/credentials
DELETE /oap/v1/credentials/:id
```

Permissions: anonymous read of public events; authenticated write; agent tokens scoped.

## Consensus principle

Independent evidence sources outweigh number of agreeing agents. Track provider/model/source dependencies to avoid fake independence.
