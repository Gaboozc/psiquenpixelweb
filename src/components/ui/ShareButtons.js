'use client';

import { useState } from 'react';

export default function ShareButtons({ title = '', accentColor = 'purple' }) {
  const [copied, setCopied] = useState(false);

  const accent =
    accentColor === 'amber'
      ? 'border-brand-amber text-brand-amber hover:bg-brand-amber/15'
      : 'border-brand-purple text-brand-purple hover:bg-brand-purple/15';

  const url = () => (typeof window !== 'undefined' ? window.location.href : '');

  const openShare = (href) => {
    window.open(href, '_blank', 'noopener,noreferrer,width=600,height=520');
  };

  const shareX = () =>
    openShare(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url())}`,
    );

  const shareWhatsApp = () =>
    openShare(`https://wa.me/?text=${encodeURIComponent(`${title} ${url()}`)}`);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const btn = `text-[8px] tracking-widest px-3 py-2 border transition-colors ${accent}`;

  return (
    <div className="flex items-center gap-2 flex-wrap" style={{ fontFamily: 'var(--font-pixel)' }}>
      <span className="text-brand-muted text-[8px] tracking-widest mr-1">COMPARTIR</span>
      <button type="button" onClick={shareX} className={btn} aria-label="Compartir en X">
        ✕ X
      </button>
      <button type="button" onClick={shareWhatsApp} className={btn} aria-label="Compartir en WhatsApp">
        ♦ WA
      </button>
      <button type="button" onClick={copyLink} className={btn} aria-label="Copiar enlace">
        {copied ? '✓ COPIADO' : '⧉ LINK'}
      </button>
    </div>
  );
}
