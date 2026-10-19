'use client';

import { useMemo, useState } from 'react';
import ArticleCard from '@/components/blog/ArticleCard';
import SagaCard from '@/components/blog/SagaCard';

// Flatten + dedupe + sort a field across all posts (string or string[]).
const collect = (posts, field) =>
  [...new Set(posts.flatMap((p) => (Array.isArray(p[field]) ? p[field] : [p[field]])).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'es'));

// Blog index. With no search or filter, each saga collapses into one card and
// sits among standalone posts (newest first). While searching/filtering, every
// matching post is listed individually, labelled with its saga and part.
const BlogExplorer = ({ posts, sagas }) => {
  const [query, setQuery] = useState('');
  const [activeGame, setActiveGame] = useState(null);
  const [activeTag, setActiveTag] = useState(null);

  const games = useMemo(() => collect(posts, 'game'), [posts]);
  const tags = useMemo(() => collect(posts, 'tags'), [posts]);

  // slug → { sagaTitle, partLabel } for labelling posts outside their saga page.
  const sagaInfo = useMemo(() => {
    const map = new Map();
    for (const s of sagas) for (const p of s.parts) map.set(p.slug, { sagaTitle: s.title, partLabel: p.partLabel });
    return map;
  }, [sagas]);

  const hasFilters = Boolean(query.trim() || activeGame || activeTag);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const saga = sagaInfo.get(p.slug);
      const matchesQuery =
        !q ||
        [p.title, p.game, p.excerpt, p.category, saga?.sagaTitle]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q));
      const matchesGame = !activeGame || p.game === activeGame;
      const matchesTag = !activeTag || (p.tags ?? []).includes(activeTag);
      return matchesQuery && matchesGame && matchesTag;
    });
  }, [posts, query, activeGame, activeTag, sagaInfo]);

  // Default view: sagas as single cards + posts that belong to no visible saga.
  const grouped = useMemo(() => {
    const inSaga = new Set(sagaInfo.keys());
    const items = [
      ...sagas.map((s) => ({ kind: 'saga', date: s.date, data: s })),
      ...posts.filter((p) => !inSaga.has(p.slug)).map((p) => ({ kind: 'post', date: p.date, data: p })),
    ];
    return items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [posts, sagas, sagaInfo]);

  const toggle = (value, current, setter) => setter(current === value ? null : value);
  const clearFilters = () => {
    setQuery('');
    setActiveGame(null);
    setActiveTag(null);
  };

  // Shared chip look; `active` inverts the fill for the selected chip.
  const chip = (active, color) => {
    const base = 'px-3 py-1 text-[8px] tracking-widest border transition-colors duration-150 cursor-pointer';
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

  const ChipLabel = ({ children }) => (
    <p className="text-brand-muted text-[8px] tracking-widest uppercase" style={{ fontFamily: 'var(--font-pixel)' }}>
      {children}
    </p>
  );

  return (
    <div className="flex flex-col gap-8">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por título, juego, saga o palabra clave…"
        aria-label="Buscar posts"
        className="pixel-border w-full bg-brand-bg text-brand-text font-body text-sm px-4 py-3 placeholder:text-brand-muted focus:outline-none"
      />

      {games.length > 0 && (
        <div className="flex flex-col gap-2">
          <ChipLabel>Juego</ChipLabel>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setActiveGame(null)} className={chip(!activeGame, 'amber')} style={{ fontFamily: 'var(--font-pixel)' }}>
              Todos
            </button>
            {games.map((g) => (
              <button key={g} type="button" onClick={() => toggle(g, activeGame, setActiveGame)}
                className={chip(activeGame === g, 'amber')} style={{ fontFamily: 'var(--font-pixel)' }}>
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-col gap-2">
          <ChipLabel>Etiquetas</ChipLabel>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button key={t} type="button" onClick={() => toggle(t, activeTag, setActiveTag)}
                className={chip(activeTag === t, 'purple')} style={{ fontFamily: 'var(--font-pixel)' }}>
                #{t}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-brand-muted text-[8px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
        {hasFilters
          ? `${filtered.length} ${filtered.length === 1 ? 'post' : 'posts'}`
          : `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}${sagas.length ? ` · ${sagas.length} ${sagas.length === 1 ? 'saga' : 'sagas'}` : ''}`}
      </p>

      {hasFilters ? (
        filtered.length === 0 ? (
          <div className="pixel-border-purple p-12 text-center flex flex-col items-center gap-4"
            style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <p className="text-brand-purple text-[9px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>▓▓▓</p>
            <p className="text-brand-muted text-sm font-body">Ningún post coincide con tu búsqueda.</p>
            <button type="button" onClick={clearFilters} className={chip(false, 'purple')} style={{ fontFamily: 'var(--font-pixel)' }}>
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => <ArticleCard key={p.slug} {...p} {...sagaInfo.get(p.slug)} />)}
            </div>
            <div>
              <button type="button" onClick={clearFilters} className={chip(false, 'purple')} style={{ fontFamily: 'var(--font-pixel)' }}>
                Limpiar filtros
              </button>
            </div>
          </>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grouped.map((item) =>
            item.kind === 'saga'
              ? <SagaCard key={`saga:${item.data.slug}`} {...item.data} />
              : <ArticleCard key={item.data.slug} {...item.data} />,
          )}
        </div>
      )}
    </div>
  );
};

export default BlogExplorer;
