'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useAlternateLinks } from '@/context/AlternateLinksContext';
import Image from 'next/image';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const currentLocale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { alternateSlugs } = useAlternateLinks();

  const locales = [
    { code: 'nl', label: 'NL' },
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (nextLocale: string) => {
    setIsOpen(false);

    let updatedParams = { ...params };
    if (alternateSlugs && alternateSlugs[nextLocale]) {
      updatedParams = { ...updatedParams, slug: alternateSlugs[nextLocale] };
    }

    startTransition(() => {
      router.replace(
        // @ts-expect-error next-intl typed routing
        { pathname, params: updatedParams },
        { locale: nextLocale }
      );
    });
  };

  return (
    <div 
      ref={dropdownRef} 
      className="relative flex items-center ml-4 border-l pl-4 border-gray-300"
    >
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-1 font-bold text-gray-500 hover:text-[#C82024] transition uppercase select-none disabled:opacity-50"
      >
        {currentLocale}
        <Image 
          src="/icons/red-arrow-down.svg" 
          alt="Pijl" 
          width={24} 
          height={24} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 pt-2 z-50">
          <div className="w-24 bg-white border border-gray-100 shadow-lg rounded-md overflow-hidden py-1">
            {locales.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => handleLocaleChange(code)}
                className={`w-full block px-4 py-2 text-sm font-bold text-center transition uppercase ${
                  currentLocale === code 
                    ? 'text-[#C82024] bg-red-50'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#C82024]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}