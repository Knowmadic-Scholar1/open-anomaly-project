#!/usr/bin/env node
/**
 * Open Anomaly Protocol — MCP adapter skeleton (V0.1).
 * Transport adapter only: does not embed vendor-specific agent logic.
 *
 * Usage (later): register these tools with an MCP host pointed at a live OAP API.
 * This skeleton documents the tool surface and refuses to operate without a base URL.
 */

const TOOLS = [
  { name: 'oap.list_active_events', description: 'List live or recently active anomaly events.' },
  { name: 'oap.get_event', description: 'Fetch one AnomalyEvent by id.' },
  { name: 'oap.search_events', description: 'Search events by time, place, category, status.' },
  { name: 'oap.get_observations', description: 'List observations for an event.' },
  { name: 'oap.get_evidence', description: 'List evidence items for an event.' },
  { name: 'oap.get_nearby_evidence', description: 'EvidenceCone-style nearby public context summary.' },
  { name: 'oap.submit_investigation', description: 'Submit an investigation record.' },
  { name: 'oap.submit_evidence', description: 'Submit an evidence item.' },
  { name: 'oap.add_hypothesis', description: 'Add a hypothesis (mechanism, not morphology).' },
  { name: 'oap.challenge_hypothesis', description: 'Challenge an existing hypothesis without erasing it.' },
  { name: 'oap.subscribe_to_alerts', description: 'Create or update an alert subscription.' },
  { name: 'oap.request_observation', description: 'Request nearby human verification.' },
];

export function listOapMcpTools() {
  return TOOLS.slice();
}

export async function callOapMcpTool(name, args = {}, { baseUrl, token } = {}) {
  if (!baseUrl) {
    return {
      ok: false,
      error: 'OAP_API_BASE_URL required. MCP is an adapter to OAP, not a substitute for the protocol API.',
    };
  }
  const tool = TOOLS.find((entry) => entry.name === name);
  if (!tool) return { ok: false, error: `Unknown tool: ${name}` };

  // Skeleton: map tool names to REST paths without performing network I/O unless fetch exists.
  const path = ({
    'oap.list_active_events': '/oap/v1/events?is_live=true',
    'oap.get_event': `/oap/v1/events/${encodeURIComponent(args.id || '')}`,
    'oap.search_events': '/oap/v1/events',
    'oap.get_observations': `/oap/v1/events/${encodeURIComponent(args.event_id || '')}/observations`,
    'oap.get_evidence': `/oap/v1/events/${encodeURIComponent(args.event_id || '')}/evidence`,
  })[name];

  if (!path) {
    return {
      ok: false,
      error: `Tool ${name} is declared but not implemented in the V0.1 skeleton.`,
      args,
    };
  }

  if (typeof fetch !== 'function') {
    return { ok: false, error: 'fetch unavailable in this runtime', path };
  }

  const response = await fetch(new URL(path, baseUrl), {
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const body = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, body };
}

if (import.meta.url === `file://${process.argv[1]?.replaceAll('\\', '/')}` || process.argv[1]?.endsWith('oap-server.mjs')) {
  console.log(JSON.stringify({ tools: listOapMcpTools() }, null, 2));
}
