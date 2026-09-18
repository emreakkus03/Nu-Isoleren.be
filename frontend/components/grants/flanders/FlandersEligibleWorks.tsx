import { getTranslations } from 'next-intl/server';

interface FlandersEligibleWorksProps {
  locale: string;
}

export default async function FlandersEligibleWorks({
  locale,
}: FlandersEligibleWorksProps) {
  const t = await getTranslations({
    locale,
    namespace: 'FlandersGrantsPage.works',
  });

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
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
          <div className="grid grid-cols-1 lg:grid-cols-[0.4fr_0.6fr] gap-6 lg:gap-14 py-8 border-b border-slate-200">
            <div>
              <span className="text-sm font-extrabold text-[#C82024]">
                01
              </span>

              <h3 className="mt-2 text-2xl font-extrabold text-gray-950">
                {t('roof.title')}
              </h3>
            </div>

            <div>
              <p className="text-gray-600 leading-relaxed">
                {t('roof.description')}
              </p>

              <ul className="mt-5 flex flex-col gap-3">
                <li className="flex gap-3 text-sm sm:text-base text-gray-700">
                  <span className="font-black text-[#1A669A]">✓</span>
                  {t('roof.requirement1')}
                </li>

                <li className="flex gap-3 text-sm sm:text-base text-gray-700">
                  <span className="font-black text-[#1A669A]">✓</span>
                  {t('roof.requirement2')}
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.4fr_0.6fr] gap-6 lg:gap-14 py-8 border-b border-slate-200">
            <div>
              <span className="text-sm font-extrabold text-[#C82024]">
                02
              </span>

              <h3 className="mt-2 text-2xl font-extrabold text-gray-950">
                {t('cavity.title')}
              </h3>
            </div>

            <div>
              <p className="text-gray-600 leading-relaxed">
                {t('cavity.description')}
              </p>

              <ul className="mt-5 flex flex-col gap-3">
                <li className="flex gap-3 text-sm sm:text-base text-gray-700">
                  <span className="font-black text-[#1A669A]">✓</span>
                  {t('cavity.requirement1')}
                </li>

                <li className="flex gap-3 text-sm sm:text-base text-gray-700">
                  <span className="font-black text-[#1A669A]">✓</span>
                  {t('cavity.requirement2')}
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.4fr_0.6fr] gap-6 lg:gap-14 py-8">
            <div>
              <span className="text-sm font-extrabold text-[#C82024]">
                03
              </span>

              <h3 className="mt-2 text-2xl font-extrabold text-gray-950">
                {t('facade.title')}
              </h3>
            </div>

            <div>
              <p className="text-gray-600 leading-relaxed">
                {t('facade.description')}
              </p>

              <ul className="mt-5 flex flex-col gap-3">
                <li className="flex gap-3 text-sm sm:text-base text-gray-700">
                  <span className="font-black text-[#1A669A]">✓</span>
                  {t('facade.requirement1')}
                </li>

                <li className="flex gap-3 text-sm sm:text-base text-gray-700">
                  <span className="font-black text-[#1A669A]">✓</span>
                  {t('facade.requirement2')}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-7 text-sm text-gray-500 leading-relaxed max-w-4xl">
          {t('notice')}
        </p>
      </div>
    </section>
  );
}