import Link from 'next/link';

const socialLinks = [
  { label: 'YT',       href: '#', title: 'YouTube'   },
  { label: 'SPTY',     href: '#', title: 'Spotify'   },
  { label: 'TWTCH',    href: '#', title: 'Twitch'    },
  { label: 'DC',       href: '#', title: 'Discord'   },
  { label: 'IG',       href: '#', title: 'Instagram' },
  { label: 'TK',       href: '#', title: 'TikTok'    },
];

const Footer = () => (
  <footer className="bg-brand-surface border-t border-brand-border mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Social links */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {socialLinks.map(({ label, href, title }) => (
          <Link
            key={title}
            href={href}
            title={title}
            className="px-3 py-1.5 text-[9px] tracking-widest text-brand-muted pixel-border transition-all duration-75
                       hover:text-brand-purple hover:pixel-border-purple"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-brand-border mb-6" />

      {/* Copyright */}
      <div className="text-center space-y-2">
        <p
          className="text-[9px] tracking-widest text-brand-muted"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          © 2025 PSIQUE &apos;N&apos; PIXEL
        </p>
        <p
          className="text-[8px] tracking-widest text-brand-border"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          Las Mazmorras de la Mente
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
