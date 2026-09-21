import { Link } from '@/i18n/routing';
import { City } from '@/types/city';

interface AreaCardProps {
  provinceName: string;
  cities: City[];
  ctaText: string;
}

export default function AreaCard({ provinceName, cities, ctaText }: AreaCardProps) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-colors">
      <div>
        <div className="flex items-center max-md:flex-col gap-2.5 mb-5 border-b border-slate-200/80 pb-4">
          <div className="p-2 bg-[#1A669A]/10 text-[#1A669A] rounded-lg shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight [overflow-wrap:anywhere] max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
            {provinceName || 'Overige'}
          </h2>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 text-xs sm:text-sm text-slate-700">
  {cities.map((city) => (
    <li key={city.id} className="min-w-0">
      <Link
        href={{ pathname: '/areas/[slug]', params: { slug: city.slug } }}
        className="flex items-center gap-2 py-0.5 max-md:min-h-11 hover:text-[#C82024] transition-colors group"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#1A669A] group-hover:bg-[#C82024] shrink-0" />
        <span className="max-md:whitespace-normal max-md:[overflow-wrap:anywhere] md:truncate underline">{city.name}</span>
      </Link>
    </li>
  ))}
</ul>
      </div>

      
    </div>
  );
}