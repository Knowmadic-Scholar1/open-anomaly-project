/**
 * Browser Supabase client for the dedicated OAP project.
 * Uses publishable/anon keys only — never the service role.
 */

import { createClient } from '@supabase/supabase-js';

let client = null;

/**
 * @returns {import('@supabase/supabase-js').SupabaseClient|null}
 */
export function getOapSupabase() {
  if (client) return client;
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
  const url = String(env.VITE_OAP_SUPABASE_URL || '').trim();
  const key = String(
    env.VITE_OAP_SUPABASE_ANON_KEY
    || env.VITE_OAP_SUPABASE_PUBLISHABLE_KEY
    || '',
  ).trim();
  if (!url || !key) return null;
  client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}

export function isOapCloudConfigured() {
  return Boolean(getOapSupabase());
}

/**
 * @returns {Promise<{ user: object|null, session: object|null }>}
 */
export async function getOapAuthState() {
  const supabase = getOapSupabase();
  if (!supabase) return { user: null, session: null };
  const { data } = await supabase.auth.getSession();
  return {
    session: data.session || null,
    user: data.session?.user || null,
  };
}

/**
 * Magic-link sign-in. Requires Email provider enabled in the OAP Supabase project.
 * @param {string} email
 */
export async function requestOapMagicLink(email) {
  const supabase = getOapSupabase();
  if (!supabase) throw new Error('OAP Supabase is not configured');
  const normalized = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error('Enter a valid email address');
  }
  const { error } = await supabase.auth.signInWithOtp({
    email: normalized,
    options: {
      emailRedirectTo: globalThis.location?.origin || undefined,
    },
  });
  if (error) throw error;
  return { ok: true, email: normalized };
}

export async function signOutOap() {
  const supabase = getOapSupabase();
  if (!supabase) return { ok: true };
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return { ok: true };
}
