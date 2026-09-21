import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import Breadcrumbs from '@/components/ui/Breadcrumbs';
import MaterialHero from '@/components/materials/MaterialHero';
import MaterialContent from '@/components/materials/MaterialContent';
import MaterialServices from '@/components/materials/MaterialServices';
import MaterialAlternateLinks from '@/components/materials/MaterialAlternateLinks';
import CtaBanner from '@/components/common/CtaBanner';

import { getMaterial } from '@/lib/materials';

interface MaterialPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: MaterialPageProps) {
  const { locale, slug } = await params;

  const material = await getMaterial(
    slug,
    locale,
  );

  if (!material) {
    return {};
  }

  return {
    title:
      material.seo.title ||
      `${material.name} | Nu-Isoleren`,

    description:
      material.seo.description ||
      material.short_description ||
      undefined,
  };
}

export default async function MaterialPage({
  params,
}: MaterialPageProps) {
  const { locale, slug } = await params;

  const material = await getMaterial(
    slug,
    locale,
  );

  if (!material) {
    notFound();
  }

  const tBreadcrumb = await getTranslations({
    locale,
    namespace: 'Breadcrumbs',
  });

  const breadcrumbs = [
    {
      label: tBreadcrumb('home'),
      href: '/',
    },
    {
      label: material.name,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <MaterialAlternateLinks
        alternateSlugs={material.alternate_slugs}
      />

      <section className="page-header-start">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
           <div>
                    <Breadcrumbs items={breadcrumbs} />
                  </div>

          <MaterialHero
            material={material}
          />

          <MaterialContent
            material={material}
          />
        </div>
      </section>

      <MaterialServices
        material={material}
        locale={locale}
      />

      <CtaBanner buttonHref="/quote" />
    </main>
  );
}