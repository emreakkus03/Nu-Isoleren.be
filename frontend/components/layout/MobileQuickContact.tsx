'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function MobileQuickContact() {
  const tFloating = useTranslations('Floating');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const rawPhoneNumber = tFloating('number').replace(/[^0-9+]/g, '');

  return (
    <div
      className={`md:hidden w-full bg-gray-50 border-t border-b border-gray-200 transition-all duration-300 overflow-hidden ${
        isVisible ? 'max-h-14 opacity-100' : 'max-h-0 opacity-0 border-none'
      }`}
    >
      <div className="grid grid-cols-2 divide-x divide-gray-200 text-xs font-semibold">
        <a
          href={`tel:${rawPhoneNumber}`}
          className="flex items-center justify-center gap-2 py-2.5 px-3 text-gray-800 active:bg-gray-100 transition"
        >
          <div className="w-6 h-6 rounded-full bg-[#C82024] flex items-center justify-center shrink-0 shadow-sm">
            <Image
              src="/icons/phone.svg"
              alt="Phone"
              width={12}
              height={12}
              className="brightness-0 invert"
            />
          </div>
          <span className="whitespace-nowrap">Bel direct</span>
        </a>

        <a
          href={`mailto:${tFloating('mailAddress')}`}
          className="flex items-center justify-center gap-2 py-2.5 px-3 text-gray-800 active:bg-gray-100 transition"
        >
          <div className="w-6 h-6 rounded-full bg-[#C82024] flex items-center justify-center shrink-0 shadow-sm">
            <Image
              src="/icons/mail.svg"
              alt="Mail"
              width={12}
              height={12}
              className="brightness-0 invert"
            />
          </div>
          <span className="whitespace-nowrap">Stel een vraag</span>
        </a>
      </div>
    </div>
  );
}