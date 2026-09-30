import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/ogImage';

export const alt = 'Post — Psique \'n\' Pixel';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return renderOgCard({
    eyebrow: `POST${post?.category ? ' · ' + post.category.toUpperCase() : ''}`,
    title: post?.title ?? "Psique 'n' Pixel",
    accent: '#9b59f7',
  });
}
