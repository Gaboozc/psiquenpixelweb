import PageWrapper from '@/components/layout/PageWrapper';
import ArticleCard from '@/components/blog/ArticleCard';
import { getAllPosts } from '@/lib/posts';

export const metadata = {
  title: 'Posts',
  description: 'Artículos de análisis psicológico, narrativo y cultural de videojuegos.',
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <PageWrapper
      title="Posts"
      subtitle="Análisis psicológico, narrativo y cultural de videojuegos"
      accentColor="purple"
    >
      {posts.length === 0 ? (
        <div className="pixel-border-purple p-12 text-center flex flex-col items-center gap-4"
          style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <p className="text-brand-purple text-[9px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
            ▓▓▓
          </p>
          <p className="text-brand-muted text-sm font-body">
            El héroe está forjando el contenido. Vuelve pronto.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post.slug} {...post} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
