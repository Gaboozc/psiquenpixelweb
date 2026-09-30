import { NextResponse } from 'next/server';

// Match everything except Next.js internals and static public assets.
// The proxy function itself guards only admin-related paths.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|iconos|footer-icons|video|uploads|cards\\.png|navbar-background\\.png|logo).*)'],
};

// ---------------------------------------------------------------------------
// HMAC-SHA256 verification (Web Crypto — Edge-runtime compatible)
// ---------------------------------------------------------------------------
function base64urlDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function verifySession(token) {
  const secret = process.env.ADMIN_SECRET ?? 'dev-secret-change-in-production';
  if (!token) return false;
  const dotIdx = token.lastIndexOf('.');
  if (dotIdx === -1) return false;
  const payload = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    return crypto.subtle.verify('HMAC', key, base64urlDecode(sig), enc.encode(payload));
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Proxy function
// ---------------------------------------------------------------------------
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // The admin URL prefix (matches NEXT_PUBLIC_ADMIN_PATH / adminPath.js).
  const adminBase = process.env.NEXT_PUBLIC_ADMIN_PATH ?? '/admin';
  const loginPath = `${adminBase}/login`;

  // ── 1. Protect admin API routes ─────────────────────────────────────────
  if (pathname.startsWith('/api/admin/')) {
    // Auth and logout endpoints don't need a valid session
    if (pathname === '/api/admin/auth/login' || pathname === '/api/admin/auth/logout') {
      return NextResponse.next();
    }
    const token = request.cookies.get('pnp_admin_session')?.value;
    if (!token || !(await verifySession(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // ── 2. Gate the admin panel ─────────────────────────────────────────────
  if (pathname === adminBase || pathname.startsWith(`${adminBase}/`)) {
    // Login page: no auth required
    if (pathname === loginPath || pathname === `${loginPath}/`) {
      return NextResponse.next();
    }

    // All other admin pages: require a valid session
    const token = request.cookies.get('pnp_admin_session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
    const valid = await verifySession(token);
    if (!valid) {
      const res = NextResponse.redirect(new URL(loginPath, request.url));
      res.cookies.delete('pnp_admin_session');
      return res;
    }
    return NextResponse.next();
  }

  // ── 3. All other routes pass through ────────────────────────────────────
  return NextResponse.next();
}
