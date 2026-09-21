import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

interface WalloniaGrantsEligibilityProps {
  locale: string;
}

export default async function WalloniaGrantsEligibility({
  locale,
}: WalloniaGrantsEligibilityProps) {
  const t = await getTranslations({
    locale,
    namespace: 'WalloniaGrantsPage.eligibility',
  });

  return (
    <section className="w-full bg-[#F8F9FA] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[460px] overflow-hidden rounded-2xl">
            <Image
              src="/images/grants/wallonia/wallonia-energy-renovation.jpg"
              alt={t('imageAlt')}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div>
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
              {t('badge')}
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
              {t('title')}
            </h2>

            <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-md:text-center">
              {t('description')}
            </p>

            <div className="mt-7 flex flex-col gap-4">
              {['location', 'age', 'usage', 'contractor', 'audit'].map(
                (item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1A669A]" />

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {t(`points.${item}`)}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}