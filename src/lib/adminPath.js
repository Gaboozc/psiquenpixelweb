// ADMIN_BASE: the URL prefix for the admin panel.
// The panel lives at /admin (the internal App Router path). The proxy
// (src/proxy.js) gates these routes behind a session. Override with
// NEXT_PUBLIC_ADMIN_PATH if you ever want to serve it under a different prefix.
export const ADMIN_BASE = process.env.NEXT_PUBLIC_ADMIN_PATH ?? '/admin';

// Build an admin URL — usage: ap('/posts') → '/admin/posts'
export function ap(subpath = '') {
  return `${ADMIN_BASE}${subpath}`;
}
