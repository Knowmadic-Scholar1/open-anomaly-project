# Open Anomaly Project (`src/oap`)

Purpose: domain logic and mobile-first UI for the Open Anomaly Project, layered onto God's Eye View.

## Usage

- Store: `import store from './store.js'`
- UI: `initOapUi({ viewer, dataManager, layer })` (wired from `src/main.js`)
- Layer: `src/data/oapAnomalies.js`

## Dependencies

- Cesium (via the host app)
- Browser localStorage for V0.1 persistence fallback
- Optional future Supabase project (schema in `supabase/migrations`)

## Tests

```bash
node --test src/oap/oap.store.test.mjs
```
