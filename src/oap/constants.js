/**
 * Open Anomaly Project — shared constants (V0.1).
 * Morphology = appearance. Hypotheses = proposed mechanism. Keep separate.
 */

export const OAP_LAYER_ID = 'oap-anomalies';

export const EVENT_STATUSES = Object.freeze([
  'REPORTED',
  'REALTIME_OBSERVED',
  'CORROBORATED',
  'UNDER_INVESTIGATION',
  'RESOLVED',
  'UNRESOLVED',
  'DISPUTED',
  'INSUFFICIENT_EVIDENCE',
  'INVALID',
]);

export const EVENT_CATEGORIES = Object.freeze([
  'aerial',
  'orbital',
  'astronomical',
  'atmospheric',
  'maritime',
  'geological',
  'infrastructure',
  'electromagnetic',
  'optical',
  'unknown',
]);

/** Appearance / morphology tags — NOT proof of portals or exotic mechanisms. */
export const OBSERVED_MORPHOLOGIES = Object.freeze([
  'ring',
  'sphere',
  'spiral',
  'aperture',
  'ripple',
  'spatial_distortion',
  'lightning_like',
  'plasma_like',
  'cloud_like',
  'luminous',
  'dark_object',
  'fast_moving',
  'stationary',
  'instantaneous_disappearance',
  'apparent_acceleration',
  'apparent_duplication',
  'unknown',
]);

export const HYPOTHESIS_MECHANISMS = Object.freeze([
  'aircraft',
  'drone',
  'balloon',
  'satellite',
  'starlink',
  'rocket_launch',
  'rocket_exhaust',
  'rocket_reentry',
  'meteor',
  'planet',
  'star',
  'aurora',
  'lightning',
  'atmospheric_optics',
  'cloud_formation',
  'searchlight',
  'projection',
  'lens_flare',
  'rolling_shutter',
  'camera_artifact',
  'compression_artifact',
  'ai_generated_media',
  'cgi_editing',
  'hoax',
  'unknown_natural_phenomenon',
  'unknown_engineered_phenomenon',
  'unresolved',
  'insufficient_evidence',
]);

export const LOCAL_STORE_KEY = 'oap:events:v1';
export const LOCAL_SUBS_KEY = 'oap:subscriptions:v1';
export const LOCAL_CREDENTIALS_META_KEY = 'oap:credentials-meta:v1';
