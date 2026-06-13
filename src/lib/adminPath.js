// ADMIN_BASE: the secret URL prefix for the admin panel
// Set NEXT_PUBLIC_ADMIN_PATH in .env.local — e.g. NEXT_PUBLIC_ADMIN_PATH=/pnp-vault
// Falls back to /pnp-vault if not configured.
export const ADMIN_BASE = process.env.NEXT_PUBLIC_ADMIN_PATH ?? '/pnp-vault';

// Build an admin URL — usage: ap('/posts') → '/pnp-vault/posts'
export function ap(subpath = '') {
  return `${ADMIN_BASE}${subpath}`;
}
