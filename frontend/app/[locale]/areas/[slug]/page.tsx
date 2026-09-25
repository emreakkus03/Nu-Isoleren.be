import ServiceAlternateLinks from '@/components/services/ServiceAlternateLinks';
import { contentMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getCityBySlug } from '@/lib/cities';
import CityServicesSection from '@/components/areas/CityServicesSection';
import CitySolutionsSection from '@/components/areas/CitySolutionsSection';
import CityProjectsSection from '@/components/areas/CityProjectsSection';
import CityProcessSection from '@/components/areas/CityProcessSection';
import CityGrantsSection from '@/components/areas/CityGrantsSection';
import CityNearbyAreasSection from '@/components/areas/CityNearbyAreasSection';
import CtaBanner from '@/components/common/CtaBanner';
import { getServices } from '@/lib/services';


const RICH_TEXT_CLASSES = `
  text-sm sm:text-base
  text-black
  leading-relaxed

  [&_p]:mb-4
  [&_p:last-child]:mb-0

  [&_strong]:font-bold
  [&_strong]:text-black

  [&_ul]:list-disc
  [&_ul]:pl-5
  [&_ul]:my-4

  [&_ol]:list-decimal
  [&_ol]:pl-5
  [&_ol]:my-4

  [&_li]:mb-1

  [&_a]:font-bold
  [&_a]:text-[#1A669A]
  [&_a]:underline
  [&_a]:decoration-2
  [&_a]:decoration-[#1A669A]
  [&_a]:underline-offset-4
  [&_a]:transition-colors

  [&_a:hover]:text-[#C82024]
  [&_a:hover]:decoration-[#C82024]
`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  const [t, city] = await Promise.all([
    getTranslations({
      locale,
      namespace: 'CityDetail',
    }),

    getCityBySlug(
      slug,
      locale,
    ),
  ]);

  if (!city) {
    return {};
  }

  const title =
    city.seo_title ||
    t('meta_title', {
      city: city.name,
    });

  const description =
    city.seo_description ||
    t('meta_description', {
      city: city.name,
    });

  return contentMetadata('cities', locale, slug, {
    title,
    description,

    robots: {
      index: city.is_indexable,
      follow: true,
    },

    openGraph: {
      title,
      description,
      images: city.hero_image
        ? [city.hero_image]
        : [],
    },
  });
}

export default async function CityDetailPage({
  params,
}: {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}) {
  const { locale, slug } =
    await params;

  const [
  tBreadcrumb,
  tCity,
  city,
  services,
] = await Promise.all([
  getTranslations({
    locale,
    namespace: 'Breadcrumbs',
  }),

  getTranslations({
    locale,
    namespace: 'CityDetail',
  }),

  getCityBySlug(
    slug,
    locale,
  ),

  getServices(
    locale,
    {
      featuredHome: true,
    },
  ),
]);

  if (!city) {
    notFound();
  }

  const breadcrumbs = [
    {
      label:
        tBreadcrumb('home'),

      href: '/',
    },

    {
      label:
        tBreadcrumb('areas'),

      href: '/areas',
    },

    {
      label: city.name,
    },
  ];

  const normalizedRegion = city.region?.toLowerCase() || '';

const isWallonia =
  normalizedRegion.includes('walloni') ||
  normalizedRegion.includes('wallon') ||
  normalizedRegion.includes('wallonië');

const grantsHref = isWallonia
  ? '/grants/wallonia'
  : '/grants/flanders';

  const heroImage =
    city.hero_image ||
    '/images/areas-city-hero.jpg';

  const heroTitle =
    city.hero_title ||
    tCity('title', {
      city: city.name,
    });

  return (
    <main className="min-h-screen bg-white w-full overflow-x-clip">
      <ServiceAlternateLinks alternateSlugs={city.alternate_slugs} />

      <section className="relative w-full min-h-[360px] sm:min-h-[400px] lg:min-h-[440px] flex items-start overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={tCity('image_alt', {
              city: city.name,
            })}
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-[30%_center] md:object-[25%_center]"
          />
        </div>

        <div
          className="absolute inset-0 z-10 max-md:hidden"
          style={{
            background:
              'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.60) 35%, rgba(0,0,0,0.30) 65%, transparent 100%)',
          }}
        />

        <div className="absolute inset-0 z-10 bg-black/60 md:hidden" />

        <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 page-header-start pb-10 sm:pb-14 flex flex-col">

          <div className="text-white/80 [&_a]:text-white/80 [&_a:hover]:text-white [&_span]:text-white text-xs sm:text-sm">
            <Breadcrumbs
              items={breadcrumbs}
            />
          </div>

          <div className="max-w-2xl lg:max-w-3xl flex flex-col items-start max-md:items-center gap-3 sm:gap-4 text-white">

            <span className="text-xs sm:text-sm font-extrabold tracking-wider text-red-400 uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
              {tCity('badge', {
                city:
                  city.name.toUpperCase(),

                province:
                  city.province
                    ? `• ${city.province.toUpperCase()}`
                    : '',
              })}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] text-white tracking-tight max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
              {heroTitle}
            </h1>

            {city.hero_intro ? (
              <div
                className="
                  text-sm
                  sm:text-base
                  md:text-lg
                  text-gray-200
                  font-normal
                  leading-relaxed
                  max-w-2xl

                  [&_p]:mb-3
                  [&_p:last-child]:mb-0

                  [&_strong]:text-white
                  [&_strong]:font-bold

                  [&_a]:text-white
                  [&_a]:font-semibold
                  [&_a]:underline
                  [&_a]:underline-offset-4
                "
                dangerouslySetInnerHTML={{
                  __html:
                    city.hero_intro,
                }}
              />
            ) : (
              <p className="max-md:text-center text-sm sm:text-base md:text-lg text-gray-200 font-normal leading-relaxed max-w-2xl">
                {tCity.rich(
                  'intro',
                  {
                    city: city.name,

                    bold: (
                      chunks,
                    ) => (
                      <strong className="text-white font-bold">
                        {chunks}
                      </strong>
                    ),
                  },
                )}
              </p>
            )}
          </div>
        </div>
      </section>
      <CityServicesSection
  services={services}
  eyebrow={tCity('services.eyebrow')}
  title={tCity('services.title', {
    city: city.name,
  })}
  description={tCity('services.description', {
    city: city.name,
  })}
/>

      {(
        city.local_title ||
        city.local_content
      ) && (
        <section className="w-full bg-white pt-8 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="max-w-3xl">

              {city.local_title && (
                <h2 className=" mt-10 md:mt-14 lg:mt-20 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black tracking-tight leading-tight max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
                  {city.local_title}
                </h2>
              )}

              {city.local_content && (
                <div
                  className={`${RICH_TEXT_CLASSES} mt-6`}
                  dangerouslySetInnerHTML={{
                    __html:
                      city.local_content,
                  }}
                />
              )}
            </div>

          </div>
        </section>
      )}

     <CitySolutionsSection
  services={services}
  intro={city.solution_intro}
  eyebrow={tCity('solutions.eyebrow')}
  title={tCity('solutions.title')}
  cavityDescription={tCity('solutions.cavity.description')}
  facadeDescription={tCity('solutions.facade.description')}
  roofDescription={tCity('solutions.roof.description')}
  linkLabel={tCity('solutions.link_label')}
/>

<CityProjectsSection
  projects={city.projects || []}
  eyebrow={tCity('projects.eyebrow')}
  title={tCity('projects.title', {
    city: city.name,
  })}
  description={tCity('projects.description', {
    city: city.name,
  })}
/>

<CityGrantsSection
  href={grantsHref}
  eyebrow={tCity('grants.eyebrow')}
  title={tCity(
    isWallonia
      ? 'grants.wallonia.title'
      : 'grants.flanders.title',
    {
      city: city.name,
    }
  )}
  description={tCity(
    isWallonia
      ? 'grants.wallonia.description'
      : 'grants.flanders.description',
    {
      city: city.name,
    }
  )}
  buttonLabel={tCity(
    isWallonia
      ? 'grants.wallonia.button'
      : 'grants.flanders.button'
  )}
/>

<CityProcessSection
  eyebrow={tCity('process.eyebrow')}
  title={tCity('process.title')}
  description={tCity('process.description')}
  steps={[
    {
      number: '01',
      title: tCity('process.steps.request.title'),
      description: tCity('process.steps.request.description'),
    },
    {
      number: '02',
      title: tCity('process.steps.analysis.title'),
      description: tCity('process.steps.analysis.description'),
    },
    {
      number: '03',
      title: tCity('process.steps.quote.title'),
      description: tCity('process.steps.quote.description'),
    },
    {
      number: '04',
      title: tCity('process.steps.execution.title'),
      description: tCity('process.steps.execution.description'),
    },
    {
      number: '05',
      title: tCity('process.steps.completion.title'),
      description: tCity('process.steps.completion.description'),
    },
  ]}
/>


<CityNearbyAreasSection
  cities={city.nearby_cities || []}
  eyebrow={tCity('nearby.eyebrow')}
  title={tCity('nearby.title', {
    city: city.name,
  })}
  description={tCity('nearby.description', {
    city: city.name,
  })}
/>

      {city.local_faqs &&
        city.local_faqs.length >
          0 && (
          <section className="w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

              <div className="text-center mb-10 sm:mb-14">

                <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black tracking-tight leading-tight max-md:text-balance max-md:[overflow-wrap:anywhere]">
                  {locale === 'fr'
                    ? `Questions fréquentes sur nos travaux à ${city.name}`
                    : locale === 'en'
                      ? `Frequently asked questions about our work in ${city.name}`
                      : `Veelgestelde vragen over onze werken in ${city.name}`}
                </h2>

              </div>

              <div className="flex flex-col gap-3 sm:gap-4">

                {city.local_faqs.map(
                  (
                    faq,
                    index,
                  ) => (
                    <details
                      key={index}
                      className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                    >

                      <summary className="cursor-pointer list-none px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">

                        <span className="font-semibold text-black text-sm sm:text-lg leading-snug">
                          {
                            faq.question
                          }
                        </span>

                        <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border border-slate-200 text-slate-500 bg-white transition-all duration-200 group-open:bg-[#C82024] group-open:border-[#C82024] group-open:text-white group-open:rotate-180">

                          <svg
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={
                                2.5
                              }
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>

                        </span>

                      </summary>

                      <div className="px-5 sm:px-8 pb-5 sm:pb-7 pt-4 border-t border-slate-100">

                        <div
                          className={
                            RICH_TEXT_CLASSES
                          }
                          dangerouslySetInnerHTML={{
                            __html:
                              faq.answer,
                          }}
                        />

                      </div>

                    </details>
                  ),
                )}

              </div>

            </div>
          </section>
        )}
        <CtaBanner/>

    </main>
  );
}