'use client';

import { useMemo } from 'react';

const key = (t) => t.trim().toLowerCase();

// Count how often each tag is used across posts and keep its most common
// spelling. Returns [{ key, label, count }] sorted by usage.
export function tagCatalog(posts) {
  const map = new Map();
  for (const p of posts) for (const t of p.tags ?? []) {
    const k = key(t);
    if (!k) continue;
    const e = map.get(k) ?? { key: k, count: 0, spellings: new Map() };
    e.count += 1;
    e.spellings.set(t, (e.spellings.get(t) ?? 0) + 1);
    map.set(k, e);
  }
  return [...map.values()]
    .map((e) => ({ key: e.key, count: e.count, label: [...e.spellings].sort((a, b) => b[1] - a[1])[0][0] }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'es'));
}

// Turn the typed list into clean tags: trimmed, deduplicated case-insensitively,
// and snapped to the existing spelling ("trauma" → "Trauma" if that exists).
export function normalizeTags(text, catalog) {
  const canonical = new Map(catalog.map((t) => [t.key, t.label]));
  const seen = new Set();
  const out = [];
  for (const raw of text.split(',')) {
    const t = raw.trim();
    const k = key(t);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(canonical.get(k) ?? t);
  }
  return out;
}

// Comma-separated tag input with suggestions from tags already in use, so the
// same idea isn't saved under several spellings.
export default function TagInput({ value, onChange, catalog, placeholder }) {
  const parts = value.split(',');
  const current = key(parts[parts.length - 1] ?? '');
  const used = useMemo(() => new Set(parts.slice(0, -1).map(key).filter(Boolean)), [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tags starting with what's typed first, then those where a word starts with
  // it, then any other match; within each group, most used first.
  const suggestions = useMemo(() => {
    const rank = (k) => (!current ? 0 : k.startsWith(current) ? 0 : k.split(/\s+/).some((w) => w.startsWith(current)) ? 1 : 2);
    return catalog
      .filter((t) => !used.has(t.key) && t.key !== current && (!current || t.key.includes(current)))
      .sort((a, b) => rank(a.key) - rank(b.key) || b.count - a.count)
      .slice(0, 8);
  }, [catalog, used, current]);

  // Replace the tag being typed with the chosen one and start a new one.
  const pick = (label) => {
    const done = parts.slice(0, -1).map((p) => p.trim()).filter(Boolean);
    onChange([...done, label].join(', ') + ', ');
  };

  return (
    <div className="space-y-2">
      <input value={value} onChange={(e) => onChange(e.target.value)} className="admin-input" placeholder={placeholder} />
      {suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-brand-muted text-[10px] font-body">{current ? 'Coinciden:' : 'Más usadas:'}</span>
          {suggestions.map((t) => (
            <button key={t.key} type="button" onClick={() => pick(t.label)}
              className="text-[11px] font-body px-2 py-0.5 border border-brand-border text-brand-muted hover:border-brand-purple hover:text-brand-purple transition-colors">
              #{t.label} <span className="opacity-50">{t.count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
