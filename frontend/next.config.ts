import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextIntlPlugin = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/nu-isoleren/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/nu-isoleren/**',
      },
    ],
  },
};

export default nextIntlPlugin(nextConfig);
