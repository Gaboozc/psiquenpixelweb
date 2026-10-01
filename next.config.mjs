/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // "Catálogo" is now the merch store, which lives at /merch. The old
      // game-analysis section moved into the blog. Temporary (307) on purpose,
      // so the URL scheme can still change without browsers caching it forever.
      { source: '/catalogo/:path*', destination: '/merch', permanent: false },
    ];
  },
};

export default nextConfig;
