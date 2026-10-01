import MazmorraSelector from '@/components/admin/MazmorraSelector';
import { getAllPosts } from '@/lib/posts';
import { readContent } from '@/lib/siteContent';

// Always reflect current data in the admin.
export const dynamic = 'force-dynamic';

export default async function MazmorraPage() {
  const [posts, current] = await Promise.all([getAllPosts(), readContent('mazmorra')]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-brand-text text-lg font-body font-bold">Mazmorra de la Semana</h1>
        <p className="text-brand-muted text-sm font-body">
          Selecciona qué post aparece destacado en el footer del sitio.
        </p>
      </div>
      <MazmorraSelector games={posts} current={current} />
    </div>
  );
}
