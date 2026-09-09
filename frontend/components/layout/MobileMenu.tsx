'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import Image from 'next/image';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Header');
  const tFloating = useTranslations('Floating');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const rawPhoneNumber = tFloating('number').replace(/[^0-9+]/g, '');

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-gray-900 focus:outline-none"
        aria-label="Open menu"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col overflow-y-auto">
          <div className="flex justify-end p-6">
            <button onClick={closeMenu} className="p-2 text-gray-500 hover:text-red-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col px-8 pb-12 gap-8">
            <nav className="flex flex-col gap-6 text-xl font-bold text-gray-900">
              <Link href="/" onClick={closeMenu} className="hover:text-[#C82024] border-b border-gray-100 pb-2">
                {t('mainbar.home')}
              </Link>
              <Link href="/" onClick={closeMenu} className="hover:text-[#C82024] flex items-center justify-between border-b border-gray-100 pb-2">
                {t('mainbar.services')}
                <Image src="/icons/red-arrow-down.svg" alt="Arrow" width={20} height={20} className="-rotate-90" />
              </Link>
              <Link href="/projects" onClick={closeMenu} className="hover:text-[#C82024] border-b border-gray-100 pb-2">{t('mainbar.projects')}</Link>
              <Link href="/" onClick={closeMenu} className="hover:text-[#C82024] border-b border-gray-100 pb-2">{t('mainbar.pricing')}</Link>
              <Link href="/" onClick={closeMenu} className="hover:text-[#C82024] border-b border-gray-100 pb-2">{t('mainbar.knowledgeBase')}</Link>
            </nav>

            <nav className="flex flex-col gap-4 text-gray-500 font-medium mt-2">
              <Link href="/" onClick={closeMenu}>{t('topbar.serviceAreas')}</Link>
              <Link href="/" onClick={closeMenu}>{t('topbar.aboutUs')}</Link>
              <Link href="/" onClick={closeMenu}>{t('topbar.grants')}</Link>
              <Link href="/" onClick={closeMenu}>{t('topbar.faq')}</Link>
              <Link href="/" onClick={closeMenu}>{t('topbar.contact')}</Link>
            </nav>

            <div className="mt-2 flex flex-col gap-6">
              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <span className="text-gray-500 font-bold">{t('topbar.language')}</span>
                <LanguageSwitcher />
              </div>
              
              <Link 
                href="/" 
                onClick={closeMenu}
                className="bg-[#C82024] text-white text-center py-4 rounded-full font-bold shadow-md hover:bg-red-800 transition text-lg"
              >
                {t('mainbar.cta')}
              </Link>

              <div className="flex flex-col gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <a 
                  href={`tel:${rawPhoneNumber}`}
                  className="flex items-center gap-3 text-gray-800 hover:text-[#C82024] transition text-sm font-semibold"
                >
                  <div className="w-9 h-9 rounded-full bg-[#C82024] shadow-sm flex items-center justify-center shrink-0">
                    <Image src="/icons/phone.svg" alt="Phone" width={16} height={16} className="brightness-0 invert" />
                  </div>
                  <span>{tFloating('number')}</span>
                </a>

                <a 
                  href={`mailto:${tFloating('mailAddress')}`}
                  className="flex items-center gap-3 text-gray-800 hover:text-[#C82024] transition text-sm font-semibold"
                >
                  <div className="w-9 h-9 rounded-full bg-[#C82024] shadow-sm flex items-center justify-center shrink-0">
                    <Image src="/icons/mail.svg" alt="Mail" width={16} height={16} className="brightness-0 invert" />
                  </div>
                  <span className="truncate">{tFloating('mailAddress')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}