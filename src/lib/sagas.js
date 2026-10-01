import { getSupabase } from './supabase';
import { getAllPosts } from './posts';
import { rowToPost } from './articles';
import { sanitizeSlug, httpError, dbError } from './adminArticles';

// A saga groups blog posts in order. Optionally one post is its introduction:
// it always comes first and isn't numbered; the rest are "Parte 1, 2, …".

export function rowToSaga(r) {
  return {
    slug: r.slug,
    title: r.title,
    description: r.description ?? '',
    coverImage: r.cover_image ?? '',
  };
}

// Display order: intro first, then saga_order, then oldest first.
export function orderParts(parts) {
  return [...parts].sort(
    (a, b) =>
      Number(b.sagaIntro) - Number(a.sagaIntro) ||
      (a.sagaOrder ?? 0) - (b.sagaOrder ?? 0) ||
      new Date(a.date) - new Date(b.date),
  );
}

// Attach a human label to each ordered part: "Introducción" or "Parte N".
export function labelParts(ordered) {
  let n = 0;
  return ordered.map((p) => ({
    ...p,
    partNumber: p.sagaIntro ? null : ++n,
    partLabel: p.sagaIntro ? 'Introducción' : `Parte ${n}`,
  }));
}

// Build a saga object from its row and its published posts.
function assemble(saga, posts) {
  const parts = labelParts(orderParts(posts));
  const intro = parts.find((p) => p.sagaIntro) ?? null;
  const numbered = parts.filter((p) => !p.sagaIntro);
  return {
    ...saga,
    parts,
    intro,
    totalParts: numbered.length,
    count: parts.length,
    // Most recent activity, to sort sagas among standalone posts.
    date: parts.reduce((max, p) => (p.date > max ? p.date : max), ''),
    games: [...new Set(parts.map((p) => p.game).filter(Boolean))],
    coverImage: saga.coverImage || intro?.coverImage || parts.find((p) => p.coverImage)?.coverImage || '',
  };
}

async function fetchSagaRows(slug) {
  let q = getSupabase().from('sagas').select('*');
  if (slug) q = q.eq('slug', slug);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(rowToSaga);
}

// ── Public ──────────────────────────────────────────────────────────────────

// Every saga that has at least one published post, with its ordered parts.
// Pass `posts` (from getAllPosts) to avoid fetching them twice.
export async function getPublishedSagas(posts) {
  try {
    const [rows, all] = await Promise.all([fetchSagaRows(), posts ?? getAllPosts()]);
    return rows
      .map((saga) => assemble(saga, all.filter((p) => p.sagaSlug === saga.slug)))
      .filter((s) => s.count > 0)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (e) {
    console.error('[supabase] list sagas:', e?.message ?? e);
    return [];
  }
}

// One saga with its published parts, or null.
export async function getSaga(slug) {
  try {
    const [rows, all] = await Promise.all([fetchSagaRows(slug), getAllPosts()]);
    if (!rows.length) return null;
    const saga = assemble(rows[0], all.filter((p) => p.sagaSlug === slug));
    return saga.count > 0 ? saga : null;
  } catch (e) {
    console.error(`[supabase] get saga ${slug}:`, e?.message ?? e);
    return null;
  }
}

// Where a post sits in its saga: { saga, index, current, prev, next } or null.
export async function getSagaContext(post) {
  if (!post?.sagaSlug) return null;
  const saga = await getSaga(post.sagaSlug);
  if (!saga) return null;
  const index = saga.parts.findIndex((p) => p.slug === post.slug);
  if (index === -1) return null;
  return {
    saga,
    index,
    current: saga.parts[index],
    prev: saga.parts[index - 1] ?? null,
    next: saga.parts[index + 1] ?? null,
  };
}

// ── Admin (includes drafts) ─────────────────────────────────────────────────

async function adminPosts(sagaSlug) {
  let q = getSupabase().from('posts').select('*').not('saga_slug', 'is', null);
  if (sagaSlug) q = q.eq('saga_slug', sagaSlug);
  const { data, error } = await q;
  if (error) throw dbError(error);
  return (data ?? []).map(rowToPost);
}

export async function adminListSagas() {
  const [rows, posts] = await Promise.all([fetchSagaRows().catch((e) => { throw dbError(e); }), adminPosts()]);
  return rows
    .map((saga) => ({
      ...saga,
      parts: labelParts(orderParts(posts.filter((p) => p.sagaSlug === saga.slug))).map(
        ({ slug, title, published, sagaIntro, partLabel, date }) => ({ slug, title, published, sagaIntro, partLabel, date }),
      ),
    }))
    .sort((a, b) => a.title.localeCompare(b.title, 'es'));
}

function sagaRow(body) {
  return {
    title: String(body.title ?? '').trim(),
    description: String(body.description ?? '').trim(),
    cover_image: String(body.coverImage ?? '').trim(),
  };
}

export async function adminCreateSaga(body) {
  const slug = sanitizeSlug(body.slug || body.title);
  const row = sagaRow(body);
  if (!row.title) throw httpError(400, 'El título es obligatorio');
  if (!slug) throw httpError(400, 'El slug es obligatorio');
  const { error } = await getSupabase().from('sagas').insert({ slug, ...row });
  if (error) {
    if (error.code === '23505') throw httpError(409, 'Ya existe una saga con ese slug');
    throw dbError(error);
  }
  return slug;
}

export async function adminUpdateSaga(slug, body) {
  const row = sagaRow(body);
  if (!row.title) throw httpError(400, 'El título es obligatorio');
  const { data, error } = await getSupabase()
    .from('sagas')
    .update({ ...row, updated_at: new Date().toISOString() })
    .eq('slug', slug)
    .select('slug');
  if (error) throw dbError(error);
  if (!data?.length) throw httpError(404, 'Saga no encontrada');
}

// Deleting a saga keeps its posts: the FK sets their saga to null. Clear the
// intro flag too, so a post doesn't keep a meaningless "introducción" mark.
export async function adminDeleteSaga(slug) {
  const { error: e1 } = await getSupabase()
    .from('posts').update({ saga_intro: false, saga_order: 0 }).eq('saga_slug', slug);
  if (e1) throw dbError(e1);
  const { data, error } = await getSupabase().from('sagas').delete().eq('slug', slug).select('slug');
  if (error) throw dbError(error);
  if (!data?.length) throw httpError(404, 'Saga no encontrada');
}

// Reorder the numbered parts of a saga: `slugs` is the desired order (the
// intro, if included, is ignored — it is always first).
export async function adminReorderSaga(sagaSlug, slugs) {
  if (!Array.isArray(slugs)) throw httpError(400, 'slugs debe ser una lista');
  const posts = await adminPosts(sagaSlug);
  const inSaga = new Set(posts.filter((p) => !p.sagaIntro).map((p) => p.slug));
  const ordered = slugs.filter((s) => inSaga.has(s));
  if (ordered.length !== inSaga.size) throw httpError(400, 'La lista no coincide con los posts de la saga');
  const results = await Promise.all(
    ordered.map((slug, i) =>
      getSupabase().from('posts').update({ saga_order: i + 1 }).eq('slug', slug).eq('saga_slug', sagaSlug),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed) throw dbError(failed.error);
}
