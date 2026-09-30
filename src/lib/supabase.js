import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client using the service_role key. It bypasses RLS, so it
// must NEVER be imported from a Client Component or exposed to the browser —
// the 'server-only' import above makes the build fail if that happens.

let client;

export function getSupabase() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Faltan SUPABASE_URL (o NEXT_PUBLIC_SUPABASE_URL) y/o SUPABASE_SERVICE_ROLE_KEY en el entorno.',
    );
  }
  if (!client) {
    client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return client;
}

export const UPLOADS_BUCKET = 'uploads';
