import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: `${env.}/api/:path*`,
  //     },
  //   ];
  // },
};

export default nextConfig;
