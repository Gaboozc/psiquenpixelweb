import PixelDivider from '@/components/ui/PixelDivider';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

// Placeholder — replace with getGameBySlug() from @/lib/catalog
const PLACEHOLDER = {
  title:   'Análisis en construcción',
  game:    'Título del juego',
  excerpt: 'Este análisis estará disponible próximamente.',
  date:    '2025-01-01',
  genre:   ['RPG'],
  tags:    [],
  content: '<p>Contenido del análisis aquí.</p>',
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title:       `${PLACEHOLDER.game} — ${PLACEHOLDER.title}`,
    description: PLACEHOLDER.excerpt,
  };
}

export default async function GameAnalysisPage({ params }) {
  const { slug } = await params;
  const game = PLACEHOLDER;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {game.genre.map((g) => (
            <Badge key={g} color="amber">{g}</Badge>
          ))}
          <span
            className="text-brand-muted text-[8px]"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            {game.date}
          </span>
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
        {game.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {game.tags.map((tag) => (
              <Badge key={tag} color="muted">#{tag}</Badge>
            ))}
          </div>
        )}
        <Button variant="secondary" href="/catalogo">
          ← VOLVER AL CATÁLOGO
        </Button>
      </div>
    </article>
  );
}
