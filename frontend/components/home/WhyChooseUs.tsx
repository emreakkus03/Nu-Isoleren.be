
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const FEATURE_KEYS = ['expertise', 'cleanWork', 'quality'] as const;

const FEATURE_ICONS: Record<(typeof FEATURE_KEYS)[number], string> = {
  expertise: '/icons/badge-check.svg',
  cleanWork: '/icons/check-large.svg',
  quality: '/icons/target-circle.svg',
};

export default function WhyChooseUs() {
  const t = useTranslations('WhyChooseUs');

  return (
    <section className="w-full bg-white py-12 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 items-start gap-6 pb-10 md:gap-8 md:pb-20 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col items-center gap-3 text-center lg:col-span-6 lg:items-start lg:gap-4 lg:text-left">
            <span className="text-base font-extrabold uppercase tracking-wider text-[#1A669A] md:text-lg">
              {t('badge')}
            </span>

            <h2 className="text-balance text-[28px] font-extrabold leading-[1.15] tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
              {t('title')}
            </h2>
          </div>

          <div className="flex flex-col gap-5 text-sm leading-relaxed text-gray-700 sm:text-base lg:col-span-6">
            <p className="text-left">
              {t.rich('description', {
                highlight: (chunks) => (
                  <span className="font-bold text-[#1A669A]">
                    {chunks}
                  </span>
                ),
              })}
            </p>

            <div className="flex justify-start">
              <Link
                href="/about"
                className="group inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#C82024] transition hover:text-red-800 sm:text-base"
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

        <div className="mt-2 grid grid-cols-1 gap-3 md:mt-8 md:grid-cols-3 md:gap-8 lg:gap-12">
          {FEATURE_KEYS.map((key) => (
            <div
              key={key}
              className="flex flex-row items-start gap-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 md:flex-col md:items-center md:gap-4 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:text-center"
            >
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center md:h-20 md:w-20">
                <Image
                  src={FEATURE_ICONS[key]}
                  alt=""
                  aria-hidden="true"
                  width={
                    key === 'expertise'
                      ? 406
                      : key === 'cleanWork'
                        ? 507
                        : 327
                  }
                  height={
                    key === 'expertise'
                      ? 341
                      : key === 'cleanWork'
                        ? 475
                        : 327
                  }
                  className={`h-12 w-12 object-contain md:h-auto ${
                    key === 'cleanWork'
                      ? 'md:w-24 md:scale-150'
                      : 'md:w-[72px]'
                  }`}
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2 md:items-center md:gap-4">
                <h3 className="text-base font-bold leading-snug tracking-tight text-gray-950 sm:text-lg md:text-xl lg:text-2xl">
                  {t(`features.${key}.title`)}
                </h3>

                <p className="max-w-sm text-left text-sm leading-relaxed text-gray-600 md:text-center md:text-base">
                  {t(`features.${key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
