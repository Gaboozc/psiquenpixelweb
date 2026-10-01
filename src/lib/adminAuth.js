import crypto from 'crypto';

// ---------------------------------------------------------------------------
// Admin session = a signed cookie, issued only after a successful Supabase Auth
// sign-in by an allow-listed email. The proxy (src/proxy.js) verifies the same
// signature at the edge.
//
// Fail closed: with no signing secret configured, NO session is ever valid.
// (There is deliberately no built-in default secret.)
// ---------------------------------------------------------------------------

export const SESSION_COOKIE = 'pnp_admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

// ADMIN_SECRET if set; otherwise derived from the (already required, server-only)
// service-role key so production doesn't need an extra variable. Must match the
// derivation in src/proxy.js.
export function getSessionSecret() {
  if (process.env.ADMIN_SECRET) return process.env.ADMIN_SECRET;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return key ? `pnp-admin:${key}` : null;
}

// Emails allowed into the admin (comma-separated ADMIN_EMAILS, case-insensitive).
export function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

const hmac = (secret, payload) => crypto.createHmac('sha256', secret).update(payload).digest('base64url');

export function signSession(data) {
  const secret = getSessionSecret();
  if (!secret) throw new Error('Sin clave de sesión: define SUPABASE_SERVICE_ROLE_KEY o ADMIN_SECRET.');
  const payload = Buffer.from(
    JSON.stringify({ ...data, exp: Date.now() + SESSION_MAX_AGE * 1000 }),
  ).toString('base64url');
  return `${payload}.${hmac(secret, payload)}`;
}

// Returns the session data, or null if missing / forged / expired.
export function verifySession(token) {
  const secret = getSessionSecret();
  if (!secret || !token) return null;
  const dotIdx = token.lastIndexOf('.');
  if (dotIdx === -1) return null;
  const payload = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(hmac(secret, payload));
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.exp || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}
