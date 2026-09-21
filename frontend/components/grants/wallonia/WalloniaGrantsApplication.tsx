import { getTranslations } from 'next-intl/server';

interface WalloniaGrantsApplicationProps {
  locale: string;
}

export default async function WalloniaGrantsApplication({
  locale,
}: WalloniaGrantsApplicationProps) {
  const t = await getTranslations({
    locale,
    namespace: 'WalloniaGrantsPage.application',
  });

  return (
    <section className="w-full bg-white py-16 md:py-24">
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

        <div className="mt-12 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 md:gap-10 py-8 border-b border-slate-200">
            <h3 className="font-extrabold text-[#C82024]">
              {t('before.title')}
            </h3>

            <p className="text-gray-600 leading-relaxed">
              {t('before.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 md:gap-10 py-8 border-b border-slate-200">
            <h3 className="font-extrabold text-[#1A669A]">
              {t('after.title')}
            </h3>

            <p className="text-gray-600 leading-relaxed">
              {t('after.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}