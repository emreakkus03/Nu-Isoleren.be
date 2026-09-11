'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import Image from 'next/image';

export default function HeaderNav() {
  const t = useTranslations('Header');
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getLinkClasses = (href: string) => {
    const active = isActive(href);
    return `transition lg:text-lg relative py-1 ${
      active
        ? 'text-[#C82024] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#C82024] after:rounded-full'
        : 'text-gray-900 hover:text-[#C82024]'
    }`;
  };

  return (
    <nav className="hidden lg:flex justify-center items-center gap-8 font-medium text-gray-900 shrink-0 px-4">
      <Link
        href="/"
        className={`flex items-center gap-1 ${getLinkClasses('/services')}`}
      >
        <span>{t('mainbar.services')}</span>
        <Image
          src="/icons/red-arrow-down.svg"
          alt="Arrow"
          width={24}
          height={24}
        />
      </Link>

      <Link
        href="/projects"
        className={getLinkClasses('/projects')}
      >
        {t('mainbar.projects')}
      </Link>

      <Link
        href="/"
        className={getLinkClasses('/pricing')}
      >
        {t('mainbar.pricing')}
      </Link>

      <Link
        href="/"
        className={getLinkClasses('/knowledge')}
      >
        {t('mainbar.knowledgeBase')}
      </Link>
    </nav>
  );
}