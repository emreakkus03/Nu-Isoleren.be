import { Link } from '@/i18n/routing';

interface CityGrantsSectionProps {
  href: '/grants/flanders' | '/grants/wallonia';
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
}

export default function CityGrantsSection({
  href,
  eyebrow,
  title,
  description,
  buttonLabel,
}: CityGrantsSectionProps) {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <div className="max-w-3xl">
            <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-wider text-[#1A669A] uppercase">
              {eyebrow}
            </span>

            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black tracking-tight leading-tight">
              {title}
            </h2>

            <p className="mt-5 text-sm sm:text-base text-black leading-relaxed">
              {description}
            </p>

            <Link
              href={href}
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#C82024] px-5 py-3 text-sm sm:text-base font-bold text-white transition-colors duration-200 hover:bg-white hover:text-[#C82024] border border-[#C82024]"
            >
              {buttonLabel}

              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="w-4 h-4"
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
          </div>
        </div>
      </div>
    </section>
  );
}