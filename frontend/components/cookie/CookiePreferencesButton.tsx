'use client';

import { useTranslations } from 'next-intl';
import { openConsentPreferences } from '@/lib/consent-store';

export default function CookiePreferencesButton() {
  const t = useTranslations('CookieConsent');
  return <button type="button" onClick={openConsentPreferences} className="cursor-pointer transition hover:text-[#C82024] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1A669A]">{t('preferencesTitle')}</button>;
}
