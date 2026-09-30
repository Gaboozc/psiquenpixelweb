import { NextResponse } from 'next/server';
import { getComunidad, writeComunidad, normalizeComunidad } from '@/lib/comunidad';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getComunidad());
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const data = normalizeComunidad(body);
    await writeComunidad(data);
    return NextResponse.json({ ok: true, comunidad: data });
  } catch {
    return NextResponse.json({ error: 'Error guardando Comunidad' }, { status: 500 });
  }
}
