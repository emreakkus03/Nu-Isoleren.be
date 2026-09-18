import { getTranslations } from 'next-intl/server';

interface WalloniaGrantsTransitionProps {
  locale: string;
}

export default async function WalloniaGrantsTransition({
  locale,
}: WalloniaGrantsTransitionProps) {
  const t = await getTranslations({
    locale,
    namespace: 'WalloniaGrantsPage.transition',
  });

  return (
    <section className="w-full bg-[#F8F9FA] py-16 md:py-20">
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

        <div className="mt-10 border-t border-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-[210px_1fr] gap-4 md:gap-10 py-8 border-b border-slate-300">
            <div>
              <span className="text-sm font-extrabold text-[#C82024]">
                {t('current.date')}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-950">
                {t('current.title')}
              </h3>

              <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl">
                {t('current.description')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[210px_1fr] gap-4 md:gap-10 py-8 border-b border-slate-300">
            <div>
              <span className="text-sm font-extrabold text-[#1A669A]">
                {t('new.date')}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-950">
                {t('new.title')}
              </h3>

              <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl">
                {t('new.description')}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500 leading-relaxed max-w-4xl">
          {t('notice')}
        </p>
      </div>
    </section>
  );
}