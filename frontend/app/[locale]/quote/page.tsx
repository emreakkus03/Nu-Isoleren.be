import { getServices } from '@/lib/services';
import { pageMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import QuoteHero from '@/components/quote/QuoteHero';
import QuoteForm from '@/components/quote/QuoteForm';
import QuoteTrustSection from '@/components/quote/QuoteTrustSection';
import QuoteProcessSection from '@/components/quote/QuoteProcessSection';

interface QuotePageProps {
  params: Promise<{
    locale: string;
  }>;

  searchParams: Promise<{
    services?: string;
    advice?: string;
  }>;
}

export async function generateMetadata({
  params,
}: QuotePageProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'QuotePage.metadata',
  });

  return pageMetadata('/quote', locale, {
    title: t('title'),
    description: t('description'),
  });
}

export default async function QuotePage({
  params,
  searchParams,
}: QuotePageProps) {
  const { locale } = await params;
  const { services: servicesParam } = await searchParams;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured.');
  }

  const services = await getServices(locale);

  const availableServiceIds = new Set(
    services.map((service) => service.id),
  );

  const initialServiceIds = (servicesParam ?? '')
    .split(',')
    .map(Number)
    .filter(
      (id) =>
        Number.isInteger(id) &&
        availableServiceIds.has(id),
    );

  return (
    <main className="w-full min-h-screen bg-white">
      <QuoteHero locale={locale}>
        <QuoteForm
          services={services}
          locale={locale}
          apiUrl={apiUrl}
          initialServiceIds={initialServiceIds}
        />
      </QuoteHero>

      <QuoteTrustSection locale={locale} />
      <QuoteProcessSection locale={locale} />
    </main>
  );
}