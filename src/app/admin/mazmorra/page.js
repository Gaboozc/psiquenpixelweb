import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MazmorraSelector from '@/components/admin/MazmorraSelector';

async function getGamesAndCurrent() {
  const dir = path.join(process.cwd(), 'src', 'content', 'catalogo');
  const mazFile = path.join(process.cwd(), 'src', 'data', 'mazmorra.json');

  const [files, mazRaw] = await Promise.all([
    fs.readdir(dir).catch(() => []),
    fs.readFile(mazFile, 'utf8').catch(() => 'null'),
  ]);

  const games = await Promise.all(
    files
      .filter((f) => f.endsWith('.md'))
      .map(async (filename) => {
        const raw = await fs.readFile(path.join(dir, filename), 'utf8');
        const { data } = matter(raw);
        return {
          slug:    data.slug ?? filename.replace('.md', ''),
          game:    data.game ?? '—',
          title:   data.title ?? '',
          excerpt: data.excerpt ?? '',
          coverImage: data.coverImage ?? '',
        };
      }),
  );

  return { games, current: JSON.parse(mazRaw) };
}

export default async function MazmorraPage() {
  const { games, current } = await getGamesAndCurrent();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-brand-text text-lg font-body font-bold">Mazmorra de la Semana</h1>
        <p className="text-brand-muted text-sm font-body">
          Selecciona qué análisis aparece destacado en el footer del sitio.
        </p>
      </div>
      <MazmorraSelector games={games} current={current} />
    </div>
  );
}
