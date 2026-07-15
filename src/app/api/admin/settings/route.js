import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getSettings, DEFAULT_SETTINGS } from '@/lib/settings';

export const runtime = 'nodejs';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'settings.json');

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
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return NextResponse.json({ ok: true, settings: data });
  } catch {
    return NextResponse.json({ error: 'Error guardando ajustes' }, { status: 500 });
  }
}
