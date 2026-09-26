'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { closeConsentPreferences } from '@/lib/consent-store';

export default function PolicyLinks() {
  const t = useTranslations('LegalPages');
  return <nav aria-label={t('policyLinks')} className="mt-4 flex flex-wrap gap-4 text-sm text-[#1A669A] underline">
    <Link onClick={closeConsentPreferences} href="/privacy-policy">{t('privacy.title')}</Link>
    <Link onClick={closeConsentPreferences} href="/cookie-policy">{t('cookies.title')}</Link>
  </nav>;
}
