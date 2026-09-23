export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = 'nu-isoleren.consent';
export const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;

export type ConsentPreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export type StoredConsent = ConsentPreferences & {
  version: number;
  savedAt: number;
  expiresAt: number;
};

export const DEFAULT_CONSENT: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export function parseConsent(raw: string | null, now = Date.now()): StoredConsent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (
      !value || value.version !== CONSENT_VERSION || value.necessary !== true ||
      typeof value.analytics !== 'boolean' || typeof value.marketing !== 'boolean' ||
      !Number.isFinite(value.savedAt) || !Number.isFinite(value.expiresAt) ||
      value.savedAt > now || value.savedAt < 0 || value.expiresAt <= now ||
      value.expiresAt <= value.savedAt || value.expiresAt - value.savedAt > CONSENT_MAX_AGE
    ) return null;
    return {
      version: value.version, necessary: true, analytics: value.analytics,
      marketing: value.marketing, savedAt: value.savedAt, expiresAt: value.expiresAt,
    };
  } catch {
    return null;
  }
}

export function createConsent(preferences: ConsentPreferences, now = Date.now()): StoredConsent {
  return {
    necessary: true, analytics: preferences.analytics, marketing: preferences.marketing,
    version: CONSENT_VERSION, savedAt: now, expiresAt: now + CONSENT_MAX_AGE,
  };
}
