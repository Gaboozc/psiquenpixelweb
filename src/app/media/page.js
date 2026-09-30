import PageWrapper from '@/components/layout/PageWrapper';
import { getMedia } from '@/lib/media';
import { getSettings } from '@/lib/settings';
import { getLatestVideos } from '@/lib/youtube';

export const metadata = {
  title: 'Media',
  description: "Vídeos de YouTube y episodios de podcast de Psique 'n' Pixel.",
};

// Render per-request so admin edits apply live.
export const dynamic = 'force-dynamic';

function ComingSoonSlot({ icon, color }) {
  return (
    <div
      className="w-full aspect-video pixel-border flex flex-col items-center justify-center gap-3"
      style={{
        backgroundImage: `
          repeating-linear-gradient(45deg, #16151a 0, #16151a 4px, #0d0d0f 4px, #0d0d0f 8px),
          repeating-linear-gradient(-45deg, ${color}08 0, ${color}08 2px, transparent 2px, transparent 6px)
        `,
      }}
    >
      <span className="text-3xl opacity-20">{icon}</span>
      <p className="text-brand-border text-[8px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
        PRÓXIMAMENTE
      </p>
    </div>
  );
}

function EmbedOrPlaceholder({ section, icon, color }) {
  if (!section.comingSoon && section.embedUrl) {
    return (
      <div className="w-full aspect-video pixel-border overflow-hidden">
        <iframe
          src={section.embedUrl}
          allowFullScreen
          loading="lazy"
          className="w-full h-full"
          title="Contenido multimedia"
        />
      </div>
    );
  }
  return <ComingSoonSlot icon={icon} color={color} />;
}

function MediaFeatures({ items, accentClass }) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      {items.map((f) => (
        <div
          key={f.label}
          className="flex items-center gap-3 pixel-border p-3"
          style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <span className={`${accentClass} text-[8px] shrink-0`} style={{ fontFamily: 'var(--font-pixel)' }}>▶</span>
          <div>
            <p className="text-brand-text text-xs font-body font-medium">{f.label}</p>
            <p className="text-brand-muted text-[10px] font-body">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function LatestVideos({ videos }) {
  return (
    <div className="mt-8">
      <p className="text-brand-muted text-[8px] tracking-widest mb-4" style={{ fontFamily: 'var(--font-pixel)' }}>
        ÚLTIMOS VÍDEOS
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((v) => (
          <a
            key={v.id}
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group pixel-border overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.thumbnail} alt={v.title} className="w-full aspect-video object-cover opacity-90 group-hover:opacity-100 transition-opacity" loading="lazy" />
            <p className="text-brand-text text-xs font-body p-3 leading-snug line-clamp-2 group-hover:text-brand-purple transition-colors">
              {v.title}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default async function MediaPage() {
  const [media, settings] = await Promise.all([getMedia(), getSettings()]);
  const youtubeVideos = await getLatestVideos(media.youtube.channelId, 6);

  return (
    <PageWrapper
      title="Media"
      subtitle="Contenido en vídeo y audio — Las Mazmorras de la Mente"
      accentColor="purple"
    >
      <div className="space-y-16">

        {/* ── YouTube ────────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-8 bg-brand-purple" />
            <h2 className="text-brand-purple text-[10px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
              ▶ YOUTUBE
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-brand-muted text-sm font-body leading-relaxed mb-6">
                {media.youtube.description}
              </p>

              <MediaFeatures items={media.youtube.features} accentClass="text-brand-purple" />

              {settings.social.youtube && (
                <a
                  href={settings.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-brand-purple text-[9px] tracking-widest border border-brand-purple px-4 py-2 hover:bg-brand-purple/20 transition-colors"
                  style={{ fontFamily: 'var(--font-pixel)' }}
                >
                  SUSCRIBIRSE AL CANAL →
                </a>
              )}
            </div>

            {!media.youtube.comingSoon && media.youtube.embedUrl ? (
              <EmbedOrPlaceholder section={media.youtube} icon="▶" color="#9b59f7" />
            ) : youtubeVideos.length > 0 ? (
              <div className="w-full aspect-video pixel-border overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideos[0].id}`}
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full"
                  title={youtubeVideos[0].title}
                />
              </div>
            ) : (
              <EmbedOrPlaceholder section={media.youtube} icon="▶" color="#9b59f7" />
            )}
          </div>

          {youtubeVideos.length > 1 && <LatestVideos videos={youtubeVideos.slice(1)} />}
        </section>

        <div className="border-t border-brand-border" />

        {/* ── Spotify ────────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-8 bg-brand-amber" />
            <h2 className="text-brand-amber text-[10px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
              ♫ PODCAST — SPOTIFY
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-brand-muted text-sm font-body leading-relaxed mb-6">
                {media.spotify.description}
              </p>

              <MediaFeatures items={media.spotify.features} accentClass="text-brand-amber" />

              {settings.social.spotify && (
                <a
                  href={settings.social.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-brand-amber text-[9px] tracking-widest border border-brand-amber px-4 py-2 hover:bg-brand-amber/20 transition-colors"
                  style={{ fontFamily: 'var(--font-pixel)' }}
                >
                  SEGUIR EN SPOTIFY →
                </a>
              )}
            </div>

            <EmbedOrPlaceholder section={media.spotify} icon="♫" color="#e8903a" />
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}
