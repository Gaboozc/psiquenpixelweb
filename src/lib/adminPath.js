// ADMIN_BASE: the secret URL prefix for the admin panel.
// The proxy (src/proxy.js) serves the panel under this prefix and rewrites to
// the internal /admin/* routes, while 404-ing direct /admin access. This must
// match the secret base used in proxy.js. Override with NEXT_PUBLIC_ADMIN_PATH.
export const ADMIN_BASE = process.env.NEXT_PUBLIC_ADMIN_PATH ?? '/pnp-vault';

// Build an admin URL — usage: ap('/posts') → '/pnp-vault/posts'
export function ap(subpath = '') {
  return `${ADMIN_BASE}${subpath}`;
}
