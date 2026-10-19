import ArticleCard from '@/components/blog/ArticleCard';

// Renders a grid of related posts at the end of a post page.
export default function RelatedContent({ items = [], title = '✦ SIGUE LEYENDO' }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-brand-border">
      <h2
        className="text-[10px] tracking-widest mb-6 text-brand-purple"
        style={{ fontFamily: 'var(--font-pixel)' }}
      >
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ArticleCard key={item.slug} {...item} />
        ))}
      </div>
    </section>
  );
}
