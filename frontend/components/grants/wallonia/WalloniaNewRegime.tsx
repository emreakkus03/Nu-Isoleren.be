import { getTranslations } from 'next-intl/server';

interface WalloniaNewRegimeProps {
  locale: string;
}

export default async function WalloniaNewRegime({
  locale,
}: WalloniaNewRegimeProps) {
  const t = await getTranslations({
    locale,
    namespace: 'WalloniaGrantsPage.newRegime',
  });

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <span className="text-sm sm:text-base font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('badge')}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
            {t('title')}
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="mt-12 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-10 py-8 border-b border-slate-200">
            <span className="font-extrabold text-[#C82024]">
              {t('peb.gf.label')}
            </span>

            <p className="text-base sm:text-lg font-bold text-gray-950">
              {t('peb.gf.value')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-10 py-8 border-b border-slate-200">
            <span className="font-extrabold text-[#C82024]">
              {t('peb.e.label')}
            </span>

            <p className="text-base sm:text-lg font-bold text-gray-950">
              {t('peb.e.value')}
            </p>
          </div>
        </div>

        <div className="mt-8 border-l-4 border-[#1A669A] pl-5 max-w-4xl">
          <p className="text-sm sm:text-base text-gray-700 font-semibold leading-relaxed">
            {t('audit')}
          </p>
        </div>
      </div>
    </section>
  );
}