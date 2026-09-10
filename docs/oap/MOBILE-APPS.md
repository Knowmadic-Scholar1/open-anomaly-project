# Free mobile access

OAP should be one tap away when something unusual is happening.

## Near-term (V0.1–V0.2)

1. **Progressive Web App** — installable from the browser (`public/oap/manifest.webmanifest`).
2. **Web Push foundation** — nearby live verification when the browser/OS allows it (installed PWA required on iOS).

## Planned free native downloads

Ship **free** Android / iOS clients that wrap the same OAP web app (Capacitor, Trusted Web Activity, or equivalent):

- one codebase for globe + OAP flows
- store / sideload presence for discovery
- deeper push notification reliability than browser-only where needed
- camera / sensors still capability-aware and permissioned

These shells are distribution convenience. They must remain free. No paid science tier.

## What native apps should not become

- a separate proprietary fork of the protocol
- a surveillance product
- a requirement to use AI
- a media-hosting cash sink

See also `WHAT-IT-IS.md` and `MOBILE-OBSERVATION.md`.
