'use client';

import Script from 'next/script';
import { useConsent } from './useConsent';

export default function GoogleTagManager({ id }: { id: string }) {
  const { ready } = useConsent();
  if (!ready) return null;

  return (
    <Script id="nu-google-tag-manager" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(id)});`}
    </Script>
  );
}
