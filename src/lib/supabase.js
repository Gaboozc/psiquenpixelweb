import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client using the service_role key. It bypasses RLS, so it
// must NEVER be imported from a Client Component or exposed to the browser —
// the 'server-only' import above makes the build fail if that happens.

let client;

export function getSupabase() {
  const rawUrl = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!rawUrl || !key) {
    throw new Error(
      'Faltan SUPABASE_URL (o NEXT_PUBLIC_SUPABASE_URL) y/o SUPABASE_SERVICE_ROLE_KEY en el entorno.',
    );
  }
  if (!client) {
    // The client appends /rest/v1, /storage/v1… itself, so keep only the origin.
    // A URL pasted with a path (e.g. ".../rest/v1/") otherwise doubles it up and
    // Supabase answers "Invalid path specified in request URL".
    let url;
    try {
      url = new URL(rawUrl).origin;
    } catch {
      throw new Error(`SUPABASE_URL no es una URL válida: "${rawUrl}". Debe ser https://xxxx.supabase.co`);
    }
    client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return client;
}

export const UPLOADS_BUCKET = 'uploads';
