import ServiceCard from '@/components/ui/ServiceCard';
import type { ServiceItem } from '@/types/service';

interface CityServicesSectionProps {
  services: ServiceItem[];
  eyebrow: string;
  title: string;
  description: string;
}

export default function CityServicesSection({
  services,
  eyebrow,
  title,
  description,
}: CityServicesSectionProps) {
  if (!services.length) {
    return null;
  }

  return (
    <section className="w-full bg-white pt-16 sm:pt-20 lg:pt-24">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {services.slice(0, 6).map((service) => {
            const image =
              service.thumbnail ||
              service.hero_image ||
              '/logo/logo.svg';

            return (
              <ServiceCard
                key={service.id}
                href={`/services/${service.slug}`}
                imageSrc={image}
                imageAlt={service.name}
                title={service.name}
                badge={service.badge}
                description={service.short_description || undefined}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}