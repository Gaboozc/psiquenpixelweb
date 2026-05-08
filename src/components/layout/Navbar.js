'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/',          label: 'Inicio'     },
  { href: '/blog',      label: 'Blog'       },
  { href: '/catalogo',  label: 'Catálogo'   },
  { href: '/media',     label: 'Media'      },
  { href: '/comunidad', label: 'Comunidad'  },
];

const Navbar = () => {
  const pathname  = usePathname();
  const [open,      setOpen]      = useState(false);
  const [scrolled,  setScrolled]  = useState(false);

  // Add shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      className={`sticky top-0 z-50 bg-brand-surface border-b border-brand-border transition-shadow duration-200 ${
        scrolled ? 'shadow-lg shadow-black/60' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span
              className="font-pixel text-brand-purple pixel-logo-shadow text-xs sm:text-sm tracking-tight"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              Psique&nbsp;<span className="text-brand-text">'n'</span>&nbsp;Pixel
            </span>
            <span
              className="font-pixel text-brand-amber text-[7px] tracking-widest mt-1 hidden sm:block"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              Las Mazmorras de la Mente
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 text-[10px] tracking-widest transition-all duration-75 ${
                  isActive(href)
                    ? 'text-brand-purple pixel-border-purple bg-brand-surface'
                    : 'text-brand-muted hover:text-brand-purple hover:pixel-border-purple hover:bg-brand-surface'
                }`}
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden flex flex-col gap-1.5 p-2 text-brand-muted hover:text-brand-purple transition-colors"
          >
            <span
              className={`block w-6 h-0.5 bg-current transition-transform duration-150 ${
                open ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-current transition-opacity duration-150 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-current transition-transform duration-150 ${
                open ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-brand-border bg-brand-surface px-4 py-3 flex flex-col gap-2">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 text-[10px] tracking-widest transition-all duration-75 ${
                isActive(href)
                  ? 'text-brand-purple pixel-border-purple'
                  : 'text-brand-muted hover:text-brand-purple'
              }`}
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
