import { NextResponse } from 'next/server';
import { listSubscribers } from '@/lib/subscribers';

export const runtime = 'nodejs';

// Admin-only (the proxy requires a session for /api/admin/*).
export async function GET() {
  try {
    const subscribers = await listSubscribers();
    return NextResponse.json({ subscribers, total: subscribers.length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
