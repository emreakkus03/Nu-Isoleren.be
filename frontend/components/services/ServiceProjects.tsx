import ServiceCard from '@/components/ui/ServiceCard';
import { Link } from '@/i18n/routing';
import type { ServiceProject } from '@/types/service';

interface ServiceProjectsProps {
  projects: ServiceProject[];

  limit?: number;

  showLocation?: boolean;

  showDescription?: boolean;

  buttonLabel?: string;

  buttonUrl?: string;
}

export default function ServiceProjects({
  projects,
  limit = 3,
  showLocation = true,
  showDescription = false,
  buttonLabel,
  buttonUrl = '/projects',
}: ServiceProjectsProps) {
  const visibleProjects = projects.slice(
    0,
    limit,
  );

  if (visibleProjects.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {visibleProjects.map(
          (project) => {
            const firstImage =
              project.images?.[0];

            const imageUrl =
              firstImage?.image_url ||
              '/logo/logo.svg';

            const imageAlt =
              firstImage?.alt ||
              project.title;

            const projectTitle =
              showLocation &&
              project.city?.name &&
              project.service?.name
                ? `${project.service.name} in ${project.city.name}`
                : project.title;

            return (
              <ServiceCard
                key={project.id}
                href={`/projects/${project.slug}`}
                imageSrc={imageUrl}
                imageAlt={imageAlt}
                title={projectTitle}
                badge={
                  project.service?.name ||
                  undefined
                }
                description={
                  showDescription
                    ? project.short_description ||
                      undefined
                    : undefined
                }
              />
            );
          },
        )}
      </div>

      {buttonLabel && (
        <div className="mt-8 max-md:text-center">
          <Link
            href={buttonUrl as never}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              border-2
              border-[#C82024]
              bg-[#C82024]
              px-5
              py-3
              text-sm
              font-bold
              text-white
              transition-colors
              duration-200
              hover:bg-white
              hover:text-[#C82024]
            "
          >
            {buttonLabel}

            <span aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}