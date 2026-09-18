import { getTranslations } from 'next-intl/server';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface HomeInsulationCheckHeroProps {
  locale: string;
}

export default async function HomeInsulationCheckHero({
  locale,
}: HomeInsulationCheckHeroProps) {
  const [t, tBreadcrumb] = await Promise.all([
    getTranslations({
      locale,
      namespace: 'HomeInsulationCheckPage.hero',
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
      label: t('pricesBreadcrumb'),
      href: '/prices',
    },
    {
      label: t('breadcrumb'),
    },
  ];

  return (
    <section className="w-full bg-white pt-14 sm:pt-16 md:pt-20 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="max-w-4xl">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('badge')}
          </span>

          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.08]">
            {t('title')}
          </h1>

          <p className="mt-6 max-w-3xl text-base sm:text-lg text-gray-600 leading-relaxed">
            {t('description')}
          </p>

          <p className="mt-3 max-w-3xl text-sm sm:text-base text-[#C82024] leading-relaxed">
            {t('disclaimer')}
          </p>

          <div className="mt-8">
            <a
              href="#home-insulation-check"
              className="inline-flex items-center justify-center rounded-full bg-[#C82024] px-7 py-3.5 text-sm sm:text-base font-bold text-white transition hover:bg-[#A91B1E]"
            >
              {t('cta')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}