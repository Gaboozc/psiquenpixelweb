'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field } from '@/components/admin/ContentEditor';

function SectionForm({ title, accentClass, value, onChange, showChannelId = false }) {
  const setKey = (key) => (e) => onChange({ ...value, [key]: e.target.value });
  const toggleComing = (e) => onChange({ ...value, comingSoon: e.target.checked });

  const setFeature = (i, key) => (e) =>
    onChange({
      ...value,
      features: value.features.map((f, idx) => (idx === i ? { ...f, [key]: e.target.value } : f)),
    });
  const removeFeature = (i) =>
    onChange({ ...value, features: value.features.filter((_, idx) => idx !== i) });
  const addFeature = () =>
    onChange({ ...value, features: [...value.features, { label: '', desc: '' }] });

  return (
    <section className="pixel-border p-5 space-y-4" style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <h2 className={`${accentClass} text-[10px] tracking-widest`} style={{ fontFamily: 'var(--font-pixel)' }}>
        {title}
      </h2>

      <Field label="DESCRIPCIÓN">
        <textarea value={value.description} onChange={setKey('description')} rows={3} className="admin-textarea" style={{ minHeight: '70px' }} />
      </Field>

      <div>
        <p className="text-brand-muted text-[8px] tracking-widest mb-1.5" style={{ fontFamily: 'var(--font-pixel)' }}>CARACTERÍSTICAS</p>
        <div className="space-y-2">
          {value.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={f.label} onChange={setFeature(i, 'label')} placeholder="Título" className="admin-input flex-1" />
              <input value={f.desc} onChange={setFeature(i, 'desc')} placeholder="Descripción" className="admin-input flex-1" />
              <button type="button" onClick={() => removeFeature(i)} className="text-brand-muted hover:text-red-400 text-xs px-2">✕</button>
            </div>
          ))}
          <button type="button" onClick={addFeature} className="text-brand-purple text-xs font-body hover:underline">+ Añadir</button>
        </div>
      </div>

      {showChannelId && (
        <Field label="ID DE CANAL DE YOUTUBE (UC… — muestra los últimos vídeos automáticamente)">
          <input value={value.channelId ?? ''} onChange={setKey('channelId')} className="admin-input" placeholder="UCxxxxxxxxxxxxxxxxxxxxxx" />
        </Field>
      )}

      <Field label="URL DE EMBED (iframe — deja vacío para placeholder)">
        <input value={value.embedUrl} onChange={setKey('embedUrl')} className="admin-input" placeholder="https://www.youtube.com/embed/VIDEO_ID o https://open.spotify.com/embed/show/ID" />
      </Field>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input type="checkbox" checked={value.comingSoon} onChange={toggleComing} className="w-4 h-4 accent-brand-purple" />
        <span className="text-brand-text text-xs font-body">
          Mostrar &quot;Próximamente&quot;{' '}
          <span className="text-brand-muted">{value.comingSoon ? '— placeholder' : '— muestra el embed'}</span>
        </span>
      </label>
    </section>
  );
}

export default function MediaEditor({ initial }) {
  const router = useRouter();
  const [youtube, setYoutube] = useState(initial.youtube);
  const [spotify, setSpotify] = useState(initial.spotify);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/admin/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtube, spotify }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Error al guardar');
      } else {
        setSaved(true);
        router.refresh();
      }
    } catch {
      setError('Error de red al guardar');
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <SectionForm title="▶ YOUTUBE" accentClass="text-brand-purple" value={youtube} onChange={(v) => { setYoutube(v); setSaved(false); }} showChannelId />
      <SectionForm title="♫ SPOTIFY" accentClass="text-brand-amber" value={spotify} onChange={(v) => { setSpotify(v); setSaved(false); }} />

      {error && <p className="text-red-400 text-xs font-body">{error}</p>}
      {saved && !error && <p className="text-brand-purple text-xs font-body">✓ Media guardada</p>}

      <button type="submit" disabled={saving}
        className="bg-brand-purple text-white text-xs px-6 py-2.5 font-body hover:bg-brand-purple-dim transition-colors disabled:opacity-50"
        style={{ boxShadow: '3px 3px 0 #6b3bbf' }}>
        {saving ? 'Guardando...' : 'Guardar Media'}
      </button>
    </form>
  );
}
