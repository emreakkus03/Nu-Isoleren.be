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
  }
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);