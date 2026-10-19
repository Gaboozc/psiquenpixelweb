import SagasManager from '@/components/admin/SagasManager';
import { adminListSagas } from '@/lib/sagas';

// Always reflect current data in the admin.
export const dynamic = 'force-dynamic';

export default async function AdminSagasPage() {
  let sagas = [];
  let error = null;
  try {
    sagas = await adminListSagas();
  } catch (e) {
    error = e.message;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-brand-text text-lg font-body font-bold">Sagas</h1>
        <p className="text-brand-muted text-sm font-body">
          Agrupa posts del mismo juego o tema. En el blog, cada saga ocupa una sola tarjeta y tiene su propia
          página con la introducción y las partes en orden.
        </p>
        {error && <p className="text-red-400 text-sm font-body mt-2">No se pudieron cargar las sagas: {error}</p>}
      </div>
      <SagasManager sagas={sagas} />
    </div>
  );
}
