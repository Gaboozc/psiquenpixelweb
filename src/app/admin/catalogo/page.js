import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import DeleteButton from '@/components/admin/DeleteButton';
import { ap } from '@/lib/adminPath';

async function getGames() {
  const dir = path.join(process.cwd(), 'src', 'content', 'catalogo');
  const files = (await fs.readdir(dir).catch(() => [])).filter((f) => f.endsWith('.md'));
  const games = await Promise.all(
    files.map(async (filename) => {
      const raw = await fs.readFile(path.join(dir, filename), 'utf8');
      const { data } = matter(raw);
      return {
        slug:  data.slug ?? filename.replace('.md', ''),
        game:  data.game ?? '—',
        title: data.title ?? '—',
        date:  data.date ?? '',
        genre: (data.genre ?? []).join(', '),
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

      {games.length === 0 ? (
        <div className="pixel-border p-12 text-center"
          style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <p className="text-brand-muted text-sm font-body">No hay análisis aún.</p>
          <Link href={ap('/catalogo/new')} className="inline-block mt-4 text-brand-amber text-xs font-body hover:underline">
            Crear el primero →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body border-collapse">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal" style={{ fontFamily: 'var(--font-pixel)' }}>JUEGO</th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal hidden md:table-cell" style={{ fontFamily: 'var(--font-pixel)' }}>ANÁLISIS</th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal hidden sm:table-cell" style={{ fontFamily: 'var(--font-pixel)' }}>GÉNERO</th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal hidden lg:table-cell" style={{ fontFamily: 'var(--font-pixel)' }}>FECHA</th>
                <th className="text-right py-2" />
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.slug} className="border-b border-brand-border/50 hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4">
                    <Link href={`/catalogo/${game.slug}`} target="_blank" className="text-brand-amber hover:text-brand-amber-dim transition-colors font-medium">
                      {game.game}
                    </Link>
                    <span className="text-brand-border text-[10px] block">{game.slug}</span>
                  </td>
                  <td className="py-3 pr-4 text-brand-muted hidden md:table-cell line-clamp-1">{game.title}</td>
                  <td className="py-3 pr-4 text-brand-muted hidden sm:table-cell">{game.genre}</td>
                  <td className="py-3 pr-4 text-brand-muted hidden lg:table-cell">{game.date}</td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <Link href={ap(`/catalogo/${game.slug}/edit`)}
                      className="text-brand-muted hover:text-brand-purple text-xs mr-4 transition-colors font-body">
                      Editar
                    </Link>
                    <DeleteButton slug={game.slug} type="catalogo" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
