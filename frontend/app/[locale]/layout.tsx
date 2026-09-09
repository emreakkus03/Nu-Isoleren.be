import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";

import { AlternateLinksProvider } from '@/context/AlternateLinksContext';

import Header from '@/components/layout/Header';
import FloatingButtons from '@/components/layout/FloatingButtons';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body suppressHydrationWarning>
        <AlternateLinksProvider>
          <NextIntlClientProvider messages={messages}>
            <Header />
            <FloatingButtons />
            <main className="min-h-screen">
                {children}
            </main>
          </NextIntlClientProvider>
        </AlternateLinksProvider>
      </body>
    </html>
  );
}