import { Link } from '@/i18n/routing';
import type { NearbyCity } from '@/types/city';

interface CityNearbyAreasSectionProps {
  cities: NearbyCity[];
  eyebrow: string;
  title: string;
  description: string;
}

export default function CityNearbyAreasSection({
  cities,
  eyebrow,
  title,
  description,
}: CityNearbyAreasSectionProps) {
  if (!cities.length) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-md:text-center max-w-3xl mb-10 sm:mb-12">
          <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
            {eyebrow}
          </span>

          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black tracking-tight leading-tight max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
            {title}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-black leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.slice(0, 6).map((nearbyCity) => (
            <Link
              key={nearbyCity.id}
              href={{
                pathname: '/areas/[slug]',
                params: {
                  slug: nearbyCity.slug,
                },
              }}
              className="
                group
                flex
                items-center
                justify-between
                gap-4
                rounded-xl
                border
                border-slate-200
                bg-white
                px-5
                py-5
                transition-all
                duration-200
                hover:border-[#C82024]
                hover:shadow-sm
              "
            >
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-black group-hover:text-[#C82024] transition-colors">
                  {nearbyCity.name}
                </h3>

                {nearbyCity.province && (
                  <p className="mt-1 text-sm text-slate-600">
                    {nearbyCity.province}
                  </p>
                )}
              </div>

              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="w-5 h-5 shrink-0 text-[#C82024] transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path
                  d="M4 10H16M11 5L16 10L11 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}