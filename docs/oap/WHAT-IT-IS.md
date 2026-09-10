# What the Open Anomaly Project is (and is not)

This document is for anyone discovering OAP as a public fork/extension of [God's Eye View](https://github.com/bilawalsidhu/gods-eye-view).

## What it is

**Open Anomaly Project (OAP)** is a free, open-source, citizen-science network for:

- reporting unusual real-world events
- collecting structured observations (including phone sensor metadata when permitted)
- attaching evidence and source links (reference-first; not a video host by default)
- proposing and challenging explanations
- keeping resolved / unresolved / insufficient-evidence outcomes in a permanent public record
- optionally connecting AI agents later via the **Open Anomaly Protocol**

It runs on a God's Eye View geospatial substrate: a live globe with aircraft, satellites, launches, weather-adjacent feeds, cameras, and other public layers used as **context**, not as proof of exotic conclusions.

## What it is for

Make unusual observations:

**easier to capture, harder to fake, easier to correlate, easier to investigate, and harder to lose.**

It is for:

- curious members of the public
- skywatchers and field observers
- researchers who want provenance-preserving case files
- developers who want an open protocol and globe layer to extend
- optional agent builders (MCP / API) who accept that AI is not required

## What it is not

OAP is **not**:

- an “aliens confirmed” app
- a paranormal belief network
- a civilian surveillance system for tracking people
- a classified / military intelligence product
- a mandatory-AI product
- a global video hosting service (V0.x stores media references/metadata by default)
- a claim that unresolved events are extraterrestrial, supernatural, or interdimensional

**Unresolved** only means: available evidence is insufficient for a confident explanation.

## What God's Eye View still is

God's Eye View remains primarily:

- world visualization
- live public geospatial data interface
- context for investigations

OAP adds the anomaly lifecycle: events, observations, evidence, hypotheses, alerts, accounts, protocol, and agent hooks.

Upstream GEV code is MIT; **third-party datasets keep their own licenses** (see root `DATA_SOURCES.md`). MIT on the repo does not mean every live feed is MIT.

## What it could become (with community)

With the right contributors, OAP could grow into:

- a distributed human + sensor observation network
- real-time nearby verification during live events
- multi-observer geometry / triangulation with honest uncertainty
- richer EvidenceCone correlations against public feeds
- open research exports and resolved-case libraries
- optional specialist agents that investigate without replacing human judgment
- free installable mobile clients so phones are one tap away when something is happening

None of that requires abandoning the core rule: **evidence over spectacle; independent sources over agent vote-counting.**

## Mobile access

Near-term:

1. **Installable PWA** (home-screen web app) — already the V0.1 path
2. **Free native shells** (planned) wrapping the same web client — e.g. Android/iOS store listings or sideloadable wrappers — so people can open OAP instantly during live events without hunting for a URL

Native shells should remain free. They are distribution convenience, not a paid science tier.

## Licensing & contribution

- OAP original work: MIT (same as this repository unless a file says otherwise)
- Preserve attribution for God's Eye View and all third-party data terms
- Prefer extending layer/manager patterns over rewrites
- Keep the product usable with zero AI

See `docs/oap/CONTRIBUTING.md`, `docs/oap/ROADMAP.md`, and `docs/oap/VISION.md`.

## Maintainer intent

This project is intentionally scoped as a **function built for God's Eye**: anomaly reporting and investigation on top of the globe. Other personal projects may connect later, but OAP is meant to stand alone as a public open-source effort the community can fork, improve, and operate.
