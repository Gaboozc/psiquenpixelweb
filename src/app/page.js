import PixelDivider from '@/components/ui/PixelDivider';
import Button from '@/components/ui/Button';
import PillButton from '@/components/ui/PillButton';
import ArticleCard from '@/components/blog/ArticleCard';
import GameCard from '@/components/catalogo/GameCard';
import HeroSection from '@/components/home/HeroSection';
import { getAllPosts } from '@/lib/posts';
import { getAllGames } from '@/lib/catalog';
import { getHome } from '@/lib/home';
import { getSettings } from '@/lib/settings';

// Render per-request so admin edits (hero, banners, links) apply live.
export const dynamic = 'force-dynamic';

export default async function Home() {
  const [posts, games, home, settings] = await Promise.all([
    getAllPosts({ limit: 3 }),
    getAllGames({ limit: 3 }),
    getHome(),
    getSettings(),
  ]);
  const { hero, mediaBanner, communityBanner } = home;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroSection phrases={hero.phrases} ctas={hero.ctas} videoUrl={hero.videoUrl} />

      <PixelDivider />

      {/* ── Latest posts ─────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 md:py-20 px-4 dungeon-bg">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard key={post.slug} {...post} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button variant="primary" href="/blog">
              VER TODOS LOS POSTS
            </Button>
          </div>
        </div>
      </section>

      <PixelDivider />

      {/* ── Game catalog ─────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 md:py-20 px-4 dungeon-surface">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
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

      {/* ── Media banner ─────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 md:py-20 px-4 dungeon-bg">
        <div className="max-w-4xl mx-auto">
          <div
            className="pixel-border-purple p-8 md:p-12 text-center flex flex-col items-center gap-6"
            style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <p
              className="text-brand-purple text-[9px] tracking-widest"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              {mediaBanner.eyebrow}
            </p>
            <h2
              className="text-brand-text text-lg md:text-xl"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              {mediaBanner.title}
            </h2>
            <p className="text-brand-muted text-sm max-w-md font-body leading-relaxed">
              {mediaBanner.text}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <PillButton href={mediaBanner.primaryHref}>{mediaBanner.primaryLabel}</PillButton>
              {mediaBanner.secondaryLabel && settings.social.spotify && (
                <PillButton href={settings.social.spotify}>{mediaBanner.secondaryLabel}</PillButton>
              )}
            </div>
          </div>
        </div>
      </section>

      <PixelDivider />

      {/* ── Community banner ─────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 md:py-20 px-4 dungeon-surface">
        <div className="max-w-4xl mx-auto">
          <div
            className="pixel-border-amber p-8 md:p-12 text-center flex flex-col items-center gap-6"
            style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <p
              className="text-brand-amber text-[9px] tracking-widest"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              {communityBanner.eyebrow}
            </p>
            <h2
              className="text-brand-text text-lg md:text-xl"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              {communityBanner.title}
            </h2>
            <p className="text-brand-muted text-sm max-w-md font-body leading-relaxed">
              {communityBanner.text}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <PillButton href={communityBanner.primaryHref}>{communityBanner.primaryLabel}</PillButton>
              {communityBanner.secondaryLabel && settings.social.twitch && (
                <PillButton href={settings.social.twitch}>{communityBanner.secondaryLabel}</PillButton>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
