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
      className="border-t border-brand-border mt-auto relative pb-10"
      style={{ backgroundImage: 'url(/navbar-background.png?v=3)', backgroundSize: '100% 100%' }}
    >
      {/* Main footer row */}
      <div className="w-full px-6 lg:px-10 py-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

        {/* Left spacer — leaves room for absolute copyright sign */}
        <div className="hidden lg:block w-80 xl:w-96 shrink-0" />

        {/* Centre: Pergaminos de la Mazmorra */}
        <div className="w-full lg:flex-1 flex justify-center">
          <FooterPergaminos mazmorra={mazmorra} />
        </div>

        {/* Right: social media box */}
        <div className="self-center lg:self-auto">
          <FooterSocialBox />
        </div>
      </div>

      {/* Copyright sign — absolute bottom-left */}
      <div className="absolute bottom-0 left-6 lg:left-16">
        <Image
          src="/footer-icons/footer-pnp.png"
          alt="© Psique 'n' Pixel — Todos los derechos reservados"
          width={480}
          height={120}
          className="w-[18rem] sm:w-[28rem] h-auto"
          unoptimized
        />
      </div>
    </footer>
  );
};

export default Footer;
