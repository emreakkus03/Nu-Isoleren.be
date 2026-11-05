
'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function MobileQuickContact() {
  const tFloating = useTranslations('Floating');
  const t = useTranslations('Header');
  const company = useTranslations('General.company');

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const rawPhoneNumber = company('phoneHref');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  
return (
  <div
    className={`md:hidden w-full overflow-hidden bg-gray-50 transition-all duration-300 ${
      isVisible
        ? 'max-h-14 opacity-100'
        : 'max-h-0 opacity-0'
    }`}
  >
    <div className="grid grid-cols-2 text-xs font-semibold">
      <a
        href={`tel:${rawPhoneNumber}`}
        className="flex min-h-12 items-center justify-center gap-2 bg-gray-50 px-3 py-2.5 text-gray-800 transition-colors active:bg-gray-100"
      >
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C82024] shadow-sm">
          <Image
            src="/icons/phone.svg"
            alt=""
            width={12}
            height={12}
            className="brightness-0 invert"
          />
        </div>

        <span className="whitespace-nowrap">
          {tFloating('callDirect')}
        </span>
      </a>

      <Link
        href="/quote"
        className="flex min-h-12 items-center justify-center gap-2 bg-[#C82024] px-3 py-2.5 text-white transition-colors hover:bg-[#B51D21] active:bg-[#A31A1E]"
      >
        <span className="whitespace-nowrap">
          {t('mainbar.cta')}
        </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Link>
    </div>
  </div>
);
}
