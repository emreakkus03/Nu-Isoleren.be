import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const SERVICES = [
  {
    key: 'cavityWall',
    serviceHref: '/services',
    calculatorHref:
      '/prices',
  },
  {
    key: 'roof',
    serviceHref: '/services',
    calculatorHref:
      '/prices',
  },
  {
    key: 'crepi',
    serviceHref: '/services',
    calculatorHref:
      '/prices',
  },
  {
    key: 'facadeCleaning',
    serviceHref: '/services',
    calculatorHref:
      '/prices',
  },
  {
    key: 'hydrofuge',
    serviceHref: '/services',
    calculatorHref:
      '/prices',
  },
  {
    key: 'cavityRemoval',
    serviceHref: '/services',
    calculatorHref:
      '/prices',
  },
  {
    key: 'risingDamp',
    serviceHref: '/services',
    calculatorHref:
      '/prices',
  },
] as const;

export default function ServicePrices() {
  const t = useTranslations('PricesPage.servicePrices');

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-md:text-center max-w-3xl mb-10 md:mb-14">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
            {t('badge')}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
            {t('title')}
          </h2>

          <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl max-md:text-center">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {SERVICES.map((service) => (
            <article
              key={service.key}
              className="border border-gray-200 rounded-2xl p-6 sm:p-7 flex flex-col"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-950 tracking-tight">
                  {t(`${service.key}.title`)}
                </h3>

                <span className="shrink-0 text-lg sm:text-xl font-extrabold text-[#C82024]">
                  {t(`${service.key}.price`)}
                </span>
              </div>

              <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                {t(`${service.key}.description`)}
              </p>

              <div className="mt-auto pt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href={service.calculatorHref}
                  className="inline-flex items-center gap-2 text-[#C82024] hover:text-red-800 font-bold text-sm sm:text-base transition group"
                >
                  <span>{t('calculate')}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>

                <Link
                  href={service.serviceHref}
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-950 font-semibold text-sm sm:text-base transition"
                >
                  {t('service')}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-7 text-xs sm:text-sm text-gray-500 leading-relaxed max-w-3xl">
          {t('disclaimer')}
        </p>
      </div>
    </section>
  );
}