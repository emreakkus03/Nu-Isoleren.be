import { getTranslations } from 'next-intl/server';

interface FlandersGrantsApplicationProps {
  locale: string;
}

export default async function FlandersGrantsApplication({
  locale,
}: FlandersGrantsApplicationProps) {
  const t = await getTranslations({
    locale,
    namespace: 'FlandersGrantsPage.application',
  });

  const steps = ['works', 'documents', 'portal', 'followup'] as const;

  return (
    <section className="w-full bg-[#F8F9FA] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
            {t('badge')}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
            {t('title')}
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-md:text-center">
            {t('description')}
          </p>
        </div>

        <div className="mt-12">
          {steps.map((step, index) => (
            <div
              key={step}
              className="grid grid-cols-[48px_1fr] sm:grid-cols-[70px_1fr] gap-4 sm:gap-6 pb-8 last:pb-0"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1A669A] text-sm font-extrabold text-white">
                {index + 1}
              </div>

              <div className="border-b border-slate-200 pb-8 last:border-0">
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-950">
                  {t(`steps.${step}.title`)}
                </h3>

                <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                  {t(`steps.${step}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 border-l-4 border-[#1A669A] pl-5">
          <p className="text-sm sm:text-base font-semibold text-gray-800 leading-relaxed">
            {t('notice')}
          </p>
        </div>
      </div>
    </section>
  );
}