import { getTranslations } from 'next-intl/server';

interface QuoteTrustSectionProps {
  locale: string;
}

const TRUST_ITEMS = [
  'free',
  'personal',
  'professional',
  'quality',
] as const;

export default async function QuoteTrustSection({
  locale,
}: QuoteTrustSectionProps) {
  const t = await getTranslations({
    locale,
    namespace: 'QuotePage.trust',
  });

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

            <p className="mt-6 text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
              {t('description')}
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item}
                className="bg-white border border-gray-200 rounded-xl px-5 py-5 sm:px-6 sm:py-6"
              >
                <div className="w-8 h-1 rounded-full bg-[#C82024] mb-4" />

                <h3 className="text-lg md:text-xl font-extrabold text-gray-950 tracking-tight">
                  {t(`items.${item}.title`)}
                </h3>

                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {t(`items.${item}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}