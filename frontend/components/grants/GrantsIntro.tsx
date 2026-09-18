import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

interface GrantsIntroProps {
  locale: string;
}

export default async function GrantsIntro({
  locale,
}: GrantsIntroProps) {
  const t = await getTranslations({
    locale,
    namespace: 'GrantsPage.intro',
  });

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[460px] overflow-hidden rounded-2xl">
            <Image
              src="/images/areas-city-hero.jpg"
              alt={t('imageAlt')}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="max-w-xl">
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
              {t('badge')}
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              {t('title')}
            </h2>

            <div className="mt-6 flex flex-col gap-4">
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {t('description')}
              </p>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {t('descriptionSecond')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}