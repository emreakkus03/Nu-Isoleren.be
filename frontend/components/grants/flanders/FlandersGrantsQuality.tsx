import { getTranslations } from 'next-intl/server';

interface FlandersGrantsQualityProps {
  locale: string;
}

const GOV_EXTERNAL_WALL =
  'https://www.vlaanderen.be/bouwen-wonen-en-energie/bouwen-en-verbouwen/premies-voor-renovatie/mijn-verbouwpremie/mijn-verbouwpremie-voor-buitenmuur';
const GOV_SIMULATOR =
  'https://www.vlaanderen.be/bouwen-wonen-en-energie/bouwen-en-verbouwen/premies-voor-renovatie/mijn-verbouwpremie';
const ATG_3170 = 'https://api.butgb-ubatc.be/api/public/file/ATG3170N.pdf';

export default async function FlandersGrantsQuality({
  locale,
}: FlandersGrantsQualityProps) {
  const t = await getTranslations({
    locale,
    namespace: 'FlandersGrantsPage.quality',
  });

  const topics = ['atg', 'sts', 'check'] as const;

  return (
    <section
      aria-labelledby="flanders-grants-quality-title"
      className="w-full bg-[#F7F9FB] py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-sm md:text-base font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('badge')}
          </span>
          <h2
            id="flanders-grants-quality-title"
            className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]"
          >
            {t('title')}
          </h2>
          <p className="mt-5 text-base sm:text-lg text-gray-700 leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="mt-9 grid grid-cols-1 md:grid-cols-3 gap-5">
          {topics.map((topic, index) => (
            <div
              key={topic}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A669A]/10 text-sm font-bold text-[#1A669A]">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="mt-5 text-lg font-bold leading-snug text-gray-950">
                {t(`${topic}.title`)}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                {t(`${topic}.description`)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3">
          <a
            href={GOV_EXTERNAL_WALL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center rounded-xl bg-[#1A669A] px-5 py-3 font-semibold text-white transition hover:bg-[#12527D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A669A]"
          >
            {t('official')}
          </a>
          <a
            href={GOV_SIMULATOR}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center rounded-xl border border-[#1A669A] px-5 py-3 font-semibold text-[#1A669A] transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A669A]"
          >
            {t('simulator')}
          </a>
          <a
            href={ATG_3170}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-800 transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A669A]"
          >
            {t('atgDocument')}
          </a>
        </div>

        <p className="mt-6 max-w-4xl text-xs sm:text-sm text-gray-500 leading-relaxed">
          {t('footnote')}
        </p>
      </div>
    </section>
  );
}
