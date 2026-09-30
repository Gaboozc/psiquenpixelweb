import { getGameBySlug, getAllGames } from '@/lib/catalog';
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/ogImage';

export const alt = 'Análisis — Psique \'n\' Pixel';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllGames().map((game) => ({ slug: game.slug }));
}

export default async function Image({ params }) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  return renderOgCard({
    eyebrow: `ANÁLISIS${game?.game ? ' · ' + game.game.toUpperCase() : ''}`,
    title: game?.title ?? "Psique 'n' Pixel",
    accent: '#e8903a',
  });
}
