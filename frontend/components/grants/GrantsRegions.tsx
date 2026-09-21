import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

interface GrantsRegionsProps {
  locale: string;
}

const regions = [
  {
    key: 'flanders',
    href: '/grants/flanders',
    label: 'VL',
  },
  {
    key: 'brussels',
    href: '/grants/brussels',
    label: 'BR',
  },
  {
    key: 'wallonia',
    href: '/grants/wallonia',
    label: 'WA',
  },
] as const;

export default async function GrantsRegions({
  locale,
}: GrantsRegionsProps) {
  const t = await getTranslations({
    locale,
    namespace: 'GrantsPage.regions',
  });

  return (
    <section className="w-full bg-[#F8F9FA] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('badge')}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] max-md:text-balance max-md:[overflow-wrap:anywhere]">
            {t('title')}
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-md:text-center">
            {t('description')}
          </p>
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {regions.map((region) => (
            <article
              key={region.key}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1A669A]/10 text-sm font-extrabold text-[#1A669A]">
                {region.label}
              </div>

              <h3 className="mt-6 text-xl sm:text-2xl font-extrabold text-gray-950">
                {t(`${region.key}.title`)}
              </h3>

              <p className="mt-3 flex-1 text-sm sm:text-base text-gray-600 leading-relaxed">
                {t(`${region.key}.description`)}
              </p>

              <Link
                href={region.href}
                className="mt-6 inline-flex items-center font-bold text-[#C82024] hover:underline"
              >
                {t(`${region.key}.button`)}
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}