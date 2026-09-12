import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getServiceBySlug } from '@/lib/services';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ServiceToc from '@/components/services/ServiceToc';
import DynamicBulletIcon from '@/components/ui/DynamicBulletIcon';

export const dynamic = 'force-dynamic';

interface ServiceDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getServiceBySlug(slug, locale);

  if (!service) {
    return {
      title: 'Dienst niet gevonden | Nu-Isoleren.be',
    };
  }

  const title = service.seo_title || `${service.hero_title || service.name} | Nu-Isoleren.be`;
  const description =
    service.seo_description ||
    service.short_description ||
    `Ontdek alles over ${service.name} bij Nu-Isoleren.be. Vraag vrijblijvend advies of een offerte aan.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: service.hero_image
        ? [service.hero_image]
        : service.thumbnail
          ? [service.thumbnail]
          : [],
    },
  };
}

const formatIntroParagraphs = (rawText: string) => {
  if (!rawText) return '';

  if (!rawText.includes('<p>')) {
    return rawText
      .split(/\r\n|\n|\r/)
      .filter((p) => p.trim() !== '')
      .map((p) => `<p class="mb-4 last:mb-0">${p.trim()}</p>`)
      .join('');
  }

  if (rawText.includes('Nu-Isoleren is')) {
    return rawText.replace('Nu-Isoleren is', '</p><p class="mt-4">Nu-Isoleren is');
  }

  return rawText;
};

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { locale, slug } = await params;

  const [tBreadcrumb, service] = await Promise.all([
    getTranslations({ locale, namespace: 'Breadcrumbs' }),
    getServiceBySlug(slug, locale),
  ]);

  if (!service) {
    notFound();
  }

  const breadcrumbs = [
    { label: tBreadcrumb('home'), href: '/' },
    { label: tBreadcrumb('services'), href: '/services' },
    { label: service.name },
  ];

  const tocItems = (service.sections || []).map((sec) => ({
    nav_title: sec.nav_title,
    slug: sec.slug,
  }));

  return (
    <main className="min-h-screen bg-white pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <header className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start mb-26">
          
          <div className="w-full lg:w-[35%] shrink-0 flex flex-col gap-4">
            {service.eyebrow && (
              <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
                {service.eyebrow}
              </span>
            )}
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {service.hero_title || service.name}
            </h1>

            {service.intro_text && (
              <div 
                className="text-base text-slate-600 leading-relaxed [&>p]:mb-4 last:[&>p]:mb-0"
                dangerouslySetInnerHTML={{ 
                  __html: formatIntroParagraphs(service.intro_text) 
                }}
              />
            )}
          </div>

          <div className="w-full lg:flex-1 min-w-0">
            <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[500px] overflow-hidden bg-slate-100">
              <Image
                src={service.hero_image || service.thumbnail || '/images/placeholder.jpg'}
                alt={service.hero_title || service.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover"
              />
            </div>
          </div>

        </header>

        {/* Content: exact dezelfde 35% links en flex-1 rechts */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          
          <aside className="hidden lg:block lg:w-[35%] shrink-0 self-stretch">
            <ServiceToc items={tocItems} />
          </aside>

          <section className="w-full lg:flex-1 min-w-0 flex flex-col gap-16">
            {service.sections && service.sections.length > 0 ? (
              service.sections.map((section) => (
                <article
                  key={section.slug}
                  id={section.slug}
                  className="scroll-mt-32 flex flex-col gap-4 border-b border-slate-100 pb-12 last:border-b-0"
                >
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {section.heading}
                  </h2>

                  <div
                    className="prose prose-slate max-w-none text-base text-slate-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.body }}
                  />

                  {section.bullet_points && section.bullet_points.length > 0 && (
  <ul className="flex flex-col gap-3 my-2">
    {section.bullet_points.map((bp, idx) => (
      <li key={idx} className="flex items-start gap-3">
        <DynamicBulletIcon icon={bp.icon} color={bp.color} />
        <span className="text-base text-slate-700 font-medium leading-relaxed">
          {bp.text}
        </span>
      </li>
    ))}
  </ul>
)}

                  {section.images && section.images.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {section.images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-[16/10] overflow-hidden bg-slate-100"
                        >
                          <Image
                            src={imgUrl}
                            alt={`${section.heading} - ${idx + 1}`}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))
            ) : (
              <p className="text-slate-500 font-medium">Geen inhoud beschikbaar.</p>
            )}
          </section>

        </div>

      </div>
    </main>
  );
}