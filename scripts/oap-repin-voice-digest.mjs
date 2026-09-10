import { createHash } from 'node:crypto';
import fs from 'node:fs';

const src = fs.readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
const start = src.indexOf('const GEV_REALTIME_TOOLS = [');
const end = src.indexOf('\n];\n', start);
const literal = src.slice(start + 'const GEV_REALTIME_TOOLS = '.length, end + 2);
const tools = (0, eval)(`(${literal})`);
const TOUCHED = new Set([
  'set_context_mode',
  'control_cockpit',
  'set_panel_open',
  'get_current_view_state',
  'fly_to_location',
  'select_nearest_aircraft',
  'set_map_stack',
]);
const unchanged = tools
  .filter((tool) => !TOUCHED.has(tool.name))
  .sort((a, b) => a.name.localeCompare(b.name));
const digest = createHash('sha256')
  .update(JSON.stringify(unchanged))
  .digest('hex')
  .slice(0, 16);
console.log(JSON.stringify({ unchanged: unchanged.length, digest }, null, 2));
