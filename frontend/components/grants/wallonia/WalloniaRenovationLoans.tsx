import { getTranslations } from 'next-intl/server';

interface WalloniaRenovationLoansProps {
  locale: string;
}

export default async function WalloniaRenovationLoans({
  locale,
}: WalloniaRenovationLoansProps) {
  const t = await getTranslations({
    locale,
    namespace: 'WalloniaGrantsPage.loans',
  });

  const rows = ['c1', 'c2', 'c3', 'c4'] as const;

  return (
    <section className="w-full bg-[#F8F9FA] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
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

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="pb-5 pr-6 text-left text-sm font-bold text-gray-500">
                  {t('table.category')}
                </th>

                <th className="px-6 pb-5 text-left text-sm font-bold text-gray-950">
                  {t('table.income')}
                </th>

                <th className="px-6 pb-5 text-left text-sm font-bold text-gray-950">
                  {t('table.loan')}
                </th>

                <th className="pl-6 pb-5 text-left text-sm font-bold text-gray-950">
                  {t('table.reduction')}
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row}
                  className="border-b border-slate-200 last:border-b-0"
                >
                  <th className="py-6 pr-6 text-left font-extrabold text-gray-950">
                    {row.toUpperCase()}
                  </th>

                  <td className="px-6 py-6 text-gray-600">
                    {t(`table.rows.${row}.income`)}
                  </td>

                  <td className="px-6 py-6 text-gray-600">
                    {t(`table.rows.${row}.loan`)}
                  </td>

                  <td className="pl-6 py-6 font-bold text-gray-950">
                    {t(`table.rows.${row}.reduction`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-t border-slate-300 pt-5">
            <h3 className="font-extrabold text-gray-950">
              {t('renopack.title')}
            </h3>

            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {t('renopack.description')}
            </p>
          </div>

          <div className="border-t border-slate-300 pt-5">
            <h3 className="font-extrabold text-gray-950">
              {t('renopret.title')}
            </h3>

            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {t('renopret.description')}
            </p>
          </div>
        </div>

        <p className="mt-7 text-sm text-gray-500 leading-relaxed max-w-4xl">
          {t('notice')}
        </p>
      </div>
    </section>
  );
}