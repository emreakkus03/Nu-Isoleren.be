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
    },
    '/prices': {
      nl: '/prijzen',
      fr: '/tarifs',
      en: '/prices',
    },
    '/prices/epc-calculator': {
  nl: '/prijzen/epc-waarde-berekenen',
  fr: '/tarifs/calcul-peb',
  en: '/prices/epc-rating-calculator',
},
'/prices/energy-savings-calculator': {
    nl: '/prijzen/energiebesparing-berekenen',
    fr: '/tarifs/calcul-economies-energie',
    en: '/prices/energy-savings-calculator',
  },
  '/prices/home-insulation-check': {
  nl: '/prijzen/woningcheck',
  fr: '/tarifs/diagnostic-isolation',
  en: '/prices/home-insulation-check',
},
'/grants': {
  nl: '/premies',
  fr: '/primes',
  en: '/grants',
},
'/grants/flanders': {
  nl: '/premies/vlaanderen',
  fr: '/primes/flandre',
  en: '/grants/flanders',
},

'/grants/brussels': {
  nl: '/premies/brussel',
  fr: '/primes/bruxelles',
  en: '/grants/brussels',
},

'/grants/wallonia': {
  nl: '/premies/wallonie',
  fr: '/primes/wallonie',
  en: '/grants/wallonia',
},
'/quote': {
  nl: '/gratis-offerte',
  fr: '/devis-gratuit',
  en: '/free-quote',
},
'/knowledge': {
  nl: '/kennisbank',
  fr: '/base-de-connaissances',
  en: '/knowledge-base',
},

'/knowledge/[slug]': {
  nl: '/kennisbank/[slug]',
  fr: '/base-de-connaissances/[slug]',
  en: '/knowledge-base/[slug]',
},

'/cookie-policy': {
  nl: '/cookiebeleid',
  fr: '/politique-de-cookies',
  en: '/cookie-policy',
},

  }
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);