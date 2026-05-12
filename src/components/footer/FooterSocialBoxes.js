'use client';

import Image from 'next/image';
import Link from 'next/link';

const GROUP_ONE = [
  { label: 'YouTube',   icon: '/footer-icons/youtube.png',   href: 'https://youtube.com/@psiquenpixel'             },
  { label: 'Discord',   icon: '/footer-icons/discord.png',   href: 'https://discord.gg/psiquenpixel'               },
  { label: 'Spotify',   icon: '/footer-icons/spotify.png',   href: 'https://open.spotify.com/show/psiquenpixel'    },
];

const GROUP_TWO = [
  { label: 'Instagram', icon: '/footer-icons/instagram.png', href: 'https://instagram.com/psiquenpixel'            },
  { label: 'Twitch',    icon: '/footer-icons/twitch.png',    href: 'https://twitch.tv/psiquenpixel'                },
];

const SocialFrame = ({ links }) => (
  <div
    className="
      relative w-[90vw] max-w-xs md:max-w-sm
      drop-shadow-[0_0_12px_rgba(160,32,240,0.5)]
      hover:drop-shadow-[0_0_22px_rgba(160,32,240,0.85)]
      transition-all duration-300
    "
  >
    {/* Marco de piedra */}
    <Image
      src="/footer-icons/container.png"
      alt="Marco de piedra"
      width={1024}
      height={1024}
      className="w-full h-auto pixelated select-none pointer-events-none"
      unoptimized
    />

    {/* Íconos sobre la zona de madera interior */}
    <div
      className="absolute flex flex-col justify-evenly items-center"
      style={{
        top:    '28%',
        bottom: '12%',
        left:   '18%',
        right:  '12%',
      }}
    >
      {links.map(({ label, icon, href }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Seguinos en ${label}`}
          className="
            flex items-center gap-3 w-full
            group transition-all duration-200
          "
        >
          <div className="
            w-12 h-12 flex-shrink-0
            transition-all duration-200
            group-hover:scale-110
            group-hover:drop-shadow-[0_0_8px_rgba(160,32,240,0.8)]
          ">
            <Image
              src={icon}
              alt={label}
              width={48}
              height={48}
              className="w-full h-full object-contain pixelated"
              unoptimized
            />
          </div>
          <span
            className="text-amber-200 text-sm font-bold tracking-wider"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            {label.toUpperCase()}
          </span>
        </Link>
      ))}
    </div>
  </div>
);

const FooterSocialBoxes = () => (
  <div className="flex flex-col items-center gap-6">
    <SocialFrame links={GROUP_ONE} />
    <SocialFrame links={GROUP_TWO} />
  </div>
);

export default FooterSocialBoxes;
