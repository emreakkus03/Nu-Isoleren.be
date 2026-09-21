import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';
import { KnowledgeArticleCard as KnowledgeArticle } from '@/types/knowledge';

interface KnowledgeCardProps {
  article: KnowledgeArticle;
}

export default function KnowledgeCard({
  article,
}: KnowledgeCardProps) {
  const t = useTranslations('KnowledgePage');

  return (
    <article className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/60">
      <Link
        href={{
          pathname: '/knowledge/[slug]',
          params: {
            slug: article.slug,
          },
        }}
        className="relative block aspect-[16/10] bg-gray-100 overflow-hidden"
      >
        {article.hero_image ? (
          <Image
            src={article.hero_image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#F8F9FA]">
            <span className="text-sm font-semibold text-gray-400">
              Nu-Isoleren
            </span>
          </div>
        )}

     
      </Link>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <h2 className="max-md:[overflow-wrap:anywhere] text-lg sm:text-xl font-extrabold text-gray-950 tracking-tight leading-snug">
          <Link
            href={{
              pathname: '/knowledge/[slug]',
              params: {
                slug: article.slug,
              },
            }}
            className="transition hover:text-[#1A669A]"
          >
            {article.title}
          </Link>
        </h2>

        {article.excerpt && (
          <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        )}

        <div className="mt-auto pt-5">
          <Link
            href={{
              pathname: '/knowledge/[slug]',
              params: {
                slug: article.slug,
              },
            }}
            className="inline-flex max-md:min-h-11 items-center gap-2 text-sm font-bold text-[#C82024] group/link"
          >
            <span>{t('readArticle')}</span>

            <span className="transition-transform group-hover/link:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}