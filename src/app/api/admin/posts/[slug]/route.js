import { NextResponse } from 'next/server';
import { adminGet, adminUpdate, adminDelete, errorResponse } from '@/lib/adminArticles';
import { revalidateBlog } from '@/lib/revalidate';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const post = await adminGet('posts', slug);
    if (!post) return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    return NextResponse.json(post);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function PUT(request, { params }) {
  try {
    const { slug } = await params;
    await adminUpdate('posts', slug, await request.json());
    revalidateBlog(slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = await params;
    await adminDelete('posts', slug);
    revalidateBlog(slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
