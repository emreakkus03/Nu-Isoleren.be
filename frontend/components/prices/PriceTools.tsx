import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const TOOLS = [
  {
    key: 'price',
    href: { pathname: '/prices', hash: 'spouwmuurisolatie-prijs' },
  },
  {
    key: 'savings',
    href: '/prices/energy-savings-calculator',
  },
  {
    key: 'epc',
    href: '/prices/epc-calculator',
  },
  {
    key: 'homeCheck',
    href: '/prices/home-insulation-check',
  },
] as const;

export default function PriceTools() {
  const t = useTranslations('PricesPage.tools');

  return (
    <section
      id="price-tools"
      className="w-full bg-[#F8F9FA] py-16 md:py-24 scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-md:text-center max-w-3xl mb-10 md:mb-14">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
            {t('badge')}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
            {t('title')}
          </h2>

          <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl max-md:text-center">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {TOOLS.map((tool, index) => (
            <Link
              key={tool.key}
              href={tool.href}
              className="group bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 lg:p-8 transition duration-300 hover:border-gray-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3 md:gap-6">
                <div className="flex flex-col min-w-0 max-md:[overflow-wrap:anywhere]">
                  <span className="text-sm font-extrabold tracking-wider text-[#C82024]">
                    0{index + 1}
                  </span>

                  <h3 className="mt-4 text-xl sm:text-2xl font-extrabold text-gray-950 tracking-tight">
                    {t(`${tool.key}.title`)}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
                    {t(`${tool.key}.description`)}
                  </p>
                </div>

                <div className="shrink-0 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#C82024] transition duration-300 group-hover:bg-[#C82024] group-hover:text-white group-hover:border-[#C82024]">
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14m-6-6 6 6-6 6"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <span className="inline-flex items-center gap-2 text-[#C82024] font-bold text-sm sm:text-base">
                  {t(`${tool.key}.cta`)}

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}