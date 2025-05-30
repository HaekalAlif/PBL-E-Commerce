/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      // Add your production domain here when deploying
      {
        protocol: "https",
        hostname: "your-production-domain.com",
        pathname: "/storage/**",
      },
    ],
  },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_REVERB_APP_KEY: process.env.REVERB_APP_KEY,
    NEXT_PUBLIC_REVERB_HOST: process.env.REVERB_HOST,
    NEXT_PUBLIC_REVERB_PORT: process.env.REVERB_PORT,
    NEXT_PUBLIC_REVERB_SCHEME: process.env.REVERB_SCHEME,
  },
};

module.exports = nextConfig;
