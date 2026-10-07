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

function clearGoogleAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(';')
    .map(cookie => cookie.trim().split('=')[0])
    .filter(name => name === '_ga' || name.startsWith('_ga_'));

  const hostname = window.location.hostname;

  for (const name of cookieNames) {
    document.cookie = `${name}=; Max-Age=0; path=/`;

    if (hostname !== 'localhost') {
      const domain = hostname.startsWith('www.')
        ? `.${hostname.slice(4)}`
        : `.${hostname}`;

      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
    }
  }
}

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

  const analyticsRevoked =
    previousPreferences?.analytics === true &&
    preferences.analytics === false;

  target.gtag('consent', 'update', googleConsentState(preferences));

  if (analyticsRevoked) {
    clearGoogleAnalyticsCookies();
  }

  if (
    !previousPreferences ||
    previousPreferences.analytics !== preferences.analytics ||
    previousPreferences.marketing !== preferences.marketing
  ) {
    target.dataLayer.push({
      event: 'nu_consent_update',
      consent_necessary: true,
      consent_analytics: preferences.analytics,
      consent_marketing: preferences.marketing,
    });

    previousPreferences = { ...preferences };
  }
}