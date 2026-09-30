'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DeleteButton from './DeleteButton';
import { ap } from '@/lib/adminPath';

// ---------------------------------------------------------------------------
// Categories manager
// ---------------------------------------------------------------------------
function CategoriesPanel({ initial }) {
  const router = useRouter();
  // Editable list excludes the built-in "todos" (always present on the site).
  const [cats, setCats] = useState(initial.filter((c) => c.id !== 'todos'));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const update = (i, key) => (e) =>
    setCats((cs) => cs.map((c, idx) => (idx === i ? { ...c, [key]: e.target.value } : c)));
  const remove = (i) => setCats((cs) => cs.filter((_, idx) => idx !== i));
  const add = () => setCats((cs) => [...cs, { id: '', label: '' }]);

  const save = async () => {
    setSaving(true);
    setMsg('');
    const categories = [{ id: 'todos', label: 'TODO EL BOTÍN' }, ...cats];
    try {
      const res = await fetch('/api/admin/merch', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories }),
      });
      setMsg(res.ok ? '✓ Categorías guardadas' : 'Error al guardar');
      if (res.ok) router.refresh();
    } catch {
      setMsg('Error de red');
    }
    setSaving(false);
  };

  return (
    <details className="pixel-border p-4" style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <summary className="cursor-pointer text-brand-amber text-[9px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
        ⚙ CATEGORÍAS
      </summary>
      <div className="mt-4 space-y-2">
        {cats.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={c.id} onChange={update(i, 'id')} placeholder="id" className="admin-input flex-1" />
            <input value={c.label} onChange={update(i, 'label')} placeholder="ETIQUETA" className="admin-input flex-1" />
            <button type="button" onClick={() => remove(i)} className="text-brand-muted hover:text-red-400 text-xs font-body px-2">✕</button>
          </div>
        ))}
        <div className="flex items-center gap-3 pt-2">
          <button type="button" onClick={add} className="text-brand-purple text-xs font-body hover:underline">+ Añadir categoría</button>
          <button type="button" onClick={save} disabled={saving}
            className="bg-brand-purple text-white text-[11px] px-4 py-1.5 font-body hover:bg-brand-purple-dim transition-colors disabled:opacity-50">
            {saving ? '...' : 'Guardar categorías'}
          </button>
          {msg && <span className="text-brand-muted text-[11px] font-body">{msg}</span>}
        </div>
      </div>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Products table
// ---------------------------------------------------------------------------
export default function MerchTable({ products, categories }) {
  const [query, setQuery] = useState('');

  const q = query.toLowerCase();
  const filtered = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          (p.category ?? '').toLowerCase().includes(q),
      )
    : products;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, id o categoría..."
          className="admin-input w-full sm:w-80"
        />
        <Link
          href={ap('/merch/new')}
          className="bg-brand-amber text-brand-bg text-[10px] tracking-widest px-4 py-2.5 font-body hover:bg-brand-amber-dim transition-colors"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          + NUEVO PRODUCTO
        </Link>
      </div>

      <CategoriesPanel initial={categories} />

      {filtered.length === 0 ? (
        <div className="pixel-border p-12 text-center" style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <p className="text-brand-muted text-sm font-body">{query ? 'Sin resultados.' : 'No hay productos aún.'}</p>
          {!query && (
            <Link href={ap('/merch/new')} className="inline-block mt-4 text-brand-amber text-xs font-body hover:underline">
              Crear el primero →
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body border-collapse">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal" style={{ fontFamily: 'var(--font-pixel)' }}>PRODUCTO</th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal hidden sm:table-cell" style={{ fontFamily: 'var(--font-pixel)' }}>CATEGORÍA</th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal" style={{ fontFamily: 'var(--font-pixel)' }}>PRECIO</th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal hidden md:table-cell" style={{ fontFamily: 'var(--font-pixel)' }}>STOCK</th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal hidden lg:table-cell" style={{ fontFamily: 'var(--font-pixel)' }}>DESCUENTO</th>
                <th className="text-right py-2" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-brand-border/50 hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4">
                    <span className="text-brand-text font-medium">{p.icon} {p.name}</span>
                    <span className="text-brand-border text-[10px] block">{p.id}</span>
                  </td>
                  <td className="py-3 pr-4 text-brand-muted hidden sm:table-cell">{p.category}</td>
                  <td className="py-3 pr-4 text-brand-amber">€{Number(p.price).toFixed(2)}</td>
                  <td className="py-3 pr-4 text-brand-muted hidden md:table-cell">{p.stock}</td>
                  <td className="py-3 pr-4 hidden lg:table-cell">
                    {p.discount?.percent ? (
                      <span className="text-brand-amber text-[10px] font-body">
                        -{p.discount.percent}% · {p.discount.start} → {p.discount.end}
                      </span>
                    ) : (
                      <span className="text-brand-border text-[10px]">—</span>
                    )}
                  </td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <Link href={ap(`/merch/${p.id}/edit`)} className="text-brand-muted hover:text-brand-purple text-xs mr-4 transition-colors font-body">
                      Editar
                    </Link>
                    <DeleteButton slug={p.id} type="merch" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {query && (
        <p className="text-brand-muted text-xs font-body">{filtered.length} de {products.length} productos</p>
      )}
    </div>
  );
}
