import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { City } from '@/types/city';

interface HomeServiceAreasProps {
  cities: City[];
}

export default function HomeServiceAreas({ cities }: HomeServiceAreasProps) {
  const t = useTranslations('HomeAreas');

  const clusters = [
    {
      title: 'Antwerpen & Vl.-Brabant',
      provinces: ['Antwerpen', 'Vlaams-Brabant', 'Brussel'],
    },
    {
      title: 'Oost- & West-Vlaanderen',
      provinces: ['Oost-Vlaanderen', 'West-Vlaanderen'],
    },
    {
      title: 'Limburg & Wallonië',
      provinces: ['Limburg', 'Wallonië', 'Henegouwen', 'Luik', 'Namen', 'Waals-Brabant'],
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14 text-center md:text-left">
  <div className="flex flex-col items-center md:items-start gap-3">
    <span className="text-sm md:text-base font-extrabold tracking-wider text-[#1A669A] uppercase">
      {t('badge')}
    </span>

    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] max-md:text-balance max-md:[overflow-wrap:anywhere]">
      {t('title')}
    </h2>
  </div>

  <div className="flex justify-center md:justify-end">
    <Link
      href="/areas"
      className="inline-flex items-center gap-2 text-[#C82024] hover:text-red-800 font-bold text-sm sm:text-base transition group whitespace-nowrap max-md:whitespace-normal max-md:justify-center max-md:text-center max-md:min-h-11"
    >
      <span>{t('view_all')}</span>

      <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
        &rarr;
      </span>
    </Link>
  </div>
</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {clusters.map((cluster) => {
            const clusterCities = cities.filter((city) =>
              cluster.provinces.some(
                (p) => city.province?.toLowerCase() === p.toLowerCase()
              )
            );

            return (
              <div
                key={cluster.title}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-md transition-all flex flex-col items-center justify-start sm:justify-between text-center min-h-0 sm:min-h-[190px]"
              >
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight">
  {cluster.title}
</h3>

                {clusterCities.length > 0 ? (
                  <div className="w-full flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed font-normal">
                    {clusterCities.map((city, idx) => (
                      <span key={city.id} className="inline-flex items-center whitespace-nowrap">
                        <Link
                          href={{ pathname: '/areas/[slug]', params: { slug: city.slug } }}
                          className="hover:text-[#C82024] transition-colors"
                        >
                          {city.name}
                        </Link>
                        {idx < clusterCities.length - 1 && (
                          <span className="ml-2 text-[#1A669A] font-black select-none text-base leading-none">
                            ·
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-400 italic">
                    Geen uitgelichte steden
                  </p>
                )}

                <div className="hidden sm:block" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}