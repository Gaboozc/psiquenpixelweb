'use client';

import { useState, useEffect } from 'react';

// Playful RPG-flavored "like": toggles a +XP state persisted in localStorage
// per slug. No backend — a brand detail, not a global counter.
export default function XpButton({ slug, accentColor = 'purple' }) {
  const [given, setGiven] = useState(false);
  const [ready, setReady] = useState(false);
  const key = `pnp-xp:${slug}`;

  useEffect(() => {
    try {
      setGiven(localStorage.getItem(key) === '1');
    } catch {
      /* no localStorage */
    }
    setReady(true);
  }, [key]);

  const toggle = () => {
    const next = !given;
    setGiven(next);
    try {
      if (next) localStorage.setItem(key, '1');
      else localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  };

  const accent =
    accentColor === 'amber'
      ? given
        ? 'bg-brand-amber text-brand-bg border-brand-amber'
        : 'border-brand-amber text-brand-amber hover:bg-brand-amber/15'
      : given
        ? 'bg-brand-purple text-white border-brand-purple'
        : 'border-brand-purple text-brand-purple hover:bg-brand-purple/15';

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!ready}
      className={`text-[8px] tracking-widest px-4 py-2 border transition-colors disabled:opacity-50 ${accent}`}
      style={{ fontFamily: 'var(--font-pixel)' }}
      aria-pressed={given}
    >
      {given ? '⚔ +1 XP OTORGADO' : '⚔ OTORGAR +1 XP'}
    </button>
  );
}
