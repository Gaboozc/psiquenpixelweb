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
  const pathname  = usePathname();
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on navigation
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
      <div className="w-full max-w-[1800px] mx-auto px-2 sm:px-4 xl:px-10">
        <div className="flex items-center h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 2xl:h-36">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-typo.png"
              alt="Psique 'n' Pixel"
              width={320}
              height={100}
              sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, (max-width: 1280px) 128px, 160px"
              className="h-10 sm:h-12 md:h-14 lg:h-16 xl:h-20 2xl:h-24 w-auto"
              priority
            />
          </Link>

          {/* ── Tablet / desktop: icons fill remaining width ─────────────── */}
          <div className="hidden sm:flex flex-1 items-center xl:-mt-4 2xl:-mt-3">
            {navLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex items-center justify-center transition-all duration-75 ${
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
                  className="w-14 sm:w-14 md:w-16 lg:w-20 xl:w-24 2xl:w-36 h-14 sm:h-14 md:h-16 lg:h-20 xl:h-24 2xl:h-36 object-contain"
                  unoptimized
                />
              </Link>
            ))}
          </div>

          {/* ── Mobile: MENU toggle button ────────────────────────────────── */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="sm:hidden ml-auto h-11 flex items-center transition-all duration-150 hover:scale-105 active:scale-95"
            style={{ filter: open ? 'brightness(1.3) drop-shadow(0 0 8px rgba(155,89,247,0.8))' : 'brightness(1)' }}
          >
            <Image
              src="/iconos/menu-btn.png"
              alt="Menú"
              width={160}
              height={60}
              className="h-9 w-auto"
              unoptimized
              priority
            />
          </button>

        </div>
      </div>

      {/* ── Mobile dropdown ───────────────────────────────────────────────── */}
      {open && (
        <div
          className="sm:hidden border-t border-brand-border/60 px-4 py-5"
          style={{ backgroundImage: 'url(/navbar-background.png?v=3)', backgroundSize: '100% 100%' }}
        >
          <div className="grid grid-cols-3 gap-x-2 gap-y-4">
            {navLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1.5 transition-all duration-75 ${
                  isActive(href)
                    ? 'opacity-100 drop-shadow-[0_0_8px_#9b59f7]'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                <Image
                  src={`${icon}?v=3`}
                  alt={label}
                  width={120}
                  height={120}
                  className="w-20 h-20 object-contain"
                  unoptimized
                />
                <span
                  className="text-brand-muted text-[7px] tracking-widest text-center"
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
