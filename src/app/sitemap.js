import { getAllPosts } from '@/lib/posts';
import { getAllGames } from '@/lib/catalog';

export default function sitemap() {
  const posts = getAllPosts();
  const games = getAllGames();

  const base = 'https://psiquenpixel.com';

  const staticRoutes = [
    { url: base,             lastModified: new Date(), changeFrequency: 'weekly',  priority: 1 },
    { url: `${base}/blog`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/catalogo`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/media`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/comunidad`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/merch`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const postRoutes = posts.map((post) => ({
    url:             `${base}/blog/${post.slug}`,
    lastModified:    post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly',
    priority:        0.8,
  }));

  const gameRoutes = games.map((game) => ({
    url:             `${base}/catalogo/${game.slug}`,
    lastModified:    game.date ? new Date(game.date) : new Date(),
    changeFrequency: 'monthly',
    priority:        0.8,
  }));

  return [...staticRoutes, ...postRoutes, ...gameRoutes];
}
