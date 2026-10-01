'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from './RichTextEditor';
import { uploadFile } from '@/lib/uploadClient';
import { ap } from '@/lib/adminPath';

// ---------------------------------------------------------------------------
// Image uploader
// ---------------------------------------------------------------------------
export function ImageUpload({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { url } = await uploadFile(file);
      onChange(url);
    } catch (err) {
      setError(err.message);
    }
    setUploading(false);
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… (sube una imagen o pega una URL)"
          className="admin-input flex-1"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 border border-brand-border text-brand-muted text-xs px-3 py-2 hover:border-brand-purple hover:text-brand-purple transition-colors font-body disabled:opacity-50"
        >
          {uploading ? '...' : 'Subir'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
      {error && <p className="text-red-400 text-xs font-body mt-1.5">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Generic field
// ---------------------------------------------------------------------------
export function Field({ label, children }) {
  return (
    <div>
      <label className="block text-brand-muted text-[8px] tracking-widest mb-1.5 font-body" style={{ fontFamily: 'var(--font-pixel)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Post editor
// ---------------------------------------------------------------------------
export function PostEditor({ initial, onSave, saveLabel = 'Guardar Post' }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title:      initial?.title      ?? '',
    slug:       initial?.slug       ?? '',
    date:       initial?.date       ?? new Date().toISOString().split('T')[0],
    category:   initial?.category   ?? '',
    excerpt:    initial?.excerpt    ?? '',
    tags:       (initial?.tags ?? []).join(', '),
    coverImage: initial?.coverImage ?? '',
    content:    initial?.content    ?? '',
    published:  initial?.published  ?? true,
    game:       initial?.game       ?? '',
    sagaSlug:   initial?.sagaSlug   ?? '',
    sagaOrder:  initial?.sagaOrder  ?? 1,
    sagaIntro:  initial?.sagaIntro  ?? false,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [sagas, setSagas] = useState([]);

  // Sagas the post can belong to (for the selector).
  useEffect(() => {
    fetch('/api/admin/sagas')
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => setSagas(Array.isArray(list) ? list : []))
      .catch(() => setSagas([]));
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      sagaSlug: form.sagaSlug || null,
      sagaOrder: Number(form.sagaOrder) || 0,
    };
    const err = await onSave(payload);
    if (err) { setError(err); setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <button type="button" onClick={() => setPreview(false)}
          className={`text-xs font-body px-3 py-1.5 border transition-colors ${!preview ? 'border-brand-purple text-brand-purple' : 'border-brand-border text-brand-muted hover:text-brand-text'}`}>
          Editar
        </button>
        <button type="button" onClick={() => setPreview(true)}
          className={`text-xs font-body px-3 py-1.5 border transition-colors ${preview ? 'border-brand-purple text-brand-purple' : 'border-brand-border text-brand-muted hover:text-brand-text'}`}>
          Vista previa
        </button>
      </div>

      {preview ? (
        <div className="pixel-border p-6 prose prose-invert max-w-none"
          style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <h2 className="text-brand-text text-xl mb-2" style={{ fontFamily: 'var(--font-cinzel)' }}>{form.title || 'Sin título'}</h2>
          <p className="text-brand-muted text-xs mb-4 font-body">{[form.date, form.category, form.game].filter(Boolean).join(' · ')}</p>
          {form.coverImage && <img src={form.coverImage} alt="" className="w-full h-48 object-cover mb-4 pixel-border" />}
          <p className="text-brand-muted text-sm italic mb-6 font-body">{form.excerpt}</p>
          <div className="prose prose-invert max-w-none font-body" dangerouslySetInnerHTML={{ __html: form.content }} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="TÍTULO *">
              <input value={form.title} onChange={set('title')} required className="admin-input" placeholder="Título del post" />
            </Field>
            <Field label="SLUG *">
              <input value={form.slug} onChange={set('slug')} required className="admin-input" placeholder="titulo-del-post"
                pattern="[a-z0-9-]+" title="Solo letras minúsculas, números y guiones" />
            </Field>
            <Field label="FECHA">
              <input type="date" value={form.date} onChange={set('date')} className="admin-input" />
            </Field>
            <Field label="CATEGORÍA">
              <input value={form.category} onChange={set('category')} className="admin-input" placeholder="Psicología, Narrativa, Análisis..." />
            </Field>
            <Field label="JUEGO (opcional)">
              <input value={form.game} onChange={set('game')} className="admin-input" placeholder="Elden Ring, Hades… (si el post analiza un juego)" />
            </Field>
          </div>

          {/* Saga */}
          <div className="pixel-border p-4 space-y-3" style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <p className="text-brand-amber text-[9px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
              ⚔ SAGA (opcional)
            </p>
            <p className="text-brand-muted text-[11px] font-body">
              Agrupa este post con otros del mismo juego o tema. En el blog la saga aparece como una sola tarjeta.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <Field label="SAGA">
                <select value={form.sagaSlug} onChange={set('sagaSlug')} className="admin-input">
                  <option value="">— Ninguna —</option>
                  {sagas.map((sg) => (
                    <option key={sg.slug} value={sg.slug}>{sg.title}</option>
                  ))}
                </select>
              </Field>
              {form.sagaSlug && !form.sagaIntro && (
                <Field label="PARTE Nº">
                  <input type="number" min="1" value={form.sagaOrder} onChange={set('sagaOrder')} className="admin-input" />
                </Field>
              )}
              {form.sagaSlug && (
                <label className="flex items-center gap-2 cursor-pointer select-none pb-2">
                  <input
                    type="checkbox"
                    checked={form.sagaIntro}
                    onChange={(e) => setForm((f) => ({ ...f, sagaIntro: e.target.checked }))}
                    className="w-4 h-4 accent-brand-amber"
                  />
                  <span className="text-brand-text text-xs font-body">Es la introducción</span>
                </label>
              )}
            </div>
            {sagas.length === 0 && (
              <p className="text-brand-muted text-[11px] font-body">
                Aún no hay sagas. Créalas en la sección <a href={ap('/sagas')} className="text-brand-amber hover:underline">Sagas</a>.
              </p>
            )}
          </div>

          <Field label="IMAGEN DE PORTADA">
            <ImageUpload value={form.coverImage} onChange={(v) => setForm((f) => ({ ...f, coverImage: v }))} />
          </Field>

          <Field label="RESUMEN">
            <textarea value={form.excerpt} onChange={set('excerpt')} rows={3}
              className="admin-textarea" style={{ minHeight: '80px' }} placeholder="Breve descripción del post..." />
          </Field>

          <Field label="TAGS (separados por comas)">
            <input value={form.tags} onChange={set('tags')} className="admin-input" placeholder="zelda, identidad, disociacion" />
          </Field>

          <Field label="CONTENIDO">
            <RichTextEditor
              value={form.content}
              onChange={(v) => setForm((f) => ({ ...f, content: v }))}
              placeholder="Escribe aquí. Usa la barra para dar formato e insertar imágenes, GIFs o vídeos."
            />
          </Field>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              className="w-4 h-4 accent-brand-purple"
            />
            <span className="text-brand-text text-xs font-body">
              Publicado{' '}
              <span className="text-brand-muted">
                {form.published ? '— visible en el sitio' : '— borrador, no visible'}
              </span>
            </span>
          </label>
        </>
      )}

      {error && <p className="text-red-400 text-xs font-body">{error}</p>}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving}
          className="bg-brand-purple text-white text-xs px-6 py-2.5 font-body hover:bg-brand-purple-dim transition-colors disabled:opacity-50"
          style={{ boxShadow: '3px 3px 0 #6b3bbf' }}>
          {saving ? 'Guardando...' : saveLabel}
        </button>
        <button type="button" onClick={() => router.back()}
          className="border border-brand-border text-brand-muted text-xs px-4 py-2.5 font-body hover:text-brand-text transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
