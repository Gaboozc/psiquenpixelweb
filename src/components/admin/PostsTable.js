'use client';

import { useState } from 'react';
import Link from 'next/link';
import DeleteButton from './DeleteButton';
import { ap } from '@/lib/adminPath';

function StatusBadge({ published }) {
  if (published === false) {
    return (
      <span className="inline-block text-[8px] px-1.5 py-0.5 border border-brand-border text-brand-muted font-body">
        BORRADOR
      </span>
    );
  }
  return (
    <span className="inline-block text-[8px] px-1.5 py-0.5 border border-green-800 text-green-500 font-body">
      PUB
    </span>
  );
}

export default function PostsTable({ posts }) {
  const [query, setQuery] = useState('');

  const filtered = query
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.slug.toLowerCase().includes(query.toLowerCase()) ||
          (p.category ?? '').toLowerCase().includes(query.toLowerCase()),
      )
    : posts;

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por título, slug o categoría..."
        className="admin-input w-full sm:w-80"
      />

      {filtered.length === 0 ? (
        <div
          className="pixel-border p-12 text-center"
          style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <p className="text-brand-muted text-sm font-body">
            {query ? 'Sin resultados.' : 'No hay posts aún.'}
          </p>
          {!query && (
            <Link href={ap('/posts/new')} className="inline-block mt-4 text-brand-purple text-xs font-body hover:underline">
              Crear el primero →
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body border-collapse">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal" style={{ fontFamily: 'var(--font-pixel)' }}>TÍTULO</th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal hidden sm:table-cell" style={{ fontFamily: 'var(--font-pixel)' }}>ESTADO</th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal hidden md:table-cell" style={{ fontFamily: 'var(--font-pixel)' }}>CATEGORÍA</th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal hidden lg:table-cell" style={{ fontFamily: 'var(--font-pixel)' }}>FECHA</th>
                <th className="text-right py-2" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.slug} className="border-b border-brand-border/50 hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="text-brand-text hover:text-brand-purple transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <span className="text-brand-border text-[10px] block">{post.slug}</span>
                  </td>
                  <td className="py-3 pr-4 hidden sm:table-cell">
                    <StatusBadge published={post.published} />
                  </td>
                  <td className="py-3 pr-4 text-brand-muted hidden md:table-cell">{post.category}</td>
                  <td className="py-3 pr-4 text-brand-muted hidden lg:table-cell">{post.date}</td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <Link
                      href={ap(`/posts/${post.slug}/edit`)}
                      className="text-brand-muted hover:text-brand-purple text-xs mr-4 transition-colors font-body"
                    >
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

      {query && (
        <p className="text-brand-muted text-xs font-body">
          {filtered.length} de {posts.length} posts
        </p>
      )}
    </div>
  );
}
