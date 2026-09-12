import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import ServiceCard from '@/components/ui/ServiceCard';
import { getFeaturedProjects } from '@/lib/projects';

export default async function ProjectsSection() {
  const locale = await getLocale();
  const t = await getTranslations('ProjectsSection');
  const projects = await getFeaturedProjects(locale);

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="flex flex-col gap-3">
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
              {t('badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              {t('title')}
            </h2>
          </div>

          <div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-[#C82024] hover:text-red-800 font-bold text-sm sm:text-base transition group whitespace-nowrap"
            >
              <span>{t('cta')}</span>
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project) => {
            const firstImage = project.images?.[0];
            const imageUrl = firstImage?.image_url || '/logo/logo.svg';
            const imageAlt = firstImage?.alt || project.title;
            const projectCardTitle = project.city?.name 
              ? `${project.service?.name} in ${project.city.name}`
              : project.title;

            return (
              <ServiceCard
                key={project.id}
                href={`/projects/${project.slug}`}
                imageSrc={imageUrl}
                imageAlt={imageAlt}
                title={projectCardTitle}
                badge={project.service?.name}
                description={project.short_description || undefined}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}