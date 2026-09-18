import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import EnergySavingsHero from '@/components/prices/energy-savings/EnergySavingsHero';
import EnergySavingsCalculator from '@/components/prices/energy-savings/EnergySavingsCalculator';
import EnergySavingsExplanation from '@/components/prices/energy-savings/EnergySavingsExplanation';
import EnergySavingsMeasures from '@/components/prices/energy-savings/EnergySavingsMeasures';
import EnergySavingsFactors from '@/components/prices/energy-savings/EnergySavingsFactors';
import EnergySavingsFaqSection from '@/components/prices/energy-savings/EnergySavingsFaqSection';
import CtaBanner from '@/components/common/CtaBanner';


interface EnergySavingsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: EnergySavingsPageProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'EnergySavingsPage.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
  };
}

export default async function EnergySavingsPage({
  params,
}: EnergySavingsPageProps) {
  const { locale } = await params;

  return (
    <main className="w-full min-h-screen bg-white overflow-x-clip">
      <EnergySavingsHero locale={locale} />
        <EnergySavingsCalculator />
         <EnergySavingsExplanation locale={locale} />
         <EnergySavingsMeasures locale={locale} />
         <EnergySavingsFactors locale={locale} />
         <EnergySavingsFaqSection />
         <CtaBanner />
    </main>
  );
}