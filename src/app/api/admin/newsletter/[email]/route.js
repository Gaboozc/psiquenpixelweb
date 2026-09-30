import { NextResponse } from 'next/server';
import { removeSubscriber, normalizeEmail } from '@/lib/subscribers';

export const runtime = 'nodejs';

export async function DELETE(request, { params }) {
  try {
    const { email: raw } = await params;
    const removed = await removeSubscriber(normalizeEmail(decodeURIComponent(raw)));
    if (!removed) {
      return NextResponse.json({ error: 'Suscriptor no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
