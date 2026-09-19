import { getTranslations } from 'next-intl/server';

import KnowledgeCard from '@/components/knowledge/KnowledgeCard';
import type { KnowledgeArticleCard } from '@/types/knowledge';

interface RelatedKnowledgeArticlesProps {
  articles: KnowledgeArticleCard[];
  locale: string;
}

export default async function RelatedKnowledgeArticles({
  articles,
  locale,
}: RelatedKnowledgeArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  const t = await getTranslations({
    locale,
    namespace: 'KnowledgeArticlePage.related',
  });

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('badge')}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
            {t('title')}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="
  flex gap-5 overflow-x-auto snap-x snap-mandatory
  pb-4
  sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0
  lg:grid-cols-3
  [scrollbar-width:none]
  [&::-webkit-scrollbar]:hidden
">
  {articles.map((article) => (
    <div
      key={article.id}
      className="
        min-w-[85%] snap-start
        sm:min-w-0
      "
    >
      <KnowledgeCard article={article} />
    </div>
  ))}
</div>
      </div>
    </section>
  );
}