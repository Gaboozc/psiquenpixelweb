import { NextResponse } from 'next/server';
import {
  signSession, getSessionSecret, adminEmails, SESSION_COOKIE, SESSION_MAX_AGE,
} from '@/lib/adminAuth';
import { signInWithPassword } from '@/lib/supabaseAuth';

export const runtime = 'nodejs';

const fail = (error, status) => NextResponse.json({ error }, { status });
// Same message for "wrong password", "unknown user" and "not an admin" so the
// response never reveals which emails exist.
const BAD_CREDENTIALS = 'Email o contraseña incorrectos';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');

  if (!email || !password) return fail('Introduce tu email y contraseña', 400);

  // Server misconfiguration → say so clearly (it's not the user's fault).
  if (!getSessionSecret()) {
    console.error('[admin login] sin clave de sesión (SUPABASE_SERVICE_ROLE_KEY / ADMIN_SECRET)');
    return fail('El servidor no está configurado: falta la clave de sesión.', 503);
  }
  const allowed = adminEmails();
  if (allowed.length === 0) {
    console.error('[admin login] ADMIN_EMAILS vacío: nadie puede entrar');
    return fail('El servidor no está configurado: falta ADMIN_EMAILS.', 503);
  }

  // Being a Supabase user is not enough — the email must be on the allow-list.
  if (!allowed.includes(email)) return fail(BAD_CREDENTIALS, 401);

  const result = await signInWithPassword(email, password);
  if (!result.ok) {
    console.error(`[admin login] ${result.code}: ${result.message}`);
    if (result.code === 'invalid') return fail(BAD_CREDENTIALS, 401);
    if (result.code === 'unconfirmed') {
      return fail('Tu email no está confirmado en Supabase (Authentication → Users).', 401);
    }
    return fail('No se pudo verificar con Supabase. Revisa la configuración del servidor.', 502);
  }
  // Defence in depth: trust the email Supabase returns, not only the typed one.
  if (!allowed.includes(result.email)) return fail(BAD_CREDENTIALS, 401);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, signSession({ email: result.email, iat: Date.now() }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
  return response;
}
