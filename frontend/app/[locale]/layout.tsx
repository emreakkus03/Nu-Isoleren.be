import JsonLd from '@/components/seo/JsonLd';
import { businessSchema } from '@/lib/seo/schema';
import { indexingEnabled } from '@/lib/seo/config';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";

import { AlternateLinksProvider } from '@/context/AlternateLinksContext';

import CookieConsent from '@/components/cookie/CookieConsent';
import GoogleTagManager from '@/components/cookie/GoogleTagManager';
import { validGtmId } from '@/lib/gtm';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';

export function generateMetadata() { return indexingEnabled() ? {} : { robots: { index: false, follow: true } }; }

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();
  const gtmId = validGtmId(process.env.NEXT_PUBLIC_GTM_ID);

  return (
    <html lang={locale}>
      <body suppressHydrationWarning>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              className="hidden invisible"
              title="Google Tag Manager"
            />
          </noscript>
        )}
        <AlternateLinksProvider>
          <NextIntlClientProvider messages={messages}>
            <JsonLd data={await businessSchema()} />
            <CookieConsent />
            {gtmId && <GoogleTagManager id={gtmId} />}
            <Header />
            <FloatingButtons />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer locale={locale} />
          </NextIntlClientProvider>
        </AlternateLinksProvider>
      </body>
    </html>
  );
}