import { getSupabase } from './supabase';

// Newsletter subscribers, backed by the `subscribers` table (server-only: RLS
// has no policies on it, so it's unreachable from the browser).

export const isValidEmail = (email) =>
  typeof email === 'string' && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase();

export async function listSubscribers() {
  const { data, error } = await getSupabase()
    .from('subscribers')
    .select('email, subscribed_at')
    .order('subscribed_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ email: r.email, subscribedAt: r.subscribed_at }));
}

// Returns true if newly added, false if it was already subscribed.
export async function addSubscriber(email) {
  const { data, error } = await getSupabase()
    .from('subscribers')
    .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true })
    .select('email');
  if (error) throw new Error(error.message);
  return (data?.length ?? 0) > 0;
}

// Returns true if a row was removed.
export async function removeSubscriber(email) {
  const { data, error } = await getSupabase().from('subscribers').delete().eq('email', email).select('email');
  if (error) throw new Error(error.message);
  return (data?.length ?? 0) > 0;
}
