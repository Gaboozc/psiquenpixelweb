import { NextResponse } from 'next/server';
import { adminList, adminCreate, errorResponse } from '@/lib/adminArticles';
import { revalidateBlog } from '@/lib/revalidate';

export const runtime = 'nodejs';

export async function GET() {
  try {
    return NextResponse.json(await adminList());
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(request) {
  try {
    const { slug, sagaSlug } = await adminCreate(await request.json());
    revalidateBlog(slug, sagaSlug);
    return NextResponse.json({ ok: true, slug }, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}
