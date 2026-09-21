import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

interface QuoteHeroProps {
  locale: string;
  children: React.ReactNode;
}

export default async function QuoteHero({
  locale,
  children,
}: QuoteHeroProps) {
  const t = await getTranslations({
    locale,
    namespace: 'QuotePage.hero',
  });

  return (
    <section className="w-full bg-white py-12 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 md:gap-6 lg:pt-2">
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
              {t('badge')}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.2] max-md:text-balance max-md:[overflow-wrap:anywhere]">
              {t('title')}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-lg">
              {t('description')}
            </p>

            <ul className="flex flex-col items-start gap-2.5 pt-1 text-left">
              <li className="flex items-center gap-2.5 text-xs sm:text-sm md:text-base font-medium text-gray-800">
                <Image
                  src="/icons/red-check.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="shrink-0"
                />
                <span>{t('points.free')}</span>
              </li>

              <li className="flex items-center gap-2.5 text-xs sm:text-sm md:text-base font-medium text-gray-800">
                <Image
                  src="/icons/red-check.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="shrink-0"
                />
                <span>{t('points.personal')}</span>
              </li>

              <li className="flex items-center gap-2.5 text-xs sm:text-sm md:text-base font-medium text-gray-800">
                <Image
                  src="/icons/red-check.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="shrink-0"
                />
                <span>{t('points.areas')}</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}