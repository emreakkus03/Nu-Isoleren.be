import { pageMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import EpcHero from '@/components/prices/epc/EpcHero';
import EpcCalculator from '@/components/prices/epc/EpcCalculator';
import EpcExplanation from "@/components/prices/epc/EpcExplanation";
import EpcLabels from "@/components/prices/epc/EpcLabels";
import EpcImprovements from "@/components/prices/epc/EpcImprovements";
import EpcIndicativeInfo from "@/components/prices/epc/EpcIndicativeInfo";
import EpcFaqSection from '@/components/prices/epc/EpcFaqSection';
import CtaBanner from '@/components/common/CtaBanner';

interface EpcPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: EpcPageProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'Seo.epcCalculator',
  });

  return pageMetadata('/prices/epc-calculator', locale, {
    title: t('title'),
    description: t('description'),
  });
}

export default async function EpcPage({
  params,
}: EpcPageProps) {
  const { locale } = await params;

  return (
    <main className="w-full min-h-screen bg-white overflow-x-clip">
      <EpcHero locale={locale} />
      <EpcCalculator />
      <EpcExplanation locale={locale} />
      <EpcLabels />
      <EpcImprovements locale={locale} />
      <EpcIndicativeInfo locale={locale} />
      <EpcFaqSection />
      <CtaBanner />
    </main>
  );
}