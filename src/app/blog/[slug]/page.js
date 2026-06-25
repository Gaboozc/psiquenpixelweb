import { notFound } from 'next/navigation';
import PixelDivider from '@/components/ui/PixelDivider';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getPostBySlug, getAllPosts, getAdjacentPosts } from '@/lib/posts';
import { formatDate } from '@/lib/format';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post no encontrado' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : [{ url: '/og-image.png' }],
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {post.category && <Badge color="purple">{post.category}</Badge>}
          {post.date && (
            <span
              className="text-brand-muted text-[8px]"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              {formatDate(post.date)}
            </span>
          )}
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
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Badge key={tag} color="muted">#{tag}</Badge>
            ))}
          </div>
        )}

        {/* Prev / Next navigation */}
        {(prev || next) && (
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" aria-label="Navegación entre artículos">
            {prev ? (
              <a
                href={`/blog/${prev.slug}`}
                className="pixel-border p-4 flex flex-col gap-1 hover:-translate-y-0.5 transition-transform"
                style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <span className="text-brand-muted text-[8px]" style={{ fontFamily: 'var(--font-pixel)' }}>← ANTERIOR</span>
                <span className="text-brand-text text-xs font-body line-clamp-2 leading-snug">{prev.title}</span>
              </a>
            ) : <div />}
            {next ? (
              <a
                href={`/blog/${next.slug}`}
                className="pixel-border p-4 flex flex-col gap-1 items-end text-right hover:-translate-y-0.5 transition-transform"
                style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <span className="text-brand-muted text-[8px]" style={{ fontFamily: 'var(--font-pixel)' }}>SIGUIENTE →</span>
                <span className="text-brand-text text-xs font-body line-clamp-2 leading-snug">{next.title}</span>
              </a>
            ) : <div />}
          </nav>
        )}

        <Button variant="primary" href="/blog">
          ← VOLVER AL BLOG
        </Button>
      </div>
    </article>
  );
}
