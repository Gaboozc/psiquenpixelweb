'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ---------------------------------------------------------------------------
// Image uploader
// ---------------------------------------------------------------------------
function ImageUpload({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
    const data = await res.json();
    if (data.url) onChange(data.url);
    setUploading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/uploads/imagen.jpg o URL externa"
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
  );
}

// ---------------------------------------------------------------------------
// Generic field
// ---------------------------------------------------------------------------
function Field({ label, children }) {
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
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
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
          <p className="text-brand-muted text-xs mb-4 font-body">{form.date} · {form.category}</p>
          {form.coverImage && <img src={form.coverImage} alt="" className="w-full h-48 object-cover mb-4 pixel-border" />}
          <p className="text-brand-muted text-sm italic mb-6 font-body">{form.excerpt}</p>
          <pre className="text-brand-text text-xs whitespace-pre-wrap font-body leading-relaxed">{form.content}</pre>
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

          <Field label="CONTENIDO (Markdown)">
            <textarea value={form.content} onChange={set('content')} className="admin-textarea" placeholder="## Título&#10;&#10;Contenido en Markdown..." />
          </Field>
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

// ---------------------------------------------------------------------------
// Game editor
// ---------------------------------------------------------------------------
export function GameEditor({ initial, onSave, saveLabel = 'Guardar Análisis' }) {
  const router = useRouter();
  const [form, setForm] = useState({
    game:       initial?.game       ?? '',
    title:      initial?.title      ?? '',
    slug:       initial?.slug       ?? '',
    date:       initial?.date       ?? new Date().toISOString().split('T')[0],
    genre:      (initial?.genre ?? []).join(', '),
    excerpt:    initial?.excerpt    ?? '',
    tags:       (initial?.tags ?? []).join(', '),
    coverImage: initial?.coverImage ?? '',
    content:    initial?.content    ?? '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      genre: form.genre.split(',').map((g) => g.trim()).filter(Boolean),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
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
        <div className="pixel-border p-6"
          style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <p className="text-brand-amber text-[9px] mb-1" style={{ fontFamily: 'var(--font-pixel)' }}>{form.game || 'Juego'}</p>
          <h2 className="text-brand-text text-xl mb-2" style={{ fontFamily: 'var(--font-cinzel)' }}>{form.title || 'Sin título'}</h2>
          <p className="text-brand-muted text-xs mb-4 font-body">{form.date} · {form.genre}</p>
          {form.coverImage && <img src={form.coverImage} alt="" className="w-full h-48 object-cover mb-4 pixel-border" />}
          <p className="text-brand-muted text-sm italic mb-6 font-body">{form.excerpt}</p>
          <pre className="text-brand-text text-xs whitespace-pre-wrap font-body leading-relaxed">{form.content}</pre>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="NOMBRE DEL JUEGO *">
              <input value={form.game} onChange={set('game')} required className="admin-input" placeholder="Elden Ring" />
            </Field>
            <Field label="TÍTULO DEL ANÁLISIS *">
              <input value={form.title} onChange={set('title')} required className="admin-input" placeholder="El Vacío del Poder" />
            </Field>
            <Field label="SLUG *">
              <input value={form.slug} onChange={set('slug')} required className="admin-input" placeholder="elden-ring"
                pattern="[a-z0-9-]+" title="Solo letras minúsculas, números y guiones" />
            </Field>
            <Field label="FECHA">
              <input type="date" value={form.date} onChange={set('date')} className="admin-input" />
            </Field>
            <Field label="GÉNERO (separados por comas)">
              <input value={form.genre} onChange={set('genre')} className="admin-input" placeholder="RPG de Acción, Soulslike" />
            </Field>
            <Field label="TAGS (separados por comas)">
              <input value={form.tags} onChange={set('tags')} className="admin-input" placeholder="trauma, poder, mitos" />
            </Field>
          </div>

          <Field label="IMAGEN DE PORTADA">
            <ImageUpload value={form.coverImage} onChange={(v) => setForm((f) => ({ ...f, coverImage: v }))} />
          </Field>

          <Field label="RESUMEN">
            <textarea value={form.excerpt} onChange={set('excerpt')} rows={3}
              className="admin-textarea" style={{ minHeight: '80px' }} placeholder="Breve descripción del análisis..." />
          </Field>

          <Field label="CONTENIDO (Markdown)">
            <textarea value={form.content} onChange={set('content')} className="admin-textarea" placeholder="## Título&#10;&#10;Contenido en Markdown..." />
          </Field>
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
