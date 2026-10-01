import { getAllPosts } from '@/lib/posts';
import { getPublishedSagas } from '@/lib/sagas';

export default async function sitemap() {
  const posts = await getAllPosts();
  const sagas = await getPublishedSagas(posts);

  const base = 'https://psiquenpixel.com';

  const staticRoutes = [
    { url: base,                 lastModified: new Date(), changeFrequency: 'weekly',  priority: 1 },
    { url: `${base}/blog`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/merch`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/media`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/comunidad`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  const postRoutes = posts.map((post) => ({
    url:             `${base}/blog/${post.slug}`,
    lastModified:    post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly',
    priority:        0.8,
  }));

  const sagaRoutes = sagas.map((saga) => ({
    url:             `${base}/blog/saga/${saga.slug}`,
    lastModified:    saga.date ? new Date(saga.date) : new Date(),
    changeFrequency: 'weekly',
    priority:        0.8,
  }));

  return [...staticRoutes, ...sagaRoutes, ...postRoutes];
}
