import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseUrl } from './supabase';

// Supabase Auth sign-in for the admin login. Uses the *publishable* (anon) key —
// the same one that is safe in a browser — never the service-role key. Nothing
// from the Supabase session is stored: it only proves the password was right.

export function getPublishableKey() {
  return (
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ''
  ).trim();
}

// Resolves to { ok: true, email } or { ok: false, code, message }, where code is
// 'invalid' (bad credentials), 'unconfirmed' (email not confirmed) or 'error'
// (Supabase unreachable / misconfigured).
export async function signInWithPassword(email, password) {
  const key = getPublishableKey();
  if (!key) {
    return { ok: false, code: 'error', message: 'Falta SUPABASE_PUBLISHABLE_KEY en el servidor.' };
  }

  try {
    const auth = createClient(getSupabaseUrl(), key, {
      auth: { persistSession: false, autoRefreshToken: false },
    }).auth;
    const { data, error } = await auth.signInWithPassword({ email, password });

    if (error) {
      if (error.code === 'email_not_confirmed') {
        return { ok: false, code: 'unconfirmed', message: error.message };
      }
      if (error.code === 'invalid_credentials' || error.status === 400) {
        return { ok: false, code: 'invalid', message: error.message };
      }
      return { ok: false, code: 'error', message: error.message };
    }
    return { ok: true, email: String(data.user?.email ?? '').toLowerCase() };
  } catch (e) {
    return { ok: false, code: 'error', message: e?.message ?? String(e) };
  }
}
