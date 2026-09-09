'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import Image from 'next/image';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const currentLocale = useLocale();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const locales = ['nl', 'fr', 'en'];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={dropdownRef} 
      className="relative flex items-center ml-4 border-l pl-4 border-gray-300"
    >
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 font-bold text-gray-500 hover:text-[#C82024] transition uppercase select-none"
      >
        {currentLocale}
        <Image 
          src="/icons/red-arrow-down.svg" 
          alt="Arrow" 
          width={24} 
          height={24} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 pt-2 z-50">
          <div className="w-24 bg-white border border-gray-100 shadow-lg rounded-md overflow-hidden">
            {locales.map((loc) => (
              <Link
                key={loc}
                href={pathname}
                locale={loc}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 text-sm font-bold text-center transition uppercase ${
                  currentLocale === loc 
                    ? 'text-[#C82024] bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#C82024]'
                }`}
              >
                {loc}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}