import { NextResponse } from 'next/server';
import { readContent, writeContent } from '@/lib/siteContent';
import { revalidateSiteChrome } from '@/lib/revalidate';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await readContent('mazmorra'));
}

export async function PUT(request) {
  try {
    const { slug, game, title, excerpt, coverImage } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'slug es obligatorio' }, { status: 400 });
    }

    const data = { slug, game: game || '', title: title || '', excerpt: excerpt || '', coverImage: coverImage || '' };
    await writeContent('mazmorra', data);
    revalidateSiteChrome();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Error actualizando mazmorra' }, { status: 500 });
  }
}
