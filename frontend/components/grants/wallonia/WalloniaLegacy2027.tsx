
import { getTranslations } from 'next-intl/server';

interface WalloniaLegacy2027Props {
  locale: string;
}

const TRANSITIONAL_RULES_URL =
  'https://logement.wallonie.be/fr/aide/primes-travaux-les-nouvelles-mesures-transitoires';

export default async function WalloniaLegacy2027({
  locale,
}: WalloniaLegacy2027Props) {
  const t = await getTranslations({
    locale,
    namespace: 'WalloniaGrantsPage.legacy2027',
  });

  return (
    <section
      className="w-full bg-white py-16 md:py-24"
      aria-labelledby="wallonia-legacy-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <span className="text-sm sm:text-base font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('badge')}
          </span>

          <h2
            id="wallonia-legacy-title"
            className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-950 leading-[1.15]"
          >
            {t('title')}
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="mt-9 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="border border-slate-200 rounded-2xl p-6 sm:p-8">
            <p className="text-base text-gray-700 leading-relaxed">
              {t('condition')}
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl p-6 sm:p-8">
            <p className="text-base text-gray-700 leading-relaxed">
              {t('deadline')}
            </p>
          </div>
        </div>

        <p className="mt-7 max-w-4xl text-sm sm:text-base text-gray-600 leading-relaxed">
          {t('notice')}
        </p>

        <a
          href={TRANSITIONAL_RULES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block font-bold text-[#1A669A] underline underline-offset-4 hover:text-[#C82024]"
        >
          {t('official')}
        </a>
      </div>
    </section>
  );
}
