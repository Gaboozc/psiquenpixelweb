import { marked } from 'marked';
import { getSupabase } from './supabase';
import { readingTime, withHeadingIds } from './reading';

// Data access for blog posts (which include the game analyses), backed by the
// Supabase `posts` table. Public pages only see published rows.
// Reads never throw: on a missing/misconfigured Supabase they log and return an
// empty result, so a build or page render degrades to "no content yet".

function fail(scope, error) {
  console.error(`[supabase] ${scope}:`, error?.message ?? error);
}

// Row (snake_case) → object used by the UI (camelCase, same shape the markdown
// frontmatter had), so components keep working unchanged.
export function rowToPost(r) {
  return {
    slug: r.slug,
    title: r.title,
    date: r.date,
    category: r.category,
    excerpt: r.excerpt,
    coverImage: r.cover_image,
    tags: r.tags ?? [],
    content: r.content,
    published: r.published,
    game: r.game ?? '',
    sagaSlug: r.saga_slug ?? null,
    sagaOrder: r.saga_order ?? 0,
    sagaIntro: r.saga_intro ?? false,
  };
}

// Newest-first list of published rows. Card lists don't need the body.
export async function listPublished(table, mapRow, { limit } = {}) {
  try {
    let q = getSupabase()
      .from(table)
      .select('*')
      .eq('published', true)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []).map((r) => {
      const { content, ...card } = mapRow(r);
      return card;
    });
  } catch (e) {
    fail(`list ${table}`, e);
    return [];
  }
}

// One published row with the body rendered to HTML (+ headings for the TOC).
export async function getPublished(table, mapRow, slug) {
  try {
    const { data, error } = await getSupabase()
      .from(table)
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const item = mapRow(data);
    // Bodies are HTML from the visual editor (or legacy Markdown); marked
    // passes HTML through untouched.
    const { html, headings } = withHeadingIds(marked.parse(item.content ?? ''));
    return { ...item, content: html, headings, readingTime: readingTime(item.content ?? '') };
  } catch (e) {
    fail(`get ${table}/${slug}`, e);
    return null;
  }
}

// ── Pure helpers over an already-fetched, newest-first list ──────────────────

// { prev, next } neighbours (newest-first list → prev=older, next=newer).
export function adjacentOf(list, slug) {
  const idx = list.findIndex((x) => x.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    next: idx > 0 ? list[idx - 1] : null,
    prev: idx < list.length - 1 ? list[idx + 1] : null,
  };
}

// Items sharing the most tags with `slug` (excludes itself).
export function relatedOf(list, slug, limit = 3) {
  const current = list.find((x) => x.slug === slug);
  if (!current) return [];
  const currentTags = new Set(current.tags ?? []);
  return list
    .filter((x) => x.slug !== slug)
    .map((item) => ({ item, score: (item.tags ?? []).filter((t) => currentTags.has(t)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.item.date) - new Date(a.item.date))
    .slice(0, limit)
    .map((x) => x.item);
}

export function tagsOf(list) {
  const tags = new Set();
  list.forEach((x) => (x.tags ?? []).forEach((t) => tags.add(t)));
  return [...tags].sort((a, b) => a.localeCompare(b, 'es'));
}

export function byTag(list, tag) {
  const needle = String(tag).toLowerCase();
  return list.filter((x) => (x.tags ?? []).some((t) => t.toLowerCase() === needle));
}
