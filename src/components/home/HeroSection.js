'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';

const PHRASES = [
  'Exploramos la psicología detrás de los mundos digitales.',
  'Narrativa, trauma y redención en los videojuegos.',
  'Donde la mazmorra más profunda es la mente humana.',
  'Análisis cultural de los juegos que nos forman.',
];

const useTypewriter = (phrases, speed = 55, pause = 2200) => {
  const [displayed, setDisplayed] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx,   setCharIdx]   = useState(0);
  const [deleting,  setDeleting]  = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIdx((c) => c + 1);
        }
      } else {
        setDisplayed(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setPhraseIdx((i) => (i + 1) % phrases.length);
          setCharIdx(0);
        } else {
          setCharIdx((c) => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause]);

  return displayed;
};

export default function HeroSection() {
  const text = useTypewriter(PHRASES);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Video background */}
      {!reducedMotion && (
        <video
          src="/video/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/75 via-brand-bg/55 to-brand-bg/90" aria-hidden="true" />
      <div className="absolute inset-0 scanlines" aria-hidden="true" />

      <div className="relative z-10 w-full flex flex-col items-center gap-2 sm:gap-4">
        <Image
          src="/logo-no-bg.png"
          alt="Psique 'n' Pixel — Las Mazmorras de la Mente"
          width={1200}
          height={480}
          priority
          sizes="(max-width: 640px) 140vw, (max-width: 768px) 90vw, (max-width: 1280px) 80vw, 70vw"
          className="w-[140vw] max-h-[55vh] sm:max-h-none sm:w-[90vw] md:w-[80%] xl:w-[70%] max-w-none sm:max-w-5xl h-auto object-contain drop-shadow-[0_0_40px_rgba(155,89,247,0.4)]"
        />

        <p
          className="px-4 text-brand-muted text-[9px] sm:text-[9px] md:text-[10px] tracking-widest text-center max-w-xs sm:max-w-sm md:max-w-lg min-h-[2.5rem] leading-relaxed"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          {text}<span className="cursor-blink">█</span>
        </p>

        <div className="px-4 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-xs sm:max-w-none">
          <Button variant="primary" href="/blog">LEER POSTS</Button>
          <Button variant="secondary" href="/catalogo">VER CATÁLOGO</Button>
        </div>
      </div>
    </section>
  );
}
