import { getTranslations } from 'next-intl/server';

interface BrusselsEcorenoSectionProps {
  locale: string;
}

export default async function BrusselsEcorenoSection({
  locale,
}: BrusselsEcorenoSectionProps) {
  const t = await getTranslations({
    locale,
    namespace: 'BrusselsGrantsPage.ecoreno',
  });

  const rows = ['rate', 'applicants', 'works', 'contractor'] as const;

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.42fr_0.58fr] gap-10 lg:gap-16 items-start">
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

            <p className="mt-5 text-sm font-semibold text-gray-800 leading-relaxed">
              {t('notGrant')}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="pb-5 pr-8 text-left text-sm font-bold text-gray-500">
                    {t('table.item')}
                  </th>

                  <th className="pb-5 text-left text-sm font-bold text-gray-950">
                    {t('table.details')}
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row}
                    className="border-b border-slate-200 last:border-b-0"
                  >
                    <th className="py-6 pr-8 text-left text-sm sm:text-base font-extrabold text-gray-950 align-top">
                      {t(`table.${row}.label`)}
                    </th>

                    <td className="py-6 text-sm sm:text-base text-gray-600 leading-relaxed">
                      {t(`table.${row}.value`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-7 border-l-4 border-[#1A669A] pl-5">
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('notice')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}