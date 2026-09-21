import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const EXAMPLES = [
  'cavityWall',
  'roof',
  'crepi',
  'facadeCleaning',
  'hydrofuge',
  'cavityRemoval',
  'risingDamp',
] as const;

export default function PriceExamples() {
  const t = useTranslations('PricesPage.examples');

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-md:text-center max-w-3xl mb-10 md:mb-12">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
            {t('badge')}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
            {t('title')}
          </h2>

          <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed max-md:text-center">
            {t('description')}
          </p>
        </div>

        <div className="border-t border-gray-200">
          {EXAMPLES.map((key) => (
            <div
              key={key}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 py-5 border-b border-gray-200 items-center"
            >
              <div className="sm:col-span-5">
                <h3 className="text-base sm:text-lg font-bold text-gray-950">
                  {t(`${key}.title`)}
                </h3>
              </div>

              <div className="sm:col-span-3">
                <span className="text-sm sm:text-base text-gray-600">
                  {t(`${key}.example`)}
                </span>
              </div>

              <div className="sm:col-span-4 sm:text-right">
                <span className="text-base sm:text-lg font-extrabold text-[#C82024]">
                  {t(`${key}.price`)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#C82024] hover:text-red-800 font-bold text-sm sm:text-base transition group"
          >
            <span>{t('cta')}</span>

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>

          <span className="text-xs sm:text-sm text-gray-500">
            {t('disclaimer')}
          </span>
        </div>
      </div>
    </section>
  );
}