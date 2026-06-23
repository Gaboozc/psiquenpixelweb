import PageWrapper from '@/components/layout/PageWrapper';
import YoutubeEmbed from '@/components/media/YoutubeEmbed';
import SpotifyEmbed from '@/components/media/SpotifyEmbed';

export const metadata = {
  title: 'Media',
  description: "Vídeos de YouTube y episodios de podcast de Psique 'n' Pixel.",
};

// Demo video IDs — swap for real ones when available
const YOUTUBE_VIDEOS = [
  { id: 'dQw4w9WgXcQ', title: 'Análisis: Dark Souls y el Duelo — Psique \'n\' Pixel' },
  { id: 'dQw4w9WgXcQ', title: 'Episodio piloto: Hades y la Terapia de Repetición' },
];

// Demo Spotify show ID
const SPOTIFY_SHOW_ID = '37i9dQZF1DX8NTLI2TtZa6'; // demo: placeholder show

export default function MediaPage() {
  return (
    <PageWrapper
      title="Media"
      subtitle="Contenido en vídeo y audio — Las Mazmorras de la Mente"
      accentColor="purple"
    >
      {/* Demo notice */}
      <div
        className="mb-12 pixel-border p-4 text-center"
        style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <p className="text-brand-muted text-[8px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
          ⚠ MODO DEMO — IDs de vídeo de prueba hasta integración real
        </p>
      </div>

      <div className="space-y-16">

        {/* ── YouTube ────────────────────────────────────────────────────── */}
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

              <div className="flex flex-col gap-3 mb-6">
                {[
                  ['▶', 'Análisis en profundidad', 'Disecciones de narrativa y psicología'],
                  ['▶', 'Ensayos visuales',        'Documentales cortos sobre cultura gamer'],
                  ['▶', 'Debates y reseñas',       'Conversaciones sobre los juegos del momento'],
                ].map(([icon, label, desc]) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 pixel-border p-3"
                    style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    <span className="text-brand-purple text-[8px] shrink-0" style={{ fontFamily: 'var(--font-pixel)' }}>{icon}</span>
                    <div>
                      <p className="text-brand-text text-xs font-body font-medium">{label}</p>
                      <p className="text-brand-muted text-[10px] font-body">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://youtube.com/@psiquenpixel"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-brand-purple text-[9px] tracking-widest border border-brand-purple px-4 py-2 hover:bg-brand-purple/20 transition-colors"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                SUSCRIBIRSE AL CANAL →
              </a>
            </div>

            <div className="flex flex-col gap-6">
              {YOUTUBE_VIDEOS.map((video) => (
                <YoutubeEmbed key={video.id + video.title} videoId={video.id} title={video.title} />
              ))}
            </div>
          </div>
        </section>

        <div className="border-t border-brand-border" />

        {/* ── Spotify ────────────────────────────────────────────────────── */}
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
                psicología y cultura de los videojuegos.
              </p>

              <div className="flex flex-col gap-3 mb-6">
                {[
                  ['♫', 'Episodios de análisis', 'Profundidad sin prisa'],
                  ['♫', 'Entrevistas',            'Desarrolladores, psicólogos y críticos'],
                ].map(([icon, label, desc]) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 pixel-border p-3"
                    style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    <span className="text-brand-amber text-[8px] shrink-0" style={{ fontFamily: 'var(--font-pixel)' }}>{icon}</span>
                    <div>
                      <p className="text-brand-text text-xs font-body font-medium">{label}</p>
                      <p className="text-brand-muted text-[10px] font-body">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://open.spotify.com/show/psiquenpixel"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-brand-amber text-[9px] tracking-widest border border-brand-amber px-4 py-2 hover:bg-brand-amber/20 transition-colors"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                SEGUIR EN SPOTIFY →
              </a>
            </div>

            <SpotifyEmbed spotifyId={SPOTIFY_SHOW_ID} type="show" title="Las Mazmorras de la Mente — Podcast" />
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}
