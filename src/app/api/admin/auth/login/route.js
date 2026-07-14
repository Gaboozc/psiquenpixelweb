import { NextResponse } from 'next/server';
import { signSession, ADMIN_PASSWORD, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/adminAuth';

export const runtime = 'nodejs';

export async function POST(request) {
  const { password } = await request.json();

  if (!password || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  const token = signSession({ iat: Date.now() });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
  return response;
}
