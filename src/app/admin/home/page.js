import { getHome } from '@/lib/home';
import HomeEditor from '@/components/admin/HomeEditor';

export default async function AdminHomePage() {
  const home = await getHome();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-brand-text text-lg font-body font-bold">Home / Portada</h1>
        <p className="text-brand-muted text-sm font-body">
          Frases del hero, botones, vídeo de fondo y los banners de Media y Comunidad.
        </p>
      </div>
      <HomeEditor initial={home} />
    </div>
  );
}
