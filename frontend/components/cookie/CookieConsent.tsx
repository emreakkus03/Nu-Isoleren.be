'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import PolicyLinks from '@/components/legal/PolicyLinks';
import { DEFAULT_CONSENT } from '@/lib/consent';
import { initializeConsent, openConsentPreferences, saveConsent } from '@/lib/consent-store';
import { useConsent } from './useConsent';
import CookiePreferences from './CookiePreferences';

const buttonClass = 'cursor-pointer rounded-full border border-[#1A669A] px-4 py-3 text-sm font-bold text-[#1A669A] transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A669A]';

export default function CookieConsent() {
  const t = useTranslations('CookieConsent');
  const { ready, consent, preferences, panelOpen, storageFailed } = useConsent();
  useEffect(initializeConsent, []);

  return (
    <>
      {ready && !consent && (
        <section aria-labelledby="cookie-banner-title" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-h-[75dvh] max-w-4xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 text-gray-950 shadow-xl sm:inset-x-6 sm:bottom-6 sm:p-6">
          <h2 id="cookie-banner-title" className="text-lg font-extrabold text-[#1A669A]">{t('title')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{t('description')}</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button type="button" className={buttonClass} onClick={() => saveConsent(DEFAULT_CONSENT)}>{t('rejectAll')}</button>
            <button id="cookie-banner-preferences" type="button" className={buttonClass} onClick={openConsentPreferences}>{t('preferences')}</button>
            <button type="button" className={buttonClass} onClick={() => saveConsent({ necessary: true, analytics: true, marketing: true })}>{t('acceptAll')}</button>
          </div>
          <PolicyLinks />
        </section>
      )}
      {ready && panelOpen && <CookiePreferences preferences={preferences} />}
      {storageFailed && consent && <p role="status" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-lg">{t('storageUnavailable')}</p>}
    </>
  );
}
