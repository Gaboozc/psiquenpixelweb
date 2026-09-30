'use client';

import { useMemo, useState } from 'react';
import GameCard from '@/components/catalogo/GameCard';

// Flatten + dedupe + sort a field that is a string[] across all games
const collect = (games, field) =>
  [...new Set(games.flatMap((g) => g[field] ?? []))].sort((a, b) =>
    a.localeCompare(b, 'es')
  );

const GamesExplorer = ({ games }) => {
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState(null);
  const [activeTag, setActiveTag] = useState(null);

  const genres = useMemo(() => collect(games, 'genre'), [games]);
  const tags = useMemo(() => collect(games, 'tags'), [games]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return games.filter((g) => {
      const matchesQuery =
        !q ||
        [g.title, g.game, g.excerpt]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q));
      const matchesGenre = !activeGenre || (g.genre ?? []).includes(activeGenre);
      const matchesTag = !activeTag || (g.tags ?? []).includes(activeTag);
      return matchesQuery && matchesGenre && matchesTag;
    });
  }, [games, query, activeGenre, activeTag]);

  const toggle = (value, current, setter) =>
    setter(current === value ? null : value);

  const clearFilters = () => {
    setQuery('');
    setActiveGenre(null);
    setActiveTag(null);
  };

  const hasFilters = query.trim() || activeGenre || activeTag;

  // Shared chip look; `active` inverts the fill for the selected chip.
  const chip = (active, color) => {
    const base =
      'px-3 py-1 text-[8px] tracking-widest border transition-colors duration-150 cursor-pointer';
    const palette =
      color === 'amber'
        ? active
          ? 'bg-brand-amber text-brand-bg border-brand-amber'
          : 'text-brand-amber border-brand-amber hover:bg-brand-amber/10'
        : active
          ? 'bg-brand-purple text-brand-bg border-brand-purple'
          : 'text-brand-muted border-brand-border hover:text-brand-purple hover:border-brand-purple';
    return `${base} ${palette}`;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Search */}
      <div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título, juego o palabra clave…"
          aria-label="Buscar análisis"
          className="pixel-border w-full bg-brand-bg text-brand-text font-body text-sm px-4 py-3 placeholder:text-brand-muted focus:outline-none focus:pixel-border-amber"
        />
      </div>

      {/* Genre filters */}
      {genres.length > 0 && (
        <div className="flex flex-col gap-2">
          <p
            className="text-brand-muted text-[8px] tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            Género
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveGenre(null)}
              className={chip(!activeGenre, 'amber')}
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              Todos
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => toggle(genre, activeGenre, setActiveGenre)}
                className={chip(activeGenre === genre, 'amber')}
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tag filters */}
      {tags.length > 0 && (
        <div className="flex flex-col gap-2">
          <p
            className="text-brand-muted text-[8px] tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            Etiquetas
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggle(tag, activeTag, setActiveTag)}
                className={chip(activeTag === tag, 'purple')}
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result count */}
      <p
        className="text-brand-muted text-[8px] tracking-widest"
        style={{ fontFamily: 'var(--font-pixel)' }}
      >
        {filtered.length} análisis
      </p>

      {/* Results */}
      {filtered.length === 0 ? (
        <div
          className="pixel-border-amber p-12 text-center flex flex-col items-center gap-4"
          style={{
            backgroundImage: 'url(/cards.png?v=2)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <p
            className="text-brand-amber text-[9px] tracking-widest"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            ▓▓▓
          </p>
          <p className="text-brand-muted text-sm font-body">
            Ningún análisis coincide con tu búsqueda.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className={chip(false, 'amber')}
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((game) => (
            <GameCard key={game.slug} {...game} />
          ))}
        </div>
      )}

      {/* Clear filters (when results exist but filters are active) */}
      {hasFilters && filtered.length > 0 && (
        <div>
          <button
            type="button"
            onClick={clearFilters}
            className={chip(false, 'purple')}
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default GamesExplorer;
