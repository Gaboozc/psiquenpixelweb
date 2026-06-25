import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'newsletter.json');

async function readSubscribers() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    // backward compat: old format was plain string array
    return data.map((entry) =>
      typeof entry === 'string' ? { email: entry, subscribedAt: '' } : entry
    );
  } catch {
    return [];
  }
}

export async function GET() {
  const subscribers = await readSubscribers();
  return NextResponse.json({ subscribers, total: subscribers.length });
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const subscribers = await readSubscribers();

    if (subscribers.some((s) => s.email === email)) {
      return NextResponse.json({ ok: true, message: 'Ya estás suscrito' });
    }

    subscribers.push({ email, subscribedAt: new Date().toISOString() });
    await fs.writeFile(DATA_FILE, JSON.stringify(subscribers, null, 2), 'utf8');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error procesando suscripción' }, { status: 500 });
  }
}
