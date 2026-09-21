'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
}

export default function Pagination({ currentPage, lastPage }: PaginationProps) {
  const t = useTranslations('ProjectsPage');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (lastPage <= 1) return null;

  const goToPage = (page: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', page.toString());
    // @ts-expect-error next-intl dynamic route query params
    router.push(`${pathname}?${current.toString()}`);
  };

  return (
    <div className="max-md:flex-col max-md:text-center flex justify-center items-center gap-3 mt-12">
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="max-md:min-h-11 max-md:w-full px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        &larr; {t('prev')}
      </button>

      <span className="px-3 py-2 text-sm font-medium text-slate-600">
        {t('page', { current: currentPage, total: lastPage })}
      </span>

      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= lastPage}
        className="max-md:min-h-11 max-md:w-full px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        {t('next')} &rarr;
      </button>
    </div>
  );
}