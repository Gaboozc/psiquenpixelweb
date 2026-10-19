import PageWrapper from '@/components/layout/PageWrapper';
import BlogExplorer from '@/components/blog/BlogExplorer';
import { getAllPosts } from '@/lib/posts';
import { getPublishedSagas } from '@/lib/sagas';

export const metadata = {
  title: 'Posts',
  description: 'Artículos de análisis psicológico, narrativo y cultural de videojuegos.',
};

// Regenerate at most once a minute so edits made outside the admin show up too
// (admin saves also revalidate on demand).
export const revalidate = 60;

export default async function PostsPage() {
  const posts = await getAllPosts();
  const sagas = await getPublishedSagas(posts);

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
        <BlogExplorer posts={posts} sagas={sagas} />
      )}
    </PageWrapper>
  );
}
