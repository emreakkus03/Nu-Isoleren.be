import { getTranslations } from 'next-intl/server';
import AreasHero from '@/components/areas/AreasHero';
import AreaCard from '@/components/areas/AreaCard';
import { getCities } from '@/lib/cities';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Seo.areas' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ServiceAreasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [tBreadcrumb, tAreas, { grouped }] = await Promise.all([
    getTranslations({ locale, namespace: 'Breadcrumbs' }),
    getTranslations({ locale, namespace: 'ServiceAreas' }),
    getCities(),
  ]);

  const breadcrumbs = [
    { label: tBreadcrumb('home'), href: '/' },
    { label: tBreadcrumb('areas') },
  ];

  const provinces = Object.keys(grouped || {});

  return (
    <main className="min-h-screen bg-white w-full overflow-x-clip">
      
      <AreasHero breadcrumbs={breadcrumbs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full min-w-0">
        {provinces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {provinces.map((provName) => (
              <AreaCard
                key={provName}
                provinceName={provName}
                cities={grouped[provName] || []}
                ctaText={tAreas('cta_card', { province: provName })}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500">
            {tAreas('empty_state')}
          </div>
        )}
      </div>

    </main>
  );
}