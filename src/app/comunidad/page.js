import PageWrapper from '@/components/layout/PageWrapper';
import PillButton from '@/components/ui/PillButton';

export const metadata = {
  title: 'Comunidad',
  description: 'Únete a la comunidad de Psique \'n\' Pixel en Discord y sigue el directo en Twitch.',
};

export default function ComunidadPage() {
  return (
    <PageWrapper
      title="Comunidad"
      subtitle="La Guild de las Mazmorras de la Mente"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Twitch section */}
        <section className="pixel-border p-8 flex flex-col gap-6 items-center text-center" style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-brand-muted inline-block" />
            <span
              className="text-brand-muted text-[9px] tracking-widest"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              TWITCH · OFFLINE
            </span>
          </div>

          <h2
            className="text-brand-text text-base"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            Directos
          </h2>

          <p className="text-brand-muted text-sm font-body leading-relaxed">
            Sesiones de juego en vivo con análisis psicológico en tiempo real. Cuando estemos
            en directo, aquí verás el stream embebido.
          </p>

          {/* Twitch embed placeholder */}
          <div className="w-full aspect-video bg-brand-bg pixel-border flex items-center justify-center">
            <p
              className="text-brand-border text-[9px]"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              SIN STREAM ACTIVO
            </p>
          </div>

          <PillButton href="#">VER EN TWITCH</PillButton>
        </section>

        {/* Discord section */}
        <section className="pixel-border-amber p-8 flex flex-col gap-6 items-center text-center" style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
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

          {/* Discord widget placeholder */}
          <div className="w-full bg-brand-bg pixel-border p-6 flex flex-col items-center gap-4">
            <p
              className="text-brand-muted text-[9px] tracking-widest"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              JOIN THE GUILD
            </p>
            <p className="text-brand-border text-xs font-body">
              Widget de Discord — configura NEXT_PUBLIC_DISCORD_SERVER_ID en .env.local
            </p>
          </div>

          <PillButton href="#">UNIRSE AL DISCORD ⚔</PillButton>
        </section>
      </div>
    </PageWrapper>
  );
}
