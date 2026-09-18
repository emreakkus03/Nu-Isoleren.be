import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

interface HomeCheckAdviceProps {
  locale: string;
}

export default async function HomeCheckAdvice({
  locale,
}: HomeCheckAdviceProps) {
  const t = await getTranslations({
    locale,
    namespace: 'HomeInsulationCheckPage.advice',
  });

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[440px] overflow-hidden rounded-2xl">
              <Image
                src="/images/home-check/woning-na-renovatie.jpg"
                alt={t('imageAlt')}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

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

            <div className="mt-7 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="mt-2 w-2 h-2 shrink-0 rounded-full bg-[#1A669A]" />

                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {t('points.check')}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-2 w-2 h-2 shrink-0 rounded-full bg-[#1A669A]" />

                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {t('points.solution')}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-2 w-2 h-2 shrink-0 rounded-full bg-[#1A669A]" />

                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {t('points.inspection')}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#F8F9FA] p-5 sm:p-6">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t('notice')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}