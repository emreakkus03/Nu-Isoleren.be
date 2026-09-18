import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface BrusselsGrantsHeroProps {
  locale: string;
}

export default async function BrusselsGrantsHero({
  locale,
}: BrusselsGrantsHeroProps) {
  const t = await getTranslations({
    locale,
    namespace: 'BrusselsGrantsPage.hero',
  });

  const breadcrumbs = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: t('parentBreadcrumb'),
      href: '/grants',
    },
    {
      label: t('breadcrumb'),
    },
  ];

  return (
    <section className="w-full bg-white pt-10 sm:pt-14 lg:pt-16 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="max-w-xl">
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
              {t('badge')}
            </span>

            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.08]">
              {t('title')}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
              {t('description')}
            </p>

            <p className="mt-6 text-sm font-semibold text-gray-500">
              {t('updated')}
            </p>
          </div>

          <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[470px] overflow-hidden rounded-2xl">
            <Image
              src="/images/grants/brussels/brussels-renovation.jpg"
              alt={t('imageAlt')}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}