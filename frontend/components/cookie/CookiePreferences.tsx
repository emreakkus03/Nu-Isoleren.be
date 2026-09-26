'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import PolicyLinks from '@/components/legal/PolicyLinks';
import { DEFAULT_CONSENT, type ConsentPreferences } from '@/lib/consent';
import { closeConsentPreferences, saveConsent } from '@/lib/consent-store';

const buttonClass = 'cursor-pointer rounded-full border border-[#1A669A] px-4 py-3 text-sm font-bold text-[#1A669A] transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A669A]';

export default function CookiePreferences({ preferences }: { preferences: ConsentPreferences }) {
  const t = useTranslations('CookieConsent');
  const dialog = useRef<HTMLDialogElement>(null);
  const [selection, setSelection] = useState(preferences);

  useEffect(() => {
    const element = dialog.current!;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
      else document.getElementById('cookie-banner-preferences')?.focus();
    };
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href]')];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <dialog ref={dialog} onKeyDown={handleKeyDown} aria-labelledby="cookie-preferences-title" aria-describedby="cookie-preferences-description" onCancel={closeConsentPreferences} className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 text-gray-950 shadow-xl backdrop:bg-black/40 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <h2 id="cookie-preferences-title" className="text-xl font-extrabold text-[#1A669A]">{t('preferencesTitle')}</h2>
        <button type="button" autoFocus onClick={closeConsentPreferences} aria-label={t('close')} className="cursor-pointer rounded p-1 text-xl leading-none focus-visible:outline-2 focus-visible:outline-[#1A669A]">×</button>
      </div>
      <p id="cookie-preferences-description" className="mt-3 text-sm leading-relaxed text-gray-600">{t('preferencesDescription')}</p>
      <div className="mt-5 divide-y divide-gray-200">
        {(['necessary', 'analytics', 'marketing'] as const).map(category => (
          <div key={category} className="py-4 first:pt-0">
            <label className="flex cursor-pointer items-center justify-between gap-4 font-bold" htmlFor={`cookie-${category}`}>
              <span>{t(`${category}Title`)}</span>
              <input id={`cookie-${category}`} type="checkbox" role="switch" checked={selection[category]} disabled={category === 'necessary'} aria-describedby={`cookie-${category}-description`} onChange={event => setSelection({ ...selection, [category]: event.target.checked })} className="h-5 w-5 shrink-0 accent-[#1A669A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1A669A]" />
            </label>
            {category === 'necessary' && <p className="mt-1 text-xs font-semibold text-[#1A669A]">{t('alwaysActive')}</p>}
            <p id={`cookie-${category}-description`} className="mt-2 text-sm leading-relaxed text-gray-600">{t(`${category}Description`)}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button type="button" className={buttonClass} onClick={() => saveConsent(DEFAULT_CONSENT)}>{t('rejectAll')}</button>
        <button type="button" className={buttonClass} onClick={() => saveConsent({ necessary: true, analytics: true, marketing: true })}>{t('acceptAll')}</button>
        <button type="button" className="cursor-pointer rounded-full bg-[#C82024] px-4 py-3 text-sm font-bold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A669A] sm:col-span-2" onClick={() => saveConsent(selection)}>{t('savePreferences')}</button>
      </div>
      <PolicyLinks />
    </dialog>
  );
}
