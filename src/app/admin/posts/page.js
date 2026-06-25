import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import PostsTable from '@/components/admin/PostsTable';
import { ap } from '@/lib/adminPath';

async function getPosts() {
  const dir = path.join(process.cwd(), 'src', 'content', 'blog');
  const files = (await fs.readdir(dir).catch(() => [])).filter((f) => f.endsWith('.md'));
  const posts = await Promise.all(
    files.map(async (filename) => {
      const raw = await fs.readFile(path.join(dir, filename), 'utf8');
      const { data } = matter(raw);
      return {
        slug:      data.slug      ?? filename.replace('.md', ''),
        title:     data.title     ?? '—',
        date:      data.date      ?? '',
        category:  data.category  ?? '—',
        published: data.published ?? true,
      };
    }),
  );
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default async function AdminPostsPage() {
  const posts = await getPosts();

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

      <PostsTable posts={posts} />
    </div>
  );
}
