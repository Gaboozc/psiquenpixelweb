'use client';

import { useMemo, useState } from 'react';

// Scalable chip filter for a facet (tags, games…). Options are sorted by how
// many posts carry them, with the count shown; only the top `limit` are visible
// until expanded, and a search box appears when there are many. Selected options
// always stay visible, first.
//
// options: [{ key, label, count }]  (already faceted by the caller)
export default function FacetFilter({
  title,
  options,
  selected,          // array of keys
  onToggle,          // (key) => void
  onClear,           // () => void
  color = 'purple',
  limit = 10,
  prefix = '',
}) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const needle = search.trim().toLowerCase();
  const searching = needle.length > 0;

  const visible = useMemo(() => {
    const chosen = options.filter((o) => selectedSet.has(o.key));
    let rest = options.filter((o) => !selectedSet.has(o.key));
    if (searching) {
      // Labels starting with the search first, then word starts, then the rest.
      const rank = (l) => (l.startsWith(needle) ? 0 : l.split(/\s+/).some((w) => w.startsWith(needle)) ? 1 : 2);
      rest = rest
        .filter((o) => o.label.toLowerCase().includes(needle))
        .sort((a, b) => rank(a.label.toLowerCase()) - rank(b.label.toLowerCase()) || b.count - a.count);
    }
    else if (!expanded) rest = rest.slice(0, Math.max(0, limit - chosen.length));
    return [...chosen, ...rest];
  }, [options, selectedSet, searching, needle, expanded, limit]);

  if (options.length === 0) return null;

  const hidden = options.length - visible.length;
  const many = options.length > limit;

  const chip = (active) => {
    const base = 'px-3 py-1 text-[8px] tracking-widest border transition-colors duration-150 cursor-pointer inline-flex items-center gap-1.5';
    if (color === 'amber') {
      return `${base} ${active ? 'bg-brand-amber text-brand-bg border-brand-amber' : 'text-brand-amber border-brand-amber/60 hover:bg-brand-amber/10'}`;
    }
    return `${base} ${active ? 'bg-brand-purple text-brand-bg border-brand-purple' : 'text-brand-muted border-brand-border hover:text-brand-purple hover:border-brand-purple'}`;
  };
  const pixel = { fontFamily: 'var(--font-pixel)' };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-brand-muted text-[8px] tracking-widest uppercase" style={pixel}>
          {title}
        </p>
        {selected.length > 0 && (
          <button type="button" onClick={onClear} className="text-brand-muted hover:text-brand-text text-[8px] tracking-widest" style={pixel}>
            ✕ quitar
          </button>
        )}
        {many && (expanded || searching) && (
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Buscar ${title.toLowerCase()}…`}
            aria-label={`Buscar ${title.toLowerCase()}`}
            className="ml-auto w-48 bg-brand-bg border border-brand-border text-brand-text font-body text-xs px-2 py-1 placeholder:text-brand-muted focus:outline-none focus:border-brand-purple"
          />
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {visible.map((o) => {
          const active = selectedSet.has(o.key);
          return (
            <button key={o.key} type="button" onClick={() => onToggle(o.key)} aria-pressed={active}
              className={chip(active)} style={pixel}>
              {prefix}{o.label}
              <span className={active ? 'opacity-70' : 'opacity-50'}>{active ? '✕' : o.count}</span>
            </button>
          );
        })}

        {searching && visible.length === selected.length && (
          <span className="text-brand-muted text-[10px] font-body self-center">Sin coincidencias.</span>
        )}

        {many && !searching && (
          <button type="button" onClick={() => { setExpanded((v) => !v); setSearch(''); }}
            className="px-3 py-1 text-[8px] tracking-widest text-brand-text border border-dashed border-brand-border hover:border-brand-purple"
            style={pixel}>
            {expanded ? '− ver menos' : `+ ${hidden} más`}
          </button>
        )}
      </div>
    </div>
  );
}
