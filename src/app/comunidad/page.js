import PageWrapper from '@/components/layout/PageWrapper';
import Button from '@/components/ui/Button';
import { getTwitchStreamStatus } from '@/lib/twitch';

export const metadata = {
  title: 'Comunidad',
  description: "Únete a la comunidad de Psique 'n' Pixel en Discord y sigue el directo en Twitch.",
};

export default async function ComunidadPage() {
  let twitch = { isLive: false };
  try {
    twitch = await getTwitchStreamStatus();
  } catch {
    // API unavailable — graceful fallback to offline
  }

  return (
    <PageWrapper
      title="Comunidad"
      subtitle="La Guild de las Mazmorras de la Mente"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ── Twitch ───────────────────────────────────────────────────── */}
        <section
          className="pixel-border p-8 flex flex-col gap-6 items-center text-center"
          style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {/* Live badge */}
          <div className="flex items-center gap-3">
            <span
              className={`w-3 h-3 rounded-full inline-block ${
                twitch.isLive ? 'bg-green-500 animate-pulse' : 'bg-brand-muted'
              }`}
            />
            <span
              className={`text-[9px] tracking-widest ${
                twitch.isLive ? 'text-green-400' : 'text-brand-muted'
              }`}
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              TWITCH · {twitch.isLive ? 'EN DIRECTO' : 'OFFLINE'}
            </span>
            {twitch.isLive && twitch.viewerCount && (
              <span className="text-brand-muted text-[8px] font-body">
                {twitch.viewerCount.toLocaleString('es-ES')} espectadores
              </span>
            )}
          </div>

          <h2
            className="text-brand-text text-base"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            Directos
          </h2>

          {twitch.isLive && twitch.title && (
            <p className="text-brand-purple text-xs font-body italic">
              &ldquo;{twitch.title}&rdquo;
            </p>
          )}

          <p className="text-brand-muted text-sm font-body leading-relaxed">
            Sesiones de juego en vivo con análisis psicológico en tiempo real.
            {twitch.isLive
              ? ' ¡Estamos en directo ahora mismo!'
              : ' Cuando estemos en directo, aquí verás el stream embebido.'}
          </p>

          {/* Stream embed or offline placeholder */}
          {twitch.isLive ? (
            <div className="w-full aspect-video pixel-border overflow-hidden">
              <iframe
                src={`https://player.twitch.tv/?channel=${process.env.TWITCH_CHANNEL_NAME}&parent=${process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'localhost'}&muted=true`}
                allowFullScreen
                className="w-full h-full"
                title="Stream en directo"
              />
            </div>
          ) : (
            <div className="w-full aspect-video bg-brand-bg pixel-border flex flex-col items-center justify-center gap-2">
              {twitch.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={twitch.thumbnailUrl} alt="Miniatura del stream" className="w-full h-full object-cover opacity-40" />
              ) : (
                <p className="text-brand-border text-[9px]" style={{ fontFamily: 'var(--font-pixel)' }}>
                  SIN STREAM ACTIVO
                </p>
              )}
            </div>
          )}

          <Button variant="secondary" href="https://twitch.tv/psiquenpixel">
            VER EN TWITCH
          </Button>
        </section>

        {/* ── Discord ──────────────────────────────────────────────────── */}
        <section
          className="pixel-border-amber p-8 flex flex-col gap-6 items-center text-center"
          style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <p
            className="text-brand-amber text-[9px] tracking-widest"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            ⚔ DISCORD
          </p>

          <h2
            className="text-brand-text text-base"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            Únete a la Guild
          </h2>

          <p className="text-brand-muted text-sm font-body leading-relaxed">
            Debates, recomendaciones, club de lectura de videojuegos y mucho más.
            La Guild de Psique &apos;n&apos; Pixel te espera.
          </p>

          {/* Discord invite card */}
          <div
            className="w-full pixel-border p-6 flex flex-col items-center gap-4"
            style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center">
                <span className="text-brand-purple text-lg">⚔</span>
              </div>
              <div className="text-left">
                <p className="text-brand-text text-xs font-body font-semibold">Psique &apos;n&apos; Pixel</p>
                <p className="text-brand-muted text-[10px] font-body">Las Mazmorras de la Mente</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[9px]" style={{ fontFamily: 'var(--font-pixel)' }}>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                <span className="text-brand-muted">comunidad activa</span>
              </div>
            </div>

            <a
              href="https://discord.gg/psiquenpixel"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-brand-amber text-brand-bg text-[9px] tracking-widest py-3 hover:bg-brand-amber-dim transition-colors"
              style={{ fontFamily: 'var(--font-pixel)', boxShadow: '3px 3px 0 #a8621a' }}
            >
              UNIRSE AL DISCORD ⚔
            </a>
          </div>

          <p className="text-brand-muted text-[10px] font-body">
            Análisis colaborativos · Recomendaciones · Club de juego mensual
          </p>
        </section>

      </div>
    </PageWrapper>
  );
}
