import { getTranslations } from 'next-intl/server';

interface BrusselsGrantsStatusProps {
  locale: string;
}

export default async function BrusselsGrantsStatus({
  locale,
}: BrusselsGrantsStatusProps) {
  const t = await getTranslations({
    locale,
    namespace: 'BrusselsGrantsPage.status',
  });

  return (
    <section className="w-full bg-[#F8F9FA] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.45fr_0.55fr] gap-8 lg:gap-16">
          <div>
            <span className="text-sm sm:text-base font-extrabold tracking-wider text-[#C82024] uppercase">
              {t('badge')}
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              {t('title')}
            </h2>
          </div>

          <div>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {t('description')}
            </p>

            <div className="mt-7 border-l-4 border-[#C82024] pl-5">
              <p className="text-base sm:text-lg font-bold text-gray-950 leading-relaxed">
                {t('highlight')}
              </p>
            </div>

            <p className="mt-6 text-sm text-gray-500 leading-relaxed">
              {t('notice')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}