import { routing } from './i18n/config';
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextIntlPlugin = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(routing.pathnames).flatMap(([key, localized]) =>
      routing.locales.flatMap(locale => {
        const destination = typeof localized === 'string' ? localized : localized[locale];
        if (key === destination) return [];
        return [{ source: `/${locale}${key.replace('[slug]', ':slug')}`, destination: `/${locale}${destination.replace('[slug]', ':slug')}`, permanent: true }];
      })
    );
  },
  images: {
    qualities: [75, 90],
    dangerouslyAllowLocalIP: process.env.DEPLOYMENT_ENV !== 'production',
    remotePatterns: [
      ...(process.env.MEDIA_URL ? [new URL(`${process.env.MEDIA_URL.replace(/\/$/, '')}/**`)] : []),
      {
        protocol: 'http' as const,
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/nu-isoleren/**',
      },
      {
        protocol: 'http' as const,
        hostname: 'localhost',
        port: '9000',
        pathname: '/nu-isoleren/**',
      },
    ].filter(pattern => process.env.DEPLOYMENT_ENV !== 'production' || pattern instanceof URL),
  },
};

export default nextIntlPlugin(nextConfig);
