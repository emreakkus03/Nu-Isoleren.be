import { pageMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import WalloniaGrantsHero from '@/components/grants/wallonia/WalloniaGrantsHero';
import WalloniaGrantsTransition from '@/components/grants/wallonia/WalloniaGrantsTransition';
import WalloniaCurrentPremiums from '@/components/grants/wallonia/WalloniaCurrentPremiums';
import WalloniaGrantsEligibility from '@/components/grants/wallonia/WalloniaGrantsEligibility';
import WalloniaNewRegime from '@/components/grants/wallonia/WalloniaNewRegime';
import WalloniaRenovationLoans from '@/components/grants/wallonia/WalloniaRenovationLoans';
import WalloniaGrantsApplication from '@/components/grants/wallonia/WalloniaGrantsApplication';
import WalloniaGrantsSources from '@/components/grants/wallonia/WalloniaGrantsSources';
import CtaBanner from '@/components/common/CtaBanner';


interface WalloniaGrantsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: WalloniaGrantsPageProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'WalloniaGrantsPage.metadata',
  });

  return pageMetadata('/grants/wallonia', locale, {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
  });
}

export default async function WalloniaGrantsPage({
  params,
}: WalloniaGrantsPageProps) {
  const { locale } = await params;

  return (
    <main className="w-full min-h-screen bg-white overflow-x-clip">
      <WalloniaGrantsHero locale={locale} />
      <WalloniaGrantsTransition locale={locale} />
      <WalloniaCurrentPremiums locale={locale} />
      <WalloniaGrantsEligibility locale={locale} />
      <WalloniaNewRegime locale={locale} />
      <WalloniaRenovationLoans locale={locale} />
      <WalloniaGrantsApplication locale={locale} />
      <WalloniaGrantsSources locale={locale} />
        <CtaBanner />
      
    </main>
  );
}