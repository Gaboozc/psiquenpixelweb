import { Press_Start_2P, Cinzel, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StyledComponentsRegistry from '@/lib/StyledComponentsRegistry';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

const cinzel = Cinzel({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: {
    default: "Psique 'n' Pixel",
    template: "%s | Psique 'n' Pixel",
  },
  description:
    "Las Mazmorras de la Mente — Análisis psicológico, narrativo y cultural de videojuegos",
  metadataBase: new URL('https://psiquenpixel.com'),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://psiquenpixel.com',
    siteName: "Psique 'n' Pixel",
    title: "Psique 'n' Pixel — Las Mazmorras de la Mente",
    description:
      "Análisis psicológico, narrativo y cultural de videojuegos. Exploramos las profundidades de la mente a través de los mundos digitales.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Psique 'n' Pixel",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Psique 'n' Pixel",
    description: 'Las Mazmorras de la Mente — Análisis de videojuegos',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`dark ${pressStart2P.variable} ${cinzel.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col text-brand-text antialiased bg-[#0d0d0f]">
        <video
          src="/video/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover -z-10"
          aria-hidden="true"
        />
        <StyledComponentsRegistry>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
