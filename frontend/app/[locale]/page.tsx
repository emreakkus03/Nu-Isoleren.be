import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import Hero from '@/components/home/Hero';
import ServicesSection from '@/components/home/ServicesSection';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  
  const t = await getTranslations({ locale, namespace: 'Seo.home' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function HomePage() {
  const t = useTranslations('Hero');

  return (
    <main>
      <Hero />
      <ServicesSection />
    </main>
  );
}