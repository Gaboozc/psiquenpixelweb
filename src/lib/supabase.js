import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client using the service_role key. It bypasses RLS, so it
// must NEVER be imported from a Client Component or exposed to the browser —
// the 'server-only' import above makes the build fail if that happens.

let client;

// The project URL, reduced to its origin. The client appends /rest/v1,
// /storage/v1… itself, so a URL pasted with a path (e.g. ".../rest/v1/") would
// otherwise double it up and Supabase answers "Invalid path specified in request URL".
export function getSupabaseUrl() {
  const rawUrl = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.trim();
  if (!rawUrl) {
    throw new Error('Falta SUPABASE_URL (o NEXT_PUBLIC_SUPABASE_URL) en el entorno.');
  }
  try {
    return new URL(rawUrl).origin;
  } catch {
    throw new Error(`SUPABASE_URL no es una URL válida: "${rawUrl}". Debe ser https://xxxx.supabase.co`);
  }
}

export function getSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    throw new Error('Falta SUPABASE_SERVICE_ROLE_KEY en el entorno.');
  }
  if (!client) {
    client = createClient(getSupabaseUrl(), key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return client;
}

export const UPLOADS_BUCKET = 'uploads';
