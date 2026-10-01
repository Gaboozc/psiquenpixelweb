import { NextResponse } from 'next/server';
import { adminGet, adminUpdate, adminDelete, errorResponse } from '@/lib/adminArticles';
import { revalidateBlog } from '@/lib/revalidate';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const post = await adminGet(slug);
    if (!post) return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    return NextResponse.json(post);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function PUT(request, { params }) {
  try {
    const { slug } = await params;
    const { sagaSlug, previousSagaSlug } = await adminUpdate(slug, await request.json());
    revalidateBlog(slug, sagaSlug, previousSagaSlug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = await params;
    const { sagaSlug } = await adminDelete(slug);
    revalidateBlog(slug, sagaSlug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
