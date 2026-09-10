/**
 * OAP anomaly markers on the God's Eye View globe.
 * Registers as a normal DataLayerManager module — no GEV rewrite.
 */

import * as Cesium from 'cesium';
import oapStore from '../oap/store.js';
import { OAP_LAYER_ID } from '../oap/constants.js';

const STATUS_COLORS = Object.freeze({
  REPORTED: Cesium.Color.fromCssColorString('#5b8def'),
  REALTIME_OBSERVED: Cesium.Color.fromCssColorString('#3dbb9a'),
  CORROBORATED: Cesium.Color.fromCssColorString('#2f9e7a'),
  UNDER_INVESTIGATION: Cesium.Color.fromCssColorString('#d4a017'),
  RESOLVED: Cesium.Color.fromCssColorString('#6b7280'),
  UNRESOLVED: Cesium.Color.fromCssColorString('#c084fc'),
  DISPUTED: Cesium.Color.fromCssColorString('#e8794a'),
  INSUFFICIENT_EVIDENCE: Cesium.Color.fromCssColorString('#94a3b8'),
  INVALID: Cesium.Color.fromCssColorString('#64748b'),
});

function statusColor(status, isLive) {
  if (isLive) return Cesium.Color.fromCssColorString('#ef4444');
  return STATUS_COLORS[status] || Cesium.Color.fromCssColorString('#5b8def');
}

export function createOapAnomaliesLayer({ store = oapStore } = {}) {
  let _dataSource = null;
  let _count = 0;
  let _lastUpdate = null;
  let _lastError = null;
  let _enabled = false;
  let _onSelect = null;

  const layer = {
    id: OAP_LAYER_ID,
    name: 'Anomalies (OAP)',
    icon: '◎',
    source: 'Open Anomaly Project',
    updateInterval: 30000,
    showInTogglePanel: true,

    setSelectionHandler(handler) {
      _onSelect = typeof handler === 'function' ? handler : null;
    },

    init(viewer) {
      _dataSource = new Cesium.CustomDataSource(OAP_LAYER_ID);
      _dataSource.show = false;
      viewer.dataSources.add(_dataSource);
      _count = 0;
      _lastUpdate = null;
      _lastError = null;
      _enabled = false;

      viewer.selectedEntityChanged.addEventListener((entity) => {
        if (!_enabled || !entity || !_onSelect) return;
        const eventId = entity.properties?.oapEventId?.getValue?.();
        if (eventId) _onSelect(String(eventId));
      });
    },

    enable() {
      _enabled = true;
      if (_dataSource) _dataSource.show = true;
    },

    disable() {
      _enabled = false;
      if (_dataSource) _dataSource.show = false;
    },

    async update() {
      try {
        const events = store.listEvents();
        if (!_dataSource) return false;
        _dataSource.entities.removeAll();
        let count = 0;
        for (const event of events) {
          if (!Number.isFinite(event.latitude) || !Number.isFinite(event.longitude)) continue;
          count += 1;
          const color = statusColor(event.status, event.is_live);
          const pixelSize = event.is_live ? 16 : event.status === 'RESOLVED' ? 10 : 12;
          _dataSource.entities.add({
            id: `oap:${event.id}`,
            position: Cesium.Cartesian3.fromDegrees(event.longitude, event.latitude),
            point: {
              pixelSize,
              color: color.withAlpha(0.9),
              outlineColor: Cesium.Color.WHITE.withAlpha(0.85),
              outlineWidth: 2,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            label: {
              text: event.is_live ? 'LIVE' : (event.status === 'RESOLVED' ? 'RESOLVED' : 'OAP'),
              font: '11px Inter, Segoe UI, sans-serif',
              fillColor: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 3,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0, -16),
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              show: event.is_live === true || event.status === 'RESOLVED',
            },
            properties: {
              oapEventId: event.id,
              title: event.title,
              status: event.status,
              category: event.category,
            },
          });
        }
        _count = count;
        _lastUpdate = new Date().toISOString();
        _lastError = null;
        return true;
      } catch (error) {
        _lastError = error instanceof Error ? error.message : String(error);
        console.warn('[Data:OAP] update failed:', error);
        return false;
      }
    },

    destroy(viewer) {
      _enabled = false;
      if (_dataSource) {
        viewer.dataSources.remove(_dataSource, true);
        _dataSource = null;
      }
      _count = 0;
      _lastUpdate = null;
      _lastError = null;
      _onSelect = null;
    },

    getAnalystRecords(maxCount = 2000) {
      const events = store.listEvents();
      const limit = Number.isFinite(maxCount) ? Math.max(1, Math.floor(maxCount)) : 2000;
      return events.slice(0, limit).map((event) => ({
        id: event.id,
        title: event.title,
        status: event.status,
        category: event.category,
        lat: event.latitude,
        lon: event.longitude,
        isLive: event.is_live === true,
        isHistorical: event.is_historical === true,
      }));
    },

    getStats() {
      return {
        count: _count,
        lastUpdate: _lastUpdate,
        error: _lastError,
        source: 'Open Anomaly Project',
      };
    },
  };

  return layer;
}

const oapAnomaliesLayer = createOapAnomaliesLayer();
export default oapAnomaliesLayer;
