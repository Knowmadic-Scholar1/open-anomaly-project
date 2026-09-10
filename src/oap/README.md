# Open Anomaly Project (`src/oap`)

Purpose: domain logic and mobile-first UI for the Open Anomaly Project, layered onto God's Eye View.

## Usage

- Store: `import store from './store.js'`
- Cloud: `store.hydrateFromCloud()` / `store.createEventAsync(...)` when `.env` has `VITE_OAP_SUPABASE_*`
- UI: `initOapUi({ viewer, dataManager, layer })` (wired from `src/main.js`)
- Layer: `src/data/oapAnomalies.js`

## Dependencies

- Cesium (via the host app)
- `@supabase/supabase-js` for optional cloud persistence
- Browser localStorage for offline fallback

## Tests

```bash
node --test src/oap/oap.store.test.mjs
```
