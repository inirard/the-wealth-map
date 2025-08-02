
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
  // Adiciona a configuração do lado do servidor para expor as variáveis de ambiente de forma segura
  serverRuntimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
  },
  publicRuntimeConfig: {
    // As chaves expostas aqui também estão disponíveis no lado do cliente
  },
};

module.exports = nextConfig;
