# Open Anomaly Project — Architecture

Updated: 2026-09-10

## 1. Inspection summary (God's Eye View)

Upstream: [bilawalsidhu/gods-eye-view](https://github.com/bilawalsidhu/gods-eye-view) (MIT code; third-party datasets retain their own terms).

| Area | What exists | Reuse for OAP |
|------|-------------|----------------|
| Globe | CesiumJS Viewer, map stacks (Google 3D / Esri / Bing / OSM), render governor | Keep as visualization host |
| Layers | `DataLayerManager` + per-layer modules (`src/data/*`) with `init/enable/disable/update/getStats` | Add `oap-anomalies` as a peer layer |
| Layer UI | Auto-built toggle rows via `buildTogglePanel` | Anomaly layer appears in DATA toggles automatically |
| Overlays | `worldOverlay.js` ambient labels | Optional labels for high-priority anomalies |
| Live context | Flights, military ADS-B, AIS, satellites, launches, quakes, FIRMS, traffic, CCTV, radio, weather | Query as **EvidenceCone** inputs — store summaries, not whole feeds |
| Backend | Vite middleware proxies only (`vite.config.js`) — key broker, no durable DB | Keep for live proxying; **do not** put OAP persistence here |
| Auth / users | None | Add separately (Supabase Auth recommended) |
| PWA | None (no service worker / web manifest) | Add OAP installability incrementally |
| Device sensors | Not used | New `src/oap/sensors.js` |
| Aesthetic | Spy / cockpit / military HUD language | Soften OAP surfaces; leave GEV globe chrome for now |
| Stack | Vanilla JS (ES modules) + Vite 6 + Cesium 1.124 | **Extend in vanilla JS for V0.1** — avoid React rewrite |

### Reusable abstractions

1. **Layer module contract** — best integration seam for globe markers.
2. **Share / layer-state codec** (`layerState.js`) — add `oap-anomalies` token so views are shareable.
3. **Server-side key brokering pattern** (`SECURITY.md`) — mirror for agent provider credentials later.
4. **Data attribution system** (`dataCredits.js` + `DATA_SOURCES.md`) — extend for OAP sources.
5. **Analyst records seam** (`getAnalystRecords`) — optional later for agent queries over anomalies.
6. **EvidenceCone context** — call existing `/api/opensky`, `/api/launches`, `/api/firms`, etc., only inside event windows.

### Conflicts with the OAP master spec

| Spec expectation | GEV reality | V0.1 resolution |
|------------------|-------------|-----------------|
| Accounts, events DB, PostGIS | No database | Dedicated Postgres/PostGIS (Supabase) + local seed fallback |
| React / TS PWA | Vanilla JS SPA | Keep vanilla; PWA shell later; TS reserved for protocol docs / future packages |
| Scientific neutral tone | Military cockpit aesthetic | OAP panels use neutral language; do not rewrite GEV chrome in V0.1 |
| Media hosting | N/A | Reference-only `media_url` |
| Always-on production API | Dev Vite server is a key broker, localhost-first | Separate OAP API surface; do not expose GEV proxies as public OAP |
| OpenSky / some feeds non-commercial | Live layers inherit those terms | Document in `LICENSING.md`; OAP events remain independent of restricted feeds |

### Browser / PWA / device API limitations

| Capability | Support notes | OAP handling |
|------------|---------------|--------------|
| Camera | `getUserMedia` requires secure context + permission; iOS Safari quirks | Observation flow offers camera when available; never invent frames |
| Geolocation | Requires permission; desktop often coarse / denied | Approximate location + map pick; store accuracy |
| Device orientation | iOS 13+ needs `DeviceOrientationEvent.requestPermission()` user gesture | Prompt only on Observe; degrade to manual azimuth |
| Accelerometer / gyro / magnetometer | Generic Sensor API limited; often permissioned; Firefox gaps | Capture when present; omit when absent |
| Barometer | Rare in browsers | Optional field only |
| Web Push | Needs service worker + VAPID; iOS requires installed PWA (16.4+) | Foundation in V0.1; full delivery after SW |
| PWA install | Needs manifest + SW + HTTPS | Add manifest early; SW incrementally |
| Background sensors | Not available for arbitrary web apps | Foreground observation only |

### Backend recommendation

**Use a dedicated Supabase (Postgres + PostGIS + Auth + RLS) project for OAP.**

Reasons:

- GEV has no durable store; stuffing events into Vite middleware is a dead end.
- PostGIS matches radius / proximity / clustering needs.
- Auth + RLS matches anonymous browse vs authenticated write.
- Edge Functions can later vault provider credentials server-side.

**Do not** apply OAP migrations to the currently connected Supabase project: it already contains UGN marketplace tables (`profiles`, `packages`, `marketplace_listings`, …). Creating a separate OAP project avoids destructive coupling.

**Local fallback for V0.1:** seed JSON + `localStorage` event store so the app stays runnable without cloud credentials.

## 2. Target architecture

```text
REAL WORLD → humans / phones / public data / sensors
                ↓
        Open Anomaly Project (events, observations, evidence)
                ↓
        Open Anomaly Protocol (REST now; WS/webhooks/MCP later)
                ↓
   ┌────────────┼──────────────┐
 Web/PWA     Public API     Agent adapters (MCP/SDK)
   ↓            ↓               ↓
 GEV globe   Developers     Optional AI agents
```

GEV stays the geospatial substrate. OAP owns anomaly domain state.

## 3. V0.1 module layout

```text
src/oap/                 # domain logic + UI flows
src/data/oapAnomalies.js # Cesium layer registered with DataLayerManager
docs/oap/                # vision, protocol, privacy, roadmap
supabase/migrations/     # schema (apply to dedicated OAP project)
mcp/                     # MCP adapter skeleton
public/oap/              # PWA assets
```

## 4. Security boundaries

- Browser never stores provider API secrets in plaintext / localStorage.
- Public responses never return full credentials after storage.
- Observation public coordinates may be fuzzed; exact coords stay private by default.
- GEV proxy keys remain server-side per existing `SECURITY.md`.
