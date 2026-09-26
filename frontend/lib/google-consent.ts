import { DEFAULT_CONSENT, type ConsentPreferences } from './consent';

export function googleConsentState(preferences: ConsentPreferences) {
  return {
    analytics_storage: preferences.analytics ? 'granted' : 'denied',
    ad_storage: preferences.marketing ? 'granted' : 'denied',
    ad_user_data: preferences.marketing ? 'granted' : 'denied',
    ad_personalization: preferences.marketing ? 'granted' : 'denied',
  } as const;
}

let initialized = false;
let previousPreferences: ConsentPreferences | undefined;

export function updateGoogleConsent(preferences: ConsentPreferences) {
  if (typeof window === 'undefined') return;
  const target = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  target.dataLayer ??= [];
  target.gtag ??= function () {
    target.dataLayer!.push(arguments);
  };
  if (!initialized) {
    target.gtag('consent', 'default', googleConsentState(DEFAULT_CONSENT));
    initialized = true;
  }
  target.gtag('consent', 'update', googleConsentState(preferences));
  if (!previousPreferences || previousPreferences.analytics !== preferences.analytics || previousPreferences.marketing !== preferences.marketing) {
    target.dataLayer.push({
      event: 'nu_consent_update',
      consent_necessary: true,
      consent_analytics: preferences.analytics,
      consent_marketing: preferences.marketing,
    });
    previousPreferences = { ...preferences };
  }
}
