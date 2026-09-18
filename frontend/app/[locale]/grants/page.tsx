import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import GrantsHero from '@/components/grants/GrantsHero';
import GrantsIntro from '@/components/grants/GrantsIntro';
import GrantsRegions from '@/components/grants/GrantsRegions';
import GrantsFaqSection from '@/components/grants/GrantsFaqSection';
import CtaBanner from '@/components/common/CtaBanner';

interface GrantsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: GrantsPageProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'GrantsPage.metadata',
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

export default async function GrantsPage({
  params,
}: GrantsPageProps) {
  const { locale } = await params;

  return (
    <main className="w-full min-h-screen bg-white overflow-x-clip">
      <GrantsHero locale={locale} />
      <GrantsIntro locale={locale} />
      <GrantsRegions locale={locale} />
      <GrantsFaqSection />
      <CtaBanner />
    </main>
  );
}