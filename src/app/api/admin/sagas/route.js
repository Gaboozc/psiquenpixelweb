import { NextResponse } from 'next/server';
import { adminListSagas, adminCreateSaga } from '@/lib/sagas';
import { errorResponse } from '@/lib/adminArticles';
import { revalidateSaga } from '@/lib/revalidate';

export const runtime = 'nodejs';

export async function GET() {
  try {
    return NextResponse.json(await adminListSagas());
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(request) {
  try {
    const slug = await adminCreateSaga(await request.json());
    revalidateSaga(slug);
    return NextResponse.json({ ok: true, slug }, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}
