'use client';

import { useEffect, useMemo, useState } from 'react';
import ArticleCard from '@/components/blog/ArticleCard';
import SagaCard from '@/components/blog/SagaCard';
import FacetFilter from '@/components/blog/FacetFilter';

// Tags are free text, so "Trauma" and "trauma" must count as one tag.
const tagKey = (t) => String(t).trim().toLowerCase();

// Blog index. With no search or filter, each saga collapses into one card and
// sits among standalone posts (newest first). While searching/filtering, every
// matching post is listed individually, labelled with its saga and part.
// Filters live in the URL (?q=…&juego=…&tag=…&tag=…) so results can be shared
// and post tags can link straight to a filtered view.
const BlogExplorer = ({ posts, sagas }) => {
  const [query, setQuery] = useState('');
  const [activeGame, setActiveGame] = useState(null);
  const [activeTags, setActiveTags] = useState([]); // tag keys, AND-ed

  // ── URL ⇄ state ───────────────────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get('q') ?? '');
    setActiveGame(params.get('juego'));
    setActiveTags([...new Set(params.getAll('tag').map(tagKey).filter(Boolean))]);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (activeGame) params.set('juego', activeGame);
    activeTags.forEach((t) => params.append('tag', t));
    const qs = params.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
    if (url !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, '', url);
    }
  }, [query, activeGame, activeTags]);

  // ── Derived data ──────────────────────────────────────────────────────────
  // slug → { sagaTitle, partLabel } for labelling posts outside their saga page.
  const sagaInfo = useMemo(() => {
    const map = new Map();
    for (const s of sagas) for (const p of s.parts) map.set(p.slug, { sagaTitle: s.title, partLabel: p.partLabel });
    return map;
  }, [sagas]);

  // Each post with its normalised tag keys, computed once.
  const indexed = useMemo(
    () => posts.map((p) => ({ post: p, tagKeys: new Set((p.tags ?? []).map(tagKey)) })),
    [posts],
  );

  // Most common spelling of each tag, used as its label.
  const tagLabels = useMemo(() => {
    const spellings = new Map();
    for (const p of posts) for (const t of p.tags ?? []) {
      const k = tagKey(t);
      if (!k) continue;
      const m = spellings.get(k) ?? new Map();
      m.set(t, (m.get(t) ?? 0) + 1);
      spellings.set(k, m);
    }
    return new Map([...spellings].map(([k, m]) => [k, [...m].sort((a, b) => b[1] - a[1])[0][0]]));
  }, [posts]);

  const q = query.trim().toLowerCase();
  const matchesQuery = (p) =>
    !q || [p.title, p.game, p.excerpt, p.category, sagaInfo.get(p.slug)?.sagaTitle]
      .filter(Boolean).some((f) => f.toLowerCase().includes(q));
  const matchesGame = (p) => !activeGame || p.game === activeGame;
  const matchesTags = (keys) => activeTags.every((t) => keys.has(t));

  const filtered = useMemo(
    () => indexed.filter(({ post, tagKeys }) => matchesQuery(post) && matchesGame(post) && matchesTags(tagKeys)).map((x) => x.post),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [indexed, q, activeGame, activeTags, sagaInfo],
  );

  // Faceted counts: tag counts over the current results (so picking more tags
  // narrows down and never leads to an empty list); game counts ignore the game
  // filter itself, so you can switch game.
  const tagOptions = useMemo(() => {
    const counts = new Map();
    for (const { post, tagKeys } of indexed) {
      if (!matchesQuery(post) || !matchesGame(post) || !matchesTags(tagKeys)) continue;
      for (const k of tagKeys) counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    for (const k of activeTags) if (!counts.has(k)) counts.set(k, 0);
    return [...counts]
      .map(([key, count]) => ({ key, count, label: tagLabels.get(key) ?? key }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'es'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed, q, activeGame, activeTags, tagLabels, sagaInfo]);

  const gameOptions = useMemo(() => {
    const counts = new Map();
    for (const { post, tagKeys } of indexed) {
      if (!post.game || !matchesQuery(post) || !matchesTags(tagKeys)) continue;
      counts.set(post.game, (counts.get(post.game) ?? 0) + 1);
    }
    if (activeGame && !counts.has(activeGame)) counts.set(activeGame, 0);
    return [...counts]
      .map(([key, count]) => ({ key, count, label: key }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'es'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed, q, activeGame, activeTags, sagaInfo]);

  // Default view: sagas as single cards + posts that belong to no visible saga.
  const grouped = useMemo(() => {
    const inSaga = new Set(sagaInfo.keys());
    const items = [
      ...sagas.map((s) => ({ kind: 'saga', date: s.date, data: s })),
      ...posts.filter((p) => !inSaga.has(p.slug)).map((p) => ({ kind: 'post', date: p.date, data: p })),
    ];
    return items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [posts, sagas, sagaInfo]);

  const hasFilters = Boolean(q || activeGame || activeTags.length);

  const toggleTag = (k) => setActiveTags((ts) => (ts.includes(k) ? ts.filter((t) => t !== k) : [...ts, k]));
  const toggleGame = (g) => setActiveGame((cur) => (cur === g ? null : g));
  const clearFilters = () => {
    setQuery('');
    setActiveGame(null);
    setActiveTags([]);
  };

  const pixel = { fontFamily: 'var(--font-pixel)' };
  const clearBtn = 'px-3 py-1 text-[8px] tracking-widest border transition-colors duration-150 cursor-pointer text-brand-muted border-brand-border hover:text-brand-purple hover:border-brand-purple';

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

      <FacetFilter
        title="Juego"
        options={gameOptions}
        selected={activeGame ? [activeGame] : []}
        onToggle={toggleGame}
        onClear={() => setActiveGame(null)}
        color="amber"
        limit={8}
      />

      <FacetFilter
        title="Etiquetas"
        options={tagOptions}
        selected={activeTags}
        onToggle={toggleTag}
        onClear={() => setActiveTags([])}
        prefix="#"
        limit={10}
      />

      <p className="text-brand-muted text-[8px] tracking-widest" style={pixel}>
        {hasFilters
          ? `${filtered.length} ${filtered.length === 1 ? 'post' : 'posts'}`
          : `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}${sagas.length ? ` · ${sagas.length} ${sagas.length === 1 ? 'saga' : 'sagas'}` : ''}`}
      </p>

      {hasFilters ? (
        filtered.length === 0 ? (
          <div className="pixel-border-purple p-12 text-center flex flex-col items-center gap-4"
            style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <p className="text-brand-purple text-[9px] tracking-widest" style={pixel}>▓▓▓</p>
            <p className="text-brand-muted text-sm font-body">Ningún post coincide con tu búsqueda.</p>
            <button type="button" onClick={clearFilters} className={clearBtn} style={pixel}>Limpiar filtros</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => <ArticleCard key={p.slug} {...p} {...sagaInfo.get(p.slug)} />)}
            </div>
            <div>
              <button type="button" onClick={clearFilters} className={clearBtn} style={pixel}>Limpiar filtros</button>
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
