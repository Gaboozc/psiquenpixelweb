'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field } from '@/components/admin/ContentEditor';

export default function ComunidadEditor({ initial }) {
  const router = useRouter();
  const [twitch, setTwitch] = useState(initial.twitch);
  const [discord, setDiscord] = useState(initial.discord);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const setT = (key) => (e) => { setTwitch((s) => ({ ...s, [key]: e.target.value })); setSaved(false); };
  const setD = (key) => (e) => { setDiscord((s) => ({ ...s, [key]: e.target.value })); setSaved(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/admin/comunidad', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ twitch, discord }),
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
      <section className="pixel-border p-5 space-y-4" style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <h2 className="text-brand-purple text-[10px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>▶ TWITCH</h2>
        <p className="text-brand-muted text-[11px] font-body">El estado en directo se detecta automáticamente. El enlace &quot;VER EN TWITCH&quot; se edita en Ajustes.</p>
        <Field label="DESCRIPCIÓN">
          <textarea value={twitch.description} onChange={setT('description')} rows={3} className="admin-textarea" style={{ minHeight: '70px' }} />
        </Field>
      </section>

      <section className="pixel-border-amber p-5 space-y-4" style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <h2 className="text-brand-amber text-[10px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>⚔ DISCORD</h2>
        <p className="text-brand-muted text-[11px] font-body">El enlace de invitación se edita en Ajustes.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="NOMBRE DEL SERVIDOR">
            <input value={discord.serverName} onChange={setD('serverName')} className="admin-input" />
          </Field>
          <Field label="LEMA">
            <input value={discord.tagline} onChange={setD('tagline')} className="admin-input" />
          </Field>
        </div>
        <Field label="DESCRIPCIÓN">
          <textarea value={discord.description} onChange={setD('description')} rows={3} className="admin-textarea" style={{ minHeight: '70px' }} />
        </Field>
        <Field label="PIE (características)">
          <input value={discord.footnote} onChange={setD('footnote')} className="admin-input" />
        </Field>
      </section>

      {error && <p className="text-red-400 text-xs font-body">{error}</p>}
      {saved && !error && <p className="text-brand-purple text-xs font-body">✓ Comunidad guardada</p>}

      <button type="submit" disabled={saving}
        className="bg-brand-purple text-white text-xs px-6 py-2.5 font-body hover:bg-brand-purple-dim transition-colors disabled:opacity-50"
        style={{ boxShadow: '3px 3px 0 #6b3bbf' }}>
        {saving ? 'Guardando...' : 'Guardar Comunidad'}
      </button>
    </form>
  );
}
