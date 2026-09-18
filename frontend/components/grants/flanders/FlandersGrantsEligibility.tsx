import { getTranslations } from 'next-intl/server';

interface FlandersGrantsEligibilityProps {
  locale: string;
}

export default async function FlandersGrantsEligibility({
  locale,
}: FlandersGrantsEligibilityProps) {
  const t = await getTranslations({
    locale,
    namespace: 'FlandersGrantsPage.eligibility',
  });

  return (
    <section className="w-full bg-[#F8F9FA] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-start">
          <div>
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
              {t('badge')}
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              {t('title')}
            </h2>

            <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
              {t('description')}
            </p>

            <div className="mt-7 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1A669A]" />
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {t('points.building')}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1A669A]" />
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {t('points.income')}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1A669A]" />
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {t('points.property')}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="pb-4 pr-5 text-left text-sm font-bold text-gray-500">
                    {t('table.situation')}
                  </th>

                  <th className="px-5 pb-4 text-left text-sm font-bold text-gray-950">
                    {t('table.category4')}
                  </th>

                  <th className="pl-5 pb-4 text-left text-sm font-bold text-gray-950">
                    {t('table.category3')}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-200">
                  <th className="py-5 pr-5 text-left font-bold text-gray-950">
                    {t('table.single.label')}
                  </th>

                  <td className="px-5 py-5 text-gray-600">
                    {t('table.single.category4')}
                  </td>

                  <td className="pl-5 py-5 text-gray-600">
                    {t('table.single.category3')}
                  </td>
                </tr>

                <tr className="border-b border-slate-200">
                  <th className="py-5 pr-5 text-left font-bold text-gray-950">
                    {t('table.family.label')}
                  </th>

                  <td className="px-5 py-5 text-gray-600">
                    {t('table.family.category4')}
                  </td>

                  <td className="pl-5 py-5 text-gray-600">
                    {t('table.family.category3')}
                  </td>
                </tr>

                <tr>
                  <th className="py-5 pr-5 text-left font-bold text-gray-950">
                    {t('table.extra.label')}
                  </th>

                  <td className="px-5 py-5 text-gray-600">
                    {t('table.extra.category4')}
                  </td>

                  <td className="pl-5 py-5 text-gray-600">
                    {t('table.extra.category3')}
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="mt-5 text-sm text-gray-500 leading-relaxed">
              {t('table.notice')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}