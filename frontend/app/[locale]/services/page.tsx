import { getTranslations } from 'next-intl/server';
import { getServices } from '@/lib/services';
import ServiceCard from '@/components/ui/ServiceCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  
  const t = await getTranslations({ locale, namespace: 'Seo.services' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;

  const [t, tBreadcrumb, services] = await Promise.all([
    getTranslations({ locale, namespace: 'ServicesPage' }),
    getTranslations({ locale, namespace: 'Breadcrumbs' }),
    getServices(locale).catch((err) => {
      console.error('Fout bij ophalen services op services-pagina:', err);
      return [];
    }),
  ]);

  const breadcrumbs = [
    { label: tBreadcrumb('home'), href: '/' },
    { label: tBreadcrumb('services') },
  ];

  return (
    <main className="min-h-screen bg-white pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="max-w-4xl mb-10 flex flex-col gap-4">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase ">
            {t('eyebrow')}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            {t('description')}
          </p>
        </div>

        {!services || services.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 font-medium">Geen diensten gevonden.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                href={`/services/${service.slug}`}
                imageSrc={service.thumbnail || '/images/services/placeholder.png'}
                imageAlt={service.name}
                badge={service.badge}
                title={service.name}
                description={service.short_description || undefined}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}