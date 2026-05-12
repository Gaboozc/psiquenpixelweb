import Image from 'next/image';
import FooterSocialBox from '@/components/footer/FooterSocialBox';

const Footer = () => (
  <footer
    className="border-t border-brand-border mt-auto relative pb-10"
    style={{ backgroundImage: 'url(/navbar-background.png?v=3)', backgroundSize: '100% 100%' }}
  >
    <div className="w-full px-6 lg:px-10 py-6 flex items-center justify-between gap-8">

      {/* Espacio izquierdo para el cartel */}
      <div className="w-80 sm:w-96 shrink-0" />

      {/* Derecha: container único con redes sociales */}
      <div className="ml-auto">
        <FooterSocialBox />
      </div>
    </div>

    {/* Cartel copyright — izquierda, pegado al borde inferior */}
    <div className="absolute bottom-0 left-6 lg:left-16">
      <Image
        src="/footer-icons/footer-pnp.png"
        alt="© Psique 'n' Pixel — Todos los derechos reservados"
        width={480}
        height={120}
        className="w-[28rem] sm:w-[36rem] h-auto"
        unoptimized
      />
    </div>

  </footer>
);

export default Footer;
