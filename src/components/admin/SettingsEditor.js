'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field } from '@/components/admin/ContentEditor';

const SOCIAL_FIELDS = [
  ['youtube', 'YOUTUBE'],
  ['discord', 'DISCORD'],
  ['spotify', 'SPOTIFY'],
  ['instagram', 'INSTAGRAM'],
  ['twitch', 'TWITCH'],
];

const SUPPORT_FIELDS = [
  ['kofi', 'KO-FI'],
];

export default function SettingsEditor({ initial }) {
  const router = useRouter();
  const [social, setSocial] = useState(initial.social);
  const [support, setSupport] = useState(initial.support);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const setLink = (group, setter) => (key) => (e) => {
    const value = e.target.value;
    setter((g) => ({ ...g, [key]: value }));
    setSaved(false);
  };
  const setSocialLink = setLink(social, setSocial);
  const setSupportLink = setLink(support, setSupport);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ social, support }),
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
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <section className="space-y-4">
        <h2
          className="text-brand-purple text-[10px] tracking-widest"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          ✦ REDES SOCIALES
        </h2>
        {SOCIAL_FIELDS.map(([key, label]) => (
          <Field key={key} label={label}>
            <input
              type="url"
              value={social[key] ?? ''}
              onChange={setSocialLink(key)}
              className="admin-input"
              placeholder="https://..."
            />
          </Field>
        ))}
      </section>

      <section className="space-y-4">
        <h2
          className="text-brand-amber text-[10px] tracking-widest"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          ♥ APOYO
        </h2>
        {SUPPORT_FIELDS.map(([key, label]) => (
          <Field key={key} label={label}>
            <input
              type="url"
              value={support[key] ?? ''}
              onChange={setSupportLink(key)}
              className="admin-input"
              placeholder="https://..."
            />
          </Field>
        ))}
      </section>

      {error && <p className="text-red-400 text-xs font-body">{error}</p>}
      {saved && !error && (
        <p className="text-brand-purple text-xs font-body">✓ Ajustes guardados</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="bg-brand-purple text-white text-xs px-6 py-2.5 font-body hover:bg-brand-purple-dim transition-colors disabled:opacity-50"
        style={{ boxShadow: '3px 3px 0 #6b3bbf' }}
      >
        {saving ? 'Guardando...' : 'Guardar Ajustes'}
      </button>
    </form>
  );
}
