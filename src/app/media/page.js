import PageWrapper from '@/components/layout/PageWrapper';

export const metadata = {
  title: 'Media',
  description: "Vídeos de YouTube y episodios de podcast de Psique 'n' Pixel.",
};

export default function MediaPage() {
  return (
    <PageWrapper
      title="Media"
      subtitle="Contenido en vídeo y audio — Las Mazmorras de la Mente"
      accentColor="purple"
    >
      <div className="space-y-16">

        {/* YouTube section */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-8 bg-brand-purple" />
            <h2
              className="text-brand-purple text-[10px] tracking-widest"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              ▶ YOUTUBE
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-brand-muted text-sm font-body leading-relaxed mb-6">
                Análisis en vídeo, ensayos visuales y debates sobre psicología en los videojuegos.
                Suscríbete para no perderte ningún episodio.
              </p>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 pixel-border p-3"
                  style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <span className="text-brand-purple text-[8px]" style={{ fontFamily: 'var(--font-pixel)' }}>▶</span>
                  <div>
                    <p className="text-brand-text text-xs font-body font-medium">Análisis en profundidad</p>
                    <p className="text-brand-muted text-[10px] font-body">Disecciones de narrativa y psicología</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pixel-border p-3"
                  style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <span className="text-brand-purple text-[8px]" style={{ fontFamily: 'var(--font-pixel)' }}>▶</span>
                  <div>
                    <p className="text-brand-text text-xs font-body font-medium">Ensayos visuales</p>
                    <p className="text-brand-muted text-[10px] font-body">Documentales cortos sobre cultura gamer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pixel-border p-3"
                  style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <span className="text-brand-purple text-[8px]" style={{ fontFamily: 'var(--font-pixel)' }}>▶</span>
                  <div>
                    <p className="text-brand-text text-xs font-body font-medium">Debates y reseñas</p>
                    <p className="text-brand-muted text-[10px] font-body">Conversaciones sobre los juegos del momento</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="pixel-border-purple p-6 flex flex-col items-center justify-center gap-4 min-h-[280px]"
              style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="w-16 h-16 bg-brand-purple/20 border-2 border-brand-purple flex items-center justify-center">
                <span className="text-brand-purple text-2xl">▶</span>
              </div>
              <p
                className="text-brand-muted text-[9px] tracking-widest text-center"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                PRÓXIMAMENTE EN YOUTUBE
              </p>
              <p className="text-brand-border text-xs font-body text-center">
                Canal en construcción — Suscríbete para ser el primero en verlo
              </p>
              <a
                href="https://youtube.com/@psiquenpixel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-purple text-[9px] tracking-widest border border-brand-purple px-4 py-2 hover:bg-brand-purple/20 transition-colors"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                SUSCRIBIRSE →
              </a>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-brand-border" />

        {/* Spotify section */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-8 bg-brand-amber" />
            <h2
              className="text-brand-amber text-[10px] tracking-widest"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              ♫ PODCAST — SPOTIFY
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-brand-muted text-sm font-body leading-relaxed mb-6">
                El podcast de Las Mazmorras de la Mente: conversaciones profundas sobre narrativa,
                psicología y cultura de los videojuegos. Disponible próximamente.
              </p>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 pixel-border p-3"
                  style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <span className="text-brand-amber text-[8px]" style={{ fontFamily: 'var(--font-pixel)' }}>♫</span>
                  <div>
                    <p className="text-brand-text text-xs font-body font-medium">Episodios de análisis</p>
                    <p className="text-brand-muted text-[10px] font-body">Profundidad sin prisa</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pixel-border p-3"
                  style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <span className="text-brand-amber text-[8px]" style={{ fontFamily: 'var(--font-pixel)' }}>♫</span>
                  <div>
                    <p className="text-brand-text text-xs font-body font-medium">Entrevistas</p>
                    <p className="text-brand-muted text-[10px] font-body">Desarrolladores, psicólogos y críticos</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="pixel-border-amber p-6 flex flex-col items-center justify-center gap-4 min-h-[280px]"
              style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="w-16 h-16 bg-brand-amber/20 border-2 border-brand-amber flex items-center justify-center">
                <span className="text-brand-amber text-2xl">♫</span>
              </div>
              <p
                className="text-brand-muted text-[9px] tracking-widest text-center"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                PODCAST PRÓXIMAMENTE
              </p>
              <p className="text-brand-border text-xs font-body text-center">
                Las Mazmorras de la Mente en audio — Pronto en Spotify
              </p>
              <a
                href="https://open.spotify.com/show/psiquenpixel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-amber text-[9px] tracking-widest border border-brand-amber px-4 py-2 hover:bg-brand-amber/20 transition-colors"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                SEGUIR EN SPOTIFY →
              </a>
            </div>
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}
