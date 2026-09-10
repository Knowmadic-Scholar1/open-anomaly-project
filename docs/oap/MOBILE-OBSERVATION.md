# Mobile Observation

Phones are voluntary scientific instruments.

## Live verification request (conceptual)

```text
Possible aerial anomaly · 7.4 km SW · first reported 3 min ago · 4 reports
[OBSERVE] [VIEW EVENT] [DISMISS]
```

## Guided observe

Rough azimuth / elevation hints when geometry allows. Capture only what the device provides after explicit permission.

Each measurement: `{ value, units, measured_at?, source, accuracy? }`.

## Capability-aware fallback

If orientation / GPS / camera is unavailable, continue with manual description + optional media URL. Never fabricate sensor rows.
