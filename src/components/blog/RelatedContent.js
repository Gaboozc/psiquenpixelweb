import ArticleCard from '@/components/blog/ArticleCard';
import GameCard from '@/components/catalogo/GameCard';

// Renders a grid of related posts or game analyses at the end of a detail page.
// `type` selects which card to use: 'post' | 'game'.
export default function RelatedContent({ items = [], type = 'post', accentColor = 'purple' }) {
  if (!items || items.length === 0) return null;

  const accent = accentColor === 'amber' ? 'text-brand-amber' : 'text-brand-purple';
  const label = type === 'game' ? '⚔ ANÁLISIS RELACIONADOS' : '✦ SIGUE LEYENDO';

  return (
    <section className="mt-16 pt-8 border-t border-brand-border">
      <h2
        className={`text-[10px] tracking-widest mb-6 ${accent}`}
        style={{ fontFamily: 'var(--font-pixel)' }}
      >
        {label}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) =>
          type === 'game' ? (
            <GameCard key={item.slug} {...item} />
          ) : (
            <ArticleCard key={item.slug} {...item} />
          ),
        )}
      </div>
    </section>
  );
}
