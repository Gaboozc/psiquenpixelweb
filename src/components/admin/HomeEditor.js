'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field, ImageUpload } from '@/components/admin/ContentEditor';

function BannerForm({ title, value, onChange }) {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value });
  return (
    <section className="pixel-border p-5 space-y-4" style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <h2 className="text-brand-amber text-[10px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="EYEBROW (línea superior)">
          <input value={value.eyebrow} onChange={set('eyebrow')} className="admin-input" />
        </Field>
        <Field label="TÍTULO">
          <input value={value.title} onChange={set('title')} className="admin-input" />
        </Field>
      </div>
      <Field label="TEXTO">
        <textarea value={value.text} onChange={set('text')} rows={2} className="admin-textarea" style={{ minHeight: '60px' }} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="BOTÓN 1 — TEXTO">
          <input value={value.primaryLabel} onChange={set('primaryLabel')} className="admin-input" />
        </Field>
        <Field label="BOTÓN 1 — ENLACE">
          <input value={value.primaryHref} onChange={set('primaryHref')} className="admin-input" placeholder="/media" />
        </Field>
        <Field label="BOTÓN 2 — TEXTO (enlace desde Ajustes)">
          <input value={value.secondaryLabel} onChange={set('secondaryLabel')} className="admin-input" />
        </Field>
      </div>
    </section>
  );
}

export default function HomeEditor({ initial }) {
  const router = useRouter();
  const [hero, setHero] = useState({
    phrases: initial.hero.phrases.join('\n'),
    ctas: initial.hero.ctas,
    videoUrl: initial.hero.videoUrl,
  });
  const [mediaBanner, setMediaBanner] = useState(initial.mediaBanner);
  const [communityBanner, setCommunityBanner] = useState(initial.communityBanner);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty = () => setSaved(false);

  const setCta = (i, key) => (e) => {
    setHero((h) => ({ ...h, ctas: h.ctas.map((c, idx) => (idx === i ? { ...c, [key]: e.target.value } : c)) }));
    dirty();
  };
  const removeCta = (i) => setHero((h) => ({ ...h, ctas: h.ctas.filter((_, idx) => idx !== i) }));
  const addCta = () => setHero((h) => ({ ...h, ctas: [...h.ctas, { label: '', href: '' }] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    const payload = {
      hero: {
        phrases: hero.phrases.split('\n').map((p) => p.trim()).filter(Boolean),
        ctas: hero.ctas,
        videoUrl: hero.videoUrl,
      },
      mediaBanner,
      communityBanner,
    };
    try {
      const res = await fetch('/api/admin/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
      {/* Hero */}
      <section className="pixel-border-purple p-5 space-y-4" style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <h2 className="text-brand-purple text-[10px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>⌂ HERO</h2>

        <Field label="FRASES ROTATIVAS (una por línea)">
          <textarea
            value={hero.phrases}
            onChange={(e) => { setHero((h) => ({ ...h, phrases: e.target.value })); dirty(); }}
            rows={4}
            className="admin-textarea"
            style={{ minHeight: '90px' }}
          />
        </Field>

        <div>
          <p className="text-brand-muted text-[8px] tracking-widest mb-1.5" style={{ fontFamily: 'var(--font-pixel)' }}>BOTONES (CTAs)</p>
          <div className="space-y-2">
            {hero.ctas.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={c.label} onChange={setCta(i, 'label')} placeholder="Texto" className="admin-input flex-1" />
                <input value={c.href} onChange={setCta(i, 'href')} placeholder="/blog" className="admin-input flex-1" />
                <button type="button" onClick={() => removeCta(i)} className="text-brand-muted hover:text-red-400 text-xs px-2">✕</button>
              </div>
            ))}
            <button type="button" onClick={addCta} className="text-brand-purple text-xs font-body hover:underline">+ Añadir botón</button>
          </div>
        </div>

        <Field label="VÍDEO DE FONDO (URL)">
          <ImageUpload value={hero.videoUrl} onChange={(v) => { setHero((h) => ({ ...h, videoUrl: v })); dirty(); }} />
        </Field>
      </section>

      <BannerForm title="▶ BANNER MEDIA" value={mediaBanner} onChange={(v) => { setMediaBanner(v); dirty(); }} />
      <BannerForm title="⚔ BANNER COMUNIDAD" value={communityBanner} onChange={(v) => { setCommunityBanner(v); dirty(); }} />

      {error && <p className="text-red-400 text-xs font-body">{error}</p>}
      {saved && !error && <p className="text-brand-purple text-xs font-body">✓ Home guardada</p>}

      <button type="submit" disabled={saving}
        className="bg-brand-purple text-white text-xs px-6 py-2.5 font-body hover:bg-brand-purple-dim transition-colors disabled:opacity-50"
        style={{ boxShadow: '3px 3px 0 #6b3bbf' }}>
        {saving ? 'Guardando...' : 'Guardar Home'}
      </button>
    </form>
  );
}
