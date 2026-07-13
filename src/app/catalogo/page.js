import PageWrapper from '@/components/layout/PageWrapper';
import GamesExplorer from '@/components/catalogo/GamesExplorer';
import { getAllGames } from '@/lib/catalog';

export const metadata = {
  title: 'Catálogo',
  description: 'Análisis de videojuegos desde una perspectiva psicológica, narrativa y cultural.',
};

export default function CatalogoPage() {
  const games = getAllGames();

  return (
    <PageWrapper
      title="Catálogo"
      subtitle="Análisis psicológico, narrativo y cultural de videojuegos"
    >
      {games.length === 0 ? (
        <div className="pixel-border-amber p-12 text-center flex flex-col items-center gap-4"
          style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <p className="text-brand-amber text-[9px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
            ▓▓▓
          </p>
          <p className="text-brand-muted text-sm font-body">
            La mazmorra está en construcción. Vuelve pronto.
          </p>
        </div>
      ) : (
        <GamesExplorer games={games} />
      )}
    </PageWrapper>
  );
}
