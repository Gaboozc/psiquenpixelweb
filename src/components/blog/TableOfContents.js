'use client';

import { useState } from 'react';

export default function TableOfContents({ headings = [], accentColor = 'purple' }) {
  const [open, setOpen] = useState(false);

  if (!headings || headings.length < 3) return null;

  const accent = accentColor === 'amber' ? 'text-brand-amber' : 'text-brand-purple';

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    }
    setOpen(false);
  };

  return (
    <nav
      className="pixel-border p-4 mb-8"
      style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      aria-label="Tabla de contenidos"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between lg:cursor-default"
      >
        <span
          className={`text-[9px] tracking-widest ${accent}`}
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          ✦ EN ESTA PÁGINA
        </span>
        <span className={`lg:hidden text-brand-muted text-xs transition-transform ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      <ul className={`mt-3 space-y-1.5 ${open ? 'block' : 'hidden'} lg:block`}>
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
            <a
              href={`#${h.id}`}
              onClick={(e) => handleClick(e, h.id)}
              className="text-brand-muted hover:text-brand-text text-xs font-body leading-snug transition-colors block"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
