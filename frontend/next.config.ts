import { routing } from '@/i18n/config';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextIntlPlugin = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(routing.pathnames).flatMap(([key, localized]) =>
      routing.locales.flatMap((locale) => {
        const destination =
          typeof localized === 'string' ? localized : localized[locale];

        if (key === destination) return [];

        return [
          {
            source: `/${locale}${key.replace('[slug]', ':slug')}`,
            destination: `/${locale}${destination.replace('[slug]', ':slug')}`,
            permanent: true,
          },
        ];
      })
    );
  },

  images: {
    unoptimized: true,
    qualities: [75, 90],
    dangerouslyAllowLocalIP: process.env.DEPLOYMENT_ENV !== 'production',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fls-a2d50205-fa89-472a-912e-34a9bf7f6b1a.laravel.cloud',
        pathname: '/**',
      },
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