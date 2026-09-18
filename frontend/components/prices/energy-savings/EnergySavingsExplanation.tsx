import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

interface EnergySavingsExplanationProps {
  locale: string;
}

export default async function EnergySavingsExplanation({
  locale,
}: EnergySavingsExplanationProps) {
  const t = await getTranslations({
    locale,
    namespace: 'EnergySavingsPage.explanation',
  });

  const steps = [
    {
      number: '01',
      title: t('steps.current.title'),
      description: t('steps.current.description'),
    },
    {
      number: '02',
      title: t('steps.improved.title'),
      description: t('steps.improved.description'),
    },
    {
      number: '03',
      title: t('steps.result.title'),
      description: t('steps.result.description'),
    },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="max-w-xl">
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
              {t('badge')}
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              {t('title')}
            </h2>

            <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
              {t('description')}
            </p>
          </div>

          <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] overflow-hidden rounded-2xl">
            <Image
              src="/images/energy-savings/gevelisolatie-eps.jpg"
              alt="Gevelisolatie met isolatieplaten tijdens renovatiewerken aan een woning"
              fill
              className="object-cover object-[center_58%]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7"
            >
              <span className="text-sm font-extrabold text-[#1A669A]">
                {step.number}
              </span>

              <h3 className="mt-4 text-xl font-extrabold text-gray-950">
                {step.title}
              </h3>

              <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-[#F8F9FA] p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-950">
            {t('factors.title')}
          </h3>

          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            {t('factors.description')}
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {[
              'building',
              'year',
              'insulation',
              'surface',
              'heating',
              'consumption',
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3"
              >
                <span className="mt-2 w-2 h-2 shrink-0 rounded-full bg-[#1A669A]" />

                <p className="text-sm sm:text-base font-semibold text-gray-800">
                  {t(`factors.items.${item}`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 max-w-4xl text-sm text-gray-500 leading-relaxed">
          {t('notice')}
        </p>
      </div>
    </section>
  );
}