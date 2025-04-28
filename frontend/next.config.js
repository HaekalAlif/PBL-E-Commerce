/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      // Add your production domain here when deploying
      {
        protocol: 'https',
        hostname: 'your-production-domain.com',
        pathname: '/storage/**',
      },
    ],
  },
}

module.exports = nextConfig
