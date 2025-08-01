
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverRuntimeConfig: {
    // Garante que a chave da API Gemini está disponível no ambiente do servidor
    geminiApiKey: process.env.GEMINI_API_KEY,
  },
};

module.exports = nextConfig;
