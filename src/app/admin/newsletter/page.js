import SubscribersTable from '@/components/admin/SubscribersTable';
import { listSubscribers } from '@/lib/subscribers';

async function getSubscribers() {
  try {
    return { subscribers: await listSubscribers(), error: null };
  } catch (e) {
    return { subscribers: [], error: e.message };
  }
}

// Always reflect current data in the admin.
export const dynamic = 'force-dynamic';

export default async function AdminNewsletterPage() {
  const { subscribers, error } = await getSubscribers();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-brand-text text-lg font-body font-bold">Newsletter</h1>
        <p className="text-brand-muted text-sm font-body">
          {subscribers.length === 0
            ? 'Sin suscriptores aún.'
            : `${subscribers.length} suscriptor${subscribers.length !== 1 ? 'es' : ''}`}
        </p>
        {error && <p className="text-red-400 text-sm font-body mt-2">No se pudieron cargar: {error}</p>}
      </div>

      <SubscribersTable initialSubscribers={subscribers} />
    </div>
  );
}
