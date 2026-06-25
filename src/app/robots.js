export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/pnp-vault', '/api/'],
    },
    sitemap: 'https://psiquenpixel.com/sitemap.xml',
  };
}
