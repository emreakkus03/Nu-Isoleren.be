import { paginationOptions, validatePage, type PageSearch } from '@/lib/seo/pagination';
import { pageMetadata } from '@/lib/seo/metadata';
import { getTranslations } from 'next-intl/server';

import Breadcrumbs from '@/components/ui/Breadcrumbs';
import KnowledgeFilters from '@/components/knowledge/KnowledgeFilters';
import KnowledgeCard from '@/components/knowledge/KnowledgeCard';
import KnowledgePagination from '@/components/knowledge/KnowledgePagination';

import {
  getKnowledgeArticles,
  getKnowledgeCategories,
} from '@/lib/knowledge';


export async function generateMetadata({
  params, searchParams,
}: {
  params: Promise<{ locale: string }>; searchParams: Promise<PageSearch>;
}) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'Seo.knowledge',
  });

  const search = await searchParams;
  const options = paginationOptions(search);
  const category = typeof search.categorie === 'string' ? search.categorie : typeof search.category === 'string' ? search.category : undefined;
  const result = await getKnowledgeArticles(locale, { category, page: options.page, perPage: 9 });
  validatePage(search, result.meta.last_page, '/knowledge', locale);

  return pageMetadata('/knowledge', locale, {
    title: t('title'),
    description: t('description'),
  }, options);
}

interface KnowledgePageProps {
  params: Promise<{
    locale: string;
  }>;

  searchParams: Promise<
    Record<string, string | string[] | undefined>
  >;
}

export default async function KnowledgePage({
  params,
  searchParams,
}: KnowledgePageProps) {
  const { locale } = await params;
  const resolvedSearchParams = (await searchParams) || {};

  const t = await getTranslations({
    locale,
    namespace: 'KnowledgePage',
  });

  const tBreadcrumb = await getTranslations({
    locale,
    namespace: 'Breadcrumbs',
  });

  const category =
    typeof resolvedSearchParams.categorie === 'string'
      ? resolvedSearchParams.categorie
      : typeof resolvedSearchParams.category === 'string'
        ? resolvedSearchParams.category
        : undefined;

  const { page } = paginationOptions(resolvedSearchParams);

  const [articlesData, categories] = await Promise.all([
    getKnowledgeArticles(locale, {
      category,
      page,
      perPage: 9,
    }),

    getKnowledgeCategories(locale),
  ]);

  const articles = articlesData?.data ?? [];

  const meta = articlesData?.meta ?? {
    current_page: 1,
    last_page: 1,
    per_page: 9,
    total: 0,
  };

  validatePage(resolvedSearchParams, meta.last_page, '/knowledge', locale);

  const breadcrumbs = [
    {
      label: tBreadcrumb('home'),
      href: '/',
    },
    {
      label: tBreadcrumb('knowledge'),
    },
  ];

  return (
    <main className="min-h-screen bg-white page-header-start pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div>
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="max-w-2xl lg:max-w-3xl flex flex-col items-center md:items-start gap-4 text-white text-center md:text-left mb-16 max-md:mb-10">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('hero.badge')}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-md:text-balance max-md:[overflow-wrap:anywhere]">
            {t('hero.title')}
          </h1>

          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            {t('hero.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <KnowledgeFilters
              categories={categories}
              totalResults={meta.total}
            />
          </aside>

          <section className="lg:col-span-3">
            {articles.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <p className="text-slate-500 font-medium">
                  {t('empty.description')}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <KnowledgeCard
                      key={article.id}
                      article={article}
                    />
                  ))}
                </div>

                <KnowledgePagination
                  currentPage={meta.current_page}
                  lastPage={meta.last_page}
                />
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}