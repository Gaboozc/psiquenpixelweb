import { NextResponse } from 'next/server';
import { adminGet, adminUpdate, adminDelete, errorResponse } from '@/lib/adminArticles';
import { revalidateCatalogo } from '@/lib/revalidate';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const game = await adminGet('games', slug);
    if (!game) return NextResponse.json({ error: 'Análisis no encontrado' }, { status: 404 });
    return NextResponse.json(game);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function PUT(request, { params }) {
  try {
    const { slug } = await params;
    await adminUpdate('games', slug, await request.json());
    revalidateCatalogo(slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = await params;
    await adminDelete('games', slug);
    revalidateCatalogo(slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
