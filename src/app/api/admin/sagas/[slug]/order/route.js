import { NextResponse } from 'next/server';
import { adminReorderSaga } from '@/lib/sagas';
import { errorResponse } from '@/lib/adminArticles';
import { revalidateSaga } from '@/lib/revalidate';

export const runtime = 'nodejs';

// Body: { slugs: string[] } — the numbered parts in their new order.
export async function PUT(request, { params }) {
  try {
    const { slug } = await params;
    const { slugs } = await request.json();
    await adminReorderSaga(slug, slugs);
    revalidateSaga(slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
