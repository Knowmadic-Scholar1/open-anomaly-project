/**
 * OAP V0.1 unit tests — store, privacy, credentials non-exposure.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { createOapStore } from './store.js';
import { fuzzCoordinates, toPublicObservation } from './privacy.js';
import { detectSensorCapabilities } from './sensors.js';
import { EVENT_STATUSES } from './constants.js';
import { listOapMcpTools } from '../../mcp/oap-server.mjs';

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => { map.set(key, String(value)); },
    removeItem: (key) => { map.delete(key); },
  };
}

test('seed events are browsable anonymously', () => {
  globalThis.localStorage = memoryStorage();
  const store = createOapStore();
  const events = store.listEvents();
  assert.ok(events.length >= 3);
  assert.ok(events.some((event) => event.status === 'RESOLVED'));
  assert.ok(events.some((event) => event.is_live === true));
});

test('event creation and status transitions', () => {
  globalThis.localStorage = memoryStorage();
  const store = createOapStore({ seed: [] });
  const created = store.createEvent({
    title: 'Test light',
    category: 'aerial',
    latitude: 40.0,
    longitude: -90.0,
    description: 'test',
    is_live: true,
  });
  assert.match(created.id, /^AE-/);
  assert.equal(created.status, 'REPORTED');
  const updated = store.updateEventStatus(created.id, 'UNDER_INVESTIGATION', 'manual');
  assert.equal(updated.status, 'UNDER_INVESTIGATION');
  assert.ok(EVENT_STATUSES.includes(updated.status));
  const resolved = store.updateEventStatus(created.id, 'RESOLVED', 'balloon');
  assert.equal(resolved.status, 'RESOLVED');
  assert.ok(store.getEvent(created.id), 'resolved events remain queryable');
});

test('observation creation fuzzes public location', () => {
  globalThis.localStorage = memoryStorage();
  const store = createOapStore({ seed: [] });
  const created = store.createEvent({
    title: 'Obs test',
    category: 'aerial',
    latitude: 46.781293,
    longitude: -92.104438,
    description: 'x',
  });
  const { observation } = store.addObservation(created.id, {
    visibility: 'yes',
    description: 'same object',
    latitude: 46.781293,
    longitude: -92.104438,
    privacy_radius_m: 1000,
  });
  assert.equal(observation.location_precision, 'approximate');
  assert.match(observation.location_note, /approximate area/i);
  assert.notEqual(observation.latitude, 46.781293);
  assert.equal(observation.internal_latitude, undefined);
});

test('fuzzCoordinates produces finite approximate points', () => {
  const fuzzed = fuzzCoordinates(46.781293, -92.104438, 1000);
  assert.equal(fuzzed.precision, 'approximate');
  assert.ok(Number.isFinite(fuzzed.latitude));
  assert.ok(Number.isFinite(fuzzed.longitude));
});

test('toPublicObservation never exposes internal coords by default', () => {
  const pub = toPublicObservation({
    id: 'OB-1',
    internal_latitude: 10.123456,
    internal_longitude: 20.654321,
    privacy_radius_m: 1000,
  });
  assert.equal(pub.internal_latitude, undefined);
  assert.equal(pub.location_precision, 'approximate');
});

test('credential metadata refuses full secret-looking values and never returns secrets', () => {
  globalThis.localStorage = memoryStorage();
  const store = createOapStore({ seed: [] });
  assert.throws(
    () => store.addCredentialMetadata({ provider: 'openai', display_hint: 'sk-abcdefghijklmnopqrstuvwxyz0129F' }),
    /full API secret/i,
  );
  const meta = store.addCredentialMetadata({ provider: 'openai', display_hint: 'sk-...29F' });
  assert.equal(meta.connected, true);
  assert.equal(meta.provider, 'openai');
  assert.ok(meta.credential_id);
  assert.equal(Object.hasOwn(meta, 'secret'), false);
  assert.equal(Object.hasOwn(meta, 'api_key'), false);
});

test('malformed event data is rejected', () => {
  globalThis.localStorage = memoryStorage();
  const store = createOapStore({ seed: [] });
  assert.throws(() => store.createEvent({ title: 'no coords', category: 'aerial' }));
});

test('duplicate local submissions create distinct events (merge is later)', () => {
  globalThis.localStorage = memoryStorage();
  const store = createOapStore({ seed: [] });
  const a = store.createEvent({ title: 'A', category: 'aerial', latitude: 1, longitude: 2, description: 'a' });
  const b = store.createEvent({ title: 'A', category: 'aerial', latitude: 1, longitude: 2, description: 'a' });
  assert.notEqual(a.id, b.id);
});

test('sensor capability probe does not invent sensors', () => {
  const caps = detectSensorCapabilities();
  assert.equal(typeof caps.geolocation, 'boolean');
  assert.equal(typeof caps.deviceOrientation, 'boolean');
  assert.equal(typeof caps.secureContext, 'boolean');
});

test('MCP skeleton exposes OAP tools without vendor lock-in', () => {
  const tools = listOapMcpTools();
  assert.ok(tools.some((tool) => tool.name === 'oap.list_active_events'));
  assert.ok(tools.some((tool) => tool.name === 'oap.add_hypothesis'));
});

test('createEventAsync falls back when cloud is not configured', async () => {
  globalThis.localStorage = memoryStorage();
  const store = createOapStore({ seed: [] });
  const result = await store.createEventAsync({
    title: 'Async local',
    category: 'aerial',
    latitude: 1,
    longitude: 2,
    description: 'x',
  });
  assert.match(result.event.id, /^AE-/);
  assert.equal(result.cloud.ok, false);
  assert.equal(result.cloud.reason, 'not_configured');
});
