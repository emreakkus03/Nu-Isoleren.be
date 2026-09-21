import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import PricesHero from '@/components/prices/PricesHero';
import PriceTools from '@/components/prices/PriceTools';
import ServicePrices from '@/components/prices/ServicePrices';
import PriceMethodology from '@/components/prices/PriceMethodology';
import PriceExamples from '@/components/prices/PriceExamples';
import PriceGrants from '@/components/prices/PriceGrants';
import PriceFaqSection from '@/components/prices/PriceFaqSection';
import CtaBanner from '@/components/common/CtaBanner';

interface PricesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: PricesPageProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'Seo.prices',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function PricesPage({
  params,
}: PricesPageProps) {
  const { locale } = await params;

  return (
    <main className="w-full min-h-screen bg-white overflow-x-clip">
      <PricesHero locale={locale} />
      <PriceTools />
      <ServicePrices />
      <PriceExamples />
      <PriceMethodology />
      <PriceGrants />
      <PriceFaqSection />
      <CtaBanner />
    </main>
  );
}