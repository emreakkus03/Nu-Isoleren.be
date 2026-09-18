import { getTranslations } from 'next-intl/server';

interface BrusselsAvailableSupportProps {
  locale: string;
}

export default async function BrusselsAvailableSupport({
  locale,
}: BrusselsAvailableSupportProps) {
  const t = await getTranslations({
    locale,
    namespace: 'BrusselsGrantsPage.support',
  });

  const items = ['ecoreno', 'municipal', 'vat'] as const;

  return (
    <section className="w-full bg-[#F8F9FA] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('badge')}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
            {t('title')}
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="mt-12 border-t border-slate-300">
          {items.map((item, index) => (
            <div
              key={item}
              className="grid grid-cols-1 md:grid-cols-[100px_260px_1fr] gap-3 md:gap-8 py-7 md:py-8 border-b border-slate-300"
            >
              <span className="text-sm font-extrabold text-[#C82024]">
                {String(index + 1).padStart(2, '0')}
              </span>

              <h3 className="text-xl font-extrabold text-gray-950">
                {t(`${item}.title`)}
              </h3>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
                {t(`${item}.description`)}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-gray-500 leading-relaxed max-w-4xl">
          {t('notice')}
        </p>
      </div>
    </section>
  );
}