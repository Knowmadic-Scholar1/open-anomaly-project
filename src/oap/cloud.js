/**
 * Cloud event I/O against the dedicated OAP Supabase project.
 * Anonymous: read public events. Authenticated: insert/update contributions.
 */

import { getOapSupabase, getOapAuthState } from './supabaseClient.js';

function mapEventRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    subcategory: row.subcategory,
    observed_morphology: row.observed_morphology || [],
    tags: row.tags || [],
    latitude: row.latitude,
    longitude: row.longitude,
    altitude_m: row.altitude_m,
    location_accuracy_m: row.location_accuracy_m,
    location_uncertainty_radius_m: row.location_uncertainty_radius_m,
    location_precision: row.location_precision,
    start_time: row.start_time,
    end_time: row.end_time,
    time_precision: row.time_precision,
    reported_at: row.reported_at,
    description: row.description || '',
    summary: row.summary,
    status: row.status,
    is_live: row.is_live === true,
    is_historical: row.is_historical === true,
    source_links: row.source_links || [],
    event_confidence: row.event_confidence,
    resolution: row.resolution,
    created_at: row.created_at,
    updated_at: row.updated_at,
    last_reviewed_at: row.last_reviewed_at,
    observations: [],
    evidence: [],
    hypotheses: [],
    status_history: [],
    _source: 'cloud',
  };
}

function eventToRow(event, userId = null) {
  const lat = Number(event.latitude);
  const lon = Number(event.longitude);
  return {
    id: event.id,
    title: event.title,
    category: event.category,
    subcategory: event.subcategory,
    observed_morphology: event.observed_morphology || [],
    tags: event.tags || [],
    latitude: lat,
    longitude: lon,
    altitude_m: event.altitude_m,
    location_accuracy_m: event.location_accuracy_m,
    location_uncertainty_radius_m: event.location_uncertainty_radius_m,
    location_precision: event.location_precision,
    start_time: event.start_time,
    end_time: event.end_time,
    time_precision: event.time_precision,
    reported_at: event.reported_at,
    description: event.description || '',
    summary: event.summary,
    status: event.status,
    is_live: event.is_live === true,
    is_historical: event.is_historical === true,
    source_links: event.source_links || [],
    event_confidence: event.event_confidence ?? 0.2,
    resolution: event.resolution,
    original_reporter_id: userId,
    moderation_state: 'visible',
    created_at: event.created_at,
    updated_at: event.updated_at,
    last_reviewed_at: event.last_reviewed_at,
  };
}

/**
 * Fetch public events (+ related rows) from Supabase.
 * @returns {Promise<object[]>}
 */
export async function fetchCloudEvents() {
  const supabase = getOapSupabase();
  if (!supabase) return [];

  const { data: eventRows, error } = await supabase
    .from('events')
    .select('*')
    .eq('moderation_state', 'visible')
    .order('reported_at', { ascending: false })
    .limit(500);
  if (error) {
    console.warn('[OAP] cloud event fetch failed:', error.message);
    return [];
  }

  const events = (eventRows || []).map(mapEventRow);
  const ids = events.map((event) => event.id);
  if (!ids.length) return events;

  const [obs, evidence, hypotheses, history] = await Promise.all([
    supabase.from('observations').select('*').in('event_id', ids),
    supabase.from('evidence').select('*').in('event_id', ids),
    supabase.from('hypotheses').select('*').in('event_id', ids),
    supabase.from('event_status_history').select('*').in('event_id', ids).order('at', { ascending: true }),
  ]);

  const byId = new Map(events.map((event) => [event.id, event]));
  for (const row of obs.data || []) {
    const event = byId.get(row.event_id);
    if (!event) continue;
    event.observations.push({
      id: row.id,
      event_id: row.event_id,
      visibility: row.visibility,
      description: row.description,
      media_url: row.media_url,
      platform: row.platform,
      sensor_package: row.sensor_package || [],
      privacy_radius_m: row.privacy_radius_m,
      public_exact: row.public_exact === true,
      captured_at: row.captured_at,
      created_at: row.created_at,
      latitude: null,
      longitude: null,
      location_note: 'Observation submitted from this approximate area.',
      location_precision: 'approximate',
    });
  }
  for (const row of evidence.data || []) {
    byId.get(row.event_id)?.evidence.push(row);
  }
  for (const row of hypotheses.data || []) {
    byId.get(row.event_id)?.hypotheses.push(row);
  }
  for (const row of history.data || []) {
    byId.get(row.event_id)?.status_history.push({
      status: row.status,
      at: row.at,
      note: row.note,
    });
  }
  return events;
}

/**
 * Insert an event when the user is signed in. Returns null if not authenticated / not configured.
 */
export async function publishCloudEvent(event) {
  const supabase = getOapSupabase();
  if (!supabase) return { ok: false, reason: 'not_configured' };
  const { user } = await getOapAuthState();
  if (!user) return { ok: false, reason: 'auth_required' };

  const row = eventToRow(event, user.id);
  const { error } = await supabase.from('events').upsert(row, { onConflict: 'id' });
  if (error) {
    console.warn('[OAP] cloud event publish failed:', error.message);
    return { ok: false, reason: error.message };
  }
  await supabase.from('event_status_history').insert({
    event_id: event.id,
    status: event.status,
    note: 'published',
  });
  return { ok: true, id: event.id };
}

/**
 * Insert an observation when signed in.
 */
export async function publishCloudObservation(eventId, observation) {
  const supabase = getOapSupabase();
  if (!supabase) return { ok: false, reason: 'not_configured' };
  const { user } = await getOapAuthState();
  if (!user) return { ok: false, reason: 'auth_required' };

  const row = {
    id: observation.id,
    event_id: eventId,
    submitter_id: user.id,
    visibility: observation.visibility,
    description: observation.description || '',
    media_url: observation.media_url,
    platform: observation.platform,
    sensor_package: observation.sensor_package || [],
    privacy_radius_m: observation.privacy_radius_m || 1000,
    public_exact: observation.public_exact === true,
    captured_at: observation.captured_at,
    created_at: observation.created_at,
  };

  const { error } = await supabase.from('observations').insert(row);
  if (error) {
    console.warn('[OAP] cloud observation publish failed:', error.message);
    return { ok: false, reason: error.message };
  }
  return { ok: true, id: observation.id };
}
