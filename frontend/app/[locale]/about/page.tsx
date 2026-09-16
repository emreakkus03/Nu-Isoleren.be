import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import AboutHero from '@/components/about/AboutHero';
import AboutIntro from '@/components/about/AboutIntro';
import AboutApproach from '@/components/about/AboutApproach';
import AboutMaterials from '@/components/about/AboutMaterials';
import AboutProjects from '@/components/about/AboutProjects';
import CtaBanner from '@/components/common/CtaBanner';

interface AboutPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'Seo.about',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function AboutPage({
  params,
}: AboutPageProps) {
  const { locale } = await params;

  return (
    <main className="w-full min-h-screen bg-white overflow-x-clip">
      <AboutHero locale={locale} />
       <AboutIntro />
       <AboutApproach />
       <AboutMaterials />
       <AboutProjects />
        <CtaBanner />
    </main>
  );
}