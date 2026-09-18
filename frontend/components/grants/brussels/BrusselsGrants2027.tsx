import { getTranslations } from 'next-intl/server';

interface BrusselsGrants2027Props {
  locale: string;
}

export default async function BrusselsGrants2027({
  locale,
}: BrusselsGrants2027Props) {
  const t = await getTranslations({
    locale,
    namespace: 'BrusselsGrantsPage.future',
  });

  return (
    <section className="w-full bg-[#F8F9FA] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className=" py-10 sm:py-12">
          <span className="text-sm sm:text-base font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('badge')}
          </span>

          <div className="mt-3 grid grid-cols-1 lg:grid-cols-[0.43fr_0.57fr] gap-6 lg:gap-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              {t('title')}
            </h2>

            <div>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {t('description')}
              </p>

              <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed">
                {t('descriptionSecond')}
              </p>

              <p className="mt-5 text-sm font-semibold text-[#C82024] leading-relaxed">
                {t('warning')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}