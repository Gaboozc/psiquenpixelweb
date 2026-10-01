import { NextResponse } from 'next/server';
import { getSupabase } from './supabase';
import { rowToPost } from './articles';

// Admin-side CRUD for blog posts. Unlike the public readers in articles.js,
// these include drafts. Errors carry an HTTP `status` so route handlers can map
// them straight to a response.

export const sanitizeSlug = (s) =>
  String(s || '').toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

const today = () => new Date().toISOString().split('T')[0];
const strArr = (v) => (Array.isArray(v) ? v.map(String) : []);

// Editor payload (camelCase) → table row (snake_case).
function toRow(b) {
  const sagaSlug = b.sagaSlug ? sanitizeSlug(b.sagaSlug) : null;
  return {
    title: b.title,
    date: b.date || today(),
    category: b.category || '',
    excerpt: b.excerpt || '',
    cover_image: b.coverImage || '',
    tags: strArr(b.tags),
    content: b.content || '',
    published: b.published !== false,
    game: String(b.game || '').trim(),
    saga_slug: sagaSlug,
    // Order and intro only mean something inside a saga.
    saga_order: sagaSlug ? Math.max(0, Number.parseInt(b.sagaOrder, 10) || 0) : 0,
    saga_intro: sagaSlug ? b.sagaIntro === true : false,
  };
}

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

// Turn a Supabase error into an HttpError.
function dbError(error) {
  if (error?.code === '23505') return httpError(409, 'Ya existe un post con ese slug');
  if (error?.code === '23503') return httpError(400, 'La saga elegida no existe');
  return httpError(500, error?.message || 'Error en la base de datos');
}

// A saga has at most one introduction (enforced by a unique index). The row is
// always written with saga_intro=false first; only once that succeeded do we
// demote the previous intro and promote this post — so a failed save never
// leaves the saga without its intro.
async function promoteIntro(slug, sagaSlug) {
  const { error: e1 } = await getSupabase().from('posts').update({ saga_intro: false })
    .eq('saga_slug', sagaSlug).eq('saga_intro', true).neq('slug', slug);
  if (e1) throw dbError(e1);
  const { error: e2 } = await getSupabase().from('posts').update({ saga_intro: true }).eq('slug', slug);
  if (e2) throw dbError(e2);
}

export async function adminList() {
  const { data, error } = await getSupabase()
    .from('posts')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw dbError(error);
  return (data ?? []).map(rowToPost);
}

export async function adminGet(slug) {
  const { data, error } = await getSupabase().from('posts').select('*').eq('slug', slug).maybeSingle();
  if (error) throw dbError(error);
  return data ? rowToPost(data) : null;
}

export async function adminCreate(body) {
  const slug = sanitizeSlug(body.slug);
  const missing = [!slug && 'slug', !body.title && 'title'].filter(Boolean);
  if (missing.length) {
    throw httpError(400, `${missing.join(', ')} ${missing.length > 1 ? 'son obligatorios' : 'es obligatorio'}`);
  }
  const row = toRow(body);
  const { error } = await getSupabase().from('posts').insert({ slug, ...row, saga_intro: false });
  if (error) throw dbError(error);
  if (row.saga_intro) await promoteIntro(slug, row.saga_slug);
  return { slug, sagaSlug: row.saga_slug };
}

// Returns the post's saga before and after the change, so callers can
// revalidate both saga pages when a post moves between sagas.
export async function adminUpdate(slug, body) {
  const before = await adminGet(slug);
  if (!before) throw httpError(404, 'Post no encontrado');
  const row = toRow(body);
  const { error } = await getSupabase()
    .from('posts')
    .update({ ...row, saga_intro: false, updated_at: new Date().toISOString() })
    .eq('slug', slug);
  if (error) throw dbError(error);
  if (row.saga_intro) await promoteIntro(slug, row.saga_slug);
  return { sagaSlug: row.saga_slug, previousSagaSlug: before.sagaSlug };
}

export async function adminDelete(slug) {
  const { data, error } = await getSupabase().from('posts').delete().eq('slug', slug).select('saga_slug');
  if (error) throw dbError(error);
  if (!data?.length) throw httpError(404, 'Post no encontrado');
  return { sagaSlug: data[0].saga_slug };
}

// Map a thrown error to a JSON response.
export function errorResponse(e) {
  return NextResponse.json({ error: e.message || 'Error' }, { status: e.status || 500 });
}

export { httpError, dbError };
