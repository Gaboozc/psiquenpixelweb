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

  // The secret admin URL prefix (must match NEXT_PUBLIC_ADMIN_PATH in .env.local)
  const secretBase = process.env.NEXT_PUBLIC_ADMIN_PATH ?? '/pnp-vault';
  const loginPath = `${secretBase}/login`;

  // ── 1. Block direct access to the /admin filesystem path ────────────────
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return new Response('Not Found', { status: 404 });
  }

  // ── 2. Protect admin API routes ─────────────────────────────────────────
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

  // ── 3. Handle the secret admin path ─────────────────────────────────────
  if (pathname === secretBase || pathname.startsWith(`${secretBase}/`)) {
    // Login page: no auth required — rewrite to internal /admin/login
    if (pathname === loginPath || pathname === `${loginPath}/`) {
      return NextResponse.rewrite(new URL('/admin/login', request.url));
    }

    // All other admin pages: require valid session
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

    // Rewrite secret path → internal /admin path (URL stays secret in browser)
    const internalPath = pathname.replace(secretBase, '/admin');
    const rewriteUrl = new URL(internalPath + request.nextUrl.search, request.url);
    return NextResponse.rewrite(rewriteUrl);
  }

  // ── 4. All other routes pass through ────────────────────────────────────
  return NextResponse.next();
}
