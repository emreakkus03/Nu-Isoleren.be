'use client';

import { Link } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface KnowledgePaginationProps {
  currentPage: number;
  lastPage: number;
}

export default function KnowledgePagination({
  currentPage,
  lastPage,
}: KnowledgePaginationProps) {
  const t = useTranslations('KnowledgePage');

  const searchParams = useSearchParams();

  if (lastPage <= 1) {
    return null;
  }

  const pageHref = (page: number) => {
    const query = Object.fromEntries(searchParams.entries());
    if (page <= 1) delete query.page;
    else query.page = String(page);
    return { pathname: '/knowledge' as const, query };
  };

  return (
    <div className="max-md:flex-col max-md:text-center flex items-center justify-between gap-4 pt-8 mt-8 border-t border-gray-200">
      <Link
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
        onClick={event => { if (currentPage <= 1) event.preventDefault(); }}
        href={pageHref(Math.max(1, currentPage - 1))}
        className="max-md:min-h-11 max-md:w-full inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 aria-disabled:opacity-40 aria-disabled:cursor-not-allowed cursor-pointer transition"
      >
        ← {t('pagination.previous')}
      </Link>

      <span className="text-sm font-semibold text-gray-500">
        {t('pagination.page', {
          current: currentPage,
          total: lastPage,
        })}
      </span>

      <Link
        aria-disabled={currentPage >= lastPage}
        tabIndex={currentPage >= lastPage ? -1 : undefined}
        onClick={event => { if (currentPage >= lastPage) event.preventDefault(); }}
        href={pageHref(Math.min(lastPage, currentPage + 1))}
        className="max-md:min-h-11 max-md:w-full inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 aria-disabled:opacity-40 aria-disabled:cursor-not-allowed cursor-pointer transition"
      >
        {t('pagination.next')} →
      </Link>
    </div>
  );
}