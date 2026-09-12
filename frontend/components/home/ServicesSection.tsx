import { getLocale, getTranslations } from 'next-intl/server';
import { getServices } from '@/lib/services';
import ServiceCard from '@/components/ui/ServiceCard';

export default async function ServicesSection() {
  const locale = await getLocale();
  const t = await getTranslations('ServicesSection');

  const services = await getServices(locale, { featuredHome: true });

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 flex flex-col gap-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              href={`/diensten/${service.slug}`}
              imageSrc={service.thumbnail || '/logo/logo.svg'}
              imageAlt={service.name}
              badge={service.badge}
              title={service.name}
              description={service.short_description || ''}
            />
          ))}
        </div>
      </div>
    </section>
  );
}