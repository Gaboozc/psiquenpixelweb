import { revalidatePath } from 'next/cache';

// The public /blog pages are statically generated, so admin edits don't appear
// until the affected paths are revalidated on-demand. These helpers are called
// from the admin route handlers after a successful write.

// A post changed: the blog index, the post itself and any saga page it belongs
// (or belonged) to. Pass every saga slug that may be affected.
export function revalidateBlog(slug, ...sagaSlugs) {
  revalidatePath('/blog');
  revalidatePath('/'); // home shows the latest posts
  if (slug) revalidatePath(`/blog/${slug}`);
  for (const saga of new Set(sagaSlugs.filter(Boolean))) revalidateSaga(saga);
}

// A saga changed: its page, the blog index (saga cards) and every post page,
// since each part shows the saga navigator.
export function revalidateSaga(sagaSlug) {
  revalidatePath('/blog');
  if (sagaSlug) revalidatePath(`/blog/saga/${sagaSlug}`);
  revalidatePath('/blog/[slug]', 'page');
}

// Footer content (settings links + mazmorra de la semana) renders on every page
// via the root layout — including the static /blog pages. Purge the whole
// layout so those footers refresh too.
export function revalidateSiteChrome() {
  revalidatePath('/', 'layout');
}
