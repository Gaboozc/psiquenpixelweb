import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'newsletter.json');

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    let subscribers = [];
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf8');
      subscribers = JSON.parse(raw);
    } catch {
      // File doesn't exist yet
    }

    if (subscribers.includes(email)) {
      return NextResponse.json({ ok: true, message: 'Ya estás suscrito' });
    }

    subscribers.push(email);
    await fs.writeFile(DATA_FILE, JSON.stringify(subscribers, null, 2), 'utf8');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error procesando suscripción' }, { status: 500 });
  }
}
