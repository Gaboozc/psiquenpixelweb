'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/',          label: 'Inicio',    icon: '/iconos/home.png'       },
  { href: '/blog',      label: 'Posts',     icon: '/iconos/posts.png'      },
  { href: '/media',     label: 'Media',     icon: '/iconos/media.png'      },
  { href: '/comunidad', label: 'Comunidad', icon: '/iconos/comunidad.png'  },
  { href: '/merch',     label: 'Merch',     icon: '/iconos/merch.png'      },
  { href: '/catalogo',  label: 'Catálogo',  icon: '/iconos/inventario.png' },
];

const Navbar = () => {
  const pathname = usePathname();
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-brand-border transition-shadow duration-200 ${
        scrolled ? 'shadow-lg shadow-black/60' : ''
      }`}
      style={{ backgroundImage: 'url(/navbar-background.png?v=3)', backgroundSize: '100% 100%' }}
    >
      <div className="w-full px-4 xl:px-10">
        {/* ── Main row ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between h-16 xl:h-32 2xl:h-36">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-typo.png"
              alt="Psique 'n' Pixel"
              width={320}
              height={100}
              className="h-10 xl:h-20 2xl:h-24 w-auto"
              priority
              unoptimized
            />
          </Link>

          {/* Desktop nav — only at xl (1280 px+) */}
          <div className="hidden xl:flex items-center gap-1 2xl:gap-2 -mt-4 2xl:-mt-6 -ml-6 2xl:-ml-10">
            {navLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`transition-all duration-75 ${
                  isActive(href)
                    ? 'opacity-100 drop-shadow-[0_0_8px_#9b59f7]'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={`${icon}?v=3`}
                  alt={label}
                  width={160}
                  height={160}
                  className="w-24 2xl:w-36 h-24 2xl:h-36 object-contain"
                  unoptimized
                />
              </Link>
            ))}
          </div>

          {/* Hamburger — everything below xl */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="xl:hidden flex flex-col justify-center gap-1.5 p-3 text-brand-text hover:text-brand-purple transition-colors"
          >
            <span className={`block w-7 h-0.5 bg-current transition-transform duration-200 ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block w-7 h-0.5 bg-current transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-7 h-0.5 bg-current transition-transform duration-200 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile / tablet menu ────────────────────────────────────────── */}
      {open && (
        <div
          className="xl:hidden border-t border-brand-border py-4 px-4"
          style={{ backgroundImage: 'url(/navbar-background.png?v=3)', backgroundSize: '100% 100%' }}
        >
          {/* 3-column grid on phones, 6-column on tablets */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-2">
            {navLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1.5 transition-all duration-75 ${
                  isActive(href)
                    ? 'opacity-100 drop-shadow-[0_0_8px_#9b59f7]'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={`${icon}?v=3`}
                  alt={label}
                  width={80}
                  height={80}
                  className="w-16 sm:w-20 h-16 sm:h-20 object-contain"
                  unoptimized
                />
                <span
                  className="text-brand-muted text-[7px] sm:text-[8px] tracking-widest text-center"
                  style={{ fontFamily: 'var(--font-pixel)' }}
                >
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
