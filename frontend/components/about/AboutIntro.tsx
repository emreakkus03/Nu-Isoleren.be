import { useTranslations } from 'next-intl';

const ITEM_KEYS = [
  'experience',
  'atg',
  'personal',
  'finish',
] as const;

export default function AboutIntro() {
  const t = useTranslations('AboutPage.intro');

  return (
    <section className="w-full bg-[#F8F9FA] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-6">
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
              {t('badge')}
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              {t('title')}
            </h2>

            <div className="mt-6 flex flex-col gap-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              <p>{t('description')}</p>
              <p>{t('descriptionSecondary')}</p>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ITEM_KEYS.map((key) => (
              <div
                key={key}
                className="bg-white border border-gray-200 rounded-xl px-5 py-5 sm:px-6 sm:py-6"
              >
                <div className="w-8 h-1 rounded-full bg-[#C82024] mb-4" />

                <h3 className="text-lg md:text-xl font-extrabold text-gray-950 tracking-tight">
                  {t(`items.${key}.title`)}
                </h3>

                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {t(`items.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}