import { NextResponse } from 'next/server';
import { adminUpdateSaga, adminDeleteSaga } from '@/lib/sagas';
import { errorResponse } from '@/lib/adminArticles';
import { revalidateSaga } from '@/lib/revalidate';

export const runtime = 'nodejs';

export async function PUT(request, { params }) {
  try {
    const { slug } = await params;
    await adminUpdateSaga(slug, await request.json());
    revalidateSaga(slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = await params;
    await adminDeleteSaga(slug);
    revalidateSaga(slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
