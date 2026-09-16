import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getCityBySlug } from '@/lib/cities';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const [t, city] = await Promise.all([
    getTranslations({ locale, namespace: 'CityDetail' }),
    getCityBySlug(slug),
  ]);

  if (!city) return {};

  return {
    title: t('meta_title', { city: city.name }),
    description: t('meta_description', { city: city.name }),
  };
}

export default async function CityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const [tBreadcrumb, tCity, city] = await Promise.all([
    getTranslations({ locale, namespace: 'Breadcrumbs' }),
    getTranslations({ locale, namespace: 'CityDetail' }),
    getCityBySlug(slug),
  ]);

  if (!city) {
    notFound();
  }

  const breadcrumbs = [
    { label: tBreadcrumb('home'), href: '/' },
    { label: tBreadcrumb('areas'), href: '/areas' },
    { label: city.name },
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FA] w-full overflow-x-clip">
      <section className="relative w-full min-h-[360px] sm:min-h-[400px] lg:min-h-[440px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/areas-city-hero.jpg"
            alt={tCity('image_alt', { city: city.name })}
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-[30%_center] md:object-[25%_center]"
          />
        </div>

        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.60) 35%, rgba(0,0,0,0.30) 65%, transparent 100%)',
          }}
        />

        <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col justify-center">
          <div className="mb-4 sm:mb-6 text-white/80 [&_a]:text-white/80 [&_a:hover]:text-white [&_span]:text-white text-xs sm:text-sm">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <div className="max-w-2xl lg:max-w-3xl flex flex-col items-start gap-3 sm:gap-4 text-white">
            <span className="text-xs sm:text-sm font-extrabold tracking-wider text-red-400 uppercase">
              {tCity('badge', {
                city: city.name.toUpperCase(),
                province: city.province ? `• ${city.province.toUpperCase()}` : '',
              })}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] text-white tracking-tight">
              {tCity('title', { city: city.name })}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-200 font-normal leading-relaxed max-w-2xl">
              {tCity.rich('intro', {
                city: city.name,
                bold: (chunks) => <strong className="text-white font-bold">{chunks}</strong>,
              })}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}