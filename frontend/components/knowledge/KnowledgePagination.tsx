'use client';

import { usePathname, useRouter } from '@/i18n/routing';
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

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (lastPage <= 1) {
    return null;
  }

  const goToPage = (page: number) => {
    const current = new URLSearchParams(
      Array.from(searchParams.entries()),
    );

    if (page <= 1) {
      current.delete('page');
    } else {
      current.set('page', String(page));
    }

    const search = current.toString();

    router.push(
      `${pathname}${search ? `?${search}` : ''}` as Parameters<
        typeof router.push
      >[0],
    );
  };

  return (
    <div className="max-md:flex-col max-md:text-center flex items-center justify-between gap-4 pt-8 mt-8 border-t border-gray-200">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() =>
          goToPage(currentPage - 1)
        }
        className="max-md:min-h-11 max-md:w-full inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
      >
        ← {t('pagination.previous')}
      </button>

      <span className="text-sm font-semibold text-gray-500">
        {t('pagination.page', {
          current: currentPage,
          total: lastPage,
        })}
      </span>

      <button
        type="button"
        disabled={currentPage >= lastPage}
        onClick={() =>
          goToPage(currentPage + 1)
        }
        className="max-md:min-h-11 max-md:w-full inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
      >
        {t('pagination.next')} →
      </button>
    </div>
  );
}