import { getTranslations } from 'next-intl/server';
import ServiceCard from '@/components/ui/ServiceCard';
import { getAllProjects, getProjectFilters } from '@/lib/projects';
import ProjectFilters from '@/components/projects/ProjectFilters';
import Pagination from '@/components/projects/Pagination';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  
  const t = await getTranslations({ locale, namespace: 'Seo.projects' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProjectsPage({ params, searchParams }: ProjectsPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: 'ProjectsPage' });
  const tBreadcrumb = await getTranslations({ locale, namespace: 'Breadcrumbs' });

  const [projectsData, filtersData] = await Promise.all([
    getAllProjects(locale, resolvedSearchParams),
    getProjectFilters(locale),
  ]);

  const { data: projects, meta } = projectsData;

  const breadcrumbs = [
    { label: tBreadcrumb('home'), href: '/' },
    { label: tBreadcrumb('projects') },
  ];

  return (
    <main className="min-h-screen bg-white pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        <div className="mb-8">
                  <Breadcrumbs items={breadcrumbs} />
                </div>
        <div className="max-w-4xl mb-10">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('badge')}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            {t('title')}
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <aside className="lg:col-span-1">
            <ProjectFilters
              services={filtersData.services}
              cities={filtersData.cities}
              totalResults={meta.total}
            />
          </aside>

          <section className="lg:col-span-3">
            {projects.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <p className="text-slate-500 font-medium">{t('noProjects')}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => {
                    const firstImage = project.images?.[0];
                    const imageUrl = firstImage?.image_url || '/images/placeholder.jpg';
                    const imageAlt = firstImage?.alt || project.title;
                    const projectTitle = project.city?.name
                      ? `${project.service?.name} in ${project.city.name}`
                      : project.title;

                    return (
                      <ServiceCard
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        imageSrc={imageUrl}
                        imageAlt={imageAlt}
                        title={projectTitle}
                        badge={project.service?.name}
                        description={project.short_description || undefined}
                      />
                    );
                  })}
                </div>

                <Pagination
                  currentPage={meta.current_page}
                  lastPage={meta.last_page}
                />
              </>
            )}
          </section>

        </div>

      </div>
    </main>
  );
}