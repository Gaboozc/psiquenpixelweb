import PageWrapper from '@/components/layout/PageWrapper';
import YoutubeEmbed from '@/components/media/YoutubeEmbed';
import SpotifyEmbed from '@/components/media/SpotifyEmbed';

export const metadata = {
  title: 'Media',
  description: 'Vídeos de YouTube y episodios de podcast de Psique \'n\' Pixel.',
};

export default function MediaPage() {
  return (
    <PageWrapper
      title="Media"
      subtitle="Contenido en vídeo y audio"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* YouTube section */}
        <section>
          <h2
            className="text-brand-purple text-[10px] tracking-widest mb-6"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            ▶ YOUTUBE
          </h2>

          <p className="text-brand-muted text-sm font-body leading-relaxed mb-6">
            Análisis en vídeo, ensayos visuales y debates sobre psicología en los videojuegos.
            Suscríbete para no perderte ningún episodio.
          </p>

          {/* Replace YOUR_VIDEO_ID with a real YouTube video ID */}
          <div className="pixel-border p-4 text-center" style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <p
              className="text-brand-muted text-[9px] tracking-widest"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              PRÓXIMAMENTE EN YOUTUBE
            </p>
          </div>
        </section>

        {/* Spotify section */}
        <section>
          <h2
            className="text-brand-amber text-[10px] tracking-widest mb-6"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            ♫ SPOTIFY
          </h2>

          <p className="text-brand-muted text-sm font-body leading-relaxed mb-6">
            El podcast de Las Mazmorras de la Mente: conversaciones profundas sobre
            narrativa, psicología y cultura de los videojuegos.
          </p>

          {/* Replace YOUR_SHOW_ID with a real Spotify show ID */}
          <div className="pixel-border-amber p-4 text-center" style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <p
              className="text-brand-muted text-[9px] tracking-widest"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              PODCAST PRÓXIMAMENTE EN SPOTIFY
            </p>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
