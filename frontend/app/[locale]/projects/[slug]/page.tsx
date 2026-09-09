import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { getProjectBySlug } from '@/lib/projects';
import ProjectSlugSync from '@/components/projects/ProjectSlugSync';

interface ProjectDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug, locale);

  if (!project) {
    return {
      title: 'Project niet gevonden | Nu-Isoleren',
    };
  }

  const generatedTitle = project.city?.name && project.service?.name
    ? `${project.service.name} in ${project.city.name} | Nu-Isoleren`
    : `${project.title} | Nu-Isoleren`;

  const title = project.meta_title || generatedTitle;
  const description = project.meta_description || project.short_description || undefined;
  const mainImage = project.images?.[0]?.image_url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: mainImage ? [mainImage] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'ProjectDetailPage' });
  const project = await getProjectBySlug(slug, locale);

  if (!project) {
    notFound();
  }

  const mainImage = project.images?.[0];
  const galleryImages = project.images?.slice(1) || [];

  // Dynamische CTA titel samenstellen
  const serviceName = project.service?.name;
  const cityName = project.city?.name;
  const ctaTitle = (serviceName && cityName)
    ? t('ctaTitleWithService', { service: serviceName.toLowerCase(), city: cityName })
    : t('ctaTitleFallback');

  return (
    <main className="min-h-screen bg-slate-50 pt-16 pb-20">
        <ProjectSlugSync slugs={project.all_slugs} />
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        <div className="mb-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#C82024] transition group"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">&larr;</span>
            <span>{t('backLink')}</span>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {project.service && (
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase bg-[#1A669A]/10 text-[#1A669A]">
                {project.service.name}
              </span>
            )}
            {project.city && (
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase bg-slate-200/80 text-slate-800">
                📍 {project.city.name}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-3">
            {project.title}
          </h1>

          {project.short_description && (
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
              {project.short_description}
            </p>
          )}
        </div>

        {mainImage && (
          <div className="relative w-full h-[360px] sm:h-[480px] md:h-[540px] rounded-2xl overflow-hidden shadow-sm mb-12 bg-slate-200">
            <Image
              src={mainImage.image_url}
              alt={mainImage.alt || project.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900 mb-4">
                Over dit project
              </h2>
              
              {project.description ? (
                <div 
                  className="text-slate-800 leading-relaxed text-base sm:text-lg space-y-4 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-slate-900"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              ) : (
                <p className="text-slate-500 italic">Geen verdere beschrijving beschikbaar.</p>
              )}
            </div>

            {galleryImages.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  {t('galleryTitle')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {galleryImages.map((img) => (
                    <div key={img.id} className="group flex flex-col gap-2">
                      <div className="relative h-60 rounded-xl overflow-hidden bg-slate-200 shadow-sm">
                        <Image
                          src={img.image_url}
                          alt={img.alt || project.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                      {img.caption && (
                        <p className="text-xs text-slate-500 italic px-1">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1 flex flex-col gap-6">
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Project Details
              </h3>
              
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">{t('serviceLabel')}</span>
                  <span className="font-bold text-slate-900">{project.service?.name || '-'}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">{t('locationLabel')}</span>
                  <span className="font-bold text-slate-900">{project.city?.name || '-'}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0B1528] text-white rounded-2xl p-6 sm:p-7 shadow-md flex flex-col gap-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                {ctaTitle}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t('ctaDescription')}
              </p>
              <Link
                href="/"
                className="mt-2 inline-flex justify-center items-center px-5 py-3.5 rounded-xl bg-[#C82024] hover:bg-red-700 text-white font-bold text-sm transition text-center shadow-sm"
              >
                {t('ctaButton')} &rarr;
              </Link>
            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}