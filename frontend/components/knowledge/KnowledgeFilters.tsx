'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';

import { KnowledgeCategory } from '@/types/knowledge';

interface KnowledgeFiltersProps {
  categories: KnowledgeCategory[];
  totalResults: number;
}

export default function KnowledgeFilters({
  categories,
  totalResults,
}: KnowledgeFiltersProps) {
  const t = useTranslations('KnowledgePage');
  const locale = useLocale();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryParam =
    locale === 'nl'
      ? 'categorie'
      : locale === 'fr'
        ? 'categorie'
        : 'category';

  const selectedCategory =
    searchParams.get(categoryParam) || '';

  const updateCategory = (slug: string) => {
    const current = new URLSearchParams(
      Array.from(searchParams.entries()),
    );

    if (
      !slug ||
      current.get(categoryParam) === slug
    ) {
      current.delete(categoryParam);
    } else {
      current.set(categoryParam, slug);
    }

    current.delete('page');

    const search = current.toString();
    const query = search ? `?${search}` : '';

    // @ts-expect-error next-intl dynamic query
    router.push(`${pathname}${query}`);
  };

  const clearFilters = () => {
    // @ts-expect-error next-intl dynamic route
    router.push(pathname);
  };

  return (
    <aside className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-28">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="font-bold text-slate-900 text-base">
            {t('filtersTitle')}
          </h2>

          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t('articlesCount', {
              count: totalResults,
            })}
          </p>
        </div>

        {selectedCategory && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-slate-500 hover:text-[#C82024] underline transition cursor-pointer"
          >
            {t('reset')}
          </button>
        )}
      </div>

      <div className="pt-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          {t('categoryLabel')}
        </h3>

        <div className="flex flex-col gap-2.5">
          {categories.map((category) => {
            const isChecked =
              selectedCategory === category.slug;

            return (
              <label
                key={category.id}
                className="flex items-center gap-3 text-sm text-slate-700 hover:text-slate-950 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() =>
                    updateCategory(category.slug)
                  }
                  className="w-4 h-4 rounded border-slate-300 accent-[#C82024] cursor-pointer"
                />

                <div className="flex items-center justify-between flex-1 min-w-0 gap-3">
                  <span
                    className={
                      isChecked
                        ? 'font-semibold text-slate-950'
                        : 'font-normal'
                    }
                  >
                    {category.name}
                  </span>

                  <span className="text-xs text-slate-400 shrink-0">
                    {category.count}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}