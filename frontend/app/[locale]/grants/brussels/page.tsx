import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import BrusselsGrantsHero from '@/components/grants/brussels/BrusselsGrantsHero';
import BrusselsGrantsStatus from '@/components/grants/brussels/BrusselsGrantsStatus';
import BrusselsRenolutionIntro from '@/components/grants/brussels/BrusselsRenolutionIntro';
import BrusselsAvailableSupport from '@/components/grants/brussels/BrusselsAvailableSupport';
import BrusselsEcorenoSection from '@/components/grants/brussels/BrusselsEcorenoSection';
import BrusselsGrants2027 from '@/components/grants/brussels/BrusselsGrants2027';
import BrusselsGrantsSources from '@/components/grants/brussels/BrusselsGrantsSources';
import CtaBanner from '@/components/common/CtaBanner';


interface BrusselsGrantsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: BrusselsGrantsPageProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'BrusselsGrantsPage.metadata',
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

export default async function BrusselsGrantsPage({
  params,
}: BrusselsGrantsPageProps) {
  const { locale } = await params;

  return (
    <main className="w-full min-h-screen bg-white overflow-x-clip">
      <BrusselsGrantsHero locale={locale} />
      <BrusselsGrantsStatus locale={locale} />
      <BrusselsRenolutionIntro locale={locale} />
      <BrusselsAvailableSupport locale={locale} />
      <BrusselsEcorenoSection locale={locale} />
      <BrusselsGrants2027 locale={locale} />
      <BrusselsGrantsSources locale={locale} />
        <CtaBanner />
    </main>
  );
}