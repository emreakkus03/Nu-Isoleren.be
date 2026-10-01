import { routing } from './i18n/config';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextIntlPlugin = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async redirects() {
    const hostRedirects = [
      {
        source: '/:path*',
        has: [
          {
            type: 'host' as const,
            value: 'nu-isoleren.be',
          },
        ],
        destination: 'https://www.nu-isoleren.be/:path*',
        permanent: true,
      },
    ];

    const localeRedirects = Object.entries(routing.pathnames).flatMap(
      ([key, localized]) =>
        routing.locales.flatMap((locale) => {
          const destination =
            typeof localized === 'string'
              ? localized
              : localized[locale];

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

    const legacyRedirects = [
      {
        source: '/spouwmuurisolatie',
        destination: '/nl/diensten/spouwmuurisolatie',
        permanent: true,
      },
      {
        source: '/dakisolatie',
        destination: '/nl/diensten/dakisolatie',
        permanent: true,
      },
      {
        source: '/crepi',
        destination: '/nl/diensten/crepi',
        permanent: true,
      },
      {
        source: '/opstijgend-vocht',
        destination: '/nl/diensten/opstijgend-vocht',
        permanent: true,
      },
      {
        source: '/eps-isolatie',
        destination: '/nl/eps-isolatie',
        permanent: true,
      },
      {
        source: '/glaswol-isolatie',
        destination: '/nl/glaswol-isolatie',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/nl/contact',
        permanent: true,
      },
      {
        source: '/over-ons',
        destination: '/nl/over-ons',
        permanent: true,
      },
      {
        source: '/realisaties',
        destination: '/nl/realisaties',
        permanent: true,
      },
      {
        source: '/werkgebieden',
        destination: '/nl/werkgebieden',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/nl/privacybeleid',
        permanent: true,
      },
      {
        source: '/spouwmuurisolatie-landing',
        destination: '/nl/diensten/spouwmuurisolatie',
        permanent: true,
      },
      {
        source: '/isolatie-aalst',
        destination: '/nl/werkgebieden/aalst',
        permanent: true,
      },
      {
        source: '/isolatie-aarschot',
        destination: '/nl/werkgebieden/aarschot',
        permanent: true,
      },
      {
        source: '/isolatie-antwerpen',
        destination: '/nl/werkgebieden/antwerpen',
        permanent: true,
      },
      {
        source: '/isolatie-beringen',
        destination: '/nl/werkgebieden/beringen',
        permanent: true,
      },
      {
        source: '/isolatie-beveren',
        destination: '/nl/werkgebieden/beveren',
        permanent: true,
      },
      {
        source: '/isolatie-brugge',
        destination: '/nl/werkgebieden/brugge',
        permanent: true,
      },
      {
        source: '/isolatie-deinze',
        destination: '/nl/werkgebieden/deinze',
        permanent: true,
      },
      {
        source: '/isolatie-dendermonde',
        destination: '/nl/werkgebieden/dendermonde',
        permanent: true,
      },
      {
        source: '/isolatie-genk',
        destination: '/nl/werkgebieden/genk',
        permanent: true,
      },
      {
        source: '/isolatie-gent',
        destination: '/nl/werkgebieden/gent',
        permanent: true,
      },
      {
        source: '/isolatie-hasselt',
        destination: '/nl/werkgebieden/hasselt',
        permanent: true,
      },
      {
        source: '/isolatie-kortrijk',
        destination: '/nl/werkgebieden/kortrijk',
        permanent: true,
      },
      {
        source: '/isolatie-lokeren',
        destination: '/nl/werkgebieden/lokeren',
        permanent: true,
      },
      {
        source: '/isolatie-mechelen',
        destination: '/nl/werkgebieden/mechelen',
        permanent: true,
      },
      {
        source: '/isolatie-oostende',
        destination: '/nl/werkgebieden/oostende',
        permanent: true,
      },
      {
        source: '/isolatie-roeselaere',
        destination: '/nl/werkgebieden/roeselare',
        permanent: true,
      },
      {
        source: '/isolatie-sint-niklaas',
        destination: '/nl/werkgebieden/sint-niklaas',
        permanent: true,
      },
      {
        source: '/isolatie-turnhout',
        destination: '/nl/werkgebieden/turnhout',
        permanent: true,
      },
      {
        source: '/isolatie-vilvoorde',
        destination: '/nl/werkgebieden/vilvoorde',
        permanent: true,
      },
      {
        source: '/isolatie-brussel',
        destination: '/nl/werkgebieden',
        permanent: true,
      },
    ];

    return [...hostRedirects, ...legacyRedirects, ...localeRedirects];
  },

  images: {
  qualities: [50, 60, 75, 90],
  dangerouslyAllowLocalIP: process.env.DEPLOYMENT_ENV !== 'production',
  remotePatterns: [
    ...(process.env.NEXT_PUBLIC_S3_PUBLIC_URL
      ? [
          new URL(
            `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL.replace(/\/$/, '')}/**`
          ),
        ]
      : []),
    new URL('https://lh3.googleusercontent.com/**'),
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
  ].filter(
    (pattern) =>
      process.env.DEPLOYMENT_ENV !== 'production' || pattern instanceof URL
  ),
},
};

export default nextIntlPlugin(nextConfig);