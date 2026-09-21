import { getTranslations } from 'next-intl/server';

interface WalloniaCurrentPremiumsProps {
  locale: string;
}

export default async function WalloniaCurrentPremiums({
  locale,
}: WalloniaCurrentPremiumsProps) {
  const t = await getTranslations({
    locale,
    namespace: 'WalloniaGrantsPage.currentPremiums',
  });

  const rows = ['roof', 'wall', 'damp'] as const;

  return (
    <section className="w-full bg-white py-16 md:py-24">
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
          <table className="w-full min-w-[950px] border-collapse">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="pb-5 pr-6 text-left text-sm font-bold text-gray-500">
                  {t('table.work')}
                </th>

                <th className="px-5 pb-5 text-left text-sm font-bold text-gray-950">
                  R1
                </th>

                <th className="px-5 pb-5 text-left text-sm font-bold text-gray-950">
                  R2
                </th>

                <th className="px-5 pb-5 text-left text-sm font-bold text-gray-950">
                  R3
                </th>

                <th className="pl-5 pb-5 text-left text-sm font-bold text-gray-950">
                  R4
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row}
                  className="border-b border-slate-200 last:border-b-0"
                >
                  <th className="py-6 pr-6 text-left text-sm sm:text-base font-extrabold text-gray-950">
                    {t(`table.rows.${row}.label`)}
                  </th>

                  <td className="px-5 py-6 text-sm sm:text-base text-gray-600">
                    {t(`table.rows.${row}.r1`)}
                  </td>

                  <td className="px-5 py-6 text-sm sm:text-base text-gray-600">
                    {t(`table.rows.${row}.r2`)}
                  </td>

                  <td className="px-5 py-6 text-sm sm:text-base text-gray-600">
                    {t(`table.rows.${row}.r3`)}
                  </td>

                  <td className="pl-5 py-6 text-sm sm:text-base text-gray-600">
                    {t(`table.rows.${row}.r4`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm text-gray-500 leading-relaxed max-w-4xl">
          {t('notice')}
        </p>
      </div>
    </section>
  );
}