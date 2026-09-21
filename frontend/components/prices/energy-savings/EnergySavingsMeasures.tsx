import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

interface EnergySavingsMeasuresProps {
  locale: string;
}

export default async function EnergySavingsMeasures({
  locale,
}: EnergySavingsMeasuresProps) {
  const t = await getTranslations({
    locale,
    namespace: 'EnergySavingsPage.measures',
  });

  const measures = [
    {
      number: '01',
      title: t('items.cavity.title'),
      description: t('items.cavity.description'),
      suitable: t('items.cavity.suitable'),
    },
    {
      number: '02',
      title: t('items.roof.title'),
      description: t('items.roof.description'),
      suitable: t('items.roof.suitable'),
    },
    {
      number: '03',
      title: t('items.facade.title'),
      description: t('items.facade.description'),
      suitable: t('items.facade.suitable'),
    },
  ];

  return (
    <section className="w-full bg-[#F8F9FA] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
            {t('badge')}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
            {t('title')}
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-md:text-center">
            {t('description')}
          </p>
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {measures.map((measure) => (
            <article
              key={measure.number}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 sm:p-7"
            >
              <span className="text-sm font-extrabold text-[#1A669A]">
                {measure.number}
              </span>

              <h3 className="mt-4 text-xl sm:text-2xl font-extrabold text-gray-950">
                {measure.title}
              </h3>

              <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                {measure.description}
              </p>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-xs font-extrabold tracking-wider text-gray-400 uppercase">
                  {t('suitableLabel')}
                </p>

                <p className="mt-2 text-sm font-semibold text-gray-800 leading-relaxed">
                  {measure.suitable}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 rounded-2xl bg-white border border-gray-200 p-6 sm:p-8">
          <div className="max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-950">
              {t('cta.title')}
            </h3>

            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
              {t('cta.description')}
            </p>
          </div>

          <Link
            href="/services"
            className="shrink-0 inline-flex items-center justify-center rounded-full bg-[#C82024] px-6 py-3 font-bold text-white transition hover:bg-[#A91B1E]"
          >
            {t('cta.button')}
          </Link>
        </div>
      </div>
    </section>
  );
}