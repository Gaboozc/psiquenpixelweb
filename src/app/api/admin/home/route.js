import { NextResponse } from 'next/server';
import { getHome, writeHome, normalizeHome } from '@/lib/home';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getHome());
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const data = normalizeHome(body);
    await writeHome(data);
    return NextResponse.json({ ok: true, home: data });
  } catch {
    return NextResponse.json({ error: 'Error guardando Home' }, { status: 500 });
  }
}
