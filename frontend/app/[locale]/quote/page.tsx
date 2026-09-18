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
}

interface Service {
  id: number;
  name: string;
}

async function getServices(locale: string): Promise<Service[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured.');
  }

  const response = await fetch(
    `${apiUrl}/services?locale=${locale}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Could not load services.');
  }

  const result = await response.json();

  const services = Array.isArray(result)
    ? result
    : result.data ?? [];

  return services.map(
    (service: {
      id: number;
      name: string;
    }) => ({
      id: service.id,
      name: service.name,
    })
  );
}

export async function generateMetadata({
  params,
}: QuotePageProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'QuotePage.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function QuotePage({
  params,
}: QuotePageProps) {
  const { locale } = await params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured.');
  }

  const services = await getServices(locale);

  return (
    <main className="w-full min-h-screen bg-white">
      <QuoteHero locale={locale}>
        <QuoteForm
          services={services}
          locale={locale}
          apiUrl={apiUrl}
        />
      </QuoteHero>
      <QuoteTrustSection locale={locale} />
      <QuoteProcessSection locale={locale} />
    </main>
  );
}