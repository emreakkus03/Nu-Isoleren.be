import { Link } from '@/i18n/routing';
import type { ServiceItem } from '@/types/service';

interface CitySolutionsSectionProps {
  services: ServiceItem[];
  intro?: string | null;
  eyebrow: string;
  title: string;
  cavityDescription: string;
  facadeDescription: string;
  roofDescription: string;
  linkLabel: string;
}

export default function CitySolutionsSection({
  services,
  intro,
  eyebrow,
  title,
  cavityDescription,
  facadeDescription,
  roofDescription,
  linkLabel,
}: CitySolutionsSectionProps) {
  const cavityService = services.find(
    (service) =>
      service.alternate_slugs?.nl === 'spouwmuurisolatie'
  );

  const facadeService = services.find(
    (service) =>
      service.alternate_slugs?.nl === 'crepi'
  );

  const roofService = services.find(
    (service) =>
      service.alternate_slugs?.nl === 'dakisolatie'
  );

  const solutions = [
    {
      number: '01',
      service: cavityService,
      description: cavityDescription,
    },
    {
      number: '02',
      service: facadeService,
      description: facadeDescription,
    },
    {
      number: '03',
      service: roofService,
      description: roofDescription,
    },
  ].filter((item) => item.service);

  if (!solutions.length) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:pt-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-md:text-center max-w-3xl mb-10 sm:mb-14">
          <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
            {eyebrow}
          </span>

          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black tracking-tight leading-tight max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
            {title}
          </h2>

          {intro && (
            <div
              className="
                text-left
                mt-5
                text-sm
                sm:text-base
                text-black
                leading-relaxed

                [&_p]:mb-4
                [&_p:last-child]:mb-0

                [&_strong]:font-bold
                [&_strong]:text-black

                [&_a]:font-bold
                [&_a]:text-[#1A669A]
                [&_a]:underline
                [&_a]:underline-offset-4
                [&_a:hover]:text-[#C82024]
              "
              dangerouslySetInnerHTML={{
                __html: intro,
              }}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {solutions.map(({ number, service, description }) => {
            if (!service) {
              return null;
            }

            return (
              <div
                key={service.id}
                className="flex flex-col items-start"
              >
                <span className="text-4xl sm:text-5xl font-extrabold text-[#C82024] leading-none">
                  {number}
                </span>

                <div className="w-full h-px bg-slate-200 my-5" />

                <h3 className="text-xl sm:text-2xl font-extrabold text-black leading-tight">
                  {service.name}
                </h3>

                <p className="mt-4 text-sm sm:text-base text-black leading-relaxed">
                  {description}
                </p>

                <Link
                  href={{
                    pathname: '/services/[slug]',
                    params: {
                      slug: service.slug,
                    },
                  }}
                  className="mt-5 inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#C82024] hover:gap-3 transition-all"
                >
                  {linkLabel}

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
            );
          })}
        </div>
      </div>
    </section>
  );
}