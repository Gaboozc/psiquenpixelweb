import PageWrapper from '@/components/layout/PageWrapper';
import GameCard from '@/components/catalogo/GameCard';
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.slug} {...game} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
