import { promises as fs } from 'fs';
import path from 'path';
import SubscribersTable from '@/components/admin/SubscribersTable';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'newsletter.json');

async function getSubscribers() {
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

export default async function AdminNewsletterPage() {
  const subscribers = await getSubscribers();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-brand-text text-lg font-body font-bold">Newsletter</h1>
        <p className="text-brand-muted text-sm font-body">
          {subscribers.length === 0
            ? 'Sin suscriptores aún.'
            : `${subscribers.length} suscriptor${subscribers.length !== 1 ? 'es' : ''}`}
        </p>
      </div>

      <SubscribersTable initialSubscribers={subscribers} />
    </div>
  );
}
