
import { getTranslations } from 'next-intl/server';

interface WalloniaGrantsQualityProps {
  locale: string;
}

const BCCA_INFO_URL =
  'https://www.bcca.be/fr/post-isolation-des-murs-creux-sur-site';

export default async function WalloniaGrantsQuality({
  locale,
}: WalloniaGrantsQualityProps) {
  const t = await getTranslations({
    locale,
    namespace: 'WalloniaGrantsPage.quality',
  });

  return (
    <section
      className="w-full bg-slate-50 py-16 md:py-24"
      aria-labelledby="wallonia-quality-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <span className="text-sm sm:text-base font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('badge')}
          </span>

          <h2
            id="wallonia-quality-title"
            className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-950 leading-[1.15]"
          >
            {t('title')}
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="border border-slate-200 rounded-2xl bg-white p-6 sm:p-8">
            <h3 className="text-xl font-extrabold text-[#1A669A]">
              {t('atgTitle')}
            </h3>

            <p className="mt-3 text-gray-600 leading-relaxed">
              {t('atgDescription')}
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl bg-white p-6 sm:p-8">
            <h3 className="text-xl font-extrabold text-[#1A669A]">
              {t('stsTitle')}
            </h3>

            <p className="mt-3 text-gray-600 leading-relaxed">
              {t('stsDescription')}
            </p>
          </div>
        </div>

        <div className="mt-8 max-w-4xl border-l-4 border-[#1A669A] pl-5">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {t('notice')}
          </p>

          <a
            href={BCCA_INFO_URL}
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
