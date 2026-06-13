import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import DeleteButton from '@/components/admin/DeleteButton';
import { ap } from '@/lib/adminPath';

async function getPosts() {
  const dir = path.join(process.cwd(), 'src', 'content', 'blog');
  const files = (await fs.readdir(dir).catch(() => [])).filter((f) => f.endsWith('.md'));
  const posts = await Promise.all(
    files.map(async (filename) => {
      const raw = await fs.readFile(path.join(dir, filename), 'utf8');
      const { data } = matter(raw);
      return {
        slug:     data.slug     ?? filename.replace('.md', ''),
        title:    data.title    ?? '—',
        date:     data.date     ?? '',
        category: data.category ?? '—',
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

      {posts.length === 0 ? (
        <div className="pixel-border p-12 text-center"
          style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <p className="text-brand-muted text-sm font-body">No hay posts aún.</p>
          <Link href={ap('/posts/new')} className="inline-block mt-4 text-brand-purple text-xs font-body hover:underline">
            Crear el primero →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body border-collapse">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal" style={{ fontFamily: 'var(--font-pixel)' }}>TÍTULO</th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal hidden sm:table-cell" style={{ fontFamily: 'var(--font-pixel)' }}>CATEGORÍA</th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal hidden md:table-cell" style={{ fontFamily: 'var(--font-pixel)' }}>FECHA</th>
                <th className="text-right py-2" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.slug} className="border-b border-brand-border/50 hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4">
                    <Link href={`/blog/${post.slug}`} target="_blank" className="text-brand-text hover:text-brand-purple transition-colors line-clamp-1">
                      {post.title}
                    </Link>
                    <span className="text-brand-border text-[10px] block">{post.slug}</span>
                  </td>
                  <td className="py-3 pr-4 text-brand-muted hidden sm:table-cell">{post.category}</td>
                  <td className="py-3 pr-4 text-brand-muted hidden md:table-cell">{post.date}</td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <Link href={ap(`/posts/${post.slug}/edit`)}
                      className="text-brand-muted hover:text-brand-purple text-xs mr-4 transition-colors font-body">
                      Editar
                    </Link>
                    <DeleteButton slug={post.slug} type="posts" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
