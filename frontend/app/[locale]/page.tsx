import { getTranslations } from 'next-intl/server';

import Hero from '@/components/home/Hero';
import ServicesSection from '@/components/home/ServicesSection';
import PriceCalculatorTeaser from '@/components/home/PriceCalculatorTeaser';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ProjectsSection from '@/components/home/ProjectsSection';
import FaqHomeSection from '@/components/home/HomeFaqSection';
import HomeServiceAreas from '@/components/home/HomeServiceAreas';
import CtaBanner from '@/components/common/CtaBanner';

import { getCities } from '@/lib/cities';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  
  const t = await getTranslations({ locale, namespace: 'Seo.home' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function HomePage() {
  const { all: featuredCities } = await getCities(true);

  return (
    <main>
      <Hero />
      <ServicesSection />
      <PriceCalculatorTeaser />
      <WhyChooseUs />
      <ProjectsSection />
      <HomeServiceAreas cities={featuredCities} />
      <FaqHomeSection />
      <CtaBanner />
    </main>
  );
}