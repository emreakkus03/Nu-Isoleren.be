import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import type { KnowledgeArticleDetail } from '@/types/knowledge';

interface KnowledgeArticleHeroProps {
  article: KnowledgeArticleDetail;
  locale: string;
}

export default async function KnowledgeArticleHero({
  article,
  locale,
}: KnowledgeArticleHeroProps) {
  const t = await getTranslations({
    locale,
    namespace: 'KnowledgeArticlePage',
  });

  const dateLocale =
    locale === 'fr'
      ? 'fr-BE'
      : locale === 'en'
        ? 'en-BE'
        : 'nl-BE';

  const updatedDate = article.updated_at
    ? new Intl.DateTimeFormat(dateLocale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(article.updated_at))
    : null;

  return (
    <>
      <div className="page-header-content max-w-4xl max-md:text-center">
        {article.category && (
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
            {article.category.name}
          </span>
        )}

        <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.1] max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-5 text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl">
            {article.excerpt}
          </p>
        )}

        {updatedDate && (
          <p className="mt-5 text-sm font-medium text-gray-400">
            {t('updated')} {updatedDate}
          </p>
        )}
      </div>

      {article.hero_image && (
        <div className="relative w-full aspect-[16/10] md:aspect-[16/7] mt-10 md:mt-12 rounded-2xl md:rounded-3xl overflow-hidden bg-gray-100">
          <Image
            src={article.hero_image}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
        </div>
      )}
    </>
  );
}