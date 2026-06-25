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

export default function GamesTable({ games }) {
  const [query, setQuery] = useState('');

  const filtered = query
    ? games.filter(
        (g) =>
          g.title.toLowerCase().includes(query.toLowerCase()) ||
          g.game.toLowerCase().includes(query.toLowerCase()) ||
          g.slug.toLowerCase().includes(query.toLowerCase()) ||
          (g.genre ?? '').toLowerCase().includes(query.toLowerCase()),
      )
    : games;

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por juego, título o género..."
        className="admin-input w-full sm:w-80"
      />

      {filtered.length === 0 ? (
        <div
          className="pixel-border p-12 text-center"
          style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <p className="text-brand-muted text-sm font-body">
            {query ? 'Sin resultados.' : 'No hay análisis aún.'}
          </p>
          {!query && (
            <Link href={ap('/catalogo/new')} className="inline-block mt-4 text-brand-amber text-xs font-body hover:underline">
              Crear el primero →
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body border-collapse">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal" style={{ fontFamily: 'var(--font-pixel)' }}>JUEGO</th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal hidden sm:table-cell" style={{ fontFamily: 'var(--font-pixel)' }}>ESTADO</th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal hidden md:table-cell" style={{ fontFamily: 'var(--font-pixel)' }}>ANÁLISIS</th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal hidden lg:table-cell" style={{ fontFamily: 'var(--font-pixel)' }}>GÉNERO</th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal hidden xl:table-cell" style={{ fontFamily: 'var(--font-pixel)' }}>FECHA</th>
                <th className="text-right py-2" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((game) => (
                <tr key={game.slug} className="border-b border-brand-border/50 hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/catalogo/${game.slug}`}
                      target="_blank"
                      className="text-brand-amber hover:text-brand-amber-dim transition-colors font-medium"
                    >
                      {game.game}
                    </Link>
                    <span className="text-brand-border text-[10px] block">{game.slug}</span>
                  </td>
                  <td className="py-3 pr-4 hidden sm:table-cell">
                    <StatusBadge published={game.published} />
                  </td>
                  <td className="py-3 pr-4 text-brand-muted hidden md:table-cell line-clamp-1">{game.title}</td>
                  <td className="py-3 pr-4 text-brand-muted hidden lg:table-cell">{game.genre}</td>
                  <td className="py-3 pr-4 text-brand-muted hidden xl:table-cell">{game.date}</td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <Link
                      href={ap(`/catalogo/${game.slug}/edit`)}
                      className="text-brand-muted hover:text-brand-purple text-xs mr-4 transition-colors font-body"
                    >
                      Editar
                    </Link>
                    <DeleteButton slug={game.slug} type="catalogo" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {query && (
        <p className="text-brand-muted text-xs font-body">
          {filtered.length} de {games.length} análisis
        </p>
      )}
    </div>
  );
}
