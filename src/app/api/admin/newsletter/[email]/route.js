import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'newsletter.json');

async function readSubscribers() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    return data.map((entry) =>
      typeof entry === 'string' ? { email: entry, subscribedAt: '' } : entry
    );
  } catch {
    return [];
  }
}

export async function DELETE(request, { params }) {
  const email = decodeURIComponent(params.email);
  const subscribers = await readSubscribers();
  const filtered = subscribers.filter((s) => s.email !== email);

  if (filtered.length === subscribers.length) {
    return NextResponse.json({ error: 'Suscriptor no encontrado' }, { status: 404 });
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf8');
  return NextResponse.json({ ok: true });
}
