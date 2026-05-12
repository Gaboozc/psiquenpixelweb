'use client';

import Image from 'next/image';
import Link from 'next/link';

const ICONS = [
  { id: 'youtube',   src: '/footer-icons/youtube.png',   href: 'https://youtube.com/@psiquenpixel',          label: 'Síguenos en YouTube'   },
  { id: 'discord',   src: '/footer-icons/discord.png',   href: 'https://discord.gg/psiquenpixel',             label: 'Únete a nuestro Discord' },
  { id: 'spotify',   src: '/footer-icons/spotify.png',   href: 'https://open.spotify.com/show/psiquenpixel', label: 'Escúchanos en Spotify'  },
  { id: 'instagram', src: '/footer-icons/instagram.png', href: 'https://instagram.com/psiquenpixel',          label: 'Síguenos en Instagram'  },
  { id: 'twitch',    src: '/footer-icons/twitch.png',    href: 'https://twitch.tv/psiquenpixel',              label: 'Síguenos en Twitch'     },
];

const FooterSocialBox = () => (
  <div
    className="
      relative
      w-[90vw] max-w-xs md:max-w-sm
      drop-shadow-[0_0_14px_rgba(160,32,240,0.5)]
      hover:drop-shadow-[0_0_28px_rgba(160,32,240,0.9)]
      transition-all duration-300
    "
  >
    {/* Marco de piedra */}
    <Image
      src="/footer-icons/container.png"
      alt="Marco de piedra — ¡Síguenos, héroe!"
      width={1024}
      height={1024}
      className="w-full h-auto pixelated select-none pointer-events-none"
      unoptimized
    />

    {/* Grid de íconos sobre la zona de madera interior */}
    <div
      className="absolute grid grid-cols-2 grid-rows-3 gap-x-4 gap-y-4 place-items-center"
      style={{
        top:    '28%',
        bottom: '12%',
        left:   '18%',
        right:  '18%',
      }}
    >
      {ICONS.map(({ id, src, href, label }) => (
        <Link
          key={id}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="
            w-full flex justify-center
            transition-all duration-200 ease-in-out
            hover:scale-110
            hover:drop-shadow-[0_0_8px_rgba(160,32,240,0.8)]
          "
        >
          <Image
            src={src}
            alt={label}
            width={120}
            height={120}
            className="w-full h-auto pixelated"
            unoptimized
          />
        </Link>
      ))}

      {/* Placeholder vacío — posición 6 (fila 3, col 2) */}
      <div aria-hidden="true" />
    </div>
  </div>
);

export default FooterSocialBox;
