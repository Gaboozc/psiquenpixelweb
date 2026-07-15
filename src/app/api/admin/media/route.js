import { NextResponse } from 'next/server';
import { getMedia, writeMedia, normalizeMedia } from '@/lib/media';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getMedia());
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const data = normalizeMedia(body);
    await writeMedia(data);
    return NextResponse.json({ ok: true, media: data });
  } catch {
    return NextResponse.json({ error: 'Error guardando Media' }, { status: 500 });
  }
}
