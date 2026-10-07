'use client';

import Script from 'next/script';
import { useConsent } from './useConsent';

export default function GoogleAnalytics({
  id,
}: {
  id: string;
}) {
  const { ready } = useConsent();

  if (!ready) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />

      <Script id="nu-google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(id)});
        `}
      </Script>
    </>
  );
}