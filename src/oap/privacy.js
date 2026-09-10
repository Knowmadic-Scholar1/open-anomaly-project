/**
 * Location privacy helpers.
 * Public responses should not expose exact observer coordinates by default.
 */

/**
 * Quantize a coordinate to roughly `radiusM` meters for public display.
 * @param {number} latitude
 * @param {number} longitude
 * @param {number} [radiusM=1000]
 * @returns {{ latitude: number, longitude: number, uncertainty_radius_m: number, precision: 'approximate' }}
 */
export function fuzzCoordinates(latitude, longitude, radiusM = 1000) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error('fuzzCoordinates requires finite latitude/longitude');
  }
  const radius = Math.max(50, Number(radiusM) || 1000);
  // ~111_320 m per degree latitude
  const latDeg = radius / 111_320;
  const cos = Math.max(0.01, Math.cos((lat * Math.PI) / 180));
  const lonDeg = radius / (111_320 * cos);
  return {
    latitude: Math.round(lat / latDeg) * latDeg,
    longitude: Math.round(lon / lonDeg) * lonDeg,
    uncertainty_radius_m: radius,
    precision: 'approximate',
  };
}

/**
 * Project an observation for public API responses.
 * @param {object} observation
 * @param {{ publicExact?: boolean, privacyRadiusM?: number }} [options]
 */
export function toPublicObservation(observation, options = {}) {
  if (!observation || typeof observation !== 'object') return null;
  const publicExact = options.publicExact === true;
  const radius = options.privacyRadiusM ?? observation.privacy_radius_m ?? 1000;
  const base = { ...observation };
  delete base.internal_latitude;
  delete base.internal_longitude;

  if (publicExact && Number.isFinite(observation.latitude) && Number.isFinite(observation.longitude)) {
    return {
      ...base,
      location_precision: 'exact',
      location_note: 'Observer shared exact public coordinates.',
    };
  }

  if (Number.isFinite(observation.internal_latitude) && Number.isFinite(observation.internal_longitude)) {
    const fuzzed = fuzzCoordinates(observation.internal_latitude, observation.internal_longitude, radius);
    return {
      ...base,
      latitude: fuzzed.latitude,
      longitude: fuzzed.longitude,
      location_uncertainty_radius_m: fuzzed.uncertainty_radius_m,
      location_precision: 'approximate',
      location_note: 'Observation submitted from this approximate area.',
    };
  }

  if (Number.isFinite(observation.latitude) && Number.isFinite(observation.longitude)) {
    const fuzzed = fuzzCoordinates(observation.latitude, observation.longitude, radius);
    return {
      ...base,
      latitude: fuzzed.latitude,
      longitude: fuzzed.longitude,
      location_uncertainty_radius_m: fuzzed.uncertainty_radius_m,
      location_precision: 'approximate',
      location_note: 'Observation submitted from this approximate area.',
    };
  }

  return {
    ...base,
    location_precision: 'unknown',
    location_note: 'Observation location unavailable.',
  };
}
