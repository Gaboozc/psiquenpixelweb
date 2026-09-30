import { getComunidad } from '@/lib/comunidad';
import ComunidadEditor from '@/components/admin/ComunidadEditor';

// Always reflect current data in the admin.
export const dynamic = 'force-dynamic';

export default async function AdminComunidadPage() {
  const comunidad = await getComunidad();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-brand-text text-lg font-body font-bold">Comunidad</h1>
        <p className="text-brand-muted text-sm font-body">
          Textos de las secciones de Twitch y Discord. Los enlaces se editan en Ajustes.
        </p>
      </div>
      <ComunidadEditor initial={comunidad} />
    </div>
  );
}
