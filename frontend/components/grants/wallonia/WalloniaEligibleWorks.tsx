
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface WalloniaEligibleWorksProps {
  locale: string;
}

const OFFICIAL_FINANCING_URL =
  'https://www.wallonie.be/fr/demarches/beneficier-du-financement-de-vos-travaux-de-renovation';

export default async function WalloniaEligibleWorks({
  locale,
}: WalloniaEligibleWorksProps) {
  const t = await getTranslations({
    locale,
    namespace: 'WalloniaGrantsPage.eligibleWorks',
  });

  const works = ['cavity', 'facade', 'roof', 'damp'] as const;

  const cavityHref =
    locale === 'fr'
      ? '/fr/services/isolation-murs-creux'
      : locale === 'en'
        ? '/en/services/cavity-wall-insulation'
        : '/nl/diensten/spouwmuurisolatie';

  return (
    <section
      className="w-full bg-slate-50 py-16 md:py-24"
      aria-labelledby="wallonia-works-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <span className="text-sm sm:text-base font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('badge')}
          </span>

          <h2
            id="wallonia-works-title"
            className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]"
          >
            {t('title')}
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          {works.map((work) => (
            <article
              key={work}
              className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8"
            >
              <h3 className="text-xl font-extrabold text-gray-950">
                {t(`${work}.title`)}
              </h3>

              <p className="mt-3 text-base text-gray-600 leading-relaxed">
                {t(`${work}.description`)}
              </p>

              {work === 'cavity' && (
                <Link
                  href={cavityHref}
                  className="mt-4 inline-block font-bold text-[#1A669A] underline underline-offset-4 hover:text-[#C82024]"
                >
                  {t('cavity.link')}
                </Link>
              )}
            </article>
          ))}
        </div>

        <div className="mt-8 border-l-4 border-[#C82024] pl-5">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {t('notice')}
          </p>

          <a
            href={OFFICIAL_FINANCING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block font-bold text-[#1A669A] underline underline-offset-4 hover:text-[#C82024]"
          >
            {t('official')}
          </a>
        </div>
      </div>
    </section>
  );
}
