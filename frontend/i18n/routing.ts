import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['nl', 'en', 'fr'],
  defaultLocale: 'nl',
  
  pathnames: {
    '/': '/',
    '/projects': {
      nl: '/realisaties',
      fr: '/realisations',
      en: '/projects',
    },
    '/projects/[slug]': {
      nl: '/realisaties/[slug]',
      fr: '/realisations/[slug]',
      en: '/projects/[slug]',
    },
    '/services': {
      nl: '/diensten',
      fr: '/services',
      en: '/services',
    },
    '/services/[slug]': {
      nl: '/diensten/[slug]',
      fr: '/services/[slug]',
      en: '/services/[slug]',
    },
    '/faq': {
      nl: '/veelgestelde-vragen',
      fr: '/questions-frequentes',
      en: '/faq',
    },
    '/areas': {
      nl: '/werkgebieden',
      fr: '/zones-intervention',
      en: '/areas',
    },
    '/areas/[slug]': {
      nl: '/werkgebieden/[slug]',
      fr: '/zones-intervention/[slug]',
      en: '/areas/[slug]',
    },
    '/contact': {
      nl: '/contact',
      fr: '/contact',
      en: '/contact',
    },
    '/privacy-policy': {
      nl: '/privacybeleid',
      fr: '/politique-de-confidentialite',
      en: '/privacy-policy',
    },
    '/about': {
      nl: '/over-ons',
      fr: '/a-propos',
      en: '/about',
    }
  }
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);