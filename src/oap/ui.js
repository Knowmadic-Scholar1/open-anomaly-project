/**
 * OAP mobile-first UI: event panel, report flow, observe flow, alert prefs.
 * Vanilla DOM to match God's Eye View — no React rewrite in V0.1.
 */

import * as Cesium from 'cesium';
import oapStore from './store.js';
import { EVENT_CATEGORIES, OBSERVED_MORPHOLOGIES, HYPOTHESIS_MECHANISMS } from './constants.js';
import { captureObservationSensors, detectSensorCapabilities } from './sensors.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function ensureStyles() {
  if (document.getElementById('oap-ui-styles')) return;
  const style = document.createElement('style');
  style.id = 'oap-ui-styles';
  style.textContent = `
    #oap-root { position: fixed; inset: 0; pointer-events: none; z-index: 40; font-family: "IBM Plex Sans", "Segoe UI", sans-serif; }
    #oap-root * { box-sizing: border-box; }
    .oap-fab-stack { position: absolute; right: 12px; bottom: 88px; display: flex; flex-direction: column; gap: 8px; pointer-events: auto; }
    .oap-fab { border: 0; border-radius: 999px; padding: 12px 16px; background: #0f172a; color: #f8fafc; font-weight: 600; letter-spacing: 0.02em; box-shadow: 0 10px 30px rgba(2,6,23,0.35); cursor: pointer; }
    .oap-fab.secondary { background: #1e293b; font-weight: 500; }
    .oap-sheet { position: absolute; left: 0; right: 0; bottom: 0; max-height: min(78vh, 720px); overflow: auto; pointer-events: auto; background: linear-gradient(180deg, rgba(15,23,42,0.92), rgba(2,6,23,0.96)); color: #e2e8f0; border-radius: 18px 18px 0 0; border-top: 1px solid rgba(148,163,184,0.35); padding: 16px 16px 28px; backdrop-filter: blur(10px); }
    .oap-sheet h2 { margin: 0 0 4px; font-size: 1.15rem; font-weight: 650; color: #f8fafc; }
    .oap-sheet .oap-brand { font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: #7dd3fc; margin-bottom: 8px; }
    .oap-meta { display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0 14px; }
    .oap-chip { font-size: 0.72rem; padding: 4px 8px; border-radius: 999px; background: rgba(51,65,85,0.9); color: #e2e8f0; }
    .oap-chip.live { background: rgba(220,38,38,0.25); color: #fecaca; border: 1px solid rgba(248,113,113,0.45); }
    .oap-chip.resolved { background: rgba(100,116,139,0.35); }
    .oap-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
    .oap-btn { border: 0; border-radius: 10px; padding: 10px 14px; background: #38bdf8; color: #0f172a; font-weight: 650; cursor: pointer; }
    .oap-btn.ghost { background: transparent; color: #e2e8f0; border: 1px solid rgba(148,163,184,0.45); }
    .oap-btn.warn { background: #f59e0b; }
    .oap-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .oap-field label { font-size: 0.8rem; color: #94a3b8; }
    .oap-field input, .oap-field select, .oap-field textarea { width: 100%; border-radius: 10px; border: 1px solid rgba(148,163,184,0.35); background: rgba(15,23,42,0.85); color: #f8fafc; padding: 10px 12px; font: inherit; }
    .oap-field textarea { min-height: 88px; resize: vertical; }
    .oap-help { font-size: 0.78rem; color: #94a3b8; line-height: 1.4; }
    .oap-list { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
    .oap-list button { text-align: left; pointer-events: auto; border: 1px solid rgba(148,163,184,0.25); background: rgba(30,41,59,0.8); color: #e2e8f0; border-radius: 12px; padding: 10px 12px; cursor: pointer; }
    .oap-close { position: absolute; top: 12px; right: 14px; border: 0; background: transparent; color: #cbd5e1; font-size: 1.2rem; cursor: pointer; }
    @media (min-width: 900px) {
      .oap-sheet { left: auto; right: 16px; bottom: 16px; width: min(420px, calc(100vw - 32px)); border-radius: 16px; max-height: min(80vh, 760px); }
      .oap-fab-stack { bottom: 24px; right: 24px; }
    }
  `;
  document.head.appendChild(style);
}

export function initOapUi({ viewer, dataManager, layer, store = oapStore } = {}) {
  ensureStyles();
  const root = el('div');
  root.id = 'oap-root';
  document.body.appendChild(root);

  const fabStack = el('div', 'oap-fab-stack');
  const reportBtn = el('button', 'oap-fab', 'Report anomaly');
  const browseBtn = el('button', 'oap-fab secondary', 'Browse anomalies');
  const alertsBtn = el('button', 'oap-fab secondary', 'Alert prefs');
  fabStack.append(reportBtn, browseBtn, alertsBtn);
  root.appendChild(fabStack);

  let sheet = null;

  function closeSheet() {
    sheet?.remove();
    sheet = null;
  }

  function openSheet() {
    closeSheet();
    sheet = el('div', 'oap-sheet');
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    const close = el('button', 'oap-close', '×');
    close.setAttribute('aria-label', 'Close');
    close.addEventListener('click', closeSheet);
    sheet.appendChild(close);
    root.appendChild(sheet);
    return sheet;
  }

  function refreshLayer() {
    if (!layer || !dataManager) return;
    if (dataManager.isEnabled?.(layer.id)) {
      void layer.update?.(viewer);
      return;
    }
    void dataManager.setEnabled?.(layer.id, true, { origin: 'user' });
  }

  function renderEvent(eventId) {
    const event = store.getEvent(eventId);
    if (!event) return;
    const panel = openSheet();
    panel.appendChild(el('div', 'oap-brand', 'Open Anomaly Project'));
    panel.appendChild(el('h2', null, event.title));
    const meta = el('div', 'oap-meta');
    meta.appendChild(el('span', `oap-chip${event.is_live ? ' live' : ''}${event.status === 'RESOLVED' ? ' resolved' : ''}`, event.status));
    meta.appendChild(el('span', 'oap-chip', event.category));
    if (event.is_historical) meta.appendChild(el('span', 'oap-chip', 'historical'));
    if (event.is_live) meta.appendChild(el('span', 'oap-chip live', 'live'));
    panel.appendChild(meta);
    panel.appendChild(el('p', 'oap-help', event.summary || event.description || 'No summary yet.'));
    if (event.observed_morphology?.length) {
      panel.appendChild(el('p', 'oap-help', `Morphology (appearance): ${event.observed_morphology.join(', ')}`));
    }
    if (event.resolution?.summary) {
      panel.appendChild(el('p', 'oap-help', `Resolution: ${event.resolution.summary}`));
    }
    panel.appendChild(el('p', 'oap-help',
      `Location: ${event.latitude?.toFixed?.(3)}, ${event.longitude?.toFixed?.(3)} · Observations: ${event.observations?.length || 0} · Evidence: ${event.evidence?.length || 0}`));

    const hypWrap = el('div', 'oap-list');
    hypWrap.appendChild(el('div', 'oap-help', 'Hypotheses'));
    for (const hyp of event.hypotheses || []) {
      hypWrap.appendChild(el('div', 'oap-help', `${hyp.mechanism}: ${hyp.summary || ''} (${Math.round((hyp.confidence || 0) * 100)}%)`));
    }
    panel.appendChild(hypWrap);

    const actions = el('div', 'oap-actions');
    const observe = el('button', 'oap-btn', 'Observe');
    observe.addEventListener('click', () => renderObserve(event.id));
    const addHyp = el('button', 'oap-btn ghost', 'Add hypothesis');
    addHyp.addEventListener('click', () => renderHypothesis(event.id));
    const resolve = el('button', 'oap-btn ghost', 'Mark unresolved');
    resolve.addEventListener('click', () => {
      store.updateEventStatus(event.id, 'UNRESOLVED', 'Manual investigator mark');
      renderEvent(event.id);
      refreshLayer();
    });
    const resolved = el('button', 'oap-btn warn', 'Mark resolved');
    resolved.addEventListener('click', () => {
      const mechanism = window.prompt('Resolution mechanism (e.g. starlink, aircraft, lens_flare):', 'unresolved');
      if (!mechanism) return;
      store.addHypothesis(event.id, { mechanism, summary: `Resolved as ${mechanism}`, confidence: 0.8 });
      store.updateEventStatus(event.id, 'RESOLVED', `Resolved as ${mechanism}`);
      renderEvent(event.id);
      refreshLayer();
    });
    actions.append(observe, addHyp, resolve, resolved);
    panel.appendChild(actions);
    panel.appendChild(el('p', 'oap-help', 'Unresolved means insufficient evidence — not an exotic conclusion.'));
  }

  function renderBrowse() {
    const panel = openSheet();
    panel.appendChild(el('div', 'oap-brand', 'Open Anomaly Project'));
    panel.appendChild(el('h2', null, 'Anomaly events'));
    panel.appendChild(el('p', 'oap-help', 'Browse public reports. Evidence matters more than popularity.'));
    const list = el('div', 'oap-list');
    for (const event of store.listEvents()) {
      const row = el('button', null, `${event.is_live ? 'LIVE · ' : ''}${event.title}\n${event.status} · ${event.category}`);
      row.addEventListener('click', () => {
        renderEvent(event.id);
        if (viewer && Number.isFinite(event.latitude) && Number.isFinite(event.longitude)) {
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(event.longitude, event.latitude, 250000),
            duration: 1.4,
          });
        }
      });
      list.appendChild(row);
    }
    panel.appendChild(list);
    refreshLayer();
  }

  function renderReport() {
    const panel = openSheet();
    panel.appendChild(el('div', 'oap-brand', 'Open Anomaly Project'));
    panel.appendChild(el('h2', null, 'Report anomaly'));
    panel.appendChild(el('p', 'oap-help', 'Describe what you observed. Do not jump to conclusions.'));

    const form = el('form');
    form.appendChild(fieldSelect('category', 'Category', EVENT_CATEGORIES, 'aerial'));
    form.appendChild(fieldSelect('live', 'Is it happening now?', ['yes', 'no'], 'yes'));
    form.appendChild(fieldInput('title', 'Short title', 'Bright light moving east'));
    form.appendChild(fieldTextarea('description', 'Brief description', ''));
    form.appendChild(fieldSelect('morphology', 'What did it look like?', OBSERVED_MORPHOLOGIES, 'luminous'));
    form.appendChild(fieldInput('media_url', 'Source / media link (optional)', 'https://'));
    form.appendChild(fieldInput('latitude', 'Latitude', '30.2672'));
    form.appendChild(fieldInput('longitude', 'Longitude', '-97.7431'));

    const caps = detectSensorCapabilities();
    form.appendChild(el('p', 'oap-help',
      `Device: GPS ${caps.geolocation ? 'available' : 'unavailable'} · Orientation ${caps.deviceOrientation ? 'available' : 'unavailable'} · Camera API ${caps.mediaDevices ? 'available' : 'unavailable'}`));

    const actions = el('div', 'oap-actions');
    const useLoc = el('button', 'oap-btn ghost', 'Use my approximate location');
    useLoc.type = 'button';
    useLoc.addEventListener('click', async () => {
      const sensors = await captureObservationSensors();
      if (sensors.latitude != null) form.elements.latitude.value = String(sensors.latitude);
      if (sensors.longitude != null) form.elements.longitude.value = String(sensors.longitude);
    });
    const submit = el('button', 'oap-btn', 'Submit');
    submit.type = 'submit';
    actions.append(useLoc, submit);
    form.appendChild(actions);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const isLive = String(data.get('live')) === 'yes';
      const media = String(data.get('media_url') || '').trim();
      const created = store.createEvent({
        title: data.get('title'),
        category: data.get('category'),
        description: data.get('description'),
        observed_morphology: [String(data.get('morphology'))],
        latitude: Number(data.get('latitude')),
        longitude: Number(data.get('longitude')),
        is_live: isLive,
        is_historical: !isLive,
        status: 'REPORTED',
        source_links: media && /^https?:\/\//i.test(media) ? [{ url: media, platform: 'user_link' }] : [],
      });
      if (isLive && window.confirm('Request nearby verification?')) {
        // Preference flag only in V0.1 — push delivery comes with service worker work.
        store.setSubscriptions({ live_verification: true });
      }
      renderEvent(created.id);
      refreshLayer();
    });

    panel.appendChild(form);
  }

  async function renderObserve(eventId) {
    const panel = openSheet();
    panel.appendChild(el('div', 'oap-brand', 'Open Anomaly Project'));
    panel.appendChild(el('h2', null, 'Structured observation'));
    panel.appendChild(el('p', 'oap-help', 'Only sensors you permit are recorded. Missing capabilities are omitted — never invented.'));

    const form = el('form');
    form.appendChild(fieldSelect('visibility', 'Can you see this region of sky/ground?', ['yes', 'no', 'obstructed', 'unsure'], 'unsure'));
    form.appendChild(fieldTextarea('description', 'What do you observe?', ''));
    form.appendChild(fieldInput('media_url', 'Media link (optional)', ''));
    const status = el('p', 'oap-help', 'Tap start to capture available sensors.');
    form.appendChild(status);

    const actions = el('div', 'oap-actions');
    const start = el('button', 'oap-btn', 'Start observation');
    start.type = 'submit';
    const back = el('button', 'oap-btn ghost', 'Back');
    back.type = 'button';
    back.addEventListener('click', () => renderEvent(eventId));
    actions.append(start, back);
    form.appendChild(actions);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      start.disabled = true;
      status.textContent = 'Capturing available sensors…';
      const sensors = await captureObservationSensors();
      const data = new FormData(form);
      const media = String(data.get('media_url') || '').trim();
      store.addObservation(eventId, {
        visibility: data.get('visibility'),
        description: data.get('description'),
        media_url: media,
        latitude: sensors.latitude,
        longitude: sensors.longitude,
        sensor_package: sensors.readings,
        privacy_radius_m: 1000,
        public_exact: false,
      });
      renderEvent(eventId);
      refreshLayer();
    });

    panel.appendChild(form);
  }

  function renderHypothesis(eventId) {
    const panel = openSheet();
    panel.appendChild(el('div', 'oap-brand', 'Open Anomaly Project'));
    panel.appendChild(el('h2', null, 'Add hypothesis'));
    const form = el('form');
    form.appendChild(fieldSelect('mechanism', 'Proposed explanation', HYPOTHESIS_MECHANISMS, 'unresolved'));
    form.appendChild(fieldTextarea('summary', 'Why this fits (or does not)', ''));
    const submit = el('button', 'oap-btn', 'Save hypothesis');
    submit.type = 'submit';
    form.appendChild(submit);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      store.addHypothesis(eventId, {
        mechanism: data.get('mechanism'),
        summary: data.get('summary'),
        confidence: 0.4,
      });
      renderEvent(eventId);
    });
    panel.appendChild(form);
  }

  function renderAlerts() {
    const panel = openSheet();
    const prefs = store.getSubscriptions();
    panel.appendChild(el('div', 'oap-brand', 'Open Anomaly Project'));
    panel.appendChild(el('h2', null, 'Alert preferences'));
    panel.appendChild(el('p', 'oap-help', 'Web Push delivery ships after the service-worker foundation. Preferences are stored now.'));
    const form = el('form');
    form.appendChild(fieldSelect('live_verification', 'Live verification requests', ['yes', 'no'], prefs.live_verification ? 'yes' : 'no'));
    form.appendChild(fieldInput('radius_km', 'Radius (km)', String(prefs.radius_km || 50)));
    form.appendChild(fieldSelect('worldwide', 'Every anomaly worldwide', ['no', 'yes'], prefs.worldwide ? 'yes' : 'no'));
    const save = el('button', 'oap-btn', 'Save');
    save.type = 'submit';
    form.appendChild(save);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      store.setSubscriptions({
        live_verification: String(data.get('live_verification')) === 'yes',
        radius_km: Number(data.get('radius_km')) || 50,
        worldwide: String(data.get('worldwide')) === 'yes',
      });
      closeSheet();
    });
    panel.appendChild(form);
  }

  reportBtn.addEventListener('click', renderReport);
  browseBtn.addEventListener('click', renderBrowse);
  alertsBtn.addEventListener('click', renderAlerts);

  if (layer?.setSelectionHandler) {
    layer.setSelectionHandler((eventId) => renderEvent(eventId));
  }

  return {
    openEvent: renderEvent,
    openReport: renderReport,
    openBrowse: renderBrowse,
    destroy() {
      closeSheet();
      root.remove();
    },
  };
}

function fieldInput(name, label, value = '') {
  const wrap = el('div', 'oap-field');
  const lab = el('label', null, label);
  lab.htmlFor = `oap-${name}`;
  const input = el('input');
  input.id = `oap-${name}`;
  input.name = name;
  input.value = value;
  wrap.append(lab, input);
  return wrap;
}

function fieldTextarea(name, label, value = '') {
  const wrap = el('div', 'oap-field');
  const lab = el('label', null, label);
  lab.htmlFor = `oap-${name}`;
  const input = el('textarea');
  input.id = `oap-${name}`;
  input.name = name;
  input.value = value;
  wrap.append(lab, input);
  return wrap;
}

function fieldSelect(name, label, values, selected) {
  const wrap = el('div', 'oap-field');
  const lab = el('label', null, label);
  lab.htmlFor = `oap-${name}`;
  const input = el('select');
  input.id = `oap-${name}`;
  input.name = name;
  for (const value of values) {
    const opt = el('option', null, value);
    opt.value = value;
    if (value === selected) opt.selected = true;
    input.appendChild(opt);
  }
  wrap.append(lab, input);
  return wrap;
}
