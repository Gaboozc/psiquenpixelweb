import { NextResponse } from 'next/server';
import { addSubscriber, isValidEmail, normalizeEmail } from '@/lib/subscribers';

export const runtime = 'nodejs';

// Public endpoint used by the footer form. (The admin list/delete endpoints live
// under /api/admin/newsletter and require a session.)
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = normalizeEmail(body.email);

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const created = await addSubscriber(email);
    return NextResponse.json({ ok: true, message: created ? undefined : 'Ya estás suscrito' });
  } catch (e) {
    console.error('[newsletter] subscribe failed:', e?.message ?? e);
    return NextResponse.json({ error: 'Error procesando suscripción' }, { status: 500 });
  }
}
