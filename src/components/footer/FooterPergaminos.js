'use client';

import { useState } from 'react';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Newsletter form
// ---------------------------------------------------------------------------
function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="w-full">
      {status === 'success' ? (
        <p className="text-brand-purple text-[9px] text-center" style={{ fontFamily: 'var(--font-pixel)' }}>
          ✓ ¡Suscrito, Héroe!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            disabled={status === 'loading'}
            className="flex-1 min-w-0 bg-brand-bg/70 border border-brand-border text-brand-text text-xs px-3 py-2 outline-none placeholder:text-brand-muted focus:border-brand-purple transition-colors font-body"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="shrink-0 bg-brand-purple text-white text-[8px] tracking-widest px-4 py-2.5 hover:bg-brand-purple-dim transition-colors disabled:opacity-50"
            style={{ fontFamily: 'var(--font-pixel)', boxShadow: '3px 3px 0 #6b3bbf' }}
          >
            {status === 'loading' ? '...' : 'ENVIAR'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-[9px] mt-1 font-body">Error al suscribirse. Inténtalo de nuevo.</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function FooterPergaminos({ mazmorra }) {
  return (
    <div
      className="w-full max-w-xl pixel-border overflow-hidden"
      style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* ── TOP: Newsletter ────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 py-4 border-b border-brand-border/60">
        <p
          className="text-brand-purple text-[8px] sm:text-[8px] tracking-widest mb-1"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          ✦ PERGAMINOS DE LA MAZMORRA ✦
        </p>
        <h3
          className="text-brand-text text-[9px] sm:text-xs mb-2"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          ¡Suscríbete, Héroe!
        </h3>
        <p className="text-brand-muted text-[10px] sm:text-xs font-body mb-3 leading-relaxed">
          Recibe los análisis más profundos en tu correo. Sin spam, solo mazmorras.
        </p>
        <NewsletterForm />
      </div>

      {/* ── BOTTOM: Mazmorra + Apoyo ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-brand-border/60">

        {/* Mazmorra de la Semana */}
        <div className="px-4 sm:px-5 py-4 flex flex-col gap-2">
          <p
            className="text-brand-amber text-[8px] tracking-widest"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            ⚔ MAZMORRA DE LA SEMANA
          </p>

          {mazmorra ? (
            <>
              <p className="text-brand-purple text-[8px]" style={{ fontFamily: 'var(--font-pixel)' }}>
                {mazmorra.game}
              </p>
              <p className="text-brand-text text-xs font-body leading-snug line-clamp-2">
                {mazmorra.title}
              </p>
              <p className="text-brand-muted text-[10px] font-body leading-relaxed line-clamp-2">
                {mazmorra.excerpt}
              </p>
              <Link
                href={`/catalogo/${mazmorra.slug}`}
                className="text-brand-amber text-[8px] tracking-wider hover:text-brand-amber-dim transition-colors mt-auto pt-1"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                VER ANÁLISIS →
              </Link>
            </>
          ) : (
            <p className="text-brand-muted text-[10px] font-body">Próximamente…</p>
          )}
        </div>

        {/* Apoyo / Donación */}
        <div className="px-4 sm:px-5 py-4 flex flex-col gap-3">
          <p
            className="text-brand-purple text-[8px] tracking-widest"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            ♥ APOYA EL PROYECTO
          </p>
          <p className="text-brand-muted text-[10px] sm:text-xs font-body leading-relaxed">
            Si nuestro contenido te aporta valor, considera apoyar la mazmorra.
          </p>
          <div className="flex flex-col gap-2 mt-auto">
            <a
              href="https://ko-fi.com/psiquenpixel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-brand-text text-[8px] tracking-widest border border-brand-amber/50 px-3 py-3 hover:border-brand-amber hover:text-brand-amber transition-colors"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              ☕ KO-FI
            </a>
            <a
              href="https://patreon.com/psiquenpixel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-brand-text text-[8px] tracking-widest border border-brand-purple/50 px-3 py-3 hover:border-brand-purple hover:text-brand-purple transition-colors"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              ▲ PATREON
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
