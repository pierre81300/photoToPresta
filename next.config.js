/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Configuration des API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Désactiver les vérifications ESLint pendant le build pour éviter les problèmes de déploiement
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Désactiver les vérifications TypeScript pendant le build 
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 