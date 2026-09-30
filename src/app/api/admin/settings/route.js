import { NextResponse } from 'next/server';
import { getSettings, writeSettings, DEFAULT_SETTINGS } from '@/lib/settings';
import { revalidateSiteChrome } from '@/lib/revalidate';

export const runtime = 'nodejs';

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const data = {
      social: { ...DEFAULT_SETTINGS.social, ...(body.social ?? {}) },
      support: { ...DEFAULT_SETTINGS.support, ...(body.support ?? {}) },
    };
    await writeSettings(data);
    revalidateSiteChrome();
    return NextResponse.json({ ok: true, settings: data });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Error guardando ajustes' }, { status: 500 });
  }
}
