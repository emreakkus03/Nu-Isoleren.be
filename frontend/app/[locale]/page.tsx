import { pageMetadata } from '@/lib/seo/metadata';
import { getTranslations } from 'next-intl/server';

import Hero from '@/components/home/Hero';
import ServicesSection from '@/components/home/ServicesSection';
import PriceCalculatorTeaser from '@/components/home/PriceCalculatorTeaser';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ProjectsSection from '@/components/home/ProjectsSection';
import FaqHomeSection from '@/components/home/HomeFaqSection';
import HomeServiceAreas from '@/components/home/HomeServiceAreas';
import CtaBanner from '@/components/common/CtaBanner';
import GoogleReviewsSection from '@/components/home/GoogleReviewsSection';

import { getCities } from '@/lib/cities';
import { getServices } from '@/lib/services';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'Seo.home',
  });

  return pageMetadata('/', locale, {
    title: t('title'),
    description: t('description'),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [
    { all: featuredCities },
    services,
    t,
  ] = await Promise.all([
    getCities(true),
    getServices(locale, {
      featuredHome: true,
    }),
    getTranslations({
      locale,
      namespace: 'googleReviews',
    }),
  ]);

  return (
    <main>
      <Hero />

      <ServicesSection />

      <PriceCalculatorTeaser services={services} />

      <WhyChooseUs />

      <ProjectsSection />

      <GoogleReviewsSection
        eyebrow={t('eyebrow')}
        title={t('title')}
        scoreLabel={t('scoreLabel')}
        outOfFiveLabel={t('outOfFive')}
        basedOnLabel={t('basedOn')}
        reviewsLabel={t('reviews')}
        selectionLabel={t('selection')}
        previousLabel={t('previous')}
        nextLabel={t('next')}
      />

      <HomeServiceAreas cities={featuredCities} />

      <FaqHomeSection />

      <CtaBanner />
    </main>
  );
}