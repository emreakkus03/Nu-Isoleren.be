'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export const turnstileEnabled =
  process.env.NEXT_PUBLIC_TURNSTILE_ENABLED === 'true';

const siteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      language: string;
      size: 'compact';
      theme: 'light';
      'response-field': false;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
      'timeout-callback': () => void;
    }
  ) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export default function Turnstile({
  onToken,
}: {
  onToken: (token: string | null) => void;
}) {
  const locale = useLocale();
  const t = useTranslations('Turnstile');

  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const renderWidget = useRef<(() => void) | null>(null);
  const mounted = useRef(false);

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!turnstileEnabled || !siteKey) {
      return;
    }

    mounted.current = true;

    let cancelled = false;
    let api: TurnstileApi | undefined;

    const fail = () => {
      if (cancelled) {
        return;
      }

      onToken(null);
      setFailed(true);
    };

    renderWidget.current = () => {
      if (
        cancelled ||
        !container.current ||
        widgetId.current !== null ||
        !window.turnstile
      ) {
        return;
      }

      api = window.turnstile;

      setReady(true);

      try {
        widgetId.current = api.render(container.current, {
          sitekey: siteKey,
          language: locale,
          size: 'compact',
          theme: 'light',
          'response-field': false,
          callback: (token) => {
            if (cancelled) {
              return;
            }

            setFailed(false);
            onToken(token);
          },
          'expired-callback': fail,
          'error-callback': fail,
          'timeout-callback': fail,
        });
      } catch {
        fail();
      }
    };

    renderWidget.current();

    return () => {
      cancelled = true;
      mounted.current = false;
      renderWidget.current = null;

      const id = widgetId.current;

      widgetId.current = null;
      onToken(null);

      if (id !== null) {
        try {
          api?.remove(id);
        } catch {}
      }
    };
  }, [locale, attempt, onToken]);

  const handleScriptLoaded = () => {
    if (!mounted.current) {
      return;
    }

    setReady(true);
    renderWidget.current?.();
  };

  if (!turnstileEnabled) {
    return null;
  }

  if (!siteKey) {
    return (
      <p
        role="alert"
        className="text-sm text-red-800"
      >
        {t('unavailable')}
      </p>
    );
  }

  return (
    <div className="my-4">
      <Script
        id="cloudflare-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={handleScriptLoaded}
        onReady={handleScriptLoaded}
        onError={() => {
          if (!mounted.current) {
            return;
          }

          onToken(null);
          setFailed(true);
        }}
      />

      <div ref={container} />

      {failed && (
        <p
          role="alert"
          className="mt-2 text-sm text-red-800"
        >
          {t('failed')}
        </p>
      )}

      {failed && ready && (
        <button
          type="button"
          className="mt-2 text-sm font-semibold text-[#1A669A] underline"
          onClick={() => {
            onToken(null);
            setFailed(false);
            setAttempt((value) => value + 1);
          }}
        >
          {t('retry')}
        </button>
      )}

      {!ready && (
        <p
          role="status"
          className="text-sm text-gray-600"
        >
          {t('loading')}
        </p>
      )}
    </div>
  );
}