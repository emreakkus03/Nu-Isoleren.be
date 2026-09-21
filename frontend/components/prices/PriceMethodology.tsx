import { useTranslations } from 'next-intl';

const ITEMS = ['ranges', 'project', 'quote'] as const;

export default function PriceMethodology() {
  const t = useTranslations('PricesPage.methodology');

  return (
    <section className="w-full bg-[#F8F9FA] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 max-md:text-center">
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

          <div className="lg:col-span-7">
            {ITEMS.map((key, index) => (
              <div
                key={key}
                className="flex gap-5 sm:gap-7 py-6 border-t border-gray-200 first:border-t-0 first:pt-0"
              >
                <span className="shrink-0 text-sm font-extrabold tracking-wider text-[#C82024] pt-1">
                  0{index + 1}
                </span>

                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-950 tracking-tight">
                    {t(`items.${key}.title`)}
                  </h3>

                  <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                    {t(`items.${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}