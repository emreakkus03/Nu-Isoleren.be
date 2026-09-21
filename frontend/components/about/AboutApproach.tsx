import { useTranslations } from 'next-intl';

const STEP_KEYS = [
  'assessment',
  'proposal',
  'execution',
] as const;

export default function AboutApproach() {
  const t = useTranslations('AboutPage.approach');

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-md:gap-6 lg:gap-12 items-start">
          <div className="lg:col-span-6">
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
              {t('badge')}
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] max-w-2xl max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
              {t('title')}
            </h2>
          </div>

          <div className="lg:col-span-6">
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mt-4 max-md:mt-0">
              {t('description')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-14 mt-14 max-md:mt-10 md:mt-20">
          {STEP_KEYS.map((key, index) => (
            <div
              key={key}
              className="flex flex-col border-t border-gray-200 pt-6"
            >
              <span className="text-sm font-extrabold tracking-wider text-[#C82024]">
                0{index + 1}
              </span>

              <h3 className="mt-4 text-xl md:text-2xl font-extrabold text-gray-950 tracking-tight">
                {t(`steps.${key}.title`)}
              </h3>

              <p className="mt-3 text-sm md:text-base text-gray-600 leading-relaxed">
                {t(`steps.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}