'use client';

import { useState, useEffect } from 'react';
import PixelDivider from '@/components/ui/PixelDivider';
import Button from '@/components/ui/Button';
import ArticleCard from '@/components/blog/ArticleCard';
import GameCard from '@/components/catalogo/GameCard';

// ---------------------------------------------------------------------------
// Typewriter hook
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Hardcoded placeholder data
// ---------------------------------------------------------------------------
const ARTICLES = [
  {
    slug:     'zelda-disociacion',
    title:    'Link y la Disociación: Héroes sin Yo',
    excerpt:  'Exploramos cómo la amnesia recurrente de Link en la saga Zelda refleja mecanismos psicológicos de disociación y la construcción fragmentada de la identidad heroica.',
    date:     '2025-04-10',
    category: 'Psicología',
    tags:     ['zelda', 'identidad', 'disociacion'],
  },
  {
    slug:     'dark-souls-duelo',
    title:    'Dark Souls como Metáfora del Duelo',
    excerpt:  'Las hogueras, los huecos y la persistencia en Dark Souls no son solo mecánicas de juego; son una alegoría perfecta de las cinco etapas del duelo de Kübler-Ross.',
    date:     '2025-03-22',
    category: 'Narrativa',
    tags:     ['dark-souls', 'duelo', 'fromsoft'],
  },
  {
    slug:     'hades-terapia',
    title:    '¿Puede Hades reemplazar a un terapeuta?',
    excerpt:  'El rogue-like de Supergiant Games usa la repetición como catarsis. Analizamos cómo sus sistemas narrativos imitan procesos terapéuticos reales.',
    date:     '2025-02-15',
    category: 'Análisis',
    tags:     ['hades', 'terapia', 'roguelike'],
  },
];

const GAMES = [
  {
    slug:    'elden-ring',
    game:    'Elden Ring',
    title:   'El Vacío del Poder: Trauma y Soberanía en las Tierras Intermedias',
    excerpt: 'FromSoftware construye un mundo donde cada gobernante está roto. Analizamos la psicología del poder corrompido y la búsqueda de sentido en un cosmos indiferente.',
    date:    '2025-04-20',
    genre:   ['RPG de Acción'],
    tags:    ['trauma', 'poder', 'mitos'],
  },
  {
    slug:    'celeste',
    game:    'Celeste',
    title:   'Subir la Montaña: Ansiedad, Automedicación y Aceptación',
    excerpt: 'Celeste es el relato más honesto sobre ansiedad y salud mental que ha producido el medio. Desglosamos sus mecánicas como lenguaje terapéutico.',
    date:    '2025-03-05',
    genre:   ['Plataformas'],
    tags:    ['ansiedad', 'salud-mental', 'indie'],
  },
  {
    slug:    'disco-elysium',
    game:    'Disco Elysium',
    title:   'El Detective Roto: Adicción, Ideología y Reconstrucción del Yo',
    excerpt: 'Disco Elysium es una novela policíaca sobre un hombre que no recuerda quién es. Exploramos su psicología, su política y su desolación existencial.',
    date:    '2025-02-01',
    genre:   ['RPG'],
    tags:    ['adiccion', 'ideologia', 'identidad'],
  },
];

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------
export default function Home() {
  const text = useTypewriter(PHRASES);

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Section 1: Hero with video background                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background video */}
        <video
          src="/video/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

        {/* Scanlines overlay */}
        <div className="absolute inset-0 scanlines" aria-hidden="true" />

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          {/* Tag line */}
          <p
            className="text-brand-amber text-[9px] tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            ▶ Análisis · Psicología · Videojuegos
          </p>

          {/* Main title */}
          <h1
            className="text-brand-text text-3xl sm:text-4xl md:text-5xl leading-tight"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            Psique &apos;<span className="text-brand-purple text-glow-purple">n</span>&apos; Pixel
          </h1>

          {/* Subtitle */}
          <p
            className="text-brand-amber text-base sm:text-lg md:text-xl tracking-[0.2em] uppercase"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            Las Mazmorras de la Mente
          </p>

          {/* Typewriter description */}
          <p
            className="text-brand-muted text-sm sm:text-base max-w-xl leading-relaxed min-h-[3rem]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {text}
            <span className="cursor-blink text-brand-purple ml-0.5">|</span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            <Button variant="primary" href="/blog">
              ▶ EXPLORAR BLOG
            </Button>
            <Button variant="secondary" href="/comunidad">
              ⚔ UNIRSE AL DISCORD
            </Button>
          </div>
        </div>
      </section>

      <PixelDivider />

      {/* ------------------------------------------------------------------ */}
      {/* Section 2: Latest blog posts                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 px-4 bg-brand-bg">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <p
              className="text-brand-purple text-[9px] tracking-widest mb-3"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              ✦ ÚLTIMAS ENTRADAS ✦
            </p>
            <h2
              className="text-brand-text text-xl md:text-2xl"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              Del Blog
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARTICLES.map((article) => (
              <ArticleCard key={article.slug} {...article} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button variant="primary" href="/blog">
              VER TODOS LOS ARTÍCULOS
            </Button>
          </div>
        </div>
      </section>

      <PixelDivider />

      {/* ------------------------------------------------------------------ */}
      {/* Section 3: Game catalog                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 px-4 bg-brand-surface">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <p
              className="text-brand-amber text-[9px] tracking-widest mb-3"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              ⚔ ANÁLISIS ⚔
            </p>
            <h2
              className="text-brand-text text-xl md:text-2xl"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              Catálogo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GAMES.map((game) => (
              <GameCard key={game.slug} {...game} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button variant="secondary" href="/catalogo">
              VER CATÁLOGO COMPLETO
            </Button>
          </div>
        </div>
      </section>

      <PixelDivider />

      {/* ------------------------------------------------------------------ */}
      {/* Section 4: Media banner                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 px-4 bg-brand-bg">
        <div className="max-w-4xl mx-auto">
          <div className="bg-brand-surface pixel-border-purple p-8 md:p-12 text-center flex flex-col items-center gap-6">
            {/* Pixel art decorative blocks */}
            <div aria-hidden="true" className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3"
                  style={{ background: i % 2 === 0 ? '#6b3bbf' : '#9b59f7' }}
                />
              ))}
            </div>

            <p
              className="text-brand-purple text-[9px] tracking-widest"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              ▶ CONTENIDO MULTIMEDIA
            </p>

            <h2
              className="text-brand-text text-lg md:text-xl"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              También en vídeo y audio
            </h2>

            <p className="text-brand-muted text-sm max-w-md font-body leading-relaxed">
              Análisis en profundidad en YouTube y episodios del podcast en Spotify. Síguenos para no perderte nada.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="primary" href="/media">
                ▶ IR A MEDIA
              </Button>
              <Button variant="secondary" href="#">
                ♫ SPOTIFY
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PixelDivider />

      {/* ------------------------------------------------------------------ */}
      {/* Section 5: Community banner                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 px-4 bg-brand-surface">
        <div className="max-w-4xl mx-auto">
          <div className="bg-brand-bg pixel-border-amber p-8 md:p-12 text-center flex flex-col items-center gap-6">
            {/* Twitch status indicator */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-muted inline-block" />
              <span
                className="text-brand-muted text-[9px] tracking-widest"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                TWITCH · OFFLINE
              </span>
            </div>

            <p
              className="text-brand-amber text-[9px] tracking-widest"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              ⚔ ÚNETE A LA GUILD
            </p>

            <h2
              className="text-brand-text text-lg md:text-xl"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              La Comunidad
            </h2>

            <p className="text-brand-muted text-sm max-w-md font-body leading-relaxed">
              Debates, recomendaciones y análisis colaborativos en nuestro servidor de Discord. Más de la mente, más del pixel.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="secondary" href="/comunidad">
                JOIN THE GUILD ⚔
              </Button>
              <Button variant="primary" href="#">
                VER EN TWITCH
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
