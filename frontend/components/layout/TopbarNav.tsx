'use client';

import { useTranslations } from 'next-intl';
import type { ComponentProps } from 'react';
import { Link, usePathname } from '@/i18n/routing';

type LinkHref = ComponentProps<typeof Link>['href'];

export default function TopbarNav() {
  const t = useTranslations('Header');
  const pathname = usePathname();

  const links = [
    { href: '/werkgebied', label: t('topbar.serviceAreas') },
    { href: '/over-ons', label: t('topbar.aboutUs') },
    { href: '/premies', label: t('topbar.grants') },
    { href: '/faq', label: t('topbar.faq') },
    { href: '/contact', label: t('topbar.contact') },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="hidden md:flex items-center gap-3 lg:gap-6 font-medium text-xs lg:text-sm">
      {links.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href as LinkHref}
            className={`transition whitespace-nowrap relative py-0.5 flex flex-col items-center ${
              active
                ? 'text-[#1A669A] font-bold after:absolute after:-bottom-1 after:w-1.5 after:h-1.5 after:rounded-full after:bg-[#1A669A]'
                : 'text-gray-600 hover:text-[#1A669A]'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}