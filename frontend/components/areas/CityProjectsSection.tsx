import ServiceCard from '@/components/ui/ServiceCard';
import type { CityProject } from '@/types/city';

interface CityProjectsSectionProps {
  projects: CityProject[];
  eyebrow: string;
  title: string;
  description: string;
}

export default function CityProjectsSection({
  projects,
  eyebrow,
  title,
  description,
}: CityProjectsSectionProps) {
  if (!projects?.length) {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {projects.slice(0, 3).map((project) => {
            const firstImage = project.images?.[0];

            const imageUrl =
              firstImage?.image_url ||
              project.image_url ||
              '/logo/logo.svg';

            const imageAlt =
              firstImage?.alt ||
              project.title;

            const title =
              project.city?.name && project.service?.name
                ? `${project.service.name} in ${project.city.name}`
                : project.title;

            return (
              <ServiceCard
                key={project.id}
                href={`/projects/${project.slug}`}
                imageSrc={imageUrl}
                imageAlt={imageAlt}
                title={title}
                badge={project.service?.name || undefined}
                description={project.short_description || undefined}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}