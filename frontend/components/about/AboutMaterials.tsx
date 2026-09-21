import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const ITEM_KEYS = ['materials', 'innovation'] as const;

export default function AboutMaterials() {
  const t = useTranslations('AboutPage.materials');

  return (
    <section className="w-full bg-[#F8F9FA] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-[5/4] lg:aspect-auto lg:h-[560px] overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src="/images/about/materials.jpeg"
                alt={t('imageAlt')}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
              {t('badge')}
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
              {t('title')}
            </h2>

            <div className="mt-6 flex flex-col gap-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              <p>{t('description')}</p>

              <p>{t('descriptionSecondary')}</p>
            </div>

            <div className="mt-8 flex flex-col">
              {ITEM_KEYS.map((key, index) => (
                <div
                  key={key}
                  className="flex gap-5 py-5 border-t border-gray-200 first:pt-0 first:border-t-0"
                >
                  <span className="shrink-0 text-sm font-extrabold text-[#C82024] tracking-wider pt-1">
                    0{index + 1}
                  </span>

                  <div>
                    <h3 className="text-lg md:text-xl font-extrabold text-gray-950 tracking-tight">
                      {t(`items.${key}.title`)}
                    </h3>

                    <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                      {t(`items.${key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 max-md:text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-[#C82024] hover:text-red-800 font-bold text-sm sm:text-base transition group"
              >
                <span className="underline underline-offset-4">
                  {t('cta')}
                </span>

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