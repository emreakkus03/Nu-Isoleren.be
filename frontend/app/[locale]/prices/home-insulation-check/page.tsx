import { pageMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import HomeInsulationCheckHero from '@/components/prices/home-insulation-check/HomeInsulationCheckHero';
import HomeInsulationCheck from '@/components/prices/home-insulation-check/HomeInsulationCheck';
import HomeCheckAdvice from '@/components/prices/home-insulation-check/HomeCheckAdvice';
import HomeInsulationCheckFaqSection from '@/components/prices/home-insulation-check/HomeInsulationCheckFaqSection';
import CtaBanner from '@/components/common/CtaBanner';

interface HomeInsulationCheckPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: HomeInsulationCheckPageProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'HomeInsulationCheckPage.metadata',
  });

  return pageMetadata('/prices/home-insulation-check', locale, {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
  });
}

export default async function HomeInsulationCheckPage({
  params,
}: HomeInsulationCheckPageProps) {
  const { locale } = await params;

  return (
    <main className="w-full min-h-screen bg-white overflow-x-clip">
      <HomeInsulationCheckHero locale={locale} />
      <HomeInsulationCheck />
      <HomeCheckAdvice locale={locale} />
      <HomeInsulationCheckFaqSection />
      <CtaBanner />
    </main>
  );
}