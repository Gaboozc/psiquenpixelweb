import { NextResponse } from 'next/server';
import { getSupabase } from './supabase';
import { rowToPost, rowToGame } from './articles';

// Admin-side CRUD for the two article collections. Unlike the public readers in
// articles.js, these include drafts. Errors carry an HTTP `status` so route
// handlers can map them straight to a response.

export const sanitizeSlug = (s) =>
  String(s || '').toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

const today = () => new Date().toISOString().split('T')[0];
const strArr = (v) => (Array.isArray(v) ? v.map(String) : []);

export const KINDS = {
  posts: {
    table: 'posts',
    map: rowToPost,
    required: ['title'],
    noun: 'post',
    toRow: (b) => ({
      title: b.title,
      date: b.date || today(),
      category: b.category || '',
      excerpt: b.excerpt || '',
      cover_image: b.coverImage || '',
      tags: strArr(b.tags),
      content: b.content || '',
      published: b.published !== false,
    }),
  },
  games: {
    table: 'games',
    map: rowToGame,
    required: ['game', 'title'],
    noun: 'análisis',
    toRow: (b) => ({
      game: b.game,
      title: b.title,
      date: b.date || today(),
      genre: strArr(b.genre),
      excerpt: b.excerpt || '',
      cover_image: b.coverImage || '',
      tags: strArr(b.tags),
      content: b.content || '',
      published: b.published !== false,
    }),
  },
};

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

// Turn a Supabase error into an HttpError (unique violation → 409).
function dbError(error, fallback) {
  if (error?.code === '23505') return httpError(409, `Ya existe un ${fallback} con ese slug`);
  return httpError(500, error?.message || `Error en la base de datos (${fallback})`);
}

export async function adminList(kind) {
  const k = KINDS[kind];
  const { data, error } = await getSupabase()
    .from(k.table)
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw dbError(error, k.noun);
  return (data ?? []).map(k.map);
}

export async function adminGet(kind, slug) {
  const k = KINDS[kind];
  const { data, error } = await getSupabase().from(k.table).select('*').eq('slug', slug).maybeSingle();
  if (error) throw dbError(error, k.noun);
  return data ? k.map(data) : null;
}

export async function adminCreate(kind, body) {
  const k = KINDS[kind];
  const slug = sanitizeSlug(body.slug);
  const missing = ['slug', ...k.required].filter((f) => !(f === 'slug' ? slug : body[f]));
  if (missing.length) throw httpError(400, `${missing.join(', ')} ${missing.length > 1 ? 'son obligatorios' : 'es obligatorio'}`);
  const { error } = await getSupabase().from(k.table).insert({ slug, ...k.toRow(body) });
  if (error) throw dbError(error, k.noun);
  return slug;
}

export async function adminUpdate(kind, slug, body) {
  const k = KINDS[kind];
  const { data, error } = await getSupabase()
    .from(k.table)
    .update({ ...k.toRow(body), updated_at: new Date().toISOString() })
    .eq('slug', slug)
    .select('slug');
  if (error) throw dbError(error, k.noun);
  if (!data?.length) throw httpError(404, `${k.noun} no encontrado`);
}

export async function adminDelete(kind, slug) {
  const k = KINDS[kind];
  const { data, error } = await getSupabase().from(k.table).delete().eq('slug', slug).select('slug');
  if (error) throw dbError(error, k.noun);
  if (!data?.length) throw httpError(404, `${k.noun} no encontrado`);
}

// Small wrapper for route handlers: run fn, map thrown errors to a JSON response.
export function errorResponse(e) {
  return NextResponse.json({ error: e.message || 'Error' }, { status: e.status || 500 });
}
