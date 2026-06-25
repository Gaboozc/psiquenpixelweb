import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import GamesTable from '@/components/admin/GamesTable';
import { ap } from '@/lib/adminPath';

async function getGames() {
  const dir = path.join(process.cwd(), 'src', 'content', 'catalogo');
  const files = (await fs.readdir(dir).catch(() => [])).filter((f) => f.endsWith('.md'));
  const games = await Promise.all(
    files.map(async (filename) => {
      const raw = await fs.readFile(path.join(dir, filename), 'utf8');
      const { data } = matter(raw);
      return {
        slug:      data.slug      ?? filename.replace('.md', ''),
        game:      data.game      ?? '—',
        title:     data.title     ?? '—',
        date:      data.date      ?? '',
        genre:     (data.genre ?? []).join(', '),
        published: data.published ?? true,
      };
    }),
  );
  return games.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default async function AdminCatalogoPage() {
  const games = await getGames();

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

      <GamesTable games={games} />
    </div>
  );
}
