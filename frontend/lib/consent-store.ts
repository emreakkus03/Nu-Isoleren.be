'use client';

import { CONSENT_STORAGE_KEY, DEFAULT_CONSENT, createConsent, parseConsent, type ConsentPreferences, type StoredConsent } from './consent';
import { updateGoogleConsent } from './google-consent';

type ConsentSnapshot = {
  ready: boolean;
  consent: StoredConsent | null;
  preferences: ConsentPreferences;
  panelOpen: boolean;
  storageFailed: boolean;
};

const initialSnapshot: ConsentSnapshot = {
  ready: false, consent: null, preferences: DEFAULT_CONSENT, panelOpen: false, storageFailed: false,
};
let snapshot = initialSnapshot;
const listeners = new Set<() => void>();
let expiryTimer: ReturnType<typeof setTimeout> | undefined;

export const getConsentSnapshot = () => snapshot;
export const getServerConsentSnapshot = () => initialSnapshot;
export function subscribeConsent(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function publish(consent: StoredConsent | null, extra: Partial<ConsentSnapshot> = {}) {
  const preferences = consent ?? DEFAULT_CONSENT;
  updateGoogleConsent(preferences);
  snapshot = { ...snapshot, ready: true, consent, preferences, ...extra };
  clearTimeout(expiryTimer);
  if (consent) {
    expiryTimer = setTimeout(
      () => publish(parseConsent(JSON.stringify(consent))),
      Math.max(0, Math.min(consent.expiresAt - Date.now(), 2_147_483_647)),
    );
  }
  listeners.forEach(listener => listener());
}

function readStorage() {
  try {
    publish(parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY)), { storageFailed: false });
  } catch {
    publish(snapshot.consent && parseConsent(JSON.stringify(snapshot.consent)), { storageFailed: true });
  }
}

export function initializeConsent() {
  readStorage();
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY || event.key === null) readStorage();
  };
  const onVisible = () => {
    if (document.visibilityState === 'visible') {
      publish(snapshot.consent && parseConsent(JSON.stringify(snapshot.consent)));
    }
  };
  window.addEventListener('storage', onStorage);
  document.addEventListener('visibilitychange', onVisible);
  return () => {
    clearTimeout(expiryTimer);
    window.removeEventListener('storage', onStorage);
    document.removeEventListener('visibilitychange', onVisible);
  };
}

export function saveConsent(preferences: ConsentPreferences) {
  const consent = createConsent(preferences);
  let storageFailed = false;
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    storageFailed = true;
  }
  publish(consent, { panelOpen: false, storageFailed });
}

export function openConsentPreferences() {
  snapshot = { ...snapshot, panelOpen: true };
  listeners.forEach(listener => listener());
}

export function closeConsentPreferences() {
  snapshot = { ...snapshot, panelOpen: false };
  listeners.forEach(listener => listener());
}
