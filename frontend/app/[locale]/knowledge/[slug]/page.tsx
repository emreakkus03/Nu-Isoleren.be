import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import Breadcrumbs from '@/components/ui/Breadcrumbs';
import KnowledgeArticleHero from '@/components/knowledge/detail/KnowledgeArticleHero';
import KnowledgeArticleContent from '@/components/knowledge/detail/KnowledgeArticleContent';
import RelatedKnowledgeArticles from '@/components/knowledge/detail/RelatedKnowledgeArticles';
import KnowledgeArticleAlternateLinks from '@/components/knowledge/detail/KnowledgeArticleAlternateLinks';
import CtaBanner from '@/components/common/CtaBanner';

import { getKnowledgeArticleBySlug } from '@/lib/knowledge';

interface KnowledgeArticlePageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: KnowledgeArticlePageProps) {
  const { locale, slug } = await params;

  const result = await getKnowledgeArticleBySlug(
    slug,
    locale,
  );

  if (!result) {
    return {};
  }

  const article = result.data;

  return {
    title:
      article.seo_title ||
      `${article.title} | Nu-Isoleren`,

    description:
      article.seo_description ||
      article.excerpt ||
      undefined,
  };
}

export default async function KnowledgeArticlePage({
  params,
}: KnowledgeArticlePageProps) {
  const { locale, slug } = await params;

  const result = await getKnowledgeArticleBySlug(
    slug,
    locale,
  );

  if (!result) {
    notFound();
  }

  const { data: article, related_articles } = result;

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
      label: tBreadcrumb('knowledge'),
      href: '/knowledge',
    },
    {
      label: article.title,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
        <KnowledgeArticleAlternateLinks
      alternateSlugs={article.alternate_slugs}
    />

      <section className="pt-8 md:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 md:mb-10">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <KnowledgeArticleHero
            article={article}
            locale={locale}
          />

          <KnowledgeArticleContent
            article={article}
          />
        </div>
      </section>

      <RelatedKnowledgeArticles
        articles={related_articles}
        locale={locale}
      />
      <CtaBanner buttonHref="/quote" />
    </main>
  );
}