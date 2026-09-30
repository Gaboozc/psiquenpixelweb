import Link from 'next/link';
import GamesTable from '@/components/admin/GamesTable';
import { ap } from '@/lib/adminPath';
import { adminList } from '@/lib/adminArticles';

async function getGames() {
  try {
    const rows = await adminList('games');
    return {
      error: null,
      games: rows.map((r) => ({
        slug: r.slug,
        game: r.game || '—',
        title: r.title || '—',
        date: r.date || '',
        genre: (r.genre ?? []).join(', '),
        published: r.published,
      })),
    };
  } catch (e) {
    return { error: e.message, games: [] };
  }
}

// Always reflect current data in the admin.
export const dynamic = 'force-dynamic';

export default async function AdminCatalogoPage() {
  const { games, error } = await getGames();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-brand-text text-lg font-body font-bold">Catálogo</h1>
          <p className="text-brand-muted text-sm font-body">{games.length} análisis</p>
        </div>
        <Link
          href={ap('/catalogo/new')}
          className="border border-brand-amber text-brand-amber text-xs px-4 py-2 font-body hover:bg-brand-amber/10 transition-colors"
        >
          + Nuevo Análisis
        </Link>
      </div>

      {error && <p className="text-red-400 text-sm font-body mb-4">No se pudieron cargar los análisis: {error}</p>}
      <GamesTable games={games} />
    </div>
  );
}
