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
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pb-16 md:pb-20">
          <div className="lg:col-span-6 flex flex-col gap-3 md:gap-4">
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
              {t('badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              {t('title')}
            </h2>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-5 text-gray-700 text-sm sm:text-base leading-relaxed">
            <p>
              {t.rich('description', {
                highlight: (chunks) => (
                  <span className="font-bold text-[#1A669A]">{chunks}</span>
                ),
              })}
            </p>

            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#C82024] hover:text-red-800 font-bold text-sm sm:text-base transition group"
              >
                <span className="underline underline-offset-4">{t('cta')}</span>
                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 mt-4 md:mt-8">
          {FEATURE_KEYS.map((key) => (
            <div key={key} className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 relative flex items-center justify-center shrink-0">
                <Image
                  src={FEATURE_ICONS[key]}
                  alt={t(`features.${key}.title`)}
                  width={key === 'cleanWork' ? 96 : 72}
                  height={key === 'cleanWork' ? 96 : 72}
                  className={`object-contain transition-transform ${
                    key === 'cleanWork' ? 'scale-125' : ''
                  }`}
                />
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-950 tracking-tight">
                {t(`features.${key}.title`)}
              </h3>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-sm">
                {t(`features.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}