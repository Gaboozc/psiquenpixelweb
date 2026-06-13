import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'mazmorra.json');

export async function GET() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json(null);
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { slug, game, title, excerpt, coverImage } = body;

    if (!slug) {
      return NextResponse.json({ error: 'slug es obligatorio' }, { status: 400 });
    }

    const data = { slug, game: game || slug, title: title || '', excerpt: excerpt || '', coverImage: coverImage || '' };
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error actualizando mazmorra' }, { status: 500 });
  }
}
