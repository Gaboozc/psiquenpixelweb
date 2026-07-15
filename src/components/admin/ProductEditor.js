'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field } from '@/components/admin/ContentEditor';
import { ap } from '@/lib/adminPath';

export default function ProductEditor({ initial, categories = [], isNew = false }) {
  const router = useRouter();
  const disc = initial?.discount ?? null;
  const [form, setForm] = useState({
    id:          initial?.id          ?? '',
    name:        initial?.name        ?? '',
    description: initial?.description ?? '',
    price:       initial?.price       ?? '',
    category:    initial?.category    ?? (categories.find((c) => c.id !== 'todos')?.id ?? ''),
    sizes:       (initial?.sizes ?? []).join(', '),
    colors:      (initial?.colors ?? []).join(', '),
    stock:       initial?.stock       ?? 0,
    badge:       initial?.badge       ?? '',
    icon:        initial?.icon        ?? '📦',
    tags:        (initial?.tags ?? []).join(', '),
    discountPercent: disc?.percent ?? '',
    discountStart:   disc?.start   ?? '',
    discountEnd:     disc?.end     ?? '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const selectableCategories = categories.filter((c) => c.id !== 'todos');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const hasDiscount = form.discountPercent && form.discountStart && form.discountEnd;
    if (hasDiscount && form.discountStart > form.discountEnd) {
      setError('La fecha de inicio del descuento no puede ser posterior a la de fin.');
      setSaving(false);
      return;
    }

    const payload = {
      id: form.id,
      name: form.name,
      description: form.description,
      price: form.price,
      category: form.category,
      sizes: form.sizes,
      colors: form.colors,
      stock: form.stock,
      badge: form.badge,
      icon: form.icon,
      tags: form.tags,
      discount: hasDiscount
        ? { percent: form.discountPercent, start: form.discountStart, end: form.discountEnd }
        : null,
    };

    const url = isNew ? '/api/admin/merch' : `/api/admin/merch/${form.id}`;
    const method = isNew ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Error al guardar');
        setSaving(false);
        return;
      }
      router.push(ap('/merch'));
      router.refresh();
    } catch {
      setError('Error de red al guardar');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="NOMBRE *">
          <input value={form.name} onChange={set('name')} required className="admin-input" placeholder="Camiseta ..." />
        </Field>
        <Field label="ID *">
          <input
            value={form.id}
            onChange={set('id')}
            required
            disabled={!isNew}
            className="admin-input disabled:opacity-60"
            placeholder="ts-mazmorras-01"
            pattern="[a-z0-9-]+"
            title="Solo minúsculas, números y guiones"
          />
        </Field>
        <Field label="PRECIO (€) *">
          <input type="number" step="0.01" min="0" value={form.price} onChange={set('price')} required className="admin-input" placeholder="24.99" />
        </Field>
        <Field label="CATEGORÍA">
          <select value={form.category} onChange={set('category')} className="admin-input">
            {selectableCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="STOCK">
          <input type="number" min="0" value={form.stock} onChange={set('stock')} className="admin-input" />
        </Field>
        <Field label="ICONO (emoji)">
          <input value={form.icon} onChange={set('icon')} className="admin-input" placeholder="🖤" />
        </Field>
        <Field label="BADGE (opcional)">
          <input value={form.badge} onChange={set('badge')} className="admin-input" placeholder="NUEVO, BESTSELLER, ED. LIMITADA..." />
        </Field>
        <Field label="TALLAS (separadas por comas)">
          <input value={form.sizes} onChange={set('sizes')} className="admin-input" placeholder="XS, S, M, L, XL" />
        </Field>
        <Field label="COLORES (separados por comas)">
          <input value={form.colors} onChange={set('colors')} className="admin-input" placeholder="Negro, Carbón" />
        </Field>
        <Field label="TAGS (separados por comas)">
          <input value={form.tags} onChange={set('tags')} className="admin-input" placeholder="logo, pixel-art, unisex" />
        </Field>
      </div>

      <Field label="DESCRIPCIÓN">
        <textarea value={form.description} onChange={set('description')} rows={3} className="admin-textarea" style={{ minHeight: '80px' }} placeholder="Descripción del producto..." />
      </Field>

      {/* ── Discount scheduler ─────────────────────────────────────── */}
      <div className="pixel-border p-4 space-y-4" style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <p className="text-brand-amber text-[9px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
          ⚡ DESCUENTO PROGRAMADO (opcional)
        </p>
        <p className="text-brand-muted text-[11px] font-body">
          Rellena los tres campos para activar un descuento entre las fechas indicadas. Déjalos vacíos para no aplicar descuento.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="% DESCUENTO">
            <input type="number" min="1" max="99" value={form.discountPercent} onChange={set('discountPercent')} className="admin-input" placeholder="20" />
          </Field>
          <Field label="INICIO">
            <input type="date" value={form.discountStart} onChange={set('discountStart')} className="admin-input" />
          </Field>
          <Field label="FIN">
            <input type="date" value={form.discountEnd} onChange={set('discountEnd')} className="admin-input" />
          </Field>
        </div>
      </div>

      {error && <p className="text-red-400 text-xs font-body">{error}</p>}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving}
          className="bg-brand-purple text-white text-xs px-6 py-2.5 font-body hover:bg-brand-purple-dim transition-colors disabled:opacity-50"
          style={{ boxShadow: '3px 3px 0 #6b3bbf' }}>
          {saving ? 'Guardando...' : (isNew ? 'Crear Producto' : 'Guardar Producto')}
        </button>
        <button type="button" onClick={() => router.back()}
          className="border border-brand-border text-brand-muted text-xs px-4 py-2.5 font-body hover:text-brand-text transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
