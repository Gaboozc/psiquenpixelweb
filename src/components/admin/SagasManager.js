'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Field, ImageUpload } from '@/components/admin/ContentEditor';
import { ap } from '@/lib/adminPath';

const EMPTY = { title: '', slug: '', description: '', coverImage: '' };
const slugify = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const btn = 'text-xs font-body px-3 py-1.5 border transition-colors disabled:opacity-40';

// ---------------------------------------------------------------------------
// Create / edit form
// ---------------------------------------------------------------------------
function SagaForm({ initial, isNew, onDone, onCancel }) {
  const [form, setForm] = useState(initial ?? EMPTY);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({
      ...f,
      [key]: value,
      // Suggest a slug from the title until the user edits it by hand.
      ...(key === 'title' && isNew && !slugTouched ? { slug: slugify(value) } : {}),
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await fetch(isNew ? '/api/admin/sagas' : `/api/admin/sagas/${initial.slug}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) return setError(data.error || 'Error al guardar');
    onDone();
  };

  return (
    <form onSubmit={submit} className="pixel-border p-5 space-y-4"
      style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <p className="text-brand-amber text-[9px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
        {isNew ? '+ NUEVA SAGA' : `EDITAR SAGA · ${initial.title}`}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="TÍTULO *">
          <input value={form.title} onChange={set('title')} required className="admin-input" placeholder="Dark Souls" />
        </Field>
        <Field label="SLUG *">
          <input
            value={form.slug}
            onChange={(e) => { setSlugTouched(true); set('slug')(e); }}
            required
            disabled={!isNew}
            className="admin-input disabled:opacity-60"
            placeholder="dark-souls"
            pattern="[a-z0-9-]+"
            title="Solo minúsculas, números y guiones"
          />
        </Field>
      </div>
      <Field label="DESCRIPCIÓN (se ve en la tarjeta y en la página de la saga)">
        <textarea value={form.description} onChange={set('description')} rows={3}
          className="admin-textarea" style={{ minHeight: '70px' }} placeholder="De qué trata esta saga…" />
      </Field>
      <Field label="PORTADA (opcional — si no, usa la de la introducción)">
        <ImageUpload value={form.coverImage} onChange={(v) => setForm((f) => ({ ...f, coverImage: v }))} />
      </Field>
      {error && <p className="text-red-400 text-xs font-body">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="bg-brand-purple text-white text-xs px-5 py-2 font-body hover:bg-brand-purple-dim transition-colors disabled:opacity-50"
          style={{ boxShadow: '3px 3px 0 #6b3bbf' }}>
          {saving ? 'Guardando…' : isNew ? 'Crear saga' : 'Guardar'}
        </button>
        <button type="button" onClick={onCancel}
          className="border border-brand-border text-brand-muted text-xs px-4 py-2 font-body hover:text-brand-text transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// One saga: info, parts in order, reorder + delete
// ---------------------------------------------------------------------------
function SagaRow({ saga, onEdit, onChanged }) {
  const [parts, setParts] = useState(saga.parts);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  const intro = parts.find((p) => p.sagaIntro);
  const numbered = parts.filter((p) => !p.sagaIntro);

  const move = async (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= numbered.length) return;
    const next = [...numbered];
    [next[i], next[j]] = [next[j], next[i]];
    const previous = parts;
    setParts([...(intro ? [intro] : []), ...next]);
    setBusy(true);
    setError('');
    const res = await fetch(`/api/admin/sagas/${saga.slug}/order`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugs: next.map((p) => p.slug) }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'No se pudo reordenar');
      setParts(previous);
      return;
    }
    onChanged();
  };

  const remove = async () => {
    setBusy(true);
    const res = await fetch(`/api/admin/sagas/${saga.slug}`, { method: 'DELETE' });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'No se pudo borrar');
      setConfirming(false);
      return;
    }
    onChanged();
  };

  const PartLine = ({ p, label, index }) => (
    <li className="flex items-center gap-3 py-2 border-b border-brand-border/40 last:border-0">
      <span className="w-24 shrink-0 text-[9px] tracking-widest text-brand-amber" style={{ fontFamily: 'var(--font-pixel)' }}>
        {label}
      </span>
      <Link href={ap(`/posts/${p.slug}/edit`)} className="flex-1 min-w-0 text-brand-text text-xs font-body hover:text-brand-purple truncate">
        {p.title}
      </Link>
      {!p.published && (
        <span className="text-[8px] px-1.5 py-0.5 border border-brand-border text-brand-muted font-body">BORRADOR</span>
      )}
      {index !== undefined && (
        <span className="flex gap-1">
          <button type="button" onClick={() => move(index, -1)} disabled={busy || index === 0}
            className="text-brand-muted hover:text-brand-purple disabled:opacity-30 px-1.5" aria-label="Subir">↑</button>
          <button type="button" onClick={() => move(index, 1)} disabled={busy || index === numbered.length - 1}
            className="text-brand-muted hover:text-brand-purple disabled:opacity-30 px-1.5" aria-label="Bajar">↓</button>
        </span>
      )}
    </li>
  );

  return (
    <div className="pixel-border p-5 space-y-3"
      style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <p className="text-brand-text text-sm font-body font-semibold">{saga.title}</p>
          <p className="text-brand-border text-[10px] font-body">/blog/saga/{saga.slug} · {parts.length} post{parts.length === 1 ? '' : 's'}</p>
          {saga.description && <p className="text-brand-muted text-xs font-body mt-1 line-clamp-2">{saga.description}</p>}
        </div>
        <div className="flex gap-2 shrink-0">
          <button type="button" onClick={onEdit} className={`${btn} border-brand-border text-brand-muted hover:border-brand-purple hover:text-brand-purple`}>
            Editar
          </button>
          {confirming ? (
            <>
              <button type="button" onClick={remove} disabled={busy} className={`${btn} border-red-500 text-red-400`}>Confirmar</button>
              <button type="button" onClick={() => setConfirming(false)} className={`${btn} border-brand-border text-brand-muted`}>No</button>
            </>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className={`${btn} border-brand-border text-brand-muted hover:border-red-500 hover:text-red-400`}>
              Eliminar
            </button>
          )}
        </div>
      </div>

      {confirming && (
        <p className="text-brand-muted text-[11px] font-body">
          Se borra la saga; sus posts <strong>no</strong> se borran, quedan sueltos en el blog.
        </p>
      )}

      {parts.length === 0 ? (
        <p className="text-brand-muted text-xs font-body">
          Sin posts todavía. Asigna posts a esta saga desde el editor de cada post (bloque «Saga»).
        </p>
      ) : (
        <ul>
          {intro && <PartLine p={intro} label="INTRO" />}
          {numbered.map((p, i) => (
            <PartLine key={p.slug} p={p} label={`PARTE ${i + 1}`} index={i} />
          ))}
        </ul>
      )}
      {error && <p className="text-red-400 text-xs font-body">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
export default function SagasManager({ sagas }) {
  const router = useRouter();
  const [editing, setEditing] = useState(null); // null | 'new' | slug

  const refresh = () => {
    setEditing(null);
    router.refresh();
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {editing === 'new' ? (
        <SagaForm isNew onDone={refresh} onCancel={() => setEditing(null)} />
      ) : (
        <button type="button" onClick={() => setEditing('new')}
          className="bg-brand-amber text-brand-bg text-[10px] tracking-widest px-4 py-2.5 font-body hover:bg-brand-amber-dim transition-colors"
          style={{ fontFamily: 'var(--font-pixel)' }}>
          + NUEVA SAGA
        </button>
      )}

      {sagas.length === 0 && editing !== 'new' && (
        <p className="text-brand-muted text-sm font-body">
          Aún no hay sagas. Crea una y luego asígnale posts desde el editor de cada post.
        </p>
      )}

      {sagas.map((saga) =>
        editing === saga.slug ? (
          <SagaForm key={saga.slug} initial={saga} onDone={refresh} onCancel={() => setEditing(null)} />
        ) : (
          // key includes the parts order so local reorder state resets after a refresh
          <SagaRow key={`${saga.slug}:${saga.parts.map((p) => p.slug).join(',')}`}
            saga={saga} onEdit={() => setEditing(saga.slug)} onChanged={() => router.refresh()} />
        ),
      )}
    </div>
  );
}
