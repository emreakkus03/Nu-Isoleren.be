import { getTranslations } from 'next-intl/server';

import ServiceCard from '@/components/ui/ServiceCard';
import type { Material } from '@/types/material';

interface MaterialServicesProps {
  material: Material;
  locale: string;
}

export default async function MaterialServices({
  material,
  locale,
}: MaterialServicesProps) {
  if (
    !material.services ||
    material.services.length === 0
  ) {
    return null;
  }

  const t = await getTranslations({
    locale,
    namespace: 'MaterialPage.services',
  });

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
            {t('badge')}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
            {t('title')}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed max-md:text-center">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {material.services.map((service) => (
            <ServiceCard
              key={service.id}
              href={
                locale === 'nl'
                  ? `/diensten/${service.slug}`
                  : `/services/${service.slug}`
              }
              imageSrc={
                service.thumbnail ||
                '/logo/logo.svg'
              }
              imageAlt={service.name}
              badge={service.badge ?? undefined}
              title={service.name}
              description={
                service.short_description || ''
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}