import { useTranslations } from 'next-intl';
import ServiceCard from '@/components/ui/ServiceCard';

export default function ServicesSection() {
  const t = useTranslations('ServicesSection');

  const services = [
    {
      key: 'cavityWall',
      image: '/images/services/spouwmuurisolatie.png',
      href: '/diensten',
    },
    {
      key: 'roofInsulation',
      image: '/images/services/dakisolatie.jpg',
      href: '/diensten',
    },
    {
      key: 'crepi',
      image: '/images/services/crepi.png',
      href: '/diensten',
    },
    {
      key: 'facadeCleaning',
      image: '/images/services/gevelreiniging.png',
      href: '/diensten',
    },
    {
      key: 'hydrofuge',
      image: '/images/services/hydrofuge.png',
      href: '/diensten',
    },
    {
      key: 'risingDamp',
      image: '/images/services/opstijgend-vocht.png',
      href: '/diensten',
    },
  ];

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
              key={service.key}
              href={service.href}
              imageSrc={service.image}
              imageAlt={t(`items.${service.key}.title`)}
              badge={t(`items.${service.key}.badge`)}
              title={t(`items.${service.key}.title`)}
              description={t(`items.${service.key}.description`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}