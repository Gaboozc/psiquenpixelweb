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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-brand-border transition-shadow duration-200 ${
        scrolled ? 'shadow-lg shadow-black/60' : ''
      }`}
      style={{ backgroundImage: 'url(/navbar-background.png?v=3)', backgroundSize: '100% 100%' }}
    >
      <div className="w-full px-2 sm:px-4 xl:px-10">
        {/*
          Logo flex-shrink-0 on the left.
          Nav takes flex-1 (all remaining width). Each icon link is also flex-1,
          so the 6 icons divide the remaining space equally — no dead gaps anywhere.
        */}
        <div className="flex items-center h-14 sm:h-16 md:h-20 lg:h-24 xl:h-32 2xl:h-36">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-typo.png"
              alt="Psique 'n' Pixel"
              width={320}
              height={100}
              className="h-8 sm:h-10 md:h-12 lg:h-14 xl:h-20 2xl:h-24 w-auto"
              priority
              unoptimized
            />
          </Link>

          {/* Nav — flex-1 fills the rest; each icon link is also flex-1 */}
          <div className="flex-1 flex items-center xl:-mt-4 2xl:-mt-6">
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
                  className="w-8 sm:w-10 md:w-12 lg:w-16 xl:w-24 2xl:w-36 h-8 sm:h-10 md:h-12 lg:h-16 xl:h-24 2xl:h-36 object-contain"
                  unoptimized
                />
              </Link>
            ))}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
