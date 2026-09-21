import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface AboutHeroProps {
  locale: string;
}

export default async function AboutHero({
  locale,
}: AboutHeroProps) {
  const [t, tBreadcrumb] = await Promise.all([
    getTranslations({
      locale,
      namespace: 'AboutPage',
    }),
    getTranslations({
      locale,
      namespace: 'Breadcrumbs',
    }),
  ]);

  const breadcrumbs = [
    {
      label: tBreadcrumb('home'),
      href: '/',
    },
    {
      label: t('hero.breadcrumb'),
    },
  ];

  return (
    <section className="w-full bg-white page-header-start pb-10 sm:pb-14 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="page-header-content lg:col-span-5 flex flex-col items-start">
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
              {t('hero.badge')}
            </span>

            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.1] max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
              {t('hero.title')}
            </h1>

            <div className="mt-6 flex flex-col gap-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              <p>{t('hero.description')}</p>

              <p>{t('hero.descriptionSecondary')}</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src="/images/about/nu-isoleren-wagen.jpg"
                alt={t('hero.imageAlt')}
                fill
                priority
                quality={90}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}