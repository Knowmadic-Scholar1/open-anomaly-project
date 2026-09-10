# Agent Integration

AI agents are optional enhancements.

## Concepts

- `ProviderCredential` — encrypted secret reference for a model/API provider
- `AgentProfile` — named agent config that may point at a credential and/or custom endpoint

Know1 is one compatible agent, not a requirement.

## Connect paths (later)

MCP · OAuth · API key · webhook · service token

## MCP tool sketch

```text
oap.list_active_events
oap.get_event
oap.search_events
oap.get_observations
oap.get_evidence
oap.get_nearby_evidence
oap.submit_investigation
oap.submit_evidence
oap.add_hypothesis
oap.challenge_hypothesis
oap.subscribe_to_alerts
oap.request_observation
```

See `mcp/oap-server.mjs` for the V0.1 skeleton.
