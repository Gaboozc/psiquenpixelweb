import { promises as fs } from 'fs';
import path from 'path';
import Image from 'next/image';
import FooterSocialBox from '@/components/footer/FooterSocialBox';
import FooterPergaminos from '@/components/footer/FooterPergaminos';

async function getMazmorra() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'mazmorra.json');
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const Footer = async () => {
  const mazmorra = await getMazmorra();

  return (
    <footer
      className="border-t border-brand-border mt-auto"
      style={{ backgroundImage: 'url(/navbar-background.png?v=3)', backgroundSize: '100% 100%' }}
    >
      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="w-full px-4 sm:px-6 lg:px-10 pt-8 pb-6">

        {/*
          Mobile / tablet  → flex column, centered:
            1. Pergaminos (full width)
            2. Social box (centered)

          Desktop lg+      → flex row:
            [Copyright left] [Pergaminos center] [Social right]
        */}
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-end lg:gap-6">

          {/* Copyright sign
              — last on mobile (order-3), first on desktop (order-1) */}
          <div className="order-3 lg:order-1 shrink-0 flex justify-center lg:justify-start self-end">
            <Image
              src="/footer-icons/footer-pnp.png"
              alt="© Psique 'n' Pixel — Todos los derechos reservados"
              width={480}
              height={120}
              className="w-44 sm:w-56 lg:w-72 xl:w-80 h-auto"
              unoptimized
            />
          </div>

          {/* Pergaminos de la Mazmorra
              — first on mobile (order-1), center on desktop (order-2) */}
          <div className="order-1 lg:order-2 w-full lg:flex-1 flex justify-center">
            <FooterPergaminos mazmorra={mazmorra} />
          </div>

          {/* Social box
              — second on mobile (order-2), right on desktop (order-3) */}
          <div className="order-2 lg:order-3 shrink-0 flex justify-center lg:justify-end self-start lg:self-end">
            <FooterSocialBox />
          </div>

        </div>
      </div>

      {/* ── Bottom strip ─────────────────────────────────────────────────── */}
      <div className="border-t border-brand-border/30 py-2 px-4 text-center">
        <p className="text-brand-border text-[7px] font-body tracking-widest">
          © 2026 PSIQUE &apos;N&apos; PIXEL — LAS MAZMORRAS DE LA MENTE
        </p>
      </div>
    </footer>
  );
};

export default Footer;
