import Link from 'next/link';
import PostsTable from '@/components/admin/PostsTable';
import { ap } from '@/lib/adminPath';
import { adminList } from '@/lib/adminArticles';

async function getPosts() {
  try {
    const rows = await adminList();
    return {
      error: null,
      posts: rows.map((r) => ({
        slug: r.slug,
        title: r.title || '—',
        date: r.date || '',
        category: r.category || '—',
        published: r.published,
        game: r.game || '',
        saga: r.sagaSlug ? (r.sagaIntro ? `${r.sagaSlug} · intro` : `${r.sagaSlug} · parte ${r.sagaOrder}`) : '',
      })),
    };
  } catch (e) {
    return { error: e.message, posts: [] };
  }
}

// Always reflect current data in the admin.
export const dynamic = 'force-dynamic';

export default async function AdminPostsPage() {
  const { posts, error } = await getPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-brand-text text-lg font-body font-bold">Posts</h1>
          <p className="text-brand-muted text-sm font-body">{posts.length} artículos</p>
        </div>
        <Link
          href={ap('/posts/new')}
          className="bg-brand-purple text-white text-xs px-4 py-2 font-body hover:bg-brand-purple-dim transition-colors"
          style={{ boxShadow: '3px 3px 0 #6b3bbf' }}
        >
          + Nuevo Post
        </Link>
      </div>

      {error && <p className="text-red-400 text-sm font-body mb-4">No se pudieron cargar los posts: {error}</p>}
      <PostsTable posts={posts} />
    </div>
  );
}
