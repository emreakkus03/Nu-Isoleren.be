import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function PriceGrants() {
  const t = useTranslations('PricesPage.grants');

  return (
    <section className="w-full bg-[#F8F9FA] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
              {t('badge')}
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              {t('title')}
            </h2>
          </div>

          <div className="lg:col-span-6">
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {t('description')}
            </p>

            <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              {t('descriptionSecondary')}
            </p>

            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#C82024] hover:text-red-800 font-bold text-sm sm:text-base transition group"
              >
                <span>{t('cta')}</span>

                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}