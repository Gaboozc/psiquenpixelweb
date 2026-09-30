import { getSupabase } from './supabase';

// Key → JSON store backed by the `site_content` table. Keys in use:
// settings, media, comunidad, home, mazmorra, merch.

// Returns the stored value, or null when the row is missing or Supabase is
// unavailable (callers then fall back to their defaults). Never throws.
export async function readContent(key) {
  try {
    const { data, error } = await getSupabase()
      .from('site_content')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    if (error) throw error;
    return data?.value ?? null;
  } catch (e) {
    console.error(`[supabase] read site_content/${key}:`, e?.message ?? e);
    return null;
  }
}

// Upserts a value. Throws on failure so the admin API can report the error.
export async function writeContent(key, value) {
  const { error } = await getSupabase()
    .from('site_content')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw new Error(`No se pudo guardar "${key}": ${error.message}`);
}
