import { notFound } from 'next/navigation';
import PixelDivider from '@/components/ui/PixelDivider';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getGameBySlug, getAllGames, getAdjacentGames } from '@/lib/catalog';
import { formatDate } from '@/lib/format';

export async function generateStaticParams() {
  const games = getAllGames();
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return { title: 'Análisis no encontrado' };
  return {
    title: `${game.game} — ${game.title}`,
    description: game.excerpt,
    openGraph: {
      title: `${game.game} — ${game.title}`,
      description: game.excerpt,
      images: game.coverImage ? [{ url: game.coverImage }] : [{ url: '/og-image.png' }],
    },
  };
}

export default async function GameAnalysisPage({ params }) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) notFound();

  const { prev, next } = getAdjacentGames(slug);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {game.genre?.map((g) => (
            <Badge key={g} color="amber">{g}</Badge>
          ))}
          {game.date && (
            <span
              className="text-brand-muted text-[8px]"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              {formatDate(game.date)}
            </span>
          )}
        </div>

        <p
          className="text-brand-amber text-[9px] tracking-widest uppercase mb-3"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          {game.game}
        </p>

        <h1
          className="text-brand-text text-2xl md:text-3xl leading-tight mb-4"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          {game.title}
        </h1>

        <p className="text-brand-muted text-base leading-relaxed font-body">
          {game.excerpt}
        </p>
      </header>

      <PixelDivider className="mb-10" />

      {/* Body */}
      <div
        className="prose prose-invert max-w-none font-body text-brand-text leading-relaxed"
        dangerouslySetInnerHTML={{ __html: game.content }}
      />

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-brand-border">
        {game.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {game.tags.map((tag) => (
              <Badge key={tag} color="muted">#{tag}</Badge>
            ))}
          </div>
        )}

        {/* Prev / Next navigation */}
        {(prev || next) && (
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" aria-label="Navegación entre análisis">
            {prev ? (
              <a
                href={`/catalogo/${prev.slug}`}
                className="pixel-border-amber p-4 flex flex-col gap-1 hover:-translate-y-0.5 transition-transform"
                style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <span className="text-brand-muted text-[8px]" style={{ fontFamily: 'var(--font-pixel)' }}>← ANTERIOR</span>
                <span className="text-brand-amber text-[8px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>{prev.game}</span>
                <span className="text-brand-text text-xs font-body line-clamp-2 leading-snug">{prev.title}</span>
              </a>
            ) : <div />}
            {next ? (
              <a
                href={`/catalogo/${next.slug}`}
                className="pixel-border-amber p-4 flex flex-col gap-1 items-end text-right hover:-translate-y-0.5 transition-transform"
                style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <span className="text-brand-muted text-[8px]" style={{ fontFamily: 'var(--font-pixel)' }}>SIGUIENTE →</span>
                <span className="text-brand-amber text-[8px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>{next.game}</span>
                <span className="text-brand-text text-xs font-body line-clamp-2 leading-snug">{next.title}</span>
              </a>
            ) : <div />}
          </nav>
        )}

        <Button variant="secondary" href="/catalogo">
          ← VOLVER AL CATÁLOGO
        </Button>
      </div>
    </article>
  );
}
