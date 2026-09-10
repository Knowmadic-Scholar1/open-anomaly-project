/**
 * OAP event store — seed JSON + localStorage, Supabase-shaped records.
 * Cloud persistence is optional; local mode keeps the MVP runnable offline.
 */

import seedEvents from './data/seed-events.js';
import {
  EVENT_STATUSES,
  EVENT_CATEGORIES,
  LOCAL_STORE_KEY,
  LOCAL_SUBS_KEY,
  LOCAL_CREDENTIALS_META_KEY,
} from './constants.js';
import { toPublicObservation } from './privacy.js';
import { fetchCloudEvents, publishCloudEvent, publishCloudObservation } from './cloud.js';
import { isOapCloudConfigured } from './supabaseClient.js';

function nowIso() {
  return new Date().toISOString();
}

function newId(prefix) {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function readJson(key, fallback) {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn('[OAP] localStorage write failed:', error);
    return false;
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeEventInput(input = {}) {
  const category = EVENT_CATEGORIES.includes(input.category) ? input.category : 'unknown';
  const status = EVENT_STATUSES.includes(input.status) ? input.status : 'REPORTED';
  const lat = Number(input.latitude);
  const lon = Number(input.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error('Event requires finite latitude and longitude');
  }
  if (typeof input.description === 'string' && input.description.length > 8000) {
    throw new Error('Description too long');
  }
  const sourceLinks = Array.isArray(input.source_links)
    ? input.source_links.filter((link) => link && typeof link.url === 'string' && /^https?:\/\//i.test(link.url))
    : [];

  return {
    title: String(input.title || 'Untitled anomaly').slice(0, 200),
    category,
    subcategory: input.subcategory ? String(input.subcategory).slice(0, 80) : null,
    observed_morphology: Array.isArray(input.observed_morphology)
      ? input.observed_morphology.map(String).slice(0, 24)
      : [],
    tags: Array.isArray(input.tags) ? input.tags.map(String).slice(0, 24) : [],
    latitude: lat,
    longitude: lon,
    altitude_m: Number.isFinite(Number(input.altitude_m)) ? Number(input.altitude_m) : null,
    location_accuracy_m: Number.isFinite(Number(input.location_accuracy_m))
      ? Number(input.location_accuracy_m)
      : null,
    location_uncertainty_radius_m: Number.isFinite(Number(input.location_uncertainty_radius_m))
      ? Number(input.location_uncertainty_radius_m)
      : 1000,
    location_precision: input.location_precision || 'approximate',
    start_time: input.start_time || null,
    end_time: input.end_time || null,
    time_precision: input.time_precision || (input.is_live ? 'minute' : 'unknown'),
    reported_at: input.reported_at || nowIso(),
    description: String(input.description || '').slice(0, 8000),
    summary: input.summary ? String(input.summary).slice(0, 500) : null,
    status,
    is_live: input.is_live === true,
    is_historical: input.is_historical === true,
    source_links: sourceLinks,
    event_confidence: Number.isFinite(Number(input.event_confidence))
      ? Math.max(0, Math.min(1, Number(input.event_confidence)))
      : 0.2,
  };
}

export function createOapStore({ seed = seedEvents } = {}) {
  let events = mergeSeedWithLocal(seed);

  function persist() {
    const userEvents = events.filter((event) => !String(event.id).startsWith('AE-SEED-'));
    writeJson(LOCAL_STORE_KEY, userEvents);
  }

  function listEvents({ includePrivateObservations = false } = {}) {
    return events.map((event) => projectEvent(event, { includePrivateObservations }));
  }

  function getEvent(id, options = {}) {
    const event = events.find((row) => row.id === id);
    return event ? projectEvent(event, options) : null;
  }

  function createEvent(input) {
    const normalized = normalizeEventInput(input);
    const stamp = nowIso();
    const event = {
      id: newId('AE'),
      ...normalized,
      resolution: null,
      hypotheses: [],
      observations: [],
      evidence: [],
      status_history: [{ status: normalized.status, at: stamp, note: 'created' }],
      created_at: stamp,
      updated_at: stamp,
      last_reviewed_at: null,
      _source: 'local',
    };
    events = [event, ...events];
    persist();
    return projectEvent(event);
  }

  /**
   * Create locally, then attempt cloud publish when the user is signed in.
   * Offline / anonymous always keep a local copy.
   */
  async function createEventAsync(input) {
    const created = createEvent(input);
    if (!isOapCloudConfigured()) {
      return { event: created, cloud: { ok: false, reason: 'not_configured' } };
    }
    const cloud = await publishCloudEvent(created);
    if (cloud.ok) {
      const index = events.findIndex((row) => row.id === created.id);
      if (index >= 0) events[index] = { ...events[index], _source: 'cloud' };
    }
    return { event: getEvent(created.id), cloud };
  }

  function updateEventStatus(id, status, note = '') {
    if (!EVENT_STATUSES.includes(status)) throw new Error(`Invalid status: ${status}`);
    const index = events.findIndex((row) => row.id === id);
    if (index < 0) return null;
    const event = clone(events[index]);
    event.status = status;
    event.updated_at = nowIso();
    event.last_reviewed_at = event.updated_at;
    event.status_history = [
      ...(event.status_history || []),
      { status, at: event.updated_at, note: String(note || '').slice(0, 500) },
    ];
    if (status === 'RESOLVED' && note) {
      event.resolution = {
        ...(event.resolution || {}),
        summary: String(note).slice(0, 1000),
        updated_at: event.updated_at,
      };
    }
    events[index] = event;
    persist();
    return projectEvent(event);
  }

  function addObservation(eventId, observationInput = {}) {
    const index = events.findIndex((row) => row.id === eventId);
    if (index < 0) return null;
    const event = clone(events[index]);
    const stamp = nowIso();
    const internalLat = Number(observationInput.latitude);
    const internalLon = Number(observationInput.longitude);
    const observation = {
      id: newId('OB'),
      event_id: eventId,
      visibility: observationInput.visibility || 'unsure',
      description: String(observationInput.description || '').slice(0, 4000),
      media_url: sanitizeUrl(observationInput.media_url),
      platform: observationInput.platform ? String(observationInput.platform).slice(0, 40) : null,
      sensor_package: Array.isArray(observationInput.sensor_package)
        ? observationInput.sensor_package
        : [],
      internal_latitude: Number.isFinite(internalLat) ? internalLat : null,
      internal_longitude: Number.isFinite(internalLon) ? internalLon : null,
      privacy_radius_m: Number(observationInput.privacy_radius_m) || 1000,
      public_exact: observationInput.public_exact === true,
      captured_at: observationInput.captured_at || stamp,
      created_at: stamp,
    };
    event.observations = [...(event.observations || []), observation];
    if (event.status === 'REPORTED') event.status = 'REALTIME_OBSERVED';
    if ((event.observations?.length || 0) >= 2 && event.status === 'REALTIME_OBSERVED') {
      event.status = 'CORROBORATED';
    }
    event.updated_at = stamp;
    event.status_history = [
      ...(event.status_history || []),
      { status: event.status, at: stamp, note: `observation ${observation.id}` },
    ];
    events[index] = event;
    persist();
    return {
      event: projectEvent(event),
      observation: toPublicObservation(observation, { publicExact: observation.public_exact }),
      _observationRaw: observation,
    };
  }

  async function addObservationAsync(eventId, observationInput = {}) {
    const result = addObservation(eventId, observationInput);
    if (!result) return null;
    let cloud = { ok: false, reason: 'not_configured' };
    if (isOapCloudConfigured()) {
      cloud = await publishCloudObservation(eventId, result._observationRaw);
    }
    const { _observationRaw, ...publicResult } = result;
    return { ...publicResult, cloud };
  }

  /**
   * Merge remote public events into the in-memory store (cloud wins on id clash).
   */
  async function hydrateFromCloud() {
    if (!isOapCloudConfigured()) {
      return { ok: false, reason: 'not_configured', count: 0 };
    }
    const remote = await fetchCloudEvents();
    if (!remote.length) return { ok: true, count: 0 };
    const byId = new Map(events.map((event) => [event.id, event]));
    for (const event of remote) byId.set(event.id, event);
    events = [...byId.values()].sort((a, b) => String(b.reported_at || b.created_at)
      .localeCompare(String(a.reported_at || a.created_at)));
    return { ok: true, count: remote.length };
  }

  function addHypothesis(eventId, hypothesisInput = {}) {
    const index = events.findIndex((row) => row.id === eventId);
    if (index < 0) return null;
    const event = clone(events[index]);
    const hypothesis = {
      id: newId('HY'),
      mechanism: String(hypothesisInput.mechanism || 'unresolved').slice(0, 80),
      summary: String(hypothesisInput.summary || '').slice(0, 1000),
      confidence: Math.max(0, Math.min(1, Number(hypothesisInput.confidence) || 0.3)),
      status: 'open',
      created_at: nowIso(),
    };
    event.hypotheses = [...(event.hypotheses || []), hypothesis];
    if (event.status === 'REPORTED' || event.status === 'REALTIME_OBSERVED' || event.status === 'CORROBORATED') {
      event.status = 'UNDER_INVESTIGATION';
    }
    event.updated_at = hypothesis.created_at;
    events[index] = event;
    persist();
    return { event: projectEvent(event), hypothesis };
  }

  function addEvidence(eventId, evidenceInput = {}) {
    const index = events.findIndex((row) => row.id === eventId);
    if (index < 0) return null;
    const event = clone(events[index]);
    const evidence = {
      id: newId('EV'),
      type: String(evidenceInput.type || 'human_analysis').slice(0, 60),
      source: String(evidenceInput.source || 'user').slice(0, 80),
      source_url: sanitizeUrl(evidenceInput.source_url),
      raw_claim: String(evidenceInput.raw_claim || '').slice(0, 2000),
      normalized_finding: String(evidenceInput.normalized_finding || evidenceInput.raw_claim || '').slice(0, 2000),
      confidence: Math.max(0, Math.min(1, Number(evidenceInput.confidence) || 0.4)),
      created_at: nowIso(),
    };
    event.evidence = [...(event.evidence || []), evidence];
    event.updated_at = evidence.created_at;
    events[index] = event;
    persist();
    return { event: projectEvent(event), evidence };
  }

  function getSubscriptions() {
    return readJson(LOCAL_SUBS_KEY, {
      live_verification: true,
      categories: ['aerial', 'orbital', 'astronomical', 'atmospheric'],
      morphologies: [],
      radius_km: 50,
      worldwide: false,
    });
  }

  function setSubscriptions(next) {
    const current = getSubscriptions();
    const merged = {
      ...current,
      ...next,
      categories: Array.isArray(next?.categories) ? next.categories.map(String) : current.categories,
      morphologies: Array.isArray(next?.morphologies) ? next.morphologies.map(String) : current.morphologies,
      radius_km: Number.isFinite(Number(next?.radius_km)) ? Number(next.radius_km) : current.radius_km,
      live_verification: next?.live_verification ?? current.live_verification,
      worldwide: next?.worldwide === true,
    };
    writeJson(LOCAL_SUBS_KEY, merged);
    return merged;
  }

  /**
   * Credential metadata only — never persist or return raw secrets in the browser store.
   * Full secrets require server-side vault (dedicated OAP backend).
   */
  function listCredentialMetadata() {
    return readJson(LOCAL_CREDENTIALS_META_KEY, []);
  }

  function addCredentialMetadata({ provider, display_hint }) {
    if (!provider) throw new Error('provider required');
    if (display_hint && /sk-[a-zA-Z0-9]{10,}/.test(display_hint)) {
      throw new Error('Refusing to store a value that looks like a full API secret');
    }
    const row = {
      credential_id: newId('CR'),
      provider: String(provider).slice(0, 40),
      connected: true,
      display_hint: String(display_hint || `${provider} · connected`).slice(0, 32),
      created_at: nowIso(),
    };
    const all = [...listCredentialMetadata(), row];
    writeJson(LOCAL_CREDENTIALS_META_KEY, all);
    return {
      provider: row.provider,
      connected: true,
      credential_id: row.credential_id,
      display_hint: row.display_hint,
    };
  }

  function revokeCredential(credentialId) {
    const next = listCredentialMetadata().filter((row) => row.credential_id !== credentialId);
    writeJson(LOCAL_CREDENTIALS_META_KEY, next);
    return { revoked: true, credential_id: credentialId };
  }

  return {
    listEvents,
    getEvent,
    createEvent,
    createEventAsync,
    updateEventStatus,
    addObservation,
    addObservationAsync,
    addHypothesis,
    addEvidence,
    getSubscriptions,
    setSubscriptions,
    listCredentialMetadata,
    addCredentialMetadata,
    revokeCredential,
    hydrateFromCloud,
    isCloudConfigured: isOapCloudConfigured,
    reload() {
      events = mergeSeedWithLocal(seed);
      return listEvents();
    },
  };
}

function sanitizeUrl(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!/^https?:\/\//i.test(trimmed)) return null;
  return trimmed.slice(0, 2000);
}

function mergeSeedWithLocal(seed) {
  const local = readJson(LOCAL_STORE_KEY, []);
  const seedList = Array.isArray(seed) ? clone(seed) : [];
  const byId = new Map();
  for (const event of seedList) byId.set(event.id, event);
  for (const event of local) {
    if (event?.id) byId.set(event.id, event);
  }
  return [...byId.values()].sort((a, b) => String(b.reported_at || b.created_at)
    .localeCompare(String(a.reported_at || a.created_at)));
}

function projectEvent(event, { includePrivateObservations = false } = {}) {
  const projected = clone(event);
  projected.observations = (event.observations || []).map((observation) => (
    includePrivateObservations
      ? observation
      : toPublicObservation(observation, { publicExact: observation.public_exact === true })
  ));
  return projected;
}

const defaultStore = createOapStore();

export default defaultStore;
