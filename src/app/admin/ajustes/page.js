import { getSettings } from '@/lib/settings';
import SettingsEditor from '@/components/admin/SettingsEditor';

// Always reflect current data in the admin.
export const dynamic = 'force-dynamic';

export default async function AjustesPage() {
  const settings = await getSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-brand-text text-lg font-body font-bold">Ajustes del Sitio</h1>
        <p className="text-brand-muted text-sm font-body">
          Enlaces de redes sociales y apoyo. Se usan en el footer, Media, Comunidad y la portada.
        </p>
      </div>
      <SettingsEditor initial={settings} />
    </div>
  );
}
