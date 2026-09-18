import { getTranslations } from 'next-intl/server';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface PricesHeroProps {
  locale: string;
}

export default async function PricesHero({
  locale,
}: PricesHeroProps) {
  const [t, tBreadcrumb] = await Promise.all([
    getTranslations({
      locale,
      namespace: 'PricesPage.hero',
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
      label: t('breadcrumb'),
    },
  ];

  return (
    <section className="w-full bg-white py-10 sm:py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-10 max-w-4xl">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('badge')}
          </span>

          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.08]">
            {t('title')}
          </h1>

          <p className="mt-6 max-w-3xl text-base sm:text-lg text-gray-600 leading-relaxed">
            {t('description')}
          </p>

          <div className="mt-8">
            <a
              href="#calculatings"
              className="inline-flex items-center gap-2.5 bg-[#C82024] hover:bg-red-800 text-white text-sm sm:text-base font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition shadow-lg hover:shadow-xl active:scale-95 group"
            >
              <span>{t('cta')}</span>

              <svg
                className="w-4 h-4 transition-transform group-hover:translate-y-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 5v14m0 0l6-6m-6 6l-6-6"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}