import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const SERVICE_SLUGS = {
  nl: 'spouwmuurisolatie',
  fr: 'isolation-murs-creux',
  en: 'cavity-wall-insulation',
} as const;

export default function ServicePrices() {
  const t = useTranslations('PricesPage.servicePrices');
  const locale = useLocale();
  const currentLocale = locale === 'fr' || locale === 'en' ? locale : 'nl';

  return (
    <section id="spouwmuurisolatie-prijs" className="w-full bg-white py-16 md:py-24 scroll-mt-28">
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

        <article
          className="max-w-3xl border border-gray-200 rounded-2xl p-6 sm:p-7 flex flex-col"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6">
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-950 tracking-tight">
              {t('cavityWall.title')}
            </h3>

            <span className="shrink-0 text-lg sm:text-xl font-extrabold text-[#C82024]">
              {t('cavityWall.price')}
            </span>
          </div>

          <div className="mt-auto pt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 text-[#C82024] hover:text-red-800 font-bold text-sm sm:text-base transition group"
            >
              <span>{t('calculate')}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>

            <Link
              href={{
                pathname: '/services/[slug]',
                params: { slug: SERVICE_SLUGS[currentLocale] },
              }}
              className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-950 font-semibold text-sm sm:text-base transition"
            >
              {t('service')}
            </Link>
          </div>
        </article>

        <div className="mt-8 max-w-3xl">
          <h3 className="text-base sm:text-lg font-bold text-gray-950">
            {t('otherWorks.title')}
          </h3>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            {t('otherWorks.description')}
          </p>
          <Link
            href="/quote"
            className="mt-4 inline-flex items-center gap-2 text-[#C82024] hover:text-red-800 font-bold text-sm sm:text-base transition"
          >
            {t('otherWorks.cta')}
            <span>&rarr;</span>
          </Link>
        </div>

        <p className="mt-7 text-xs sm:text-sm text-gray-500 leading-relaxed max-w-3xl">
          {t('disclaimer')}
        </p>
      </div>
    </section>
  );
}