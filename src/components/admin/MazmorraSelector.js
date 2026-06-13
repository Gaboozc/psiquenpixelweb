'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MazmorraSelector({ games, current }) {
  const router = useRouter();
  const [selected, setSelected] = useState(current?.slug ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const game = games.find((g) => g.slug === selected);
    if (!game) return;
    setSaving(true);
    await fetch('/api/admin/mazmorra', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(game),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Current */}
      {current && (
        <div className="pixel-border-amber p-4 mb-2"
          style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <p className="text-brand-amber text-[8px] tracking-widest mb-1" style={{ fontFamily: 'var(--font-pixel)' }}>ACTUAL</p>
          <p className="text-brand-text text-sm font-body font-medium">{current.game}</p>
          <p className="text-brand-muted text-xs font-body">{current.title}</p>
        </div>
      )}

      {/* Game list */}
      <div>
        <p className="text-brand-muted text-[8px] tracking-widest mb-3 font-body" style={{ fontFamily: 'var(--font-pixel)' }}>
          SELECCIONAR JUEGO
        </p>

        {games.length === 0 ? (
          <p className="text-brand-muted text-sm font-body">No hay juegos en el catálogo.</p>
        ) : (
          <div className="space-y-2">
            {games.map((game) => (
              <label
                key={game.slug}
                className={`flex items-start gap-4 p-4 cursor-pointer border transition-colors ${
                  selected === game.slug
                    ? 'border-brand-purple bg-brand-purple/10'
                    : 'border-brand-border hover:border-brand-border/80 hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="mazmorra"
                  value={game.slug}
                  checked={selected === game.slug}
                  onChange={() => setSelected(game.slug)}
                  className="mt-0.5 accent-brand-purple shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-brand-amber text-xs font-body font-medium">{game.game}</p>
                  <p className="text-brand-text text-sm font-body line-clamp-1">{game.title}</p>
                  {game.excerpt && (
                    <p className="text-brand-muted text-xs font-body line-clamp-2 mt-1">{game.excerpt}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || !selected}
          className="bg-brand-purple text-white text-xs px-6 py-2.5 font-body hover:bg-brand-purple-dim transition-colors disabled:opacity-50"
          style={{ boxShadow: '3px 3px 0 #6b3bbf' }}
        >
          {saving ? 'Guardando...' : 'Guardar Selección'}
        </button>
        {saved && (
          <span className="text-green-400 text-xs font-body">✓ Guardado correctamente</span>
        )}
      </div>
    </div>
  );
}
