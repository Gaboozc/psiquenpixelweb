import { revalidatePath } from 'next/cache';

// The public /blog and /catalogo pages are statically generated, so admin edits
// don't appear until the affected paths are revalidated on-demand. These helpers
// are called from the admin route handlers after a successful write.

export function revalidateBlog(slug) {
  revalidatePath('/blog');
  if (slug) revalidatePath(`/blog/${slug}`);
}

export function revalidateCatalogo(slug) {
  revalidatePath('/catalogo');
  if (slug) revalidatePath(`/catalogo/${slug}`);
}

// Footer content (settings links + mazmorra de la semana) renders on every page
// via the root layout — including the static /blog and /catalogo pages. Purge
// the whole layout so those footers refresh too.
export function revalidateSiteChrome() {
  revalidatePath('/', 'layout');
}
