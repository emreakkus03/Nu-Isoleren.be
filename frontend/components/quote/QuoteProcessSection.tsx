import { getTranslations } from 'next-intl/server';

interface QuoteProcessSectionProps {
  locale: string;
}

const STEPS = ['request', 'contact', 'proposal'] as const;

export default async function QuoteProcessSection({
  locale,
}: QuoteProcessSectionProps) {
  const t = await getTranslations({
    locale,
    namespace: 'QuotePage.process',
  });

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('badge')}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] max-md:text-balance max-md:[overflow-wrap:anywhere]">
            {t('title')}
          </h2>

          <p className="mt-5 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="relative mt-12 md:mt-16">
          <div className="hidden md:block absolute top-7 left-[16.666%] right-[16.666%] h-px bg-gray-200" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {STEPS.map((step, index) => (
              <div
                key={step}
                className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center"
              >
                <div className="relative z-10 flex items-center justify-center w-14 h-14 shrink-0 rounded-full bg-white border-2 border-[#C82024] text-[#C82024] font-extrabold text-base shadow-sm">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="md:mt-6">
                  <h3 className="text-lg md:text-xl font-extrabold text-gray-950 tracking-tight">
                    {t(`steps.${step}.title`)}
                  </h3>

                  <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed max-w-sm md:mx-auto">
                    {t(`steps.${step}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}