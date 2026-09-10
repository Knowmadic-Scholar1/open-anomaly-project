/**
 * Capability-aware device sensor capture for OAP observations.
 * Never invents readings — omitted capabilities stay omitted.
 */

/**
 * @typedef {{ value: number|string|boolean, units?: string, measured_at?: string, source: string, accuracy?: number|null }} SensorReading
 */

function reading(source, value, units, accuracy = null) {
  if (value === undefined || value === null || (typeof value === 'number' && !Number.isFinite(value))) {
    return null;
  }
  return {
    value,
    units: units || undefined,
    measured_at: new Date().toISOString(),
    source,
    accuracy,
  };
}

/**
 * Probe which browser APIs are available (not whether permission is granted).
 */
export function detectSensorCapabilities() {
  const nav = globalThis.navigator || {};
  return {
    geolocation: typeof nav.geolocation?.getCurrentPosition === 'function',
    deviceOrientation: typeof globalThis.DeviceOrientationEvent !== 'undefined',
    deviceMotion: typeof globalThis.DeviceMotionEvent !== 'undefined',
    mediaDevices: typeof nav.mediaDevices?.getUserMedia === 'function',
    permissions: typeof nav.permissions?.query === 'function',
    secureContext: globalThis.isSecureContext === true,
  };
}

/**
 * Request geolocation once.
 * @returns {Promise<SensorReading[]>}
 */
export function captureGeolocation({ timeoutMs = 8000 } = {}) {
  const geo = globalThis.navigator?.geolocation;
  if (!geo) return Promise.resolve([]);

  return new Promise((resolve) => {
    geo.getCurrentPosition(
      (pos) => {
        const coords = pos.coords;
        const out = [
          reading('geolocation', coords.latitude, 'deg', coords.accuracy),
          reading('geolocation', coords.longitude, 'deg', coords.accuracy),
          reading('geolocation', coords.altitude, 'm', coords.altitudeAccuracy),
          reading('geolocation', coords.accuracy, 'm'),
          reading('geolocation', coords.heading, 'deg'),
          reading('geolocation', coords.speed, 'm/s'),
        ].filter(Boolean);
        // Tag lat/lon distinctly for consumers.
        const packaged = [];
        if (Number.isFinite(coords.latitude)) {
          packaged.push({
            key: 'latitude',
            ...reading('geolocation', coords.latitude, 'deg', coords.accuracy),
          });
        }
        if (Number.isFinite(coords.longitude)) {
          packaged.push({
            key: 'longitude',
            ...reading('geolocation', coords.longitude, 'deg', coords.accuracy),
          });
        }
        if (Number.isFinite(coords.altitude)) {
          packaged.push({
            key: 'altitude',
            ...reading('geolocation', coords.altitude, 'm', coords.altitudeAccuracy),
          });
        }
        if (Number.isFinite(coords.accuracy)) {
          packaged.push({ key: 'gps_accuracy', ...reading('geolocation', coords.accuracy, 'm') });
        }
        if (Number.isFinite(coords.heading)) {
          packaged.push({ key: 'gps_heading', ...reading('geolocation', coords.heading, 'deg') });
        }
        resolve(packaged.length ? packaged : out);
      },
      () => resolve([]),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0 },
    );
  });
}

/**
 * Capture a single deviceorientation sample when permitted.
 * iOS requires a user-gesture permission prompt first.
 * @returns {Promise<SensorReading[]>}
 */
export async function captureOrientation({ timeoutMs = 2500 } = {}) {
  if (typeof globalThis.DeviceOrientationEvent === 'undefined') return [];

  try {
    const request = globalThis.DeviceOrientationEvent.requestPermission;
    if (typeof request === 'function') {
      const state = await request();
      if (state !== 'granted') return [];
    }
  } catch {
    return [];
  }

  return new Promise((resolve) => {
    let done = false;
    const finish = (rows) => {
      if (done) return;
      done = true;
      globalThis.removeEventListener('deviceorientation', onOrient);
      resolve(rows);
    };
    const onOrient = (event) => {
      const rows = [];
      if (Number.isFinite(event.alpha)) {
        rows.push({ key: 'compass_heading', ...reading('deviceorientation', event.alpha, 'deg') });
      }
      if (Number.isFinite(event.beta)) {
        rows.push({ key: 'device_pitch', ...reading('deviceorientation', event.beta, 'deg') });
      }
      if (Number.isFinite(event.gamma)) {
        rows.push({ key: 'device_roll', ...reading('deviceorientation', event.gamma, 'deg') });
      }
      finish(rows);
    };
    globalThis.addEventListener('deviceorientation', onOrient);
    setTimeout(() => finish([]), timeoutMs);
  });
}

/**
 * Collect a best-effort sensor package for an observation session.
 * @returns {Promise<{ capabilities: object, readings: SensorReading[], latitude: number|null, longitude: number|null, accuracy_m: number|null }>}
 */
export async function captureObservationSensors() {
  const capabilities = detectSensorCapabilities();
  const readings = [];
  let latitude = null;
  let longitude = null;
  let accuracy_m = null;

  if (capabilities.geolocation) {
    const geoReadings = await captureGeolocation();
    for (const row of geoReadings) {
      readings.push(row);
      if (row.key === 'latitude') latitude = row.value;
      if (row.key === 'longitude') longitude = row.value;
      if (row.key === 'gps_accuracy') accuracy_m = row.value;
    }
  }

  if (capabilities.deviceOrientation) {
    const orientReadings = await captureOrientation();
    readings.push(...orientReadings);
  }

  readings.push({
    key: 'client_capabilities',
    value: JSON.stringify(capabilities),
    units: 'json',
    measured_at: new Date().toISOString(),
    source: 'oap',
  });

  return { capabilities, readings, latitude, longitude, accuracy_m };
}
