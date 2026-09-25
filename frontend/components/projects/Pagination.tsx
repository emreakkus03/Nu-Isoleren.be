'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
}

export default function Pagination({ currentPage, lastPage }: PaginationProps) {
  const t = useTranslations('ProjectsPage');
  const searchParams = useSearchParams();

  if (lastPage <= 1) return null;

  const pageHref = (page: number) => {
    const query = Object.fromEntries(searchParams.entries());
    if (page <= 1) delete query.page;
    else query.page = String(page);
    return { pathname: '/projects' as const, query };
  };

  return (
    <div className="max-md:flex-col max-md:text-center flex justify-center items-center gap-3 mt-12">
      <Link
        href={pageHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
        onClick={event => { if (currentPage <= 1) event.preventDefault(); }}
        className="max-md:min-h-11 max-md:w-full px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 aria-disabled:opacity-40 aria-disabled:cursor-not-allowed transition"
      >
        &larr; {t('prev')}
      </Link>

      <span className="px-3 py-2 text-sm font-medium text-slate-600">
        {t('page', { current: currentPage, total: lastPage })}
      </span>

      <Link
        href={pageHref(Math.min(lastPage, currentPage + 1))}
        aria-disabled={currentPage >= lastPage}
        tabIndex={currentPage >= lastPage ? -1 : undefined}
        onClick={event => { if (currentPage >= lastPage) event.preventDefault(); }}
        className="max-md:min-h-11 max-md:w-full px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 aria-disabled:opacity-40 aria-disabled:cursor-not-allowed transition"
      >
        {t('next')} &rarr;
      </Link>
    </div>
  );
}