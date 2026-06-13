import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/admin/:path*'],
};

function base64urlDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function verifyEdgeSession(token) {
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
    const sigBytes = base64urlDecode(sig);
    return crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(payload));
  } catch {
    return false;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') return NextResponse.next();

  const sessionCookie = request.cookies.get('pnp_admin_session');
  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const valid = await verifyEdgeSession(sessionCookie.value);
  if (!valid) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('pnp_admin_session');
    return response;
  }

  return NextResponse.next();
}
