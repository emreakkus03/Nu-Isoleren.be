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

  return (
    <html lang={locale}>
      <body suppressHydrationWarning>
        <AlternateLinksProvider>
          <NextIntlClientProvider messages={messages}>
            <JsonLd data={await businessSchema()} />
            <CookieConsent />
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