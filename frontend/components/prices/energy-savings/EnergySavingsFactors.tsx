import { getTranslations } from 'next-intl/server';

interface EnergySavingsFactorsProps {
  locale: string;
}

export default async function EnergySavingsFactors({
  locale,
}: EnergySavingsFactorsProps) {
  const t = await getTranslations({
    locale,
    namespace: 'EnergySavingsPage.factors',
  });

  const factors = [
    'existingInsulation',
    'construction',
    'surface',
    'heating',
    'temperature',
    'behaviour',
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="max-w-xl">
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
              {t('badge')}
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              {t('title')}
            </h2>

            <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
              {t('description')}
            </p>

            <div className="mt-8 rounded-2xl bg-[#F8F9FA] p-6 sm:p-7">
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-950">
                {t('important.title')}
              </h3>

              <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                {t('important.description')}
              </p>
            </div>
          </div>

          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {factors.map((factor, index) => (
              <div
                key={factor}
                className="grid grid-cols-[48px_1fr] gap-4 py-6"
              >
                <span className="text-sm font-extrabold text-[#1A669A] pt-1">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div>
                  <h3 className="text-lg font-extrabold text-gray-950">
                    {t(`items.${factor}.title`)}
                  </h3>

                  <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                    {t(`items.${factor}.description`)}
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