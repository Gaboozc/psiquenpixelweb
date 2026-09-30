import crypto from 'crypto';

const SECRET = process.env.ADMIN_SECRET ?? 'dev-secret-change-in-production';

// Hardcoded admin password to start; overridable via ADMIN_PASSWORD env.
// TODO: reemplazar por validación contra Supabase Auth.
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'psiquenpixel-admin';

export function signSession(data) {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySession(token) {
  if (!token) return null;
  const dotIdx = token.lastIndexOf('.');
  if (dotIdx === -1) return null;
  const payload = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  const expectedSig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
  } catch {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = 'pnp_admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
