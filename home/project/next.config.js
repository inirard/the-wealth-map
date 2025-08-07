
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false, // Garante que a PWA está sempre ativa
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  buildExcludes: [/middleware-manifest\.json$/],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Garante headers corretos para Safari/iOS para forçar a revalidação
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "X-Timestamp",
            value: new Date().toISOString(), // Força a mudança no build para o iPhone
          },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
