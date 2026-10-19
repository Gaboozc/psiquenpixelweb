/** @type {import('next').NextConfig} */
const nextConfig = {
  // Las portadas y subidas viven en el Storage del proyecto actual de Supabase;
  // sin este permiso el optimizador de imágenes rechaza esas URLs (400).
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bwtowhgbpzthnemllxjc.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
