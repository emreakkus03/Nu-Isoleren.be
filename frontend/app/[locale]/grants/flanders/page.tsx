import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import FlandersGrantsHero from '@/components/grants/flanders/FlandersGrantsHero';
import FlandersGrantsUpdate from '@/components/grants/flanders/FlandersGrantsUpdate';
import FlandersGrantsIntro from '@/components/grants/flanders/FlandersGrantsIntro';
import FlandersGrantsEligibility from '@/components/grants/flanders/FlandersGrantsEligibility';
import FlandersEligibleWorks from '@/components/grants/flanders/FlandersEligibleWorks';
import FlandersGrantsApplication from '@/components/grants/flanders/FlandersGrantsApplication';
import FlandersGrants2027 from '@/components/grants/flanders/FlandersGrants2027';
import CtaBanner from '@/components/common/CtaBanner';

interface FlandersGrantsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: FlandersGrantsPageProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'FlandersGrantsPage.metadata',
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

export default async function FlandersGrantsPage({
  params,
}: FlandersGrantsPageProps) {
  const { locale } = await params;

  return (
    <main className="w-full min-h-screen bg-white overflow-x-clip">
        <FlandersGrantsHero locale={locale} />
        <FlandersGrantsUpdate locale={locale} />
        <FlandersGrantsIntro locale={locale} />
        <FlandersGrantsEligibility locale={locale} />
        <FlandersEligibleWorks locale={locale} />
        <FlandersGrantsApplication locale={locale} />
        <FlandersGrants2027 locale={locale} />
        <CtaBanner />
    </main>
  );
}