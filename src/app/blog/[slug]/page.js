import PixelDivider from '@/components/ui/PixelDivider';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

// Placeholder — replace with getPostBySlug() from @/lib/posts
const PLACEHOLDER = {
  title:    'Artículo en construcción',
  excerpt:  'Este artículo estará disponible próximamente.',
  date:     '2025-01-01',
  category: 'Análisis',
  tags:     [],
  content:  '<p>Contenido del artículo aquí.</p>',
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title:       PLACEHOLDER.title,
    description: PLACEHOLDER.excerpt,
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const post = PLACEHOLDER;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Badge color="purple">{post.category}</Badge>
          <span
            className="text-brand-muted text-[8px]"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            {post.date}
          </span>
        </div>

        <h1
          className="text-brand-text text-2xl md:text-3xl leading-tight mb-4"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          {post.title}
        </h1>

        <p className="text-brand-muted text-base leading-relaxed font-body">
          {post.excerpt}
        </p>
      </header>

      <PixelDivider className="mb-10" />

      {/* Body */}
      <div
        className="prose prose-invert prose-purple max-w-none font-body text-brand-text leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-brand-border">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Badge key={tag} color="muted">#{tag}</Badge>
            ))}
          </div>
        )}
        <Button variant="primary" href="/blog">
          ← VOLVER AL BLOG
        </Button>
      </div>
    </article>
  );
}
